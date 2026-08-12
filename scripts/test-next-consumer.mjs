import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  mkdtemp,
  readFile,
  rm,
  writeFile,
  mkdir,
  readdir,
} from 'node:fs/promises'
import {
  basename,
  dirname,
  join,
  normalize,
  relative,
  resolve,
  sep,
} from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const commandEnvironment = {
  ...process.env,
  CI: 'true',
  NEXT_TELEMETRY_DISABLED: '1',
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: 'utf8',
    env: { ...commandEnvironment, ...options.env },
    stdio: options.capture ? 'pipe' : 'inherit',
  })

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n')
    throw new Error(
      `Command failed (${result.status}): ${command} ${args.join(' ')}${output ? `\n${output}` : ''}`,
    )
  }

  return result.stdout ?? ''
}

async function findTarball(directory, packageSlug) {
  const files = await readdir(directory)
  const matches = files.filter(
    (file) => file.startsWith(packageSlug) && file.endsWith('.tgz'),
  )
  assert.equal(
    matches.length,
    1,
    `Expected one ${packageSlug} tarball, found: ${matches.join(', ')}`,
  )
  return join(directory, matches[0])
}

async function extractTarball(tarball, destination) {
  await mkdir(destination, { recursive: true })
  run('tar', ['-xzf', tarball, '-C', destination])
  return join(destination, 'package')
}

function localCssUrls(css) {
  const urls = []
  const pattern = /url\(\s*(['"]?)(.*?)\1\s*\)/gu

  for (const match of css.matchAll(pattern)) {
    const value = match[2].trim()
    if (
      value === '' ||
      value.startsWith('data:') ||
      value.startsWith('#') ||
      /^[a-z][a-z\d+.-]*:/iu.test(value) ||
      value.startsWith('//')
    ) {
      continue
    }
    urls.push(value.split(/[?#]/u, 1)[0])
  }

  return [...new Set(urls)].sort()
}

async function assertStylesAssets(stylesRoot) {
  const manifest = JSON.parse(
    await readFile(join(stylesRoot, 'package.json'), 'utf8'),
  )
  const stylesheet = join(stylesRoot, 'dist', 'styles.css')
  const css = await readFile(stylesheet, 'utf8')
  const urls = localCssUrls(css)
  const missing = []

  assert.equal(
    manifest.exports?.['.'],
    './dist/styles.css',
    'Packed styles manifest does not expose its public stylesheet entry',
  )

  for (const url of urls) {
    const asset = normalize(resolve(dirname(stylesheet), url))
    const packageRelativePath = relative(stylesRoot, asset)
    assert.ok(
      packageRelativePath !== '..' &&
        !packageRelativePath.startsWith(`..${sep}`),
      `Stylesheet URL escapes the package root: ${url}`,
    )

    try {
      await readFile(asset)
    } catch {
      missing.push(packageRelativePath)
    }
  }

  assert.deepEqual(
    missing,
    [],
    `Packed stylesheet assets are missing:\n${missing.join('\n')}`,
  )
  console.log(
    `[next-consumer] Verified ${urls.length} packed stylesheet asset reference(s)`,
  )
}

async function assertReactPackage(reactRoot) {
  const manifest = JSON.parse(
    await readFile(join(reactRoot, 'package.json'), 'utf8'),
  )
  const runtime = await readFile(join(reactRoot, 'dist', 'index.js'), 'utf8')
  const dependencyValues = Object.values(manifest.dependencies ?? {})

  assert.ok(
    dependencyValues.every((value) => !value.startsWith('workspace:')),
    'Packed React manifest contains a workspace protocol dependency',
  )
  console.log(
    `[next-consumer] Packed React styles dependency: ${manifest.dependencies['@pathableai/styles']}`,
  )
  assert.match(
    runtime,
    /(?:import\s+['"]@pathableai\/styles['"]|from\s+['"]@pathableai\/styles['"])/u,
    'Packed React runtime does not retain the automatic public styles import',
  )
  assert.match(
    runtime,
    /from\s+['"]react\/jsx-runtime['"]/u,
    'Packed React runtime does not import the consumer JSX runtime',
  )

  for (const embeddedRuntimeMarker of [
    'ReactCurrentOwner',
    'react-jsx-runtime.production',
    'react-jsx-runtime.development',
  ]) {
    assert.ok(
      !runtime.includes(embeddedRuntimeMarker),
      `Packed React runtime embeds React marker: ${embeddedRuntimeMarker}`,
    )
  }
}

async function writeFixture(fixtureRoot, stylesTarball, reactTarball) {
  await mkdir(join(fixtureRoot, 'app'), { recursive: true })
  await writeFile(
    join(fixtureRoot, 'package.json'),
    `${JSON.stringify(
      {
        private: true,
        scripts: { build: 'next build', start: 'next start' },
        dependencies: {
          '@pathableai/react': `file:${reactTarball}`,
          '@pathableai/styles': `file:${stylesTarball}`,
          next: '15.5.22',
          react: '18.3.1',
          'react-dom': '18.3.1',
        },
      },
      null,
      2,
    )}\n`,
  )
  await writeFile(
    join(fixtureRoot, 'pnpm-workspace.yaml'),
    `packages: []
overrides:
  '@pathableai/styles': 'file:${stylesTarball}'
  '@uswds/uswds': 'file:${join(
    repoRoot,
    'packages/styles/node_modules/@uswds/uswds',
  )}'
allowBuilds:
  '@swc/core': true
  sharp: true
`,
  )
  await writeFile(
    join(fixtureRoot, 'app', 'layout.js'),
    `export const metadata = { title: 'PathAble package smoke' }

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
`,
  )
  await writeFile(
    join(fixtureRoot, 'app', 'page.js'),
    `import { Card, Link, List, Loading, Tag } from '@pathableai/react'

export default function Page() {
  return (
    <main>
      <h1>PathAble consumer smoke</h1>
      <Card title="Consumer card">Server-rendered card content</Card>
      <Link href="/details">Consumer link</Link>
      <List items={['Consumer list item one', 'Consumer list item two']} />
      <Tag>Consumer tag</Tag>
      <Loading text="Consumer loading state" />
    </main>
  )
}
`,
  )
}

async function assertConsumer(fixtureRoot) {
  const installArguments = [
    'install',
    '--store-dir',
    join(repoRoot, '.pnpm-store'),
  ]

  try {
    run('pnpm', [...installArguments, '--offline'], {
      cwd: fixtureRoot,
      capture: true,
    })
    console.log('[next-consumer] Installed fixture from the local pnpm store')
  } catch (offlineError) {
    console.warn(
      `[next-consumer] Offline fixture install needs an uncached transitive package; retrying with prefer-offline\n${offlineError.message}`,
    )
    run('pnpm', [...installArguments, '--prefer-offline'], {
      cwd: fixtureRoot,
    })
  }
  run('pnpm', ['build'], { cwd: fixtureRoot })

  const html = await readFile(
    join(fixtureRoot, '.next', 'server', 'app', 'index.html'),
    'utf8',
  )

  for (const content of [
    'Server-rendered card content',
    'Consumer link',
    'Consumer list item one',
    'Consumer tag',
    'Consumer loading state',
  ]) {
    assert.ok(html.includes(content), `Rendered page is missing: ${content}`)
  }

  for (const runtimeError of [
    'ReactCurrentOwner',
    'A React Element from an older version of React was rendered',
  ]) {
    assert.ok(
      !html.includes(runtimeError),
      `Consumer emitted a React runtime error: ${runtimeError}`,
    )
  }
}

async function main() {
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'pathable-next-consumer-'))
  console.log(`[next-consumer] Temporary workspace: ${basename(temporaryRoot)}`)

  try {
    run('pnpm', ['--filter', '@pathableai/styles', 'build'])
    run('pnpm', ['--filter', '@pathableai/react', 'build'])
    run(
      'pnpm',
      [
        '--filter',
        '@pathableai/styles',
        'pack',
        '--pack-destination',
        temporaryRoot,
      ],
      { capture: true },
    )
    run(
      'pnpm',
      [
        '--filter',
        '@pathableai/react',
        'pack',
        '--pack-destination',
        temporaryRoot,
      ],
      { capture: true },
    )

    const stylesTarball = await findTarball(temporaryRoot, 'pathableai-styles-')
    const reactTarball = await findTarball(temporaryRoot, 'pathableai-react-')
    const stylesRoot = await extractTarball(
      stylesTarball,
      join(temporaryRoot, 'styles-extracted'),
    )
    const reactRoot = await extractTarball(
      reactTarball,
      join(temporaryRoot, 'react-extracted'),
    )

    await assertReactPackage(reactRoot)
    await assertStylesAssets(stylesRoot)

    const fixtureRoot = join(temporaryRoot, 'consumer')
    await writeFixture(fixtureRoot, stylesTarball, reactTarball)
    await assertConsumer(fixtureRoot)

    console.log(
      '[next-consumer] Packed package and Next.js smoke checks passed',
    )
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true })
  }
}

await main()

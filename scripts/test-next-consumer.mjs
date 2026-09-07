import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import {
  copyFile,
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
  extname,
  join,
  normalize,
  relative,
  resolve,
  sep,
} from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { createServer } from 'node:net'
import { gunzipSync } from 'node:zlib'
import { chromium } from 'playwright'
import { validateAgentGuidance } from './check-agent-guidance.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const commandEnvironment = {
  ...process.env,
  CI: 'true',
  NEXT_TELEMETRY_DISABLED: '1',
}

const javaScriptEntrypoints = new Set(['.js', '.cjs', '.mjs'])
const consumerFixture = process.env.NEXT_CONSUMER_FIXTURE ?? 'next15-react18'
assert.match(
  consumerFixture,
  /^[a-z\d-]+$/u,
  'NEXT_CONSUMER_FIXTURE must be a fixture directory name',
)
let activeConsumerServer
let activeTemporaryRoot
let terminating = false

async function handleTermination(signal) {
  if (terminating) return
  terminating = true
  try {
    if (activeConsumerServer) await stopProcess(activeConsumerServer)
    if (activeTemporaryRoot) {
      await rm(activeTemporaryRoot, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      })
    }
  } finally {
    process.removeAllListeners(signal)
    process.kill(process.pid, signal)
  }
}

process.once('SIGINT', () => {
  void handleTermination('SIGINT')
})
process.once('SIGTERM', () => {
  void handleTermination('SIGTERM')
})

function run(command, args, options = {}) {
  const pnpmCli = command === 'pnpm' ? process.env.npm_execpath : undefined
  const pnpmCliIsJavaScript =
    pnpmCli !== undefined && javaScriptEntrypoints.has(extname(pnpmCli))
  const executable = pnpmCli
    ? pnpmCliIsJavaScript
      ? process.execPath
      : pnpmCli
    : process.platform === 'win32' && command === 'pnpm'
      ? 'pnpm.cmd'
      : command
  const commandArguments = pnpmCliIsJavaScript ? [pnpmCli, ...args] : args
  const result = spawnSync(executable, commandArguments, {
    cwd: options.cwd ?? repoRoot,
    encoding: 'utf8',
    env: { ...commandEnvironment, ...options.env },
    shell:
      process.platform === 'win32' &&
      command === 'pnpm' &&
      pnpmCli === undefined,
    stdio: options.capture ? 'pipe' : 'inherit',
    timeout: options.timeout ?? 300_000,
    windowsHide: true,
  })

  if (result.error) {
    throw new Error(
      `Failed to start command: ${command} ${args.join(' ')}\n${result.error.message}`,
      { cause: result.error },
    )
  }

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

async function availablePort() {
  const server = createServer()
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolvePromise)
  })
  const address = server.address()
  assert.ok(address && typeof address !== 'string', 'Could not reserve a port')
  await new Promise((resolvePromise, reject) =>
    server.close((error) => (error ? reject(error) : resolvePromise())),
  )
  return address.port
}

async function stopProcess(child) {
  if (child.pid === undefined || processExited(child)) return
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
      windowsHide: true,
    })
    assert.ok(
      await waitForExit(child, 5_000),
      'Next server process tree did not exit after taskkill',
    )
    return
  }
  child.kill()
  if (await waitForExit(child, 5_000)) return
  child.kill('SIGKILL')
  assert.ok(
    await waitForExit(child, 5_000),
    'Next server did not exit after forced termination',
  )
}

function processExited(child) {
  return child.exitCode !== null || child.signalCode !== null
}

async function waitForExit(child, timeout) {
  if (processExited(child)) return true
  return new Promise((resolvePromise) => {
    const onExit = () => {
      clearTimeout(timer)
      resolvePromise(true)
    }
    const timer = setTimeout(() => {
      child.off('exit', onExit)
      resolvePromise(false)
    }, timeout)
    child.once('exit', onExit)
  })
}

async function waitForServer(url, child, output, startError) {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    const launchError = startError()
    if (launchError) {
      throw new Error(`Failed to start Next server\n${launchError.message}`)
    }
    if (processExited(child)) {
      const result = child.signalCode ?? child.exitCode
      throw new Error(
        `Next server exited before becoming ready (${result})\n${output()}`,
      )
    }
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(1_000),
      })
      if (response.ok) return
    } catch {
      // The server has not bound its port yet.
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250))
  }
  throw new Error(`Next server did not become ready\n${output()}`)
}

async function startConsumerServer(fixtureRoot) {
  const nextCli = join(
    fixtureRoot,
    'node_modules',
    'next',
    'dist',
    'bin',
    'next',
  )
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const port = await availablePort()
    const url = `http://127.0.0.1:${port}`
    const child = spawn(
      process.execPath,
      [nextCli, 'start', '--hostname', '127.0.0.1', '--port', String(port)],
      {
        cwd: fixtureRoot,
        env: commandEnvironment,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    )
    activeConsumerServer = child
    let serverOutput = ''
    let childStartError
    child.on('error', (error) => {
      childStartError = error
    })
    child.stdout?.on('data', (chunk) => {
      serverOutput += chunk
    })
    child.stderr?.on('data', (chunk) => {
      serverOutput += chunk
    })

    try {
      await waitForServer(
        url,
        child,
        () => serverOutput,
        () => childStartError,
      )
      return { child, url, output: () => serverOutput }
    } catch (error) {
      await stopProcess(child)
      if (activeConsumerServer === child) activeConsumerServer = undefined
      if (serverOutput.includes('EADDRINUSE') && attempt < 2) continue
      throw error
    }
  }
  throw new Error('Could not start the Next server on an available port')
}

async function extractTarball(tarball, destination) {
  await mkdir(destination, { recursive: true })
  const archive = gunzipSync(await readFile(tarball))
  for (let offset = 0; offset + 512 <= archive.length;) {
    const header = archive.subarray(offset, offset + 512)
    if (header.every((byte) => byte === 0)) break

    const readField = (start, end) =>
      header.subarray(start, end).toString('utf8').split('\0', 1)[0].trim()
    const name = readField(0, 100)
    const prefix = readField(345, 500)
    const archivePath = prefix ? `${prefix}/${name}` : name
    const size = Number.parseInt(readField(124, 136) || '0', 8)
    const type = String.fromCharCode(header[156] || 48)
    assert.ok(
      !archivePath.startsWith('/') && !archivePath.split('/').includes('..'),
      `Unsafe path in package archive: ${archivePath}`,
    )

    const outputPath = join(destination, ...archivePath.split('/'))
    if (type === '5') {
      await mkdir(outputPath, { recursive: true })
    } else if (type === '0') {
      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(
        outputPath,
        archive.subarray(offset + 512, offset + 512 + size),
      )
    }
    offset += 512 + Math.ceil(size / 512) * 512
  }
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
  const componentsCss = await readFile(
    join(stylesRoot, 'dist', 'components.css'),
    'utf8',
  )
  const utilitiesCss = await readFile(
    join(stylesRoot, 'dist', 'utilities.css'),
    'utf8',
  )
  const themeCss = await readFile(
    join(stylesRoot, 'dist', 'theme-default.css'),
    'utf8',
  )
  const stylesheets = [
    ['root', stylesheet, css],
    ['components', join(stylesRoot, 'dist', 'components.css'), componentsCss],
    ['utilities', join(stylesRoot, 'dist', 'utilities.css'), utilitiesCss],
    ['theme', join(stylesRoot, 'dist', 'theme-default.css'), themeCss],
  ]
  const missing = []

  assert.equal(
    manifest.exports?.['.'],
    './dist/styles.css',
    'Packed styles manifest does not expose its public stylesheet entry',
  )
  assert.equal(
    manifest.exports?.['./components'],
    './dist/components.css',
    'Packed styles manifest does not expose its components stylesheet',
  )
  assert.equal(
    manifest.exports?.['./utilities'],
    './dist/utilities.css',
    'Packed styles manifest does not expose its utilities stylesheet',
  )
  assert.equal(
    manifest.exports?.['./theme'],
    './dist/theme-default.css',
    'Packed styles manifest does not expose its theme stylesheet',
  )
  assert.match(
    themeCss,
    /:where\(:root\)\s*\{/u,
    'Packed theme defaults are not emitted at low specificity',
  )
  assert.match(
    componentsCss,
    /\.pathable-dashboard-header(?:\b|[_{,:.-])/u,
    'Packed components stylesheet omits DashboardHeader selectors',
  )
  assert.match(
    utilitiesCss,
    /\.pathable-bg-primary(?:\b|[_{,:.-])/u,
    'Packed utilities stylesheet omits generated utility selectors',
  )
  const defaultTokens = new Set(
    [...themeCss.matchAll(/(--pathable-[a-z\d-]+)\s*:/gu)].map(
      (match) => match[1],
    ),
  )
  assert.ok(defaultTokens.size > 0, 'Packed theme declares no PathAble tokens')
  for (const [layer, layerCss] of [
    ['components', componentsCss],
    ['utilities', utilitiesCss],
  ]) {
    const layerTokens = new Set(
      [...layerCss.matchAll(/(--pathable-[a-z\d-]+)\s*:/gu)].map(
        (match) => match[1],
      ),
    )
    const leakedDefaults = [...layerTokens].filter((token) =>
      defaultTokens.has(token),
    )
    assert.deepEqual(
      leakedDefaults,
      [],
      `Packed ${layer} stylesheet includes default tokens:\n${leakedDefaults.join('\n')}`,
    )
    assert.doesNotMatch(
      layerCss,
      /@import\s+[^;]*(?:theme-default|\/theme)[^;]*;/iu,
      `Packed ${layer} stylesheet imports the default theme`,
    )
  }
  assert.match(
    css,
    /\.pathable-activity-list(?:\b|[_{,:.-])/u,
    'Packed stylesheet omits Activity List selectors',
  )
  assert.match(
    css,
    /\.pathable-app-shell--shared-navigation(?:\b|[_{,:.-])/u,
    'Packed stylesheet omits shared AppShell navigation selectors',
  )

  let assetReferences = 0
  for (const [entry, entryPath, entryCss] of stylesheets) {
    for (const url of localCssUrls(entryCss)) {
      assetReferences += 1
      const asset = normalize(resolve(dirname(entryPath), url))
      const packageRelativePath = relative(stylesRoot, asset)
      assert.ok(
        packageRelativePath !== '..' &&
          !packageRelativePath.startsWith(`..${sep}`),
        `${entry} stylesheet URL escapes the package root: ${url}`,
      )

      try {
        const content = await readFile(asset)
        assert.ok(
          content.byteLength > 0,
          `${entry} stylesheet asset is empty: ${packageRelativePath}`,
        )
      } catch (error) {
        if (error instanceof assert.AssertionError) throw error
        missing.push(`${entry}: ${packageRelativePath}`)
      }
    }
  }

  assert.deepEqual(
    missing,
    [],
    `Packed stylesheet assets are missing:\n${missing.join('\n')}`,
  )
  console.log(
    `[next-consumer] Verified ${assetReferences} packed stylesheet asset reference(s)`,
  )
}

async function assertReactPackage(reactRoot, expectedStylesVersion) {
  const manifest = JSON.parse(
    await readFile(join(reactRoot, 'package.json'), 'utf8'),
  )
  const runtime = await readFile(join(reactRoot, 'dist', 'index.js'), 'utf8')
  const declarations = await readFile(
    join(reactRoot, 'dist', 'index.d.ts'),
    'utf8',
  )
  const appShellDeclarations = await readFile(
    join(reactRoot, 'dist', 'components', 'AppShell', 'AppShell.d.ts'),
    'utf8',
  )
  const dependencyValues = Object.values(manifest.dependencies ?? {})
  const stylesDependency = manifest.dependencies?.['@pathableai/styles']

  assert.ok(
    dependencyValues.every((value) => !value.startsWith('workspace:')),
    'Packed React manifest contains a workspace protocol dependency',
  )
  assert.match(
    stylesDependency ?? '',
    /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u,
    'Packed React manifest does not declare a concrete @pathableai/styles dependency',
  )
  assert.equal(
    stylesDependency,
    expectedStylesVersion,
    'Packed React manifest does not reference the packed @pathableai/styles version',
  )
  console.log(
    `[next-consumer] Packed React styles dependency: ${stylesDependency}`,
  )
  assert.match(
    runtime,
    /import\s*['"]@pathableai\/styles\/components['"]/u,
    'Packed React runtime does not retain the components styles import',
  )
  assert.match(
    runtime,
    /import\s*['"]@pathableai\/styles\/utilities['"]/u,
    'Packed React runtime does not retain the utilities styles import',
  )
  assert.match(
    runtime,
    /import\s*['"]@pathableai\/styles\/theme['"]/u,
    'Packed React runtime does not retain the default theme fallback',
  )
  assert.doesNotMatch(
    runtime,
    /import\s*['"]@pathableai\/styles['"]/u,
    'Packed React runtime imports the root styles entry, duplicating stylesheet layers',
  )
  const themeImportIndex = runtime.search(
    /import\s*['"]@pathableai\/styles\/theme['"]/u,
  )
  const componentsImportIndex = runtime.search(
    /import\s*['"]@pathableai\/styles\/components['"]/u,
  )
  const utilitiesImportIndex = runtime.search(
    /import\s*['"]@pathableai\/styles\/utilities['"]/u,
  )
  assert.ok(
    themeImportIndex < componentsImportIndex &&
      themeImportIndex < utilitiesImportIndex,
    'Packed React runtime does not load the default theme before structural styles',
  )
  assert.match(
    runtime,
    /from\s+['"]react\/jsx-runtime['"]/u,
    'Packed React runtime does not import the consumer JSX runtime',
  )
  const runtimeExports = runtime.match(/export\s*\{([^}]*)\}/su)?.[1] ?? ''
  assert.match(
    runtimeExports,
    /\b(?:ActivityList|\w+\s+as\s+ActivityList)\b/u,
    'Packed runtime does not explicitly export ActivityList',
  )
  assert.match(
    declarations,
    /export\s*\{\s*ActivityList\s*\}\s*from\s*['"]\.\/components\/ActivityList\/ActivityList\.js['"]/u,
    'Packed declarations do not explicitly export ActivityList',
  )
  assert.match(
    declarations,
    /\bMobileNavigation\b/u,
    'Packed declarations do not export the AppShell mobile navigation type',
  )
  assert.match(
    appShellDeclarations,
    /mainProps\?:\s*Omit<HTMLAttributes<HTMLElement>,\s*['"]children['"]\s*\|\s*['"]dangerouslySetInnerHTML['"]>/u,
    'Packed declarations omit AppShell main landmark attributes',
  )
  assert.match(
    appShellDeclarations,
    /children\?:\s*never/u,
    'Packed declarations do not forbid mainProps children',
  )
  assert.match(
    appShellDeclarations,
    /dangerouslySetInnerHTML\?:\s*never/u,
    'Packed declarations do not forbid mainProps dangerouslySetInnerHTML',
  )
  assert.match(
    appShellDeclarations,
    /skipLinkText\?:\s*string/u,
    'Packed declarations do not restrict AppShell skip-link text to a string',
  )
  const activityTypeExports =
    declarations.match(
      /export\s+type\s*\{([^}]*)\}\s*from\s*['"]\.\/components\/ActivityList\/ActivityList\.js['"]/su,
    )?.[1] ?? ''
  for (const publicType of [
    'ActivityListProps',
    'ActivityListDensity',
    'ActivityStatus',
    'ActivityStatusValue',
    'ActivityItem',
    'ActivityItemAttributes',
    'ActivityGroup',
    'ActivityGroupAttributes',
  ]) {
    assert.match(
      activityTypeExports,
      new RegExp(`\\b${publicType}\\b`, 'u'),
      `Packed declarations do not explicitly export ${publicType}`,
    )
  }

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

async function writeFixture(fixtureRoot) {
  await mkdir(join(fixtureRoot, 'app'), { recursive: true })
  await mkdir(join(fixtureRoot, 'src'), { recursive: true })
  const fixtureTemplate = join(
    repoRoot,
    'scripts',
    'fixtures',
    'next-consumer',
    consumerFixture,
  )
  await copyFile(
    join(fixtureTemplate, 'package.json'),
    join(fixtureRoot, 'package.json'),
  )
  await copyFile(
    join(fixtureTemplate, 'pnpm-lock.yaml'),
    join(fixtureRoot, 'pnpm-lock.yaml'),
  )
  await copyFile(
    join(fixtureTemplate, 'pnpm-workspace.yaml'),
    join(fixtureRoot, 'pnpm-workspace.yaml'),
  )
  await writeFile(
    join(fixtureRoot, 'app', 'layout.js'),
    `import './overrides.css'
import '@pathableai/react'

export const metadata = { title: 'PathAble package smoke' }

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
`,
  )
  await writeFile(
    join(fixtureRoot, 'src', 'app.scss'),
    "@use '@pathableai/styles/src/index' as pathable;\n",
  )
  await writeFile(
    join(fixtureRoot, 'app', 'overrides.css'),
    `:root {
  --pathable-color-text: #123456;
}
`,
  )
  await writeFile(
    join(fixtureRoot, 'app', 'page.js'),
    `import { ActivityList, AppShell, AppShellNavItem, Card, DashboardHeader, Link, List, Loading, Tag } from '@pathableai/react'

export default function Page() {
  return (
    <AppShell
      mainProps={{ 'aria-label': 'Consumer workspace', id: 'consumer-main', tabIndex: -1 }}
      mobileNavigation="shared"
      navigationLabel="Consumer product"
      sidebarNav={
        <>
          <AppShellNavItem href="/dashboard" active>Consumer dashboard</AppShellNavItem>
          <AppShellNavItem href="/participants">Consumer participants</AppShellNavItem>
          <AppShellNavItem href="/programs">Consumer programs</AppShellNavItem>
          <AppShellNavItem href="/reports">Consumer reports</AppShellNavItem>
          <AppShellNavItem href="/resources">Consumer resources</AppShellNavItem>
          <AppShellNavItem href="/settings">Consumer settings</AppShellNavItem>
        </>
      }
      skipLinkText="Skip consumer navigation"
      topBarTitle="Consumer shell"
    >
      <DashboardHeader
        title="PathAble consumer smoke"
        context="Default theme fallback"
        description="Packed React supplies theme and structural styles."
      />
      <Card title="Consumer card">Server-rendered card content</Card>
      <Link href="/details">Consumer link</Link>
      <List items={['Consumer list item one', 'Consumer list item two']} />
      <Tag>Consumer tag</Tag>
      <Loading text="Consumer loading state" />
      <ActivityList
        groups={[
          {
            id: 'today',
            heading: 'Consumer activity today',
            items: [
              {
                id: 'complete',
                title: 'Consumer completed activity',
                context: 'Consumer participant',
                date: 'September 30',
                owner: 'Consumer owner',
                status: 'completed',
                statusLabel: 'Completed',
                actions: <a href="/activity/complete">View consumer activity</a>,
              },
              {
                id: 'review',
                title: 'Consumer unfamiliar activity',
                context: 'Consumer participant',
                date: 'October 1',
                owner: 'Consumer owner',
                status: 'awaiting-review',
                statusLabel: 'Awaiting review',
              },
            ],
          },
        ]}
      />
    </AppShell>
  )
}
`,
  )
}

async function assertBrowserConsumer(fixtureRoot) {
  const { child, url, output } = await startConsumerServer(fixtureRoot)

  let browser
  try {
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    const browserErrors = []
    page.on('pageerror', (error) => browserErrors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text())
    })
    const criticalResourceTypes = new Set([
      'document',
      'font',
      'image',
      'script',
      'stylesheet',
    ])
    page.on('requestfailed', (request) => {
      if (criticalResourceTypes.has(request.resourceType())) {
        browserErrors.push(
          `${request.resourceType()} request failed: ${request.url()}`,
        )
      }
    })
    page.on('response', (response) => {
      const request = response.request()
      if (criticalResourceTypes.has(request.resourceType()) && !response.ok()) {
        browserErrors.push(
          `${request.resourceType()} response failed (${response.status()}): ${response.url()}`,
        )
      }
    })

    await page.goto(url, { waitUntil: 'networkidle' })
    const fontLoaded = await page.evaluate(async () => {
      await document.fonts.load('16px Fredoka')
      return document.fonts.check('16px Fredoka')
    })
    assert.ok(fontLoaded, 'Published Fredoka font did not load')
    const header = page.locator('.pathable-dashboard-header')
    assert.equal(
      await header.count(),
      1,
      'Rendered page has no unique DashboardHeader',
    )
    assert.equal(
      await header.locator('h1.pathable-dashboard-header__title').textContent(),
      'PathAble consumer smoke',
      'DashboardHeader title is not rendered inside its root',
    )
    assert.equal(
      await header.locator('.pathable-dashboard-header__context').textContent(),
      'Default theme fallback',
      'DashboardHeader context is not rendered inside its root',
    )
    assert.equal(
      await header
        .locator('.pathable-dashboard-header__description')
        .textContent(),
      'Packed React supplies theme and structural styles.',
      'DashboardHeader description is not rendered inside its root',
    )

    const computed = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement)
      const title = document.querySelector('.pathable-dashboard-header__title')
      const header = document.querySelector('.pathable-dashboard-header')
      if (!(title instanceof HTMLElement) || !(header instanceof HTMLElement)) {
        throw new Error('DashboardHeader DOM is incomplete')
      }
      return {
        accent: root.getPropertyValue('--pathable-color-accent').trim(),
        spacing: root.getPropertyValue('--pathable-space-6').trim(),
        text: root.getPropertyValue('--pathable-color-text').trim(),
        titleColor: getComputedStyle(title).color,
        headerDisplay: getComputedStyle(header).display,
      }
    })
    assert.equal(
      computed.accent,
      '#1cae96',
      'Default accent token is not applied',
    )
    assert.equal(
      computed.spacing,
      '3rem',
      'Default spacing token is not applied',
    )
    assert.equal(
      computed.text,
      '#123456',
      'Application token override does not beat later package defaults',
    )
    assert.equal(
      computed.titleColor,
      'rgb(18, 52, 86)',
      'DashboardHeader does not resolve the application text override',
    )
    assert.equal(
      computed.headerDisplay,
      'flex',
      'DashboardHeader structural styles are not applied',
    )
    assert.deepEqual(
      browserErrors,
      [],
      `Consumer browser emitted runtime errors:\n${browserErrors.join('\n')}`,
    )
  } catch (error) {
    throw new Error(`${error.message}\nNext server output:\n${output()}`, {
      cause: error,
    })
  } finally {
    try {
      await browser?.close()
    } finally {
      await stopProcess(child)
      if (activeConsumerServer === child) activeConsumerServer = undefined
    }
  }
}

async function assertConsumer(fixtureRoot, stylesTarball, reactTarball) {
  const installArguments = [
    'install',
    '--store-dir',
    join(repoRoot, '.pnpm-store'),
  ]

  run('pnpm', [...installArguments, '--frozen-lockfile', '--prefer-offline'], {
    cwd: fixtureRoot,
  })
  await writeFile(
    join(fixtureRoot, 'pnpm-workspace.yaml'),
    `packages: []
overrides:
  '@pathableai/styles': ${JSON.stringify(`file:${stylesTarball}`)}
allowBuilds:
  '@parcel/watcher': true
  '@swc/core': true
  sharp: true
`,
  )
  const manifestPath = join(fixtureRoot, 'package.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  manifest.dependencies['@pathableai/react'] = `file:${reactTarball}`
  manifest.dependencies['@pathableai/styles'] = `file:${stylesTarball}`
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  run('pnpm', [...installArguments, '--offline', '--no-frozen-lockfile'], {
    cwd: fixtureRoot,
    capture: true,
  })
  console.log(
    `[next-consumer] Installed locked ${consumerFixture} fixture and packed packages`,
  )
  await mkdir(join(fixtureRoot, 'dist'), { recursive: true })
  run(
    'pnpm',
    [
      'exec',
      'sass',
      '--quiet-deps',
      '--load-path=node_modules',
      '--load-path=node_modules/@uswds/uswds/packages',
      'src/app.scss',
      'dist/app.css',
    ],
    { cwd: fixtureRoot },
  )
  const compiledSourceCss = await readFile(
    join(fixtureRoot, 'dist', 'app.css'),
    'utf8',
  )
  assert.match(
    compiledSourceCss,
    /\.pathable-dashboard-header\s*\{/u,
    'Published Sass source entry did not compile component styles',
  )
  assert.match(
    compiledSourceCss,
    /url\(["']?\.\.\/fonts\/fredoka\/Fredoka-Regular\.woff2["']?\)/u,
    'Published Sass source entry did not emit its documented font path',
  )
  const lockfile = await readFile(join(fixtureRoot, 'pnpm-lock.yaml'), 'utf8')
  const stylesTarballName = basename(stylesTarball)
  assert.ok(
    lockfile
      .split(/\r?\n/u)
      .some(
        (line) =>
          line.includes('@pathableai/styles@file:') &&
          line.includes(stylesTarballName),
      ),
    'Consumer lockfile does not resolve @pathableai/styles from the packed tarball',
  )
  run('pnpm', ['build'], { cwd: fixtureRoot })

  const html = await readFile(
    join(fixtureRoot, '.next', 'server', 'app', 'index.html'),
    'utf8',
  )
  const stylesheetHrefs = [...html.matchAll(/<link\b[^>]*>/gu)]
    .filter((match) => /\brel="stylesheet"/u.test(match[0]))
    .map((match) => match[0].match(/\bhref="([^"]+\.css)"/u)?.[1])
    .filter(Boolean)
  assert.ok(stylesheetHrefs.length > 0, 'Prerendered page links no CSS assets')
  const staticAssetPrefix = '/_next/static/'
  const emittedCss = (
    await Promise.all(
      stylesheetHrefs.map(async (href) => {
        assert.ok(
          href.startsWith(staticAssetPrefix),
          `Unexpected stylesheet URL: ${href}`,
        )
        const asset = join(
          fixtureRoot,
          '.next',
          'static',
          ...href.slice(staticAssetPrefix.length).split('/'),
        )
        try {
          return await readFile(asset, 'utf8')
        } catch (error) {
          throw new Error(`Linked stylesheet is missing: ${href}`, {
            cause: error,
          })
        }
      }),
    )
  ).join('\n')
  assert.match(
    emittedCss,
    /:where\(:root\)\s*\{[^}]*--pathable-color-text\s*:\s*#00365c\s*;/u,
    'Next build CSS omits the low-specificity PathAble text color fallback',
  )
  assert.match(
    emittedCss,
    /:where\(:root\)\s*\{[^}]*--pathable-space-6\s*:\s*3rem\s*;/u,
    'Next build CSS omits the low-specificity PathAble spacing fallback',
  )
  assert.match(
    emittedCss,
    /\.pathable-dashboard-header\s*\{[^}]*display\s*:\s*flex(?:\s*;|\s*\})/u,
    'Next build CSS omits concrete DashboardHeader structural styles',
  )

  for (const content of [
    'Server-rendered card content',
    'Consumer link',
    'Consumer list item one',
    'Consumer tag',
    'Consumer loading state',
    'Consumer activity today',
    'Consumer completed activity',
    'Completed',
    'Consumer unfamiliar activity',
    'Awaiting review',
    'View consumer activity',
    'PathAble consumer smoke',
    'Default theme fallback',
    'Packed React supplies theme and structural styles.',
    'Skip consumer navigation',
    'Consumer dashboard',
    'Consumer settings',
  ]) {
    assert.ok(html.includes(content), `Rendered page is missing: ${content}`)
  }
  assert.match(
    html,
    /class="pathable-dashboard-header"/u,
    'Rendered page is missing the DashboardHeader root class',
  )
  assert.match(
    html,
    /class="pathable-app-shell pathable-app-shell--shared-navigation"/u,
    'Rendered AppShell is missing the shared-navigation modifier',
  )
  assert.match(
    html,
    /<a(?=[^>]*\bclass="pathable-skipnav")(?=[^>]*\bhref="#consumer-main")[^>]*>/u,
    'Rendered AppShell skip link does not target the consumer main landmark',
  )
  assert.match(
    html,
    /<nav(?=[^>]*\bclass="pathable-app-shell__nav")(?=[^>]*\baria-label="Consumer product")[^>]*>/u,
    'Rendered AppShell navigation does not preserve its accessible name',
  )
  assert.match(
    html,
    /<main(?=[^>]*\baria-label="Consumer workspace")(?=[^>]*\btabindex="-1")(?=[^>]*\bid="consumer-main")[^>]*>/u,
    'Rendered AppShell does not preserve consumer main attributes',
  )
  const activityHeading = html.match(
    /<h([2-6])([^>]*)>Consumer activity today<\/h\1>/u,
  )
  assert.ok(activityHeading, 'Rendered Activity List heading is missing')
  assert.match(
    activityHeading[2],
    /class="pathable-activity-list__group-heading"/u,
    'Rendered Activity List heading is missing its source class',
  )
  const activityHeadingId = activityHeading[2].match(/id="([^"]+)"/u)?.[1]
  assert.ok(activityHeadingId, 'Rendered Activity List heading has no id')
  const contentAfterHeading = html.slice(
    activityHeading.index + activityHeading[0].length,
  )
  const adjacentListAttributes =
    contentAfterHeading.match(/^\s*<div([^>]*)>/u)?.[1]
  assert.ok(
    adjacentListAttributes,
    'Rendered Activity List heading has no adjacent group list',
  )
  assert.match(
    adjacentListAttributes,
    /class="pathable-activity-list"/u,
    'Rendered Activity List group list is missing its source class',
  )
  assert.match(
    adjacentListAttributes,
    /role="list"/u,
    'Rendered Activity List group does not expose the list role',
  )
  assert.ok(
    adjacentListAttributes.includes(`aria-labelledby="${activityHeadingId}"`),
    'Rendered Activity List group does not reference its adjacent heading',
  )

  for (const runtimeError of [
    'ReactCurrentOwner',
    'A React Element from an older version of React was rendered',
  ]) {
    assert.ok(
      !html.includes(runtimeError),
      `Consumer emitted a React runtime error: ${runtimeError}`,
    )
  }
  await assertBrowserConsumer(fixtureRoot)
}

async function main() {
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'pathable-next-consumer-'))
  activeTemporaryRoot = temporaryRoot
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
    const stylesManifest = JSON.parse(
      await readFile(join(stylesRoot, 'package.json'), 'utf8'),
    )

    await assertReactPackage(reactRoot, stylesManifest.version)
    const guidance = await validateAgentGuidance(reactRoot)
    console.log(
      `[next-consumer] Verified ${guidance.files} packed agent-guidance files`,
    )
    await assertStylesAssets(stylesRoot)

    const fixtureRoot = join(temporaryRoot, 'consumer')
    await writeFixture(fixtureRoot)
    await assertConsumer(fixtureRoot, stylesTarball, reactTarball)

    console.log(
      '[next-consumer] Packed package and Next.js smoke checks passed',
    )
  } finally {
    await rm(temporaryRoot, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 100,
    })
    if (activeTemporaryRoot === temporaryRoot) activeTemporaryRoot = undefined
  }
}

await main()

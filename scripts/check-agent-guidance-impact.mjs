import { execFileSync } from 'node:child_process'
import { appendFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const guidancePaths = [
  'packages/react/README.md',
  'packages/react/agent-guidance/',
]

const categories = [
  {
    name: 'public React components or exports',
    matches: (path) =>
      path === 'packages/react/src/index.ts' ||
      path.startsWith('packages/react/src/components/') ||
      path.startsWith('packages/react/src/internal/resolvers/'),
  },
  {
    name: 'styling or theming contracts',
    matches: (path) =>
      path.startsWith('packages/react/src/theme/') ||
      (path.startsWith('packages/styles/src/') && !path.includes('/stories/')),
  },
  {
    name: 'server, client, or browser-JavaScript boundaries',
    matches: (path) =>
      [
        'Accordion',
        'Banner',
        'ComboBox',
        'DatePicker',
        'DateRangePicker',
        'Header',
        'Modal',
        'SegmentedControl',
        'Toast',
      ].some((component) =>
        path.startsWith(`packages/react/src/components/${component}/`),
      ) ||
      path.startsWith('packages/styles/src/js/') ||
      path === 'scripts/check-react-server-compatibility.mjs',
  },
  {
    name: 'published manifests or entry points',
    matches: (path) =>
      path === 'packages/react/package.json' ||
      path === 'packages/styles/package.json' ||
      path === 'packages/react/vite.config.ts' ||
      path === 'packages/styles/scripts/build-js.mjs',
  },
]

function isIgnored(path) {
  return (
    path.includes('/__tests__/') ||
    /\.(?:stories|story|test|spec)\.[^/]+$/u.test(path) ||
    path.startsWith('packages/react/src/stories/') ||
    path.startsWith('packages/styles/src/stories/')
  )
}

function isGuidance(path) {
  return guidancePaths.some((candidate) =>
    candidate.endsWith('/') ? path.startsWith(candidate) : path === candidate,
  )
}

export function analyzeChangedPaths(paths) {
  const changedPaths = [...new Set(paths.filter(Boolean))].sort()
  const guidanceChanged = changedPaths.some(isGuidance)
  const impacts = categories
    .map((category) => ({
      category: category.name,
      paths: changedPaths.filter(
        (path) =>
          !isIgnored(path) && !isGuidance(path) && category.matches(path),
      ),
    }))
    .filter((impact) => impact.paths.length > 0)

  return { changedPaths, guidanceChanged, impacts }
}

function argumentValue(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

function changedPathsBetween(base, head) {
  const output = execFileSync(
    'git',
    ['diff', '--name-only', '--diff-filter=ACDMRT', `${base}...${head}`],
    { cwd: repoRoot, encoding: 'utf8' },
  )
  return output.split('\n').filter(Boolean)
}

function annotationEscape(value) {
  return value
    .replaceAll('%', '%25')
    .replaceAll('\r', '%0D')
    .replaceAll('\n', '%0A')
}

export function formatReport(result) {
  if (result.impacts.length === 0) {
    return 'No consumer-facing changes were detected that suggest an agent-guidance review.'
  }

  const heading = result.guidanceChanged
    ? 'Agent-guidance impact acknowledged'
    : 'Agent-guidance review suggested'
  const lines = [heading, '']

  for (const impact of result.impacts) {
    lines.push(`- ${impact.category}:`)
    for (const path of impact.paths) lines.push(`  - \`${path}\``)
  }

  if (!result.guidanceChanged) {
    lines.push(
      '',
      'Confirm whether these changes affect the shipped component-selection, styling, theming, accessibility, packaging, or server/client guidance. Update the guide when they do; no change is needed when the public contract is unchanged.',
    )
  }

  return lines.join('\n')
}

async function main() {
  const base = argumentValue('--base') ?? 'origin/main'
  const head = argumentValue('--head') ?? 'HEAD'
  const result = analyzeChangedPaths(changedPathsBetween(base, head))
  const report = formatReport(result)

  console.log(`[agent-guidance-impact] ${report}`)

  if (result.impacts.length > 0 && !result.guidanceChanged) {
    console.log(
      `::notice title=Agent guidance review suggested::${annotationEscape(
        'Consumer-facing files changed without an agent-guidance update. Review the workflow summary; this advisory does not fail the build.',
      )}`,
    )
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `## Agent guidance impact\n\n${report}\n`,
    )
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error('[agent-guidance-impact] Audit infrastructure failed')
    console.error(error)
    process.exitCode = 1
  })
}

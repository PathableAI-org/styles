import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  analyzeChangedPaths,
  formatReport,
  readReactPages,
} from './check-agent-guidance-impact.mjs'

test('suggests review for a public component change', () => {
  const result = analyzeChangedPaths([
    'packages/react/src/components/Button/Button.tsx',
  ])

  assert.equal(result.guidanceChanged, false)
  assert.deepEqual(
    result.impacts.map(({ category }) => category),
    ['public React components or exports'],
  )
  assert.match(formatReport(result), /review suggested/u)
})

test('acknowledges a relevant change accompanied by guidance', () => {
  const result = analyzeChangedPaths([
    'packages/react/src/index.ts',
    'packages/react/agent-guidance/pathable-react/SKILL.md',
  ])

  assert.equal(result.guidanceChanged, true)
  assert.match(formatReport(result), /impact acknowledged/u)
})

test('ignores tests and stories', () => {
  const result = analyzeChangedPaths([
    'packages/react/src/components/Button/Button.test.tsx',
    'packages/react/src/stories/components/Button.stories.tsx',
  ])

  assert.deepEqual(result.impacts, [])
})

test('categorizes theme and browser boundary changes', () => {
  const result = analyzeChangedPaths([
    'packages/react/src/theme/tokens.ts',
    'packages/react/src/components/Modal/Modal.tsx',
  ])

  assert.deepEqual(
    result.impacts.map(({ category }) => category),
    [
      'public React components or exports',
      'styling or theming contracts',
      'server, client, or browser-JavaScript boundaries',
    ],
  )
})

test('fails when the git comparison cannot be performed', () => {
  const scriptsDirectory = dirname(fileURLToPath(import.meta.url))
  const result = spawnSync(
    process.execPath,
    [
      resolve(scriptsDirectory, 'check-agent-guidance-impact.mjs'),
      '--base',
      'missing-agent-guidance-base',
      '--head',
      'HEAD',
    ],
    { encoding: 'utf8' },
  )

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Audit infrastructure failed/u)
})

test('does not count a regenerated component page as a guidance review', () => {
  const result = analyzeChangedPaths([
    'packages/react/src/components/SrOnly/SrOnly.tsx',
    'packages/react/agent-guidance/pathable-react/references/components/SrOnly.md',
  ])

  assert.equal(result.guidanceChanged, false)
  assert.deepEqual(
    result.impacts.map(({ category }) => category),
    ['public React components or exports'],
  )
})

test('counts an edited source page as a guidance update only when it builds React guidance', () => {
  const reactPages = new Set(['sr-only'])
  const covered = analyzeChangedPaths(
    [
      'packages/react/src/components/SrOnly/SrOnly.tsx',
      'components/sr-only.md',
      'packages/react/agent-guidance/pathable-react/references/components/SrOnly.md',
    ],
    { reactPages },
  )
  assert.equal(covered.guidanceChanged, true)

  const stylesOnly = analyzeChangedPaths(
    [
      'packages/react/src/components/ButtonGroup/ButtonGroup.tsx',
      'components/button-group.md',
    ],
    { reactPages },
  )
  assert.equal(stylesOnly.guidanceChanged, false)
  assert.deepEqual(
    stylesOnly.impacts.map(({ category }) => category),
    ['public React components or exports'],
  )

  assert.equal(
    analyzeChangedPaths(['components/README.md'], { reactPages })
      .guidanceChanged,
    false,
  )
})

test('reads the React pages from the fixture manifest', async () => {
  // The real manifest maps no folder yet, so it has no React pages.
  assert.deepEqual([...(await readReactPages())], [])

  const dir = mkdtempSync(join(tmpdir(), 'manifest-'))
  try {
    const manifest = join(dir, 'fixture-manifest.mjs')
    writeFileSync(
      manifest,
      "export const fixtureManifest = { button: { component: 'Button' } }\n",
    )
    assert.deepEqual([...(await readReactPages(manifest))], ['button'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

import assert from 'node:assert/strict'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'

import {
  CONDITIONS,
  REPOSITORY_ROOT,
  baselinePath,
  containerImage,
  coverageSummary,
  findUnusedBaselines,
  planCaptures,
  validateWorkspace,
} from '../visual-regression/harness.mjs'
import { WORKSPACES } from '../visual-regression/workspaces.mjs'

const styles = WORKSPACES.styles

function workspaceWith(overrides) {
  return {
    name: 'sample',
    canonicalStories: [
      { id: 'a--one', mode: 'both' },
      { id: 'a--two', mode: 'desktop' },
      { id: 'b--one', mode: 'mobile' },
    ],
    stories: [
      {
        id: 'a--one',
        key: 'alpha/one',
        conditions: ['default', 'focus-visible'],
      },
      { id: 'a--two', key: 'alpha/two', conditions: ['default'] },
      { id: 'b--one', key: 'beta/one', conditions: ['forced-colors'] },
    ],
    rollout: ['alpha'],
    ...overrides,
  }
}

describe('visual-regression workspace configuration', () => {
  for (const workspace of Object.values(WORKSPACES)) {
    it(`${workspace.name} is valid`, () => {
      assert.deepEqual(validateWorkspace(workspace), [])
    })

    it(`${workspace.name} has a committed baseline for every rollout capture`, () => {
      const missing = planCaptures(workspace)
        .map((capture) => capture.baseline)
        .filter((path) => !existsSync(join(REPOSITORY_ROOT, path)))
      assert.deepEqual(missing, [])
    })

    it(`${workspace.name} has no baselines outside the rollout captures`, () => {
      assert.deepEqual(findUnusedBaselines(workspace), [])
    })
  }

  it('reports problems in an invalid configuration', () => {
    const problems = validateWorkspace(
      workspaceWith({
        stories: [
          { id: 'a--one', key: 'Alpha/One', conditions: ['default'] },
          { id: 'a--one', key: 'alpha/two', conditions: ['sepia'] },
          { id: 'missing--story', key: 'alpha/three', conditions: [] },
        ],
        rollout: ['alpha', 'gamma'],
      }),
    )
    assert.deepEqual(problems, [
      'a--one: key "Alpha/One" is not "<component>/<state>" in kebab case',
      'a--one is listed twice',
      'a--one: unknown condition "sepia"',
      'missing--story is not a canonical story of sample',
      'missing--story lists no conditions',
      'rollout component gamma has no story entries',
    ])
  })
})

describe('visual-regression capture plan', () => {
  it('captures only rollout components, at the visual viewports of each story mode', () => {
    const captures = planCaptures(workspaceWith({}))
    assert.deepEqual(
      captures.map((capture) => capture.title),
      [
        'alpha/one desktop default',
        'alpha/one desktop focus-visible',
        'alpha/one tablet default',
        'alpha/one tablet focus-visible',
        'alpha/one mobile default',
        'alpha/one mobile focus-visible',
        'alpha/two desktop default',
      ],
    )
  })

  it('captures named components instead of the rollout list when asked', () => {
    const captures = planCaptures(workspaceWith({}), { components: ['beta'] })
    assert.deepEqual(
      captures.map((capture) => capture.baseline),
      ['visual-baselines/sample/beta/one/mobile-forced-colors.png'],
    )
  })

  it('names baselines <workspace>/<component>/<state>/<viewport>-<condition>.png', () => {
    assert.equal(
      baselinePath('react', 'icon-button/all-variants', 'tablet', 'text-200'),
      'visual-baselines/react/icon-button/all-variants/tablet-text-200.png',
    )
    const [capture] = planCaptures(workspaceWith({}))
    assert.deepEqual(capture.snapshotName, [
      'alpha',
      'one',
      'desktop-default.png',
    ])
  })

  it('defines the condition variants named by constitution principle XV', () => {
    assert.deepEqual(Object.keys(CONDITIONS).sort(), [
      'default',
      'focus-visible',
      'forced-colors',
      'reduced-motion',
      'text-200',
    ])
  })

  it('states how much of the canonical story list it does not compare', () => {
    const summary = coverageSummary(styles).join('\n')
    const total = styles.canonicalStories.length
    assert.match(
      summary,
      new RegExp(`Comparing 1 of ${total} canonical stories`),
    )
    assert.match(
      summary,
      new RegExp(`The other ${total - 1} canonical stories`),
    )
    assert.match(summary, /partial coverage, not full coverage/)
  })
})

describe('visual-regression baseline housekeeping', () => {
  it('finds baselines that no rollout capture compares', () => {
    const root = mkdtempSync(join(tmpdir(), 'visual-baselines-'))
    try {
      const directory = join(root, 'visual-baselines/sample/alpha/one')
      mkdirSync(directory, { recursive: true })
      writeFileSync(join(directory, 'desktop-default.png'), '')
      writeFileSync(join(directory, 'desktop-reduced-motion.png'), '')
      const betaDirectory = join(root, 'visual-baselines/sample/beta/one')
      mkdirSync(betaDirectory, { recursive: true })
      writeFileSync(join(betaDirectory, 'mobile-forced-colors.png'), '')

      assert.deepEqual(findUnusedBaselines(workspaceWith({}), root).sort(), [
        'visual-baselines/sample/alpha/one/desktop-reduced-motion.png',
        'visual-baselines/sample/beta/one/mobile-forced-colors.png',
      ])
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })

  it('pins the container image to the exact Playwright version in use', () => {
    const version = (name) =>
      JSON.parse(
        readFileSync(
          join(REPOSITORY_ROOT, 'node_modules', name, 'package.json'),
          'utf8',
        ),
      ).version
    assert.equal(version('@playwright/test'), version('playwright'))
    assert.equal(
      containerImage(),
      `mcr.microsoft.com/playwright:v${version('playwright')}-noble`,
    )
  })
})

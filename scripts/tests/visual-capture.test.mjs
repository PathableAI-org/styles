import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  collectContrast,
  composite,
  contrastRatio,
  diffRgba,
  isLargeText,
  parseCssColor,
} from '../visual-capture/measure.mjs'
import {
  chooseStories,
  componentSlug,
  conditionsForDiff,
  conditionsForStory,
  isSharedPath,
  kebab,
  viewportsForMode,
} from '../visual-capture/select.mjs'

const story = (id, title, importPath) => ({
  type: 'story',
  id,
  title,
  importPath,
})

const stylesIndex = [
  story('button--primary', 'Button', './generated/button.stories.ts'),
  story('button--outline', 'Button', './generated/button.stories.ts'),
  story('alert--info', 'Alert', './generated/alert.stories.ts'),
  {
    type: 'docs',
    id: 'button--docs',
    title: 'Button',
    importPath: './generated/button.mdx',
  },
]
const reactIndex = [
  story(
    'basic-iconbutton--default',
    'Basic/IconButton',
    '../../packages/react/src/stories/components/Basic/IconButton.stories.tsx',
  ),
  story(
    'basic-link--default',
    'Basic/Link',
    '../../packages/react/src/stories/components/Basic/Link.stories.tsx',
  ),
]

describe('componentSlug', () => {
  it('reads component pages, fixtures, wrappers and React folders', () => {
    assert.equal(componentSlug('components/button-group.md'), 'button-group')
    assert.equal(componentSlug('fixtures/alert/default.html'), 'alert')
    assert.equal(
      componentSlug(
        'packages/styles/src/pathable-component-wrappers/pathable-button.scss',
      ),
      'button',
    )
    assert.equal(
      componentSlug('packages/react/src/components/IconButton/IconButton.tsx'),
      'icon-button',
    )
  })

  it('ignores paths that name no component', () => {
    assert.equal(componentSlug('components/README.md'), null)
    assert.equal(componentSlug('fixtures/harness/index.mjs'), null)
    assert.equal(
      componentSlug(
        'packages/styles/src/pathable-component-wrappers/pathable-all.scss',
      ),
      null,
    )
    assert.equal(componentSlug('docs/engineering/orchestration.md'), null)
  })
})

describe('isSharedPath', () => {
  it('flags tokens, entry points, shared partials, Storybook config and dependencies', () => {
    for (const path of [
      'packages/styles/src/_colors.scss',
      'packages/styles/src/theme-default.scss',
      'packages/styles/src/pathable-component-wrappers/_index.scss',
      'apps/storybook/.storybook/preview.ts',
      'pnpm-lock.yaml',
      'packages/react/package.json',
    ]) {
      assert.equal(isSharedPath(path), true, path)
    }
  })

  it('leaves one component wrapper and nested source alone', () => {
    assert.equal(
      isSharedPath(
        'packages/styles/src/pathable-component-wrappers/pathable-button.scss',
      ),
      false,
    )
    assert.equal(isSharedPath('packages/styles/src/js/accordion.js'), false)
  })
})

describe('chooseStories', () => {
  it('chooses every story of a changed component and marks it changed', () => {
    const chosen = chooseStories({
      changedPaths: [
        'packages/styles/src/pathable-component-wrappers/pathable-button.scss',
      ],
      indexes: { styles: stylesIndex },
    })
    assert.deepEqual(
      chosen.map((item) => [item.workspace, item.id, item.changed]),
      [
        ['styles', 'button--outline', true],
        ['styles', 'button--primary', true],
      ],
    )
  })

  it('matches React stories by file and by component folder', () => {
    const chosen = chooseStories({
      changedPaths: [
        'packages/react/src/components/IconButton/IconButton.tsx',
        'packages/react/src/stories/components/Basic/Link.stories.tsx',
      ],
      indexes: { styles: stylesIndex, react: reactIndex },
    })
    assert.deepEqual(
      chosen.map((item) => `${item.workspace}:${item.id}`),
      ['react:basic-iconbutton--default', 'react:basic-link--default'],
    )
  })

  it('adds the canonical and rollout lists for a shared change, unchanged', () => {
    const chosen = chooseStories({
      changedPaths: ['packages/styles/src/_colors.scss'],
      indexes: { styles: stylesIndex },
      canonical: [{ id: 'alert--info', mode: 'desktop' }],
      pixelStories: [{ id: 'button--primary', key: 'button/primary' }],
      rollout: ['button'],
    })
    assert.deepEqual(
      chosen.map((item) => [item.id, item.changed, item.mode]),
      [
        ['alert--info', false, 'desktop'],
        ['button--primary', false, 'both'],
      ],
    )
  })

  it('falls back to the first story of each file when the lists are empty', () => {
    const chosen = chooseStories({
      changedPaths: ['packages/styles/src/_colors.scss'],
      indexes: { styles: stylesIndex },
    })
    assert.deepEqual(
      chosen.map((item) => item.id),
      ['alert--info', 'button--primary'],
    )
    assert.match(chosen[0].reasons[0], /First story of its file/)
  })

  it('adds stories asked for explicitly, including unknown ones', () => {
    const chosen = chooseStories({
      changedPaths: [],
      indexes: { styles: stylesIndex, react: reactIndex },
      extra: ['alert--info', 'react:basic-link--default', 'missing--story'],
    })
    assert.deepEqual(
      chosen.map((item) => `${item.workspace}:${item.id}`),
      [
        'react:basic-link--default',
        'styles:alert--info',
        'styles:missing--story',
      ],
    )
  })
})

describe('conditions and viewports', () => {
  it('derives forced-colors and reduced-motion from the diff text', () => {
    assert.deepEqual(conditionsForDiff('+  color: $ink;'), ['forced-colors'])
    assert.deepEqual(conditionsForDiff('+  transition: opacity 0.2s;'), [
      'reduced-motion',
    ])
    assert.deepEqual(conditionsForDiff('+  margin: 0;'), [])
  })

  it('gives changed stories focus and 200% text, and others only the default', () => {
    assert.deepEqual(conditionsForStory({ changed: true }, ['forced-colors']), [
      'default',
      'focus',
      'text-200',
      'forced-colors',
    ])
    assert.deepEqual(
      conditionsForStory({ changed: false }, ['forced-colors']),
      ['default'],
    )
  })

  it('maps modes to viewports', () => {
    assert.deepEqual(viewportsForMode('desktop'), ['desktop'])
    assert.deepEqual(viewportsForMode('both'), ['mobile', 'tablet', 'desktop'])
  })

  it('kebab-cases component names', () => {
    assert.equal(kebab('IconButton'), 'icon-button')
    assert.equal(kebab('app_shell'), 'app-shell')
  })
})

describe('contrast maths', () => {
  it('parses computed colours', () => {
    assert.deepEqual(parseCssColor('rgb(0, 0, 0)'), [0, 0, 0, 1])
    assert.deepEqual(parseCssColor('rgba(255, 0, 0, 0.5)'), [255, 0, 0, 0.5])
    assert.equal(parseCssColor('oklch(0.5 0.1 200)'), null)
  })

  it('computes WCAG ratios', () => {
    assert.equal(contrastRatio([0, 0, 0], [255, 255, 255]), 21)
    assert.equal(contrastRatio([255, 255, 255], [255, 255, 255]), 1)
    assert.equal(contrastRatio([118, 118, 118], [255, 255, 255]), 4.54)
  })

  it('blends translucent colours over the background', () => {
    assert.deepEqual(
      composite([0, 0, 0, 0.5], [255, 255, 255, 1]),
      [127.5, 127.5, 127.5, 1],
    )
  })

  it('classifies large text', () => {
    assert.equal(isLargeText(24, 400), true)
    assert.equal(isLargeText(19, 700), true)
    assert.equal(isLargeText(19, 400), false)
  })

  it('injects into a page as self-contained source', () => {
    assert.equal(typeof collectContrast.toString(), 'string')
    assert.match(collectContrast.toString(), /^function collectContrast\(\)/)
  })
})

describe('diffRgba', () => {
  const pixels = (...colours) => new Uint8ClampedArray(colours.flat())

  it('counts pixels past the threshold and paints them red', () => {
    const a = pixels([255, 255, 255, 255], [0, 0, 0, 255])
    const b = pixels([255, 255, 255, 255], [255, 255, 255, 255])
    const out = new Uint8ClampedArray(8)
    assert.equal(diffRgba(a, b, out, 2, 1, 0.01), 1)
    assert.deepEqual([...out.slice(4)], [255, 0, 0, 255])
  })

  it('ignores a shift below the threshold', () => {
    const a = pixels([100, 100, 100, 255])
    const b = pixels([101, 100, 100, 255])
    assert.equal(diffRgba(a, b, new Uint8ClampedArray(4), 1, 1, 0.01), 0)
  })

  it('treats fully transparent pixels as white', () => {
    const a = pixels([0, 0, 0, 0])
    const b = pixels([255, 255, 255, 255])
    assert.equal(diffRgba(a, b, new Uint8ClampedArray(4), 1, 1, 0.01), 0)
  })
})

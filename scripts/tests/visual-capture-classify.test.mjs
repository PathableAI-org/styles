import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { posix, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { stringify } from 'yaml'

import {
  EXCLUSIONS,
  IMPORTER_RENDER_DEV_DEPS,
  RENDER_DEV_DEPS,
  classifyChanges,
  classifyLockfile,
  classifyManifest,
  classifyPath,
} from '../visual-capture/classify.mjs'
import {
  COMPARED_DIRS,
  compareTrees,
  precheckApplies,
  precheckCovers,
} from '../visual-capture/precheck.mjs'
import { captureVerdict, chooseStories } from '../visual-capture/select.mjs'

const ROOT = resolve(import.meta.dirname, '../..')

describe('classifyPath', () => {
  it('classifies render paths', () => {
    for (const path of [
      'packages/styles/src/_tokens.scss',
      'packages/styles/src/pathable-component-wrappers/pathable-button.scss',
      'apps/storybook/.storybook/preview.js',
      'apps/storybook/.storybook/manager.js',
      'components/button.md',
      'fixtures/button/default.html',
      'scripts/component-docs/render.mjs',
      'packages/react/src/test/fixture-manifest.ts',
      'packages/react/src/components/Button/Button.tsx',
      'packages/styles/scripts/new-thing.mjs',
      'packages/styles/scripts/component-pages.mjs',
      'packages/storybook-contracts/src/index.ts',
    ]) {
      assert.equal(classifyPath(path).kind, 'render', path)
    }
  })

  it('names the workspaces of each tree', () => {
    assert.deepEqual(classifyPath('components/button.md').workspaces, [
      'styles',
    ])
    assert.deepEqual(
      classifyPath('packages/react/src/test/fixture-manifest.ts').workspaces,
      ['styles'],
    )
    assert.deepEqual(
      classifyPath('packages/react/src/components/Button/Button.tsx')
        .workspaces,
      ['react'],
    )
    assert.deepEqual(
      classifyPath('apps/storybook-react/.storybook/preview.js').workspaces,
      ['react'],
    )
    assert.deepEqual(
      classifyPath('packages/storybook-contracts/src/index.ts').workspaces,
      ['react'],
    )
  })

  it('classifies paths that cannot change rendering as none, with a reason', () => {
    for (const path of [
      'apps/storybook/.storybook/test-runner.js',
      'packages/styles/scripts/lint-tokens.mjs',
      'components/README.md',
      'fixtures/README.md',
      'fixtures/harness/axe.mjs',
      'packages/react/src/theme/__tests__/x.test.ts',
      'packages/styles/README.md',
      'docs/engineering/visual-review.md',
      'scripts/visual-capture/select.mjs',
      'packages/storybook-contracts/README.md',
      'packages/storybook-contracts/test/index.test.ts',
    ]) {
      const result = classifyPath(path)
      assert.equal(result.kind, 'none', path)
      assert.ok(result.reason.length > 0, path)
    }
  })

  it('sends manifests and the lockfile to inspection', () => {
    for (const path of [
      'pnpm-lock.yaml',
      'package.json',
      'packages/styles/package.json',
      'packages/react/package.json',
      'apps/storybook/package.json',
      'apps/storybook-react/package.json',
    ]) {
      assert.equal(classifyPath(path).kind, 'inspect', path)
    }
  })

  it('exports every exclusion with a reason and a pattern', () => {
    assert.ok(EXCLUSIONS.length > 0)
    for (const { reason, match } of EXCLUSIONS) {
      assert.equal(typeof reason, 'string')
      assert.ok(match instanceof RegExp)
    }
    assert.ok(RENDER_DEV_DEPS.includes('sass'))
  })
})

describe('build scripts', () => {
  // A build script that runs a file must classify that file as render, or an
  // edit to it would skip the review.
  const SCRIPTS = [
    'build',
    'build-storybook',
    'generate',
    'build:docs',
    'build:docs-react',
  ]

  it('classifies every file a build script runs as render', () => {
    const seen = new Set()
    for (const dir of ['.', 'packages/styles', 'apps/storybook']) {
      const manifest = JSON.parse(
        readFileSync(resolve(ROOT, dir, 'package.json'), 'utf8'),
      )
      for (const name of SCRIPTS) {
        for (const file of manifest.scripts?.[name]?.match(
          /[\w./-]+\.(?:mjs|js)\b/g,
        ) ?? []) {
          seen.add(posix.normalize(posix.join(dir, file)))
        }
      }
    }
    assert.ok(seen.size > 0)
    for (const path of seen) {
      assert.equal(classifyPath(path).kind, 'render', path)
    }
  })
})

describe('classifyManifest', () => {
  const manifest = (overrides = {}) =>
    JSON.stringify({
      name: 'x',
      version: '1.0.0',
      files: ['dist'],
      scripts: { build: 'sass a b', lint: 'eslint .' },
      dependencies: { '@uswds/uswds': '3.0.0' },
      devDependencies: { sass: '1.0.0', 'test-lib': '1.0.0' },
      ...overrides,
    })
  const kind = (head, base = manifest()) =>
    classifyManifest('packages/styles/package.json', base, head).kind

  it('is none for a dev-only dependency removal and metadata edits', () => {
    assert.equal(kind(manifest({ devDependencies: { sass: '1.0.0' } })), 'none')
    assert.equal(
      kind(manifest({ version: '1.1.0', files: ['dist', 'x'] })),
      'none',
    )
    assert.equal(
      kind(
        manifest({ scripts: { build: 'sass a b', lint: 'eslint . --fix' } }),
      ),
      'none',
    )
  })

  it('is render for dependency, render dev dependency and build changes', () => {
    assert.equal(
      kind(manifest({ dependencies: { '@uswds/uswds': '3.1.0' } })),
      'render',
    )
    assert.equal(
      kind(
        manifest({ devDependencies: { sass: '1.1.0', 'test-lib': '1.0.0' } }),
      ),
      'render',
    )
    assert.equal(
      kind(manifest({ scripts: { build: 'sass a c', lint: 'eslint .' } })),
      'render',
    )
  })

  it('is render for an added or deleted file or bad JSON', () => {
    assert.equal(kind(manifest(), null), 'render')
    assert.equal(kind(null), 'render')
    assert.equal(kind('{'), 'render')
  })

  it('counts yaml as a render dev dependency of the styles package only', () => {
    assert.deepEqual(IMPORTER_RENDER_DEV_DEPS, { 'packages/styles': ['yaml'] })
    assert.equal(RENDER_DEV_DEPS.includes('yaml'), false)
    const yaml = (version) =>
      manifest({ devDependencies: { sass: '1.0.0', yaml: version } })
    assert.equal(
      classifyManifest(
        'packages/styles/package.json',
        yaml('^2.9.1'),
        yaml('^2.9.2'),
      ).kind,
      'render',
    )
    assert.equal(
      classifyManifest('package.json', yaml('^2.9.1'), yaml('^2.9.2')).kind,
      'none',
    )
  })

  it('names the workspaces by path', () => {
    assert.deepEqual(
      classifyManifest('apps/storybook-react/package.json', null, '{}')
        .workspaces,
      ['react'],
    )
    assert.deepEqual(classifyManifest('package.json', null, '{}').workspaces, [
      'styles',
      'react',
    ])
  })
})

/** A small two-document pnpm lockfile. */
const lockfile = ({ importers, snapshots, self = '12.23.0' }) =>
  `${stringify({
    importers: {
      '.': {
        packageManagerDependencies: {
          pnpm: { specifier: 'x', version: self },
        },
      },
    },
  })}---\n${stringify({ lockfileVersion: '9.0', importers, snapshots })}`

const dep = (version) => ({ specifier: version, version })

/** The shared fixture lockfile, as plain data so a test can change it. */
const baseLock = () => ({
  importers: {
    'packages/styles': {
      dependencies: { '@uswds/uswds': dep('3.0.0') },
      devDependencies: {
        sass: dep('1.0.0'),
        'eslint-plugin-x': dep('1.0.0'),
        'test-only': dep('1.0.0'),
        yaml: dep('2.9.1'),
      },
    },
    'scripts/component-docs': {
      dependencies: { 'mdast-util-from-markdown': dep('2.0.2') },
    },
    'apps/storybook': {
      dependencies: {
        '@pathableai/styles': {
          specifier: 'workspace:*',
          version: 'link:../../packages/styles',
        },
      },
      devDependencies: { '@storybook/html-vite': dep('1.0.0') },
    },
    'packages/react': {
      dependencies: { 'react-only': dep('1.0.0'), react: dep('19.3.1') },
    },
    'apps/storybook-react': {
      devDependencies: {
        '@storybook/react-vite': dep('1.0.0(react@19.3.1)'),
      },
    },
  },
  snapshots: {
    '@uswds/uswds@3.0.0': {},
    'sass@1.0.0': {},
    'eslint-plugin-x@1.0.0': { dependencies: { 'plugin-dep': '1.0.0' } },
    'plugin-dep@1.0.0': {},
    'test-only@1.0.0': { dependencies: { 'test-dep': '1.0.0' } },
    'test-dep@1.0.0': {},
    'mdast-util-from-markdown@2.0.2': {},
    'yaml@2.9.1': {},
    '@storybook/html-vite@1.0.0': { dependencies: { 'html-helper': '1.0.0' } },
    'html-helper@1.0.0': {},
    'react-only@1.0.0': {},
    'react@19.3.1': {},
    '@storybook/react-vite@1.0.0(react@19.3.1)': {
      dependencies: { react: '19.3.1' },
    },
  },
})

describe('classifyLockfile', () => {
  const base = lockfile(baseLock())
  const changed = (change, options = {}) => {
    const next = baseLock()
    change(next)
    return classifyLockfile(base, lockfile({ ...next, ...options }))
  }

  it('is none when only a test-only dev dependency and its closure go', () => {
    const result = changed((lock) => {
      delete lock.importers['packages/styles'].devDependencies['test-only']
      delete lock.snapshots['test-only@1.0.0']
      delete lock.snapshots['test-dep@1.0.0']
    })
    assert.equal(result.kind, 'none')
  })

  it('is none when an eslint plugin snapshot is bumped', () => {
    const result = changed((lock) => {
      lock.importers['packages/styles'].devDependencies['eslint-plugin-x'] =
        dep('1.1.0')
      delete lock.snapshots['eslint-plugin-x@1.0.0']
      lock.snapshots['eslint-plugin-x@1.1.0'] = {}
    })
    assert.equal(result.kind, 'none')
  })

  it('is render for styles when @uswds/uswds is bumped', () => {
    const result = changed((lock) => {
      lock.importers['packages/styles'].dependencies['@uswds/uswds'] =
        dep('3.1.0')
      lock.snapshots['@uswds/uswds@3.1.0'] = {}
    })
    assert.deepEqual([result.kind, result.workspaces], ['render', ['styles']])
    assert.deepEqual(result.parts, ['styles-package'])
  })

  it('is render for styles-package when a component-docs dependency is bumped', () => {
    const result = changed((lock) => {
      lock.importers['scripts/component-docs'].dependencies[
        'mdast-util-from-markdown'
      ] = dep('2.0.3')
      lock.snapshots['mdast-util-from-markdown@2.0.3'] = {}
    })
    assert.deepEqual([result.kind, result.workspaces], ['render', ['styles']])
    assert.deepEqual(result.parts, ['styles-package'])
  })

  it('is render for styles-package when yaml is bumped in packages/styles', () => {
    const result = changed((lock) => {
      lock.importers['packages/styles'].devDependencies.yaml = dep('2.9.2')
      lock.snapshots['yaml@2.9.2'] = {}
    })
    assert.deepEqual([result.kind, result.workspaces], ['render', ['styles']])
    assert.deepEqual(result.parts, ['styles-package'])
  })

  it('is none when yaml is bumped only in the root importer', () => {
    const before = baseLock()
    before.importers['.'] = { devDependencies: { yaml: dep('2.9.1') } }
    const after = baseLock()
    after.importers['.'] = { devDependencies: { yaml: dep('2.9.2') } }
    after.snapshots['yaml@2.9.2'] = {}
    assert.equal(
      classifyLockfile(lockfile(before), lockfile(after)).kind,
      'none',
    )
  })

  it('is render for styles when a transitive of @storybook/html-vite is bumped', () => {
    const result = changed((lock) => {
      lock.snapshots['@storybook/html-vite@1.0.0'] = {
        dependencies: { 'html-helper': '1.1.0' },
      }
      lock.snapshots['html-helper@1.1.0'] = {}
    })
    assert.deepEqual([result.kind, result.workspaces], ['render', ['styles']])
    assert.deepEqual(result.parts, ['styles-storybook'])
  })

  it('is render for react only when a React-only package is bumped', () => {
    const result = changed((lock) => {
      lock.importers['packages/react'].dependencies['react-only'] = dep('1.1.0')
      lock.snapshots['react-only@1.1.0'] = {}
    })
    assert.deepEqual([result.kind, result.workspaces], ['render', ['react']])
  })

  it('ignores the first document, which holds the pnpm self-entry', () => {
    const result = classifyLockfile(
      base,
      lockfile({ ...baseLock(), self: '12.24.0' }),
    )
    assert.equal(result.kind, 'none')
  })

  it('is render for both workspaces when it cannot compare', () => {
    for (const text of ['{ not: [valid', 'lockfileVersion: 9\n', null]) {
      const result = classifyLockfile(base, text)
      assert.deepEqual(
        [result.kind, result.workspaces],
        ['render', ['styles', 'react']],
      )
    }
  })
})

describe('classifyChanges', () => {
  const reader = (files) => (side, path) => files[side]?.[path] ?? null
  const none = () => null

  const nameStatus = (rows) => rows.map(([status, path]) => ({ status, path }))

  // `git diff --name-status --no-renames 259c6877^ 259c6877`, pinned.
  const PIXEL_SUITE_REMOVAL = nameStatus([
    ['M', '.agents/skills/orchestrate/SKILL.md'],
    ['M', '.agents/skills/verification-harness/SKILL.md'],
    ['M', '.agents/skills/visual-reviewer/SKILL.md'],
    ['M', '.github/actions/setup/action.yml'],
    ['M', '.github/pull_request_template.md'],
    ['M', '.github/workflows/storybook-quality.yml'],
    ['M', 'AGENTS.md'],
    ['D', 'apps/storybook/.storybook/pixels.js'],
    ['M', 'apps/storybook/.storybook/test-runner.js'],
    ['M', 'apps/storybook/package.json'],
    ['M', 'components/README.md'],
    ['M', 'docs/engineering/git-workflow.md'],
    ['M', 'docs/engineering/orchestration.md'],
    ['M', 'docs/engineering/verification-harness.md'],
    ['M', 'docs/engineering/visual-review.md'],
    ['M', 'docs/testing/README.md'],
    ['M', 'docs/testing/choosing-tests.md'],
    ['M', 'docs/testing/tooling-and-structure.md'],
    ['D', 'docs/testing/visual-regression.md'],
    ['M', 'package.json'],
    ['M', 'packages/styles/STORY_AUTHORING.md'],
    ['M', 'packages/styles/scripts/check-component-pages.mjs'],
    ['M', 'packages/styles/scripts/check-component-pages.test.mjs'],
    ['D', 'packages/styles/scripts/pixel-stories.mjs'],
    ['M', 'packages/styles/scripts/quality-gates.mjs'],
    ['D', 'packages/styles/scripts/test-pixels.mjs'],
    ['M', 'pnpm-lock.yaml'],
    ['M', 'scripts/component-pages-records-key.mjs'],
    ['M', 'scripts/tests/component-pages-records-key.test.mjs'],
    ['M', 'scripts/tests/visual-capture.test.mjs'],
    ['M', 'scripts/visual-capture.mjs'],
    ['M', 'scripts/visual-capture/measure.mjs'],
    ['M', 'scripts/visual-capture/select.mjs'],
  ])

  it('replays the pixel-suite removal as not required', () => {
    const manifest = (scripts, devDependencies) =>
      JSON.stringify({ scripts: { build: 'x', ...scripts }, devDependencies })
    const pixelScripts = { 'test:pixels': 'a', 'test:pixels-styles': 'b' }
    const before = baseLock()
    before.importers['apps/storybook'].devDependencies['jest-image-snapshot'] =
      dep('1.0.0')
    before.snapshots['jest-image-snapshot@1.0.0'] = {
      dependencies: { pixelmatch: '1.0.0' },
    }
    before.snapshots['pixelmatch@1.0.0'] = {}
    const result = classifyChanges({
      changes: PIXEL_SUITE_REMOVAL,
      readFile: reader({
        base: {
          'package.json': manifest(pixelScripts, {
            'jest-image-snapshot': '1.0.0',
            yaml: '^2.9.1',
          }),
          'apps/storybook/package.json': manifest(pixelScripts, {
            'jest-image-snapshot': '1.0.0',
          }),
          'pnpm-lock.yaml': lockfile(before),
        },
        head: {
          'package.json': manifest({}, { yaml: '^2.9.1' }),
          'apps/storybook/package.json': manifest({}, {}),
          'pnpm-lock.yaml': lockfile(baseLock()),
        },
      }),
    })
    assert.equal(result.required, false)
  })

  // `git diff --name-status --no-renames 6632c923^ 6632c923` (#750), pinned.
  const SHIP_ONLY_DOCUMENTED = nameStatus([
    ['M', '.agents/skills/drift-review/SKILL.md'],
    ['A', '.changeset/remove-dead-code.md'],
    ['M', '.github/ISSUE_TEMPLATE/delivery.md'],
    ['M', 'AGENTS.md'],
    ['M', 'README.md'],
    ['M', 'apps/storybook-react/.storybook/preview.js'],
    ['D', 'apps/storybook-react/.storybook/styles-js-noop.js'],
    ['M', 'apps/storybook/.storybook/preview.js'],
    ['M', 'components/button-group.md'],
    ['M', 'components/button.md'],
    ['M', 'components/card.md'],
    ['M', 'components/checkbox.md'],
    ['M', 'components/collection.md'],
    ['M', 'components/form.md'],
    ['M', 'components/icon-list.md'],
    ['M', 'components/icon.md'],
    ['M', 'components/list.md'],
    ['M', 'components/step-indicator.md'],
    ['M', 'components/summary-box.md'],
    ['M', 'components/table.md'],
    ['M', 'components/text-input.md'],
    ['M', 'docs/engineering/drift-review.md'],
    ['M', 'docs/engineering/git-workflow.md'],
    ['M', 'docs/engineering/intent.md'],
    ['M', 'docs/engineering/target-state.md'],
    ['M', 'docs/testing/visual-regression.md'],
    ['M', 'docs/theming/token-vocabulary.md'],
    ['M', 'fixtures/README.md'],
    ['M', 'packages/styles/AGENTS.md'],
    ['M', 'packages/styles/BRAND_RULES.md'],
    ['M', 'packages/styles/README.md'],
    ['M', 'packages/styles/package.json'],
    ['D', 'packages/styles/scripts/build-js.mjs'],
    ['M', 'packages/styles/scripts/copy-icons.mjs'],
    ['M', 'packages/styles/scripts/lint-tokens.mjs'],
    ['M', 'packages/styles/scripts/test-pixels.mjs'],
    ['D', 'packages/styles/src/_components-custom-properties.scss'],
    ['M', 'packages/styles/src/_semantic.scss'],
    ['M', 'packages/styles/src/_typography.scss'],
    ['M', 'packages/styles/src/_utilities-tokens.scss'],
    ['M', 'packages/styles/src/_utilities.scss'],
    ['M', 'packages/styles/src/index.scss'],
    ['D', 'packages/styles/src/js/pathable-init.ts'],
    [
      'M',
      'packages/styles/src/pathable-component-wrappers/_pathable-interaction-state-mixins.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-accordion.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-activity-list.scss',
    ],
    ['M', 'packages/styles/src/pathable-component-wrappers/pathable-all.scss'],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-app-shell-layout.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-app-shell.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-banner.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-bento-grid.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-bottom-navigation.scss',
    ],
    [
      'M',
      'packages/styles/src/pathable-component-wrappers/pathable-button.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-card-grid.scss',
    ],
    ['M', 'packages/styles/src/pathable-component-wrappers/pathable-card.scss'],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-character-count.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-checklist.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-chip-rail.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-cluster.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-combo-box.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-communication.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-container.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-content.scss',
    ],
    [
      'M',
      'packages/styles/src/pathable-component-wrappers/pathable-dark-background.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-dashboard-header.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-dashboard.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-date-picker.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-date-range-picker.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-decorative-background.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-discovery.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-display.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-embed-container.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-empty-state.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-file-input.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-filter-bar.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-filter-pill.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-filterable-option-list.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-form-controls.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-form-row.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-graphic-list.scss',
    ],
    ['D', 'packages/styles/src/pathable-component-wrappers/pathable-grid.scss'],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-header.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-heading.scss',
    ],
    ['D', 'packages/styles/src/pathable-component-wrappers/pathable-hero.scss'],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-icon-button.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-icon-tile.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-identifier.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-in-page-navigation.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-inline.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-input-mask.scss',
    ],
    [
      'M',
      'packages/styles/src/pathable-component-wrappers/pathable-input.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-interaction-controls.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-interaction-states.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-kpi-grid.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-language-selector.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-layout-composition.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-layout-docs.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-layout-grid.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-layout.scss',
    ],
    [
      'M',
      'packages/styles/src/pathable-component-wrappers/pathable-legend.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-loading.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-marketing-patterns.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-media-block.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-modal.scss',
    ],
    ['D', 'packages/styles/src/pathable-component-wrappers/pathable-nav.scss'],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-navigation.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-optional-form-section.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-page-error.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-range.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-record-header.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-resource-card.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-save-status.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-schedule-item.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-screenshot-frame.scss',
    ],
    [
      'M',
      'packages/styles/src/pathable-component-wrappers/pathable-search.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-section.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-segmented-control.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-sidebar-layout.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-site-title.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-skeleton.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-skipnav.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-split.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-stack.scss',
    ],
    [
      'M',
      'packages/styles/src/pathable-component-wrappers/pathable-step-indicator.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-sticky-panel.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-structured-workflow.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-surface.scss',
    ],
    [
      'M',
      'packages/styles/src/pathable-component-wrappers/pathable-table.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-text-highlight.scss',
    ],
    ['D', 'packages/styles/src/pathable-component-wrappers/pathable-text.scss'],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-time-picker.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-toast.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-tooltip.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-typography.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-validation.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-wayfinder.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-wizard-actions.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-wizard.scss',
    ],
    [
      'D',
      'packages/styles/src/pathable-component-wrappers/pathable-workflow-panel.scss',
    ],
    ['M', 'packages/styles/src/theme-default.scss'],
    ['M', 'packages/styles/test/selective-import.scss'],
    ['M', 'pnpm-lock.yaml'],
    ['M', 'scripts/check-agent-guidance-impact.mjs'],
    ['M', 'scripts/tests/lint-tokens.test.mjs'],
    ['M', 'scripts/tests/utility-order.test.mjs'],
  ])

  it('replays #750 as required', () => {
    const same = {
      'packages/styles/package.json': '{}',
      'pnpm-lock.yaml': lockfile(baseLock()),
    }
    const result = classifyChanges({
      changes: SHIP_ONLY_DOCUMENTED,
      readFile: reader({ base: same, head: same }),
    })
    assert.equal(result.required, true)
  })

  it('requires a review for a text input stylesheet change', () => {
    const result = classifyChanges({
      changes: [
        {
          status: 'M',
          path: 'packages/styles/src/pathable-component-wrappers/pathable-text-input.scss',
        },
      ],
      readFile: none,
    })
    assert.equal(result.required, true)
    assert.deepEqual(result.paths[0].workspaces, ['styles'])
  })

  it('does not require a review for a typescript-eslint bump', () => {
    const before = baseLock()
    before.importers['.'] = {
      devDependencies: { 'typescript-eslint': dep('8.72.2') },
    }
    before.snapshots['typescript-eslint@8.72.2'] = {}
    const after = baseLock()
    after.importers['.'] = {
      devDependencies: { 'typescript-eslint': dep('8.74.0') },
    }
    after.snapshots['typescript-eslint@8.74.0'] = {}
    const root = (version) =>
      JSON.stringify({ devDependencies: { 'typescript-eslint': version } })
    const result = classifyChanges({
      changes: [
        { status: 'M', path: 'package.json' },
        { status: 'M', path: 'pnpm-lock.yaml' },
      ],
      readFile: reader({
        base: {
          'package.json': root('^8.72.2'),
          'pnpm-lock.yaml': lockfile(before),
        },
        head: {
          'package.json': root('^8.74.0'),
          'pnpm-lock.yaml': lockfile(after),
        },
      }),
    })
    assert.equal(result.required, false)
  })
})

describe('chooseStories with the classifier', () => {
  const story = (id, importPath) => ({
    type: 'story',
    id,
    title: id,
    importPath,
  })
  const stylesIndex = [
    story('a--one', './generated/a.stories.ts'),
    story('a--two', './generated/a.stories.ts'),
    story('b--one', './generated/b.stories.ts'),
  ]

  it('chooses nothing when only the test runner changed', () => {
    assert.deepEqual(
      chooseStories({
        changedPaths: ['apps/storybook/.storybook/test-runner.js'],
        indexes: { styles: stylesIndex },
      }),
      [],
    )
  })

  it('samples the first story of each file when preview.js changed', () => {
    const chosen = chooseStories({
      changedPaths: ['apps/storybook/.storybook/preview.js'],
      indexes: { styles: stylesIndex },
    })
    assert.deepEqual(
      chosen.map((item) => item.id),
      ['a--one', 'b--one'],
    )
  })

  it('samples shared-like render paths that name no component', () => {
    for (const path of [
      'scripts/component-docs/render.mjs',
      'packages/react/src/test/fixture-manifest.ts',
      'packages/styles/scripts/copy-icons.mjs',
      'apps/storybook/scripts/copy-icons.mjs',
    ]) {
      const chosen = chooseStories({
        changedPaths: [path],
        indexes: { styles: stylesIndex },
      })
      assert.deepEqual(
        chosen.map((item) => item.id),
        ['a--one', 'b--one'],
        path,
      )
    }
  })

  it('samples every file of each Storybook for a forced run with nothing chosen', () => {
    const reactIndex = [story('r--one', './src/r.stories.tsx')]
    const chosen = chooseStories({
      changedPaths: [],
      indexes: { styles: stylesIndex, react: reactIndex },
      force: true,
    })
    assert.deepEqual(
      chosen.map((item) => `${item.workspace}:${item.id}`),
      ['react:r--one', 'styles:a--one', 'styles:b--one'],
    )
    assert.deepEqual(
      chooseStories({
        changedPaths: [],
        indexes: { styles: stylesIndex },
        extra: ['a--two'],
        force: true,
      }).map((item) => item.id),
      ['a--two'],
    )
  })

  it('does not sample the styles Storybook for a React-only lockfile change', () => {
    const chosen = chooseStories({
      changedPaths: ['pnpm-lock.yaml'],
      classification: [
        {
          path: 'pnpm-lock.yaml',
          render: true,
          workspaces: ['react'],
        },
      ],
      indexes: { styles: stylesIndex },
    })
    assert.deepEqual(chosen, [])
  })
})

describe('captureVerdict', () => {
  const same = { status: 'same' }
  const verdict = (overrides) =>
    captureVerdict({
      errors: [],
      pairs: [same],
      stories: [{ changed: false }],
      force: false,
      ...overrides,
    })

  it('is no-difference only for a clean capture of matching pairs', () => {
    assert.equal(verdict({}), 'no-difference')
  })

  it('is review for no pairs, a different pair, a changed story or an error', () => {
    assert.equal(verdict({ pairs: [] }), 'review')
    assert.equal(verdict({ pairs: [same, { status: 'different' }] }), 'review')
    assert.equal(verdict({ stories: [{ changed: true }] }), 'review')
    assert.equal(verdict({ errors: [{ step: 'x' }] }), 'review')
  })

  it('is always review under force', () => {
    assert.equal(verdict({ force: true }), 'review')
  })
})

describe('pre-check', () => {
  it('covers styles source, component pages and the lockfile', () => {
    assert.equal(
      precheckCovers([
        'packages/styles/src/_tokens.scss',
        'components/button.md',
        'fixtures/button/default.html',
        'pnpm-lock.yaml',
      ]),
      true,
    )
  })

  it('does not cover Storybook config, React paths or unlisted files', () => {
    for (const path of [
      'apps/storybook/.storybook/preview.js',
      'packages/react/src/components/Button/Button.tsx',
      'package.json',
      'packages/styles/scripts/new-thing.mjs',
    ]) {
      assert.equal(
        precheckCovers(['packages/styles/src/_tokens.scss', path]),
        false,
        path,
      )
    }
  })

  it('applies only without React and with an unchanged styles closure', () => {
    const entry = (path, workspaces) => ({ path, render: true, workspaces })
    assert.equal(
      precheckApplies({
        paths: [entry('packages/styles/src/a.scss', ['styles'])],
      }),
      true,
    )
    const withLock = (lock) => ({
      paths: [
        entry('packages/styles/src/a.scss', ['styles']),
        { ...entry('pnpm-lock.yaml', ['styles']), ...lock },
      ],
    })
    assert.equal(precheckApplies(withLock({ parts: ['styles-package'] })), true)
    assert.equal(
      precheckApplies(withLock({ parts: ['styles-storybook'] })),
      false,
    )
    assert.equal(precheckApplies(withLock({})), false)
    assert.equal(
      precheckApplies({ paths: [entry('pnpm-lock.yaml', ['react'])] }),
      false,
    )
  })

  it('compares the styles fonts output too', () => {
    assert.ok(COMPARED_DIRS.includes('packages/styles/fonts'))
  })

  it('compares trees by hash', () => {
    const base = new Map([
      ['a', '1'],
      ['b', '2'],
      ['c', '3'],
    ])
    assert.equal(compareTrees(base, new Map(base)).same, true)
    const head = new Map([
      ['a', '1'],
      ['b', 'X'],
      ['d', '4'],
    ])
    const result = compareTrees(base, head)
    assert.equal(result.same, false)
    assert.deepEqual(result.added, ['d'])
    assert.deepEqual(result.removed, ['c'])
    assert.deepEqual(result.changed, ['b'])
  })

  it('caps the sample of differences', () => {
    const head = new Map(
      Array.from({ length: 50 }, (_, index) => [`f${index}`, '1']),
    )
    const result = compareTrees(new Map(), head)
    assert.ok(result.added.length < 50)
    assert.equal(result.total.added, 50)
  })
})

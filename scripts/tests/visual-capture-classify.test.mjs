import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { posix, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { stringify } from 'yaml'

import {
  EXCLUSIONS,
  RENDER_DEV_DEPS,
  classifyChanges,
  classifyLockfile,
  classifyManifest,
  classifyPath,
} from '../visual-capture/classify.mjs'
import {
  compareTrees,
  precheckApplies,
  precheckCovers,
} from '../visual-capture/precheck.mjs'
import { chooseStories } from '../visual-capture/select.mjs'

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
  })

  it('classifies paths that cannot change rendering as none, with a reason', () => {
    for (const path of [
      'apps/storybook/.storybook/test-runner.js',
      'packages/styles/scripts/lint-tokens.mjs',
      'packages/styles/scripts/component-pages.mjs',
      'components/README.md',
      'fixtures/README.md',
      'fixtures/harness/axe.mjs',
      'packages/react/src/theme/__tests__/x.test.ts',
      'packages/styles/README.md',
      'docs/engineering/visual-review.md',
      'scripts/visual-capture/select.mjs',
      'packages/storybook-contracts/src/index.ts',
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
  // edit to it would skip the review. component-pages.mjs is the one named
  // exception: `build` runs it, but it writes the shipped consumer component
  // pages, which Storybook does not render.
  const EXCEPTIONS = new Set(['packages/styles/scripts/component-pages.mjs'])
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
      assert.equal(
        classifyPath(path).kind,
        EXCEPTIONS.has(path) ? 'none' : 'render',
        path,
      )
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
      },
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

  it('replays the pixel-suite removal as not required', () => {
    const manifest = (devDependencies) =>
      JSON.stringify({ scripts: { build: 'x' }, devDependencies })
    const before = baseLock()
    before.importers['apps/storybook'].devDependencies['jest-image-snapshot'] =
      dep('1.0.0')
    before.snapshots['jest-image-snapshot@1.0.0'] = {
      dependencies: { pixelmatch: '1.0.0' },
    }
    before.snapshots['pixelmatch@1.0.0'] = {}
    const result = classifyChanges({
      changes: [
        { status: 'D', path: 'apps/storybook/.storybook/pixels.js' },
        { status: 'M', path: 'apps/storybook/.storybook/test-runner.js' },
        { status: 'M', path: 'apps/storybook/package.json' },
        { status: 'D', path: 'packages/styles/scripts/test-pixels.mjs' },
        { status: 'D', path: 'packages/styles/scripts/pixel-stories.mjs' },
        {
          status: 'M',
          path: 'packages/styles/scripts/check-component-pages.mjs',
        },
        { status: 'M', path: 'components/README.md' },
        { status: 'M', path: 'docs/testing/visual-regression.md' },
        { status: 'M', path: 'pnpm-lock.yaml' },
      ],
      readFile: reader({
        base: {
          'apps/storybook/package.json': manifest({
            'jest-image-snapshot': '1.0.0',
          }),
          'pnpm-lock.yaml': lockfile(before),
        },
        head: {
          'apps/storybook/package.json': manifest({}),
          'pnpm-lock.yaml': lockfile(baseLock()),
        },
      }),
    })
    assert.equal(result.required, false)
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

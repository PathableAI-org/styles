/**
 * Decide, from the paths a diff changes, whether it can change what a
 * Storybook renders and so needs a visual review. Pure functions only; the
 * caller passes in file text. This module is the single owner of the rule.
 *
 * A path is `render` (it can change rendering), `none` (it cannot) or
 * `inspect` (a manifest or the lockfile, where the content decides). A path
 * nobody listed inside a render tree is `render`, so a gap only over-triggers.
 */

import { isDeepStrictEqual } from 'node:util'
import { posix } from 'node:path'
import { parseAllDocuments } from 'yaml'

const BOTH = ['styles', 'react']

/** Render trees, most specific first: `[prefix or exact path, workspaces]`. */
const TREES = [
  ['packages/react/src/test/fixture-manifest.ts', ['styles']],
  ['packages/styles/', ['styles']],
  ['apps/storybook/', ['styles']],
  ['components/', ['styles']],
  ['fixtures/', ['styles']],
  ['scripts/component-docs/', ['styles']],
  ['packages/react/', ['react']],
  ['apps/storybook-react/', ['react']],
]

/** Paths whose content decides: manifests and the lockfile. */
const INSPECT = {
  'pnpm-lock.yaml': BOTH,
  'package.json': BOTH,
  'packages/styles/package.json': ['styles'],
  'packages/react/package.json': ['react'],
  'apps/storybook/package.json': ['styles'],
  'apps/storybook-react/package.json': ['react'],
}

/**
 * Paths inside a render tree that cannot change rendering, each with the
 * reason it gives. Checked in order.
 */
export const EXCLUSIONS = [
  {
    reason: 'A test file.',
    match: /\.test\.(?:js|mjs|ts|tsx)$/,
  },
  { reason: 'A test file.', match: /(?:^|\/)__tests__\// },
  { reason: 'A test file.', match: /^packages\/styles\/test\// },
  {
    reason: 'A test file.',
    match: /^packages\/react\/src\/test\/(?!fixture-manifest\.ts$)/,
  },
  {
    reason: 'Prose, not a component page.',
    match: /^(?!components\/(?!README\.md$)[^/]+\.md$).*\.md$/,
  },
  {
    reason: 'Fixture checking tooling, not fixture markup.',
    match: /^fixtures\/(?:harness\/|scripts\/)/,
  },
  {
    reason: 'Fixture checking configuration.',
    match: /^fixtures\/(?:package\.json|\.htmlvalidate\.json|\.gitignore)$/,
  },
  {
    reason: 'The Storybook test runner, which does not render stories.',
    match: /^apps\/storybook(?:-react)?\/\.storybook\/test-runner\.js$/,
  },
  {
    reason: 'A check or test script, not part of any build.',
    match:
      /^packages\/styles\/scripts\/(?:lint-tokens|check-component-pages|quality-gates|storybook-coverage|test-visual|test-pixels|pixel-stories)\.mjs$/,
  },
  {
    reason:
      'Writes the shipped consumer component pages, which Storybook does not render.',
    match: /^packages\/styles\/scripts\/component-pages\.mjs$/,
  },
  {
    reason: 'The retired pixel suite, which never fed a Storybook build.',
    match: /^apps\/storybook\/\.storybook\/pixels\.js$/,
  },
  {
    reason: 'Lint or validator configuration.',
    match:
      /(?:^|\/)(?:\.stylelintrc[^/]*|eslint\.config\.[^/]+|\.markdownlint[^/]*|\.prettierrc[^/]*|vitest\.config\.[^/]+)$/,
  },
]

/**
 * Dev dependencies that can change rendering; a trailing `*` matches a scope
 * or prefix.
 */
export const RENDER_DEV_DEPS = [
  'sass',
  '@fontsource/*',
  '@uswds/uswds',
  'storybook',
  '@storybook/html-vite',
  '@storybook/react-vite',
  '@storybook/addon-docs',
  '@storybook/addon-a11y',
  'react',
  'react-dom',
  'vite',
  '@vitejs/*',
  '@pathableai/styles',
  '@pathableai/react',
  '@pathableai/component-docs',
]

/** Manifest scripts that run in a build; `pre` and `post` hooks count too. */
const BUILD_SCRIPTS = [
  'build',
  'build-storybook',
  'generate',
  'build:docs',
  'build:docs-react',
]

/** Whether a package name is a render dev dependency. */
export function isRenderDevDep(name) {
  return RENDER_DEV_DEPS.some((pattern) =>
    pattern.endsWith('*')
      ? name.startsWith(pattern.slice(0, -1))
      : name === pattern,
  )
}

/**
 * Classify one repository path.
 * Returns `{ kind: 'render' | 'none' | 'inspect', workspaces, reason }`.
 */
export function classifyPath(path) {
  if (Object.hasOwn(INSPECT, path)) {
    return {
      kind: 'inspect',
      workspaces: [...INSPECT[path]],
      reason: 'Its content decides.',
    }
  }
  const tree = TREES.find(([prefix]) =>
    prefix.endsWith('/') ? path.startsWith(prefix) : path === prefix,
  )
  if (!tree) {
    return { kind: 'none', workspaces: [], reason: 'Outside the render trees.' }
  }
  const exclusion = EXCLUSIONS.find(({ match }) => match.test(path))
  if (exclusion) {
    return { kind: 'none', workspaces: [], reason: exclusion.reason }
  }
  return {
    kind: 'render',
    workspaces: [...tree[1]],
    reason: `In the ${tree[0]} render tree.`,
  }
}

const renderBoth = (reason) => ({
  kind: 'render',
  workspaces: [...BOTH],
  reason,
})

/**
 * Resolve a manifest to render or none from its base and head text (`null`
 * when the file is missing at that side).
 */
export function classifyManifest(path, baseText, headText) {
  const workspaces = [...(INSPECT[path] ?? BOTH)]
  const render = (reason) => ({ kind: 'render', workspaces, reason })
  if (baseText === null || headText === null) {
    return render('The manifest was added or deleted.')
  }
  let base
  let head
  try {
    base = JSON.parse(baseText)
    head = JSON.parse(headText)
  } catch {
    return render('The manifest does not parse.')
  }
  for (const field of ['dependencies', 'peerDependencies', 'exports']) {
    if (!isDeepStrictEqual(base[field], head[field])) {
      return render(`"${field}" changed.`)
    }
  }
  const baseDev = base.devDependencies ?? {}
  const headDev = head.devDependencies ?? {}
  for (const name of new Set([
    ...Object.keys(baseDev),
    ...Object.keys(headDev),
  ])) {
    if (isRenderDevDep(name) && baseDev[name] !== headDev[name]) {
      return render(`devDependency ${name} changed.`)
    }
  }
  const baseScripts = base.scripts ?? {}
  const headScripts = head.scripts ?? {}
  for (const name of BUILD_SCRIPTS.flatMap((script) => [
    script,
    `pre${script}`,
    `post${script}`,
  ])) {
    if (baseScripts[name] !== headScripts[name]) {
      return render(`Script "${name}" changed.`)
    }
  }
  return {
    kind: 'none',
    workspaces: [],
    reason: 'No dependency, export or build script change.',
  }
}

/**
 * The parts of the resolved closure, each with its importer roots and whether
 * `link:` entries are followed. `styles-package` shows in
 * `packages/styles/dist`; `styles-storybook` (Storybook, Vite, React and the
 * Vite-side sass) is bundled straight into the iframe, so the output pre-check
 * cannot see it, and its links are covered by their own parts or by
 * `apps/storybook/generated`. Known limit: a sass bump changes both styles
 * parts, so the pre-check does not apply to it.
 */
const CLOSURE_PARTS = {
  'styles-package': { roots: ['packages/styles'], follow: true },
  'styles-storybook': { roots: ['apps/storybook'], follow: false },
  react: { roots: ['packages/react', 'apps/storybook-react'], follow: true },
}

/** The `name@version` set one workspace resolves to in a lockfile. */
function closure(importers, snapshots, roots, follow = true) {
  const found = new Set()
  const importersSeen = new Set()

  const visitSnapshot = (name, version) => {
    const key = `${name}@${version}`
    if (found.has(key)) return
    found.add(key)
    const snapshot = snapshots[key]
    if (!snapshot) return
    const next = { ...snapshot.dependencies, ...snapshot.optionalDependencies }
    for (const [child, childVersion] of Object.entries(next)) {
      visitSnapshot(child, String(childVersion))
    }
  }

  const visitImporter = (importerPath) => {
    if (importersSeen.has(importerPath)) return
    importersSeen.add(importerPath)
    const importer = importers[importerPath]
    if (!importer || typeof importer !== 'object') {
      throw new Error(`missing importer ${importerPath}`)
    }
    const deps = [
      ...Object.entries(importer.dependencies ?? {}),
      ...Object.entries(importer.optionalDependencies ?? {}),
      ...Object.entries(importer.devDependencies ?? {}).filter(([name]) =>
        isRenderDevDep(name),
      ),
    ]
    for (const [name, entry] of deps) {
      const version = String(entry?.version ?? entry)
      if (version.startsWith('link:')) {
        if (follow) {
          visitImporter(
            posix.normalize(posix.join(importerPath, version.slice(5))),
          )
        }
      } else {
        visitSnapshot(name, version)
      }
    }
  }

  for (const root of roots) visitImporter(root)
  return found
}

/** Parse a lockfile's second document into `{ importers, snapshots }`. */
function parseLockfile(text) {
  const documents = parseAllDocuments(text)
  if (documents.length < 2 || documents.some((doc) => doc.errors.length > 0)) {
    throw new Error('the lockfile does not parse as two documents')
  }
  const body = documents[1].toJS()
  if (!body?.importers) throw new Error('the lockfile has no importers')
  return { importers: body.importers, snapshots: body.snapshots ?? {} }
}

/**
 * Resolve the lockfile to render or none: render for the workspaces whose
 * resolved dependency closure changed. Anything unparseable is render for both.
 */
export function classifyLockfile(baseText, headText) {
  try {
    if (baseText === null || headText === null) throw new Error('missing')
    const base = parseLockfile(baseText)
    const head = parseLockfile(headText)
    const parts = Object.entries(CLOSURE_PARTS)
      .filter(([, { roots, follow }]) => {
        const before = closure(base.importers, base.snapshots, roots, follow)
        const after = closure(head.importers, head.snapshots, roots, follow)
        return (
          before.size !== after.size ||
          [...before].some((key) => !after.has(key))
        )
      })
      .map(([name]) => name)
    const changed = [
      ...(parts.some((part) => part.startsWith('styles')) ? ['styles'] : []),
      ...(parts.includes('react') ? ['react'] : []),
    ]
    if (changed.length === 0) {
      return {
        kind: 'none',
        workspaces: [],
        reason: 'No render dependency closure changed.',
      }
    }
    return {
      kind: 'render',
      workspaces: changed,
      parts,
      reason: `The resolved dependencies of ${changed.join(' and ')} changed.`,
    }
  } catch {
    return renderBoth('The lockfile could not be compared.')
  }
}

/**
 * Classify a diff.
 *
 * - `changes`: `[{ status, path }]` from `git diff --name-status`
 * - `readFile(side, path)`: the file's text at `'base'` or `'head'`, or `null`
 *
 * Returns `{ required, paths: [{ path, status, render, workspaces, reason }] }`.
 */
export function classifyChanges({ changes, readFile }) {
  const paths = changes.map(({ status, path }) => {
    let result = classifyPath(path)
    if (result.kind === 'inspect') {
      const base = readFile('base', path)
      const head = readFile('head', path)
      result =
        path === 'pnpm-lock.yaml'
          ? classifyLockfile(base, head)
          : classifyManifest(path, base, head)
    }
    const render = result.kind === 'render'
    return {
      path,
      status,
      render,
      workspaces: render ? result.workspaces : [],
      ...(result.parts && { parts: result.parts }),
      reason: result.reason,
    }
  })
  return { required: paths.some((entry) => entry.render), paths }
}

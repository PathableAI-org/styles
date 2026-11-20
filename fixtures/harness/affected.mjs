/**
 * Selects the fixture folders a change can affect, from the compiled CSS
 * alone. No file mapping is declared anywhere: the selection follows what the
 * stylesheet actually compiles to.
 *
 *   1. Compile `styles.css` at the base (the merge base) and at the head. The
 *      base compiles in a temporary git worktree with the head's
 *      `node_modules`, so there is no second install. When the lockfile, the
 *      pnpm patches or the `@uswds/uswds` range changed, the dependencies
 *      differ between the two sides, so every fixture is selected instead.
 *   2. Diff the rules with PostCSS. A rule is keyed by its at-rule context and
 *      its selector; its declarations are compared property by property.
 *   3. A changed, added or removed rule contributes the classes its selector
 *      names. A changed custom property contributes the classes of every rule
 *      that reads it through `var()`, followed transitively through custom
 *      properties defined from it.
 *   4. A fixture folder is selected when one of its HTML files uses one of
 *      those classes (or names one of those custom properties).
 *
 * Every fixture is selected when a change cannot be narrowed to classes: a
 * changed rule whose selector names no class (element selectors, the reset,
 * `@font-face`, keyframes), a custom property that changed and that no rule
 * reads, or a property read by a rule that names no class.
 *
 *   node fixtures/harness/affected.mjs --base <ref> [--head <ref>] [--json <file>]
 *
 * `--head` defaults to the working tree. The selection is printed as JSON (and
 * written to `--json` when given): `{ all, allReasons, folders: { <folder>:
 * { files, reasons } } }`, each reason naming the class or custom property,
 * the selector, and the source file (from the Sass source map) it came from.
 */

import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import process from 'node:process'
import { join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { classesInSelector } from '../../packages/styles/scripts/check-component-pages.mjs'

export const repoRoot = resolve(import.meta.dirname, '../..')
export const fixturesDir = resolve(import.meta.dirname, '..')
const stylesPackage = 'packages/styles'

// The compiler and parser are the styles package's own, so the base and the
// head compile with exactly what the package builds with.
const stylesRequire = createRequire(
  join(repoRoot, stylesPackage, 'package.json'),
)
const postcss = stylesRequire('postcss')
const sass = stylesRequire('sass')

/** Paths whose change means the two sides do not share dependencies. */
const DEPENDENCY_PATHS = [
  /^pnpm-lock\.yaml$/u,
  /^pnpm-workspace\.yaml$/u,
  /^patches\//u,
]

/** Paths whose change can change the compiled stylesheet. */
const STYLESHEET_PATHS = [
  /^packages\/styles\/src\/.*\.s[ac]ss$/u,
  /^packages\/styles\/package\.json$/u,
]

const CUSTOM_PROPERTY = /^--/u
const VAR_REFERENCE = /var\(\s*(--[\w-]+)/gu

// ---------------------------------------------------------------------------
// Compiling
// ---------------------------------------------------------------------------

/**
 * Compiles `src/index.scss` of a styles package directory, with a source map.
 * `loadPaths` defaults to the head's USWDS packages, which is how the base
 * reuses the head's `node_modules`.
 */
export function compileStyles(
  packageDir,
  entry = 'src/index.scss',
  loadPaths = [
    join(repoRoot, stylesPackage, 'node_modules/@uswds/uswds/packages'),
  ],
) {
  const result = sass.compile(join(packageDir, entry), {
    loadPaths,
    quietDeps: true,
    logger: sass.Logger.silent,
    sourceMap: true,
    style: 'expanded',
  })
  return { css: result.css, map: result.sourceMap }
}

// ---------------------------------------------------------------------------
// Reading rules
// ---------------------------------------------------------------------------

/** Where a node came from in the Sass sources, as `path:line`, relative to `root`. */
function originOf(node, root) {
  const start = node.source?.start
  const input = node.source?.input
  if (!start || !input) return null
  const origin = input.map ? input.origin(start.line, start.column) : null
  if (!origin) return null
  const file = origin.file.startsWith('file:')
    ? fileURLToPath(origin.file)
    : origin.file
  const path = root ? relative(root, file).split(sep).join('/') : file
  return `${path}:${origin.line}`
}

function contextOf(node) {
  const chain = []
  for (
    let parent = node.parent;
    parent && parent.type !== 'root';
    parent = parent.parent
  ) {
    if (parent.type === 'atrule')
      chain.unshift(`@${parent.name} ${parent.params}`.trim())
  }
  return chain
}

const normalize = (text) => text.replace(/\s+/gu, ' ').trim()

/**
 * Reads compiled CSS into rule groups. A group is every rule with the same
 * at-rule context and selector (the same selector can appear in several
 * places, for example a USWDS rule and its wrapper), with its declarations in
 * order. At-rules that hold declarations directly, such as `@font-face`, are
 * groups too, with no classes.
 *
 * Each group also records, per custom property it reads through `var()`, the
 * properties of its own that read it, so a change can be followed.
 */
export function readRules(css, { map, root } = {}) {
  const ast = postcss.parse(css, {
    from: 'styles.css',
    map: map ? { prev: map, inline: false, annotation: false } : false,
  })
  const groups = new Map()

  const groupFor = (node, selector) => {
    const context = contextOf(node)
    const key = [...context, selector].join(' >> ')
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        selector,
        classes: selector.startsWith('@')
          ? new Set()
          : classesInSelector(selector),
        decls: [],
      })
    }
    return groups.get(key)
  }

  ast.walk((node) => {
    if (node.type !== 'decl') return
    const parent = node.parent
    let group
    if (parent.type === 'rule') {
      // Keyframe steps (`from`, `50%`) are rules too; key them under their
      // @keyframes context like any other rule.
      group = groupFor(parent, normalize(parent.selector))
    } else if (parent.type === 'atrule') {
      group = groupFor(parent, normalize(`@${parent.name} ${parent.params}`))
    } else {
      return
    }
    group.decls.push({
      prop: node.prop,
      value: normalize(`${node.value}${node.important ? ' !important' : ''}`),
      reads: [...node.value.matchAll(VAR_REFERENCE)].map(([, name]) => name),
      node,
      root,
    })
  })
  return groups
}

const valuesByProp = (decls) => {
  const byProp = new Map()
  for (const decl of decls) {
    if (!byProp.has(decl.prop)) byProp.set(decl.prop, [])
    byProp.get(decl.prop).push(decl)
  }
  return byProp
}

const sameValues = (a = [], b = []) =>
  a.length === b.length &&
  a.every((decl, index) => decl.value === b[index].value)

// ---------------------------------------------------------------------------
// Diffing
// ---------------------------------------------------------------------------

/**
 * Diffs two compiled stylesheets. Returns the classes the change touches, each
 * with its reasons, and the reasons, if any, every fixture must be selected.
 *
 *   classes: Map<class, Reason[]>
 *   tokens:  Map<custom property, Reason[]> (changed custom properties, also
 *            matched against fixture HTML, for inline styles)
 *   all:     Reason[]
 *
 * A Reason is `{ class?, token?, via, selector, source }`.
 */
export function diffStyles(base, head) {
  const before = readRules(base.css, base)
  const after = readRules(head.css, head)
  const classes = new Map()
  const tokens = new Map()
  const all = []

  const addClass = (name, reason) => {
    if (!classes.has(name)) classes.set(name, [])
    classes.get(name).push({ class: name, ...reason })
  }

  const changedTokens = new Map()
  const keys = new Set([...before.keys(), ...after.keys()])
  for (const key of keys) {
    const was = before.get(key)
    const now = after.get(key)
    const wasProps = valuesByProp(was?.decls ?? [])
    const nowProps = valuesByProp(now?.decls ?? [])
    const props = new Set([...wasProps.keys(), ...nowProps.keys()])
    const changed = [...props].filter(
      (prop) => !sameValues(wasProps.get(prop), nowProps.get(prop)),
    )
    if (changed.length === 0) continue

    const group = now ?? was
    const status = !was ? 'added' : !now ? 'removed' : 'changed'
    const sourceOf = (prop) => {
      const decl = (nowProps.get(prop) ?? wasProps.get(prop))[0]
      return originOf(decl.node, decl.root)
    }
    const source = sourceOf(changed[0])

    for (const name of group.classes) {
      addClass(name, {
        via: `rule ${status}`,
        selector: group.selector,
        source,
      })
    }

    const plain = changed.filter((prop) => !CUSTOM_PROPERTY.test(prop))
    if (group.classes.size === 0 && plain.length > 0) {
      all.push({
        via: `rule ${status} with no class`,
        selector: group.selector,
        property: plain[0],
        source: sourceOf(plain[0]),
      })
    }
    for (const prop of changed.filter((name) => CUSTOM_PROPERTY.test(name))) {
      if (!changedTokens.has(prop)) {
        changedTokens.set(prop, {
          selector: group.selector,
          source: sourceOf(prop),
          classless: group.classes.size === 0,
        })
      }
    }
  }

  // Follow each changed custom property to the rules that read it, on either
  // side, and through custom properties defined from it.
  const readers = new Map()
  for (const groups of [before, after]) {
    for (const group of groups.values()) {
      for (const decl of group.decls) {
        for (const name of decl.reads) {
          if (!readers.has(name)) readers.set(name, [])
          readers.get(name).push({ group, decl })
        }
      }
    }
  }

  for (const [token, origin] of changedTokens) {
    const seen = new Set([token])
    const queue = [{ name: token, chain: [token] }]
    tokens.set(token, [
      {
        token,
        via: 'custom property changed',
        selector: origin.selector,
        source: origin.source,
      },
    ])
    let readByAnything = false

    while (queue.length > 0) {
      const { name, chain } = queue.shift()
      for (const { group, decl } of readers.get(name) ?? []) {
        readByAnything = true
        const via = `reads ${chain.join(' → ')} through var()`
        for (const cls of group.classes) {
          addClass(cls, {
            token,
            via,
            selector: group.selector,
            source: origin.source,
          })
        }
        if (CUSTOM_PROPERTY.test(decl.prop)) {
          if (!seen.has(decl.prop)) {
            seen.add(decl.prop)
            tokens.set(decl.prop, [
              { token, via, selector: group.selector, source: origin.source },
            ])
            queue.push({ name: decl.prop, chain: [...chain, decl.prop] })
          }
        } else if (group.classes.size === 0) {
          all.push({
            token,
            via: `${via} in a rule with no class`,
            selector: group.selector,
            source: origin.source,
          })
        }
      }
    }

    if (!readByAnything && origin.classless) {
      all.push({
        token,
        via: 'custom property changed and no rule reads it',
        selector: origin.selector,
        source: origin.source,
      })
    }
  }

  return { classes, tokens, all }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** Every fixture folder (except the harness) and its HTML files. */
export function readFixtures(dir = fixturesDir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        entry.name !== 'harness' &&
        entry.name !== 'node_modules',
    )
    .map((entry) => ({
      folder: entry.name,
      files: readdirSync(join(dir, entry.name))
        .filter((file) => file.endsWith('.html'))
        .sort()
        .map((file) => ({
          path: relative(repoRoot, join(dir, entry.name, file))
            .split(sep)
            .join('/'),
          html: readFileSync(join(dir, entry.name, file), 'utf8'),
        })),
    }))
    .filter((fixture) => fixture.files.length > 0)
    .sort((a, b) => a.folder.localeCompare(b.folder))
}

/** The classes an HTML document uses in `class` attributes. */
export function classesInHtml(html) {
  const classes = new Set()
  for (const [, , value] of html.matchAll(/\sclass\s*=\s*(["'])(.*?)\1/gsu)) {
    for (const name of value.split(/\s+/u)) if (name) classes.add(name)
  }
  return classes
}

/**
 * Turns a diff into a selection over the given fixtures.
 * `extraAll` adds reasons to select everything (for example a lockfile change).
 */
export function selectFixtures(diff, fixtures, extraAll = []) {
  const allReasons = [...extraAll, ...diff.all]
  const all = allReasons.length > 0
  const folders = {}

  for (const { folder, files } of fixtures) {
    const reasons = []
    const matched = new Set()
    for (const file of files) {
      const used = classesInHtml(file.html)
      for (const name of used) {
        for (const reason of diff.classes.get(name) ?? []) {
          reasons.push({ ...reason, file: file.path })
          matched.add(file.path)
        }
      }
      for (const [token, tokenReasons] of diff.tokens) {
        if (!file.html.includes(token)) continue
        for (const reason of tokenReasons) {
          reasons.push({
            ...reason,
            token,
            via: `${reason.via}; named in the fixture`,
            file: file.path,
          })
          matched.add(file.path)
        }
      }
    }
    if (all || reasons.length > 0) {
      folders[folder] = {
        files: all
          ? files.map((file) => file.path)
          : files.map((file) => file.path).filter((path) => matched.has(path)),
        reasons: all
          ? allReasons.map((reason) => ({ ...reason, all: true }))
          : dedupe(reasons),
      }
    }
  }
  return { all, allReasons, folders }
}

function dedupe(reasons) {
  const seen = new Set()
  return reasons.filter((reason) => {
    const key = JSON.stringify(reason)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ---------------------------------------------------------------------------
// Git
// ---------------------------------------------------------------------------

const git = (args, cwd = repoRoot) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()

/**
 * Reasons to select every fixture from the changed paths alone: changed
 * dependencies mean the base and the head do not compile with the same
 * packages, so the CSS diff cannot be trusted.
 */
export function dependencyReasons(changedPaths, uswds = {}) {
  const reasons = changedPaths
    .filter((path) => DEPENDENCY_PATHS.some((pattern) => pattern.test(path)))
    .map((path) => ({ via: 'dependencies changed', source: path }))
  if (uswds.base !== uswds.head) {
    reasons.push({
      via: `@uswds/uswds changed from ${uswds.base ?? 'none'} to ${uswds.head ?? 'none'}`,
      source: `${stylesPackage}/package.json`,
    })
  }
  return reasons
}

const uswdsRange = (json) => {
  if (!json) return undefined
  const pkg = JSON.parse(json)
  return (
    pkg.dependencies?.['@uswds/uswds'] ?? pkg.devDependencies?.['@uswds/uswds']
  )
}

const readAt = (ref, path) => {
  try {
    return ref
      ? git(['show', `${ref}:${path}`])
      : readFileSync(join(repoRoot, path), 'utf8')
  } catch {
    return undefined
  }
}

/** Compiles the base in a temporary worktree, reusing the head's node_modules. */
function compileAt(ref) {
  const dir = mkdtempSync(join(tmpdir(), 'fixtures-affected-'))
  const worktree = join(dir, 'base')
  git(['worktree', 'add', '--detach', '--quiet', worktree, ref])
  try {
    return { ...compileStyles(join(worktree, stylesPackage)), root: worktree }
  } finally {
    git(['worktree', 'remove', '--force', worktree])
    rmSync(dir, { recursive: true, force: true })
  }
}

/**
 * The whole selection for `base...head` (`head` undefined: the working tree,
 * compared with the merge base of `base` and HEAD).
 */
export function affected({ base, head } = {}) {
  const mergeBase = git(['merge-base', base, head ?? 'HEAD'])
  const changedPaths = (
    head
      ? git(['diff', '--name-only', mergeBase, head])
      : git(['diff', '--name-only', mergeBase])
  )
    .split('\n')
    .filter(Boolean)

  const uswds = {
    base: uswdsRange(readAt(mergeBase, `${stylesPackage}/package.json`)),
    head: uswdsRange(readAt(head, `${stylesPackage}/package.json`)),
  }
  const fixtures = readFixtures()
  const extraAll = dependencyReasons(changedPaths, uswds)
  const meta = {
    base: mergeBase,
    head: head ? git(['rev-parse', head]) : 'working tree',
    changedPaths,
  }

  if (extraAll.length > 0) {
    return {
      ...meta,
      ...selectFixtures(
        { classes: new Map(), tokens: new Map(), all: [] },
        fixtures,
        extraAll,
      ),
    }
  }
  if (
    !changedPaths.some((path) =>
      STYLESHEET_PATHS.some((pattern) => pattern.test(path)),
    )
  ) {
    return {
      ...meta,
      all: false,
      allReasons: [],
      folders: {},
      note: 'No stylesheet source changed.',
    }
  }

  const baseCss = compileAt(mergeBase)
  const headCss = head
    ? compileAt(head)
    : { ...compileStyles(join(repoRoot, stylesPackage)), root: repoRoot }
  return { ...meta, ...selectFixtures(diffStyles(baseCss, headCss), fixtures) }
}

function parseArgs(argv) {
  const args = {}
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index]
    if (flag === '--base' || flag === '--head' || flag === '--json') {
      args[flag.slice(2)] = argv[index + 1]
      index += 1
    } else {
      throw new Error(`Unknown argument: ${flag}`)
    }
  }
  if (!args.base)
    throw new Error(
      'Usage: affected.mjs --base <ref> [--head <ref>] [--json <file>]',
    )
  return args
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const args = parseArgs(process.argv.slice(2))
    const selection = affected(args)
    const json = `${JSON.stringify(selection, null, 2)}\n`
    if (args.json) writeFileSync(args.json, json)
    process.stdout.write(json)
  } catch (error) {
    process.stderr.write(`[fixtures:affected] ${error.message}\n`)
    process.exitCode = 1
  }
}

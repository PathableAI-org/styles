/**
 * Writes dist/css/: base.css, utilities.css, one <name>.css per component
 * wrapper, the two shared USWDS modules (shared-input and shared-alert) and manifest.json, which lists each module's owned
 * `pathable-*` classes and the modules it requires.
 *
 * The modules are slices of dist/styles.css. The components layer is compiled
 * once with marker modules between the statements of pathable-all.scss; the
 * output is split at the markers, and the segments must equal the bundle's
 * `pathable.components` rules exactly. Base and utilities are the bundle's
 * `pathable.base` and `pathable.utilities` blocks. A page that loads modules
 * in manifest order therefore loads a subset of the bundle's rules in bundle
 * order.
 *
 *   node scripts/build-css-modules.mjs    (from packages/styles, after the
 *                                          sass bundles in `build`)
 *
 * The pure functions (segment plan and splitting, class ownership, requires)
 * are exported for scripts/build-css-modules.test.mjs; the build itself runs
 * only when this file is the entry point.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import process from 'node:process'

import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import * as sass from 'sass'

import { readCss, readUtilityClasses } from './check-component-pages.mjs'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WRAPPERS = 'src/pathable-component-wrappers'

/** Modules in manifest order, from the text of pathable-all.scss. */
export function wrapperNames(allScss) {
  return [
    ...allScss.matchAll(/^@forward\s+'pathable-([a-z0-9-]+)'\s*;/gmu),
  ].map((match) => match[1])
}

/** Throws if a non-partial pathable-*.scss file is not forwarded by pathable-all. */
export function assertAllForwarded(fileNames, names) {
  const missing = fileNames
    .filter((file) => /^pathable-.+\.scss$/u.test(file))
    .filter((file) => file !== 'pathable-all.scss')
    .map((file) => file.slice('pathable-'.length, -'.scss'.length))
    .filter((name) => !names.includes(name))
  if (missing.length > 0) {
    throw new Error(`pathable-all.scss does not forward: ${missing.join(', ')}`)
  }
}

/** Rewrites `../` asset URLs to resolve from dist/css/ rather than dist/. */
export function rewriteAssetUrls(css) {
  return css.replace(/url\(\s*(["']?)\.\.\//gu, 'url($1../../')
}

/** The relative, non-data url() targets in CSS, without query or fragment. */
export function relativeUrls(css) {
  const urls = new Set()
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gu)) {
    const url = match[2].trim()
    if (url === '' || /^(?:data:|[a-z][a-z0-9+.-]*:|\/)/iu.test(url)) continue
    urls.add(url.split(/[?#]/u, 1)[0])
  }
  return urls
}

/** The `pathable-*` classes in a stylesheet's selectors. */
export function pathableClasses(css) {
  const classes = new Set()
  for (const name of readCss(css).classes)
    if (name.startsWith('pathable-')) classes.add(name)
  return classes
}

/** Per class, how many complex selectors (selector-list items) in `css` name it. */
function selectorCounts(css) {
  const counts = new Map()
  if (!css) return counts
  postcss.parse(css).walkRules((rule) => {
    selectorParser((selectors) => {
      selectors.each((selector) => {
        const seen = new Set()
        selector.walkClasses((node) => seen.add(node.value))
        for (const cls of seen) counts.set(cls, (counts.get(cls) ?? 0) + 1)
      })
    }).processSync(rule.selector)
  })
  return counts
}

/**
 * Assigns each class to one module. `components` is a list of
 * `{ name, classes, css }` in manifest order (`shared-*` names are shared
 * segments, not wrappers); `utilityClasses` is a Set. Returns a Map
 * class -> owner name. In order: a utility class goes to `utilities`; a
 * wrapper whose `pathable-<name>` is the class goes to that wrapper; among
 * wrappers whose CSS names the class, the longest `pathable-<name>` prefix
 * wins; otherwise the module with the most complex selectors naming it, the
 * earlier module on a tie.
 */
export function assignOwners(components, utilityClasses) {
  const owners = new Map()
  for (const name of utilityClasses) owners.set(name, 'utilities')
  const wrappers = components.filter(({ name }) => !name.startsWith('shared-'))
  const counts = new Map(
    components.map(({ name, css }) => [name, selectorCounts(css)]),
  )
  const all = new Set(components.flatMap(({ classes }) => [...classes]))
  for (const cls of all) {
    if (owners.has(cls)) continue
    const exact = wrappers.find(({ name }) => `pathable-${name}` === cls)
    if (exact) {
      owners.set(cls, exact.name)
      continue
    }
    const byPrefix = wrappers
      .filter(({ name, classes }) => {
        const prefix = `pathable-${name}`
        return (
          classes.has(cls) &&
          (cls.startsWith(`${prefix}-`) || cls.startsWith(`${prefix}_`))
        )
      })
      .sort((a, b) => b.name.length - a.name.length)
    if (byPrefix.length > 0) {
      owners.set(cls, byPrefix[0].name)
      continue
    }
    let best = null
    let bestCount = 0
    for (const { name } of components) {
      const count = counts.get(name).get(cls) ?? 0
      if (count > bestCount) {
        best = name
        bestCount = count
      }
    }
    owners.set(
      cls,
      best ?? components.find(({ classes }) => classes.has(cls)).name,
    )
  }
  return owners
}

const FORWARD = /^@forward\s+'pathable-([a-z0-9-]+)'\s*;/u
const USWDS_USE = /^@use\s+'usa-([a-z0-9-]+)\/src\/styles'\s+as\s+usa-\1\s*;/u
const MARKER = /^!?\s*pathable-segment (\S+)\s*$/u

/** Segment ids in cascade order: a wrapper name, or `shared-<p>` for a USWDS use. */
export function segmentIds(allScss) {
  const ids = []
  for (const line of allScss.split('\n')) {
    const forward = FORWARD.exec(line)
    const use = USWDS_USE.exec(line)
    if (forward) ids.push(forward[1])
    else if (use) ids.push(`shared-${use[1]}`)
  }
  return ids
}

/** pathable-all.scss with a marker `@use` before each forward and USWDS use. */
export function withMarkers(allScss) {
  return allScss
    .split('\n')
    .map((line) => {
      const forward = FORWARD.exec(line)
      const use = USWDS_USE.exec(line)
      const id = forward ? forward[1] : use ? `shared-${use[1]}` : null
      return id ? `@use 'pathable-segment:${id}';\n${line}` : line
    })
    .join('\n')
}

/**
 * Splits the children of the compiled components layer at the marker
 * comments. Returns `[{ id, nodes }]` in order; the markers are dropped.
 */
export function splitSegments(children) {
  const segments = []
  for (const node of children) {
    const marker = node.type === 'comment' ? MARKER.exec(node.text) : null
    if (marker) {
      segments.push({ id: marker[1], nodes: [] })
    } else if (segments.length === 0) {
      if (node.type !== 'comment') {
        throw new Error('components layer has rules before the first marker')
      }
    } else {
      segments.at(-1).nodes.push(node)
    }
  }
  return segments
}

const withoutComments = (nodes) =>
  nodes.filter((node) => node.type !== 'comment').map((node) => node.toString())

/** The children of every block of the named top-level `@layer`, in order. */
export function layerChildren(root, layer) {
  const children = []
  root.each((node) => {
    if (node.type === 'atrule' && node.name === 'layer' && node.nodes) {
      if (node.params.replace(/\s+/gu, '') === layer) {
        children.push(...node.nodes)
      }
    }
  })
  return children
}

/** Throws unless the segments, concatenated, equal the bundle's component rules. */
export function assertSegmentsMatchBundle(segments, bundleNodes) {
  const mine = withoutComments(segments.flatMap(({ nodes }) => nodes))
  const theirs = withoutComments(bundleNodes)
  if (mine.length !== theirs.length) {
    throw new Error(
      `segments hold ${mine.length} rules; dist/styles.css holds ${theirs.length} in pathable.components`,
    )
  }
  const at = mine.findIndex((text, index) => text !== theirs[index])
  if (at !== -1) {
    throw new Error(
      `segment rule ${at} differs from dist/styles.css:\n${mine[at]}\nvs\n${theirs[at]}`,
    )
  }
}

/**
 * The owners M such that a complex selector (one item of a selector list) in
 * `css` has non-utility `pathable-*` classes that M owns alone: a rule for
 * M's markup that needs no other component.
 */
export function soleOwnersIn(css, owners, utilityClasses) {
  const found = new Set()
  postcss.parse(css).walkRules((rule) => {
    selectorParser((selectors) => {
      selectors.each((selector) => {
        const classes = new Set()
        let needsUsaMarkup = false
        selector.walkClasses((node) => {
          // A usa-* class outside a pseudo-class argument only matches USWDS
          // markup, so the selector never applies to PathAble markup alone.
          if (
            node.value.startsWith('usa-') &&
            node.parent?.parent?.type !== 'pseudo'
          )
            needsUsaMarkup = true
          if (
            node.value.startsWith('pathable-') &&
            !utilityClasses.has(node.value)
          )
            classes.add(node.value)
        })
        if (needsUsaMarkup) return
        const names = new Set([...classes].map((cls) => owners.get(cls)))
        if (names.size === 1 && !names.has(undefined)) found.add([...names][0])
      })
    }).processSync(rule.selector)
  })
  return found
}

/**
 * For each module, the modules it requires: base, plus every other component
 * module N holding a rule that applies to its markup alone (`soleOwnersIn`).
 */
export function deriveRequires(modules, owners, utilityClasses) {
  const inner = modules.filter(
    ({ name }) => name !== 'base' && name !== 'utilities',
  )
  const soleOwners = new Map(
    inner.map(({ name, css }) => [
      name,
      soleOwnersIn(css, owners, utilityClasses),
    ]),
  )
  return modules.map(({ name }) => {
    if (name === 'base') return []
    if (name === 'utilities') return ['base']
    const needed = new Set(['base'])
    for (const other of inner) {
      if (other.name !== name && soleOwners.get(other.name).has(name))
        needed.add(other.name)
    }
    return modules.map((m) => m.name).filter((n) => needed.has(n))
  })
}

/**
 * Builds the module list in manifest order. `segments` is `[{ id, css }]`;
 * `baseCss` and `utilitiesCss` are the bundle's layer contents.
 */
export function planModules({ segments, baseCss, utilitiesCss }) {
  const utilityClasses = new Set(
    [...readUtilityClasses(utilitiesCss)].filter((name) =>
      name.startsWith('pathable-'),
    ),
  )
  const components = segments.map(({ id, css }) => ({
    name: id,
    css,
    classes: pathableClasses(css),
  }))
  const owners = assignOwners(components, utilityClasses)
  const modules = [
    { name: 'base', css: baseCss, pathable: new Set() },
    ...components.map(({ name, css, classes }) => ({
      name,
      css,
      pathable: classes,
    })),
    { name: 'utilities', css: utilitiesCss, pathable: new Set() },
  ]
  const requires = deriveRequires(modules, owners, utilityClasses)
  return modules.map((module, index) => ({
    name: module.name,
    css: module.css,
    classes:
      module.name === 'utilities'
        ? [...utilityClasses].sort()
        : [...owners]
            .filter(([, owner]) => owner === module.name)
            .map(([cls]) => cls)
            .sort(),
    requires: requires[index],
  }))
}

/**
 * Drops each empty segment. A wrapper whose rules sit in the shared segment
 * of the same name (`icon`, `shared-icon`: the USWDS module was loaded first,
 * so the wrapper's `@extend` rules landed there) gives its name to that
 * segment. Any other empty segment throws.
 */
export function resolveEmptySegments(segments) {
  const empty = (segment) => withoutComments(segment.nodes).length === 0
  const result = []
  for (const segment of segments) {
    if (!empty(segment)) {
      const taker = segments.find(
        (other) =>
          other.id !== segment.id &&
          empty(other) &&
          `shared-${other.id}` === segment.id,
      )
      result.push(taker ? { ...segment, id: taker.id } : segment)
    } else if (
      !segments.some(
        (other) => other.id === `shared-${segment.id}` && !empty(other),
      )
    ) {
      throw new Error(`segment ${segment.id} is empty`)
    }
  }
  return result
}

/** One module file: the layer order statement, then the content in its layer. */
export function moduleFile(layer, nodesCss) {
  const body = `@layer pathable.base, pathable.components, pathable.utilities;\n@layer pathable.${layer} {\n${nodesCss}\n}\n`
  return /\P{ASCII}/u.test(body) ? `@charset "UTF-8";\n${body}` : body
}

/** Throws unless every class in the bundle is owned once and every owned class is in the bundle. */
export function assertCoverage(modules, bundleClasses) {
  const seen = new Map()
  for (const { name, classes } of modules) {
    for (const cls of classes) {
      if (seen.has(cls)) {
        throw new Error(`.${cls} is owned by both ${seen.get(cls)} and ${name}`)
      }
      seen.set(cls, name)
    }
  }
  const unowned = [...bundleClasses].filter((cls) => !seen.has(cls))
  if (unowned.length > 0) {
    throw new Error(
      `classes in dist/styles.css owned by no module: ${unowned.join(', ')}`,
    )
  }
  const extra = [...seen.keys()].filter((cls) => !bundleClasses.has(cls))
  if (extra.length > 0) {
    throw new Error(
      `classes owned by a module but not in dist/styles.css: ${extra.join(', ')}`,
    )
  }
}

const importer = (markerSource, ids) => ({
  canonicalize(url) {
    // Relative loads from the in-memory copy also arrive here as
    // `pathable-segment:<name>`; only the marker ids and the copy are ours.
    const id = url.startsWith('pathable-segment:')
      ? url.slice('pathable-segment:'.length)
      : null
    return id === 'all' || ids.includes(id) ? new URL(url) : null
  },
  load(canonicalUrl) {
    const id = canonicalUrl.pathname
    const contents =
      id === 'all' ? markerSource.all : `/*! pathable-segment ${id} */\n`
    return { contents, syntax: id === 'all' ? 'scss' : 'css' }
  },
})

function compileComponents(allScss) {
  const source = `@use 'uswds-theme';
@use 'layers';
@use 'sass:meta';
@layer pathable.components {
  @include meta.load-css('pathable-segment:all');
}
`
  return sass.compileString(source, {
    importers: [importer({ all: withMarkers(allScss) }, segmentIds(allScss))],
    loadPaths: [
      join(packageRoot, 'src'),
      join(packageRoot, WRAPPERS),
      join(packageRoot, 'node_modules/@uswds/uswds/packages'),
    ],
    quietDeps: true,
    logger: sass.Logger.silent,
    style: 'expanded',
    sourceMap: false,
  }).css
}

const nodesCss = (nodes) =>
  nodes
    .map((node) => node.clone())
    .reduce((root, node) => root.append(node), postcss.root())
    .toString()
    .trim()

/** Runs the build. */
export function build() {
  const dist = join(packageRoot, 'dist')
  const wrappers = join(packageRoot, WRAPPERS)
  const allScss = readFileSync(join(wrappers, 'pathable-all.scss'), 'utf8')
  const names = wrapperNames(allScss)
  assertAllForwarded(readdirSync(wrappers), names)
  const ids = segmentIds(allScss)

  const bundleCss = readFileSync(join(dist, 'styles.css'), 'utf8')
  const bundle = postcss.parse(bundleCss)
  const compiled = postcss.parse(compileComponents(allScss))
  const split = splitSegments(layerChildren(compiled, 'pathable.components'))
  if (split.map(({ id }) => id).join() !== ids.join()) {
    throw new Error('compiled segments do not match pathable-all.scss')
  }
  const bundleComponents = layerChildren(bundle, 'pathable.components')
  assertSegmentsMatchBundle(split, bundleComponents)
  const segments = resolveEmptySegments(split)

  const modules = planModules({
    segments: segments.map(({ id, nodes }) => ({ id, css: nodesCss(nodes) })),
    baseCss: nodesCss(layerChildren(bundle, 'pathable.base')),
    utilitiesCss: nodesCss(layerChildren(bundle, 'pathable.utilities')),
  })
  assertCoverage(modules, pathableClasses(bundleCss))

  // dist/img and fonts/ are copied after this script; check the images
  // against their USWDS source. Fonts are generated by copy-fonts and are
  // checked by the fixtures' axe run, which fails on a missing file.
  const imgRoot = join(packageRoot, 'node_modules/@uswds/uswds/dist/img')
  const files = modules.map((module) => ({
    ...module,
    file: moduleFile(
      module.name === 'base'
        ? 'base'
        : module.name === 'utilities'
          ? 'utilities'
          : 'components',
      rewriteAssetUrls(module.css),
    ),
  }))
  for (const { name, file } of files) {
    for (const url of relativeUrls(file)) {
      if (url.startsWith('../../img/')) {
        if (!existsSync(join(imgRoot, url.slice('../../img/'.length)))) {
          throw new Error(
            `${name}.css references ${url}, which does not exist in USWDS`,
          )
        }
      } else if (!url.startsWith('../../fonts/')) {
        throw new Error(`${name}.css has an unexpected url(${url})`)
      }
    }
  }

  const out = join(dist, 'css')
  rmSync(out, { recursive: true, force: true })
  mkdirSync(out, { recursive: true })
  for (const { name, file } of files)
    writeFileSync(join(out, `${name}.css`), file)
  const manifest = {
    modules: modules.map(({ name, classes, requires }) => ({
      name,
      file: `${name}.css`,
      classes,
      requires,
    })),
  }
  writeFileSync(
    join(out, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
  process.stdout.write(
    `[build-css-modules] wrote ${modules.length} modules to dist/css\n`,
  )
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  build()
}

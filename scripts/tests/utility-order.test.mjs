import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const stylesDir = resolve(root, 'packages/styles')
const postcss = createRequire(resolve(stylesDir, 'package.json'))('postcss')

function compile(entry) {
  return execFileSync(
    'pnpm',
    [
      'exec',
      'sass',
      '--quiet',
      '--quiet-deps',
      '--load-path=node_modules/@uswds/uswds/packages',
      entry,
    ],
    { cwd: stylesDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  )
}

// A utility beats a component class because pathable.utilities is declared
// after pathable.components in the layer order statement, whatever order the
// files load in. Position in the file no longer decides the cascade, so these
// tests assert the layer contract: the order statement comes first and every
// rule sits in the layer that owns it.
const layers = ['pathable.base', 'pathable.components', 'pathable.utilities']
const entries = [
  'src/index.scss',
  'src/components.scss',
  'src/utilities.scss',
  'src/theme-default.scss',
]

function parse(entry) {
  return postcss.parse(compile(entry))
}

function layerOf(node) {
  for (let n = node.parent; n; n = n.parent) {
    if (n.type === 'atrule' && n.name === 'layer') return n.params
  }
  return undefined
}

// Layers of every rule (or at-rule) whose selector/params match the probe.
function layersOf(root, matches, type = 'rule') {
  const found = []
  root.walk((node) => {
    if (node.type !== type) return
    if (matches(type === 'rule' ? node.selector : node.name)) {
      found.push(layerOf(node))
    }
  })
  return found
}

// A rule matches when any of its selectors is, or starts with, the probe as
// a whole class name (not a longer name that shares the prefix).
const selectorHas = (name) => (selector) =>
  selector.split(',').some((part) => {
    const text = part.trim()
    return text.startsWith(name) && !/^[\w-]/.test(text.slice(name.length))
  })

for (const entry of entries) {
  test(`${entry} declares the layer order first and only emits layer blocks`, () => {
    const nodes = parse(entry).nodes.filter(
      (n) =>
        n.type !== 'comment' && !(n.type === 'atrule' && n.name === 'charset'),
    )
    assert.ok(nodes.length > 0, 'the output has content')
    const [order, ...rest] = nodes
    assert.equal(order.type, 'atrule')
    assert.equal(order.name, 'layer')
    assert.equal(order.nodes, undefined, 'the order statement has no body')
    assert.equal(order.params.replace(/\s+/g, ' '), layers.join(', '))
    for (const node of rest) {
      assert.equal(node.type, 'atrule', `unexpected top-level ${node.type}`)
      assert.equal(node.name, 'layer')
      assert.ok(layers.includes(node.params), `unknown layer ${node.params}`)
    }
  })
}

test('styles.css puts each rule in the layer that owns it', () => {
  const css = parse('src/index.scss')
  const probes = [
    ['.pathable-button', 'pathable.components'],
    ['.pathable-checkbox', 'pathable.components'],
    ['.pathable-table', 'pathable.components'],
    ['.pathable-bg-primary', 'pathable.utilities'],
    ['.pathable-display-none', 'pathable.utilities'],
    ['.tablet\\:pathable-display-flex', 'pathable.utilities'],
    ['.padding-0', 'pathable.utilities'],
    ['.grid-row', 'pathable.utilities'],
    [':where(:root)', 'pathable.base'],
  ]
  for (const [selector, layer] of probes) {
    const found = layersOf(css, selectorHas(selector))
    assert.ok(found.length > 0, `${selector} is present`)
    for (const actual of found) {
      assert.equal(actual, layer, `${selector} is in ${layer}`)
    }
  }
  const fontFaces = layersOf(css, (name) => name === 'font-face', 'atrule')
  assert.ok(fontFaces.length > 0, '@font-face is present')
  for (const actual of fontFaces) assert.equal(actual, 'pathable.base')
})

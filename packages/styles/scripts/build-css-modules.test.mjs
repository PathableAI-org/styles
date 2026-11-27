import assert from 'node:assert/strict'
import { test } from 'node:test'

import postcss from 'postcss'

import {
  assertAllForwarded,
  assertCoverage,
  assignOwners,
  deriveRequires,
  moduleFile,
  resolveEmptySegments,
  rewriteAssetUrls,
  segmentIds,
  splitSegments,
  withMarkers,
  wrapperNames,
} from './build-css-modules.mjs'

const mod = (name, ...classes) => ({ name, classes: new Set(classes) })

const ALL = `@forward 'pathable-button';
// x
@use 'usa-icon/src/styles' as usa-icon;
@forward 'pathable-icon';`

test('wrapperNames reads forwards in order', () => {
  assert.deepEqual(
    wrapperNames(
      "@forward 'pathable-button';\n// x\n@forward 'pathable-form-group';",
    ),
    ['button', 'form-group'],
  )
})

test('segmentIds and withMarkers cover forwards and USWDS uses', () => {
  assert.deepEqual(segmentIds(ALL), ['button', 'shared-icon', 'icon'])
  const marked = withMarkers(ALL)
  assert.match(
    marked,
    /@use 'pathable-segment:shared-icon';\n@use 'usa-icon\/src\/styles'/u,
  )
  assert.equal(marked.match(/pathable-segment:/gu).length, 3)
})

test('assertAllForwarded names a missing wrapper', () => {
  assert.throws(
    () =>
      assertAllForwarded(
        ['pathable-a.scss', 'pathable-all.scss', '_pathable-x.scss'],
        [],
      ),
    /a/u,
  )
  assert.doesNotThrow(() =>
    assertAllForwarded(['pathable-a.scss', 'pathable-all.scss'], ['a']),
  )
})

test('splitSegments splits at markers and drops them', () => {
  const root = postcss.parse(
    '/*! pathable-segment a */.x{a:b}/*! pathable-segment b */.y{c:d}.z{e:f}',
  )
  const segments = splitSegments(root.nodes)
  assert.deepEqual(
    segments.map(({ id, nodes }) => [id, nodes.length]),
    [
      ['a', 1],
      ['b', 2],
    ],
  )
  assert.throws(() => splitSegments(postcss.parse('.x{a:b}').nodes))
})

test('resolveEmptySegments renames a shared segment, else throws', () => {
  const seg = (id, css) => ({ id, nodes: postcss.parse(css).nodes })
  const out = resolveEmptySegments([
    seg('a', '.a{x:y}'),
    seg('shared-icon', '.i{x:y}'),
    seg('icon', ''),
  ])
  assert.deepEqual(
    out.map(({ id }) => id),
    ['a', 'icon'],
  )
  assert.throws(
    () => resolveEmptySegments([seg('a', '.a{x:y}'), seg('b', '')]),
    /b is empty/u,
  )
})

test('ownership: utility, longest wrapper prefix, else first containing', () => {
  const owners = assignOwners(
    [
      mod('button', 'pathable-button', 'pathable-select', 'pathable-current'),
      mod('input', 'pathable-input-group'),
      mod('select'),
      mod('pagination', 'pathable-current'),
      mod('form', 'pathable-form-group'),
      mod('form-group'),
      mod('x', 'pathable-sr-only'),
    ],
    new Set(['pathable-sr-only']),
  )
  assert.equal(owners.get('pathable-sr-only'), 'utilities')
  assert.equal(owners.get('pathable-select'), 'select')
  assert.equal(owners.get('pathable-input-group'), 'input')
  assert.equal(owners.get('pathable-form-group'), 'form-group')
  assert.equal(owners.get('pathable-current'), 'button')
})

test('requires: a rule for one module alone, plus base, in manifest order', () => {
  const modules = [
    { name: 'base', css: '' },
    {
      name: 'button',
      css: '.pathable-button,.pathable-input{a:b}.pathable-card .pathable-button{c:d}',
    },
    { name: 'input', css: '.usa-input{a:b}' },
    { name: 'card', css: '.pathable-card{a:b}' },
    { name: 'utilities', css: '' },
  ]
  const owners = new Map([
    ['pathable-button', 'button'],
    ['pathable-input', 'input'],
    ['pathable-card', 'card'],
  ])
  assert.deepEqual(deriveRequires(modules, owners, new Set()), [
    [],
    ['base'],
    ['base', 'button'],
    ['base'],
    ['base'],
  ])
})

test('coverage: each class owned once, every owned class in the bundle', () => {
  const modules = [
    { name: 'a', classes: ['pathable-a'] },
    { name: 'b', classes: ['pathable-b'] },
  ]
  assert.doesNotThrow(() =>
    assertCoverage(modules, new Set(['pathable-a', 'pathable-b'])),
  )
  assert.throws(() => assertCoverage(modules, new Set(['pathable-c'])))
  assert.throws(() =>
    assertCoverage(
      [...modules, { name: 'c', classes: ['pathable-a'] }],
      new Set(),
    ),
  )
})

test('moduleFile declares layer order and adds a charset only for non-ASCII', () => {
  assert.equal(
    moduleFile('components', '.a{b:c}'),
    '@layer pathable.base, pathable.components, pathable.utilities;\n@layer pathable.components {\n.a{b:c}\n}\n',
  )
  assert.match(moduleFile('base', '.a{content:"é"}'), /^@charset "UTF-8";\n/u)
})

test('rewriteAssetUrls goes one level up', () => {
  assert.equal(
    rewriteAssetUrls(
      'a{b:url("../img/x.svg")}c{d:url(../fonts/y)}e{f:url("")}',
    ),
    'a{b:url("../../img/x.svg")}c{d:url(../../fonts/y)}e{f:url("")}',
  )
})

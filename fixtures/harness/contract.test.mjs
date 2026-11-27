import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  STATE_FILE_NAME,
  checkFolder,
  checkFolderEntries,
  classesIn,
} from './contract.mjs'
import {
  readUtilityClasses,
  utilityPatterns,
} from '../../packages/styles/scripts/check-component-pages.mjs'

const page = {
  data: {
    'styles-class': 'pathable-thing',
    variants: [
      { axis: 'size', default: 'default', values: ['small', 'default'] },
    ],
  },
}
const css = new Map([
  ['pathable-thing', 'thing'],
  ['pathable-thing--small', 'thing'],
  ['pathable-thing__part', 'thing'],
])

test('classesIn reads every class attribute, either quote style', () => {
  assert.deepEqual(
    [...classesIn(`<div class="a  b"><span class='c'></span></div>`)],
    ['a', 'b', 'c'],
  )
})

test('a folder that covers every variant with known classes passes', () => {
  const fixtures = new Map([
    ['default.html', '<div class="pathable-thing"></div>'],
    ['small.html', '<div class="pathable-thing pathable-thing--small"></div>'],
  ])
  assert.deepEqual(checkFolder('thing', fixtures, page, css), [])
})

test('a folder without a page fails', () => {
  const errors = checkFolder('nothing', new Map(), undefined, css)
  assert.match(errors[0], /no component page/u)
})

test('an unknown pathable class fails; other classes are ignored', () => {
  const fixtures = new Map([
    [
      'small.html',
      '<div class="pathable-thing pathable-thing--small app-own"><i class="pathable-thing__bogus"></i></div>',
    ],
  ])
  const errors = checkFolder('thing', fixtures, page, css)
  assert.equal(errors.length, 1)
  assert.match(
    errors[0],
    /\.pathable-thing__bogus is not defined by any module in dist\/css\/manifest\.json/u,
  )
})

test('a non-default variant without a fixture fails', () => {
  const fixtures = new Map([
    ['default.html', '<div class="pathable-thing"></div>'],
  ])
  const errors = checkFolder('thing', fixtures, page, css)
  assert.equal(errors.length, 1)
  assert.match(errors[0], /size=small/u)
})

test('an empty folder fails', () => {
  const errors = checkFolder('thing', new Map(), page, css)
  assert.ok(errors.some((error) => /holds no \.html fixture/u.test(error)))
})

test('classesIn ignores prefixed class attributes and comments', () => {
  assert.deepEqual(
    [
      ...classesIn(
        '<div data-class="a" ng-class="b" class="c"><!-- <p class="d"></p> --></div>',
      ),
    ],
    ['c'],
  )
})

test('a modifier only in data-class, ng-class or a comment does not cover its variant', () => {
  for (const markup of [
    '<div class="pathable-thing" data-class="pathable-thing--small"></div>',
    '<div class="pathable-thing" ng-class="pathable-thing--small"></div>',
    '<div class="pathable-thing"></div><!-- <div class="pathable-thing--small"></div> -->',
  ]) {
    const errors = checkFolder(
      'thing',
      new Map([['a.html', markup]]),
      page,
      css,
    )
    assert.ok(
      errors.some((error) => /size=small/u.test(error)),
      `false pass for ${markup}`,
    )
  }
})

test('an unknown class only in data-class, ng-class or a comment is not an error', () => {
  for (const markup of [
    '<div class="pathable-thing pathable-thing--small" data-class="pathable-thing__bogus"></div>',
    '<div class="pathable-thing pathable-thing--small" ng-class="pathable-thing__bogus"></div>',
    '<div class="pathable-thing pathable-thing--small"></div><!-- class="pathable-thing__bogus" -->',
  ]) {
    assert.deepEqual(
      checkFolder('thing', new Map([['a.html', markup]]), page, css),
      [],
      `false failure for ${markup}`,
    )
  }
})

test('fixture file names must be kebab-case state names', () => {
  for (const name of [
    'flat.html',
    'no-actions.html',
    'state2.html',
    'a-b2-c.html',
  ])
    assert.ok(STATE_FILE_NAME.test(name), name)
  for (const name of [
    'Flat.html',
    'no_actions.html',
    'no--actions.html',
    '-flat.html',
    'flat-.html',
    '2flat.html',
    'flat.htm',
    'flat state.html',
  ])
    assert.ok(!STATE_FILE_NAME.test(name), name)
  const fixtures = new Map([
    [
      'No_Actions.html',
      '<div class="pathable-thing pathable-thing--small"></div>',
    ],
  ])
  const errors = checkFolder('thing', fixtures, page, css)
  assert.equal(errors.length, 1)
  assert.match(errors[0], /No_Actions\.html: a fixture file name must be/u)
})

test('component folders hold only .html files, not subfolders or other files', () => {
  const errors = checkFolderEntries('thing', [
    { name: 'flat.html', isDirectory: false },
    { name: '.DS_Store', isDirectory: false },
    { name: 'disabled.htm', isDirectory: false },
    { name: 'Flat.HTML', isDirectory: false },
    { name: 'dense', isDirectory: true },
  ])
  assert.equal(errors.length, 3)
  assert.match(errors[0], /disabled\.htm: component folders hold only/u)
  assert.match(errors[1], /Flat\.HTML: component folders hold only/u)
  assert.match(
    errors[2],
    /dense\/: component folders hold only .* not subfolders/u,
  )
})

test('a utility or token page has no variants and its unprefixed classes pass', () => {
  const utility = { data: { kind: 'utility', classes: ['margin-<value>'] } }
  const fixtures = new Map([
    [
      'default.html',
      '<div class="margin-2 tablet:padding-3 pathable-thing"></div>',
    ],
  ])
  assert.deepEqual(checkFolder('utilities-spacing', fixtures, utility, css), [])
})

test('an unknown pathable class still fails in a utility folder', () => {
  const utility = { data: { kind: 'utility' } }
  const errors = checkFolder(
    'utilities-spacing',
    new Map([['a.html', '<div class="margin-2 pathable-bogus"></div>']]),
    utility,
    css,
  )
  assert.equal(errors.length, 1)
  assert.match(errors[0], /\.pathable-bogus is not defined by any module/u)
})

const utilitiesCss = `
.pathable-margin-top-2 { margin-top: 1rem; }
.pathable-bg-link { background-color: #015a76; }
.hover\\:pathable-bg-link:hover { background-color: #015a76; }
.focus\\:pathable-bg-link:focus { background-color: #015a76; }
.pathable-bg-link:not(:where(.pathable-button)) { --x: 1; }
`
const utilityCheck = (markup) =>
  checkFolder(
    'utilities-color',
    new Map([['a.html', markup]]),
    { data: { kind: 'utility' } },
    new Map([
      ['pathable-margin-top-2', 'utilities'],
      ['pathable-bg-link', 'utilities'],
      ['pathable-button', 'button'],
    ]),
    {
      classes: readUtilityClasses(utilitiesCss),
      patterns: utilityPatterns([
        {
          data: { classes: ['pathable-bg-<role>', 'hover:pathable-bg-<role>'] },
        },
      ]),
    },
  )

test('a fixture citing an undeclared pathable utility fails', () => {
  const errors = utilityCheck('<div class="pathable-margin-top-2"></div>')
  assert.equal(errors.length, 1)
  assert.match(errors[0], /\.pathable-margin-top-2 is a PathAble utility/u)
})

test('declared pathable utilities and hover variants pass in a fixture', () => {
  assert.deepEqual(
    utilityCheck('<div class="pathable-bg-link hover:pathable-bg-link"></div>'),
    [],
  )
})

test('a focus: variant of a declared utility fails in a fixture', () => {
  const errors = utilityCheck('<div class="focus:pathable-bg-link"></div>')
  assert.match(errors.join(), /\.focus:pathable-bg-link is a PathAble utility/u)
})

test('a component class only in :not(:where()) is not a utility', () => {
  assert.deepEqual(utilityCheck('<a class="pathable-button"></a>'), [])
})

import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  STATE_FILE_NAME,
  checkFolder,
  checkFolderList,
  classesIn,
} from './contract.mjs'

const page = {
  data: {
    'styles-class': 'pathable-thing',
    variants: [
      { axis: 'size', default: 'default', values: ['small', 'default'] },
    ],
  },
}
const css = {
  classes: new Set([
    'pathable-thing',
    'pathable-thing--small',
    'pathable-thing__part',
  ]),
}

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
  assert.match(errors[0], /\.pathable-thing__bogus is not a class selector/u)
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

test('the folder list must match the folders on disk, both ways', () => {
  assert.deepEqual(checkFolderList(['a', 'b'], ['a', 'b']), [])
  const missing = checkFolderList(['a', 'b'], ['a'])
  assert.equal(missing.length, 1)
  assert.match(missing[0], /lists b\/, which is not on disk/u)
  const unlisted = checkFolderList(['a'], ['a', 'c'])
  assert.equal(unlisted.length, 1)
  assert.match(unlisted[0], /c\/ is on disk but not listed/u)
})

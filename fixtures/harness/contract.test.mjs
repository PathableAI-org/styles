import assert from 'node:assert/strict'
import { test } from 'node:test'

import { checkFolder, classesIn } from './contract.mjs'

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

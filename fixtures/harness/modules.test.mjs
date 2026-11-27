import assert from 'node:assert/strict'
import { test } from 'node:test'

import { compareSnapshots, formatDifference } from './modules-check.mjs'
import { classOwners, modulesFor, renderPage } from './modules.mjs'

const manifest = {
  modules: [
    { name: 'base', file: 'base.css', classes: [], requires: [] },
    {
      name: 'icon',
      file: 'icon.css',
      classes: ['pathable-icon'],
      requires: ['base'],
    },
    {
      name: 'icon-list',
      file: 'icon-list.css',
      classes: ['pathable-icon-list'],
      requires: ['base', 'icon'],
    },
    {
      name: 'tag',
      file: 'tag.css',
      classes: ['pathable-tag'],
      requires: ['base'],
    },
    {
      name: 'utilities',
      file: 'utilities.css',
      classes: ['pathable-margin-2'],
      requires: ['base'],
    },
  ],
}

test('classOwners maps each class to its module', () => {
  assert.deepEqual(
    [...classOwners(manifest)],
    [
      ['pathable-icon', 'icon'],
      ['pathable-icon-list', 'icon-list'],
      ['pathable-tag', 'tag'],
      ['pathable-margin-2', 'utilities'],
    ],
  )
})

test('modulesFor closes over requires and keeps manifest order', () => {
  assert.deepEqual(
    modulesFor('<ul class="pathable-icon-list app-x"></ul>', manifest),
    ['base', 'icon', 'icon-list', 'utilities'],
  )
})

test('modulesFor always includes base and utilities and ignores unknown classes', () => {
  assert.deepEqual(modulesFor('<p class="pathable-unknown"></p>', manifest), [
    'base',
    'utilities',
  ])
})

test('renderPage links each stylesheet in order', () => {
  const page = renderPage(['/a.css', '/b.css'])
  assert.ok(page.indexOf('href="/a.css"') < page.indexOf('href="/b.css"'))
  assert.ok(!page.includes('<!-- stylesheets -->'))
})

const snapshot = (...rows) => ({
  props: ['color', 'display'],
  rows: rows.map(([path, pseudo, ...values]) => ({ path, pseudo, values })),
})

test('identical snapshots have no differences', () => {
  const a = snapshot(['html', '', 'red', 'block'])
  assert.deepEqual(compareSnapshots(a, structuredClone(a)), [])
})

test('a differing property is reported with both values', () => {
  const diffs = compareSnapshots(
    snapshot(
      ['html', '', 'red', 'block'],
      ['html > body', '::before', 'red', 'none'],
    ),
    snapshot(
      ['html', '', 'red', 'block'],
      ['html > body', '::before', 'blue', 'none'],
    ),
  )
  assert.deepEqual(diffs, [
    {
      path: 'html > body',
      pseudo: '::before',
      property: 'color',
      bundle: 'red',
      modules: 'blue',
    },
  ])
  assert.equal(
    formatDifference('a/b.html (phone)', diffs[0]),
    'a/b.html (phone): html > body ::before color: bundle "red" vs modules "blue"',
  )
})

test('a different element count is reported', () => {
  const diffs = compareSnapshots(
    snapshot(['html', '', 'red', 'block']),
    snapshot(['html', '', 'red', 'block'], ['html > body', '', 'red', 'block']),
  )
  assert.equal(diffs.length, 1)
  assert.equal(diffs[0].property, '(element)')
})

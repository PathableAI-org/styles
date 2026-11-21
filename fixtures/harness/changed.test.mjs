import assert from 'node:assert/strict'
import { test } from 'node:test'

import { selectFolders } from './changed.mjs'
import { checkFolderList } from './contract.mjs'

const folders = ['activity-list', 'button']

test('a fixture change selects only its folder', () => {
  assert.deepEqual(
    selectFolders(['fixtures/activity-list/flat.html'], folders),
    ['activity-list'],
  )
})

test('several changes in one folder select it once', () => {
  assert.deepEqual(
    selectFolders(
      [
        'fixtures/activity-list/flat.html',
        'fixtures/activity-list/grouped.html',
      ],
      folders,
    ),
    ['activity-list'],
  )
})

test('changes in two folders select both, sorted', () => {
  assert.deepEqual(
    selectFolders(
      ['fixtures/button/primary.html', 'fixtures/activity-list/flat.html'],
      folders,
    ),
    ['activity-list', 'button'],
  )
})

test('a harness change selects every folder', () => {
  assert.deepEqual(
    selectFolders(['fixtures/harness/axe.mjs'], folders),
    folders,
  )
})

test('the html-validate config, folder list or package.json selects every folder', () => {
  for (const path of [
    'fixtures/.htmlvalidate.json',
    'fixtures/folders.json',
    'fixtures/package.json',
  ])
    assert.deepEqual(selectFolders([path], folders), folders)
})

test('a README change at the fixtures root selects nothing', () => {
  assert.deepEqual(selectFolders(['fixtures/README.md'], folders), [])
})

test('paths outside fixtures/ are ignored', () => {
  assert.deepEqual(
    selectFolders(['packages/styles/src/index.scss', 'README.md'], folders),
    [],
  )
})

test('a deleted folder is not silently dropped: the folder list check fails it', () => {
  // The folder is gone from disk, so there is nothing for axe to run on…
  const onDisk = ['button']
  assert.deepEqual(
    selectFolders(['fixtures/activity-list/flat.html'], onDisk),
    [],
  )
  // …but folders.json still lists it, so the contract check fails.
  const errors = checkFolderList(['activity-list', 'button'], onDisk)
  assert.equal(errors.length, 1)
  assert.match(errors[0], /lists activity-list\/, which is not on disk/u)
})

test('no changes select nothing', () => {
  assert.deepEqual(selectFolders([], folders), [])
})

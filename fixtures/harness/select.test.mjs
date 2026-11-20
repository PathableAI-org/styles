import assert from 'node:assert/strict'
import { test } from 'node:test'

import { combine, describe, renderSummary } from './select.mjs'

const css = {
  folders: {
    'activity-list': {
      reasons: [
        {
          class: 'pathable-activity-row',
          via: 'rule changed',
          selector: '.pathable-dashboard .pathable-activity-row',
          source:
            'packages/styles/src/pathable-component-wrappers/pathable-dashboard.scss:12',
          file: 'fixtures/activity-list/flat.html',
        },
      ],
    },
  },
}

test('the selection is the union of changed folders and CSS-affected folders', () => {
  const { folders } = combine(['button'], css)
  assert.deepEqual(Object.keys(folders), ['activity-list', 'button'])
  assert.deepEqual(folders.button, ['Fixture files changed under `fixtures/`.'])
  assert.match(
    folders['activity-list'][0],
    /`\.pathable-activity-row`: rule changed/u,
  )
  assert.match(folders['activity-list'][0], /pathable-dashboard\.scss:12/u)
})

test('a folder selected both ways is listed once, with both reasons', () => {
  const { folders } = combine(['activity-list'], css)
  assert.deepEqual(Object.keys(folders), ['activity-list'])
  assert.equal(folders['activity-list'].length, 2)
})

test('a token reason names the class and the custom property', () => {
  assert.equal(
    describe({
      class: 'pathable-button',
      token: '--pathable-color-text',
      via: 'reads --pathable-color-text through var()',
      selector: '.pathable-button',
      source: 'packages/styles/src/_semantic.scss:87',
      file: 'fixtures/activity-list/flat.html',
    }),
    '`.pathable-button` via `--pathable-color-text`: reads --pathable-color-text through var() in `.pathable-button` (packages/styles/src/_semantic.scss:87) used in `fixtures/activity-list/flat.html`.',
  )
})

test('the summary says so explicitly when nothing was selected', () => {
  const summary = renderSummary({
    base: 'abc123',
    folders: {},
    fixturesChanged: false,
  })
  assert.match(summary, /\*\*No fixture folder was selected\.\*\*/u)
  assert.match(summary, /html-validate was skipped/u)
})

test('the summary lists each folder and its reasons', () => {
  const summary = renderSummary({
    base: 'abc123',
    fixturesChanged: true,
    ...combine([], css),
  })
  assert.match(summary, /\*\*1 folder\(s\) selected:\*\* `activity-list`/u)
  assert.match(summary, /### `activity-list`/u)
  assert.match(summary, /html-validate ran/u)
})

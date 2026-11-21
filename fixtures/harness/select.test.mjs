import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  combine,
  describe,
  needsHtmlValidate,
  pagesChanged,
  renderSummary,
  sharedScriptsChanged,
} from './select.mjs'

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

test('the summary caps reasons, and the log form lists them all', () => {
  const many = {
    folders: {
      'activity-list': Array.from({ length: 20 }, (_, i) => `Reason ${i}.`),
    },
  }
  const capped = renderSummary({ base: 'abc123', ...many })
  assert.match(capped, /…and 5 more reason\(s\); the step log lists them all/u)
  assert.doesNotMatch(capped, /Reason 19\./u)
  const full = renderSummary({ base: 'abc123', ...many }, Infinity)
  assert.match(full, /Reason 19\./u)
  assert.doesNotMatch(full, /more reason/u)
})

test('a fixtures change outside a component folder selects nothing, without contradiction', () => {
  const summary = renderSummary({
    base: 'abc123',
    folders: {},
    fixturesChanged: true,
  })
  assert.match(
    summary,
    /No file in a component folder or component page changed/u,
  )
  assert.match(summary, /html-validate ran/u)
  assert.match(summary, /contract check ran on every folder/u)
})

test('a changed component page selects its folder', () => {
  const pages = pagesChanged(
    ['components/activity-list.md', 'fixtures/README.md'],
    ['activity-list', 'button'],
  )
  assert.deepEqual(pages, ['activity-list'])
  const { folders } = combine([], { folders: {} }, pages)
  assert.match(folders['activity-list'][0], /Component page/u)
})

test('html-validate runs for a fixtures or lockfile change only', () => {
  assert.equal(needsHtmlValidate(['fixtures/activity-list/flat.html']), true)
  assert.equal(needsHtmlValidate(['pnpm-lock.yaml']), true)
  assert.equal(needsHtmlValidate(['packages/styles/src/_semantic.scss']), false)
})

test('a change to a shared component-page script selects every folder', () => {
  const paths = [
    'packages/styles/scripts/check-component-pages.mjs',
    'docs/testing/fixtures.md',
  ]
  const scripts = sharedScriptsChanged(paths)
  assert.deepEqual(scripts, [
    'packages/styles/scripts/check-component-pages.mjs',
  ])
  const { folders } = combine([], { folders: {} }, [], {
    changed: scripts,
    folders: ['activity-list', 'button'],
  })
  assert.deepEqual(Object.keys(folders), ['activity-list', 'button'])
  assert.match(folders.button[0], /check-component-pages\.mjs` changed/u)
})

test('other scripts select nothing', () => {
  assert.deepEqual(
    sharedScriptsChanged(['packages/styles/scripts/lint-tokens.mjs']),
    [],
  )
})

/**
 * Integration tests: run the real checks on markup that must fail, so a
 * check that silently stops enforcing (a lost configuration, an accessibility
 * tree that no longer reports buttons) fails here. The contract and axe tests
 * need the built stylesheet: run `pnpm --filter @pathableai/styles build`.
 */

import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'

import { runAxe } from './axe.mjs'
import { checkFolders } from './contract.mjs'
import { validateFolders } from './html.mjs'

const root = mkdtempSync(join(tmpdir(), 'fixtures-test-'))
after(() => rmSync(root, { recursive: true, force: true }))

function fixture(folder, file, html) {
  mkdirSync(join(root, folder), { recursive: true })
  writeFileSync(join(root, folder, file), html)
}

const ruleIds = (results) =>
  new Set(results.flatMap((result) => result.messages.map((m) => m.ruleId)))

test('html-validate applies the fixtures configuration outside fixtures/', async () => {
  fixture(
    'html-bad',
    'bad.html',
    [
      '<ul class="pathable-activity-list" role="list" aria-labelledby="nowhere">',
      '  <li class="pathable-activity-row" role="listitem" style="color: #ccc">Row</li>',
      '</ul>',
      '',
    ].join('\n'),
  )
  const { results } = await validateFolders(['html-bad'], root)
  const ids = ruleIds(results)
  for (const id of [
    'no-redundant-role',
    'no-missing-references',
    'no-inline-style',
  ])
    assert.ok(ids.has(id), `expected ${id}, got ${[...ids].join(', ')}`)
})

test('html-validate rejects inline directive comments', async () => {
  fixture(
    'html-directive',
    'quiet.html',
    '<!-- [html-validate-disable no-inline-style] -->\n<p style="color: #ccc">Text</p>\n',
  )
  const { results } = await validateFolders(['html-directive'], root)
  assert.ok(ruleIds(results).has('fixtures-no-directives'))
})

test('the contract check fails a folder missing a variant fixture', async () => {
  fixture(
    'activity-list',
    'flat.html',
    '<ul class="pathable-activity-list pathable-activity-row__bogus"></ul>\n',
  )
  const errors = await checkFolders(['activity-list'], root)
  assert.ok(
    errors.some((error) => /__bogus is not a class selector/u.test(error)),
  )
  assert.ok(errors.some((error) => /density=compact/u.test(error)))
})

test('the axe run reports duplicate button names from the browser', async () => {
  fixture(
    'axe-dup',
    'dup.html',
    [
      '<button type="button">View</button>',
      '<button type="button">View</button>',
      '<button type="button">View<span class="pathable-sr-only"> Case #1042</span></button>',
      '',
    ].join('\n'),
  )
  const report = await runAxe(['axe-dup'], root)
  assert.equal(report.results.length, 2)
  for (const result of report.results) {
    const unique = result.violations.find(
      (violation) => violation.id === 'fixtures-unique-control-name',
    )
    assert.ok(unique, `no unique-name violation at ${result.viewport}`)
    assert.deepEqual(
      unique.nodes.map((node) => node.target[0]),
      ['button "View"'],
    )
    assert.ok(result.passes > 0, 'axe ran no rules')
  }
})

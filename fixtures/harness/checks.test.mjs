/**
 * Integration tests: run the real checks on markup that must fail, so a
 * check that silently stops enforcing (a lost configuration, an accessibility
 * tree that no longer reports buttons) fails here. The contract and axe tests
 * need the built stylesheet: run `pnpm --filter @pathableai/styles build`.
 */

import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { after, test } from 'node:test'

import { problemsOf, renderSummary, runAxe } from './axe.mjs'
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

test('html-validate rejects directive comments without brackets', async () => {
  fixture(
    'html-directive-bare',
    'quiet.html',
    '<!-- html-validate-disable no-inline-style -->\n<p style="color: #ccc">Text</p>\n',
  )
  const { results } = await validateFolders(['html-directive-bare'], root)
  assert.ok(ruleIds(results).has('fixtures-no-directives'))
})

test('the contract check fails a folder missing a variant fixture', async () => {
  fixture(
    'tag',
    'default.html',
    '<span class="pathable-tag pathable-tag__bogus">Text</span>\n',
  )
  const errors = await checkFolders(['tag'], root)
  assert.ok(
    errors.some((error) => /__bogus is not a class selector/u.test(error)),
  )
  assert.ok(errors.some((error) => /size=big/u.test(error)))
})

test('the contract check fails files the other checks would skip', async () => {
  fixture('stray-files', 'flat.html', '<p>Text</p>\n')
  fixture('stray-files', 'disabled.htm', '<p>Text</p>\n')
  fixture('stray-files/dense', 'compact.html', '<p>Text</p>\n')
  const errors = await checkFolders(['stray-files'], root)
  assert.ok(
    errors.some((error) => /disabled\.htm: component folders/u.test(error)),
  )
  assert.ok(errors.some((error) => /dense\/: component folders/u.test(error)))
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

test('an axe incomplete result fails the run and reaches the summary', async () => {
  fixture(
    'axe-incomplete',
    'gradient.html',
    '<p style="background: linear-gradient(#ffffff, #000000); color: #777777">Text over a gradient</p>\n',
  )
  const report = await runAxe(['axe-incomplete'], root)
  const incomplete = problemsOf(report).filter((p) => p.kind === 'incomplete')
  assert.ok(
    incomplete.some((p) => p.rule.id === 'color-contrast'),
    'expected an incomplete color-contrast result',
  )
  const summary = renderSummary(report)
  assert.match(summary, /incomplete result\(s\)/u)
  assert.match(summary, /\| incomplete \| color-contrast/u)
})

/** Runs a harness command against its own scratch FIXTURES_ROOT. */
function runCommand(script, args, files, extraEnv = {}) {
  const scratch = mkdtempSync(join(tmpdir(), 'fixtures-cli-'))
  after(() => rmSync(scratch, { recursive: true, force: true }))
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(scratch, path, '..'), { recursive: true })
    writeFileSync(join(scratch, path), content)
  }
  const result = spawnSync(
    process.execPath,
    [join(import.meta.dirname, script), ...args],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_STEP_SUMMARY: '',
        ...extraEnv,
        FIXTURES_ROOT: scratch,
      },
    },
  )
  return { ...result, scratch }
}

test('the contract command fails when folders.json lists a deleted folder', () => {
  const { status, stderr } = runCommand('contract.mjs', [], {
    'folders.json': '["activity-list"]\n',
  })
  assert.equal(status, 1)
  assert.match(
    stderr,
    /folders\.json lists activity-list\/, which is not on disk/u,
  )
})

test('the contract command fails when a folder is not in folders.json', () => {
  const { status, stderr } = runCommand('contract.mjs', [], {
    'folders.json': '[]\n',
    'activity-list/flat.html': '<p>Text</p>\n',
  })
  assert.equal(status, 1)
  assert.match(stderr, /activity-list\/ is on disk but not listed/u)
})

test('the axe command exits 1 on an incomplete result and writes it to the summary', () => {
  const summaryPath = join(
    mkdtempSync(join(tmpdir(), 'fixtures-summary-')),
    'summary.md',
  )
  after(() => rmSync(join(summaryPath, '..'), { recursive: true, force: true }))
  const { status, stdout, stderr } = runCommand(
    'axe.mjs',
    ['gradient'],
    {
      'gradient/text.html':
        '<p style="background: linear-gradient(#ffffff, #000000); color: #777777">Text over a gradient</p>\n',
    },
    { GITHUB_STEP_SUMMARY: summaryPath },
  )
  assert.equal(status, 1, stdout + stderr)
  assert.match(stdout, /0 violation\(s\), [1-9]\d* incomplete result\(s\)/u)
  assert.match(stderr, /incomplete color-contrast/u)
  assert.match(
    readFileSync(summaryPath, 'utf8'),
    /\| incomplete \| color-contrast/u,
  )
})

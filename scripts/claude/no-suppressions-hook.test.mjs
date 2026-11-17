import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import {
  addedDirectives,
  blockMessage,
  evaluate,
} from './no-suppressions-hook.mjs'

// Directive text is assembled at runtime so this file does not itself
// contain suppression comments.
const line = (opener, directive, rest = '') =>
  `${opener} ${directive}${rest ? ` ${rest}` : ''}`
const ESLINT_NEXT = line('//', 'eslint-disable' + '-next-line', 'no-console')
const TS_IGNORE = line('//', '@ts-' + 'ignore')

const hookPath = fileURLToPath(
  new URL('./no-suppressions-hook.mjs', import.meta.url),
)

function runHook(payload) {
  return spawnSync(process.execPath, [hookPath], {
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    encoding: 'utf8',
  })
}

test('flags each directive when it appears in a comment', () => {
  const cases = [
    ['//', 'eslint-disable'],
    ['/*', 'eslint-disable'],
    ['/**', 'eslint-disable'],
    ['/*', 'stylelint-disable'],
    ['//', 'prettier-ignore'],
    ['#', 'prettier-ignore'],
    ['<!--', 'prettier-ignore'],
    ['<!--', 'markdownlint-disable'],
    ['//', '@ts-ignore'],
    ['//', '@ts-expect-error'],
    ['//', '@ts-nocheck'],
  ]
  for (const [opener, directive] of cases) {
    assert.deepEqual(
      addedDirectives('', line(opener, directive)),
      [directive],
      `${opener} ${directive}`,
    )
  }
})

test('flags suffixed forms such as -next-line', () => {
  assert.deepEqual(addedDirectives('', ESLINT_NEXT), ['eslint-disable'])
  assert.deepEqual(
    addedDirectives('', line('/*', 'stylelint-disable' + '-line')),
    ['stylelint-disable'],
  )
  assert.deepEqual(
    addedDirectives('', line('<!--', 'markdownlint-disable' + '-next-line')),
    ['markdownlint-disable'],
  )
})

test('ignores prose that names a directive outside a comment', () => {
  const prose =
    'Never add `eslint-disable`, `@ts-ignore` or `prettier-ignore` comments.'
  assert.deepEqual(addedDirectives('', prose), [])
})

test('ignores directives already present before the change', () => {
  assert.deepEqual(
    addedDirectives(`${TS_IGNORE}\nconst a = 1`, `${TS_IGNORE}\nconst a = 2`),
    [],
  )
})

test('ignores changes that remove a directive', () => {
  assert.deepEqual(addedDirectives(`${ESLINT_NEXT}\nfoo()`, 'foo()'), [])
})

test('flags a second copy of a directive that already exists', () => {
  assert.deepEqual(addedDirectives(TS_IGNORE, `${TS_IGNORE}\n${TS_IGNORE}`), [
    '@ts-ignore',
  ])
})

test('Edit compares old_string with new_string', () => {
  const blocked = evaluate({
    tool_name: 'Edit',
    tool_input: {
      file_path: 'a.ts',
      old_string: 'foo()',
      new_string: `${TS_IGNORE}\nfoo()`,
    },
  })
  assert.deepEqual(blocked, { block: true, directives: ['@ts-ignore'] })

  const allowed = evaluate({
    tool_name: 'Edit',
    tool_input: {
      file_path: 'a.ts',
      old_string: `${TS_IGNORE}\nfoo()`,
      new_string: `${TS_IGNORE}\nbar()`,
    },
  })
  assert.equal(allowed.block, false)
})

test('MultiEdit checks every edit', () => {
  const result = evaluate({
    tool_name: 'MultiEdit',
    tool_input: {
      file_path: 'a.js',
      edits: [
        { old_string: 'a', new_string: 'b' },
        { old_string: 'c', new_string: `${ESLINT_NEXT}\nc` },
      ],
    },
  })
  assert.deepEqual(result, { block: true, directives: ['eslint-disable'] })
})

test('Write compares against the file on disk', () => {
  const existing = `${TS_IGNORE}\nconst x = 1\n`
  const readFile = () => existing

  const unchanged = evaluate(
    {
      tool_name: 'Write',
      tool_input: { file_path: 'x.ts', content: `${existing}const y = 2\n` },
    },
    readFile,
  )
  assert.equal(unchanged.block, false)

  const added = evaluate(
    {
      tool_name: 'Write',
      tool_input: {
        file_path: 'x.ts',
        content: `${existing}${line('//', '@ts-' + 'nocheck')}\n`,
      },
    },
    readFile,
  )
  assert.deepEqual(added, { block: true, directives: ['@ts-nocheck'] })
})

test('other tools are never blocked', () => {
  assert.equal(
    evaluate({ tool_name: 'Read', tool_input: { file_path: 'a.ts' } }).block,
    false,
  )
})

test('block message names the directive and points at the rule', () => {
  const message = blockMessage(['@ts-ignore'], 'src/a.ts')
  assert.match(message, /`@ts-ignore`/)
  assert.match(message, /src\/a\.ts/)
  assert.match(message, /root cause/)
  assert.match(message, /ask a human/)
})

test('CLI exits 2 with a message when a directive is added', () => {
  const result = runHook({
    tool_name: 'Edit',
    tool_input: {
      file_path: 'a.ts',
      old_string: 'foo()',
      new_string: `${TS_IGNORE}\nfoo()`,
    },
  })
  assert.equal(result.status, 2)
  assert.match(result.stderr, /Blocked/)
})

test('CLI exits 0 for a clean change', () => {
  const result = runHook({
    tool_name: 'Edit',
    tool_input: { file_path: 'a.ts', old_string: 'a', new_string: 'b' },
  })
  assert.equal(result.status, 0)
  assert.equal(result.stderr, '')
})

test('CLI exits 0 on unreadable input', () => {
  assert.equal(runHook('not json').status, 0)
})

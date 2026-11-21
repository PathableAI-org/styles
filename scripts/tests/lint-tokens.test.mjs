import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { basename } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  extractDeclaredTokens,
  extractDefinedTokens,
  findUndefinedReferences,
  listScannedFiles,
} from '../../packages/styles/scripts/lint-tokens.mjs'

const LINT_SCRIPT = fileURLToPath(
  new URL('../../packages/styles/scripts/lint-tokens.mjs', import.meta.url),
)

/**
 * A synthetic defined-token set, so the reference tests do not depend on the
 * live token source files.
 */
const FIXTURE_TOKENS = [
  '--elevation-sm',
  '--pathable-color-text',
  '--pathable-space-2',
  '--radius-md',
  '--space-4',
  '--space-8',
  '--usa-font-size-body-sm',
]

/**
 * Lint one synthetic SCSS fixture against the synthetic token set.
 *
 * @param {string} content
 */
function lint(content) {
  return findUndefinedReferences(
    [{ file: 'fixture.scss', content }],
    FIXTURE_TOKENS,
    extractDeclaredTokens(content),
  )
}

/**
 * @param {string} content
 */
function undefinedTokens(content) {
  return lint(content).map((issue) => issue.token)
}

describe('lint-tokens defined token set', () => {
  it('reads the non-prefixed design tokens and their --usa-* aliases from the token sources', () => {
    const definedTokens = extractDefinedTokens()
    for (const prefix of [
      '--space-',
      '--radius-',
      '--elevation-',
      '--ui-',
      '--usa-font-size-',
      '--pathable-space-',
      '--usa-bg-',
    ]) {
      assert.ok(
        definedTokens.some((token) => token.startsWith(prefix)),
        `expected a defined ${prefix}* token`,
      )
    }
  })
})

describe('lint-tokens undefined references', () => {
  it('fails an undefined non-prefixed spacing token and suggests a defined one', () => {
    const issues = lint(
      '.fixture {\n  display: flex;\n  gap: var(--space-2);\n}\n',
    )
    assert.equal(issues.length, 1)
    assert.equal(issues[0].token, '--space-2')
    assert.equal(issues[0].line, 3)
    assert.deepEqual(issues[0].suggestions, ['--space-4', '--space-8'])
  })

  it('fails undefined tokens in other non-prefixed families', () => {
    assert.deepEqual(
      undefinedTokens(
        '.fixture {\n  border-radius: var(--radius-xs);\n  box-shadow: var(--elevation-xxl);\n  font-size: var(--usa-font-size-sm);\n}\n',
      ),
      ['--radius-xs', '--elevation-xxl', '--usa-font-size-sm'],
    )
  })

  it('still fails an undefined --pathable-* token', () => {
    assert.deepEqual(
      undefinedTokens('.fixture { color: var(--pathable-color-missing); }\n'),
      ['--pathable-color-missing'],
    )
  })

  it('fails the formerly exempted legacy typography tokens', () => {
    assert.deepEqual(
      undefinedTokens(
        '.fixture {\n  font-size: var(--pathable-font-size-body-xs);\n}\n.fixture__title {\n  font-size: var(--pathable-font-size-heading-xl);\n}\n',
      ),
      ['--pathable-font-size-body-xs', '--pathable-font-size-heading-xl'],
    )
  })

  it('fails the undefined token nested inside a fallback', () => {
    assert.deepEqual(
      undefinedTokens(
        '.fixture { gap: var(--pathable-fixture-gap, var(--space-2)); }\n',
      ),
      ['--space-2'],
    )
  })

  it('fails a reference wrapped across lines and reports the token line', () => {
    const issues = lint('.fixture {\n  gap: var(\n    --space-2\n  );\n}\n')
    assert.deepEqual(
      issues.map((issue) => [issue.token, issue.line]),
      [['--space-2', 3]],
    )
  })

  it('passes defined tokens, fallbacks and locally declared properties', () => {
    const issues = lint(
      [
        '.fixture {',
        '  --fixture-gap: 4px;',
        '  gap: var(--space-4);',
        '  padding: var(--pathable-space-2);',
        '  border-radius: var(--radius-md);',
        '  margin: var(--fixture-gap);',
        '  z-index: var(--z-index-overlay, 1000);',
        '}',
        '',
      ].join('\n'),
    )
    assert.deepEqual(issues, [])
  })

  it('does not treat a BEM modifier before a pseudo-class as a declaration', () => {
    assert.deepEqual(
      undefinedTokens(
        '.fixture--sm:hover {\n  gap: var(--sm);\n}\n.fixture {\n  &--md:hover {\n    gap: var(--md);\n  }\n}\n',
      ),
      ['--sm', '--md'],
    )
  })

  it('does not treat an interpolated modifier or a feature query as a declaration', () => {
    assert.deepEqual(
      undefinedTokens(
        '.fixture {\n  #{&}--active:hover {\n    gap: var(--active);\n  }\n}\n@supports (--css: variables) {\n  .fixture { gap: var(--css); }\n}\n',
      ),
      ['--active', '--css'],
    )
  })

  it('does not let a line comment containing /* hide later declarations', () => {
    assert.deepEqual(
      undefinedTokens(
        '// see stories/*.ts for usage\n.a { --fixture-x: 1px; }\n/* note */\n.b { margin: var(--fixture-x); }\n',
      ),
      [],
    )
  })

  it('checks references inside comments', () => {
    assert.deepEqual(
      undefinedTokens('margin: 0; // was var(--fixture-old)\n'),
      ['--fixture-old'],
    )
  })

  it('does not treat a declaration in a comment as a declaration', () => {
    assert.deepEqual(
      undefinedTokens(
        '// --space-2: not a real token\n/* --space-3: also not real */\n.fixture { gap: var(--space-2); padding: var(--space-3); }\n',
      ),
      ['--space-2', '--space-3'],
    )
  })
})

describe('lint-tokens scanned files and entry point', () => {
  it('scans SCSS sources, and story files when src/stories exists', () => {
    const { scssFiles, storyFiles } = listScannedFiles()
    assert.ok(scssFiles.some((file) => basename(file) === '_spacing.scss'))
    // The hand-written styles stories were removed, so no story file is
    // scanned today; the scan stays for any added back.
    assert.deepEqual(storyFiles, [])
  })

  it('runs and reports when invoked as a script', () => {
    const result = spawnSync(process.execPath, [LINT_SCRIPT], {
      encoding: 'utf-8',
    })
    assert.equal(result.status, 0, result.stdout + result.stderr)
    assert.match(result.stdout, /Defined tokens: \d+/)
  })
})

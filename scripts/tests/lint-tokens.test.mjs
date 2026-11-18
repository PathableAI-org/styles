import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  extractDeclaredTokens,
  extractDefinedTokens,
  findUndefinedReferences,
} from '../../packages/styles/scripts/lint-tokens.mjs'

const definedTokens = extractDefinedTokens()

/**
 * Lint one synthetic SCSS fixture against the real token set.
 *
 * @param {string} content
 */
function lint(content) {
  return findUndefinedReferences(
    [{ file: 'fixture.scss', content }],
    definedTokens,
    extractDeclaredTokens(content),
  )
}

describe('lint-tokens defined token set', () => {
  it('includes the non-prefixed design tokens and their --usa-* aliases', () => {
    for (const token of [
      '--space-4',
      '--space-48',
      '--radius-md',
      '--elevation-sm',
      '--ui-heading-sm',
      '--usa-font-size-body-sm',
      '--usa-font-weight-bold',
      '--pathable-space-2',
    ]) {
      assert.ok(definedTokens.includes(token), `${token} should be defined`)
    }
  })

  it('does not include a spacing step the px scale lacks', () => {
    assert.equal(definedTokens.includes('--space-2'), false)
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
    assert.ok(issues[0].suggestions.length > 0)
    for (const suggestion of issues[0].suggestions) {
      assert.ok(definedTokens.includes(suggestion))
      assert.match(suggestion, /^--space-/)
    }
  })

  it('fails undefined tokens in other non-prefixed families', () => {
    const issues = lint(
      '.fixture {\n  border-radius: var(--radius-xs);\n  box-shadow: var(--elevation-xxl);\n  font-size: var(--usa-font-size-sm);\n}\n',
    )
    assert.deepEqual(
      issues.map((issue) => issue.token),
      ['--radius-xs', '--elevation-xxl', '--usa-font-size-sm'],
    )
  })

  it('still fails an undefined --pathable-* token', () => {
    const issues = lint('.fixture { color: var(--pathable-color-missing); }\n')
    assert.deepEqual(
      issues.map((issue) => issue.token),
      ['--pathable-color-missing'],
    )
  })

  it('fails the undefined token nested inside a fallback', () => {
    const issues = lint(
      '.fixture { gap: var(--pathable-fixture-gap, var(--space-2)); }\n',
    )
    assert.deepEqual(
      issues.map((issue) => issue.token),
      ['--space-2'],
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
    const issues = lint('.fixture--sm:hover {\n  gap: var(--sm);\n}\n')
    assert.deepEqual(
      issues.map((issue) => issue.token),
      ['--sm'],
    )
  })
})

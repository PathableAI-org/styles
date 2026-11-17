#!/usr/bin/env node
// Claude Code PreToolUse hook for Edit, Write and MultiEdit.
//
// Blocks a file change that newly introduces a lint, format or type-check
// suppression directive. Only text being added counts: a directive that is
// already in the file, or that the change removes, is not flagged.
//
// Exit codes follow the Claude Code hook contract: 0 allows the tool call,
// 2 blocks it and returns stderr to the agent.

import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const DIRECTIVES = [
  'eslint-disable',
  'stylelint-disable',
  'prettier-ignore',
  'markdownlint-disable',
  '@ts-ignore',
  '@ts-expect-error',
  '@ts-nocheck',
]

// A directive only takes effect inside a comment, so require a comment
// opener (`//`, `/*`, `<!--` or `#`) before it on the same line. This keeps
// prose that merely names a directive, such as `eslint-disable` in a doc,
// from being flagged.
const COMMENT_OPENER = String.raw`(?:\/\/|\/\*+|<!--|#)[^\S\r\n]*`

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Prefix match, so `eslint-disable` also covers `eslint-disable-next-line`.
const PATTERNS = DIRECTIVES.map((name) => ({
  name,
  regex: new RegExp(`${COMMENT_OPENER}${escapeRegExp(name)}`, 'g'),
}))

/**
 * Count each directive in a piece of text.
 * @param {string} text
 * @returns {Map<string, number>}
 */
export function countDirectives(text) {
  const counts = new Map()
  for (const { name, regex } of PATTERNS) {
    const matches = (text ?? '').match(regex)
    counts.set(name, matches ? matches.length : 0)
  }
  return counts
}

/**
 * Directives that appear more often in `after` than in `before`.
 * @param {string} before
 * @param {string} after
 * @returns {string[]}
 */
export function addedDirectives(before, after) {
  const beforeCounts = countDirectives(before)
  const afterCounts = countDirectives(after)
  return DIRECTIVES.filter(
    (name) => afterCounts.get(name) > beforeCounts.get(name),
  )
}

/**
 * Work out the before/after text pairs for a tool call.
 * @param {{ tool_name?: string, tool_input?: Record<string, unknown> }} payload
 * @param {(path: string) => string} readFile
 * @returns {Array<{ before: string, after: string }>}
 */
export function changesFor(payload, readFile = readExisting) {
  const input = payload?.tool_input ?? {}
  switch (payload?.tool_name) {
    case 'Edit':
      return [
        {
          before: String(input.old_string ?? ''),
          after: String(input.new_string ?? ''),
        },
      ]
    case 'MultiEdit':
      return (Array.isArray(input.edits) ? input.edits : []).map((edit) => ({
        before: String(edit?.old_string ?? ''),
        after: String(edit?.new_string ?? ''),
      }))
    case 'Write':
      return [
        {
          before: input.file_path ? readFile(String(input.file_path)) : '',
          after: String(input.content ?? ''),
        },
      ]
    default:
      return []
  }
}

/**
 * Decide whether a tool call should be blocked.
 * @param {object} payload Hook input from Claude Code.
 * @param {(path: string) => string} [readFile]
 * @returns {{ block: boolean, directives: string[] }}
 */
export function evaluate(payload, readFile = readExisting) {
  const found = new Set()
  for (const { before, after } of changesFor(payload, readFile)) {
    for (const name of addedDirectives(before, after)) found.add(name)
  }
  const directives = DIRECTIVES.filter((name) => found.has(name))
  return { block: directives.length > 0, directives }
}

export function blockMessage(directives, filePath) {
  return [
    `Blocked: this change adds ${directives.map((d) => `\`${d}\``).join(', ')}${filePath ? ` to ${filePath}` : ''}.`,
    'This repository does not allow agents to add lint, format or type-check suppressions (see "No check suppressions" in AGENTS.md).',
    'Fix the root cause so the check passes. If you believe the rule itself is wrong, stop and ask a human to decide; do not work around this hook.',
  ].join('\n')
}

function readExisting(path) {
  try {
    return existsSync(path) ? readFileSync(path, 'utf8') : ''
  } catch {
    return ''
  }
}

async function readStdin() {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

async function main() {
  let payload
  try {
    payload = JSON.parse(await readStdin())
  } catch {
    // Unreadable input: do not block the agent on a hook fault.
    process.exit(0)
  }
  const { block, directives } = evaluate(payload)
  if (block) {
    process.stderr.write(
      `${blockMessage(directives, payload?.tool_input?.file_path)}\n`,
    )
    process.exit(2)
  }
  process.exit(0)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}

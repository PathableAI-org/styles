/**
 * Splits a source component page into segments at its placeholders.
 *
 * Placeholders are HTML comments, each on its own line at the top level of
 * the page (not inside a list, quote or paragraph):
 *
 *   <!-- example: <state> -->   one fixture state
 *   <!-- examples -->           every state in the component's fixture folder
 *   <!-- package: styles -->    content for one package only, up to
 *   <!-- package: react -->       the next <!-- /package -->
 *   <!-- /package -->
 *
 * The page is parsed as Markdown, so a placeholder inside a code block is
 * code, never a placeholder. Any other HTML comment is left alone.
 *
 * A segment is one of:
 *   { type: 'markdown', text }            source text between placeholders
 *   { type: 'example', state, line }
 *   { type: 'examples', line }
 *   { type: 'package', name, segments, line }
 */

import { fromMarkdown } from 'mdast-util-from-markdown'

export const PACKAGES = ['styles', 'react']

/** Thrown when a page's placeholders are malformed or do not resolve. */
export class ComponentDocsError extends Error {
  constructor(problems) {
    super(problems.join('\n'))
    this.problems = problems
  }
}

const COMMENT = /^<!--([\s\S]*?)-->$/u
const STATE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u

/**
 * Reads one HTML comment as a placeholder. Returns undefined for a comment
 * that is not a placeholder, or { error } for one that starts like a
 * placeholder but is malformed.
 */
export function readPlaceholder(value) {
  const comment = value.trim().match(COMMENT)
  if (!comment) return undefined
  const text = comment[1].trim()
  const [keyword] = text.split(/[\s:]/u)

  if (keyword === 'examples') {
    return text === 'examples'
      ? { type: 'examples' }
      : { error: `"<!-- examples -->" takes no argument; found "${value}"` }
  }
  if (keyword === 'example') {
    const state = text.match(/^example:\s*(\S+)$/u)?.[1]
    if (!state || !STATE.test(state)) {
      return {
        error: `expected "<!-- example: <state> -->" with a kebab-case state name; found "${value}"`,
      }
    }
    return { type: 'example', state }
  }
  if (keyword === 'package') {
    const name = text.match(/^package:\s*(\S+)$/u)?.[1]
    if (!PACKAGES.includes(name)) {
      return {
        error: `expected "<!-- package: styles -->" or "<!-- package: react -->"; found "${value}"`,
      }
    }
    return { type: 'open', name }
  }
  if (keyword === '/package') {
    return text === '/package'
      ? { type: 'close' }
      : { error: `expected "<!-- /package -->"; found "${value}"` }
  }
  return undefined
}

/** Every node of the tree with its parent, depth first. */
function* walk(node, parent) {
  yield { node, parent }
  for (const child of node.children ?? []) yield* walk(child, node)
}

/**
 * The span a placeholder occupies: from the start of its line through the end
 * of its line, plus the blank lines after it, so removing it leaves no gap.
 */
function lineSpan(markdown, start, end) {
  const from = markdown.lastIndexOf('\n', start - 1) + 1
  let to = markdown.indexOf('\n', end)
  to = to === -1 ? markdown.length : to + 1
  const rest = markdown.slice(to).match(/^(?:[ \t]*\n)*/u)[0]
  return { from, to: to + rest.length }
}

/** Finds every placeholder in the page, in document order. */
export function findPlaceholders(markdown) {
  const placeholders = []
  const problems = []

  for (const { node, parent } of walk(fromMarkdown(markdown))) {
    if (node.type !== 'html') continue
    const placeholder = readPlaceholder(node.value)
    if (!placeholder) continue
    const line = node.position.start.line
    if (placeholder.error) {
      problems.push(`line ${line}: ${placeholder.error}`)
      continue
    }
    if (parent.type !== 'root') {
      problems.push(
        `line ${line}: a placeholder must be on its own line at the top level of the page, not inside a ${parent.type}`,
      )
      continue
    }
    placeholders.push({
      ...placeholder,
      line,
      ...lineSpan(
        markdown,
        node.position.start.offset,
        node.position.end.offset,
      ),
    })
  }
  return { placeholders, problems }
}

/**
 * Splits the page into segments. Throws ComponentDocsError when a package
 * block is not closed, is closed without being opened, or is nested.
 */
export function segment(markdown) {
  const { placeholders, problems } = findPlaceholders(markdown)
  const root = []
  let current = root
  let open
  let cursor = 0

  const text = (until) => {
    if (until > cursor) {
      current.push({ type: 'markdown', text: markdown.slice(cursor, until) })
    }
  }

  for (const placeholder of placeholders) {
    text(placeholder.from)
    cursor = placeholder.to
    const { line } = placeholder

    if (placeholder.type === 'open') {
      if (open) {
        problems.push(
          `line ${line}: "<!-- package: ${placeholder.name} -->" opens inside the package block opened on line ${open.line}; close that block first with "<!-- /package -->"`,
        )
        continue
      }
      open = { type: 'package', name: placeholder.name, segments: [], line }
      root.push(open)
      current = open.segments
    } else if (placeholder.type === 'close') {
      if (!open) {
        problems.push(
          `line ${line}: "<!-- /package -->" closes no open package block`,
        )
        continue
      }
      open = undefined
      current = root
    } else {
      const { type, state } = placeholder
      current.push(type === 'example' ? { type, state, line } : { type, line })
    }
  }
  text(markdown.length)

  if (open) {
    problems.push(
      `line ${open.line}: "<!-- package: ${open.name} -->" is never closed with "<!-- /package -->"`,
    )
  }
  if (problems.length > 0) throw new ComponentDocsError(problems)
  return root
}

/**
 * The example and examples placeholders a target shows: those outside
 * package blocks and those in the target's own blocks.
 */
export function exampleSegments(segments, target) {
  return segments.flatMap((item) => {
    if (item.type === 'package') {
      return item.name === target ? exampleSegments(item.segments, target) : []
    }
    return item.type === 'example' || item.type === 'examples' ? [item] : []
  })
}

/**
 * The contents of every fenced or indented code block in `language`, read by
 * the Markdown parser, so a fence of any length (three or more backticks or
 * tildes) is recognised as the generator writes it.
 */
export function codeBlocks(markdown, language) {
  const blocks = []
  for (const { node } of walk(fromMarkdown(markdown))) {
    if (node.type === 'code' && node.lang === language) blocks.push(node.value)
  }
  return blocks
}

/**
 * The source Markdown a target shows, before placeholders are expanded: the
 * text outside package blocks and the text in the target's own blocks.
 */
export function visibleMarkdown(segments, target) {
  return segments
    .flatMap((item) => {
      if (item.type === 'markdown') return [item.text]
      if (item.type === 'package' && item.name === target) {
        return [visibleMarkdown(item.segments, target)]
      }
      return []
    })
    .join('\n')
}

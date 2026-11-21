import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getDiffableHTML } from '@open-wc/semantic-dom-diff/get-diffable-html.js'
import { expect } from 'vitest'

/** Attributes whose value is a space-separated list of element IDs. */
const ID_REFERENCE_ATTRIBUTES = [
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
  'for',
  'form',
  'headers',
  'list',
  'popovertarget',
]

/** Attributes whose value can be a fragment link, `#id`, to an element. */
const FRAGMENT_ATTRIBUTES = ['href']

/** Whitespace as HTML defines it. Unlike `\s`, it leaves `&nbsp;` alone. */
const WHITESPACE = /[ \t\n\f\r]+/gu

/**
 * Inline elements, whose start and end do not separate words. Every other
 * element is treated as a block, which does.
 */
const INLINE_ELEMENTS = new Set([
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'button',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'mark',
  'meter',
  'output',
  'progress',
  'q',
  's',
  'samp',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'svg',
  'textarea',
  'time',
  'u',
  'var',
])

export interface NormalisedFixture {
  /** Markup with IDs renumbered, attributes and classes sorted, and whitespace normalised. */
  markup: string
  /** The words a reader meets, in order, with the spaces between them. */
  text: string
}

function parse(html: string): DocumentFragment {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content
}

/**
 * Renumber every `id` in document order and rewrite ID references to match,
 * so generated IDs such as `useId` output compare equal while each reference
 * must still point at the same element. Throws on a duplicate ID or a
 * reference to an ID that does not exist. An empty `id` is not an ID. A
 * fragment link (`href="#id"`) to an element in the markup is rewritten too;
 * one to an ID outside the markup, such as a skip link's target, becomes
 * `#unresolved:<id>`, so it is compared literally and never matches a
 * resolved link.
 */
function renumberIds(root: DocumentFragment): void {
  const renumbered = new Map<string, string>()

  for (const element of root.querySelectorAll('[id]:not([id=""])')) {
    const id = element.id
    if (renumbered.has(id)) {
      throw new Error(`Duplicate id "${id}"`)
    }
    const replacement = `id-${renumbered.size + 1}`
    renumbered.set(id, replacement)
    element.id = replacement
  }

  for (const attribute of ID_REFERENCE_ATTRIBUTES) {
    for (const element of root.querySelectorAll(`[${attribute}]`)) {
      const references = (element.getAttribute(attribute) ?? '')
        .split(/\s+/u)
        .filter(Boolean)
      const rewritten = references.map((reference) => {
        const replacement = renumbered.get(reference)
        if (replacement === undefined) {
          throw new Error(
            `<${element.localName} ${attribute}="${reference}"> refers to an id that is not in the markup`,
          )
        }
        return replacement
      })
      element.setAttribute(attribute, rewritten.join(' '))
    }
  }

  for (const attribute of FRAGMENT_ATTRIBUTES) {
    for (const element of root.querySelectorAll(`[${attribute}^="#"]`)) {
      const fragment = (element.getAttribute(attribute) ?? '').slice(1)
      const target = renumbered.get(fragment)
      // Mark whether the link resolved, so a dangling `#id-1` never reads
      // the same as a link to the element renumbered `id-1`.
      element.setAttribute(
        attribute,
        target === undefined ? `#unresolved:${fragment}` : `#${target}`,
      )
    }
  }
}

/**
 * Elements `getDiffableHTML` always drops, with their content. Each is
 * renamed to `fixture-<name>` before comparing, so a difference in them still
 * fails.
 */
const DROPPED_ELEMENTS = ['script', 'style', 'svg']

/** Elements whose text is compared exactly, whitespace included. */
const EXACT_TEXT = 'pre, textarea, fixture-script, fixture-style'

/** HTML whitespace at either end of a string; never `&nbsp;`. */
const EDGE_WHITESPACE = /^[ \t\n\f\r]+|[ \t\n\f\r]+$/gu

/**
 * Prepare a parsed fragment for `getDiffableHTML`:
 *
 * - rename the elements it would drop;
 * - in ordinary text, collapse runs of HTML whitespace to one space, as
 *   rendering does, so a fixture whose text Prettier wraps still matches,
 *   and write each non-breaking space as `&nbsp;`, because
 *   `getDiffableHTML` trims text nodes with `String.prototype.trim`, which
 *   would drop one at either end;
 * - write the text of `pre`, `textarea`, `script` and `style` as a quoted
 *   string, so the trim cannot touch it and it is compared exactly.
 */
function normalise(root: DocumentFragment): void {
  for (const element of root.querySelectorAll(DROPPED_ELEMENTS.join(','))) {
    const renamed = document.createElement(`fixture-${element.localName}`)
    for (const { name, value } of element.attributes) {
      renamed.setAttribute(name, value)
    }
    renamed.append(...element.childNodes)
    element.replaceWith(renamed)
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const value = node.nodeValue ?? ''
    node.nodeValue = node.parentElement?.closest(EXACT_TEXT)
      ? JSON.stringify(value)
      : value.replace(WHITESPACE, ' ').replaceAll('\u00a0', '&nbsp;')
  }
}

function readableText(root: DocumentFragment): string {
  let text = ''
  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.nodeValue
      return
    }
    if (!(node instanceof Element)) return
    const separates = !INLINE_ELEMENTS.has(node.localName)
    if (separates) text += ' '
    node.childNodes.forEach(visit)
    if (separates) text += ' '
  }
  root.childNodes.forEach(visit)
  return text.replace(WHITESPACE, ' ').replace(EDGE_WHITESPACE, '')
}

/**
 * Parse an HTML fragment into the form fixture tests compare.
 */
export function toFixtureComparison(html: string): NormalisedFixture {
  const root = parse(html)
  renumberIds(root)
  // Read the text before normalise quotes and marks it for the markup diff.
  const text = readableText(root)
  normalise(root)
  const container = document.createElement('div')
  container.append(root)
  return { markup: getDiffableHTML(container.innerHTML), text }
}

/**
 * Assert that `element` renders the same elements, attributes, classes and
 * text as `fixtureHtml`, an HTML fixture from `@pathableai/fixtures` imported
 * with `?raw`. Attribute order, class order, how whitespace is laid out,
 * comments, empty `class` and `id` attributes and the values of IDs do not
 * matter; ID references must still resolve to the
 * same elements, and the words and the spaces between them must match.
 */
export function expectToRenderFixture(
  element: ReactElement,
  fixtureHtml: string,
): void {
  const actual = toFixtureComparison(renderToStaticMarkup(element))
  const expected = toFixtureComparison(fixtureHtml)
  expect(actual.markup, 'rendered markup').toBe(expected.markup)
  expect(actual.text, 'rendered text').toBe(expected.text)
}

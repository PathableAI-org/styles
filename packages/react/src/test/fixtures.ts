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
  'aria-labelledby',
  'aria-owns',
  'for',
  'headers',
  'list',
]

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
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'kbd',
  'label',
  'mark',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
])

export interface FixtureComparison {
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
 * reference to an ID that does not exist.
 */
function renumberIds(root: DocumentFragment): void {
  const renumbered = new Map<string, string>()

  for (const element of root.querySelectorAll('[id]')) {
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
  return text.replace(/\s+/gu, ' ').trim()
}

/**
 * Parse an HTML fragment into the form fixture tests compare.
 */
export function toFixtureComparison(html: string): FixtureComparison {
  const root = parse(html)
  renumberIds(root)
  const text = readableText(root)
  const container = document.createElement('div')
  container.append(root)
  return { markup: getDiffableHTML(container.innerHTML), text }
}

/**
 * Assert that `element` renders the same elements, attributes, classes and
 * text as `fixtureHtml`, an HTML fixture from `@pathableai/fixtures` imported
 * with `?raw`. Attribute order, class order, whitespace between elements and
 * the values of IDs do not matter; ID references must still resolve to the
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

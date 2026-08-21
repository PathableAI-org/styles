import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Text } from '../Text'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('Text', () => {
  // ── US1: Default render and variant prop ─────────────────────────

  it('renders a single p element with pathable-text class by default', () => {
    const { container } = render(<Text>Example</Text>)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('P')
    expect(root.className).toBe('pathable-text')
    expect(container.querySelectorAll('.pathable-text')).toHaveLength(1)
  })

  it('applies pathable-text--body when variant="body"', () => {
    const { container } = render(<Text variant="body">Body</Text>)
    const root = container.firstElementChild!
    expect(root.className).toBe('pathable-text pathable-text--body')
  })

  it('applies pathable-text--small when variant="small"', () => {
    const { container } = render(<Text variant="small">Small</Text>)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-text--small')
  })

  it('applies pathable-text--caption when variant="caption"', () => {
    const { container } = render(<Text variant="caption">Caption</Text>)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-text--caption')
  })

  it('applies only base class when variant is omitted', () => {
    const { container } = render(<Text>Plain</Text>)
    const root = container.firstElementChild!
    expect(classList(root)).toEqual(['pathable-text'])
  })

  it('renders children as direct content with no wrapper elements', () => {
    const { container } = render(
      <Text>
        Hello <strong>world</strong>
      </Text>,
    )
    const root = container.firstElementChild!
    expect(root.childNodes).toHaveLength(2)
    expect(root.children).toHaveLength(1)
    expect(root.children[0].tagName).toBe('STRONG')
  })

  // ── US2: Tone prop ───────────────────────────────────────────────

  it('applies pathable-text--tone-muted when tone="muted"', () => {
    const { container } = render(<Text tone="muted">Muted</Text>)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-text--tone-muted')
  })

  it('applies pathable-text--tone-danger when tone="danger"', () => {
    const { container } = render(<Text tone="danger">Danger</Text>)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-text--tone-danger')
  })

  it('applies pathable-text--tone-success when tone="success"', () => {
    const { container } = render(<Text tone="success">Success</Text>)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-text--tone-success')
  })

  it('applies pathable-text--tone-default when tone="default"', () => {
    const { container } = render(<Text tone="default">Default</Text>)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-text--tone-default')
  })

  it('applies no tone class when tone is omitted', () => {
    const { container } = render(<Text>No tone</Text>)
    const root = container.firstElementChild!
    expect(classList(root)).toEqual(['pathable-text'])
  })

  it('combines variant and tone in the documented class order', () => {
    const { container } = render(
      <Text variant="small" tone="muted">
        Small muted
      </Text>,
    )
    const root = container.firstElementChild!
    expect(root.className).toBe(
      'pathable-text pathable-text--small pathable-text--tone-muted',
    )
  })

  // ── US3: Polymorphic as prop with native props ───────────────────

  it('renders a <span> when as="span"', () => {
    const { container } = render(<Text as="span">Inline</Text>)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('SPAN')
    expect(classList(root)).toContain('pathable-text')
  })

  it('renders a <label> with htmlFor when as="label"', () => {
    const { container } = render(
      <Text as="label" htmlFor="email">
        Email
      </Text>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('LABEL')
    expect(root.getAttribute('for')).toBe('email')
    expect(classList(root)).toContain('pathable-text')
  })

  it('renders a <figcaption> when as="figcaption"', () => {
    const { container } = render(
      <Text as="figcaption" variant="caption" tone="muted">
        Figure 1
      </Text>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('FIGCAPTION')
    expect(classList(root)).toEqual([
      'pathable-text',
      'pathable-text--caption',
      'pathable-text--tone-muted',
    ])
  })

  // ── US4: className composition, refs, SSR ────────────────────────

  it('places consumer className after component classes', () => {
    const { container } = render(
      <Text variant="body" className="intro-copy">
        Hello
      </Text>,
    )
    const root = container.firstElementChild!
    expect(root.className).toBe('pathable-text pathable-text--body intro-copy')
  })

  it('preserves native attributes on the root element', () => {
    const { container } = render(
      <Text variant="caption" tone="danger" id="error-note" data-testid="err">
        Required field.
      </Text>,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('error-note')
    expect(root.getAttribute('data-testid')).toBe('err')
    expect(classList(root)).toContain('pathable-text--tone-danger')
  })

  it('forwards a ref to the rendered DOM element', () => {
    const ref = createRef<HTMLElement>()
    const { container } = render(
      <Text ref={ref} variant="small">
        Ref me
      </Text>,
    )
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('P')
    expect(ref.current!.className).toContain('pathable-text')
    expect(ref.current).toBe(container.firstElementChild)
  })

  it('forwards a ref to the element selected by as', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Text as="label" ref={ref} htmlFor="x">
        Label
      </Text>,
    )
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('LABEL')
  })

  it('produces identical server and client markup', () => {
    const jsx = (
      <Text variant="small" tone="muted" className="ssr-copy">
        Shared
      </Text>
    )
    const { container } = render(jsx)
    const serverHtml = renderToString(jsx)
    expect(serverHtml).toBe(container.innerHTML)
  })

  it('does not depend on browser globals for class resolution', () => {
    const { container } = render(
      <Text variant="caption" tone="success">
        Success
      </Text>,
    )
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-text--tone-success')
  })
})

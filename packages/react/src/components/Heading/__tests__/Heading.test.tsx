import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Heading } from '../Heading'
import type { HeadingLevel } from '../Heading'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('Heading', () => {
  // ── US1/US2: level prop controls element and style ─────────────────

  it.each([1, 2, 3, 4, 5, 6] as HeadingLevel[])(
    'renders h%i with pathable-heading and pathable-heading--level-%i when level=%i',
    (level) => {
      const { container } = render(<Heading level={level}>Content</Heading>)
      const root = container.firstElementChild!
      expect(root.tagName).toBe(`H${level}`)
      expect(root.className).toBe(
        `pathable-heading pathable-heading--level-${level}`,
      )
    },
  )

  it('renders children inside the heading element', () => {
    const { getByText } = render(<Heading level={2}>Hello World</Heading>)
    expect(getByText('Hello World').tagName).toBe('H2')
  })

  it('renders a single root element with no wrapper', () => {
    const { container } = render(<Heading level={3}>Title</Heading>)
    expect(container.children).toHaveLength(1)
    expect(container.firstElementChild!.tagName).toBe('H3')
  })

  // ── US3: visualLevel diverges visual style from level ─────────────

  it('uses visualLevel to override the style class while keeping the level element', () => {
    const { container } = render(
      <Heading level={3} visualLevel={2}>
        Sidebar Title
      </Heading>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('H3')
    expect(root.className).toBe('pathable-heading pathable-heading--level-2')
  })

  it('falls back to level for style class when visualLevel is omitted', () => {
    const { container } = render(<Heading level={4}>Title</Heading>)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('H4')
    expect(classList(root)).toEqual([
      'pathable-heading',
      'pathable-heading--level-4',
    ])
  })

  it('produces the same output when visualLevel equals level', () => {
    const { container } = render(
      <Heading level={2} visualLevel={2}>
        Title
      </Heading>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('H2')
    expect(root.className).toBe('pathable-heading pathable-heading--level-2')
  })

  // ── US4: No as prop — always a heading element ─────────────────

  it('always renders an h1–h6 element, never a non-heading element', () => {
    const levels: HeadingLevel[] = [1, 2, 3, 4, 5, 6]
    for (const level of levels) {
      const { container } = render(<Heading level={level}>Content</Heading>)
      const root = container.firstElementChild!
      const tag = root.tagName
      expect(tag).toMatch(/^H[1-6]$/)
      expect(tag).not.toBe('DIV')
      expect(tag).not.toBe('P')
      expect(tag).not.toBe('SPAN')
    }
  })

  // ── US5: ref forwarding, className composition, native attributes, SSR ──

  it('forwards a ref to the rendered heading DOM element', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <Heading level={2} ref={ref}>
        Title
      </Heading>,
    )
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    expect(ref.current!.tagName).toBe('H2')
  })

  it('appends consumer className after design-system classes', () => {
    const { container } = render(
      <Heading level={2} className="my-custom">
        Title
      </Heading>,
    )
    const root = container.firstElementChild!
    expect(classList(root)).toEqual([
      'pathable-heading',
      'pathable-heading--level-2',
      'my-custom',
    ])
  })

  it('forwards native HTML attributes to the heading element', () => {
    const { container } = render(
      <Heading level={1} id="page-title" data-testid="main-heading" hidden>
        Welcome
      </Heading>,
    )
    const root = container.firstElementChild!
    expect(root.id).toBe('page-title')
    expect(root.getAttribute('data-testid')).toBe('main-heading')
    expect(root.hasAttribute('hidden')).toBe(true)
  })

  it('produces identical server and client output', () => {
    const jsx = <Heading level={2}>Server / Client</Heading>
    const serverHtml = renderToString(jsx)
    const { container } = render(jsx)
    const clientHtml = container.innerHTML
    expect(serverHtml).toBe(clientHtml)
  })

  // ── Edge cases ─────────────────────────────────────────────────

  it('handles empty children', () => {
    const { container } = render(<Heading level={3} />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('H3')
    expect(root.textContent).toBe('')
  })
})

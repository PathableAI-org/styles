import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Inline } from '../Inline'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('Inline', () => {
  // ── US1: Base render and gap prop ──────────────────────────────

  it('renders a single div with pathable-inline class by default', () => {
    const { container } = render(<Inline />)
    const root = container.firstElementChild!

    expect(root.tagName).toBe('DIV')
    expect(root.className).toBe('pathable-inline')
    expect(container.querySelectorAll('.pathable-inline')).toHaveLength(1)
  })

  it('applies pathable-inline--gap-sm when gap="sm"', () => {
    const { container } = render(<Inline gap="sm" />)
    const root = container.firstElementChild!

    expect(root.className).toBe('pathable-inline pathable-inline--gap-sm')
  })

  it('applies pathable-inline--gap-md when gap="md"', () => {
    const { container } = render(<Inline gap="md" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-inline--gap-md')
  })

  it('applies pathable-inline--gap-lg when gap="lg"', () => {
    const { container } = render(<Inline gap="lg" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-inline--gap-lg')
  })

  it('applies pathable-inline--gap-xl when gap="xl"', () => {
    const { container } = render(<Inline gap="xl" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-inline--gap-xl')
  })

  it('applies only base class when gap is omitted', () => {
    const { container } = render(<Inline />)
    const root = container.firstElementChild!
    expect(classList(root)).toEqual(['pathable-inline'])
  })

  it('renders children in document order with no wrapper elements', () => {
    const { container } = render(
      <Inline gap="sm">
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
        <span data-testid="c">C</span>
      </Inline>,
    )
    const root = container.firstElementChild!

    expect(root!.children).toHaveLength(3)
    expect(root!.children[0].getAttribute('data-testid')).toBe('a')
    expect(root!.children[1].getAttribute('data-testid')).toBe('b')
    expect(root!.children[2].getAttribute('data-testid')).toBe('c')
  })

  it('renders without children without errors', () => {
    const { container } = render(<Inline gap="sm" />)
    const root = container.firstElementChild!

    expect(root).toBeTruthy()
    expect(root!.className).toBe('pathable-inline pathable-inline--gap-sm')
  })

  // ── US3: Align and justify props ──────────────────────────────

  it('applies pathable-flex-align-center when align="center"', () => {
    const { container } = render(<Inline align="center" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-center')
  })

  it('applies pathable-flex-align-start when align="start"', () => {
    const { container } = render(<Inline align="start" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-start')
  })

  it('applies pathable-flex-align-end when align="end"', () => {
    const { container } = render(<Inline align="end" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-end')
  })

  it('applies pathable-flex-align-stretch when align="stretch"', () => {
    const { container } = render(<Inline align="stretch" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-stretch')
  })

  it('applies pathable-flex-align-baseline when align="baseline"', () => {
    const { container } = render(<Inline align="baseline" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-baseline')
  })

  it('applies pathable-flex-justify-center when justify="center"', () => {
    const { container } = render(<Inline justify="center" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-justify-center')
  })

  it('applies pathable-flex-justify-between when justify="between"', () => {
    const { container } = render(<Inline justify="between" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-justify-between')
  })

  it('applies pathable-flex-justify-around when justify="around"', () => {
    const { container } = render(<Inline justify="around" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-justify-around')
  })

  it('applies pathable-flex-justify-end when justify="end"', () => {
    const { container } = render(<Inline justify="end" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-justify-end')
  })

  it('applies pathable-flex-justify-start when justify="start"', () => {
    const { container } = render(<Inline justify="start" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-justify-start')
  })

  it('does not apply alignment or justification classes when props are omitted', () => {
    const { container } = render(<Inline />)
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).not.toContain('pathable-flex-align-center')
    expect(classes).not.toContain('pathable-flex-justify-center')
  })

  it('combines gap, align, and justify on the same root element', () => {
    const { container } = render(
      <Inline gap="lg" align="center" justify="between" />,
    )
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).toContain('pathable-inline')
    expect(classes).toContain('pathable-inline--gap-lg')
    expect(classes).toContain('pathable-flex-align-center')
    expect(classes).toContain('pathable-flex-justify-between')
  })

  // ── US4: Sizing and spacing props ──────────────────────────────

  it('applies pathable-width-full when width="full"', () => {
    const { container } = render(<Inline width="full" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-width-full')
  })

  it('applies pathable-maxw-desktop when maxWidth="desktop"', () => {
    const { container } = render(<Inline maxWidth="desktop" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-maxw-desktop')
  })

  it('applies pathable-margin-x-auto when marginX="auto"', () => {
    const { container } = render(<Inline marginX="auto" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-x-auto')
  })

  it('applies pathable-margin-4 when margin="4"', () => {
    const { container } = render(<Inline margin="4" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-4')
  })

  it('applies pathable-margin-y-2 when marginY="2"', () => {
    const { container } = render(<Inline marginY="2" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-y-2')
  })

  it('applies pathable-margin-top-1 when marginTop="1"', () => {
    const { container } = render(<Inline marginTop="1" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-top-1')
  })

  it('applies pathable-margin-bottom-3 when marginBottom="3"', () => {
    const { container } = render(<Inline marginBottom="3" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-bottom-3')
  })

  it('does not emit sizing or spacing classes when props are omitted', () => {
    const { container } = render(<Inline />)
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).toEqual(['pathable-inline'])
  })

  it('combines gap, align, sizing, and spacing on the same root element', () => {
    const { container } = render(
      <Inline
        gap="sm"
        align="center"
        width="full"
        maxWidth="desktop"
        marginX="auto"
      />,
    )
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).toContain('pathable-inline')
    expect(classes).toContain('pathable-inline--gap-sm')
    expect(classes).toContain('pathable-flex-align-center')
    expect(classes).toContain('pathable-width-full')
    expect(classes).toContain('pathable-maxw-desktop')
    expect(classes).toContain('pathable-margin-x-auto')
  })

  // ── SSR parity ─────────────────────────────────────────────────

  it('produces identical output for server and client render', () => {
    const jsx = (
      <Inline gap="sm" align="center" justify="between">
        <span>A</span>
      </Inline>
    )
    const serverHtml = renderToString(jsx)
    const { container } = render(jsx)
    const clientHtml = container.innerHTML
    expect(serverHtml).toBe(clientHtml)
  })

  // ── US5: Polymorphic as prop ──────────────────────────────────

  it('renders as a section element when as="section"', () => {
    const { container } = render(
      <Inline as="section" gap="sm">
        <span>A</span>
      </Inline>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('SECTION')
    expect(classList(root)).toContain('pathable-inline')
  })

  it('renders as a nav element when as="nav"', () => {
    const { container } = render(
      <Inline as="nav" gap="sm">
        <a href="/">Link</a>
      </Inline>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('NAV')
  })

  it('renders as a div by default (no as prop)', () => {
    const { container } = render(<Inline />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('DIV')
  })

  // ── US6: className composition, ref forwarding, edge cases ────

  it('appends consumer className after component classes', () => {
    const { container } = render(<Inline gap="sm" className="my-inline" />)
    const root = container.firstElementChild!
    const classes = classList(root)
    // Consumer className must appear last
    expect(classes[classes.length - 1]).toBe('my-inline')
    // Component classes must appear before consumer className
    expect(classes.indexOf('pathable-inline')).toBeLessThan(
      classes.indexOf('my-inline'),
    )
  })

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Inline ref={ref} gap="sm" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.className).toBe(
      'pathable-inline pathable-inline--gap-sm',
    )
  })

  it('forwards ref to the as element', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Inline ref={ref} as="section" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('SECTION')
  })

  it('passes through native HTML attributes to the root element', () => {
    const { container } = render(
      <Inline id="test-id" data-test="value" aria-label="test" />,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('test-id')
    expect(root.getAttribute('data-test')).toBe('value')
    expect(root.getAttribute('aria-label')).toBe('test')
  })
})

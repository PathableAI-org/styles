import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Cluster } from '../Cluster'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('Cluster', () => {
  // ── US2: Base render and gap prop ──────────────────────────────

  it('renders a single div with pathable-cluster class by default', () => {
    const { container } = render(<Cluster />)
    const root = container.firstElementChild!

    expect(root.tagName).toBe('DIV')
    expect(root.className).toBe('pathable-cluster')
    expect(container.querySelectorAll('.pathable-cluster')).toHaveLength(1)
  })

  it('applies pathable-cluster--gap-sm when gap="sm"', () => {
    const { container } = render(<Cluster gap="sm" />)
    const root = container.firstElementChild!

    expect(root.className).toBe('pathable-cluster pathable-cluster--gap-sm')
  })

  it('applies pathable-cluster--gap-md when gap="md"', () => {
    const { container } = render(<Cluster gap="md" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--gap-md')
  })

  it('applies pathable-cluster--gap-lg when gap="lg"', () => {
    const { container } = render(<Cluster gap="lg" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--gap-lg')
  })

  it('applies pathable-cluster--gap-xl when gap="xl"', () => {
    const { container } = render(<Cluster gap="xl" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--gap-xl')
  })

  it('applies only base class when gap is omitted', () => {
    const { container } = render(<Cluster />)
    const root = container.firstElementChild!
    expect(classList(root)).toEqual(['pathable-cluster'])
  })

  it('renders children in document order with no wrapper elements', () => {
    const { container } = render(
      <Cluster gap="sm">
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
        <span data-testid="c">C</span>
      </Cluster>,
    )
    const root = container.firstElementChild!

    expect(root!.children).toHaveLength(3)
    expect(root!.children[0].getAttribute('data-testid')).toBe('a')
    expect(root!.children[1].getAttribute('data-testid')).toBe('b')
    expect(root!.children[2].getAttribute('data-testid')).toBe('c')
  })

  it('renders without children without errors', () => {
    const { container } = render(<Cluster gap="sm" />)
    const root = container.firstElementChild!

    expect(root).toBeTruthy()
    expect(root!.className).toBe('pathable-cluster pathable-cluster--gap-sm')
  })

  // ── US3: Align prop ────────────────────────────────────────────

  it('applies pathable-cluster--align-start when align="start"', () => {
    const { container } = render(<Cluster align="start" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--align-start')
  })

  it('applies pathable-cluster--align-center when align="center"', () => {
    const { container } = render(<Cluster align="center" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--align-center')
  })

  it('applies pathable-cluster--align-end when align="end"', () => {
    const { container } = render(<Cluster align="end" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--align-end')
  })

  it('applies pathable-cluster--align-stretch when align="stretch"', () => {
    const { container } = render(<Cluster align="stretch" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--align-stretch')
  })

  it('applies pathable-cluster--align-baseline when align="baseline"', () => {
    const { container } = render(<Cluster align="baseline" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--align-baseline')
  })

  it('does not apply align modifier class when align is omitted', () => {
    const { container } = render(<Cluster />)
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).not.toContain('pathable-cluster--align-start')
    expect(classes).not.toContain('pathable-cluster--align-center')
    expect(classes).not.toContain('pathable-cluster--align-end')
  })

  it('combines gap and align on the same root element', () => {
    const { container } = render(<Cluster gap="lg" align="start" />)
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).toContain('pathable-cluster')
    expect(classes).toContain('pathable-cluster--gap-lg')
    expect(classes).toContain('pathable-cluster--align-start')
  })

  // ── US4: Sizing and spacing props ──────────────────────────────

  it('applies pathable-width-full when width="full"', () => {
    const { container } = render(<Cluster width="full" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-width-full')
  })

  it('applies pathable-maxw-desktop when maxWidth="desktop"', () => {
    const { container } = render(<Cluster maxWidth="desktop" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-maxw-desktop')
  })

  it('applies pathable-margin-x-auto when marginX="auto"', () => {
    const { container } = render(<Cluster marginX="auto" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-x-auto')
  })

  it('applies pathable-margin-4 when margin="4"', () => {
    const { container } = render(<Cluster margin="4" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-4')
  })

  it('applies pathable-margin-y-2 when marginY="2"', () => {
    const { container } = render(<Cluster marginY="2" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-y-2')
  })

  it('applies pathable-margin-top-1 when marginTop="1"', () => {
    const { container } = render(<Cluster marginTop="1" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-top-1')
  })

  it('applies pathable-margin-bottom-3 when marginBottom="3"', () => {
    const { container } = render(<Cluster marginBottom="3" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-bottom-3')
  })

  it('does not emit sizing or spacing classes when props are omitted', () => {
    const { container } = render(<Cluster />)
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).toEqual(['pathable-cluster'])
  })

  it('combines gap, align, sizing, and spacing on the same root element', () => {
    const { container } = render(
      <Cluster
        gap="sm"
        align="start"
        width="full"
        maxWidth="desktop"
        marginX="auto"
      />,
    )
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).toContain('pathable-cluster')
    expect(classes).toContain('pathable-cluster--gap-sm')
    expect(classes).toContain('pathable-cluster--align-start')
    expect(classes).toContain('pathable-width-full')
    expect(classes).toContain('pathable-maxw-desktop')
    expect(classes).toContain('pathable-margin-x-auto')
  })

  // ── SSR parity ─────────────────────────────────────────────────

  it('produces identical output for server and client render', () => {
    const jsx = (
      <Cluster gap="sm" align="start">
        <span>A</span>
      </Cluster>
    )
    const serverHtml = renderToString(jsx)
    const { container } = render(jsx)
    const clientHtml = container.innerHTML
    expect(serverHtml).toBe(clientHtml)
  })

  // ── US5: Polymorphic as prop ──────────────────────────────────

  it('renders as a section element when as="section"', () => {
    const { container } = render(
      <Cluster as="section" gap="sm">
        <span>A</span>
      </Cluster>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('SECTION')
    expect(classList(root)).toContain('pathable-cluster')
  })

  it('renders as a ul element when as="ul"', () => {
    const { container } = render(
      <Cluster as="ul" gap="sm">
        <li>A</li>
        <li>B</li>
      </Cluster>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('UL')
    expect(root.children).toHaveLength(2)
  })

  it('renders as a div by default (no as prop)', () => {
    const { container } = render(<Cluster />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('DIV')
  })

  // ── US6: className composition, ref forwarding, edge cases ────

  it('appends consumer className after component classes', () => {
    const { container } = render(<Cluster gap="sm" className="my-cluster" />)
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes[classes.length - 1]).toBe('my-cluster')
    expect(classes.indexOf('pathable-cluster')).toBeLessThan(
      classes.indexOf('my-cluster'),
    )
  })

  it('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Cluster ref={ref} gap="sm" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.className).toBe(
      'pathable-cluster pathable-cluster--gap-sm',
    )
  })

  it('forwards ref to the as element', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Cluster ref={ref} as="ul" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('UL')
  })

  it('passes through native HTML attributes to the root element', () => {
    const { container } = render(
      <Cluster id="test-id" data-test="value" aria-label="test" />,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('test-id')
    expect(root.getAttribute('data-test')).toBe('value')
    expect(root.getAttribute('aria-label')).toBe('test')
  })
})

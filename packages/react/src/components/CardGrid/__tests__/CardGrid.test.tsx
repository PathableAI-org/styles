import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { CardGrid } from '../CardGrid'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('CardGrid', () => {
  // ── Default render (cluster mode) ─────────────────────────────

  it('renders a single div with pathable-cluster class by default', () => {
    const { container } = render(<CardGrid />)
    const root = container.firstElementChild!

    expect(root.tagName).toBe('DIV')
    expect(root.className).toBe('pathable-cluster pathable-cluster--gap-md')
  })

  it('renders children directly in cluster mode', () => {
    const { container } = render(
      <CardGrid>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
        <span data-testid="c">C</span>
      </CardGrid>,
    )
    const root = container.firstElementChild!

    expect(root.children).toHaveLength(3)
    expect(root.children[0].getAttribute('data-testid')).toBe('a')
    expect(root.children[0].tagName).toBe('SPAN')
  })

  // ── Cluster mode gap modifiers ────────────────────────────────

  it('applies pathable-cluster--gap-sm when gap="sm" in cluster mode', () => {
    const { container } = render(<CardGrid gap="sm" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--gap-sm')
  })

  it('applies pathable-cluster--gap-md when gap="md" in cluster mode', () => {
    const { container } = render(<CardGrid gap="md" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--gap-md')
  })

  it('applies pathable-cluster--gap-lg when gap="lg" in cluster mode', () => {
    const { container } = render(<CardGrid gap="lg" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--gap-lg')
  })

  it('applies pathable-cluster--gap-xl when gap="xl" in cluster mode', () => {
    const { container } = render(<CardGrid gap="xl" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-cluster--gap-xl')
  })

  // ── Auto-fit mode ─────────────────────────────────────────────

  it('renders pathable-card-grid class in auto-fit mode', () => {
    const { container } = render(<CardGrid variant="auto-fit" />)
    const root = container.firstElementChild!

    expect(root.tagName).toBe('DIV')
    expect(classList(root)).toContain('pathable-card-grid')
    expect(classList(root)).not.toContain('pathable-cluster')
  })

  it('applies pathable-card-grid--gap-sm in auto-fit mode', () => {
    const { container } = render(<CardGrid variant="auto-fit" gap="sm" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-card-grid--gap-sm')
  })

  it('applies pathable-card-grid--gap-md by default in auto-fit mode', () => {
    const { container } = render(<CardGrid variant="auto-fit" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-card-grid--gap-md')
  })

  it('applies pathable-card-grid--gap-lg in auto-fit mode', () => {
    const { container } = render(<CardGrid variant="auto-fit" gap="lg" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-card-grid--gap-lg')
  })

  it('renders children directly in auto-fit mode', () => {
    const { container } = render(
      <CardGrid variant="auto-fit">
        <span data-testid="a">A</span>
      </CardGrid>,
    )
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(1)
    expect(root.children[0].tagName).toBe('SPAN')
  })

  // ── Edge cases ────────────────────────────────────────────────

  it('renders empty container when no children provided', () => {
    const { container } = render(<CardGrid />)
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(0)
    expect(classList(root)).toContain('pathable-cluster')
  })

  it('renders empty container in auto-fit mode with no children', () => {
    const { container } = render(<CardGrid variant="auto-fit" />)
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(0)
  })

  // ── className and as prop ─────────────────────────────────────

  it('appends consumer className after component classes', () => {
    const { container } = render(<CardGrid className="my-grid" />)
    const root = container.firstElementChild!
    const classes = classList(root)

    expect(classes).toContain('pathable-cluster')
    expect(classes).toContain('my-grid')
    expect(classes.indexOf('pathable-cluster')).toBeLessThan(
      classes.indexOf('my-grid'),
    )
  })

  it('renders a section when as="section"', () => {
    const { container } = render(<CardGrid as="section" />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('SECTION')
    expect(classList(root)).toContain('pathable-cluster')
  })

  // ── Ref forwarding ────────────────────────────────────────────

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLElement>()
    render(<CardGrid ref={ref} />)

    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('DIV')
    expect(ref.current!.className).toContain('pathable-cluster')
  })

  // ── SSR parity ────────────────────────────────────────────────

  it('produces identical output during server-side rendering (cluster mode)', () => {
    const clientOutput = render(
      <CardGrid gap="sm">
        <span>A</span>
      </CardGrid>,
    ).container.innerHTML

    const serverOutput = renderToString(
      <CardGrid gap="sm">
        <span>A</span>
      </CardGrid>,
    )

    expect(serverOutput).toBe(clientOutput)
  })

  it('produces identical output during server-side rendering (auto-fit mode)', () => {
    const clientOutput = render(
      <CardGrid variant="auto-fit" gap="md">
        <span>A</span>
      </CardGrid>,
    ).container.innerHTML

    const serverOutput = renderToString(
      <CardGrid variant="auto-fit" gap="md">
        <span>A</span>
      </CardGrid>,
    )

    expect(serverOutput).toBe(clientOutput)
  })

  // ── Pass-through attributes ───────────────────────────────────

  it('passes through native HTML attributes', () => {
    const { container } = render(
      <CardGrid id="grid-1" data-testid="card-grid" aria-label="Card grid" />,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('grid-1')
    expect(root.getAttribute('data-testid')).toBe('card-grid')
    expect(root.getAttribute('aria-label')).toBe('Card grid')
  })
})

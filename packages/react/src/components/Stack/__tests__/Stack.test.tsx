import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Stack } from '../Stack.js'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('Stack', () => {
  // ── US1: Base render and gap prop ──────────────────────────────

  it('renders a single div with pathable-stack class by default', () => {
    const { container } = render(<Stack />)
    const root = container.firstElementChild!

    expect(root.tagName).toBe('DIV')
    expect(root.className).toBe('pathable-stack')
    expect(container.querySelectorAll('.pathable-stack')).toHaveLength(1)
  })

  it('applies pathable-stack--gap-sm when gap="sm"', () => {
    const { container } = render(<Stack gap="sm" />)
    const root = container.firstElementChild!

    expect(root.className).toBe('pathable-stack pathable-stack--gap-sm')
  })

  it('applies pathable-stack--gap-md when gap="md"', () => {
    const { container } = render(<Stack gap="md" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-stack--gap-md')
  })

  it('applies pathable-stack--gap-lg when gap="lg"', () => {
    const { container } = render(<Stack gap="lg" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-stack--gap-lg')
  })

  it('applies pathable-stack--gap-xl when gap="xl"', () => {
    const { container } = render(<Stack gap="xl" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-stack--gap-xl')
  })

  it('applies only base class when gap is omitted', () => {
    const { container } = render(<Stack />)
    const root = container.firstElementChild!
    expect(classList(root)).toEqual(['pathable-stack'])
  })

  it('renders children in document order with no wrapper elements', () => {
    const { container } = render(
      <Stack gap="sm">
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
        <span data-testid="c">C</span>
      </Stack>,
    )
    const root = container.firstElementChild!

    expect(root.children).toHaveLength(3)
    expect(root.children[0].getAttribute('data-testid')).toBe('a')
    expect(root.children[1].getAttribute('data-testid')).toBe('b')
    expect(root.children[2].getAttribute('data-testid')).toBe('c')
    // The children should be direct children of root, not wrapped
    expect(root.children[0].tagName).toBe('SPAN')
  })

  // ── US2: Align prop ────────────────────────────────────────────

  it('applies pathable-flex-align-center when align="center"', () => {
    const { container } = render(<Stack align="center" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-center')
  })

  it('applies pathable-flex-align-start when align="start"', () => {
    const { container } = render(<Stack align="start" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-start')
  })

  it('applies pathable-flex-align-end when align="end"', () => {
    const { container } = render(<Stack align="end" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-end')
  })

  it('applies pathable-flex-align-stretch when align="stretch"', () => {
    const { container } = render(<Stack align="stretch" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-stretch')
  })

  it('applies pathable-flex-align-baseline when align="baseline"', () => {
    const { container } = render(<Stack align="baseline" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-flex-align-baseline')
  })

  it('does not apply alignment class when align is omitted', () => {
    const { container } = render(<Stack />)
    const root = container.firstElementChild!
    expect(classList(root)).not.toContain('pathable-flex-align-center')
    expect(classList(root)).not.toContain('pathable-flex-align-start')
    expect(classList(root)).not.toContain('pathable-flex-align-end')
    expect(classList(root)).not.toContain('pathable-flex-align-stretch')
    expect(classList(root)).not.toContain('pathable-flex-align-baseline')
  })

  // ── US3: Sizing and spacing props ──────────────────────────────

  it('applies pathable-width-full when width="full"', () => {
    const { container } = render(<Stack width="full" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-width-full')
  })

  it('applies pathable-maxw-desktop when maxWidth="desktop"', () => {
    const { container } = render(<Stack maxWidth="desktop" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-maxw-desktop')
  })

  it('applies pathable-margin-x-auto when marginX="auto"', () => {
    const { container } = render(<Stack marginX="auto" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-x-auto')
  })

  it('applies pathable-margin-2 when margin="2"', () => {
    const { container } = render(<Stack margin="2" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-2')
  })

  it('applies pathable-margin-y-1 when marginY="1"', () => {
    const { container } = render(<Stack marginY="1" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-y-1')
  })

  it('applies pathable-margin-top-3 when marginTop="3"', () => {
    const { container } = render(<Stack marginTop="3" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-top-3')
  })

  it('applies pathable-margin-bottom-4 when marginBottom="4"', () => {
    const { container } = render(<Stack marginBottom="4" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-margin-bottom-4')
  })

  it('does not apply sizing or spacing classes when props are omitted', () => {
    const { container } = render(<Stack />)
    const root = container.firstElementChild!
    expect(classList(root)).toEqual(['pathable-stack'])
  })

  it('applies combined gap + align + sizing + spacing classes on single root', () => {
    const { container } = render(
      <Stack
        gap="sm"
        align="center"
        width="full"
        maxWidth="desktop"
        marginX="auto"
      />,
    )
    const root = container.firstElementChild!
    const classes = classList(root)

    expect(classes).toContain('pathable-stack')
    expect(classes).toContain('pathable-stack--gap-sm')
    expect(classes).toContain('pathable-flex-align-center')
    expect(classes).toContain('pathable-width-full')
    expect(classes).toContain('pathable-maxw-desktop')
    expect(classes).toContain('pathable-margin-x-auto')

    // All on the same single element
    expect(container.querySelectorAll('*')).toHaveLength(1)
  })

  it('produces identical output during server-side rendering', () => {
    const clientOutput = render(
      <Stack gap="sm" align="center" width="full" marginX="auto">
        <span>A</span>
      </Stack>,
    ).container.innerHTML

    const serverOutput = renderToString(
      <Stack gap="sm" align="center" width="full" marginX="auto">
        <span>A</span>
      </Stack>,
    )

    expect(serverOutput).toBe(clientOutput)
  })

  // ── US4: as prop ───────────────────────────────────────────────

  it('renders a section when as="section"', () => {
    const { container } = render(<Stack as="section" gap="sm" />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('SECTION')
    expect(classList(root)).toContain('pathable-stack')
    expect(classList(root)).toContain('pathable-stack--gap-sm')
  })

  it('renders a nav when as="nav"', () => {
    const { container } = render(<Stack as="nav" />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('NAV')
    expect(classList(root)).toContain('pathable-stack')
  })

  it('renders an ol when as="ol"', () => {
    const { container } = render(
      <Stack as="ol">
        <li>A</li>
        <li>B</li>
      </Stack>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('OL')
    expect(classList(root)).toContain('pathable-stack')
  })

  it('preserves list semantics when as="ol" with li children', () => {
    const { container } = render(
      <Stack as="ol" gap="sm">
        <li>First</li>
        <li>Second</li>
      </Stack>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('OL')
    expect(root.children).toHaveLength(2)
    expect(root.children[0].tagName).toBe('LI')
    expect(root.children[1].tagName).toBe('LI')
  })

  it('passes through native HTML attributes', () => {
    const { container } = render(
      <Stack id="main-stack" data-testid="stack" aria-label="Content stack" />,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('main-stack')
    expect(root.getAttribute('data-testid')).toBe('stack')
    expect(root.getAttribute('aria-label')).toBe('Content stack')
  })

  // ── US5: className composition ─────────────────────────────────

  it('appends consumer className after component classes', () => {
    const { container } = render(<Stack className="my-stack" />)
    const root = container.firstElementChild!
    const classes = classList(root)

    expect(classes[0]).toBe('pathable-stack')
    expect(classes[classes.length - 1]).toBe('my-stack')
  })

  it('preserves documented class merge order: base → gap → align → sizing → spacing → consumer', () => {
    const { container } = render(
      <Stack
        gap="sm"
        align="center"
        width="full"
        marginX="auto"
        className="last"
      />,
    )
    const root = container.firstElementChild!
    const classes = classList(root)

    const baseIdx = classes.indexOf('pathable-stack')
    const gapIdx = classes.indexOf('pathable-stack--gap-sm')
    const alignIdx = classes.indexOf('pathable-flex-align-center')
    const widthIdx = classes.indexOf('pathable-width-full')
    const marginIdx = classes.indexOf('pathable-margin-x-auto')
    const consumerIdx = classes.indexOf('last')

    expect(baseIdx).toBeLessThan(gapIdx)
    expect(gapIdx).toBeLessThan(alignIdx)
    expect(alignIdx).toBeLessThan(widthIdx)
    expect(widthIdx).toBeLessThan(marginIdx)
    expect(marginIdx).toBeLessThan(consumerIdx)
  })

  // ── US6: Ref forwarding ────────────────────────────────────────

  it('forwards ref to the root div element', () => {
    const ref = createRef<HTMLElement>()
    render(<Stack ref={ref} gap="sm" />)

    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('DIV')
    expect(ref.current!.className).toContain('pathable-stack')
  })

  it('forwards ref to the correct element when as is used', () => {
    const ref = createRef<HTMLElement>()
    render(<Stack as="section" ref={ref} gap="sm" />)

    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('SECTION')
    expect(ref.current!.className).toContain('pathable-stack')
  })

  // ── Component test: immediate-child layout contract ────────────

  it('applies gap only between immediate children — wrapper breaks the relationship', () => {
    const { container } = render(
      <Stack gap="sm">
        <div>
          <span>A</span>
          <span>B</span>
        </div>
      </Stack>,
    )
    const root = container.firstElementChild!

    // The single wrapper div is the only flex child
    expect(root.children).toHaveLength(1)
    expect(root.children[0].tagName).toBe('DIV')
    // The inner spans are nested inside the wrapper, not direct children of Stack
    expect(root.children[0].children).toHaveLength(2)
    expect(root.children[0].children[0].tagName).toBe('SPAN')
    expect(root.children[0].children[1].tagName).toBe('SPAN')
  })
})

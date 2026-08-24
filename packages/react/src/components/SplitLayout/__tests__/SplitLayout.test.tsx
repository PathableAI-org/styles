import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { SplitLayout } from '../SplitLayout'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('SplitLayout', () => {
  it('renders with pathable-split and default ratio/align', () => {
    const { container } = render(
      <SplitLayout>
        <div>Left</div>
        <div>Right</div>
      </SplitLayout>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('DIV')
    expect(classList(root)).toContain('pathable-split')
    expect(classList(root)).toContain('pathable-split--ratio-1-1')
    expect(classList(root)).toContain('pathable-split--align-center')
  })

  it('applies all ratio modifiers', () => {
    const ratios: Array<'1-1' | '1-2' | '2-1' | '1-3'> = [
      '1-1',
      '1-2',
      '2-1',
      '1-3',
    ]
    for (const ratio of ratios) {
      const { container } = render(
        <SplitLayout ratio={ratio}>
          <div>Left</div>
          <div>Right</div>
        </SplitLayout>,
      )
      const root = container.firstElementChild!
      expect(classList(root)).toContain(`pathable-split--ratio-${ratio}`)
    }
  })

  it('applies all align modifiers', () => {
    const aligns: Array<'center' | 'start' | 'end' | 'stretch'> = [
      'center',
      'start',
      'end',
      'stretch',
    ]
    for (const align of aligns) {
      const { container } = render(
        <SplitLayout align={align}>
          <div>Left</div>
          <div>Right</div>
        </SplitLayout>,
      )
      const root = container.firstElementChild!
      expect(classList(root)).toContain(`pathable-split--align-${align}`)
    }
  })

  it('renders children directly', () => {
    const { container } = render(
      <SplitLayout>
        <span data-testid="left">Left</span>
        <span data-testid="right">Right</span>
      </SplitLayout>,
    )
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(2)
    expect(root.children[0].getAttribute('data-testid')).toBe('left')
    expect(root.children[1].getAttribute('data-testid')).toBe('right')
  })

  it('handles a single child', () => {
    const { container } = render(
      <SplitLayout>
        <div>Solo</div>
      </SplitLayout>,
    )
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(1)
    expect(root.children[0].tagName).toBe('DIV')
  })

  it('handles no children without error', () => {
    const { container } = render(<SplitLayout>{[]}</SplitLayout>)
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(0)
  })

  it('appends consumer className', () => {
    const { container } = render(
      <SplitLayout className="my-split">
        <div>Left</div>
        <div>Right</div>
      </SplitLayout>,
    )
    const root = container.firstElementChild!
    expect(classList(root)).toContain('my-split')
  })

  it('renders as a section when as="section"', () => {
    const { container } = render(
      <SplitLayout as="section">
        <div>Left</div>
        <div>Right</div>
      </SplitLayout>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('SECTION')
    expect(classList(root)).toContain('pathable-split')
  })

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLElement>()
    render(
      <SplitLayout ref={ref}>
        <div>Left</div>
        <div>Right</div>
      </SplitLayout>,
    )
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('DIV')
  })

  it('produces identical output during SSR', () => {
    const clientOutput = render(
      <SplitLayout ratio="2-1" align="stretch">
        <div>Left</div>
        <div>Right</div>
      </SplitLayout>,
    ).container.innerHTML
    const serverOutput = renderToString(
      <SplitLayout ratio="2-1" align="stretch">
        <div>Left</div>
        <div>Right</div>
      </SplitLayout>,
    )
    expect(serverOutput).toBe(clientOutput)
  })

  it('passes through native HTML attributes', () => {
    const { container } = render(
      <SplitLayout id="hero-split">
        <div>Left</div>
        <div>Right</div>
      </SplitLayout>,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('hero-split')
  })
})

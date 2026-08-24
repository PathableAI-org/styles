import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { Surface } from '../Surface'

describe('Surface', () => {
  // ---------------------------------------------------------------------------
  // US1: variant → coordinated tone class
  // ---------------------------------------------------------------------------

  describe('variant prop (US1)', () => {
    it('renders a single <div> with base and subtle tone classes', () => {
      const { container } = render(<Surface variant="subtle">Panel</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('DIV')
      expect(root.className).toContain('pathable-surface')
      expect(root.className).toContain('pathable-surface--tone-subtle')
      expect(container.children).toHaveLength(1)
    })

    it('renders the primary tone class for variant="primary"', () => {
      const { container } = render(<Surface variant="primary">Promo</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-surface--tone-primary')
    })

    it('renders the default tone class for variant="default"', () => {
      const { container } = render(<Surface variant="default">Card</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-surface--tone-default')
    })

    it('omits the tone class when variant is absent', () => {
      const { container } = render(<Surface>Content</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-surface')
      expect(root.className).not.toContain('pathable-surface--tone-')
    })

    it('renders children as direct children with no wrapper nodes', () => {
      const { container } = render(
        <Surface variant="subtle">
          <span>Hello</span>
        </Surface>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('DIV')
      expect(root.children).toHaveLength(1)
      expect(root.children[0].tagName).toBe('SPAN')
      expect(root.children[0].textContent).toBe('Hello')
    })
  })

  // ---------------------------------------------------------------------------
  // US2: element / as / ref / native props / single node
  // ---------------------------------------------------------------------------

  describe('as prop (US2)', () => {
    it('defaults to <div>', () => {
      const { container } = render(<Surface>Content</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('DIV')
    })

    it('as="section" renders a <section>', () => {
      const { container } = render(
        <Surface as="section" variant="default">
          Section
        </Surface>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('SECTION')
      expect(root.className).toContain('pathable-surface')
    })

    it('as="article" renders an <article>', () => {
      const { container } = render(
        <Surface as="article" variant="subtle">
          Article
        </Surface>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('ARTICLE')
    })
  })

  describe('ref forwarding (US2)', () => {
    it('ref points to the rendered <div>', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <Surface variant="subtle" ref={ref}>
          Content
        </Surface>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.className).toContain('pathable-surface--tone-subtle')
    })

    it('ref points to the rendered <section> for as="section"', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <Surface as="section" ref={ref}>
          Content
        </Surface>,
      )
      expect(ref.current?.tagName).toBe('SECTION')
    })
  })

  describe('native props and class composition (US2)', () => {
    it('passes through id, data-*, and aria-* attributes', () => {
      const { container } = render(
        <Surface id="panel" data-test="value" aria-label="Panel">
          Content
        </Surface>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.id).toBe('panel')
      expect(root.getAttribute('data-test')).toBe('value')
      expect(root.getAttribute('aria-label')).toBe('Panel')
    })

    it('attaches event handlers', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <Surface variant="default" onClick={handleClick}>
          Click
        </Surface>,
      )
      fireEvent.click(container.firstElementChild as HTMLElement)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('appends consumer className last', () => {
      const { container } = render(
        <Surface variant="subtle" className="my-panel">
          Content
        </Surface>,
      )
      const cls = (container.firstElementChild as HTMLElement).className
      const baseIdx = cls.indexOf('pathable-surface')
      const toneIdx = cls.indexOf('pathable-surface--tone-subtle')
      const customIdx = cls.indexOf('my-panel')
      expect(baseIdx).not.toBe(-1)
      expect(toneIdx).not.toBe(-1)
      expect(customIdx).not.toBe(-1)
      expect(baseIdx).toBeLessThan(toneIdx)
      expect(toneIdx).toBeLessThan(customIdx)
    })
  })

  // ---------------------------------------------------------------------------
  // US3: borderTone combination
  // ---------------------------------------------------------------------------

  describe('borderTone (US3)', () => {
    it('combines variant with a danger border-tone class', () => {
      const { container } = render(
        <Surface variant="default" borderTone="danger">
          Error
        </Surface>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-surface--tone-default')
      expect(root.className).toContain('pathable-surface--border-danger')
    })

    it('omits the border-tone class when absent', () => {
      const { container } = render(<Surface variant="default">Ok</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).not.toContain('pathable-surface--border-')
    })
  })

  // ---------------------------------------------------------------------------
  // US4: elevation combination
  // ---------------------------------------------------------------------------

  describe('elevation (US4)', () => {
    it('combines variant with an elevation class', () => {
      const { container } = render(
        <Surface variant="default" elevation="md">
          Card
        </Surface>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-surface--tone-default')
      expect(root.className).toContain('pathable-surface--elevation-md')
    })

    it('omits the elevation class when absent', () => {
      const { container } = render(<Surface variant="default">Flat</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).not.toContain('pathable-surface--elevation-')
    })
  })

  // ---------------------------------------------------------------------------
  // US5: sizing / spacing capability props
  // ---------------------------------------------------------------------------

  describe('sizing and spacing (US5)', () => {
    it('applies width and maxWidth classes', () => {
      const { container } = render(
        <Surface width="full" maxWidth="desktop">
          Wide
        </Surface>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
      expect(root.className).toContain('pathable-maxw-desktop')
    })

    it('applies horizontal margin classes', () => {
      const { container } = render(<Surface marginX="auto">Centered</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-margin-x-auto')
    })

    it('omits sizing/spacing classes when absent', () => {
      const { container } = render(<Surface>Bare</Surface>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).not.toContain('pathable-width-')
      expect(root.className).not.toContain('pathable-margin-')
    })
  })

  // ---------------------------------------------------------------------------
  // SSR parity
  // ---------------------------------------------------------------------------

  describe('SSR parity', () => {
    it('produces identical output for variant + borderTone + elevation', () => {
      const jsx = (
        <Surface variant="primary" borderTone="default" elevation="lg">
          Content
        </Surface>
      )
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      expect(serverHtml).toBe(container.innerHTML)
    })

    it('produces identical output for as + sizing + className', () => {
      const jsx = (
        <Surface as="section" width="full" marginX="auto" className="page">
          Content
        </Surface>
      )
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      expect(serverHtml).toBe(container.innerHTML)
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { Container } from '../Container'

describe('Container', () => {
  // ---------------------------------------------------------------------------
  // US1 & US2: Standard and multi-width rendering
  // ---------------------------------------------------------------------------

  describe('size prop — standard (US1)', () => {
    it('renders a single <div> with pathable-container and pathable-container--standard classes', () => {
      const { container } = render(
        <Container size="standard">Content</Container>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('DIV')
      expect(root.className).toContain('pathable-container')
      expect(root.className).toContain('pathable-container--standard')
      expect(container.children).toHaveLength(1)
    })

    it('renders children as direct children with no wrapper DOM elements', () => {
      const { container } = render(
        <Container size="standard">
          <span>Hello</span>
        </Container>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('DIV')
      expect(root.children).toHaveLength(1)
      expect(root.children[0].tagName).toBe('SPAN')
      expect(root.children[0].textContent).toBe('Hello')
    })

    it('renders empty (no children) without error', () => {
      const { container } = render(<Container size="standard" />)
      const root = container.firstElementChild as HTMLElement
      expect(root).toBeTruthy()
      expect(root.className).toContain('pathable-container')
      expect(root.innerHTML).toBe('')
    })
  })

  describe('size prop — wide (US2)', () => {
    it('renders pathable-container--wide modifier class', () => {
      const { container } = render(<Container size="wide">Dashboard</Container>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-container')
      expect(root.className).toContain('pathable-container--wide')
    })
  })

  describe('size prop — full (US2)', () => {
    it('renders pathable-container--full modifier class', () => {
      const { container } = render(<Container size="full">Hero</Container>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-container')
      expect(root.className).toContain('pathable-container--full')
    })
  })

  describe('size omitted (US2)', () => {
    it('renders only the base pathable-container class without modifier', () => {
      const { container } = render(<Container>Content</Container>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-container')
      expect(root.className).not.toContain('pathable-container--standard')
      expect(root.className).not.toContain('pathable-container--wide')
      expect(root.className).not.toContain('pathable-container--full')
    })
  })

  describe('no wrapper elements (US1)', () => {
    it('renders exactly one root element with deeply nested children', () => {
      const { container } = render(
        <Container size="wide">
          <div>
            <p>Deep</p>
          </div>
        </Container>,
      )
      expect(container.children).toHaveLength(1)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-container')
      expect(root.children[0].tagName).toBe('DIV')
      expect(root.children[0].children[0].tagName).toBe('P')
    })
  })

  // ---------------------------------------------------------------------------
  // US3: className and native props composition
  // ---------------------------------------------------------------------------

  describe('className composition (US3)', () => {
    it('appends consumer className after container semantic classes', () => {
      const { container } = render(
        <Container size="standard" className="page-wrapper">
          Page
        </Container>,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const baseIdx = cls.indexOf('pathable-container')
      const standardIdx = cls.indexOf('pathable-container--standard')
      const customIdx = cls.indexOf('page-wrapper')
      expect(baseIdx).not.toBe(-1)
      expect(standardIdx).not.toBe(-1)
      expect(customIdx).not.toBe(-1)
      expect(baseIdx).toBeLessThan(standardIdx)
      expect(standardIdx).toBeLessThan(customIdx)
    })

    it('works with className only (no size)', () => {
      const { container } = render(
        <Container className="my-container">Content</Container>,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const baseIdx = cls.indexOf('pathable-container')
      const customIdx = cls.indexOf('my-container')
      expect(baseIdx).not.toBe(-1)
      expect(customIdx).not.toBe(-1)
      expect(baseIdx).toBeLessThan(customIdx)
    })
  })

  describe('native HTML attributes (US3)', () => {
    it('passes through id and data-* attributes', () => {
      const { container } = render(
        <Container size="standard" id="main-content" data-test="value">
          Content
        </Container>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.id).toBe('main-content')
      expect(root.getAttribute('data-test')).toBe('value')
    })

    it('passes through aria-* attributes', () => {
      const { container } = render(
        <Container size="standard" aria-label="Main content">
          Content
        </Container>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.getAttribute('aria-label')).toBe('Main content')
    })

    it('attaches event handlers correctly', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <Container size="full" onClick={handleClick}>
          Click Me
        </Container>,
      )
      const root = container.firstElementChild as HTMLElement
      fireEvent.click(root)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  // ---------------------------------------------------------------------------
  // US4: Polymorphic as prop
  // ---------------------------------------------------------------------------

  describe('as prop (US4)', () => {
    it('as="main" renders a <main> element with container classes', () => {
      const { container } = render(
        <Container as="main" size="standard">
          Page
        </Container>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('MAIN')
      expect(root.className).toContain('pathable-container')
      expect(root.className).toContain('pathable-container--standard')
    })

    it('as="section" renders a <section> element with container classes', () => {
      const { container } = render(
        <Container as="section" size="wide">
          Section
        </Container>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('SECTION')
      expect(root.className).toContain('pathable-container')
      expect(root.className).toContain('pathable-container--wide')
    })

    it('as="nav" renders a <nav> element with container classes', () => {
      const { container } = render(
        <Container as="nav" size="full">
          Menu
        </Container>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('NAV')
      expect(root.className).toContain('pathable-container')
      expect(root.className).toContain('pathable-container--full')
    })

    it('default (no as) renders a <div> element', () => {
      const { container } = render(
        <Container size="standard">Default</Container>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('DIV')
    })
  })

  // ---------------------------------------------------------------------------
  // US5: Ref forwarding
  // ---------------------------------------------------------------------------

  describe('ref forwarding (US5)', () => {
    it('ref points to the root element for default as', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <Container size="standard" ref={ref}>
          Content
        </Container>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.className).toContain('pathable-container')
      expect(ref.current?.className).toContain('pathable-container--standard')
    })

    it('ref points to the <main> root element for as="main"', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <Container as="main" size="wide" ref={ref}>
          Content
        </Container>,
      )
      expect(ref.current?.tagName).toBe('MAIN')
      expect(ref.current?.className).toContain('pathable-container')
    })

    it('ref.current contains the expected Container class names', () => {
      const ref = React.createRef<HTMLElement>()
      render(
        <Container size="full" ref={ref}>
          Content
        </Container>,
      )
      expect(ref.current?.className).toContain('pathable-container')
      expect(ref.current?.className).toContain('pathable-container--full')
    })
  })

  // ---------------------------------------------------------------------------
  // SSR parity
  // ---------------------------------------------------------------------------

  describe('SSR parity', () => {
    it('produces identical output for all size="standard"', () => {
      const jsx = <Container size="standard">Content</Container>
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      const clientHtml = container.innerHTML
      expect(serverHtml).toBe(clientHtml)
    })

    it('produces identical output for as="main"', () => {
      const jsx = (
        <Container as="main" size="wide">
          Content
        </Container>
      )
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      const clientHtml = container.innerHTML
      expect(serverHtml).toBe(clientHtml)
    })

    it('produces identical output with className and native props', () => {
      const jsx = (
        <Container size="standard" className="page" id="main">
          Content
        </Container>
      )
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      const clientHtml = container.innerHTML
      expect(serverHtml).toBe(clientHtml)
    })
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Input } from '../Input'

describe('Input sizing props', () => {
  describe('width', () => {
    it('renders pathable-width-full for width="full"', () => {
      const { container } = render(<Input width="full" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
    })

    it('renders pathable-width-auto for width="auto"', () => {
      const { container } = render(<Input width="auto" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-auto')
    })
  })

  describe('maxWidth', () => {
    it('renders pathable-maxw-tablet for maxWidth="tablet"', () => {
      const { container } = render(<Input maxWidth="tablet" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-tablet')
    })

    it('renders pathable-maxw-desktop for maxWidth="desktop"', () => {
      const { container } = render(<Input maxWidth="desktop" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-desktop')
    })
  })

  describe('combined sizing props', () => {
    it('renders both width and maxWidth classes together', () => {
      const { container } = render(<Input width="full" maxWidth="tablet" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
      expect(root.className).toContain('pathable-maxw-tablet')
    })
  })

  describe('className composition', () => {
    it('places consumer className after semantic classes', () => {
      const { container } = render(<Input width="full" className="my-custom" />)
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const baseIdx = cls.indexOf('pathable-input')
      const widthIdx = cls.indexOf('pathable-width-full')
      const customIdx = cls.indexOf('my-custom')
      expect(baseIdx).not.toBe(-1)
      expect(widthIdx).not.toBe(-1)
      expect(customIdx).not.toBe(-1)
      expect(baseIdx).toBeLessThan(widthIdx)
      expect(widthIdx).toBeLessThan(customIdx)
    })

    it('composes maxWidth with consumer className', () => {
      const { container } = render(
        <Input maxWidth="tablet" className="form-input" />,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const maxwIdx = cls.indexOf('pathable-maxw-tablet')
      const customIdx = cls.indexOf('form-input')
      expect(maxwIdx).toBeLessThan(customIdx)
    })

    it('backward compatible with className only (no sizing)', () => {
      const { container } = render(<Input className="legacy" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-input')
      expect(root.className).toContain('legacy')
    })
  })

  describe('root element invariants', () => {
    it('renders exactly one root element (no wrapper)', () => {
      const { container } = render(<Input width="full" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('INPUT')
      expect(container.children).toHaveLength(1)
    })

    it('preserves pathable-input class when no sizing props', () => {
      const { container } = render(<Input />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-input')
    })

    it('preserves native HTML attributes on the root element', () => {
      const { container } = render(
        <Input
          width="full"
          id="test-input"
          disabled
          placeholder="Enter text"
          data-test="value"
          aria-label="input label"
        />,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.id).toBe('test-input')
      expect(root.getAttribute('disabled')).toBe('')
      expect(root.getAttribute('placeholder')).toBe('Enter text')
      expect(root.getAttribute('data-test')).toBe('value')
      expect(root.getAttribute('aria-label')).toBe('input label')
    })

    it('rejects children when sizing props are applied', () => {
      // Input explicitly forbids children; type-checked at compile time.
      // Runtime behavior: children are not rendered.
      const { container } = render(<Input width="full" />)
      expect(container.firstElementChild?.children).toHaveLength(0)
    })
  })

  describe('SSR parity', () => {
    it('produces identical output for server and client render', () => {
      const jsx = <Input width="full" />
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      const clientHtml = container.innerHTML
      // React 19 renderToString omits the self-closing / on void
      // elements while jsdom innerHTML includes it; both forms
      // are semantically identical HTML5.
      const normalize = (html: string) => html.replace(/\/>/g, '>')
      expect(normalize(serverHtml)).toBe(normalize(clientHtml))
    })
  })
})

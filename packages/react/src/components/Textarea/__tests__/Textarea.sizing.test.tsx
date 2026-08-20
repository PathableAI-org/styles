import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Textarea } from '../Textarea'

describe('Textarea sizing props', () => {
  describe('width', () => {
    it('renders pathable-width-full for width="full"', () => {
      const { container } = render(<Textarea width="full" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
    })

    it('renders pathable-width-auto for width="auto"', () => {
      const { container } = render(<Textarea width="auto" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-auto')
    })
  })

  describe('maxWidth', () => {
    it('renders pathable-maxw-tablet for maxWidth="tablet"', () => {
      const { container } = render(<Textarea maxWidth="tablet" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-tablet')
    })

    it('renders pathable-maxw-desktop for maxWidth="desktop"', () => {
      const { container } = render(<Textarea maxWidth="desktop" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-desktop')
    })
  })

  describe('combined sizing props', () => {
    it('renders both width and maxWidth classes together', () => {
      const { container } = render(<Textarea width="full" maxWidth="tablet" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
      expect(root.className).toContain('pathable-maxw-tablet')
    })
  })

  describe('className composition', () => {
    it('places consumer className after semantic classes', () => {
      const { container } = render(
        <Textarea width="full" className="my-custom" />,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const baseIdx = cls.indexOf('pathable-textarea')
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
        <Textarea maxWidth="tablet" className="my-area" />,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const maxwIdx = cls.indexOf('pathable-maxw-tablet')
      const customIdx = cls.indexOf('my-area')
      expect(maxwIdx).toBeLessThan(customIdx)
    })

    it('backward compatible with className only (no sizing)', () => {
      const { container } = render(<Textarea className="legacy" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-textarea')
      expect(root.className).toContain('legacy')
    })
  })

  describe('root element invariants', () => {
    it('renders exactly one root element (no wrapper)', () => {
      const { container } = render(<Textarea width="full" />)
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('TEXTAREA')
      expect(container.children).toHaveLength(1)
    })

    it('preserves pathable-textarea class when no sizing props', () => {
      const { container } = render(<Textarea />)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-textarea')
    })

    it('preserves native HTML attributes on the root element', () => {
      const { container } = render(
        <Textarea
          width="full"
          id="test-textarea"
          disabled
          placeholder="Enter text"
          rows={4}
          data-test="value"
          aria-label="textarea label"
        />,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.id).toBe('test-textarea')
      expect(root.getAttribute('disabled')).toBe('')
      expect(root.getAttribute('placeholder')).toBe('Enter text')
      expect(root.getAttribute('rows')).toBe('4')
      expect(root.getAttribute('data-test')).toBe('value')
      expect(root.getAttribute('aria-label')).toBe('textarea label')
    })

    it('rejects children when sizing props are applied', () => {
      const { container } = render(<Textarea width="full" />)
      expect(container.firstElementChild?.children).toHaveLength(0)
    })
  })

  describe('SSR parity', () => {
    it('produces identical output for server and client render', () => {
      const jsx = <Textarea width="full" />
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      const clientHtml = container.innerHTML
      expect(serverHtml).toBe(clientHtml)
    })
  })
})

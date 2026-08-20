import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Select } from '../Select'

describe('Select sizing props', () => {
  describe('width', () => {
    it('renders pathable-width-full for width="full"', () => {
      const { container } = render(
        <Select width="full">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
    })

    it('renders pathable-width-auto for width="auto"', () => {
      const { container } = render(
        <Select width="auto">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-auto')
    })
  })

  describe('maxWidth', () => {
    it('renders pathable-maxw-tablet for maxWidth="tablet"', () => {
      const { container } = render(
        <Select maxWidth="tablet">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-tablet')
    })

    it('renders pathable-maxw-desktop for maxWidth="desktop"', () => {
      const { container } = render(
        <Select maxWidth="desktop">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-desktop')
    })
  })

  describe('combined sizing props', () => {
    it('renders both width and maxWidth classes together', () => {
      const { container } = render(
        <Select width="full" maxWidth="desktop">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
      expect(root.className).toContain('pathable-maxw-desktop')
    })
  })

  describe('className composition', () => {
    it('places consumer className after semantic classes', () => {
      const { container } = render(
        <Select width="full" className="my-custom">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const baseIdx = cls.indexOf('pathable-select')
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
        <Select maxWidth="tablet" className="my-select">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const maxwIdx = cls.indexOf('pathable-maxw-tablet')
      const customIdx = cls.indexOf('my-select')
      expect(maxwIdx).toBeLessThan(customIdx)
    })

    it('backward compatible with className only (no sizing)', () => {
      const { container } = render(
        <Select className="legacy">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-select')
      expect(root.className).toContain('legacy')
    })
  })

  describe('root element invariants', () => {
    it('renders exactly one root element (no wrapper)', () => {
      const { container } = render(
        <Select width="full">
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('SELECT')
      expect(container.children).toHaveLength(1)
    })

    it('preserves pathable-select class when no sizing props', () => {
      const { container } = render(
        <Select>
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-select')
    })

    it('renders children (option elements) correctly with sizing props', () => {
      const { container } = render(
        <Select width="full">
          <option value="1">One</option>
          <option value="2">Two</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.children).toHaveLength(2)
      expect(root.children[0].textContent).toBe('One')
      expect(root.children[1].textContent).toBe('Two')
    })

    it('preserves native HTML attributes on the root element', () => {
      const { container } = render(
        <Select
          width="full"
          id="test-select"
          disabled
          data-test="value"
          aria-label="select label"
        >
          <option>Option 1</option>
        </Select>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.id).toBe('test-select')
      expect(root.getAttribute('disabled')).toBe('')
      expect(root.getAttribute('data-test')).toBe('value')
      expect(root.getAttribute('aria-label')).toBe('select label')
    })
  })

  describe('SSR parity', () => {
    it('produces identical output for server and client render', () => {
      const jsx = (
        <Select width="full">
          <option>Option 1</option>
        </Select>
      )
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      const clientHtml = container.innerHTML
      expect(serverHtml).toBe(clientHtml)
    })
  })
})

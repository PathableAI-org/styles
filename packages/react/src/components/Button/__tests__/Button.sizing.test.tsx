import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Button } from '../Button'

describe('Button sizing props', () => {
  describe('width', () => {
    it('renders pathable-width-full for width="full"', () => {
      const { container } = render(<Button width="full">B</Button>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
    })

    it('renders pathable-width-auto for width="auto"', () => {
      const { container } = render(<Button width="auto">B</Button>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-auto')
    })
  })

  describe('maxWidth', () => {
    it('renders pathable-maxw-tablet for maxWidth="tablet"', () => {
      const { container } = render(<Button maxWidth="tablet">B</Button>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-tablet')
    })

    it('renders pathable-maxw-desktop for maxWidth="desktop"', () => {
      const { container } = render(<Button maxWidth="desktop">B</Button>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-desktop')
    })
  })

  describe('combined sizing props', () => {
    it('renders both width and maxWidth classes together', () => {
      const { container } = render(
        <Button width="full" maxWidth="tablet">
          B
        </Button>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
      expect(root.className).toContain('pathable-maxw-tablet')
    })
  })

  describe('root element invariants', () => {
    it('renders exactly one root element (no wrapper)', () => {
      const { container } = render(<Button width="full">B</Button>)
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('BUTTON')
      expect(container.children).toHaveLength(1)
    })

    it('preserves pathable-button class when no sizing props', () => {
      const { container } = render(<Button>B</Button>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-button')
    })

    it('preserves variant and size classes alongside sizing props', () => {
      const { container } = render(
        <Button variant="secondary" size="big" width="full">
          B
        </Button>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-button--secondary')
      expect(root.className).toContain('pathable-button--big')
      expect(root.className).toContain('pathable-width-full')
    })

    it('preserves native HTML attributes on the root element', () => {
      const { container } = render(
        <Button
          width="full"
          id="test-btn"
          disabled
          data-test="value"
          aria-label="button label"
        >
          B
        </Button>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.id).toBe('test-btn')
      expect(root.getAttribute('disabled')).toBe('')
      expect(root.getAttribute('data-test')).toBe('value')
      expect(root.getAttribute('aria-label')).toBe('button label')
    })

    it('renders children correctly with sizing props', () => {
      const { container } = render(<Button width="full">Click Me</Button>)
      expect(container.textContent).toBe('Click Me')
    })
  })

  describe('SSR parity', () => {
    it('produces identical output for server and client render', () => {
      const jsx = <Button width="full">B</Button>
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      const clientHtml = container.innerHTML
      expect(serverHtml).toBe(clientHtml)
    })
  })
})

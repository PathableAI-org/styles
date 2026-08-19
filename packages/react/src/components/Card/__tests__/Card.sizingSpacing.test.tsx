import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Card } from '../Card'

describe('Card sizing/spacing props', () => {
  describe('Sizing props (US1)', () => {
    it('renders pathable-width-full for width="full"', () => {
      const { container } = render(<Card width="full">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
    })

    it('renders pathable-width-auto for width="auto"', () => {
      const { container } = render(<Card width="auto">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-auto')
    })

    it('renders pathable-maxw-tablet for maxWidth="tablet"', () => {
      const { container } = render(<Card maxWidth="tablet">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-tablet')
    })

    it('renders pathable-maxw-desktop for maxWidth="desktop"', () => {
      const { container } = render(<Card maxWidth="desktop">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-desktop')
    })

    it('renders both width and maxWidth classes together', () => {
      const { container } = render(
        <Card width="full" maxWidth="tablet">
          C
        </Card>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-width-full')
      expect(root.className).toContain('pathable-maxw-tablet')
    })

    it('preserves pathable-card class when no sizing props', () => {
      const { container } = render(<Card>C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-card')
    })

    it('renders without crash and preserves pathable-card class', () => {
      const { container } = render(<Card width="full">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('DIV')
      expect(root.className).toContain('pathable-card')
    })
  })

  describe('Spacing props (US2)', () => {
    it('renders pathable-margin-x-auto for marginX="auto"', () => {
      const { container } = render(<Card marginX="auto">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-margin-x-auto')
    })

    it('renders pathable-margin-x-4 for marginX="4"', () => {
      const { container } = render(<Card marginX="4">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-margin-x-4')
    })

    it('renders pathable-margin-y-4 for marginY="4"', () => {
      const { container } = render(<Card marginY="4">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-margin-y-4')
    })

    it('renders pathable-margin-2 for margin="2"', () => {
      const { container } = render(<Card margin="2">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-margin-2')
    })

    it('renders both marginTop and marginBottom classes', () => {
      const { container } = render(
        <Card marginTop="2" marginBottom="6">
          C
        </Card>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-margin-top-2')
      expect(root.className).toContain('pathable-margin-bottom-6')
    })

    it('directional margin class appears after shorthand margin class', () => {
      const { container } = render(
        <Card margin="2" marginTop="4">
          C
        </Card>,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const idx1 = cls.indexOf('pathable-margin-2')
      const idx2 = cls.indexOf('pathable-margin-top-4')
      expect(idx1).not.toBe(-1)
      expect(idx2).not.toBe(-1)
      expect(idx2).toBeGreaterThan(idx1)
    })
  })

  describe('className composition (US3)', () => {
    it('places consumer className after semantic classes', () => {
      const { container } = render(
        <Card width="full" className="my-custom">
          C
        </Card>,
      )
      const root = container.firstElementChild as HTMLElement
      const cls = root.className
      const cardIdx = cls.indexOf('pathable-card')
      const widthIdx = cls.indexOf('pathable-width-full')
      const customIdx = cls.indexOf('my-custom')
      expect(cardIdx).not.toBe(-1)
      expect(widthIdx).not.toBe(-1)
      expect(customIdx).not.toBe(-1)
      expect(cardIdx).toBeLessThan(widthIdx)
      expect(widthIdx).toBeLessThan(customIdx)
    })

    it('composes maxWidth with consumer className', () => {
      const { container } = render(
        <Card maxWidth="desktop" className="my-app-card">
          C
        </Card>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-maxw-desktop')
      expect(root.className).toContain('my-app-card')
    })

    it('backward compatible with className only', () => {
      const { container } = render(<Card className="legacy">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.className).toContain('pathable-card')
      expect(root.className).toContain('legacy')
    })
  })

  describe('Invariants', () => {
    it('does not introduce wrapper elements with sizing and spacing props', () => {
      const { container } = render(
        <Card width="full" marginX="auto" margin="4">
          C
        </Card>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.tagName).toBe('DIV')
      expect(root.className).toContain('pathable-card')
      expect(root.children.length).toBe(1)
      expect(root.children[0].className).toContain('pathable-card__body')
    })

    it('passes native id attribute to the root element', () => {
      const { container } = render(<Card id="my-card">C</Card>)
      const root = container.firstElementChild as HTMLElement
      expect(root.id).toBe('my-card')
    })

    it('passes data-* attributes to the root element', () => {
      const { container } = render(
        <Card data-testid="card-1" data-custom="x">
          C
        </Card>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.getAttribute('data-testid')).toBe('card-1')
      expect(root.getAttribute('data-custom')).toBe('x')
    })

    it('passes aria-* attributes to the root element', () => {
      const { container } = render(
        <Card aria-label="card label" aria-hidden="true">
          C
        </Card>,
      )
      const root = container.firstElementChild as HTMLElement
      expect(root.getAttribute('aria-label')).toBe('card label')
      expect(root.getAttribute('aria-hidden')).toBe('true')
    })

    it('produces identical output for server and client render', () => {
      const jsx = (
        <Card
          width="full"
          maxWidth="tablet"
          margin="2"
          marginX="auto"
          className="my-custom"
        >
          C
        </Card>
      )
      const serverHtml = renderToString(jsx)
      const { container } = render(jsx)
      const clientHtml = container.innerHTML
      expect(serverHtml).toBe(clientHtml)
    })
  })
})

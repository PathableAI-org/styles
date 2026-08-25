import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React, { createRef } from 'react'
import { ThemeProvider } from '../ThemeProvider'
import { defaultTheme } from '../defaultTheme'
import { createTheme } from '../createTheme'
import { THEME_COLOR_KEYS } from '../tokens'

describe('ThemeProvider', () => {
  const brand = createTheme({
    colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' },
  })

  // ── T005: Emission + scoping ──
  describe('emission and scoping', () => {
    it('renders a wrapper with all 25 --pathable-color-* custom properties', () => {
      const { container } = render(
        <ThemeProvider theme={brand}>
          <span>child</span>
        </ThemeProvider>,
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper).not.toBeNull()
      expect(wrapper!.tagName).toBe('DIV')

      const style = wrapper!.style
      for (const key of THEME_COLOR_KEYS) {
        const propName = `--pathable-color-${key.replace(/[A-Z]/g, (ch) => '-' + ch.toLowerCase())}`
        expect(style.getPropertyValue(propName)).toBe(themeValue(key))
      }
      expect(style.length).toBe(25)
    })

    it('emits overridden values at their specified colors', () => {
      const { container } = render(
        <ThemeProvider theme={brand}>
          <span>child</span>
        </ThemeProvider>,
      )
      const wrapper = container.firstElementChild as HTMLElement
      const style = wrapper.style
      expect(style.getPropertyValue('--pathable-color-accent')).toBe('#7c3aed')
      expect(style.getPropertyValue('--pathable-color-action-primary-bg')).toBe(
        '#7c3aed',
      )
    })

    it('emits non-overridden tokens at defaultTheme values', () => {
      const { container } = render(
        <ThemeProvider theme={brand}>
          <span>child</span>
        </ThemeProvider>,
      )
      const wrapper = container.firstElementChild as HTMLElement
      const style = wrapper.style
      for (const key of THEME_COLOR_KEYS) {
        if (key === 'accent' || key === 'actionPrimaryBg') continue
        const propName = `--pathable-color-${key.replace(/[A-Z]/g, (ch) => '-' + ch.toLowerCase())}`
        expect(style.getPropertyValue(propName)).toBe(
          (defaultTheme.colors as Record<string, string>)[key],
        )
      }
    })

    it('scopes custom properties to the wrapper element only', () => {
      const { container } = render(
        <div data-testid="outer-scope">
          <ThemeProvider theme={brand}>
            <span data-testid="inner-scope">child</span>
          </ThemeProvider>
        </div>,
      )

      const outer = container.querySelector(
        '[data-testid="outer-scope"]',
      )! as HTMLElement
      const inner = container.querySelector(
        '[data-testid="inner-scope"]',
      )! as HTMLElement

      // The outer div should have no custom properties (or at most 0 length.style).
      expect(outer.style.length).toBe(0)

      // The inner span should also have no custom properties — they're on the wrapper only.
      expect(inner.style.length).toBe(0)
    })
  })

  // ── T006: No-wrapper path ──
  describe('no-wrapper optimization', () => {
    it('returns children directly when theme equals defaultTheme (explicit)', () => {
      const { container } = render(
        <ThemeProvider theme={defaultTheme}>
          <span data-testid="child-explicit">content</span>
        </ThemeProvider>,
      )

      const child = container.querySelector('[data-testid="child-explicit"]')!
      expect(child).toBeTruthy()

      // The direct parent should be the container — no wrapper div injected.
      expect(child.parentElement).toBe(container)
    })

    it('returns children directly when theme is omitted', () => {
      const { container } = render(
        <ThemeProvider>
          <span data-testid="child-omitted">content</span>
        </ThemeProvider>,
      )

      const child = container.querySelector('[data-testid="child-omitted"]')!
      expect(child.parentElement).toBe(container)
    })

    it('renders multiple children without a wrapper when default', () => {
      const { container } = render(
        <ThemeProvider theme={defaultTheme}>
          <span data-testid="a">A</span>
          <span data-testid="b">B</span>
        </ThemeProvider>,
      )

      // Both children are direct children of the container.
      const a = container.querySelector('[data-testid="a"]')!
      const b = container.querySelector('[data-testid="b"]')!
      expect(a.parentElement).toBe(container)
      expect(b.parentElement).toBe(container)
    })
  })

  // ── T007: as / ref / native prop forwarding ──
  describe('polymorphism, ref, and native props', () => {
    it('renders a <section> when as="section"', () => {
      const { container } = render(
        <ThemeProvider theme={brand} as="section">
          <span>child</span>
        </ThemeProvider>,
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper.tagName).toBe('SECTION')
    })

    it('forwards native props to the wrapper', () => {
      const { container } = render(
        <ThemeProvider
          theme={brand}
          id="my-id"
          aria-label="my-label"
          className="my-class"
        >
          <span>child</span>
        </ThemeProvider>,
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper.id).toBe('my-id')
      expect(wrapper.getAttribute('aria-label')).toBe('my-label')
      expect(wrapper.className).toBe('my-class')
    })

    it('attaches the forwarded ref to the wrapper', () => {
      const ref = createRef<HTMLElement>()
      render(
        <ThemeProvider theme={brand} ref={ref}>
          <span>child</span>
        </ThemeProvider>,
      )

      expect(ref.current).not.toBeNull()
      expect(ref.current!.tagName).toBe('DIV')
    })

    it('attaches the forwarded ref when as is custom', () => {
      const ref = createRef<HTMLElement>()
      render(
        <ThemeProvider theme={brand} as="main" ref={ref}>
          <span>child</span>
        </ThemeProvider>,
      )

      expect(ref.current).not.toBeNull()
      expect(ref.current!.tagName).toBe('MAIN')
    })

    it('does not leak colorScheme to the DOM', () => {
      const { container } = render(
        <ThemeProvider theme={brand} colorScheme="dark">
          <span>child</span>
        </ThemeProvider>,
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper.hasAttribute('colorScheme')).toBe(false)
      expect(wrapper.hasAttribute('color-scheme')).toBe(false)
    })

    it('does not leak the as prop to the DOM', () => {
      const { container } = render(
        <ThemeProvider theme={brand} as="header">
          <span>child</span>
        </ThemeProvider>,
      )

      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper.getAttribute('as')).toBeNull()
    })

    it('does not forward style when merging with inline styles — inline styles are the token vars only', () => {
      const { container } = render(
        <ThemeProvider theme={brand}>
          <span>child</span>
        </ThemeProvider>,
      )

      const wrapper = container.firstElementChild as HTMLElement
      // The style attribute should contain only the 25 token properties.
      expect(wrapper.getAttribute('style')).toContain('--pathable-color-')
      expect(wrapper.getAttribute('style')).not.toContain('--invalid')
    })
  })

  // ── T009: Nesting precedence (Phase 4 / US2) ──
  describe('nesting precedence', () => {
    const outerTheme = createTheme({
      colors: { accent: '#ff0000' },
    })
    const innerTheme = createTheme({
      colors: { accent: '#0000ff' },
    })

    it('inner provider overrides outer for the same token', () => {
      const { container } = render(
        <ThemeProvider theme={outerTheme}>
          <span data-testid="outer-child">outer</span>
          <ThemeProvider theme={innerTheme}>
            <span data-testid="inner-child">inner</span>
          </ThemeProvider>
        </ThemeProvider>,
      )

      // Find the inner wrapper (the deepest div)
      const wrappers = container.querySelectorAll('div')
      expect(wrappers.length).toBeGreaterThanOrEqual(2)

      const innerWrapper = wrappers[wrappers.length - 1]
      expect(
        innerWrapper.style.getPropertyValue('--pathable-color-accent'),
      ).toBe('#0000ff')

      // The outer wrapper should have its own acent.
      const outerWrapper = wrappers[0]
      expect(
        outerWrapper.style.getPropertyValue('--pathable-color-accent'),
      ).toBe('#ff0000')
    })

    it('innermost of three providers wins', () => {
      const t1 = createTheme({ colors: { accent: '#111111' } })
      const t2 = createTheme({ colors: { accent: '#222222' } })
      const t3 = createTheme({ colors: { accent: '#333333' } })

      const { container } = render(
        <ThemeProvider theme={t1}>
          <ThemeProvider theme={t2}>
            <ThemeProvider theme={t3}>
              <span data-testid="deep">deep</span>
            </ThemeProvider>
          </ThemeProvider>
        </ThemeProvider>,
      )

      const wrappers = container.querySelectorAll('div')
      expect(wrappers.length).toBe(3)
      expect(
        wrappers[2].style.getPropertyValue('--pathable-color-accent'),
      ).toBe('#333333')
    })

    it('inner token falls through to outer when inner uses default', () => {
      const { container } = render(
        <ThemeProvider theme={outerTheme}>
          <span data-testid="outer-child">outer</span>
          <ThemeProvider theme={defaultTheme}>
            <span data-testid="inner-child">inner</span>
          </ThemeProvider>
        </ThemeProvider>,
      )

      // The inner default provider renders NO wrapper — just the outer.
      const wrappers = container.querySelectorAll('div')
      expect(wrappers.length).toBe(1)
      expect(
        wrappers[0].style.getPropertyValue('--pathable-color-accent'),
      ).toBe('#ff0000')
    })
  })

  // ── T011: colorScheme no-op (Phase 5 / US3) ──
  describe('colorScheme no-op', () => {
    it('renders without error with colorScheme="light"', () => {
      const { container } = render(
        <ThemeProvider theme={brand} colorScheme="light">
          <span>child</span>
        </ThemeProvider>,
      )

      expect(container.firstElementChild).not.toBeNull()
    })

    it('renders without error with colorScheme="dark"', () => {
      const { container } = render(
        <ThemeProvider theme={brand} colorScheme="dark">
          <span>child</span>
        </ThemeProvider>,
      )

      expect(container.firstElementChild).not.toBeNull()
    })

    it('produces identical output for light and dark', () => {
      const { container: c1 } = render(
        <ThemeProvider theme={brand} colorScheme="light">
          <span>child</span>
        </ThemeProvider>,
      )
      const { container: c2 } = render(
        <ThemeProvider theme={brand} colorScheme="dark">
          <span>child</span>
        </ThemeProvider>,
      )

      const html1 = c1.innerHTML
      const html2 = c2.innerHTML
      expect(html1).toBe(html2)
    })
  })
})

function themeValue(key: string): string {
  const brand = createTheme({
    colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' },
  })
  return (brand.colors as Record<string, string>)[key]
}

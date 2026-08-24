import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Page } from '../Page'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('Page', () => {
  it('renders main element with Container and Stack composition', () => {
    const { container } = render(
      <Page>
        <section>A</section>
      </Page>,
    )
    const root = container.firstElementChild!

    expect(root.tagName).toBe('MAIN')
    expect(classList(root)).toContain('pathable-container')
    expect(classList(root)).toContain('pathable-container--standard')
    expect(root.children).toHaveLength(1)

    const stack = root.children[0]
    expect(stack.tagName).toBe('DIV')
    expect(classList(stack)).toContain('pathable-stack')
    expect(classList(stack)).toContain('pathable-stack--gap-md')
  })

  it('renders standard size by default', () => {
    const { container } = render(<Page />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-container--standard')
  })

  it('applies wide size', () => {
    const { container } = render(<Page size="wide" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-container--wide')
  })

  it('applies full size', () => {
    const { container } = render(<Page size="full" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-container--full')
  })

  it('applies gap modifiers', () => {
    const { container } = render(<Page gap="sm" />)
    const root = container.firstElementChild!
    const stack = root.children[0]
    expect(classList(stack)).toContain('pathable-stack--gap-sm')
  })

  it('renders a single child correctly', () => {
    const { container } = render(
      <Page>
        <section>A</section>
      </Page>,
    )
    const root = container.firstElementChild!
    const stack = root.children[0]
    expect(stack.children).toHaveLength(1)
    expect(stack.children[0].tagName).toBe('SECTION')
  })

  it('renders empty when no children provided', () => {
    const { container } = render(<Page />)
    const root = container.firstElementChild!
    const stack = root.children[0]
    expect(stack.children).toHaveLength(0)
  })

  it('appends consumer className to Container element', () => {
    const { container } = render(<Page className="my-page" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('my-page')
  })

  it('renders as a different element via as prop', () => {
    const { container } = render(<Page as="div" />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('DIV')
    expect(classList(root)).toContain('pathable-container')
  })

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLElement>()
    render(<Page ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('MAIN')
  })

  it('produces identical output during SSR', () => {
    const clientOutput = render(
      <Page size="wide" gap="lg">
        <section>A</section>
      </Page>,
    ).container.innerHTML
    const serverOutput = renderToString(
      <Page size="wide" gap="lg">
        <section>A</section>
      </Page>,
    )
    expect(serverOutput).toBe(clientOutput)
  })

  it('passes through native HTML attributes', () => {
    const { container } = render(
      <Page id="main-page" data-testid="page" aria-label="Main content" />,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('main-page')
    expect(root.getAttribute('data-testid')).toBe('page')
    expect(root.getAttribute('aria-label')).toBe('Main content')
  })
})

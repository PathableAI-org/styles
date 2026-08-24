import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { FormStack } from '../FormStack'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('FormStack', () => {
  it('renders a form element with pathable-stack by default', () => {
    const { container } = render(<FormStack />)
    const root = container.firstElementChild!

    expect(root.tagName).toBe('FORM')
    expect(classList(root)).toContain('pathable-stack')
    expect(classList(root)).toContain('pathable-stack--gap-md')
  })

  it('renders children directly', () => {
    const { container } = render(
      <FormStack>
        <span data-testid="a">A</span>
      </FormStack>,
    )
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(1)
    expect(root.children[0].tagName).toBe('SPAN')
  })

  it('applies gap modifiers', () => {
    const { container } = render(<FormStack gap="sm" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-stack--gap-sm')
  })

  it('applies pathable-maxw-tablet when maxWidth="tablet"', () => {
    const { container } = render(<FormStack maxWidth="tablet" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-maxw-tablet')
  })

  it('applies pathable-maxw-desktop when maxWidth="content"', () => {
    const { container } = render(<FormStack maxWidth="content" />)
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-maxw-desktop')
  })

  it('does not apply max-width class when maxWidth is omitted', () => {
    const { container } = render(<FormStack />)
    const root = container.firstElementChild!
    expect(classList(root)).not.toContain('pathable-maxw-tablet')
    expect(classList(root)).not.toContain('pathable-maxw-desktop')
  })

  it('renders empty when no children', () => {
    const { container } = render(<FormStack />)
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(0)
  })

  it('does not impose surface treatment on non-FormGroup children', () => {
    const { container } = render(
      <FormStack>
        <div>Custom child</div>
      </FormStack>,
    )
    const root = container.firstElementChild!
    expect(root.children[0].tagName).toBe('DIV')
    expect(root.children[0].children).toHaveLength(0)
  })

  it('appends consumer className after component classes', () => {
    const { container } = render(<FormStack className="my-form" />)
    const root = container.firstElementChild!
    const classes = classList(root)
    expect(classes).toContain('pathable-stack')
    expect(classes).toContain('my-form')
    expect(classes.indexOf('pathable-stack')).toBeLessThan(
      classes.indexOf('my-form'),
    )
  })

  it('renders as a div when as="div"', () => {
    const { container } = render(<FormStack as="div" />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('DIV')
    expect(classList(root)).toContain('pathable-stack')
  })

  it('forwards ref to the root form element', () => {
    const ref = createRef<HTMLFormElement>()
    render(<FormStack ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('FORM')
  })

  it('produces identical output during SSR', () => {
    const clientOutput = render(
      <FormStack gap="lg" maxWidth="tablet">
        <span>A</span>
      </FormStack>,
    ).container.innerHTML
    const serverOutput = renderToString(
      <FormStack gap="lg" maxWidth="tablet">
        <span>A</span>
      </FormStack>,
    )
    expect(serverOutput).toBe(clientOutput)
  })

  it('passes through native HTML attributes', () => {
    const { container } = render(
      <FormStack id="login-form" data-testid="form" aria-label="Login" />,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('login-form')
    expect(root.getAttribute('data-testid')).toBe('form')
    expect(root.getAttribute('aria-label')).toBe('Login')
  })
})

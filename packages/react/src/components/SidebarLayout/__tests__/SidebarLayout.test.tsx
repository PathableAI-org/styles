import React, { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { SidebarLayout } from '../SidebarLayout'

function classList(element: Element): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

describe('SidebarLayout', () => {
  it('renders with pathable-sidebar-layout and default ratio', () => {
    const { container } = render(
      <SidebarLayout>
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    const root = container.firstElementChild!
    expect(root.tagName).toBe('DIV')
    expect(classList(root)).toContain('pathable-sidebar-layout')
    expect(classList(root)).toContain('pathable-sidebar-layout--ratio-3-1')
  })

  it('renders main and aside landmarks', () => {
    const { container } = render(
      <SidebarLayout>
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(2)
    expect(root.children[0].tagName).toBe('MAIN')
    expect(root.children[1].tagName).toBe('ASIDE')
  })

  it('applies ratio modifiers', () => {
    const { container } = render(
      <SidebarLayout ratio="2-1">
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-sidebar-layout--ratio-2-1')
  })

  it('applies sidebarFirst modifier and reverses DOM order', () => {
    const { container } = render(
      <SidebarLayout sidebarFirst>
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    const root = container.firstElementChild!
    expect(classList(root)).toContain('pathable-sidebar-layout--sidebar-first')

    // sidebarFirst: aside before main
    expect(root.children[0].tagName).toBe('ASIDE')
    expect(root.children[1].tagName).toBe('MAIN')
  })

  it('does not apply sidebarFirst modifier by default', () => {
    const { container } = render(
      <SidebarLayout>
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    const root = container.firstElementChild!
    expect(classList(root)).not.toContain(
      'pathable-sidebar-layout--sidebar-first',
    )
  })

  it('preserves main content when only one child is provided', () => {
    const { container } = render(
      <SidebarLayout>
        <div>Main</div>
      </SidebarLayout>,
    )
    const root = container.firstElementChild!
    expect(root.children).toHaveLength(2)
    // Main element exists with content
    expect(root.children[0].tagName).toBe('MAIN')
    // Aside exists but has no content
    expect(root.children[1].tagName).toBe('ASIDE')
  })

  it('appends consumer className', () => {
    const { container } = render(
      <SidebarLayout className="my-layout">
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    const root = container.firstElementChild!
    expect(classList(root)).toContain('my-layout')
  })

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <SidebarLayout ref={ref}>
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    expect(ref.current).not.toBeNull()
    expect(ref.current!.tagName).toBe('DIV')
    expect(ref.current!.className).toContain('pathable-sidebar-layout')
  })

  it('produces identical output during SSR', () => {
    const clientOutput = render(
      <SidebarLayout ratio="2-1" sidebarSticky>
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    ).container.innerHTML
    const serverOutput = renderToString(
      <SidebarLayout ratio="2-1" sidebarSticky>
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    expect(serverOutput).toBe(clientOutput)
  })

  it('passes through native HTML attributes', () => {
    const { container } = render(
      <SidebarLayout id="app-layout">
        <div>Main</div>
        <div>Sidebar</div>
      </SidebarLayout>,
    )
    const root = container.firstElementChild!
    expect(root.getAttribute('id')).toBe('app-layout')
  })
})

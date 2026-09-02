import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'

import { AppShell } from '../AppShell'
import { AppShellNavItem } from '../AppShellNavItem'

afterEach(cleanup)

function navigation() {
  return (
    <>
      <AppShellNavItem href="/">Today</AppShellNavItem>
      <AppShellNavItem href="/students">Students</AppShellNavItem>
    </>
  )
}

describe('AppShell', () => {
  it('preserves the default main and skip-link contract', () => {
    const { container, getAllByRole, getByRole } = render(
      <AppShell
        bottomNavItems={[
          { label: 'Mobile home', href: '/mobile', icon: <span /> },
        ]}
        sidebarNav={navigation()}
      >
        Content
      </AppShell>,
    )

    expect(
      getByRole('link', { name: 'Skip to main content' }).getAttribute('href'),
    ).toBe('#main-content')
    expect(getByRole('main').getAttribute('id')).toBe('main-content')
    expect(container.querySelector('.pathable-app-shell') !== null).toBe(true)
    expect(getAllByRole('navigation', { name: 'Primary' })).toHaveLength(2)
    expect(
      getByRole('link', { name: 'Mobile home' }).getAttribute('href'),
    ).toBe('/mobile')
  })

  it('derives the skip target from consumer main attributes', () => {
    const { getByRole } = render(
      <AppShell
        mainProps={{
          'aria-label': 'Workspace',
          className: 'consumer-main',
          id: 'main',
          tabIndex: -1,
        }}
        skipLinkText="Skip repeated navigation"
      >
        Content
      </AppShell>,
    )

    expect(
      getByRole('link', {
        name: 'Skip repeated navigation',
      }).getAttribute('href'),
    ).toBe('#main')
    expect(
      getByRole('main', { name: 'Workspace' }).getAttribute('tabindex'),
    ).toBe('-1')
    expect([...getByRole('main').classList]).toEqual(
      expect.arrayContaining([
        'pathable-app-shell__content',
        'pathable-app-shell__content--standard',
        'consumer-main',
      ]),
    )
  })

  it('labels the canonical navigation region', () => {
    const { getByRole } = render(
      <AppShell navigationLabel="Product" sidebarNav={navigation()}>
        Content
      </AppShell>,
    )

    expect(getByRole('navigation', { name: 'Product' }).tagName).toBe('NAV')
  })

  it('reuses one navigation region across breakpoints in shared mode', () => {
    const { container, getAllByRole, getByRole } = render(
      <AppShell
        bottomNavItems={[
          { label: 'Duplicate', href: '/duplicate', icon: <span /> },
        ]}
        mobileNavigation="shared"
        navigationLabel="Primary"
        sidebarNav={navigation()}
      >
        Content
      </AppShell>,
    )

    expect(
      container.firstElementChild?.classList.contains(
        'pathable-app-shell--shared-navigation',
      ),
    ).toBe(true)
    expect(getAllByRole('navigation')).toHaveLength(1)
    expect(
      getByRole('navigation', { name: 'Primary' }).contains(
        getByRole('link', { name: 'Today' }),
      ),
    ).toBe(true)
    expect(
      getByRole('navigation', { name: 'Primary' }).contains(
        getByRole('link', { name: 'Students' }),
      ),
    ).toBe(true)
  })

  it('produces equivalent SSR output without leaking component props', () => {
    const shell = (
      <AppShell
        mainProps={{ id: 'main', tabIndex: -1 }}
        mobileNavigation="shared"
        navigationLabel="Primary"
        sidebarNav={navigation()}
        skipLinkText="Skip navigation"
      >
        Content
      </AppShell>
    )

    const clientRoot = render(shell).container.firstElementChild
    const serverContainer = document.createElement('div')
    serverContainer.innerHTML = renderToString(shell)
    const serverRoot = serverContainer.firstElementChild

    expect(clientRoot).not.toBeNull()
    expect(serverRoot).not.toBeNull()
    expect(clientRoot?.isEqualNode(serverRoot)).toBe(true)

    for (const attribute of [
      'mainprops',
      'mobilenavigation',
      'navigationlabel',
      'skiplinktext',
    ]) {
      expect(clientRoot?.hasAttribute(attribute)).toBe(false)
      expect(serverRoot?.hasAttribute(attribute)).toBe(false)
    }
  })
})

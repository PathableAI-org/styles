import { userEvent, within, expect } from 'storybook/test'
import {
  verifyLandmarkName,
  type StoryHarness,
} from '@pathable/storybook-contracts'

export default {
  title: 'Components/Navigation/Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathableai/styles/js` to enable interactive behavior.\n\n**Interaction Model**: Requires USWDS JS\n**USWDS JS Behaviors**: Mobile menu toggle, responsive navigation\n**Shared semantics verified**: the primary navigation is a `navigation` landmark with an accessible name.\n**Consumers must**: Import `@pathableai/styles/js` to enable interactive behavior.',
      },
    },
  },
}

function harnessFor(root: HTMLElement): StoryHarness {
  return {
    root,
    within,
    userEvent,
    expect,
  }
}

const HeaderMarkup = `
<div class="pathable-overlay usa-overlay"></div>
<header class="pathable-header pathable-header--basic usa-header usa-header--basic">
  <div class="pathable-nav-container usa-nav-container">
    <div class="pathable-navbar usa-navbar">
      <div class="pathable-logo usa-logo" id="basic-logo">
        <em class="pathable-logo__text usa-logo__text">
          <a href="#">PathAble</a>
        </em>
      </div>
      <button type="button" class="pathable-menu-btn usa-menu-btn">Menu</button>
    </div>
    <nav class="pathable-nav usa-nav" aria-label="Primary navigation">
      <button type="button" class="pathable-nav__close usa-nav__close" aria-label="Close navigation">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4l-6.3 6.31-1.41-1.42L9.17 12l-6.29-6.29 1.41-1.42 6.3 6.31 6.3-6.31 1.41 1.42Z"></path>
        </svg>
      </button>
      <ul class="pathable-nav__primary usa-nav__primary usa-accordion">
        <li class="pathable-nav__primary-item usa-nav__primary-item">
          <a class="usa-nav-link" href="#">Participants</a>
        </li>
        <li class="pathable-nav__primary-item usa-nav__primary-item">
          <a class="usa-nav-link" href="#">Coaching Sessions</a>
        </li>
        <li class="pathable-nav__primary-item usa-nav__primary-item">
          <a class="usa-nav-link" href="#">Support Activities</a>
        </li>
      </ul>
    </nav>
  </div>
</header>
`

export const Default = {
  render: () => HeaderMarkup,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)

    await verifyLandmarkName(harness, 'navigation', /Primary navigation/i)
  },
}

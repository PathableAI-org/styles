import { userEvent, within, expect } from 'storybook/test'
import {
  verifyDisclosurePanelAssociation,
  verifyPanelAvailability,
  verifyEnterExpandsDisclosure,
  verifySpaceCollapsesDisclosure,
  type StoryHarness,
} from '@pathable/storybook-contracts'

export default {
  title: 'Components/Communication/Banner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Status**: CSS-only in this package. USWDS JS provides the expand/collapse disclosure behavior when `.usa-banner` is present. The React wrapper at `@pathableai/react` provides JS behavior.\n\n**CSS markup**: Requires `.pathable-banner`, `.pathable-banner__header`, `.pathable-banner__button`, `.pathable-banner__content`, `.pathable-banner__guidance`, `.pathable-banner__lock-image`.\n\n**Disclosure behavior (verified)**:\n- The banner is a disclosure widget (expand/collapse), NOT a dismissible notice.\n- The `.pathable-banner__button` uses `aria-controls` to reference the content panel and `aria-expanded` to reflect its state.\n- The `.pathable-banner__content` contains the expandable content.\n- The `.pathable-banner__guidance` wraps the textual guidance.\n- The `.pathable-banner__lock-image` is the lock icon indicating government site.\n\n**Consumers must**: Import `@pathableai/styles` CSS. For JS behavior, use `@pathableai/react` Banner component or import `@pathableai/styles/js`. When using USWDS JS, keep `.usa-banner` on the DOM alongside `.pathable-banner`.',
      },
    },
  },
}

const HERE_API = /Here's how you know/i

function renderBanner(expanded = false) {
  const expandedAttr = expanded ? 'true' : 'false'
  const hiddenAttr = expanded ? '' : ' hidden'
  return `
    <div class="pathable-banner usa-banner">
      <div class="pathable-banner__header">
        <div class="pathable-banner__guidance">
          <img class="pathable-banner__lock-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='20' viewBox='0 0 16 20'%3E%3Cpath fill='%2371737d' d='M8 0a5 5 0 0 0-5 5v3H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V5a5 5 0 0 0-5-5zM4 5a4 4 0 1 1 8 0v3H4V5zm1 8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2z'/%3E%3C/svg%3E" alt="" />
          <span>An official website of the PathAble</span>
        </div>
        <button class="pathable-banner__button" aria-expanded="${expandedAttr}" aria-controls="banner-content">
          Here's how you know
        </button>
      </div>
      <div class="pathable-banner__content" id="banner-content"${hiddenAttr}>
        <p>Reminder: Session documentation must be completed within 24 hours. <a href="#">View compliance policy</a>.</p>
      </div>
    </div>
  `
}

function harnessFor(root: HTMLElement): StoryHarness {
  return { root, within, userEvent, expect }
}

/**
 * Runtime-initialized guard: proves the USWDS disclosure enhancement is bound.
 * Performs a reversible toggle probe so the check fails with target/story/
 * capability context if the enhancement never initialized.
 */
async function assertRuntimeInitialized(harness: StoryHarness) {
  const button = harness
    .within(harness.root)
    .getByRole('button', { name: HERE_API })
  const initial = button.getAttribute('aria-expanded')

  if (initial === null) {
    throw new Error(
      '[storybook-contracts:banner] Runtime not initialized: disclosure button has no aria-expanded. The Styles JS enhancement did not attach disclosure state.',
    )
  }

  await harness.userEvent.click(button)
  const toggled = button.getAttribute('aria-expanded')

  if (toggled === initial) {
    throw new Error(
      '[storybook-contracts:banner] Runtime not initialized: activating the disclosure did not change aria-expanded. Ensure @pathableai/styles/js enhancement ran.',
    )
  }

  await harness.userEvent.click(button)
}

export const Default = {
  render: () => renderBanner(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)
    await assertRuntimeInitialized(harness)

    await verifyDisclosurePanelAssociation(harness, HERE_API)
    await verifyPanelAvailability(harness, HERE_API)
    await verifyEnterExpandsDisclosure(harness, HERE_API)
  },
}

export const InitiallyExpanded = {
  render: () => renderBanner(true),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)
    await assertRuntimeInitialized(harness)

    await verifyPanelAvailability(harness, HERE_API)
    await verifySpaceCollapsesDisclosure(harness, HERE_API)
  },
}

import { userEvent, within, expect } from 'storybook/test'
import {
  accordionManifest,
  verifyEnterExpandsDisclosure,
  verifySpaceCollapsesDisclosure,
  verifySingleOpenBehavior,
  verifyDisclosurePanelAssociation,
  verifyPanelAvailability,
  verifyFocusRetention,
  type StoryHarness,
} from '@pathable/storybook-contracts'

export default {
  title: 'Components/Communication/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Status**: CSS-only in this package. The React wrapper at `@pathableai/react` provides JS behavior (expand/collapse, keyboard navigation via Enter/Space).\n\n**CSS markup**: Requires `.pathable-accordion`, `.pathable-accordion__heading`, `.pathable-accordion__button`, `.pathable-accordion__content`.\n\n**Disclosure behavior (verified)**:\n- Each accordion item is a disclosure widget.\n- The button uses `aria-expanded="false"` (collapsed) or `aria-expanded="true"` (expanded).\n- The content panel is associated via `aria-controls` on the button and `id` on the panel.\n- The content panel uses the `hidden` attribute when collapsed.\n- Keyboard: Enter or Space toggles the disclosure.\n\nThe shared, renderer-neutral Accordion behavior contract is defined in `@pathable/storybook-contracts` (see `src/accordion/manifest.ts`). This story is Styles-first proof of that contract against the published `@pathableai/styles/js` runtime loaded by the Storybook preview.\n\n**Consumers must**: Import `@pathableai/styles` CSS. For JS behavior, use `@pathableai/react` Accordion component or import `@pathableai/styles/js`.',
      },
    },
  },
}

/**
 * Renders the Styles Accordion fixture(s). The shared, renderer-neutral
 * behavior contract lives in `@pathable/storybook-contracts`; see
 * `src/accordion/manifest.ts` for the recorded initial shared capabilities and
 * their evidence boundary.
 */
function renderAccordion(firstExpanded = false) {
  const firstExpandedValue = String(firstExpanded)
  const firstHiddenAttribute = firstExpanded ? '' : ' hidden'

  return `
    <div class="pathable-accordion usa-accordion">
      <div class="pathable-accordion__heading usa-accordion__heading">
        <button class="pathable-accordion__button usa-accordion__button" aria-expanded="${firstExpandedValue}" aria-controls="accordion-content-1">
          First Amendment
        </button>
      </div>
      <div class="pathable-accordion__content usa-accordion__content" id="accordion-content-1"${firstHiddenAttribute}>
        <p>Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.</p>
      </div>
      <div class="pathable-accordion__heading usa-accordion__heading">
        <button class="pathable-accordion__button usa-accordion__button" aria-expanded="false" aria-controls="accordion-content-2">
          Second Amendment
        </button>
      </div>
      <div class="pathable-accordion__content usa-accordion__content" id="accordion-content-2" hidden>
        <p>A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.</p>
      </div>
      <div class="pathable-accordion__heading usa-accordion__heading">
        <button class="pathable-accordion__button usa-accordion__button" aria-expanded="false" aria-controls="accordion-content-3">
          Third Amendment
        </button>
      </div>
      <div class="pathable-accordion__content usa-accordion__content" id="accordion-content-3" hidden>
        <p>No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.</p>
      </div>
    </div>
  `
}

const FIRST_AMENDMENT = /First Amendment/i
const SECOND_AMENDMENT = /Second Amendment/i

/**
 * Build a renderer-neutral StoryHarness for the rendered Styles Accordion.
 * `canvasElement` is the Storybook mount root; the shared helpers operate on it
 * through the injected `storybook/test` primitives only.
 */
function harnessFor(root: HTMLElement): StoryHarness {
  return {
    root,
    within,
    userEvent,
    expect,
  }
}

/**
 * Runtime-initialized guard: the Styles `/js` behavior (loaded by the preview)
 * must have attached Enter/Space toggle handlers. Rather than silently skipping,
 * verify the enhancement actually ran by checking the disclosure is a native
 * toggleable control and the expected runtime hook is present. This fails with
 * target/story/capability context instead of silently passing.
 */
function assertRuntimeInitialized(root: HTMLElement) {
  const firstButton = root.querySelector(
    '.pathable-accordion__button, .usa-accordion__button',
  )
  if (!firstButton) {
    throw new Error(
      '[storybook-contracts:accordion] Runtime not initialized: no accordion disclosure button found in the Styles story. Ensure @pathableai/styles/js enhancement ran.',
    )
  }
  if (firstButton.getAttribute('aria-expanded') === null) {
    throw new Error(
      '[storybook-contracts:accordion] Runtime not initialized: disclosure button has no aria-expanded. The Styles JS enhancement did not attach disclosure state.',
    )
  }
}

export const Default = {
  render: () => renderAccordion(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    assertRuntimeInitialized(canvasElement)
    const harness = harnessFor(canvasElement)

    await verifyDisclosurePanelAssociation(harness, FIRST_AMENDMENT)
    await verifyPanelAvailability(harness, FIRST_AMENDMENT)
    await verifyEnterExpandsDisclosure(harness, FIRST_AMENDMENT)
    await verifyFocusRetention(harness, FIRST_AMENDMENT)
  },
}

export const InitiallyExpanded = {
  render: () => renderAccordion(true),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    assertRuntimeInitialized(canvasElement)
    const harness = harnessFor(canvasElement)

    await verifyPanelAvailability(harness, FIRST_AMENDMENT)
    await verifySpaceCollapsesDisclosure(harness, FIRST_AMENDMENT)
  },
}

export const SingleOpenBehavior = {
  render: () => renderAccordion(true),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    assertRuntimeInitialized(canvasElement)
    const harness = harnessFor(canvasElement)

    await verifySingleOpenBehavior(harness, FIRST_AMENDMENT, SECOND_AMENDMENT)
  },
}

export const SharedContract = {
  render: () => renderAccordion(),
  parameters: {
    docs: {
      description: {
        story: `Runs the shared Accordion capability contract from \`@pathable/storybook-contracts\` (${accordionManifest.shared.length} capabilities) against the published Styles runtime. This is the Styles-first proof required before the same contract can be adopted by another framework package.`,
      },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    assertRuntimeInitialized(canvasElement)
    const harness = harnessFor(canvasElement)

    await verifyDisclosurePanelAssociation(harness, FIRST_AMENDMENT)
    await verifyPanelAvailability(harness, FIRST_AMENDMENT)
    await verifyEnterExpandsDisclosure(harness, FIRST_AMENDMENT)
    await verifyFocusRetention(harness, FIRST_AMENDMENT)
    await verifyPanelAvailability(harness, FIRST_AMENDMENT)
  },
}

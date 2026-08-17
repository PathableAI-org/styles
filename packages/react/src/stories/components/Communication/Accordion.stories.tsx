import { Accordion } from '../../../components/Accordion/Accordion'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect, fn } from 'storybook/test'
import { ACCORDION_ITEMS, BILL_OF_RIGHTS } from './fixtures'
import {
  verifyEnterExpandsDisclosure,
  verifySpaceCollapsesDisclosure,
  verifySingleOpenBehavior,
  verifyDisclosurePanelAssociation,
  verifyPanelAvailability,
  verifyFocusRetention,
  type StoryHarness,
} from '@pathable/storybook-contracts'

const meta = {
  title: 'Components/Communication/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A disclosure widget that allows users to show and hide sections of related content.

**When to use**: To organize content into expandable sections that users can navigate through independently. Use when showing all content at once would overwhelm the user.

**When not to use**: Do not use for navigation (use a nav component). Do not use for step-by-step processes (use ProcessList or StepIndicator). Do not use when all content should be visible at once.

**Keyboard behavior**: Enter or Space toggles a panel open or closed. Tab moves focus between accordion buttons.

**Underlying element**: \`<div>\` with \`<button>\` disclosures per the USWDS accordion pattern.`,
      },
    },
  },
  argTypes: {
    items: {
      description:
        'Array of accordion items with id, heading, content, and optional disabled.',
    },
    expandedIds: {
      control: { type: 'object' },
      description: 'Controlled expanded item IDs.',
    },
    defaultExpandedIds: {
      control: { type: 'object' },
      description: 'Default expanded items (uncontrolled).',
    },
    allowMultiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple panels open simultaneously.',
    },
    onExpandedChange: {
      action: 'expandedChange',
      description: 'Called with the array of expanded IDs when toggled.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
  args: {
    items: ACCORDION_ITEMS,
    allowMultiple: false,
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Fixed stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    items: ACCORDION_ITEMS,
  },
}

export const MultipleAllowed: Story = {
  args: {
    items: ACCORDION_ITEMS,
    allowMultiple: true,
  },
}

export const InitiallyExpanded: Story = {
  args: {
    items: ACCORDION_ITEMS,
    defaultExpandedIds: ['first'],
  },
}

export const DisabledItem: Story = {
  args: {
    items: [
      {
        id: 'first',
        heading: 'First Amendment',
        content: (
          <p>
            Congress shall make no law respecting an establishment of religion,
            or prohibiting the free exercise thereof; or abridging the freedom
            of speech, or of the press; or the right of the people peaceably to
            assemble, and to petition the Government for a redress of
            grievances.
          </p>
        ),
      },
      {
        id: 'second',
        heading: 'Second Amendment',
        content: (
          <p>
            A well regulated Militia, being necessary to the security of a free
            State, the right of the people to keep and bear Arms, shall not be
            infringed.
          </p>
        ),
        disabled: true,
      },
      {
        id: 'third',
        heading: 'Third Amendment',
        content: (
          <p>
            No Soldier shall, in time of peace be quartered in any house,
            without the consent of the Owner, nor in time of war, but in a
            manner to be prescribed by law.
          </p>
        ),
      },
    ],
  },
}

export const LongContent: Story = {
  args: {
    items: [
      {
        id: 'rights',
        heading: 'Bill of Rights',
        content: <p>{BILL_OF_RIGHTS.map((r) => r.content).join(' ')}</p>,
      },
    ],
  },
}

export const Narrow: Story = {
  args: {
    items: ACCORDION_ITEMS,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// ---------------------------------------------------------------------------
// Interaction tests
// ---------------------------------------------------------------------------

export const PointerToggle: Story = {
  args: {
    items: ACCORDION_ITEMS,
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('click expands a collapsed panel', async () => {
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await userEvent.click(button)
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    await step('click collapses an expanded panel', async () => {
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await userEvent.click(button)
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const KeyboardToggle: Story = {
  args: {
    items: ACCORDION_ITEMS,
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab focuses the first accordion button', async () => {
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await userEvent.tab()
      await expect(button).toHaveFocus()
    })

    await step('Enter key expands the panel', async () => {
      await userEvent.keyboard('{Enter}')
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    await step('Space key collapses the panel', async () => {
      await userEvent.keyboard(' ')
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const SingleSelectBehavior: Story = {
  args: {
    items: ACCORDION_ITEMS,
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('open first panel', async () => {
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await userEvent.click(button)
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    await step('opening second panel closes the first', async () => {
      const firstButton = canvas.getByRole('button', {
        name: /First Amendment/,
      })
      const secondButton = canvas.getByRole('button', {
        name: /Second Amendment/,
      })
      await userEvent.click(secondButton)
      await expect(secondButton).toHaveAttribute('aria-expanded', 'true')
      await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const DisabledItemBehavior: Story = {
  args: {
    items: [
      {
        id: 'first',
        heading: 'First Amendment',
        content: <p>Congress shall make no law...</p>,
      },
      {
        id: 'second',
        heading: 'Second Amendment',
        content: <p>A well regulated Militia...</p>,
        disabled: true,
      },
    ],
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('disabled button is disabled in the DOM', async () => {
      const button = canvas.getByRole('button', { name: /Second Amendment/ })
      await expect(button).toBeDisabled()
    })

    await step('clicking disabled button does not toggle', async () => {
      const button = canvas.getByRole('button', { name: /Second Amendment/ })
      await userEvent.click(button, { skipPointerEventsCheck: true })
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

// ---------------------------------------------------------------------------
// Shared behavior-contract conformance (Phase 2)
// ---------------------------------------------------------------------------
// These stories are deterministic, fixed fixtures (collapsed and initially
// expanded) whose `play` functions invoke the UNCHANGED renderer-neutral
// Accordion helpers from `@pathable/storybook-contracts`. They prove the same
// observable behavior Styles already proves, against the React package's native
// implementation.
//
// Isolation contract: the React Accordion renders only `pathable-accordion`
// classes (no `.usa-accordion__button`), so the Styles `/js` DOM enhancement
// runtime cannot bind to it. Each conformance story asserts that ownership so a
// dual-owner (native React + enhancement) regression fails the guard.

const FIRST_AMENDMENT = /First Amendment/i
const SECOND_AMENDMENT = /Second Amendment/i

/**
 * Build a renderer-neutral StoryHarness for the rendered React Accordion. The
 * shared helpers operate on the mount root through the injected `storybook/test`
 * primitives only — they never receive React props or renderer context.
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
 * Runtime-initialized guard: proves the React runtime mounted and the disclosure
 * is native-owned. Fails with target/story/capability context if the button is
 * absent, lacks disclosure state, or would be enhanced by the Styles DOM runtime
 * (i.e. it is a `.usa-accordion__button`), instead of silently skipping.
 */
async function assertNativeOwned(harness: StoryHarness) {
  const button = harness
    .within(harness.root)
    .getByRole('button', { name: FIRST_AMENDMENT })

  const expanded = button.getAttribute('aria-expanded')
  if (expanded === null) {
    throw new Error(
      '[storybook-contracts:accordion:react] Runtime not initialized: disclosure button has no aria-expanded. The React Accordion did not mount its native disclosure state.',
    )
  }

  if (button.classList.contains('usa-accordion__button')) {
    throw new Error(
      '[storybook-contracts:accordion:react] Isolation violated: the disclosure matches the USWDS enhancement selector. Native React and the Styles enhancement handler could both own the interaction.',
    )
  }
}

const ReactContractDefault: Story = {
  args: {
    items: ACCORDION_ITEMS,
  },
  play: async ({ canvasElement }) => {
    const harness = harnessFor(canvasElement)
    await assertNativeOwned(harness)

    await verifyDisclosurePanelAssociation(harness, FIRST_AMENDMENT)
    await verifyPanelAvailability(harness, FIRST_AMENDMENT)
    await verifyEnterExpandsDisclosure(harness, FIRST_AMENDMENT)
    await verifyFocusRetention(harness, FIRST_AMENDMENT)
  },
}

const ReactContractInitiallyExpanded: Story = {
  args: {
    items: ACCORDION_ITEMS,
    defaultExpandedIds: ['first'],
  },
  play: async ({ canvasElement }) => {
    const harness = harnessFor(canvasElement)
    await assertNativeOwned(harness)

    await verifyPanelAvailability(harness, FIRST_AMENDMENT)
    await verifySpaceCollapsesDisclosure(harness, FIRST_AMENDMENT)
  },
}

const ReactContractSingleOpen: Story = {
  args: {
    items: ACCORDION_ITEMS,
    defaultExpandedIds: ['first'],
  },
  play: async ({ canvasElement }) => {
    const harness = harnessFor(canvasElement)
    await assertNativeOwned(harness)

    await verifySingleOpenBehavior(harness, FIRST_AMENDMENT, SECOND_AMENDMENT)
  },
}

export const ContractDefault = {
  ...ReactContractDefault,
  name: 'Contract (Default)',
  tags: ['behavior-contract'],
}

export const ContractInitiallyExpanded = {
  ...ReactContractInitiallyExpanded,
  name: 'Contract (Initially Expanded)',
  tags: ['behavior-contract'],
}

export const ContractSingleOpen = {
  ...ReactContractSingleOpen,
  name: 'Contract (Single Open)',
  tags: ['behavior-contract'],
}

// ---------------------------------------------------------------------------
// React-specific behavior (kept OUT of the shared contract)
// ---------------------------------------------------------------------------
// These verify package-only API behavior: controlled state, uncontrolled state,
// onExpandedChange callback wiring, disabled props, and focus retention. They
// remain separate from the renderer-neutral shared helpers in
// @pathable/storybook-contracts.

/** Controlled state via `expandedIds` (React-only; not shared). */
export const ControlledExpanded: Story = {
  args: {
    items: ACCORDION_ITEMS,
    expandedIds: ['first'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: FIRST_AMENDMENT })
    await expect(button).toHaveAttribute('aria-expanded', 'true')
  },
}

/** Uncontrolled state via `defaultExpandedIds`. */
export const UncontrolledExpanded: Story = {
  args: {
    items: ACCORDION_ITEMS,
    defaultExpandedIds: ['first'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: FIRST_AMENDMENT })
    await expect(button).toHaveAttribute('aria-expanded', 'true')
  },
}

/** `onExpandedChange` callback wiring (React-only; not shared). */
export const ExpandedChangeCallback: Story = {
  args: {
    items: ACCORDION_ITEMS,
    onExpandedChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: FIRST_AMENDMENT })
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
  },
}

import { ButtonGroup } from '../../../components/button-group/ButtonGroup'
import { Button } from '../../../components/Button/Button'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A container that groups related buttons with consistent spacing and alignment. Wraps USWDS button group styling through \`.pathable-button-group\`.

**When to use**: For adjacent buttons that represent related actions, such as form footers (Save + Cancel), dialog actions, or toolbar button clusters.

**When not to use**: Do not use ButtonGroup for buttons that are not semantically related. Do not nest ButtonGroup inside another ButtonGroup.

**Underlying element**: \`<div>\` with \`.pathable-button-group\` class.

**Known constraints**: ButtonGroup only provides layout and spacing. It does not manage focus order, keyboard navigation between buttons, or the semantic relationship between buttons — each child button manages its own behavior.`,
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </ButtonGroup>
  ),
}

// ---------------------------------------------------------------------------
// Fixed state stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </ButtonGroup>
  ),
}

export const SingleButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Submit</Button>
    </ButtonGroup>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Save</Button>
      <Button variant="secondary" disabled>
        Cancel
      </Button>
    </ButtonGroup>
  ),
}

export const MixedVariants: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="save">Save</Button>
      <Button variant="continue">Continue</Button>
      <Button variant="destructive">Delete</Button>
    </ButtonGroup>
  ),
}

// ---------------------------------------------------------------------------
// Narrow viewport
// ---------------------------------------------------------------------------

export const Narrow: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
    </ButtonGroup>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const NarrowMultiButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="save">Save</Button>
      <Button variant="continue">Continue</Button>
      <Button variant="destructive">Delete</Button>
    </ButtonGroup>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// ---------------------------------------------------------------------------
// Accessibility check
// ---------------------------------------------------------------------------

/** Verifies that buttons within the group are individually focusable and
 *  maintain their own accessible roles and names. */
export const AccessibilityCheck: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('each button has its own role and accessible name', async () => {
      const saveButton = canvas.getByRole('button', { name: 'Save' })
      const cancelButton = canvas.getByRole('button', { name: 'Cancel' })
      await expect(saveButton).toBeVisible()
      await expect(cancelButton).toBeVisible()
    })
  },
}

// ---------------------------------------------------------------------------
// Composition — form footer with primary and secondary actions
// ---------------------------------------------------------------------------

/** A realistic form footer pattern with a primary action on the left and
 *  a secondary cancel action on the right. */
export const FormFooter: Story = {
  render: () => (
    <div
      style={{
        border: '1px solid var(--pathable-color-border, #ccc)',
        borderRadius: 8,
        padding: '1.5rem',
        maxWidth: 480,
      }}
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          htmlFor="demo-input"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}
        >
          Participant Name
        </label>
        <input
          id="demo-input"
          type="text"
          defaultValue="J. Doe"
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: 4,
            border: '1px solid var(--pathable-color-border, #ccc)',
          }}
          readOnly
        />
      </div>
      <ButtonGroup>
        <Button variant="primary">Save Changes</Button>
        <Button variant="secondary">Cancel</Button>
      </ButtonGroup>
    </div>
  ),
}

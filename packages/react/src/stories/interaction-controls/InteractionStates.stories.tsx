import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'

type StateCardProps = {
  readonly label: string
  readonly state: string
  readonly className?: string
  readonly disabled?: boolean
  readonly pressed?: boolean
  readonly busy?: boolean
}

function StateCard({
  label,
  state,
  className,
  disabled,
  pressed,
  busy,
}: StateCardProps) {
  const classes = [
    'pathable-interaction-states-demo',
    'pathable-text-left',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      aria-busy={busy || undefined}
      aria-pressed={pressed}
      disabled={disabled}
      style={{ minWidth: 200, fontFamily: 'inherit' }}
    >
      <span
        className="pathable-display-block pathable-text-semibold"
        style={{ fontSize: '0.875rem' }}
      >
        {label}
      </span>
      <span
        className="pathable-display-block pathable-margin-top-1"
        style={{ fontSize: '0.75rem', opacity: 0.7 }}
      >
        {state}
      </span>
    </button>
  )
}

function AllStatesDemo() {
  return (
    <section aria-labelledby="interaction-states-heading">
      <h3
        id="interaction-states-heading"
        className="pathable-margin-top-0 pathable-margin-bottom-1"
        style={{ fontSize: '1rem' }}
      >
        Interaction States
      </h3>
      <p
        className="pathable-text-base pathable-margin-top-0 pathable-margin-bottom-3"
        style={{
          color: 'var(--pathable-color-text-muted)',
          fontSize: '0.875rem',
        }}
      >
        Hover or focus the Rest example. Selected and disabled states are fixed
        fixtures.
      </p>
      <div
        className="pathable-cluster"
        role="group"
        aria-label="Interaction state examples"
        style={{ alignItems: 'stretch' }}
      >
        <StateCard label="Rest" state="Hover or focus me" />
        <StateCard
          label="Selected"
          state="Persistent selection"
          className="is-selected"
          pressed
        />
        <StateCard label="Disabled" state="Unavailable" disabled />
      </div>
    </section>
  )
}

function LoadingStateDemo() {
  return (
    <section aria-labelledby="loading-state-heading">
      <h3
        id="loading-state-heading"
        className="pathable-margin-top-0 pathable-margin-bottom-1"
        style={{ fontSize: '1rem' }}
      >
        Loading State
      </h3>
      <p
        className="pathable-text-base pathable-margin-top-0 pathable-margin-bottom-3"
        style={{
          color: 'var(--pathable-color-text-muted)',
          fontSize: '0.875rem',
        }}
      >
        The CSS class supplies the spinner and blocks pointer events. Native
        disabled semantics prevent keyboard activation, and aria-busy exposes
        the pending state.
      </p>
      <div className="pathable-cluster" style={{ alignItems: 'stretch' }}>
        <StateCard
          label="Loading"
          state="Saving preferences"
          className="is-loading"
          disabled
          busy
        />
      </div>
    </section>
  )
}

const meta = {
  title: 'Interaction Controls/Interaction States',
  component: AllStatesDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Documentation-only examples of the framework-neutral interaction-state SCSS mixins from \`@pathableai/styles\`.

**When to use**: Include the appropriate mixins in component SCSS to provide consistent hover, focus, active, selected, disabled, and loading feedback.

**React API**: This catalog entry does not define or export an InteractionStates component. The \`pathable-interaction-states-demo\` class exists only to document the compiled mixin behavior.

**Accessibility**: Pair visual state classes with semantics appropriate to the underlying control. Selected controls need a semantic state such as \`aria-pressed\` or \`aria-selected\`; unavailable buttons should use native \`disabled\`.

**Loading constraint**: \`.is-loading\` supplies visual feedback and blocks pointer events, but CSS alone does not prevent keyboard activation. Disable native controls or prevent activation in application logic, and expose the pending state with \`aria-busy\`.`,
      },
    },
  },
} satisfies Meta<typeof AllStatesDemo>

export default meta
type Story = StoryObj<typeof meta>

export const AllStates: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const rest = canvas.getByRole('button', {
      name: 'Rest Hover or focus me',
    })
    const selected = canvas.getByRole('button', {
      name: 'Selected Persistent selection',
    })
    const disabled = canvas.getByRole('button', {
      name: 'Disabled Unavailable',
    })

    await step('renders fixed semantic state fixtures', async () => {
      await expect(
        canvas.getByRole('group', { name: 'Interaction state examples' }),
      ).toBeVisible()
      await expect(rest).toHaveClass('pathable-interaction-states-demo')
      await expect(selected).toHaveClass(
        'pathable-interaction-states-demo',
        'is-selected',
      )
      await expect(selected).toHaveAttribute('aria-pressed', 'true')
      await expect(disabled).toBeDisabled()
    })

    await step('applies observable keyboard focus feedback', async () => {
      const restStyleBeforeFocus = window.getComputedStyle(rest)
      const boxShadowBeforeFocus = restStyleBeforeFocus.boxShadow
      const outlineStyleBeforeFocus = restStyleBeforeFocus.outlineStyle

      await userEvent.tab()
      await expect(rest).toHaveFocus()

      const restStyleAfterFocus = window.getComputedStyle(rest)
      const boxShadowAfterFocus = restStyleAfterFocus.boxShadow
      const outlineStyleAfterFocus = restStyleAfterFocus.outlineStyle

      await expect(
        boxShadowAfterFocus !== boxShadowBeforeFocus ||
          outlineStyleAfterFocus !== outlineStyleBeforeFocus,
      ).toBe(true)
    })

    await step('applies selected and disabled visual states', async () => {
      const restStyle = window.getComputedStyle(rest)
      const selectedStyle = window.getComputedStyle(selected)
      const disabledStyle = window.getComputedStyle(disabled)

      await expect(selected).toHaveClass('is-selected')
      await expect(selected).toHaveAttribute('aria-pressed', 'true')
      await expect(disabled).toBeDisabled()

      await expect(
        Number.parseInt(selectedStyle.fontWeight, 10),
      ).toBeGreaterThanOrEqual(Number.parseInt(restStyle.fontWeight, 10))
      await expect(
        Number.parseFloat(selectedStyle.borderWidth),
      ).toBeGreaterThanOrEqual(Number.parseFloat(restStyle.borderWidth))
      await expect(Number.parseFloat(disabledStyle.opacity)).toBeLessThan(
        Number.parseFloat(restStyle.opacity),
      )
    })
  },
}

export const LoadingState: Story = {
  render: () => <LoadingStateDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const loading = canvas.getByRole('button', {
      name: 'Loading Saving preferences',
    })
    const style = window.getComputedStyle(loading)
    const spinner = window.getComputedStyle(loading, '::after')

    await expect(loading).toHaveClass(
      'pathable-interaction-states-demo',
      'is-loading',
    )
    await expect(loading).toBeDisabled()
    await expect(loading).toHaveAttribute('aria-busy', 'true')
    await expect(style.pointerEvents).toBe('none')
    await expect(style.cursor).toBe('wait')
    await expect(style.position).toBe('relative')
    await expect(spinner.content).toBe('""')
    await expect(spinner.position).toBe('absolute')
  },
}

export const Default: Story = AllStates

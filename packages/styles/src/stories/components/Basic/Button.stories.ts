import { expect, within } from 'storybook/test'
import { contrastRatio, relativeLuminance } from '../../shared/contrast'
import { expectKeyboardFocusIndicator } from '../../shared/focus-indicator'

export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.',
      },
    },
  },
}

export const Default = {
  render: () => '<button class="pathable-button">Default Button</button>',
}

export const Primary = {
  render: () =>
    '<button class="pathable-button pathable-button--primary">Primary Button</button>',
}

export const AccentCool = {
  render: () =>
    '<button class="pathable-button pathable-button--accent-cool">Accent Cool</button>',
}

/**
 * The computed color a token resolves to, read from a temporary probe in the
 * story canvas so the assertion follows the active theme. Fails when the token
 * is undefined, so an equality check cannot pass by inheritance.
 */
const resolveColorToken = (canvasElement: HTMLElement, token: string) => {
  const tokenValue = getComputedStyle(canvasElement)
    .getPropertyValue(token)
    .trim()
  if (!tokenValue) throw new Error(`${token} is not defined`)
  const probe = canvasElement.ownerDocument.createElement('span')
  probe.style.color = `var(${token})`
  canvasElement.appendChild(probe)
  const { color } = getComputedStyle(probe)
  probe.remove()
  return color
}

export const AccentWarm = {
  parameters: {
    docs: {
      description: {
        story:
          'The accent-warm modifier fills the button with Lived-In Lime and sets its text in PathAble Blue, so it reads as a highlighted action beside the primary button.',
      },
    },
  },
  render: () => `
    <div class="pathable-cluster pathable-cluster--gap-sm">
      <button type="button" class="pathable-button pathable-button--primary">Save Coaching Note</button>
      <button type="button" class="pathable-button pathable-button--accent-warm">Share Progress</button>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const primary = getComputedStyle(
      canvas.getByRole('button', { name: 'Save Coaching Note' }),
    )
    const accentWarm = getComputedStyle(
      canvas.getByRole('button', { name: 'Share Progress' }),
    )

    await expect(accentWarm.backgroundColor).toBe(
      resolveColorToken(canvasElement, '--pathable-brand-lived-in-lime'),
    )
    await expect(accentWarm.color).toBe(
      resolveColorToken(canvasElement, '--pathable-brand-pathable-blue'),
    )
    await expect(accentWarm.backgroundColor).not.toBe(primary.backgroundColor)
    await expect(accentWarm.color).not.toBe(primary.color)
  },
}

export const Outline = {
  parameters: {
    docs: {
      description: {
        story:
          'The outline modifier keeps a transparent background, an inset border and text in the text color, so it reads as a lower-emphasis action beside the primary button.',
      },
    },
  },
  render: () => `
    <div class="pathable-cluster pathable-cluster--gap-sm">
      <button type="button" class="pathable-button pathable-button--primary">Save Coaching Note</button>
      <button type="button" class="pathable-button pathable-button--outline">Cancel</button>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const primary = getComputedStyle(
      canvas.getByRole('button', { name: 'Save Coaching Note' }),
    )
    const outline = getComputedStyle(
      canvas.getByRole('button', { name: 'Cancel' }),
    )

    await expect(outline.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(outline.backgroundColor).not.toBe(primary.backgroundColor)
    await expect(outline.boxShadow).toBe(
      `${outline.color} 0px 0px 0px 2px inset`,
    )
    await expect(outline.color).not.toBe(primary.color)
  },
}

export const OutlineInverse = {
  parameters: {
    docs: {
      description: {
        story:
          'The outline modifier combined with the inverse modifier, on a dark surface. Its resting background stays transparent, with a light inset border and text.',
      },
    },
  },
  render: () => `
    <div class="pathable-bg-primary pathable-padding-3">
      <button type="button" class="pathable-button pathable-button--outline pathable-button--inverse">Cancel</button>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Cancel' })
    const inverse = getComputedStyle(button)
    const surface = getComputedStyle(button.parentElement as HTMLElement)

    await expect(inverse.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(inverse.boxShadow).toBe(
      `${inverse.color} 0px 0px 0px 2px inset`,
    )
    // Light text and border on the dark surface: WCAG AA contrast for normal
    // text, which the regular outline's dark text cannot reach here.
    await expect(
      contrastRatio(inverse.color, surface.backgroundColor),
    ).toBeGreaterThanOrEqual(4.5)
  },
}

export const Inverse = {
  render: () =>
    '<button class="pathable-button pathable-button--inverse">Inverse</button>',
}

export const Base = {
  render: () =>
    '<button class="pathable-button pathable-button--base">Base</button>',
}

export const Secondary = {
  render: () =>
    '<button class="pathable-button pathable-button--secondary">Secondary</button>',
}

export const Big = {
  render: () =>
    '<button class="pathable-button pathable-button--big">Big Button</button>',
}

export const Unstyled = {
  parameters: {
    docs: {
      description: {
        story:
          'The unstyled modifier removes the button fill and padding and renders the label as underlined link text, beside the primary button. Disabled unstyled buttons, native and `aria-disabled`, keep the transparent background and the lighter disabled text, also under focus and hover.',
      },
    },
  },
  render: () => `
    <div class="pathable-cluster pathable-cluster--gap-sm">
      <button type="button" class="pathable-button pathable-button--primary">Save Coaching Note</button>
      <button type="button" class="pathable-button pathable-button--unstyled">View Coaching History</button>
      <button type="button" class="pathable-button pathable-button--unstyled" disabled>Export Coaching Notes</button>
      <button type="button" class="pathable-button pathable-button--unstyled" aria-disabled="true">Share Coaching Notes</button>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const primary = getComputedStyle(
      canvas.getByRole('button', { name: 'Save Coaching Note' }),
    )
    const unstyled = getComputedStyle(
      canvas.getByRole('button', { name: 'View Coaching History' }),
    )
    const disabled = getComputedStyle(
      canvas.getByRole('button', { name: 'Export Coaching Notes' }),
    )
    const ariaDisabledButton = canvas.getByRole('button', {
      name: 'Share Coaching Notes',
    })
    const ariaDisabled = getComputedStyle(ariaDisabledButton)

    await expect(unstyled.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(unstyled.backgroundColor).not.toBe(primary.backgroundColor)
    await expect(unstyled.color).toBe(
      resolveColorToken(canvasElement, '--pathable-color-link'),
    )
    await expect(unstyled.color).not.toBe(primary.color)
    await expect(unstyled.textDecorationLine).toBe('underline')
    await expect(unstyled.paddingLeft).toBe('0px')

    // Disabled text is lighter than the link text; the filled button's
    // disabled text, which the cascade could fall back to, is darker.
    await expect(disabled.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(relativeLuminance(disabled.color)).toBeGreaterThan(
      relativeLuminance(unstyled.color),
    )
    await expect(disabled.textDecorationLine).toBe('underline')

    // An aria-disabled button stays focusable. Focused, it keeps the
    // transparent background and disabled text instead of the filled
    // disabled button style.
    const ariaDisabledRestColor = ariaDisabled.color
    await expect(ariaDisabledRestColor).toBe(disabled.color)
    ariaDisabledButton.focus()
    await expect(ariaDisabledButton).toHaveFocus()
    await expect(ariaDisabled.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(ariaDisabled.color).toBe(ariaDisabledRestColor)
    ariaDisabledButton.blur()
  },
}

export const UnstyledInverse = {
  parameters: {
    docs: {
      description: {
        story:
          'The unstyled modifier with the outline and inverse modifiers, the USWDS combination for link-styled buttons on a dark surface. The background stays transparent and the light link text keeps its contrast.',
      },
    },
  },
  render: () => `
    <div class="pathable-bg-primary pathable-padding-3">
      <button type="button" class="pathable-button pathable-button--outline pathable-button--inverse pathable-button--unstyled">View Coaching History</button>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: 'View Coaching History',
    })
    const inverse = getComputedStyle(button)
    const surface = getComputedStyle(button.parentElement as HTMLElement)

    await expect(inverse.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(inverse.boxShadow).toBe('none')
    await expect(inverse.textDecorationLine).toBe('underline')
    await expect(
      contrastRatio(inverse.color, surface.backgroundColor),
    ).toBeGreaterThanOrEqual(4.5)
  },
}

const focusIndicatorMarkup = `
    <div class="pathable-stack pathable-stack--gap-sm">
      <div class="pathable-cluster pathable-cluster--gap-sm">
        <button type="button" class="pathable-button">Save Coaching Note</button>
        <button type="button" class="pathable-button pathable-button--primary">Submit Plan</button>
        <button type="button" class="pathable-button pathable-button--continue">Continue to Goals</button>
        <button type="button" class="pathable-button pathable-button--destructive">Remove Activity</button>
        <button type="button" class="pathable-button pathable-button--secondary">Add Support Activity</button>
        <button type="button" class="pathable-button pathable-button--save">Save Draft</button>
        <button type="button" class="pathable-button pathable-button--accent-cool">View Details</button>
        <button type="button" class="pathable-button pathable-button--review">Review Plan</button>
        <button type="button" class="pathable-button pathable-button--accent-warm">Share Progress</button>
        <button type="button" class="pathable-button pathable-button--base">Skip Step</button>
        <button type="button" class="pathable-button pathable-button--low-emphasis">Dismiss Reminder</button>
        <button type="button" class="pathable-button pathable-button--outline">Cancel</button>
        <button type="button" class="pathable-button pathable-button--big">Start Session</button>
      </div>
      <div class="pathable-cluster pathable-cluster--gap-sm pathable-bg-primary pathable-padding-3">
        <button type="button" class="pathable-button pathable-button--inverse">Open Resources</button>
        <button type="button" class="pathable-button pathable-button--outline pathable-button--inverse">Close Resources</button>
      </div>
      <div class="pathable-cluster pathable-cluster--gap-sm">
        <button type="button" class="pathable-button--destructive">Delete Draft</button>
        <button type="button" class="pathable-button pathable-button--unstyled">View Coaching History</button>
      </div>
    </div>
  `

/** Every filled variant shows the 2px focus-ring token outline. */
const filledButtonNames = [
  'Save Coaching Note',
  'Submit Plan',
  'Continue to Goals',
  'Remove Activity',
  'Add Support Activity',
  'Save Draft',
  'View Details',
  'Review Plan',
  'Share Progress',
  'Skip Step',
  'Dismiss Reminder',
  'Cancel',
  'Start Session',
  'Open Resources',
  'Close Resources',
  // --destructive renders a whole button without .pathable-button.
  'Delete Draft',
]

// Tabs through every button in order. Filled variants show the shared 2px
// focus-ring outline; the unstyled modifier keeps the USWDS 4px Bright Blue
// Brooks ring. Under forced colors the helper expects `Highlight` instead.
const expectButtonFocusIndicators = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement
}) => {
  const canvas = within(canvasElement)
  for (const [index, name] of filledButtonNames.entries()) {
    await expectKeyboardFocusIndicator(
      canvasElement,
      canvas.getByRole('button', { name }),
      { width: 2, fromCurrentFocus: index > 0 },
    )
  }
  await expectKeyboardFocusIndicator(
    canvasElement,
    canvas.getByRole('button', { name: 'View Coaching History' }),
    {
      width: 4,
      color: 'var(--pathable-brand-bright-blue-brooks)',
      fromCurrentFocus: true,
    },
  )
}

export const KeyboardFocus = {
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard focus on `.pathable-button` and every filled modifier shows the brand focus outline: 2px of `--pathable-color-focus-ring` (Bright Blue Brooks). The unstyled modifier keeps the USWDS 4px Bright Blue Brooks ring. The play function tabs through every button and checks its outline.',
      },
    },
  },
  render: () => focusIndicatorMarkup,
  play: expectButtonFocusIndicators,
}

export const ForcedColors = {
  parameters: {
    docs: {
      description: {
        story:
          'Run with forced-colors emulation (the test-runner turns it on for this story). Keyboard focus on every button keeps a visible solid outline in the system `Highlight` colour. The play function tabs through every button and checks its outline.',
      },
    },
  },
  render: () => focusIndicatorMarkup,
  play: expectButtonFocusIndicators,
}

// Workflow-specific button stories
export const WorkflowPrimaryCTA = {
  render: () => '<button class="pathable-button">Save Coaching Note</button>',
}

export const WorkflowSecondaryAction = {
  render: () =>
    '<button class="pathable-button pathable-button--secondary">Add Support Activity</button>',
}

export const WorkflowTertiaryAction = {
  render: () =>
    '<button class="pathable-button pathable-button--accent-cool">View Details</button>',
}

export const WorkflowSave = {
  render: () =>
    '<button class="pathable-button pathable-button--save">Save Coaching Note</button>',
}

export const WorkflowContinue = {
  render: () =>
    '<button class="pathable-button pathable-button--continue">Continue to Review</button>',
}

export const WorkflowReview = {
  render: () =>
    '<button class="pathable-button pathable-button--review">Review Compliance</button>',
}

export const WorkflowDestructive = {
  render: () =>
    '<button class="pathable-button pathable-button--destructive">Delete Activity</button>',
}

export const WorkflowLowEmphasis = {
  render: () =>
    '<button class="pathable-button pathable-button--low-emphasis">Cancel</button>',
}

import { expect, within } from 'storybook/test'

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

export const AccentWarm = {
  render: () =>
    '<button class="pathable-button pathable-button--accent-warm">Accent Warm</button>',
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
  render: () =>
    '<button class="pathable-button pathable-button--unstyled">Unstyled</button>',
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

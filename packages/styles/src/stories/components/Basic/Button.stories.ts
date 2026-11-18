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

/**
 * Resolves a CSS custom property to the browser's computed `rgb()` color, so a
 * play function can compare a computed style with a token without restating
 * its hex value.
 */
const resolveColor = (canvasElement: HTMLElement, token: string) => {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  canvasElement.append(probe)
  const { color } = getComputedStyle(probe)
  probe.remove()
  return color
}

export const AccentWarm = {
  parameters: {
    docs: {
      description: {
        story:
          'The accent-warm modifier fills the button with Lived-In Lime and sets its text in the text color, so it reads as a highlighted action beside the primary button.',
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
      resolveColor(canvasElement, '--pathable-brand-lived-in-lime'),
    )
    await expect(accentWarm.color).toBe(
      resolveColor(canvasElement, '--pathable-color-text'),
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

/** WCAG relative luminance of a computed `rgb()`/`rgba()` color. */
const luminance = (color: string) => {
  const [r, g, b] = (color.match(/\d+(\.\d+)?/g) ?? [])
    .slice(0, 3)
    .map((value) => {
      const channel = Number(value) / 255
      return channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4
    })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two computed colors. */
const contrastRatio = (a: string, b: string) => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
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

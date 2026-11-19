import { expect, within } from 'storybook/test'

import { contrastRatio, findOpaqueBackground } from '../shared/contrast'
import { expectKeyboardFocusIndicator } from '../shared/focus-indicator'

export default {
  title: 'Layout Composition/Surface',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (with CSS-driven interactive states)\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.\n\nSemantic visual container styles that convey depth through token-driven backgrounds, borders, border-radius, and elevation.',
      },
    },
  },
}

const demoBlock = (variant, label) => `
  <div class="pathable-surface ${variant}" style="padding: 1.5rem; min-width: 120px;">
    <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">${label}</div>
    <div style="font-size: 0.75rem; opacity: 0.7;">${variant.replace('pathable-surface--', '.')}</div>
  </div>
`

export const AllVariants = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">All Surface Variants</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Each surface establishes a different visual depth level. Resize to see how they compare side by side or stacked.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: stretch;">
      ${demoBlock('pathable-surface--base', 'Base')}
      ${demoBlock('pathable-surface--raised', 'Raised')}
      ${demoBlock('pathable-surface--inset', 'Inset')}
      ${demoBlock('pathable-surface--interactive', 'Interactive')}
      ${demoBlock('pathable-surface--brand', 'Brand')}
      ${demoBlock('pathable-surface--inverse', 'Inverse')}
    </div>
  `,
}

export const InteractiveStates = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Interactive Surface States</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Focus-visible ring (indicated by outline). Hover elevates the shadow.
      Tab to the interactive element to see the focus state.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      <div class="pathable-surface pathable-surface--interactive" tabindex="0" style="padding: 1.5rem; max-width: 200px;">
        <div style="font-size: 0.875rem; font-weight: 600;">Rest</div>
        <div style="font-size: 0.75rem; margin-top: 0.25rem;">Tab to focus me</div>
      </div>
      <div class="pathable-surface pathable-surface--interactive" aria-disabled="true" style="padding: 1.5rem; max-width: 200px; opacity: 0.5; cursor: default;">
        <div style="font-size: 0.875rem; font-weight: 600;">Disabled</div>
        <div style="font-size: 0.75rem; margin-top: 0.25rem;">aria-disabled</div>
      </div>
    </div>
  `,
}

export const NestedSurfaces = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Nested Surfaces</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Surfaces maintain visual distinguishability when nested. Raised inside inset, and vice versa.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      <div class="pathable-surface pathable-surface--inset" style="padding: 1.5rem;">
        <span style="font-size: 0.8rem; display: block; margin-bottom: 0.75rem;">Inset (outer)</span>
        <div class="pathable-surface pathable-surface--raised" style="padding: 1rem;">
          <span style="font-size: 0.8rem;">Raised (inner)</span>
        </div>
      </div>
      <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
        <span style="font-size: 0.8rem; display: block; margin-bottom: 0.75rem;">Raised (outer)</span>
        <div class="pathable-surface pathable-surface--inset" style="padding: 1rem;">
          <span style="font-size: 0.8rem;">Inset (inner)</span>
        </div>
      </div>
    </div>
  `,
}

// Each surface with a background of its own sets the focus ring that the
// shared state-focus mixin draws around controls on it. Bright Blue Brooks
// would be 1.1:1 on Intelligent Jade and 2.3:1 on Shilling Silver, so those
// surfaces use the text colour instead.
const focusSurfaces = [
  {
    variant: 'pathable-surface--raised',
    label: 'Raised',
    ring: '--pathable-color-focus-ring',
  },
  {
    variant: 'pathable-surface--inset',
    label: 'Inset',
    ring: '--pathable-color-text',
  },
  {
    variant: 'pathable-surface--brand',
    label: 'Brand',
    ring: '--pathable-color-text',
  },
  {
    variant: 'pathable-surface--inverse',
    label: 'Inverse',
    ring: '--pathable-color-focus-ring',
    buttonClass: 'pathable-button pathable-button--inverse',
  },
  {
    variant: 'pathable-surface--tone-default',
    label: 'Tone default',
    ring: '--pathable-color-focus-ring',
  },
  {
    variant: 'pathable-surface--tone-subtle',
    label: 'Tone subtle',
    ring: '--pathable-color-text',
  },
  {
    variant: 'pathable-surface--tone-primary',
    label: 'Tone primary',
    ring: '--pathable-color-text',
  },
]

const focusSurfaceBlock = ({
  variant,
  label,
  buttonClass = 'pathable-button',
}: (typeof focusSurfaces)[number]) => {
  const id = `focus-${label.toLowerCase().replaceAll(' ', '-')}`
  return `
    <div class="pathable-surface ${variant} pathable-stack pathable-stack--gap-sm" style="padding: 1.5rem; flex: 1 1 14rem; min-width: 0;">
      <div style="font-size: 0.875rem; font-weight: 600;">${label}</div>
      <button type="button" class="${buttonClass}">Save on ${label}</button>
      <label class="pathable-label" for="${id}">Note on ${label}</label>
      <input id="${id}" class="pathable-input" type="text" />
    </div>
  `
}

export const KeyboardFocusOnSurfaces = {
  parameters: {
    docs: {
      description: {
        story:
          'A `.pathable-button` and a `.pathable-input` on each surface variant, and on a raised surface nested in a brand one. The focus outline is drawn on the surface behind the control, so each surface sets `--pathable-surface-focus-ring` for the shared `state-focus` ring: `--pathable-color-focus-ring` (Bright Blue Brooks) on white and PathAble Blue, and `--pathable-color-text` on Intelligent Jade and Shilling Silver. The play function tabs to every control and checks the outline colour and its contrast of at least 3:1 with the surface.',
      },
    },
  },
  render: () => `
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: stretch;">
      ${focusSurfaces.map(focusSurfaceBlock).join('')}
      <div class="pathable-surface pathable-surface--brand" style="padding: 1.5rem; flex: 1 1 14rem; min-width: 0;">
        <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem;">Brand (outer)</div>
        ${focusSurfaceBlock({
          variant: 'pathable-surface--raised',
          label: 'Raised in brand',
          ring: '--pathable-color-focus-ring',
        })}
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('Surface story window is unavailable')

    const cases = [
      ...focusSurfaces,
      { label: 'Raised in brand', ring: '--pathable-color-focus-ring' },
    ].flatMap(({ label, ring }) => [
      {
        control: canvas.getByRole('button', { name: `Save on ${label}` }),
        ring,
      },
      {
        control: canvas.getByRole('textbox', { name: `Note on ${label}` }),
        ring,
      },
    ])

    for (const [index, { control, ring }] of cases.entries()) {
      await expectKeyboardFocusIndicator(canvasElement, control, {
        width: 2,
        color: `var(${ring})`,
        fromCurrentFocus: index > 0,
      })

      const surface = control.parentElement
      if (!surface) throw new Error('Focus story control has no parent')
      await expect(
        contrastRatio(
          view.getComputedStyle(control).outlineColor,
          findOpaqueBackground(surface, view),
        ),
      ).toBeGreaterThanOrEqual(3)
    }
  },
}

export const Default = AllVariants

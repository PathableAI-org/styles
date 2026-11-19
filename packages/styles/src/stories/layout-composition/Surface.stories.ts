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

// Each surface with a background of its own decides the focus ring that the
// shared state-focus mixin draws around controls on it. Bright Blue Brooks
// would be 1.1:1 on Intelligent Jade and 2.3:1 on Shilling Silver, so those
// surfaces use the on-accent and text colours instead.
const closeIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
  </svg>
`

type FocusCase = {
  label: string
  ring: string
  dark?: boolean
}

const focusControls = ({ label, dark = false }: FocusCase) => {
  const id = `focus-${label.toLowerCase().replaceAll(' ', '-')}`
  const button = dark
    ? 'pathable-button pathable-button--inverse'
    : 'pathable-button'
  const iconButton = dark
    ? 'pathable-icon-button--inverse'
    : 'pathable-icon-button--bare'
  return `
      <div style="font-size: 0.875rem; font-weight: 600;">${label}</div>
      <button type="button" class="${button}">Save on ${label}</button>
      <button type="button" class="pathable-icon-button ${iconButton}" aria-label="Close on ${label}">${closeIcon}</button>
      <label class="pathable-label" for="${id}">Note on ${label}</label>
      <input id="${id}" class="pathable-input" type="text" />
  `
}

const blockStyle = 'padding: 1.5rem; flex: 1 1 14rem; min-width: 0;'

const focusSurfaces: (FocusCase & { variant: string })[] = [
  { variant: 'raised', label: 'Raised', ring: '--pathable-color-focus-ring' },
  { variant: 'inset', label: 'Inset', ring: '--pathable-color-text' },
  { variant: 'brand', label: 'Brand', ring: '--pathable-color-on-accent' },
  {
    variant: 'inverse',
    label: 'Inverse',
    ring: '--pathable-color-focus-ring',
    dark: true,
  },
  {
    variant: 'tone-default',
    label: 'Tone default',
    ring: '--pathable-color-focus-ring',
  },
  {
    variant: 'tone-subtle',
    label: 'Tone subtle',
    ring: '--pathable-color-text',
  },
  {
    variant: 'tone-primary',
    label: 'Tone primary',
    ring: '--pathable-color-on-accent',
  },
]

// Nested cases: the nearest background decides the ring.
const raisedInBrand: FocusCase = {
  label: 'Raised in brand',
  ring: '--pathable-color-focus-ring',
}
const tonePrimaryInInverse: FocusCase = {
  label: 'Tone primary in inverse',
  ring: '--pathable-color-on-accent',
}
const darkInSubtle: FocusCase = {
  label: 'Dark in subtle',
  ring: '--pathable-color-focus-ring',
  dark: true,
}

const focusCases = [
  ...focusSurfaces,
  raisedInBrand,
  tonePrimaryInInverse,
  darkInSubtle,
]

export const KeyboardFocusOnSurfaces = {
  parameters: {
    docs: {
      description: {
        story:
          'A `.pathable-button`, a `.pathable-icon-button` and a `.pathable-input` on each surface variant, and in three nested cases: a raised surface in a brand one, a tone-primary surface in an inverse one, and a `pathable-bg-primary` container in a tone-subtle surface. The focus outline is drawn on the background behind the control, so each surface sets `--pathable-surface-focus-ring` for the shared `state-focus` ring: `--pathable-color-on-accent` on Intelligent Jade, `--pathable-color-text` on Shilling Silver, and `--pathable-color-focus-ring` (Bright Blue Brooks) on white and PathAble Blue. The play function tabs to every control and checks the outline colour and its contrast of at least 3:1 with the background.',
      },
    },
  },
  render: () => `
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: stretch;">
      ${focusSurfaces
        .map(
          (focusCase) => `
        <div class="pathable-surface pathable-surface--${focusCase.variant} pathable-stack pathable-stack--gap-sm" style="${blockStyle}">
          ${focusControls(focusCase)}
        </div>`,
        )
        .join('')}
      <div class="pathable-surface pathable-surface--brand" style="${blockStyle}">
        <div class="pathable-surface pathable-surface--raised pathable-stack pathable-stack--gap-sm" style="padding: 1rem;">
          ${focusControls(raisedInBrand)}
        </div>
      </div>
      <div class="pathable-surface pathable-surface--inverse" style="${blockStyle}">
        <div class="pathable-surface pathable-surface--tone-primary pathable-stack pathable-stack--gap-sm" style="padding: 1rem;">
          ${focusControls(tonePrimaryInInverse)}
        </div>
      </div>
      <div class="pathable-surface pathable-surface--tone-subtle" style="${blockStyle}">
        <div class="pathable-bg-primary pathable-text-white pathable-stack pathable-stack--gap-sm" style="padding: 1rem;">
          ${focusControls(darkInSubtle)}
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('Surface story window is unavailable')

    const controls = focusCases.flatMap(({ label, ring }) => [
      {
        control: canvas.getByRole('button', { name: `Save on ${label}` }),
        ring,
      },
      {
        control: canvas.getByRole('button', { name: `Close on ${label}` }),
        ring,
      },
      {
        control: canvas.getByRole('textbox', { name: `Note on ${label}` }),
        ring,
      },
    ])

    for (const [index, { control, ring }] of controls.entries()) {
      await expectKeyboardFocusIndicator(canvasElement, control, {
        width: 2,
        color: `var(${ring})`,
        fromCurrentFocus: index > 0,
      })

      const container = control.parentElement
      if (!container) throw new Error('Focus story control has no parent')
      await expect(
        contrastRatio(
          view.getComputedStyle(control).outlineColor,
          findOpaqueBackground(container, view),
        ),
      ).toBeGreaterThanOrEqual(3)
    }
  },
}

export const Default = AllVariants

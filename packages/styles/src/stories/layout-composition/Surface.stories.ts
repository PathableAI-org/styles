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
  /** Issue tracking a background where the ring is known to be under 3:1. */
  lowContrastIssue?: string
  /** Extra classes on the button and icon button themselves. */
  controlClass?: string
}

// Top-level surfaces also get a select and a textarea; nested cases test which
// container decides the ring, the same for every state-focus control.
const focusControls = (
  { label, dark = false, controlClass = '' }: FocusCase,
  { withFields = false } = {},
) => {
  const id = `focus-${label.toLowerCase().replaceAll(' ', '-')}`
  // The outline modifier keeps the button's edge visible on a dark panel.
  const button = dark
    ? 'pathable-button pathable-button--outline pathable-button--inverse'
    : 'pathable-button'
  const iconButton = dark
    ? 'pathable-icon-button--inverse'
    : 'pathable-icon-button--bare'
  return `
      <div style="font-size: 0.875rem; font-weight: 600;">${label}</div>
      <button type="button" class="${button} ${controlClass}">Save on ${label}</button>
      <button type="button" class="pathable-icon-button ${iconButton} ${controlClass}" aria-label="Close on ${label}">${closeIcon}</button>
      <label class="pathable-label" for="${id}">Note on ${label}</label>
      <input id="${id}" class="pathable-input" type="text" />
      ${
        withFields
          ? `
      <label class="pathable-label" for="${id}-goal">Goal on ${label}</label>
      <select id="${id}-goal" class="pathable-select">
        <option>Find a job coach</option>
        <option>Request an accommodation</option>
      </select>
      <label class="pathable-label" for="${id}-details">Details on ${label}</label>
      <textarea id="${id}-details" class="pathable-textarea" rows="2"></textarea>`
          : ''
      }
  `
}

const blockStyle = 'flex: 1 1 14rem; min-width: 0;'

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

// Nested cases: the nearest background decides the ring. Each container that
// sets or resets --pathable-surface-focus-ring sits inside a surface that sets
// a different one, so removing its declaration changes the ring.
const nestedCases: (FocusCase & { outer: string; inner: string })[] = [
  {
    label: 'Raised in brand',
    outer: 'pathable-surface pathable-surface--brand',
    inner: 'pathable-surface pathable-surface--raised',
    ring: '--pathable-color-focus-ring',
  },
  {
    label: 'Interactive in subtle',
    outer: 'pathable-surface pathable-surface--tone-subtle',
    inner: 'pathable-surface pathable-surface--interactive',
    ring: '--pathable-color-focus-ring',
  },
  {
    label: 'Tone default in brand',
    outer: 'pathable-surface pathable-surface--brand',
    inner: 'pathable-surface pathable-surface--tone-default',
    ring: '--pathable-color-focus-ring',
  },
  {
    label: 'Base in brand',
    outer: 'pathable-surface pathable-surface--brand',
    inner: 'pathable-surface pathable-surface--base',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Tone primary in inverse',
    outer: 'pathable-surface pathable-surface--inverse',
    inner: 'pathable-surface pathable-surface--tone-primary',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Inverse in inset',
    outer: 'pathable-surface pathable-surface--inset',
    inner: 'pathable-surface pathable-surface--inverse',
    ring: '--pathable-color-focus-ring',
    dark: true,
  },
  {
    label: 'Primary background in subtle',
    outer: 'pathable-surface pathable-surface--tone-subtle',
    inner: 'pathable-bg-primary pathable-text-white',
    ring: '--pathable-color-focus-ring',
    dark: true,
  },
  {
    label: 'Link background in subtle',
    outer: 'pathable-surface pathable-surface--tone-subtle',
    inner: 'pathable-bg-link pathable-text-white',
    ring: '--pathable-color-focus-ring',
    dark: true,
    lowContrastIssue: '#382',
  },
  {
    label: 'Dark section in inset',
    outer: 'pathable-surface pathable-surface--inset',
    inner: 'pathable-section pathable-section--dark',
    ring: '--pathable-color-focus-ring',
    dark: true,
  },
  {
    label: 'Dark background in subtle',
    outer: 'pathable-surface pathable-surface--tone-subtle',
    inner: 'pathable-dark-background pathable-text-white',
    ring: '--pathable-color-focus-ring',
    dark: true,
  },
  {
    label: 'Hero callout in primary',
    outer: 'pathable-surface pathable-surface--tone-primary',
    inner: 'pathable-hero__callout pathable-text-white',
    ring: '--pathable-color-focus-ring',
    dark: true,
  },
  {
    label: 'Identifier in inset',
    outer: 'pathable-surface pathable-surface--inset',
    inner: 'pathable-identifier',
    ring: '--pathable-color-focus-ring',
    dark: true,
  },
]

// The dark background utilities reset the ring on containers only. On the
// controls themselves the ring stays the surface's. The hover: variants use
// the same exclusion, but a play function cannot put an element in CSS
// :hover, so they are not asserted here.
const utilitiesOnControls: FocusCase & { outer: string; inner: string } = {
  label: 'Utilities on controls in brand',
  outer: 'pathable-surface pathable-surface--brand',
  inner: 'pathable-surface pathable-surface--base',
  ring: '--pathable-color-on-accent',
  controlClass: 'pathable-bg-primary',
}
nestedCases.push(utilitiesOnControls)

const focusCases = [...focusSurfaces, ...nestedCases]

export const KeyboardFocusOnSurfaces = {
  parameters: {
    docs: {
      description: {
        story:
          "A `.pathable-button`, a `.pathable-icon-button`, a `.pathable-input`, a `.pathable-select` and a `.pathable-textarea` on each surface variant with a background of its own, and a button, icon button and input in thirteen nested cases. Twelve put a surface, a dark utility or a dark component container inside a surface that sets a different ring, and one puts the dark utility on the controls themselves, which keep the surface's ring; `--base` is transparent and inherits its parent's. The focus outline is drawn on the background behind the control, so each of these sets `--pathable-surface-focus-ring` for the shared `state-focus` ring: `--pathable-color-on-accent` on Intelligent Jade, `--pathable-color-text` on Shilling Silver, and `--pathable-color-focus-ring` (Bright Blue Brooks) on white and on the dark containers. The play function tabs to every control and checks the outline colour and its contrast of at least 3:1 with the background, except on Tech Teal (`pathable-bg-link`), where Bright Blue Brooks is 2.6:1 (#382). In the interactive case the inner `.pathable-surface--interactive` also draws its own `:focus-within` outline in Bright Blue Brooks on the Silver around it, at 2.3:1; #362 tracks that component-owned outline.",
      },
    },
  },
  render: () => `
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: stretch;">
      ${focusSurfaces
        .map(
          (focusCase) => `
        <div class="pathable-surface pathable-surface--${focusCase.variant} pathable-stack pathable-stack--gap-sm pathable-padding-3" style="${blockStyle}">
          ${focusControls(focusCase, { withFields: true })}
        </div>`,
        )
        .join('')}
      ${nestedCases
        .map(
          (focusCase) => `
        <div class="${focusCase.outer} pathable-padding-3" style="${blockStyle}">
          <div class="${focusCase.inner} pathable-stack pathable-stack--gap-sm pathable-padding-2">
            ${focusControls(focusCase)}
          </div>
        </div>`,
        )
        .join('')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('Surface story window is unavailable')

    const baseControls = ({ label, ring, lowContrastIssue }: FocusCase) => [
      {
        control: canvas.getByRole('button', { name: `Save on ${label}` }),
        ring,
        lowContrastIssue,
      },
      {
        control: canvas.getByRole('button', { name: `Close on ${label}` }),
        ring,
        lowContrastIssue,
      },
      {
        control: canvas.getByRole('textbox', { name: `Note on ${label}` }),
        ring,
        lowContrastIssue,
      },
    ]
    const fieldControls = ({ label, ring }: FocusCase) => [
      {
        control: canvas.getByRole('combobox', { name: `Goal on ${label}` }),
        ring,
      },
      {
        control: canvas.getByRole('textbox', { name: `Details on ${label}` }),
        ring,
      },
    ]
    const controls = focusCases.flatMap((focusCase) => [
      ...baseControls(focusCase),
      ...('variant' in focusCase ? fieldControls(focusCase) : []),
    ])

    for (const [
      index,
      { control, ring, lowContrastIssue },
    ] of controls.entries()) {
      await expectKeyboardFocusIndicator(canvasElement, control, {
        width: 2,
        color: `var(${ring})`,
        fromCurrentFocus: index > 0,
      })

      // A known gap is tracked in its issue instead of asserted here.
      if (lowContrastIssue) continue

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

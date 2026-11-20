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
  /** Extra classes on the button and icon button themselves. */
  controlClass?: string
  /** Inline style on the nested container, for text colour on Jade. */
  innerStyle?: string
  /** Wrap the controls in a .pathable-alert__body, as real alert markup does. */
  alertBody?: boolean
  /** Inline style on the .pathable-alert__body, for its text colour. */
  bodyStyle?: string
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
        <option>Coach</option>
        <option>Support</option>
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
    ring: '--pathable-color-surface',
    dark: true,
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

// Tabs to the base controls of each case, and to the select and textarea of the
// top-level surfaces, and checks the outline colour and its 3:1 contrast with
// the background behind the control.
const expectFocusRings = async (
  canvasElement: HTMLElement,
  cases: (FocusCase & { variant?: string })[],
) => {
  const canvas = within(canvasElement)
  const view = canvasElement.ownerDocument.defaultView

  if (!view) throw new Error('Surface story window is unavailable')

  const baseControls = ({ label, ring }: FocusCase) => [
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
  const controls = cases.flatMap((focusCase) => [
    ...baseControls(focusCase),
    ...('variant' in focusCase ? fieldControls(focusCase) : []),
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
}

const focusCases = [...focusSurfaces, ...nestedCases]

// Components that draw their own outline, and links and unstyled buttons that
// keep the USWDS one, are drawn on the background behind them too. Each one
// reads the same --pathable-surface-focus-ring, so it needs the same ring on
// Jade, Silver, danger red and the emergency alert (3:1, WCAG 1.4.11).
const componentRingCases = [
  {
    label: 'Inset',
    text: '--pathable-color-text',
    outer: 'pathable-surface pathable-surface--inset',
    ring: '--pathable-color-text',
  },
  {
    label: 'Brand',
    text: '--pathable-color-on-accent',
    outer: 'pathable-surface pathable-surface--brand',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Accent utility',
    text: '--pathable-color-on-accent',
    outer: 'pathable-bg-accent',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Success utility',
    text: '--pathable-color-on-accent',
    outer: 'pathable-bg-success',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Base utility',
    text: '--pathable-color-text',
    outer: 'pathable-bg-base',
    ring: '--pathable-color-text',
  },
  {
    label: 'Danger utility',
    text: '--pathable-color-status-danger-text',
    outer: 'pathable-bg-danger',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Success alert',
    text: '--pathable-color-on-accent',
    outer: 'pathable-alert pathable-alert--success',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Warning alert',
    text: '--pathable-color-on-accent',
    outer: 'pathable-alert pathable-alert--warning',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Error alert',
    text: '--pathable-color-status-danger-text',
    outer: 'pathable-alert pathable-alert--error',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Emergency alert',
    text: '--pathable-color-status-danger-text',
    outer: 'pathable-alert pathable-alert--emergency',
    ring: '--pathable-color-status-danger-text',
  },
]

export const ComponentFocusOnBackgrounds = {
  parameters: {
    docs: {
      description: {
        story:
          'A focusable `.pathable-surface--interactive`, a `.pathable-link`, a `.pathable-button--unstyled` and a `.pathable-filter-pill__dismiss` on each background where Bright Blue Brooks is under 3:1: Shilling Silver (`--inset`, `pathable-bg-base`), Intelligent Jade (`--brand`, `pathable-bg-accent`, `pathable-bg-success`), the danger red and the success, warning, error and emergency alerts. Each outline is drawn on the background behind it, so it takes `--pathable-surface-focus-ring` (#362). The play function tabs to every one and checks the outline colour and its contrast of at least 3:1 with the background.',
      },
    },
  },
  render: () => `
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: stretch;">
      ${componentRingCases
        .map(
          ({ label, outer, text }) => `
        <div class="${outer} pathable-stack pathable-stack--gap-sm pathable-padding-3" style="${blockStyle} margin: 0; color: var(${text});">
          <div style="font-size: 0.875rem; font-weight: 600;">${label}</div>
          <div class="pathable-surface pathable-surface--interactive pathable-padding-2" tabindex="0" style="color: var(--pathable-color-text);" aria-label="Card on ${label}">Card</div>
          <a class="pathable-link" style="color: inherit;" href="#focus-${label.replaceAll(' ', '-')}">Link on ${label}</a>
          <button type="button" class="pathable-button pathable-button--unstyled" style="color: inherit; align-self: flex-start;">Unstyled on ${label}</button>
          <span class="pathable-filter-pill" style="border: 1px solid var(--pathable-color-text);">
            <span class="pathable-filter-pill__label">Pill</span>
            <button type="button" class="pathable-filter-pill__dismiss" aria-label="Remove pill on ${label}">&times;</button>
          </span>
        </div>`,
        )
        .join('')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const view = canvasElement.ownerDocument.defaultView

    if (!view) throw new Error('Surface story window is unavailable')

    let first = true
    for (const { label, ring } of componentRingCases) {
      // The pill is a Silver container, so its dismiss outline uses the text
      // ring whatever background the pill sits on.
      const components = [
        { component: canvas.getByLabelText(`Card on ${label}`), ring },
        {
          component: canvas.getByRole('link', { name: `Link on ${label}` }),
          ring,
        },
        {
          component: canvas.getByRole('button', {
            name: `Unstyled on ${label}`,
          }),
          ring,
        },
        {
          component: canvas.getByRole('button', {
            name: `Remove pill on ${label}`,
          }),
          ring: '--pathable-color-text',
        },
      ]
      for (const { component, ring: expectedRing } of components) {
        await expectKeyboardFocusIndicator(canvasElement, component, {
          color: `var(${expectedRing})`,
          fromCurrentFocus: !first,
        })
        first = false

        const container = component.parentElement
        if (!container) throw new Error('Focus story component has no parent')
        await expect(
          contrastRatio(
            view.getComputedStyle(component).outlineColor,
            findOpaqueBackground(container, view),
          ),
        ).toBeGreaterThanOrEqual(3)
      }
    }
  },
}

export const KeyboardFocusOnSurfaces = {
  parameters: {
    docs: {
      description: {
        story:
          "A `.pathable-button`, a `.pathable-icon-button`, a `.pathable-input`, a `.pathable-select` and a `.pathable-textarea` on each surface variant with a background of its own, and a button, icon button and input in thirteen nested cases. Twelve put a surface, a dark utility or a dark component container inside a surface that sets a different ring, and one puts the dark utility on the controls themselves, which keep the surface's ring; `--base` is transparent and inherits its parent's. The focus outline is drawn on the background behind the control, so each of these sets `--pathable-surface-focus-ring` for the shared `state-focus` ring: `--pathable-color-on-accent` on Intelligent Jade, `--pathable-color-text` on Shilling Silver, and `--pathable-color-focus-ring` (Bright Blue Brooks) on white and on the dark containers, except Tech Teal (`pathable-bg-link`), where it is `--pathable-color-surface` (white) because Bright Blue Brooks is 2.6:1 there; the light containers nested in Tech Teal have their own story, `KeyboardFocusInTechTeal`. The play function tabs to every control and checks the outline colour and its contrast of at least 3:1 with the background. In the interactive case the inner `.pathable-surface--interactive` also draws its own `:focus-within` outline on the Silver around it, in that surface's ring, `--pathable-color-text`.",
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
          <div class="${focusCase.inner} pathable-stack pathable-stack--gap-sm pathable-padding-2" style="${focusCase.innerStyle ?? ''}">
            ${focusControls(focusCase)}
          </div>
        </div>`,
        )
        .join('')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await expectFocusRings(canvasElement, focusCases)
  },
}

// Containers nested in Tech Teal (`pathable-bg-link`), which sets a white ring.
// Each light container resets or sets its own, and each case gets a full-width
// block so a narrow viewport or large text cannot squeeze it.
const tealCases: (FocusCase & { outer: string; inner: string })[] = [
  {
    label: 'Surface background in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-bg-surface pathable-text-primary',
    ring: '--pathable-color-focus-ring',
  },
  {
    label: 'Base background in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-bg-base pathable-text-primary',
    ring: '--pathable-color-text',
  },
  {
    label: 'Accent background in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-bg-accent',
    innerStyle: 'color: var(--pathable-color-on-accent)',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Success background in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-bg-success',
    innerStyle: 'color: var(--pathable-color-on-accent)',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Warning alert in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-alert pathable-alert--warning',
    alertBody: true,
    bodyStyle: 'color: var(--pathable-color-text)',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Error alert in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-alert pathable-alert--error',
    alertBody: true,
    bodyStyle: 'color: var(--pathable-color-text)',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Emergency alert in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-alert pathable-alert--emergency',
    alertBody: true,
    bodyStyle: 'color: var(--pathable-color-surface)',
    dark: true,
    ring: '--pathable-color-status-danger-text',
  },
  {
    label: 'Info alert in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-alert pathable-alert--info',
    alertBody: true,
    bodyStyle: 'color: var(--pathable-color-text)',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Plain alert in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-alert',
    alertBody: true,
    bodyStyle: 'color: var(--pathable-color-text)',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Slim alert in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-alert pathable-alert--slim',
    alertBody: true,
    bodyStyle: 'color: var(--pathable-color-text)',
    ring: '--pathable-color-on-accent',
  },
  {
    label: 'Base background in subtle in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner:
      'pathable-surface pathable-surface--tone-subtle pathable-bg-base pathable-text-primary',
    ring: '--pathable-color-text',
  },
  {
    label: 'Card container in link',
    outer: 'pathable-bg-link pathable-text-white',
    inner: 'pathable-card__container',
    innerStyle: 'height: auto',
    ring: '--pathable-color-focus-ring',
  },
]

const tealStyles = `
  <style>
    .teal-case { overflow-wrap: anywhere; padding: 0.5rem; }
    .teal-case > * { padding: 0.5rem; }
    .teal-case .pathable-alert { padding-left: 0.5rem; padding-right: 0.5rem; }
    .teal-case .pathable-alert__body { display: flex; flex-direction: column; align-items: stretch; gap: 0.5rem; padding: 0.5rem 0.5rem 0.5rem 2.5rem; margin: 0; min-width: 0; flex: 1 1 auto; box-sizing: border-box; }
    .teal-case .pathable-alert__body > * { max-width: 100%; margin: 0; box-sizing: border-box; }
    .teal-case .pathable-input { width: 100%; max-width: 100%; box-sizing: border-box; }
    .teal-case .pathable-button { max-width: 100%; white-space: normal; }
  </style>`

export const KeyboardFocusInTechTeal = {
  parameters: {
    docs: {
      description: {
        story:
          'A button, an icon button and an input in light containers nested in Tech Teal (`pathable-bg-link`), which sets `--pathable-surface-focus-ring` to `--pathable-color-surface` (white) because Bright Blue Brooks is 2.6:1 there. A white ring would be 1.0:1 on a light container, so each of these resets or sets its own: `pathable-bg-surface` and `pathable-card__container` to Bright Blue Brooks, `pathable-bg-base` to `--pathable-color-text`, `pathable-bg-accent`, `pathable-bg-success` and the info, plain, slim, warning and error alerts to `--pathable-color-on-accent`, and the emergency alert to `--pathable-color-status-danger-text`. The alert cases put their controls in `.pathable-alert__body`, as real alert markup does.  The play function tabs to every control and checks the outline colour and its contrast of at least 3:1 with the background.',
      },
    },
  },
  render: () => `
    ${tealStyles}
    <div class="pathable-stack pathable-stack--gap-lg">
      ${tealCases
        .map(
          (focusCase) => `
        <div class="teal-case ${focusCase.outer}">
          <div class="${focusCase.inner} pathable-stack pathable-stack--gap-sm" style="${focusCase.innerStyle ?? ''}">
            ${
              focusCase.alertBody
                ? `<div class="pathable-alert__body" style="${focusCase.bodyStyle ?? ''}">${focusControls(focusCase)}</div>`
                : focusControls(focusCase)
            }
          </div>
        </div>`,
        )
        .join('')}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await expectFocusRings(canvasElement, tealCases)
  },
}

export const Default = AllVariants

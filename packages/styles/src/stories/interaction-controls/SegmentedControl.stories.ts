export default {
  title: 'Interaction Controls/SegmentedControl',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (visual presentation; keyboard behavior requires application JavaScript)\n\n**Consumers must**: Import `@pathable/styles` CSS. **IMPORTANT — ARIA roles without JavaScript keyboard handling create an accessibility gap.** The CSS layer provides visual styling for `role="radiogroup"`, `role="radio"`, and `aria-pressed` states, but the ARIA Authoring Practices require arrow-key keyboard navigation that CSS cannot provide.\n\n**Single-select (role="radiogroup")**: Each option uses `role="radio"` and `aria-checked`. Consumers MUST implement arrow-key navigation (Left/Right for horizontal, Up/Down for vertical). Tab moves focus into the radiogroup; focus moves to the checked option on first entry. When focus is within the group, arrow keys move focus and selection to the previous/next option.\n\n**Multi-select (role="group")**: Each option uses `aria-pressed`. Consumers MUST implement Tab navigation between segments. Pressing Space or Enter toggles the pressed state. Unlike radiogroup, arrow keys do NOT move focus between options.\n\n**CSS-only story disclaimer**: The stories below demonstrate correct ARIA markup and visual states. Keyboard navigation is inert — `role="radio"` without keyboard handling does not provide a complete accessible experience. Copying this markup into a production page without adding JavaScript keyboard handlers will result in an accessibility violation.',
      },
    },
  },
}

const svgIcon = (d, _label) =>
  `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="${d}"/></svg>`

const listIcon = svgIcon('M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z', 'List')
const gridIcon = svgIcon(
  'M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z',
  'Grid',
)
const detailIcon = svgIcon(
  'M1 3h10v2H1V3zm0 4h14v2H1V7zm0 4h10v2H1v-2zm12-4h2v2h-2V7zm0 4h2v2h-2v-2z',
  'Detail',
)

const boldIcon = svgIcon(
  'M4 2h4.5a3.5 3.5 0 012.8 5.6A3.5 3.5 0 019 14H4V2zm2 4.5V5h2.5a1 1 0 010 2H6zm0 2.5V13h3a1 1 0 000-2H6z',
  'Bold',
)
const italicIcon = svgIcon('M9.5 2l-3 12H5l3-12h1.5z', 'Italic')
const underlineIcon = svgIcon(
  'M2 13h12v2H2v-2zM4 2h2v6a2 2 0 004 0V2h2v6a4 4 0 01-8 0V2z',
  'Underline',
)

const option = (label, iconSvg, selected = false, disabled = false) => {
  const selectedClass = selected
    ? ' pathable-segmented-control__option--selected'
    : ''
  const disabledAttr = disabled ? ' disabled' : ''
  const ariaChecked = selected ? 'true' : 'false'
  return `
    <button class="pathable-segmented-control__option${selectedClass}" role="radio" aria-checked="${ariaChecked}"${disabledAttr}>
      ${iconSvg}
      <span style="margin-left: 4px;">${label}</span>
    </button>
  `
}

const multiOption = (label, iconSvg, pressed = false) => {
  const selectedClass = pressed
    ? ' pathable-segmented-control__option--selected'
    : ''
  const ariaPressed = pressed ? 'true' : 'false'
  return `
    <button class="pathable-segmented-control__option${selectedClass}" aria-pressed="${ariaPressed}">
      ${iconSvg}
      <span style="margin-left: 4px;">${label}</span>
    </button>
  `
}

export const SingleSelect = {
  parameters: {
    docs: {
      description: {
        story:
          'Mutually exclusive options using ARIA radiogroup semantics. **Keyboard behavior**: Tab into the radiogroup (focus lands on checked option), then Left/Right Arrow keys move selection between options. This requires consumer JavaScript — CSS alone cannot implement arrow-key navigation.',
      },
    },
  },
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Single-Select (View Mode)</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Mutually exclusive options using ARIA radiogroup semantics. Keyboard navigation (Arrow keys) requires consumer-provided JavaScript per ARIA APG.
    </p>
    <div class="pathable-segmented-control" role="radiogroup" aria-label="View mode">
      ${option('List', listIcon, true)}
      ${option('Grid', gridIcon)}
      ${option('Detail', detailIcon)}
    </div>
  `,
}

export const MultiSelect = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Multi-Select (Text Formatting)</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Independently toggleable options using aria-pressed. Use Tab to move between segments.
    </p>
    <div class="pathable-segmented-control pathable-segmented-control--multi" role="group" aria-label="Text formatting">
      ${multiOption('Bold', boldIcon)}
      ${multiOption('Italic', italicIcon)}
      ${multiOption('Underline', underlineIcon)}
    </div>
  `,
}

export const Vertical = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Vertical Orientation</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Options stack vertically with full-width segments. Ideal for sidebars or narrow containers.
    </p>
    <div class="pathable-segmented-control pathable-segmented-control--vertical" role="radiogroup" aria-label="Alignment">
      ${option('Left', svgIcon('M1 3h14v2H1V3zm0 4h10v2H1V7zm0 4h14v2H1v-2z', 'Left'), true)}
      ${option('Center', svgIcon('M1 3h14v2H1V3zm2 4h10v2H3V7zm1 4h12v2H4v-2z', 'Center'))}
      ${option('Right', svgIcon('M1 3h14v2H1V3zm4 4h10v2H5V7zm0 4h14v2H5v-2z', 'Right'))}
      ${option('Justify', svgIcon('M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z', 'Justify'))}
    </div>
  `,
}

export const DisabledOption = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">With Disabled Option</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      One segment is disabled to show the disabled state styling.
    </p>
    <div class="pathable-segmented-control" role="radiogroup" aria-label="Page size">
      ${option('10', svgIcon('M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z', '10'), true)}
      ${option('25', svgIcon('M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z', '25'))}
      ${option('50', svgIcon('M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z', '50'), false, true)}
    </div>
  `,
}

export const SingleOption = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Single Option Edge Case</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      A segmented control with only one option. The container still renders correctly with proper border-radius and padding.
    </p>
    <div class="pathable-segmented-control" role="radiogroup" aria-label="Single option">
      ${option('Enable Feature', svgIcon('M6 12l-4-4 1.5-1.5L6 9l6.5-6.5L14 4l-8 8z', 'Enable'), true)}
    </div>
  `,
}

export const Default = SingleSelect

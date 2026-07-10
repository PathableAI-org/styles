export default {
  title: 'Interaction Controls/Icon Tile',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nSquare and circular icon containers with consistent padding, centering, and semantic token application. Use for decorative icons (with `aria-hidden="true"`) or meaningful status icons (with `role="img"` and `aria-label` on the SVG).',
      },
    },
  },
}

const iconTile = (modifiers, label) => `
  <span class="pathable-icon-tile ${modifiers}" title="${label}">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  </span>
`

const iconTileWithText = (modifiers, label, text) => `
  <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
    ${iconTile(modifiers, label)}
    <span style="font-size: 0.875rem;">${text}</span>
  </span>
`

const sectionHeading = (text) => `
  <h3 style="margin: 1.5rem 0 0.5rem; font-size: 1rem; font-weight: 600;">${text}</h3>
`

export const SquareAndCircle = {
  render: () => `
    ${sectionHeading('Square (default) vs Circular (--circle)')}
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Use for decorative icons that don't convey semantic meaning. Add <code>aria-hidden="true"</code> to the tile.
    </p>
    <div class="pathable-cluster" style="align-items: center;">
      ${iconTile('', 'bell - square')}
      ${iconTile('pathable-icon-tile--circle', 'bell - circle')}
    </div>
  `,
}

export const SizeVariants = {
  render: () => `
    ${sectionHeading('Compact / Default / Large')}
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Three predefined sizes: compact (32px), default (44px), and large (52px).
    </p>
    <div class="pathable-cluster" style="align-items: center;">
      ${iconTileWithText('pathable-icon-tile--compact', 'bell - compact', 'Compact')}
      ${iconTileWithText('', 'bell - default', 'Default')}
      ${iconTileWithText('pathable-icon-tile--large', 'bell - large', 'Large')}
    </div>
    <div class="pathable-cluster" style="align-items: center; margin-top: 0.5rem;">
      ${iconTileWithText('pathable-icon-tile--circle pathable-icon-tile--compact', 'bell - circle compact', 'Compact Circle')}
      ${iconTileWithText('pathable-icon-tile--circle', 'bell - circle default', 'Default Circle')}
      ${iconTileWithText('pathable-icon-tile--circle pathable-icon-tile--large', 'bell - circle large', 'Large Circle')}
    </div>
  `,
}

export const StatusVariants = {
  render: () => `
    ${sectionHeading('Status Color Variants')}
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Foreground color tokens for status indicators. Use with meaningful icons: add <code>role="img"</code> and <code>aria-label</code> on the SVG.
    </p>
    <div class="pathable-cluster" style="align-items: center;">
      ${iconTileWithText('', 'default icon', 'Default')}
      ${iconTileWithText('pathable-icon-tile--success', 'success icon', 'Success')}
      ${iconTileWithText('pathable-icon-tile--error', 'error icon', 'Error')}
      ${iconTileWithText('pathable-icon-tile--warning', 'warning icon', 'Warning')}
      ${iconTileWithText('pathable-icon-tile--info', 'info icon', 'Info')}
    </div>
    <div class="pathable-cluster" style="align-items: center; margin-top: 0.5rem;">
      ${iconTileWithText('pathable-icon-tile--circle', 'default circle', 'Default')}
      ${iconTileWithText('pathable-icon-tile--circle pathable-icon-tile--success', 'success circle', 'Success')}
      ${iconTileWithText('pathable-icon-tile--circle pathable-icon-tile--error', 'error circle', 'Error')}
      ${iconTileWithText('pathable-icon-tile--circle pathable-icon-tile--warning', 'warning circle', 'Warning')}
      ${iconTileWithText('pathable-icon-tile--circle pathable-icon-tile--info', 'info circle', 'Info')}
    </div>
  `,
}

export const InlineAlignment = {
  render: () => `
    ${sectionHeading('Inline Icon with Text Alignment')}
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Icon tiles align naturally with text in an inline flow. Use <code>display: inline-flex</code> on the wrapper with <code>gap</code> for spacing.
    </p>
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pathable-icon-tile pathable-icon-tile--success" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </span>
        <span style="font-size: 0.875rem;">Training record verified</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pathable-icon-tile pathable-icon-tile--error" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </span>
        <span style="font-size: 0.875rem;">Missing required documentation</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pathable-icon-tile pathable-icon-tile--warning" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <span style="font-size: 0.875rem;">Approval pending review</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="pathable-icon-tile pathable-icon-tile--circle pathable-icon-tile--info" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </span>
        <span style="font-size: 0.875rem;">3 new messages</span>
      </div>
    </div>
  `,
}

export const AllVariants = {
  render: () => `
    ${sectionHeading('All Icon Tile Variants')}
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      An overview of all available icon tile shapes, sizes, and status colors.
    </p>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <span style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.5rem;">Square</span>
        <div class="pathable-cluster" style="align-items: center;">
          ${iconTile('', 'default square')}
          ${iconTile('pathable-icon-tile--compact', 'compact square')}
          ${iconTile('pathable-icon-tile--large', 'large square')}
          ${iconTile('pathable-icon-tile--success', 'success square')}
          ${iconTile('pathable-icon-tile--error', 'error square')}
          ${iconTile('pathable-icon-tile--warning', 'warning square')}
          ${iconTile('pathable-icon-tile--info', 'info square')}
        </div>
      </div>
      <div>
        <span style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.5rem;">Circle</span>
        <div class="pathable-cluster" style="align-items: center;">
          ${iconTile('pathable-icon-tile--circle', 'default circle')}
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--compact', 'compact circle')}
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--large', 'large circle')}
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--success', 'success circle')}
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--error', 'error circle')}
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--warning', 'warning circle')}
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--info', 'info circle')}
        </div>
      </div>
    </div>
  `,
}

export const Default = AllVariants

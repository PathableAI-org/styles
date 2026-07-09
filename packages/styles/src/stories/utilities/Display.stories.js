export default {
  title: 'Utilities/Display',
  tags: ['autodocs'],
}

const displayValues = [
  { name: 'Flex', class: 'pathable-display-flex' },
  { name: 'Block', class: 'pathable-display-block' },
  { name: 'Inline', class: 'pathable-display-inline' },
  { name: 'Inline Block', class: 'pathable-display-inline-block' },
  { name: 'None', class: 'pathable-display-none' },
]

export const AllValues = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Display Utility Classes</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-display-flex</code>, <code>.pathable-display-block</code>, etc.
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${displayValues
          .map(
            ({ name, class: cls }) => `
          <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
            <span style="width: 120px; font-weight: 600; font-size: 0.875rem;">${name}</span>
            <div class="${cls}" style="background: #dde2e8; padding: 0.5rem; border: 1px dashed #00365c; ${cls === 'pathable-display-flex' ? 'gap: 0.5rem;' : ''}">
              <span style="background: #00365c; color: #fff; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 2px;">Item 1</span>
              <span style="background: #00365c; color: #fff; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 2px;">Item 2</span>
            </div>
            <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.${cls}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `,
}

export const Default = AllValues

export const ResponsiveVariants = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Responsive Display Variants</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1rem;">
        Display utilities support responsive breakpoints. Format:
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.mobile-lg\\:pathable-display-flex</code>
          <span style="color: #666; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; flex at 480px+</span>
        </div>
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.tablet\\:pathable-display-none</code>
          <span style="color: #666; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; hidden at 640px+</span>
        </div>
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.desktop\\:pathable-display-block</code>
          <span style="color: #666; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; block at 1024px+</span>
        </div>
      </div>
      <p style="color: #666; font-size: 0.875rem; margin: 1rem 0 0;">
        Available breakpoints: <code>mobile-lg</code> (480px), <code>tablet</code> (640px), <code>desktop</code> (1024px)
      </p>
    </div>
  `,
}

export default {
  title: 'Utilities/Background Colors',
  tags: ['autodocs'],
}

const colors = [
  { name: 'Primary', class: 'pathable-bg-primary' },
  { name: 'Base', class: 'pathable-bg-base' },
  { name: 'Surface', class: 'pathable-bg-surface' },
  { name: 'Accent', class: 'pathable-bg-accent' },
  { name: 'Link', class: 'pathable-bg-link' },
  { name: 'Focus Ring', class: 'pathable-bg-focus-ring' },
  { name: 'Danger', class: 'pathable-bg-danger' },
  { name: 'Success', class: 'pathable-bg-success' },
  { name: 'Transparent', class: 'pathable-bg-transparent' },
]

export const AllSwatches = {
  render: () => `
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; padding: 1rem;">
      ${colors
        .map(
          ({ name, class: cls }) => `
        <div style="flex: 0 0 160px; text-align: center; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
          <div class="${cls}" style="height: 80px; border-bottom: 1px solid rgba(0,0,0,0.1);"></div>
          <div style="padding: 0.5rem; background: #fff;">
            <div style="font-weight: 600; font-size: 0.875rem;">${name}</div>
            <div style="color: #666; font-size: 0.75rem; font-family: monospace;">.${cls}</div>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  `,
}

export const Default = AllSwatches

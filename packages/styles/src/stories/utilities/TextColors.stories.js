export default {
  title: 'Utilities/Text Colors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.',
      },
    },
  },
}

const textColors = [
  { name: 'Base', class: 'pathable-text-base' },
  { name: 'Primary', class: 'pathable-text-primary' },
  { name: 'Muted', class: 'pathable-text-muted' },
  { name: 'Accent', class: 'pathable-text-accent' },
  { name: 'Link', class: 'pathable-text-link' },
  { name: 'White', class: 'pathable-text-white' },
]

export const OnLightBackground = {
  render: () => `
    <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 4px;">
      <h3 style="margin: 0 0 1rem; font-size: 1rem; font-weight: 600;">On Light Background</h3>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${textColors
          .filter(({ name }) => name !== 'White')
          .map(
            ({ name, class: cls }) => `
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="width: 80px; font-size: 0.75rem; color: #555;">${name}</span>
            <span class="${cls}" style="font-size: 1.125rem;">The quick brown fox jumps over the lazy dog.</span>
            <span style="font-family: monospace; font-size: 0.7rem; color: #555;">.${cls}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `,
}

export const Default = OnLightBackground

export const OnDarkBackground = {
  render: () => `
    <div class="pathable-bg-primary" style="padding: 1.5rem; border-radius: 4px;">
      <h3 style="margin: 0 0 1rem; font-size: 1rem; font-weight: 600; color: #fff;">On Dark Background</h3>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${textColors
          .map(
            ({ name, class: cls }) => `
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="width: 80px; font-size: 0.75rem; color: rgba(255,255,255,0.6);">${name}</span>
            <span class="${cls}" style="font-size: 1.125rem;">The quick brown fox jumps over the lazy dog.</span>
            <span style="font-family: monospace; font-size: 0.7rem; color: rgba(255,255,255,0.5);">.${cls}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `,
}

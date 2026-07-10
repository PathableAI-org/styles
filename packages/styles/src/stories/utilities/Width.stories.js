export default {
  title: 'Utilities/Width',
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

export const WidthUtilities = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Width Utilities</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-width-full</code>, <code>.pathable-width-auto</code>
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="background: #f9f9f9; padding: 0.75rem; border-radius: 4px;">
          <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem;">Full Width</div>
          <div class="pathable-width-full" style="background: #dde2e8; padding: 0.5rem; border: 1px dashed #00365c; text-align: center;">
            <span style="font-size: 0.8rem;">.pathable-width-full &mdash; 100% width</span>
          </div>
        </div>
        <div style="background: #f9f9f9; padding: 0.75rem; border-radius: 4px;">
          <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem;">Auto Width</div>
          <div class="pathable-width-auto" style="background: #dde2e8; padding: 0.5rem; border: 1px dashed #00365c; display: inline-block;">
            <span style="font-size: 0.8rem;">.pathable-width-auto &mdash; width fits content</span>
          </div>
        </div>
      </div>
    </div>
  `,
}

export const Default = WidthUtilities

export const MaxWidthUtilities = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Max Width Utilities</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-maxw-mobile</code>, <code>.pathable-maxw-mobile-lg</code>, <code>.pathable-maxw-tablet</code>, <code>.pathable-maxw-desktop</code>
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${[
          { label: 'Mobile', class: 'pathable-maxw-mobile', width: 'mobile' },
          {
            label: 'Mobile LG',
            class: 'pathable-maxw-mobile-lg',
            width: 'mobile-lg (480px)',
          },
          {
            label: 'Tablet',
            class: 'pathable-maxw-tablet',
            width: 'tablet (640px)',
          },
          {
            label: 'Desktop',
            class: 'pathable-maxw-desktop',
            width: 'desktop (1024px)',
          },
        ]
          .map(
            ({ label, class: cls, width }) => `
          <div style="background: #f9f9f9; padding: 0.75rem; border-radius: 4px;">
            <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">${label}</div>
            <div class="${cls}" style="background: #dde2e8; padding: 0.5rem; border: 1px dashed #00365c;">
              <span style="font-size: 0.75rem;">Max width: ${width}</span>
            </div>
            <span style="font-family: monospace; font-size: 0.7rem; color: #999;">.${cls}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `,
}

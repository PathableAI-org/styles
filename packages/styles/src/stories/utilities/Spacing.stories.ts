export default {
  title: 'Utilities/Spacing',
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

export const PaddingScale = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Padding Scale</h3>
      <p style="color: #444; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-padding-{0-10, 15}</code> &mdash; applies padding on all sides.
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15]
          .map(
            (n) => `
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="width: 120px; font-family: monospace; font-size: 0.8rem; color: #555;">padding-${n}</span>
            <div style="background: #f0f0f0; display: inline-block;">
              <div class="pathable-padding-${n}" style="background: #dde2e8; border: 1px dashed #00365c;">
                <span style="font-size: 0.7rem; color: #00365c;">${n === 0 ? 'no padding' : `${n} units`}</span>
              </div>
            </div>
            <span style="font-family: monospace; font-size: 0.7rem; color: #555;">.pathable-padding-${n}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `,
}

export const Default = PaddingScale

export const MarginScale = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Margin Scale</h3>
      <p style="color: #444; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-margin-{0-10, 15}</code> &mdash; applies margin on all sides.
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15]
          .map(
            (n) => `
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="width: 120px; font-family: monospace; font-size: 0.8rem; color: #555;">margin-${n}</span>
            <div style="background: repeating-linear-gradient(45deg, #e8e8e8, #e8e8e8 4px, #f5f5f5 4px, #f5f5f5 8px); display: inline-block;">
              <div class="pathable-margin-${n}" style="background: #fff; border: 1px solid #ccc; padding: 0.25rem 0.5rem;">
                <span style="font-size: 0.75rem;">Content</span>
              </div>
            </div>
            <span style="font-family: monospace; font-size: 0.7rem; color: #555;">.pathable-margin-${n}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `,
}

export const ResponsiveVariants = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Responsive Spacing</h3>
      <p style="color: #444; font-size: 0.875rem; margin: 0 0 1rem;">
        Spacing utilities support responsive breakpoints using the format:<br>
        <code>.pathable-padding-{n}-mobile-lg</code>, <code>.pathable-padding-{n}-tablet</code>, <code>.pathable-padding-{n}-desktop</code>
      </p>
      <p style="color: #444; font-size: 0.875rem; margin: 0 0 1rem;">
        Available breakpoints:
      </p>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 0.5rem; text-align: left; border: 1px solid #ccc; font-size: 0.875rem;">Breakpoint</th>
            <th style="padding: 0.5rem; text-align: left; border: 1px solid #ccc; font-size: 0.875rem;">Suffix</th>
            <th style="padding: 0.5rem; text-align: left; border: 1px solid #ccc; font-size: 0.875rem;">Min Width</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem;">Mobile LG</td>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem; font-family: monospace;">-mobile-lg</td>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem;">480px</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem;">Tablet</td>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem; font-family: monospace;">-tablet</td>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem;">640px</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem;">Desktop</td>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem; font-family: monospace;">-desktop</td>
            <td style="padding: 0.5rem; border: 1px solid #ccc; font-size: 0.875rem;">1024px</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
}

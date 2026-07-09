export default {
  title: 'Utilities/Border',
  tags: ['autodocs'],
}

export const BorderWidths = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Border Width Utilities</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-border-{0-5}</code>
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
        ${[0, 1, 2, 3, 4, 5]
          .map(
            (n) => `
          <div style="text-align: center;">
            <div class="pathable-border-${n}" style="border-color: #00365c; border-style: solid; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: #fff;">
              <span style="font-size: 0.75rem; font-weight: 600;">${n}</span>
            </div>
            <div style="margin-top: 0.5rem; font-family: monospace; font-size: 0.7rem; color: #666;">border-${n}</div>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `,
}

export const Default = BorderWidths

export const BorderRadius = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Border Radius Utilities</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-border-radius-sm</code>, <code>.pathable-border-radius-md</code>, <code>.pathable-border-radius-lg</code>
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
        <div style="text-align: center;">
          <div class="pathable-border-radius-sm pathable-border-1" style="border-color: #00365c; border-style: solid; width: 100px; height: 80px; display: flex; align-items: center; justify-content: center; background: #dde2e8;">
            <span style="font-size: 0.75rem; font-weight: 600;">SM</span>
          </div>
          <div style="margin-top: 0.5rem; font-family: monospace; font-size: 0.7rem; color: #666;">border-radius-sm</div>
        </div>
        <div style="text-align: center;">
          <div class="pathable-border-radius-md pathable-border-1" style="border-color: #00365c; border-style: solid; width: 100px; height: 80px; display: flex; align-items: center; justify-content: center; background: #dde2e8;">
            <span style="font-size: 0.75rem; font-weight: 600;">MD</span>
          </div>
          <div style="margin-top: 0.5rem; font-family: monospace; font-size: 0.7rem; color: #666;">border-radius-md</div>
        </div>
        <div style="text-align: center;">
          <div class="pathable-border-radius-lg pathable-border-1" style="border-color: #00365c; border-style: solid; width: 100px; height: 80px; display: flex; align-items: center; justify-content: center; background: #dde2e8;">
            <span style="font-size: 0.75rem; font-weight: 600;">LG</span>
          </div>
          <div style="margin-top: 0.5rem; font-family: monospace; font-size: 0.7rem; color: #666;">border-radius-lg</div>
        </div>
      </div>
    </div>
  `,
}

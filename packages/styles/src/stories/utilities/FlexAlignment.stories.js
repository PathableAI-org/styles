export default {
  title: 'Utilities/Flex & Alignment',
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

export const FlexDirection = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Flex Direction</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-flex-row</code>, <code>.pathable-flex-column</code>, <code>.pathable-flex-wrap</code>
      </p>
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem;">Row (default)</div>
          <div class="pathable-flex-row" style="display: flex; background: #f0f0f0; padding: 0.5rem; gap: 0.5rem; border: 1px solid #ccc;">
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 1</span>
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 2</span>
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 3</span>
          </div>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999;">.pathable-flex-row</span>
        </div>
        <div>
          <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem;">Column</div>
          <div class="pathable-flex-column" style="display: flex; flex-direction: column; background: #f0f0f0; padding: 0.5rem; gap: 0.5rem; border: 1px solid #ccc;">
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 1</span>
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 2</span>
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 3</span>
          </div>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999;">.pathable-flex-column</span>
        </div>
        <div>
          <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem;">Wrap</div>
          <div class="pathable-flex-wrap" style="display: flex; flex-wrap: wrap; background: #f0f0f0; padding: 0.5rem; gap: 0.5rem; border: 1px solid #ccc; max-width: 300px;">
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 1</span>
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 2</span>
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 3</span>
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 4</span>
            <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 5</span>
          </div>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999;">.pathable-flex-wrap</span>
        </div>
      </div>
    </div>
  `,
}

export const Default = FlexDirection

export const AlignItems = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Align Items</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-flex-align-start</code>, <code>.pathable-flex-align-center</code>, <code>.pathable-flex-align-end</code>, <code>.pathable-flex-align-stretch</code>, <code>.pathable-flex-align-baseline</code>
      </p>
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${[
          { name: 'Start', class: 'pathable-flex-align-start' },
          { name: 'Center', class: 'pathable-flex-align-center' },
          { name: 'End', class: 'pathable-flex-align-end' },
          { name: 'Stretch', class: 'pathable-flex-align-stretch' },
          { name: 'Baseline', class: 'pathable-flex-align-baseline' },
        ]
          .map(
            ({ name, class: cls }) => `
          <div>
            <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">${name}</div>
            <div class="${cls}" style="display: flex; align-items: stretch; background: #f0f0f0; padding: 0.5rem; gap: 0.5rem; border: 1px solid #ccc; min-height: 80px;">
              <span style="background: #00365c; color: #fff; padding: 0.5rem; border-radius: 4px; font-size: 0.75rem;">Short</span>
              <span style="background: #4899e8; color: #fff; padding: 1rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Medium</span>
              <span style="background: #015a76; color: #fff; padding: 1.5rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">Tall Item</span>
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

export const JustifyContent = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Justify Content</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-flex-justify-center</code>, <code>.pathable-flex-justify-between</code>, <code>.pathable-flex-justify-end</code>, <code>.pathable-flex-justify-around</code>
      </p>
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${[
          { name: 'Center', class: 'pathable-flex-justify-center' },
          { name: 'Between', class: 'pathable-flex-justify-between' },
          { name: 'End', class: 'pathable-flex-justify-end' },
          { name: 'Around', class: 'pathable-flex-justify-around' },
        ]
          .map(
            ({ name, class: cls }) => `
          <div>
            <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">${name}</div>
            <div class="${cls}" style="display: flex; background: #f0f0f0; padding: 0.5rem; gap: 0.5rem; border: 1px solid #ccc;">
              <span style="background: #00365c; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 1</span>
              <span style="background: #4899e8; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 2</span>
              <span style="background: #015a76; color: #fff; padding: 0.5rem 1rem; border-radius: 4px;">Item 3</span>
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

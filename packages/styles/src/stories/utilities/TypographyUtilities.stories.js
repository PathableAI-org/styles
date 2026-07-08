export default {
  title: 'Utilities/Typography',
  tags: ['autodocs'],
};

export const FontFamilies = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Font Family Utilities</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-font-family-ui</code>, <code>.pathable-font-family-heading</code>, etc.
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <span style="width: 100px; font-weight: 600; font-size: 0.8rem; color: #555;">UI</span>
          <span class="pathable-font-family-ui" style="font-size: 1.25rem;">The quick brown fox jumps over the lazy dog.</span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.pathable-font-family-ui</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <span style="width: 100px; font-weight: 600; font-size: 0.8rem; color: #555;">Heading</span>
          <span class="pathable-font-family-heading" style="font-size: 1.25rem;">The quick brown fox jumps over the lazy dog.</span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.pathable-font-family-heading</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <span style="width: 100px; font-weight: 600; font-size: 0.8rem; color: #555;">Body</span>
          <span class="pathable-font-family-body" style="font-size: 1.25rem;">The quick brown fox jumps over the lazy dog.</span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.pathable-font-family-body</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <span style="width: 100px; font-weight: 600; font-size: 0.8rem; color: #555;">Code</span>
          <span class="pathable-font-family-code" style="font-size: 1.25rem;">The quick brown fox jumps over the lazy dog.</span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.pathable-font-family-code</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <span style="width: 100px; font-weight: 600; font-size: 0.8rem; color: #555;">Serif</span>
          <span class="pathable-font-family-serif" style="font-size: 1.25rem;">The quick brown fox jumps over the lazy dog.</span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.pathable-font-family-serif</span>
        </div>
      </div>
    </div>
  `,
};

export const FontWeights = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Font Weight Utilities</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-text-normal</code>, <code>.pathable-text-bold</code>, <code>.pathable-text-heavy</code>
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <span style="width: 100px; font-weight: 600; font-size: 0.8rem; color: #555;">Normal</span>
          <span class="pathable-text-normal" style="font-size: 1.25rem;">The quick brown fox jumps over the lazy dog.</span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.pathable-text-normal</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <span style="width: 100px; font-weight: 600; font-size: 0.8rem; color: #555;">Bold</span>
          <span class="pathable-text-bold" style="font-size: 1.25rem;">The quick brown fox jumps over the lazy dog.</span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.pathable-text-bold</span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <span style="width: 100px; font-weight: 600; font-size: 0.8rem; color: #555;">Heavy</span>
          <span class="pathable-text-heavy" style="font-size: 1.25rem;">The quick brown fox jumps over the lazy dog.</span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999; margin-left: auto;">.pathable-text-heavy</span>
        </div>
      </div>
    </div>
  `,
};
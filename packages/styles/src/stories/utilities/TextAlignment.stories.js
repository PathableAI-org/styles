export default {
  title: 'Utilities/Text Alignment',
  tags: ['autodocs'],
}

export const AllValues = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Text Alignment Utilities</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-text-center</code>, <code>.pathable-text-left</code>, <code>.pathable-text-right</code>
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="background: #f9f9f9; padding: 1rem; border-radius: 4px;">
          <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">Left Aligned</div>
          <div class="pathable-text-left" style="background: #dde2e8; padding: 0.75rem; border-radius: 4px;">
            <p style="margin: 0;">This text is aligned to the left. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999;">.pathable-text-left</span>
        </div>
        <div style="background: #f9f9f9; padding: 1rem; border-radius: 4px;">
          <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">Center Aligned</div>
          <div class="pathable-text-center" style="background: #dde2e8; padding: 0.75rem; border-radius: 4px;">
            <p style="margin: 0;">This text is aligned to the center. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999;">.pathable-text-center</span>
        </div>
        <div style="background: #f9f9f9; padding: 1rem; border-radius: 4px;">
          <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">Right Aligned</div>
          <div class="pathable-text-right" style="background: #dde2e8; padding: 0.75rem; border-radius: 4px;">
            <p style="margin: 0;">This text is aligned to the right. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <span style="font-family: monospace; font-size: 0.7rem; color: #999;">.pathable-text-right</span>
        </div>
      </div>
    </div>
  `,
}

export const Default = AllValues

export const ResponsiveVariants = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Responsive Text Alignment</h3>
      <p style="color: #666; font-size: 0.875rem; margin: 0 0 1rem;">
        Text alignment utilities also support responsive breakpoints using the format:
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.mobile-lg\\:pathable-text-center</code>
          <span style="color: #666; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; center at 480px+</span>
        </div>
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.tablet\\:pathable-text-left</code>
          <span style="color: #666; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; left at 640px+</span>
        </div>
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.desktop\\:pathable-text-right</code>
          <span style="color: #666; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; right at 1024px+</span>
        </div>
      </div>
      <p style="color: #666; font-size: 0.875rem; margin: 1rem 0 0;">
        Available breakpoints: <code>mobile-lg</code> (480px), <code>tablet</code> (640px), <code>desktop</code> (1024px)
      </p>
    </div>
  `,
}

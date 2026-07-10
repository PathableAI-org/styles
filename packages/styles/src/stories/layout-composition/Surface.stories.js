export default {
  title: 'Layout Composition/Surface',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (with CSS-driven interactive states)\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nSemantic visual container styles that convey depth through token-driven backgrounds, borders, border-radius, and elevation.',
      },
    },
  },
}

const demoBlock = (variant, label) => `
  <div class="pathable-surface ${variant}" style="padding: 1.5rem; min-width: 120px;">
    <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">${label}</div>
    <div style="font-size: 0.75rem; opacity: 0.7;">${variant.replace('pathable-surface--', '.')}</div>
  </div>
`

export const AllVariants = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">All Surface Variants</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Each surface establishes a different visual depth level. Resize to see how they compare side by side or stacked.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: stretch;">
      ${demoBlock('pathable-surface--base', 'Base')}
      ${demoBlock('pathable-surface--raised', 'Raised')}
      ${demoBlock('pathable-surface--inset', 'Inset')}
      ${demoBlock('pathable-surface--interactive', 'Interactive')}
      ${demoBlock('pathable-surface--brand', 'Brand')}
      ${demoBlock('pathable-surface--inverse', 'Inverse')}
    </div>
  `,
}

export const InteractiveStates = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Interactive Surface States</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Focus-visible ring (indicated by outline). Hover elevates the shadow.
      Tab to the interactive element to see the focus state.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      <div class="pathable-surface pathable-surface--interactive" tabindex="0" style="padding: 1.5rem; max-width: 200px;">
        <div style="font-size: 0.875rem; font-weight: 600;">Rest</div>
        <div style="font-size: 0.75rem; margin-top: 0.25rem;">Tab to focus me</div>
      </div>
      <div class="pathable-surface pathable-surface--interactive" style="padding: 1.5rem; max-width: 200px; opacity: 0.5; cursor: default;">
        <div style="font-size: 0.875rem; font-weight: 600;">Disabled</div>
        <div style="font-size: 0.75rem; margin-top: 0.25rem;">aria-disabled</div>
      </div>
    </div>
  `,
}

export const NestedSurfaces = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Nested Surfaces</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Surfaces maintain visual distinguishability when nested. Raised inside inset, and vice versa.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      <div class="pathable-surface pathable-surface--inset" style="padding: 1.5rem;">
        <span style="font-size: 0.8rem; display: block; margin-bottom: 0.75rem;">Inset (outer)</span>
        <div class="pathable-surface pathable-surface--raised" style="padding: 1rem;">
          <span style="font-size: 0.8rem;">Raised (inner)</span>
        </div>
      </div>
      <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
        <span style="font-size: 0.8rem; display: block; margin-bottom: 0.75rem;">Raised (outer)</span>
        <div class="pathable-surface pathable-surface--inset" style="padding: 1rem;">
          <span style="font-size: 0.8rem;">Inset (inner)</span>
        </div>
      </div>
    </div>
  `,
}

export const Default = AllVariants
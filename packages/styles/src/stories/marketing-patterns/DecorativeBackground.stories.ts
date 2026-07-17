export default {
  title: 'Marketing Patterns/Decorative Background',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only — modifier classes\n\n**Consumers must**: Import `@pathable/styles` CSS. Apply `.pathable-decorative-bg` and a variant modifier to any section or container element. Decorative layers render via CSS `::before` pseudo-elements and are naturally excluded from the accessibility tree.\n\n**Contrast**: Default opacity of decorative layers (15%) preserves text and control contrast. Consumers can adjust via `--pathable-decorative-bg-opacity`.',
      },
    },
  },
}

export const Gradient = {
  parameters: {
    docs: {
      description: {
        story:
          'Quiet gradient from top-left to bottom-right using semantic color variables.',
      },
    },
  },
  render: () => `
    <div class="pathable-decorative-bg pathable-decorative-bg--gradient" style="padding: 4rem 2rem; border-radius: 8px; max-width: 600px;">
      <h2 style="margin: 0 0 0.5rem;">Quiet Gradient</h2>
      <p style="margin: 0; color: inherit;">A subtle gradient background using semantic PathAble color variables — no raw brand values embedded.</p>
    </div>
  `,
}

export const RadialGlow = {
  parameters: {
    docs: {
      description: {
        story: 'Soft radial glow emanating from the center-top region.',
      },
    },
  },
  render: () => `
    <div class="pathable-decorative-bg pathable-decorative-bg--glow" style="padding: 4rem 2rem; border-radius: 8px; max-width: 600px;">
      <h2 style="margin: 0 0 0.5rem;">Radial Glow</h2>
      <p style="margin: 0; color: inherit;">A soft glow effect layered behind content. Does not reduce text or control contrast.</p>
    </div>
  `,
}

export const SubtleTexture = {
  parameters: {
    docs: {
      description: {
        story: 'Subtle dot-grid texture overlay for visual depth.',
      },
    },
  },
  render: () => `
    <div class="pathable-decorative-bg pathable-decorative-bg--texture" style="padding: 4rem 2rem; border-radius: 8px; max-width: 600px;">
      <h2 style="margin: 0 0 0.5rem;">Subtle Texture</h2>
      <p style="margin: 0; color: inherit;">A repeating micro-grid overlay adds visual texture without distracting from content.</p>
    </div>
  `,
}

export const OrganicShape = {
  parameters: {
    docs: {
      description: {
        story: 'Organic blob shape positioned in the top-right corner.',
      },
    },
  },
  render: () => `
    <div class="pathable-decorative-bg pathable-decorative-bg--organic" style="padding: 4rem 2rem; border-radius: 8px; max-width: 600px;">
      <h2 style="margin: 0 0 0.5rem;">Organic Shape</h2>
      <p style="margin: 0; color: inherit;">An organic blob shape with asymmetric border-radius. Positioned in the top-right corner of the container.</p>
    </div>
  `,
}

export const AnimatedOrganic = {
  parameters: {
    docs: {
      description: {
        story:
          'Organic shape with gentle float/pulse animation. Disabled under prefers-reduced-motion: reduce.',
      },
    },
  },
  render: () => `
    <div class="pathable-decorative-bg pathable-decorative-bg--organic pathable-decorative-bg--animated" style="padding: 4rem 2rem; border-radius: 8px; max-width: 600px;">
      <h2 style="margin: 0 0 0.5rem;">Animated Organic Shape</h2>
      <p style="margin: 0; color: inherit;">Gentle float and pulse animation. The animation is fully disabled under prefers-reduced-motion: reduce.</p>
    </div>
  `,
}

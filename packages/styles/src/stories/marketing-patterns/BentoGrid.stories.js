export default {
  title: 'Marketing Patterns/Bento Grid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only — grid layout\n\n**Consumers must**: Import `@pathable/styles` CSS. Use a `.pathable-bento-grid` container with `.pathable-bento-tile` children. Apply a type modifier (`--featured`, `--standard`, `--metric`, `--image`) to each tile.\n\n**Accessibility**: DOM order follows logical reading sequence. CSS Grid `grid-template-areas` handles visual placement. Tab order matches DOM order, not visual position.',
      },
    },
  },
}

const tileStyle = 'min-height: 120px;'

export const MixedLayout = {
  parameters: {
    docs: {
      description: {
        story:
          'A mixed bento grid with featured, standard, metric, and image tiles.',
      },
    },
  },
  render: () => `
    <div class="pathable-bento-grid">
      <div class="pathable-bento-tile pathable-bento-tile--featured" style="min-height: 250px;">
        <h3 style="margin: 0 0 0.5rem; font-size: 1.25rem;">Featured</h3>
        <p style="margin: 0;">Hero content spanning two columns and two rows. Perfect for spotlight content or a headline callout.</p>
      </div>
      <div class="pathable-bento-tile pathable-bento-tile--standard" style="${tileStyle}">
        <h4 style="margin: 0 0 0.25rem;">Standard</h4>
        <p style="margin: 0; font-size: 0.875rem;">Equal-width tile for feature descriptions.</p>
      </div>
      <div class="pathable-bento-tile pathable-bento-tile--metric" style="${tileStyle}">
        <span class="pathable-bento-tile__value">87%</span>
        <span class="pathable-bento-tile__label">Engagement rate</span>
      </div>
      <div class="pathable-bento-tile pathable-bento-tile--image" style="min-height: 180px;">
        <img src="https://placehold.co/400x300/primary/white?text=Image" alt="Feature screenshot" />
      </div>
      <div class="pathable-bento-tile pathable-bento-tile--image2" style="min-height: 180px;" id="bento-image-2">
        <img src="https://placehold.co/400x300/primary-lighter/333?text=Analytics" alt="Analytics screenshot" />
      </div>
    </div>
  `,
}

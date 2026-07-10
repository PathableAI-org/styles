export default {
  title: 'Layout Composition/Card Grid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nAuto-fitting grid suitable for cards and tiles. Columns automatically adjust count based on available width, never producing unreasonably narrow cards (minimum 300px).',
      },
    },
  },
}

const card = (label) => `
  <div style="background: #fff; border: 1px solid #dde2e8; border-radius: 8px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
    <h4 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">${label}</h4>
    <p style="margin: 0; font-size: 0.875rem; color: #555; line-height: 1.5;">
      This is a sample card showing how the grid adapts. Resize the viewport to see columns change.
    </p>
  </div>
`

export const ThreeCards = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">3 Cards</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Three cards — at desktop width, fills one row. At tablet, collapses to 2+1.
    </p>
    <div class="pathable-card-grid">
      ${card('Card One')}
      ${card('Card Two')}
      ${card('Card Three')}
    </div>
  `,
}

export const FiveCards = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">5 Cards</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Five cards — demonstrates multi-row auto-fill behavior.
    </p>
    <div class="pathable-card-grid">
      ${card('Alpha')}
      ${card('Beta')}
      ${card('Gamma')}
      ${card('Delta')}
      ${card('Epsilon')}
    </div>
  `,
}

export const SingleCard = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">1 Card</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      A single card — auto-fill preserves column tracks; the card fills one column and stays left-aligned.
    </p>
    <div class="pathable-card-grid">
      ${card('Lonely Card')}
    </div>
  `,
}

export const GapVariants = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Gap Variants</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      SM (var(--space-16)), MD (var(--space-24), default), LG (var(--space-32)).
    </p>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <span style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Gap SM</span>
        <div class="pathable-card-grid pathable-card-grid--gap-sm">
          ${card('A')}
          ${card('B')}
          ${card('C')}
        </div>
      </div>
      <div>
        <span style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Gap LG</span>
        <div class="pathable-card-grid pathable-card-grid--gap-lg">
          ${card('A')}
          ${card('B')}
          ${card('C')}
        </div>
      </div>
    </div>
  `,
}

export const Default = ThreeCards

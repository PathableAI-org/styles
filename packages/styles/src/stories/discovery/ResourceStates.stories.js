export default {
  title: 'Discovery/Resource States',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Shows populated, loading, empty, and sparse states for a resource grid. Loading state uses existing `.pathable-skeleton` pattern. Empty state uses existing `.pathable-empty-state` pattern.',
      },
    },
  },
}

export const Populated = {
  render: () => `
    <div class="pathable-card-grid">
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive">
        <div class="pathable-resource-card__media">
          <img src="https://placehold.co/300x200/1cae96/ffffff?text=Guide" alt="" aria-hidden="true">
        </div>
        <div class="pathable-resource-card__body">
          <a href="#" class="pathable-resource-card__link">
            <h3 class="pathable-resource-card__title">Accessibility Guide</h3>
          </a>
          <p class="pathable-resource-card__provider">PathAble Learning</p>
          <p class="pathable-resource-card__summary">A comprehensive guide to digital accessibility.</p>
          <div class="pathable-resource-card__badges">
            <span class="pathable-tag">Guide</span>
          </div>
        </div>
      </div>
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive">
        <div class="pathable-resource-card__media">
          <img src="https://placehold.co/300x200/00365c/ffffff?text=Tool" alt="" aria-hidden="true">
        </div>
        <div class="pathable-resource-card__body">
          <a href="#" class="pathable-resource-card__link">
            <h3 class="pathable-resource-card__title">Contrast Checker</h3>
          </a>
          <p class="pathable-resource-card__provider">Dev Tools</p>
          <p class="pathable-resource-card__summary">Check color contrast ratios in real time.</p>
          <div class="pathable-resource-card__badges">
            <span class="pathable-tag">Tool</span>
          </div>
        </div>
      </div>
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive">
        <div class="pathable-resource-card__media">
          <img src="https://placehold.co/300x200/4899e8/ffffff?text=Video" alt="" aria-hidden="true">
        </div>
        <div class="pathable-resource-card__body">
          <a href="#" class="pathable-resource-card__link">
            <h3 class="pathable-resource-card__title">Screen Reader Demo</h3>
          </a>
          <p class="pathable-resource-card__provider">A11y Channel</p>
          <p class="pathable-resource-card__summary">Video walkthrough of screen reader usage.</p>
          <div class="pathable-resource-card__badges">
            <span class="pathable-tag">Video</span>
          </div>
        </div>
      </div>
    </div>
  `,
}

export const Loading = {
  render: () => `
    <div class="pathable-card-grid">
      <div class="pathable-skeleton pathable-skeleton--card" aria-hidden="true"></div>
      <div class="pathable-skeleton pathable-skeleton--card" aria-hidden="true"></div>
      <div class="pathable-skeleton pathable-skeleton--card" aria-hidden="true"></div>
    </div>
  `,
}

export const Empty = {
  render: () => `
    <div class="pathable-empty-state pathable-empty-state--no-results">
      <svg class="pathable-empty-state__icon" aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <h2 class="pathable-empty-state__heading">No matching resources</h2>
      <p class="pathable-empty-state__body">Try adjusting your search terms or clearing your filters to see more resources.</p>
      <a href="#" class="pathable-empty-state__action pathable-button">Clear all filters</a>
    </div>
  `,
}

export const Sparse = {
  render: () => `
    <div class="pathable-card-grid">
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--no-image">
        <div class="pathable-resource-card__media" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div class="pathable-resource-card__body">
          <a href="#" class="pathable-resource-card__link">
            <h3 class="pathable-resource-card__title">Getting Started</h3>
          </a>
          <p class="pathable-resource-card__provider">PathAble</p>
        </div>
      </div>
    </div>
  `,
}

export default {
  title: 'Discovery/Resource Card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Each card uses `.pathable-resource-card` with layout modifier and optional interactive/has-action/no-image modifiers.',
      },
    },
  },
}

const defaultContent = `
  <div class="pathable-resource-card__media">
    <img src="https://placehold.co/300x200/1cae96/ffffff?text=Thumbnail" alt="" aria-hidden="true">
  </div>
  <div class="pathable-resource-card__body">
    <a href="#" class="pathable-resource-card__link">
      <h3 class="pathable-resource-card__title">Introduction to Assistive Technology</h3>
    </a>
    <p class="pathable-resource-card__provider">PathAble Learning</p>
    <p class="pathable-resource-card__summary">A comprehensive overview of assistive technology tools and strategies for creating inclusive digital experiences. Covers screen readers, voice input, and alternative navigation methods.</p>
    <div class="pathable-resource-card__badges">
      <span class="pathable-tag">Training</span>
      <span class="pathable-tag">Beginner</span>
    </div>
    <p class="pathable-resource-card__metadata">Updated 2 days ago &middot; 4 modules</p>
    <p class="pathable-resource-card__rating" aria-label="4 out of 5 stars">★★★★☆</p>
    <p class="pathable-resource-card__source">Source: WCAG Guidelines</p>
  </div>
`

export const Default = {
  render: () => `
    <div class="pathable-card-grid" style="max-width: 400px">
      <div class="pathable-resource-card pathable-resource-card--grid">
        ${defaultContent}
      </div>
    </div>
  `,
}

export const Interactive = {
  render: () => `
    <div class="pathable-card-grid" style="max-width: 400px">
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive">
        ${defaultContent}
      </div>
    </div>
  `,
}

export const WithAction = {
  render: () => `
    <div class="pathable-card-grid" style="max-width: 400px">
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive pathable-resource-card--has-action">
        ${defaultContent}
        <button class="pathable-resource-card__action pathable-icon-button pathable-icon-button--bare"
                aria-label="Save resource">&#9734;</button>
      </div>
    </div>
  `,
}

export const ListLayout = {
  render: () => `
    <div class="pathable-card-grid" style="max-width: 600px">
      <div class="pathable-resource-card pathable-resource-card--list pathable-resource-card--interactive">
        ${defaultContent}
      </div>
    </div>
  `,
}

export const NoImage = {
  render: () => `
    <div class="pathable-card-grid" style="max-width: 400px">
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--no-image">
        <div class="pathable-resource-card__media" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div class="pathable-resource-card__body">
          <a href="#" class="pathable-resource-card__link">
            <h3 class="pathable-resource-card__title">Resource Without Thumbnail</h3>
          </a>
          <p class="pathable-resource-card__provider">Provider Name</p>
          <p class="pathable-resource-card__summary">This card shows the fallback icon when no image is available.</p>
        </div>
      </div>
    </div>
  `,
}

export const Sparse = {
  render: () => `
    <div class="pathable-card-grid" style="max-width: 400px">
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--no-image">
        <div class="pathable-resource-card__media" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div class="pathable-resource-card__body">
          <a href="#" class="pathable-resource-card__link">
            <h3 class="pathable-resource-card__title">Minimal Resource</h3>
          </a>
          <p class="pathable-resource-card__provider">Unknown Provider</p>
        </div>
      </div>
    </div>
  `,
}

export const Grid = {
  render: () => `
    <div class="pathable-card-grid">
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive pathable-resource-card--has-action">
        ${defaultContent}
        <button class="pathable-resource-card__action pathable-icon-button pathable-icon-button--bare"
                aria-label="Save resource">&#9734;</button>
      </div>
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive pathable-resource-card--has-action">
        <div class="pathable-resource-card__media">
          <img src="https://placehold.co/300x200/00365c/ffffff?text=Guide" alt="" aria-hidden="true">
        </div>
        <div class="pathable-resource-card__body">
          <a href="#" class="pathable-resource-card__link">
            <h3 class="pathable-resource-card__title">WCAG Compliance Checklist</h3>
          </a>
          <p class="pathable-resource-card__provider">A11y Standards</p>
          <p class="pathable-resource-card__summary">Quick reference guide for meeting WCAG 2.1 AA requirements.</p>
          <p class="pathable-resource-card__metadata">45 pages</p>
        </div>
        <button class="pathable-resource-card__action pathable-icon-button pathable-icon-button--bare"
                aria-label="Save resource">&#9734;</button>
      </div>
      <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive">
        <div class="pathable-resource-card__media">
          <img src="https://placehold.co/300x200/015a76/ffffff?text=Tool" alt="" aria-hidden="true">
        </div>
        <div class="pathable-resource-card__body">
          <a href="#" class="pathable-resource-card__link">
            <h3 class="pathable-resource-card__title">Color Contrast Analyzer</h3>
          </a>
          <p class="pathable-resource-card__provider">Dev Tools</p>
          <p class="pathable-resource-card__summary">Browser extension for checking color contrast ratios in real time.</p>
          <div class="pathable-resource-card__badges">
            <span class="pathable-tag">Tool</span>
          </div>
        </div>
      </div>
    </div>
  `,
}

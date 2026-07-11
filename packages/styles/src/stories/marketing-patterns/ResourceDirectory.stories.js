export default {
  title: 'Marketing Patterns/Resource Directory',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. This page composes search-led hero, guided wayfinder, filter bar, active-filter pills, result count, sorting, resource-card grid, empty-results fallback, and pagination from existing public CSS classes.\n\n**Which archetype to start from**: Choose this archetype for browsable collections of resources with filters and search. Optional patterns include wayfinder guided discovery and empty-state fallbacks. See the discovery pattern documentation for detailed usage.',
      },
    },
  },
}

const searchHeroHtml = `
<section style="padding: 3rem 1rem; background: var(--pathable-color-surface, #f8f9fa);">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-stack pathable-stack--gap-md" style="align-items: center; text-align: center;">
      <h1 style="margin: 0; font-size: 2rem; font-weight: 700;">Find the right resource</h1>
      <p style="margin: 0; font-size: 1.125rem; color: #555; max-width: 480px;">Browse our curated collection of tools, guides, and training materials.</p>
      <form class="pathable-search pathable-search--big" role="search" style="max-width: 500px; width: 100%;">
        <label class="pathable-sr-only" for="dir-search">Search resources</label>
        <input class="pathable-input" id="dir-search" type="search" name="search" placeholder="Search resources...">
        <button class="pathable-button" type="submit">
          <svg class="pathable-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="fill: currentColor;">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span class="pathable-sr-only">Search</span>
        </button>
      </form>
    </div>
  </div>
</section>
`

const wayfinderHtml = `
<section style="padding: 2rem 1rem;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-wayfinder pathable-wayfinder--raised" role="region" aria-label="Find the right resource">
      <svg class="pathable-wayfinder__icon" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" style="fill: var(--pathable-color-accent, #00365c);">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <h2 class="pathable-wayfinder__heading">What are you looking for?</h2>
      <p class="pathable-wayfinder__text">Answer a few questions to narrow down the best resources for your needs.</p>
      <div class="pathable-wayfinder__questions">
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">Who are you helping?</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="audience" value="self"> Myself</label>
            <label><input type="radio" name="audience" value="participant" checked> A participant</label>
            <label><input type="radio" name="audience" value="team"> My team</label>
          </div>
        </fieldset>
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">What type of resource?</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="type" value="guide" checked> Guide</label>
            <label><input type="radio" name="type" value="tool"> Tool</label>
            <label><input type="radio" name="type" value="training"> Training</label>
          </div>
        </fieldset>
      </div>
      <button class="pathable-wayfinder__action pathable-button">Show results</button>
    </div>
  </div>
</section>
`

const filterBarHtml = `
<div class="pathable-container pathable-container--standard">
  <div class="pathable-filter-bar pathable-filter-bar--has-filters" style="margin: 1rem 0;">
    <input class="pathable-filter-bar__search" type="search" placeholder="Filter results...">
    <div class="pathable-filter-bar__facets">
      <select class="pathable-select" aria-label="Category">
        <option value="">All categories</option>
        <option value="case-management">Case Management</option>
        <option value="compliance">Compliance</option>
        <option value="reporting">Reporting</option>
      </select>
    </div>
    <div class="pathable-filter-bar__sort">
      <select class="pathable-select" aria-label="Sort by">
        <option value="relevance">Most relevant</option>
        <option value="newest">Newest first</option>
        <option value="popular">Most popular</option>
      </select>
    </div>
    <div class="pathable-filter-bar__count" role="status" aria-live="polite">12 results</div>
    <div class="pathable-filter-bar__filters">
      <span class="pathable-filter-pill">
        <span class="pathable-filter-pill__label">Category: Case Management</span>
        <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Case Management">&times;</button>
      </span>
      <span class="pathable-filter-pill">
        <span class="pathable-filter-pill__label">Type: Guide</span>
        <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Type: Guide">&times;</button>
      </span>
    </div>
    <button class="pathable-filter-bar__clear">Clear all</button>
  </div>
</div>
`

const resourceCards = [
  {
    title: 'Intake Best Practices Guide',
    provider: 'National Workforce Association',
    summary:
      'A comprehensive guide to conducting effective participant intake sessions.',
    category: 'Case Management',
    image: 'https://placehold.co/400x250/e0e0e0/666666?text=Intake+Guide',
    tags: ['Guide', 'Beginner'],
    updated: '2 days ago',
    rating: '★★★★★',
  },
  {
    title: 'Compliance Checklist Tool',
    provider: 'Dept. of Labor',
    summary:
      'Interactive checklist for ensuring compliance with federal reporting requirements.',
    category: 'Compliance',
    image: 'https://placehold.co/400x250/e0e0e0/666666?text=Compliance+Tool',
    tags: ['Tool', 'Advanced'],
    updated: '1 week ago',
    rating: '★★★★☆',
  },
  {
    title: 'Outcome Tracking Dashboard',
    provider: 'PathAble Learning Center',
    summary:
      'Learn how to set up and customize outcome tracking for your programs.',
    category: 'Reporting',
    image: 'https://placehold.co/400x250/e0e0e0/666666?text=Outcomes+Dashboard',
    tags: ['Training', 'Intermediate'],
    updated: '3 days ago',
    rating: '★★★★★',
  },
  {
    title: 'Participant Engagement Strategies',
    provider: 'Workforce Innovation Network',
    summary:
      'Evidence-based strategies for improving participant engagement and retention.',
    category: 'Case Management',
    image:
      'https://placehold.co/400x250/e0e0e0/666666?text=Engagement+Strategies',
    tags: ['Guide', 'Intermediate'],
    updated: '1 month ago',
    rating: '★★★★☆',
  },
  {
    title: 'Quarterly Reporting Template',
    provider: 'Federal Programs Office',
    summary:
      'Pre-formatted template for quarterly program performance reports.',
    category: 'Reporting',
    image: 'https://placehold.co/400x250/e0e0e0/666666?text=Reporting+Template',
    tags: ['Tool', 'All Levels'],
    updated: '2 weeks ago',
    rating: '★★★★☆',
  },
  {
    title: 'New Case Worker Onboarding',
    provider: 'PathAble Learning Center',
    summary:
      'Self-paced training course covering the fundamentals of case management.',
    category: 'Training',
    image:
      'https://placehold.co/400x250/e0e0e0/666666?text=Onboarding+Training',
    tags: ['Training', 'Beginner'],
    updated: 'Just now',
    rating: '★★★★★',
  },
]

const buildResourceCard = (resource) => `
<div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive">
  <div class="pathable-resource-card__media">
    <img src="${resource.image}" alt="" aria-hidden="true">
  </div>
  <div class="pathable-resource-card__body">
    <a href="#" class="pathable-resource-card__link">
      <h3 class="pathable-resource-card__title">${resource.title}</h3>
    </a>
    <p class="pathable-resource-card__provider">${resource.provider}</p>
    <p class="pathable-resource-card__summary">${resource.summary}</p>
    <div class="pathable-resource-card__badges">
      ${resource.tags.map((tag) => `<span class="pathable-tag">${tag}</span>`).join('')}
    </div>
    <p class="pathable-resource-card__metadata">Updated ${resource.updated}</p>
    <p class="pathable-resource-card__rating">${resource.rating}</p>
  </div>
</div>
`

const populatedResultsHtml = `
<section style="padding: 2rem 1rem;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-card-grid">
      ${resourceCards.map(buildResourceCard).join('')}
    </div>
  </div>
</section>
`

const paginationHtml = `
<section style="padding: 1rem 1rem 3rem;">
  <div class="pathable-container pathable-container--standard">
    <nav class="pathable-pagination" aria-label="Pagination">
      <ul class="pathable-pagination__list">
        <li class="pathable-pagination__item pathable-pagination__arrow">
          <a class="pathable-pagination__link" href="#previous" aria-label="Previous page">
            <svg class="pathable-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="fill: currentColor;">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            <span class="pathable-sr-only">Previous page</span>
          </a>
        </li>
        <li class="pathable-pagination__item">
          <a class="pathable-pagination__link" href="#1" aria-label="Page 1">1</a>
        </li>
        <li class="pathable-pagination__item">
          <a class="pathable-pagination__link" href="#2" aria-label="Page 2">2</a>
        </li>
        <li class="pathable-pagination__item">
          <a class="pathable-pagination__link" href="#3" aria-label="Page 3">3</a>
        </li>
        <li class="pathable-pagination__item pathable-pagination__overflow" aria-label="Ellipsis" role="presentation">
          <span>&hellip;</span>
        </li>
        <li class="pathable-pagination__item pathable-pagination__arrow">
          <a class="pathable-pagination__link" href="#next" aria-label="Next page">
            <svg class="pathable-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="fill: currentColor;">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
            <span class="pathable-sr-only">Next page</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</section>
`

const emptyResultsHtml = `
<section style="padding: 3rem 1rem;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-empty-state pathable-empty-state--no-results">
      <svg class="pathable-empty-state__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" style="fill: #999;">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <h2 class="pathable-empty-state__heading">No matching resources</h2>
      <p class="pathable-empty-state__body">Try adjusting your search terms or removing filters to find what you need.</p>
      <a href="#" class="pathable-empty-state__action pathable-button">Clear all filters</a>
    </div>
  </div>
</section>
`

const populatedPage = `
<main id="main-content">
  ${searchHeroHtml}
  ${wayfinderHtml}
  ${filterBarHtml}
  ${populatedResultsHtml}
  ${paginationHtml}
</main>
`

const emptyPage = `
<main id="main-content">
  ${searchHeroHtml}
  ${wayfinderHtml}
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-filter-bar pathable-filter-bar--has-filters" style="margin: 1rem 0;">
      <input class="pathable-filter-bar__search" type="search" placeholder="Filter results...">
      <div class="pathable-filter-bar__count" role="status" aria-live="polite">0 results</div>
      <div class="pathable-filter-bar__filters">
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Search: "nonexistent resource"</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter">&times;</button>
        </span>
      </div>
      <button class="pathable-filter-bar__clear">Clear all</button>
    </div>
  </div>
  ${emptyResultsHtml}
</main>
`

const mobilePopulatedPage = `
<main id="main-content">
  ${searchHeroHtml}
  <section style="padding: 2rem 1rem;">
    <div class="pathable-wayfinder pathable-wayfinder--raised" role="region" aria-label="Find the right resource">
      <svg class="pathable-wayfinder__icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" style="fill: var(--pathable-color-accent, #00365c);">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <h2 class="pathable-wayfinder__heading">What are you looking for?</h2>
      <p class="pathable-wayfinder__text">Answer a few questions to narrow down resources.</p>
      <div class="pathable-wayfinder__questions">
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">Who are you helping?</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="audience-m" value="self"> Myself</label>
            <label><input type="radio" name="audience-m" value="participant" checked> A participant</label>
          </div>
        </fieldset>
      </div>
      <button class="pathable-wayfinder__action pathable-button">Show results</button>
    </div>
  </section>
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-filter-bar pathable-filter-bar--has-filters" style="margin: 1rem 0;">
      <input class="pathable-filter-bar__search" type="search" placeholder="Filter results...">
      <div class="pathable-filter-bar__count" role="status" aria-live="polite">12 results</div>
    </div>
  </div>
  ${populatedResultsHtml}
  ${paginationHtml}
</main>
`

export const Populated = {
  parameters: {
    docs: {
      description: {
        story:
          'Resource directory showing populated state with search hero, wayfinder guide, active filters, 6 resource cards in a grid, and pagination controls.',
      },
    },
  },
  render: () => populatedPage,
}

export const EmptyResults = {
  parameters: {
    docs: {
      description: {
        story:
          'Resource directory showing the empty-results state with a clear message and suggested action when no resources match the current filters.',
      },
    },
  },
  render: () => emptyPage,
}

export const Mobile = {
  parameters: {
    docs: {
      description: {
        story:
          'Resource directory at mobile viewport (320px). Filter bar collapses, cards go full-width, wayfinder stacks vertically.',
      },
    },
  },
  render: () => mobilePopulatedPage,
}

export const Default = Populated

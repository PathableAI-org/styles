export default {
  title: 'Recipes/Resource Finder',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only. Filter checkboxes and search input are static in this demonstration. ' +
          'Consumers must add JavaScript for live filtering, pagination, and result count updates.\n\n' +
          '**Consumers must**: Import `@pathable/styles` CSS. This recipe composes a search-led page with guided wayfinder, filter sidebar, active filters, result cards in a responsive grid, and pagination from existing public CSS classes.\n\n' +
          '**Accessibility notes**: The search input has a visible `<label>` and `role="search"` on the form. ' +
          'Filter checkboxes in the sidebar use semantic `<input type="checkbox">` with visible labels. ' +
          'Active filter pills have dismiss buttons with accessible names (`aria-label`). ' +
          'The result count uses `role="status"` and `aria-live="polite"` for dynamic updates. ' +
          'Pagination uses `<nav aria-label="Pagination">` with numbered page links. ' +
          'Consumers implementing JavaScript must update `aria-live` regions when filter results change and manage focus when paginating.',
      },
    },
  },
}

/* -------------------------------------------------- */
/* Page Header                                           */
/* -------------------------------------------------- */
const headerHtml = `
<header class="pathable-header pathable-header--basic usa-header usa-header--basic">
  <div class="pathable-nav-container">
    <div class="pathable-navbar">
      <div class="pathable-logo" id="finder-logo">
        <em class="pathable-logo__text">
          <a href="#">PathAble</a>
        </em>
      </div>
      <button class="pathable-menu-btn">Menu</button>
    </div>
    <nav class="pathable-nav usa-nav" aria-label="Primary navigation">
      <ul class="pathable-nav__primary">
        <li class="pathable-nav__primary-item"><a href="#"><span>Dashboard</span></a></li>
        <li class="pathable-nav__primary-item"><a href="#"><span>Resources</span></a></li>
        <li class="pathable-nav__primary-item"><a href="#"><span>Programs</span></a></li>
        <li class="pathable-nav__primary-item"><a href="#"><span>Admin</span></a></li>
      </ul>
    </nav>
  </div>
</header>
`

/* -------------------------------------------------- */
/* Search Hero                                           */
/* -------------------------------------------------- */
const searchHeroHtml = `
<section style="padding:2.5rem 1rem;background-color:var(--pathable-color-bg);">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-stack pathable-stack--gap-md" style="align-items:center;text-align:center;">
      <h1 style="margin:0;font-family:var(--pathable-font-heading);font-size:1.75rem;font-weight:400;color:var(--pathable-color-text);">Resource Library</h1>
      <p style="margin:0;font-size:1rem;color:var(--pathable-color-text-muted);max-width:480px;">Browse tools, guides, training materials, and templates curated for workforce program teams.</p>
      <form class="pathable-search pathable-search--big" role="search" style="max-width:500px;width:100%;">
        <label for="resource-search" class="pathable-sr-only">Search resources</label>
        <input class="pathable-input" id="resource-search" type="search" name="search" placeholder="Search by keyword, topic, or format&hellip;">
        <button class="pathable-button" type="submit">
          <svg class="pathable-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="fill:currentColor;">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span class="pathable-sr-only">Search</span>
        </button>
      </form>
    </div>
  </div>
</section>
`

/* -------------------------------------------------- */
/* Wayfinder filter bar                                  */
/* -------------------------------------------------- */
const wayfinderHtml = `
<section style="padding:1.5rem 1rem 0;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-wayfinder pathable-wayfinder--raised" role="region" aria-label="Refine your search">
      <svg class="pathable-wayfinder__icon" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" style="fill:var(--pathable-color-accent);">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
      </svg>
      <h2 class="pathable-wayfinder__heading">Narrow your results</h2>
      <p class="pathable-wayfinder__text">Use the filters below or the sidebar to find the right resources for your team.</p>
      <div class="pathable-wayfinder__questions">
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">Resource type</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="res-type" value="all" checked> All types</label>
            <label><input type="radio" name="res-type" value="guide"> Guides</label>
            <label><input type="radio" name="res-type" value="tool"> Tools &amp; Templates</label>
            <label><input type="radio" name="res-type" value="training"> Training</label>
          </div>
        </fieldset>
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">Experience level</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="level" value="all" checked> All levels</label>
            <label><input type="radio" name="level" value="beginner"> Beginner</label>
            <label><input type="radio" name="level" value="intermediate"> Intermediate</label>
            <label><input type="radio" name="level" value="advanced"> Advanced</label>
          </div>
        </fieldset>
      </div>
      <button class="pathable-wayfinder__action pathable-button">Apply filters</button>
    </div>
  </div>
</section>
`

/* -------------------------------------------------- */
/* Sidebar Filters                                       */
/* -------------------------------------------------- */
const sidebarFiltersHtml = `
<aside style="min-width:0;">
  <div class="pathable-surface pathable-surface--inset" style="padding:1.25rem;">
    <p style="margin:0 0 1rem;font-family:var(--pathable-font-subheading);font-size:1rem;font-weight:700;color:var(--pathable-color-text);">Filter By</p>
    <div class="pathable-stack pathable-stack--gap-md">
      <fieldset class="pathable-fieldset" style="border:none;padding:0;margin:0;">
        <legend style="font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);margin-bottom:0.5rem;">Category</legend>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox" checked> Case Management</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> Compliance</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox" checked> Reporting</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> Training</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> Employment</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> Disability Support</label></li>
        </ul>
      </fieldset>
      <fieldset class="pathable-fieldset" style="border:none;padding:0;margin:0;">
        <legend style="font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);margin-bottom:0.5rem;">Format</legend>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> PDF Guide</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox" checked> Template</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> Video</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox" checked> Interactive Tool</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> Webinar</label></li>
        </ul>
      </fieldset>
      <fieldset class="pathable-fieldset" style="border:none;padding:0;margin:0;">
        <legend style="font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);margin-bottom:0.5rem;">Provider</legend>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox" checked> PathAble</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> Federal Programs</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox" checked> Workforce Network</label></li>
          <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.875rem;"><input type="checkbox" class="pathable-checkbox"> State Agency</label></li>
        </ul>
      </fieldset>
    </div>
  </div>
</aside>
`

/* -------------------------------------------------- */
/* Active Filters and Results Bar                        */
/* -------------------------------------------------- */
const resultsBarHtml = `
<div class="pathable-filter-bar pathable-filter-bar--has-filters" style="margin-bottom:1rem;">
  <div class="pathable-filter-bar__count" role="status" aria-live="polite">8 results</div>
  <div class="pathable-filter-bar__sort">
    <label for="sort-results" class="pathable-sr-only">Sort by</label>
    <select id="sort-results" class="pathable-select">
      <option value="relevance">Most relevant</option>
      <option value="newest">Newest first</option>
      <option value="popular">Most popular</option>
    </select>
  </div>
  <div class="pathable-filter-bar__filters">
    <span class="pathable-filter-pill">
      <span class="pathable-filter-pill__label">Category: Case Management</span>
      <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Case Management">&times;</button>
    </span>
    <span class="pathable-filter-pill">
      <span class="pathable-filter-pill__label">Category: Reporting</span>
      <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Reporting">&times;</button>
    </span>
    <span class="pathable-filter-pill">
      <span class="pathable-filter-pill__label">Format: Template</span>
      <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Format: Template">&times;</button>
    </span>
  </div>
  <button class="pathable-filter-bar__clear">Clear all filters</button>
</div>
`

/* -------------------------------------------------- */
/* Resource Cards                                        */
/* -------------------------------------------------- */
const resources = [
  {
    title: 'Intake Best Practices Guide',
    provider: 'National Workforce Association',
    summary:
      'A comprehensive guide to conducting effective participant intake sessions with sample scripts and checklists.',
    tags: ['Guide', 'Beginner'],
    updated: '2 days ago',
  },
  {
    title: 'Compliance Checklist Tool',
    provider: 'Dept. of Labor',
    summary:
      'Interactive checklist for ensuring compliance with federal reporting requirements. Updated for 2026 standards.',
    tags: ['Tool', 'Advanced'],
    updated: '1 week ago',
  },
  {
    title: 'Outcome Tracking Dashboard',
    provider: 'PathAble Learning Center',
    summary:
      'Learn how to set up and customize outcome tracking dashboards for your programs.',
    tags: ['Training', 'Intermediate'],
    updated: '3 days ago',
  },
  {
    title: 'Participant Engagement Strategies',
    provider: 'Workforce Innovation Network',
    summary:
      'Evidence-based strategies for improving participant engagement and program retention.',
    tags: ['Guide', 'Intermediate'],
    updated: '1 month ago',
  },
  {
    title: 'Quarterly Reporting Template',
    provider: 'Federal Programs Office',
    summary:
      'Pre-formatted template for quarterly program performance reports with automated calculations.',
    tags: ['Template', 'All Levels'],
    updated: '2 weeks ago',
  },
  {
    title: 'New Case Worker Onboarding',
    provider: 'PathAble Learning Center',
    summary:
      'Self-paced training course covering the fundamentals of case management in workforce programs.',
    tags: ['Training', 'Beginner'],
    updated: 'Just now',
  },
  {
    title: 'Employment Plan Builder',
    provider: 'PathAble',
    summary:
      'Step-by-step tool for creating individualized employment plans with SMART goal tracking.',
    tags: ['Tool', 'Intermediate'],
    updated: '5 days ago',
  },
  {
    title: 'Disability Accommodation Guide',
    provider: 'Workforce Innovation Network',
    summary:
      'Best practices for workplace accommodation assessments and reasonable accommodation documentation.',
    tags: ['Guide', 'Advanced'],
    updated: '1 month ago',
  },
]

const buildResourceCard = (r) => `
<div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive" style="display:flex;flex-direction:column;">
  <div class="pathable-resource-card__body" style="flex:1;">
    <a href="#" class="pathable-resource-card__link">
      <h3 class="pathable-resource-card__title" style="font-family:var(--pathable-font-subheading);font-weight:700;">${r.title}</h3>
    </a>
    <p class="pathable-resource-card__provider">${r.provider}</p>
    <p class="pathable-resource-card__summary">${r.summary}</p>
    <div class="pathable-resource-card__badges">
      ${r.tags.map((t) => `<span class="pathable-tag">${t}</span>`).join('')}
    </div>
    <p class="pathable-resource-card__metadata" style="font-size:0.75rem;">Updated ${r.updated}</p>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Empty Results                                         */
/* -------------------------------------------------- */
const emptyResultsHtml = `
<div class="pathable-empty-state pathable-empty-state--no-results" style="padding:3rem 1rem;">
  <svg class="pathable-empty-state__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" style="fill:var(--pathable-color-text-muted);">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
  <h2 class="pathable-empty-state__heading">No matching resources</h2>
  <p class="pathable-empty-state__body">Try adjusting your search terms or removing some filters to find what you need.</p>
  <a href="#" class="pathable-empty-state__action pathable-button">Clear all filters</a>
</div>
`

/* -------------------------------------------------- */
/* Pagination                                            */
/* -------------------------------------------------- */
const paginationHtml = `
<nav class="pathable-pagination" aria-label="Pagination" style="margin-top:2rem;">
  <ul class="pathable-pagination__list">
    <li class="pathable-pagination__item pathable-pagination__arrow">
      <span class="pathable-pagination__link" aria-disabled="true" aria-label="Previous page — disabled">
        <svg class="pathable-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="fill:currentColor;">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
        <span class="pathable-sr-only">Previous page</span>
      </span>
    </li>
    <li class="pathable-pagination__item"><a class="pathable-pagination__link pathable-pagination__link--current" href="#1" aria-label="Page 1" aria-current="page">1</a></li>
    <li class="pathable-pagination__item"><a class="pathable-pagination__link" href="#2" aria-label="Page 2">2</a></li>
    <li class="pathable-pagination__item"><a class="pathable-pagination__link" href="#3" aria-label="Page 3">3</a></li>
    <li class="pathable-pagination__item pathable-pagination__arrow">
      <a class="pathable-pagination__link" href="#next" aria-label="Next page">
        <svg class="pathable-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="fill:currentColor;">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
        <span class="pathable-sr-only">Next page</span>
      </a>
    </li>
  </ul>
</nav>
`

/* -------------------------------------------------- */
/* Pages                                                 */
/* -------------------------------------------------- */
const populatedPage = `
${headerHtml}
<main id="main-content">
  ${searchHeroHtml}
  ${wayfinderHtml}
  <section style="padding:1.5rem 1rem 3rem;">
    <div class="pathable-container pathable-container--standard">
      <div class="pathable-sidebar-layout">
        ${sidebarFiltersHtml}
        <div style="min-width:0;">
          ${resultsBarHtml}
          <div class="pathable-card-grid">
            ${resources.map(buildResourceCard).join('')}
          </div>
          ${paginationHtml}
        </div>
      </div>
    </div>
  </section>
</main>
`

const emptyPage = `
${headerHtml}
<main id="main-content">
  ${searchHeroHtml}
  <section style="padding:1.5rem 1rem 3rem;">
    <div class="pathable-container pathable-container--standard">
      <div class="pathable-sidebar-layout">
        ${sidebarFiltersHtml}
        <div style="min-width:0;">
          <div class="pathable-filter-bar pathable-filter-bar--has-filters" style="margin-bottom:1rem;">
            <div class="pathable-filter-bar__count" role="status" aria-live="polite">0 results</div>
            <div class="pathable-filter-bar__filters">
              <span class="pathable-filter-pill">
                <span class="pathable-filter-pill__label">Search: "nonexistent query"</span>
                <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Search">&times;</button>
              </span>
            </div>
            <button class="pathable-filter-bar__clear">Clear all</button>
          </div>
          ${emptyResultsHtml}
        </div>
      </div>
    </div>
  </section>
</main>
`

const mobilePage = `
${headerHtml}
<main id="main-content">
  ${searchHeroHtml}
  <section style="padding:1.25rem 1rem 0;">
    <div class="pathable-wayfinder pathable-wayfinder--raised" role="region" aria-label="Refine your search">
      <svg class="pathable-wayfinder__icon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" style="fill:var(--pathable-color-accent);">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
      </svg>
      <h2 class="pathable-wayfinder__heading">Narrow your results</h2>
      <div class="pathable-wayfinder__questions">
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">Resource type</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="mobile-type" value="all" checked> All types</label>
            <label><input type="radio" name="mobile-type" value="guide"> Guides</label>
            <label><input type="radio" name="mobile-type" value="tool"> Tools</label>
          </div>
        </fieldset>
      </div>
      <button class="pathable-wayfinder__action pathable-button">Apply filters</button>
    </div>
  </section>
  <section style="padding:1.25rem 1rem 3rem;">
    <div class="pathable-container pathable-container--standard">
      <div class="pathable-filter-bar pathable-filter-bar--has-filters" style="margin-bottom:1rem;">
        <div class="pathable-filter-bar__count" role="status" aria-live="polite">8 results</div>
        <div class="pathable-filter-bar__filters">
          <span class="pathable-filter-pill">
            <span class="pathable-filter-pill__label">Case Management</span>
            <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Case Management">&times;</button>
          </span>
          <span class="pathable-filter-pill">
            <span class="pathable-filter-pill__label">Template</span>
            <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Template">&times;</button>
          </span>
        </div>
      </div>
      <div class="pathable-card-grid">
        ${resources.slice(0, 4).map(buildResourceCard).join('')}
      </div>
      ${paginationHtml}
    </div>
  </section>
</main>
`

/* -------------------------------------------------- */
/* Exports                                               */
/* -------------------------------------------------- */
export const Populated = {
  parameters: {
    docs: {
      description: {
        story:
          'Resource finder showing populated state. Left sidebar with category/format/provider filters. Main area shows active filter pills, result count, sort control, 8 resource cards in a responsive grid, and pagination.',
      },
    },
  },
  render: () => populatedPage,
}

export const Empty = {
  parameters: {
    docs: {
      description: {
        story:
          'Resource finder showing empty results state when no resources match the current filters. Displays a helpful message with a clear "Clear all filters" action.',
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
          'Resource finder at mobile viewport (375px). Sidebar collapses below main content. Wayfinder collapses to single question. Filter pills wrap. Resource cards go full-width. Pagination aligns center.',
      },
    },
  },
  render: () => mobilePage,
}

export const Default = Populated

export default {
  title: 'Discovery/Filter Bar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. The filter bar uses `.pathable-filter-bar` with child regions. Active filters use `.pathable-filter-pill` inside the `.pathable-filter-bar__filters` region.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-filter-bar">
      <input class="pathable-filter-bar__search" type="search" placeholder="Search resources...">
      <div class="pathable-filter-bar__facets">
        <select aria-label="Category">
          <option>All categories</option>
          <option>Training</option>
          <option>Assessment</option>
          <option>Support</option>
        </select>
      </div>
      <div class="pathable-filter-bar__sort">
        <select aria-label="Sort by">
          <option>Most relevant</option>
          <option>Newest</option>
          <option>Name A-Z</option>
        </select>
      </div>
      <div class="pathable-filter-bar__count" role="status" aria-live="polite">12 results</div>
    </div>
  `,
}

export const HasFilters = {
  render: () => `
    <div class="pathable-filter-bar pathable-filter-bar--has-filters">
      <input class="pathable-filter-bar__search" type="search" placeholder="Search resources...">
      <div class="pathable-filter-bar__facets">
        <select aria-label="Category">
          <option>All categories</option>
          <option selected>Training</option>
        </select>
      </div>
      <div class="pathable-filter-bar__sort">
        <select aria-label="Sort by">
          <option>Most relevant</option>
          <option>Newest</option>
        </select>
      </div>
      <div class="pathable-filter-bar__count" role="status" aria-live="polite">4 results</div>
      <div class="pathable-filter-bar__filters">
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Category: Training</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Training">&times;</button>
        </span>
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Status: Active</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Status: Active">&times;</button>
        </span>
      </div>
      <button class="pathable-filter-bar__clear">Clear all</button>
    </div>
  `,
}

export const DrawerMode = {
  render: () => `
    <div class="pathable-filter-bar pathable-filter-bar--drawer-mode pathable-filter-bar--has-filters">
      <input class="pathable-filter-bar__search" type="search" placeholder="Search...">
      <div class="pathable-filter-bar__count" role="status" aria-live="polite">4 results</div>
      <button class="pathable-filter-bar__drawer-trigger" aria-label="Open filters">Filters</button>
      <div class="pathable-filter-bar__filters">
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Category: Training</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Training">&times;</button>
        </span>
      </div>
    </div>
  `,
}

export const Wrapped = {
  render: () => `
    <div class="pathable-filter-bar pathable-filter-bar--has-filters" style="max-width: 500px;">
      <input class="pathable-filter-bar__search" type="search" placeholder="Search..." value="accessibility">
      <div class="pathable-filter-bar__count" role="status" aria-live="polite">8 results</div>
      <div class="pathable-filter-bar__filters">
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Category: Training</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Training">&times;</button>
        </span>
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Status: Active</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Status: Active">&times;</button>
        </span>
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Provider: PathAble</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Provider: PathAble">&times;</button>
        </span>
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Level: Beginner</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Level: Beginner">&times;</button>
        </span>
        <span class="pathable-filter-pill">
          <span class="pathable-filter-pill__label">Format: Video</span>
          <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Format: Video">&times;</button>
        </span>
      </div>
      <button class="pathable-filter-bar__clear">Clear all</button>
    </div>
  `,
}

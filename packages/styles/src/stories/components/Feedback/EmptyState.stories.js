export default {
  title: 'Components/Feedback/EmptyState',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Render the appropriate variant when a view has no content to display.',
      },
    },
  },
}

export const NoData = {
  render: () => `
    <div class="pathable-empty-state pathable-empty-state--no-data">
      <svg class="pathable-empty-state__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
        <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-2h2v10h-2z"/>
      </svg>
      <h2 class="pathable-empty-state__heading">No data yet</h2>
      <p class="pathable-empty-state__body">Data will appear here once it becomes available. Get started by adding your first item.</p>
      <a href="#" class="pathable-empty-state__action pathable-button">Add your first item</a>
    </div>
  `,
}

export const NoResults = {
  render: () => `
    <div class="pathable-empty-state pathable-empty-state--no-results">
      <svg class="pathable-empty-state__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <h2 class="pathable-empty-state__heading">No matching results</h2>
      <p class="pathable-empty-state__body">Try adjusting your search terms or filters to find what you're looking for.</p>
      <a href="#" class="pathable-empty-state__action pathable-button">Clear all filters</a>
    </div>
  `,
}

export const SetupRequired = {
  render: () => `
    <div class="pathable-empty-state pathable-empty-state--setup-required">
      <svg class="pathable-empty-state__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
        <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M11 9h2V7h-2v2z"/>
      </svg>
      <h2 class="pathable-empty-state__heading">Setup required</h2>
      <p class="pathable-empty-state__body">Complete the initial setup to start using this feature.</p>
      <a href="#" class="pathable-empty-state__action pathable-button">Begin setup</a>
    </div>
  `,
}

export const Completed = {
  render: () => `
    <div class="pathable-empty-state pathable-empty-state--completed">
      <svg class="pathable-empty-state__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <h2 class="pathable-empty-state__heading">All caught up</h2>
      <p class="pathable-empty-state__body">You have completed all items. There is nothing left to review.</p>
    </div>
  `,
}

export const Mobile = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => `
    <div class="pathable-empty-state pathable-empty-state--no-results">
      <svg class="pathable-empty-state__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <h2 class="pathable-empty-state__heading">No results</h2>
      <p class="pathable-empty-state__body">Try adjusting your search.</p>
      <a href="#" class="pathable-empty-state__action pathable-button">Clear filters</a>
    </div>
  `,
}

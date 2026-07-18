export default {
  title: 'Components/Navigation/Search',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: Requires USWDS JS\n**USWDS JS Behaviors**: form submission, keyboard navigation\n**Consumers must**: Import `@pathable/styles/js` to enable interactive behavior.',
      },
    },
  },
}

export const Default = {
  render: () => `
<form class="pathable-search" role="search">
  <label class="pathable-sr-only" for="search-field-default">Search</label>
  <input
    class="pathable-input"
    id="search-field-default"
    type="search"
    name="search"
    placeholder="Search"
  />
  <button class="pathable-button" type="submit">
    <svg class="pathable-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
    <span class="pathable-sr-only">Search</span>
  </button>
</form>
  `,
}

export const Big = {
  render: () => `
<form class="pathable-search pathable-search--big" role="search">
  <label class="pathable-sr-only" for="search-field-big">Search</label>
  <input
    class="pathable-input"
    id="search-field-big"
    type="search"
    name="search"
    placeholder="Search"
  />
  <button class="pathable-button" type="submit">
    <svg class="pathable-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
    Search
  </button>
</form>
  `,
}

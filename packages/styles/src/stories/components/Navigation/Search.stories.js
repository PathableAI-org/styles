export default {
  title: 'Components/Navigation/Search',
  tags: ['autodocs'],
};

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
    <span class="pathable-sr-only">Search</span>
  </button>
</form>
  `,
};

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
    Search
  </button>
</form>
  `,
};
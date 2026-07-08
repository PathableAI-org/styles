export default {
  title: 'Components/Form Controls/Input',
  tags: ['autodocs'],
};

export const Text = {
  render: () => `
<label class="pathable-label" for="input-text">Text input</label>
<input
  id="input-text"
  class="pathable-input pathable-input--text"
  type="text"
  placeholder="Enter text"
/>
  `,
};

export const Password = {
  render: () => `
<label class="pathable-label" for="input-password">Password</label>
<input
  id="input-password"
  class="pathable-input pathable-input--password"
  type="password"
  placeholder="Enter password"
/>
  `,
};

export const Email = {
  render: () => `
<label class="pathable-label" for="input-email">Email address</label>
<input
  id="input-email"
  class="pathable-input pathable-input--email"
  type="email"
  placeholder="you@example.com"
/>
  `,
};

export const Search = {
  render: () => `
<label class="pathable-label" for="input-search">Search</label>
<input
  id="input-search"
  class="pathable-input pathable-input--search"
  type="search"
  placeholder="Search…"
/>
  `,
};
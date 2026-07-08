export default {
  title: 'Components/Button Group',
  tags: ['autodocs'],
};

export const Default = {
  render: () => `
    <div class="pathable-button-group">
      <button class="pathable-button pathable-button--outline">Option One</button>
      <button class="pathable-button pathable-button--outline">Option Two</button>
      <button class="pathable-button pathable-button--outline">Option Three</button>
    </div>
  `,
};

export const Segmented = {
  render: () => `
    <div class="pathable-button-group pathable-button-group--segmented">
      <button class="pathable-button pathable-button--outline">Option One</button>
      <button class="pathable-button pathable-button--outline">Option Two</button>
      <button class="pathable-button pathable-button--outline">Option Three</button>
    </div>
  `,
};
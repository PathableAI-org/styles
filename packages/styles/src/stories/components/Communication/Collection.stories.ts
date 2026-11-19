export default {
  title: 'Components/Communication/Collection',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.\n\n**CSS markup**: Requires `.pathable-collection`, `.pathable-collection__item`, `.pathable-collection__body` and `.pathable-collection__heading`. The heading is set in the brand heading typeface, Fredoka Regular.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <ul class="pathable-collection">
      <li class="pathable-collection__item">
        <div class="pathable-collection__body">
          <h3 class="pathable-collection__heading">Preparing for your first appointment</h3>
          <p class="pathable-collection__description">What to bring and what to expect when you arrive.</p>
          <ul class="pathable-collection__meta">
            <li>Guide</li>
          </ul>
        </div>
      </li>
      <li class="pathable-collection__item">
        <div class="pathable-collection__body">
          <h3 class="pathable-collection__heading">Understanding your accommodations</h3>
          <p class="pathable-collection__description">How accommodations are requested, reviewed and approved.</p>
          <ul class="pathable-collection__meta">
            <li>Article</li>
          </ul>
        </div>
      </li>
    </ul>
  `,
}

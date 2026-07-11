export default {
  title: 'Discovery/Filter Pill',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Each pill uses `.pathable-filter-pill` with a label and a dismiss button with `aria-label`.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <span class="pathable-filter-pill">
      <span class="pathable-filter-pill__label">Category: Training</span>
      <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Training">&times;</button>
    </span>
  `,
}

export const Multiple = {
  render: () => `
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
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
    </div>
  `,
}

export default {
  title: 'Components/Form Controls/Combo Box',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathable/styles/js` to enable interactive behavior.\n\n**Interaction Model**: Requires USWDS JS\n**USWDS JS Behaviors**: Typeahead filtering, dropdown open/close, keyboard navigation (arrows, Escape), ARIA live region\n**Consumers must**: Import `@pathable/styles/js` to enable interactive behavior.',
      },
    },
  },
}

export const Default = {
  render: () => `
<div class="pathable-combo-box">
  <select class="pathable-select">
    <option>Goal Setting</option>
    <option>Skills Assessment</option>
    <option>Job Placement</option>
  </select>
</div>
  `,
}

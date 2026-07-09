export default {
  title: 'Components/Form Controls/Date Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathable/styles/js` to enable interactive behavior.',
      },
    },
  },
}

export const Default = {
  render: () => `
<div class="pathable-date-picker">
  <label class="pathable-label" for="date-picker-example">Date</label>
  <div class="pathable-date-picker__wrapper">
    <input
      id="date-picker-example"
      class="pathable-input pathable-input--date"
      type="text"
      pattern="\\d{4}-\\d{2}-\\d{2}"
      placeholder="YYYY-MM-DD"
    />
  </div>
</div>
  `,
}

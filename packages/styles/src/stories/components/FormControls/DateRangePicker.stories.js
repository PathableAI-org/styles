export default {
  title: 'Components/Form Controls/Date Range Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** This component requires USWDS JavaScript for full interactivity. The examples below show static CSS styling only.',
      },
    },
  },
}

export const Default = {
  render: () => `
<div class="pathable-date-range-picker">
  <div class="pathable-date-range-picker__inputs">
    <div class="pathable-date-range-picker__start">
      <label class="pathable-label" for="drp-start">Start date</label>
      <input
        id="drp-start"
        class="pathable-input pathable-input--date"
        type="text"
        pattern="\\d{4}-\\d{2}-\\d{2}"
        placeholder="YYYY-MM-DD"
      />
    </div>
    <div class="pathable-date-range-picker__end">
      <label class="pathable-label" for="drp-end">End date</label>
      <input
        id="drp-end"
        class="pathable-input pathable-input--date"
        type="text"
        pattern="\\d{4}-\\d{2}-\\d{2}"
        placeholder="YYYY-MM-DD"
      />
    </div>
  </div>
</div>
  `,
}

export default {
  title: 'Components/Form Controls/Date Range Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathable/styles/js` to enable interactive behavior.\n\n**Interaction Model**: Requires USWDS JS\n**USWDS JS Behaviors**: Dual calendar, range selection, keyboard navigation\n**Consumers must**: Import `@pathable/styles/js` to enable interactive behavior.',
      },
    },
  },
}

export const Default = {
  render: () => `
<div class="pathable-date-range-picker usa-date-range-picker">
  <div class="pathable-date-picker usa-date-picker pathable-date-range-picker__range-start usa-date-range-picker__range-start">
      <label class="pathable-label" for="drp-start">Start date</label>
        <input id="drp-start" class="pathable-input pathable-input--date" type="text" name="startDate" pattern="\\d{2}\\/\\d{2}\\/\\d{4}" placeholder="MM/DD/YYYY" />
  </div>
  <div class="pathable-date-picker usa-date-picker pathable-date-range-picker__range-end usa-date-range-picker__range-end">
      <label class="pathable-label" for="drp-end">End date</label>
        <input id="drp-end" class="pathable-input pathable-input--date" type="text" name="endDate" pattern="\\d{2}\\/\\d{2}\\/\\d{4}" placeholder="MM/DD/YYYY" />
  </div>
</div>
  `,
}

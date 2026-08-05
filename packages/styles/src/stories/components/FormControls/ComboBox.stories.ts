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
<label for="employment-goal">Employment goal</label>
<div class="pathable-combo-box">
  <select class="pathable-select" id="employment-goal" name="employmentGoal">
    <option value="goal-setting">Goal Setting</option>
    <option value="skills-assessment">Skills Assessment</option>
    <option value="job-placement">Job Placement</option>
  </select>
</div>
  `,
}

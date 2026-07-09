export default {
  title: 'Components/Form Controls/Checkbox',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
<label class="pathable-checkbox">
  <input type="checkbox" class="pathable-checkbox__input" />
  <span class="pathable-checkbox__label">Checkbox label</span>
</label>
  `,
}

export const Tile = {
  render: () => `
<label class="pathable-checkbox pathable-checkbox--tile">
  <input type="checkbox" class="pathable-checkbox__input" />
  <span class="pathable-checkbox__label">Tile checkbox label</span>
</label>
  `,
}

export const WorkflowCoachingSupports = {
  render: () => `
<form class="pathable-form">
  <fieldset class="pathable-fieldset">
    <legend class="pathable-legend">Coaching Supports Addressed</legend>
    <span class="pathable-hint">Select all supports addressed in this session.</span>
    <ul class="pathable-checkbox__list">
      <li>
        <input type="checkbox" id="support-job-readiness" class="pathable-checkbox" checked />
        <label for="support-job-readiness">Job readiness practice</label>
      </li>
      <li>
        <input type="checkbox" id="support-workplace" class="pathable-checkbox" checked />
        <label for="support-workplace">Workplace communication</label>
      </li>
      <li>
        <input type="checkbox" id="support-employer" class="pathable-checkbox" />
        <label for="support-employer">Employer follow-up</label>
      </li>
      <li>
        <input type="checkbox" id="support-transportation" class="pathable-checkbox" />
        <label for="support-transportation">Transportation planning</label>
      </li>
    </ul>
  </fieldset>
</form>
  `,
}
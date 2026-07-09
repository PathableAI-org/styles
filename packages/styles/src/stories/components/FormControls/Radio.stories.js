export default {
  title: 'Components/Form Controls/Radio',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
<fieldset class="pathable-fieldset">
  <legend class="pathable-legend">Radio group</legend>
  <ul class="pathable-radio__list usa-radio__list">
    <li>
      <input type="radio" id="radio-1" name="radio-group" class="pathable-radio" checked />
      <label for="radio-1">Radio 1</label>
    </li>
    <li>
      <input type="radio" id="radio-2" name="radio-group" class="pathable-radio" />
      <label for="radio-2">Radio 2</label>
    </li>
    <li>
      <input type="radio" id="radio-3" name="radio-group" class="pathable-radio" />
      <label for="radio-3">Radio 3</label>
    </li>
  </ul>
</fieldset>
  `,
}

export const WorkflowProgressSignal = {
  render: () => `
<form class="pathable-form">
  <fieldset class="pathable-fieldset">
    <legend class="pathable-legend">Progress Signal</legend>
    <span class="pathable-hint">Rate the participant's progress since the last session.</span>
    <ul class="pathable-radio__list usa-radio__list">
      <li>
        <input type="radio" id="progress-significant" name="progress" class="pathable-radio" />
        <label for="progress-significant">Significant progress — Goals are being exceeded</label>
      </li>
      <li>
        <input type="radio" id="progress-moderate" name="progress" class="pathable-radio" checked />
        <label for="progress-moderate">Moderate progress — Goals are on track</label>
      </li>
      <li>
        <input type="radio" id="progress-none" name="progress" class="pathable-radio" />
        <label for="progress-none">No change — Goals need reassessment</label>
      </li>
      <li>
        <input type="radio" id="progress-adjustment" name="progress" class="pathable-radio" />
        <label for="progress-adjustment">Needs adjustment — Goals or approach should be revised</label>
      </li>
    </ul>
  </fieldset>
</form>
  `,
}

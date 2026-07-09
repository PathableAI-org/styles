export default {
  title: 'Components/Form Controls/Radio',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
<label class="pathable-radio">
  <input type="radio" name="radio-group" class="pathable-radio__input" />
  <span class="pathable-radio__label">Radio label</span>
</label>
<label class="pathable-radio">
  <input type="radio" name="radio-group" class="pathable-radio__input" />
  <span class="pathable-radio__label">Radio label</span>
</label>
  `,
}

export const Tile = {
  render: () => `
<label class="pathable-radio pathable-radio--tile">
  <input type="radio" name="radio-tile-group" class="pathable-radio__input" />
  <span class="pathable-radio__label">Tile radio label</span>
</label>
<label class="pathable-radio pathable-radio--tile">
  <input type="radio" name="radio-tile-group" class="pathable-radio__input" />
  <span class="pathable-radio__label">Tile radio label</span>
</label>
  `,
}

export const WorkflowProgressSignal = {
  render: () => `
<form class="pathable-form">
  <fieldset class="pathable-fieldset">
    <legend class="pathable-legend">Employment Goal Progress</legend>
    <span class="pathable-hint">Rate the participant's progress toward their employment goal since the last session.</span>
    <ul class="pathable-radio__list">
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
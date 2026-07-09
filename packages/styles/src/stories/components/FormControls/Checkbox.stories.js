export default {
  title: 'Components/Form Controls/Checkbox',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
<fieldset class="pathable-fieldset">
  <legend class="pathable-legend">Checkbox group</legend>
  <ul class="pathable-checkbox__list usa-checkbox__list">
    <li>
      <input type="checkbox" id="checkbox-1" class="pathable-checkbox" checked />
      <label for="checkbox-1">Checkbox 1</label>
    </li>
    <li>
      <input type="checkbox" id="checkbox-2" class="pathable-checkbox" />
      <label for="checkbox-2">Checkbox 2</label>
    </li>
    <li>
      <input type="checkbox" id="checkbox-3" class="pathable-checkbox" />
      <label for="checkbox-3">Checkbox 3</label>
    </li>
  </ul>
</fieldset>
  `,
}

export const WorkflowInterventionChecklist = {
  render: () => `
<form class="pathable-form">
  <fieldset class="pathable-fieldset">
    <legend class="pathable-legend">Intervention Checklist</legend>
    <span class="pathable-hint">Select all interventions addressed in this session.</span>
    <ul class="pathable-checkbox__list usa-checkbox__list">
      <li>
        <input type="checkbox" id="intervention-cbt" class="pathable-checkbox" checked />
        <label for="intervention-cbt">CBT exercise — Cognitive restructuring</label>
      </li>
      <li>
        <input type="checkbox" id="intervention-mindfulness" class="pathable-checkbox" checked />
        <label for="intervention-mindfulness">Mindfulness practice — Guided breathing</label>
      </li>
      <li>
        <input type="checkbox" id="intervention-tracking" class="pathable-checkbox" />
        <label for="intervention-tracking">Behavior tracking — Mood journal review</label>
      </li>
      <li>
        <input type="checkbox" id="intervention-exposure" class="pathable-checkbox" />
        <label for="intervention-exposure">Exposure therapy — Gradual exposure planning</label>
      </li>
    </ul>
  </fieldset>
</form>
  `,
}
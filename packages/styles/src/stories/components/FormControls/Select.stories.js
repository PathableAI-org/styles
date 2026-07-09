export default {
  title: 'Components/Form Controls/Select',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
<label class="pathable-label" for="select-default">Select an option</label>
<select id="select-default" class="pathable-select">
  <option value>- Select -</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</select>
  `,
}

export const WorkflowParticipantGoal = {
  render: () => `
<form class="pathable-form">
  <label class="pathable-label" for="participant-goal">Participant Goal</label>
  <span class="pathable-hint" id="participant-goal-hint">
    Select the primary goal for this session.
  </span>
  <select id="participant-goal" class="pathable-select" aria-describedby="participant-goal-hint">
    <option value>- Select a goal -</option>
    <option value="communication">Improve communication skills</option>
    <option value="anxiety">Reduce anxiety symptoms</option>
    <option value="routines">Build daily routines</option>
    <option value="social">Develop social connections</option>
    <option value="coping">Strengthen coping strategies</option>
  </select>
</form>
  `,
}
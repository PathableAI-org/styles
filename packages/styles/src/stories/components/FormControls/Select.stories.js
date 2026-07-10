export default {
  title: 'Components/Form Controls/Select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n**App State to Manage**: selected value, validation errors\n**Consumers must**: Provide value and validation logic in application framework.',
      },
    },
  },
}

export const Default = {
  render: () => `
<label class="pathable-label" for="select-default">Select an option</label>
<select id="select-default" class="pathable-select">
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
</select>
  `,
}

export const Multiple = {
  render: () => `
<label class="pathable-label" for="select-multiple">Select multiple options</label>
<select id="select-multiple" class="pathable-select" multiple size="4">
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
  <option>Option 4</option>
</select>
  `,
}

export const WorkflowParticipantGoal = {
  render: () => `
<form class="pathable-form">
  <label class="pathable-label" for="participant-goal">Employment Goal</label>
  <span class="pathable-hint" id="participant-goal-hint">
    Select the primary employment goal for this session.
  </span>
  <select id="participant-goal" class="pathable-select" aria-describedby="participant-goal-hint">
    <option value>- Select a goal -</option>
    <option value="job-search">Job search skills</option>
    <option value="interview">Interview preparation</option>
    <option value="workplace">Workplace communication</option>
    <option value="transportation">Transportation planning</option>
    <option value="accommodation">Workplace accommodation discussion</option>
  </select>
</form>
  `,
}

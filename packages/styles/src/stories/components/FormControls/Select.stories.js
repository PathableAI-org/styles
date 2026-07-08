export default {
  title: 'Components/Form Controls/Select',
  tags: ['autodocs'],
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

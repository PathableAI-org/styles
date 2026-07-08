export default {
  title: 'Components/Form Controls/Checkbox',
  tags: ['autodocs'],
};

export const Default = {
  render: () => `
<label class="pathable-checkbox">
  <input type="checkbox" class="pathable-checkbox__input" />
  <span class="pathable-checkbox__label">Checkbox label</span>
</label>
  `,
};

export const Tile = {
  render: () => `
<label class="pathable-checkbox pathable-checkbox--tile">
  <input type="checkbox" class="pathable-checkbox__input" />
  <span class="pathable-checkbox__label">Tile checkbox label</span>
</label>
  `,
};
export default {
  title: 'Components/Form Controls/Radio',
  tags: ['autodocs'],
};

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
};

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
};
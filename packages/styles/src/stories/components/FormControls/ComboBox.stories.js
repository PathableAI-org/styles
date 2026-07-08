export default {
  title: 'Components/Form Controls/Combo Box',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story: '**Note:** This component requires USWDS JavaScript for full interactivity. The examples below show static CSS styling only.',
      },
    },
  },
};

export const Default = {
  render: () => `
<div class="pathable-combo-box">
  <select class="pathable-select">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</div>
  `,
};
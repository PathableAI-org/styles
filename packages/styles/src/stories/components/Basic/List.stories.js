export default {
  title: 'Components/List',
  tags: ['autodocs'],
}

export const Unordered = {
  render: () => `
    <ul class="pathable-list pathable-list--unordered">
      <li>Unordered list item one</li>
      <li>Unordered list item two</li>
      <li>Unordered list item three</li>
    </ul>
  `,
}

export const Default = Unordered

export const Ordered = {
  render: () => `
    <ol class="pathable-list pathable-list--ordered">
      <li>Ordered list item one</li>
      <li>Ordered list item two</li>
      <li>Ordered list item three</li>
    </ol>
  `,
}

export const Unstyled = {
  render: () => `
    <ul class="pathable-list pathable-list--unstyled">
      <li>Unstyled list item one</li>
      <li>Unstyled list item two</li>
      <li>Unstyled list item three</li>
    </ul>
  `,
}

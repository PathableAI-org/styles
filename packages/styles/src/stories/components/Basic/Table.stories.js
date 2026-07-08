export default {
  title: 'Components/Table',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
    <table class="pathable-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jane Doe</td>
          <td>Designer</td>
          <td>Product</td>
        </tr>
        <tr>
          <td>John Smith</td>
          <td>Developer</td>
          <td>Engineering</td>
        </tr>
        <tr>
          <td>Alice Johnson</td>
          <td>Manager</td>
          <td>Operations</td>
        </tr>
      </tbody>
    </table>
  `,
}

export const Borderless = {
  render: () => `
    <table class="pathable-table pathable-table--borderless">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jane Doe</td>
          <td>Designer</td>
          <td>Product</td>
        </tr>
        <tr>
          <td>John Smith</td>
          <td>Developer</td>
          <td>Engineering</td>
        </tr>
        <tr>
          <td>Alice Johnson</td>
          <td>Manager</td>
          <td>Operations</td>
        </tr>
      </tbody>
    </table>
  `,
}

export const Compact = {
  render: () => `
    <table class="pathable-table pathable-table--compact">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jane Doe</td>
          <td>Designer</td>
          <td>Product</td>
        </tr>
        <tr>
          <td>John Smith</td>
          <td>Developer</td>
          <td>Engineering</td>
        </tr>
        <tr>
          <td>Alice Johnson</td>
          <td>Manager</td>
          <td>Operations</td>
        </tr>
      </tbody>
    </table>
  `,
}

export const Striped = {
  render: () => `
    <table class="pathable-table pathable-table--striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jane Doe</td>
          <td>Designer</td>
          <td>Product</td>
        </tr>
        <tr>
          <td>John Smith</td>
          <td>Developer</td>
          <td>Engineering</td>
        </tr>
        <tr>
          <td>Alice Johnson</td>
          <td>Manager</td>
          <td>Operations</td>
        </tr>
      </tbody>
    </table>
  `,
}

export default {
  title: 'Components/Communication/Process List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <ol class="pathable-process-list">
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Research</h4>
        <p class="pathable-process-list__body">Conduct initial research to understand user needs and project requirements.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Design</h4>
        <p class="pathable-process-list__body">Create wireframes and prototypes based on research findings.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Develop</h4>
        <p class="pathable-process-list__body">Build the solution following design specifications and accessibility guidelines.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Test</h4>
        <p class="pathable-process-list__body">Validate the implementation through user testing and quality assurance.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Launch</h4>
        <p class="pathable-process-list__body">Deploy the solution and monitor for any issues.</p>
      </li>
    </ol>
  `,
}

import { userEvent, within, expect } from 'storybook/test'
import {
  verifyCurrentPageState,
  verifyLandmarkName,
  type StoryHarness,
} from '@pathable/storybook-contracts'

export default {
  title: 'Components/Navigation/Sidenav',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n**App State to Manage**: active navigation item\n**Shared semantics verified**: exactly one item carries `aria-current="page"` and the list is a navigation landmark with an accessible name.\n**Consumers must**: Provide state management for active navigation item in application framework.',
      },
    },
  },
}

function harnessFor(root: HTMLElement): StoryHarness {
  return {
    root,
    within,
    userEvent,
    expect,
  }
}

export const Default = {
  render: () => `
<aside class="pathable-sidenav">
  <nav class="pathable-sidenav__nav" aria-label="Side navigation">
    <ul class="pathable-sidenav__sublist">
      <li class="pathable-sidenav__item">
        <a href="#" class="pathable-current" aria-current="page">Today's Sessions</a>
      </li>
      <li class="pathable-sidenav__item">
        <a href="#">Participants</a>
        <ul class="pathable-sidenav__sublist">
          <li class="pathable-sidenav__item">
            <a href="#">All Participants</a>
          </li>
          <li class="pathable-sidenav__item">
            <a href="#">Add Participant</a>
          </li>
        </ul>
      </li>
      <li class="pathable-sidenav__item">
        <a href="#">Approvals</a>
      </li>
      <li class="pathable-sidenav__item">
        <a href="#">Reports</a>
      </li>
      <li class="pathable-sidenav__item">
        <a href="#">Templates</a>
      </li>
      <li class="pathable-sidenav__item">
        <a href="#">Settings</a>
      </li>
    </ul>
  </nav>
</aside>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)

    await verifyLandmarkName(harness, 'navigation', /Side navigation/i)
    await verifyCurrentPageState(harness, /Today's Sessions/i)
  },
}

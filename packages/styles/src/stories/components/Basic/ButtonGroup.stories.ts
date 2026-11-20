import { expect, within } from 'storybook/test'

import { guarantee } from '../../shared/guarantee'

export default {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-button-group">
      <button class="pathable-button pathable-button--outline">Option One</button>
      <button class="pathable-button pathable-button--outline">Option Two</button>
      <button class="pathable-button pathable-button--outline">Option Three</button>
    </div>
  `,
}

export const Segmented = {
  render: () => `
    <div class="pathable-button-group pathable-button-group--segmented">
      <button class="pathable-button pathable-button--outline">Option One</button>
      <button class="pathable-button pathable-button--outline">Option Two</button>
      <button class="pathable-button pathable-button--outline">Option Three</button>
    </div>
  `,
}

export const NarrowContainer = {
  render: () => `
    <div data-testid="wide-frame" style="max-width: 40rem; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid currentColor">
      <div class="pathable-button-group">
        <button class="pathable-button pathable-button--outline">Cancel</button>
        <button class="pathable-button">Save</button>
      </div>
    </div>
    <div data-testid="frame" style="max-width: 20rem; padding: 1.5rem; border: 1px solid currentColor">
      <div class="pathable-button-group">
        <button class="pathable-button pathable-button--outline">Cancel</button>
        <button class="pathable-button">Delete Permanently</button>
        <button class="pathable-button pathable-button--outline">Keep Both Copies</button>
      </div>
    </div>
  `,
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement
    step: Parameters<typeof guarantee>[0]
  }) => {
    const canvas = within(canvasElement)
    const frame = canvas.getByTestId('frame')
    const group = frame.querySelector<HTMLElement>('.pathable-button-group')
    if (!group) throw new Error('The button group is missing')

    const view = canvasElement.ownerDocument.defaultView
    if (!view) throw new Error('The story has no window')
    await expect(view.innerWidth).toBeGreaterThanOrEqual(480)
    await expect(view.getComputedStyle(group).flexWrap).toBe('wrap')

    await guarantee(step, 'button-group/row-from-480', async () => {
      const frameRight = frame.getBoundingClientRect().right
      const buttons = within(frame).getAllByRole('button')
      for (const button of buttons) {
        await expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(
          frameRight,
        )
      }

      // In a container wide enough for them, the buttons sit side by side in
      // DOM order, each as tall as the tallest beside it.
      const [first, second] = within(canvas.getByTestId('wide-frame'))
        .getAllByRole('button')
        .map((button) => button.getBoundingClientRect())
      await expect(first.top).toBe(second.top)
      await expect(first.height).toBe(second.height)
      await expect(first.right).toBeLessThanOrEqual(second.left)

      // The buttons need more than one line, so the row did wrap.
      const tops = new Set(
        buttons.map((button) => Math.round(button.getBoundingClientRect().top)),
      )
      await expect(tops.size).toBeGreaterThan(1)
    })
  },
  parameters: {
    docs: {
      description: {
        story:
          'In a container too narrow for one row, from 480 px the buttons wrap onto a new line instead of running past the container.',
      },
    },
  },
}

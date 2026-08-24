import type { StoryHarness } from '../types.js'
import type { MultiToggleOptions } from './types.js'
import { getNamedGroup, getNamedOption, keyboardDescriptor } from './_lib.js'

export async function verifyMultiKeyboardToggle(
  harness: StoryHarness,
  options: MultiToggleOptions,
) {
  const group = getNamedGroup(harness, 'group', options.groupName)
  const buttons = harness.within(group).getAllByRole('button')
  const target = getNamedOption(harness, group, 'button', options.optionName)
  const initialStates = new Map<HTMLElement, 'true' | 'false'>()

  for (const button of buttons) {
    const pressed = button.getAttribute('aria-pressed')

    if (pressed !== 'true' && pressed !== 'false') {
      throw new Error(
        '[storybook-contracts:segmented-control.multi-keyboard-toggle] Every option must expose an initial aria-pressed state.',
      )
    }

    initialStates.set(button, pressed)
  }

  const targetInitial = initialStates.get(target)

  if (targetInitial !== 'true' && targetInitial !== 'false') {
    throw new Error(
      `[storybook-contracts:segmented-control.multi-keyboard-toggle] Option "${String(options.optionName)}" must expose an initial aria-pressed state.`,
    )
  }

  target.focus()
  await harness.userEvent.keyboard(keyboardDescriptor(options.key))

  await harness
    .expect(target)
    .toHaveAttribute(
      'aria-pressed',
      targetInitial === 'true' ? 'false' : 'true',
    )
  await harness.expect(target).toHaveFocus()

  for (const button of buttons) {
    if (button !== target) {
      await harness
        .expect(button)
        .toHaveAttribute('aria-pressed', initialStates.get(button)!)
    }
  }
}

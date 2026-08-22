import type { StoryHarness } from '../types.js'
import type { SingleNavigationOptions } from './types.js'
import { getNamedGroup, getNamedOption, keyboardDescriptor } from './_lib.js'

export async function verifyVerticalNavigation(
  harness: StoryHarness,
  options: SingleNavigationOptions,
) {
  if (options.key !== 'ArrowUp' && options.key !== 'ArrowDown') {
    throw new Error(
      '[storybook-contracts:segmented-control.vertical-navigation] Vertical navigation requires ArrowUp or ArrowDown.',
    )
  }

  const group = getNamedGroup(harness, 'radiogroup', options.groupName)
  const from = getNamedOption(harness, group, 'radio', options.fromName)
  const to = getNamedOption(harness, group, 'radio', options.toName)

  if (
    from.getAttribute('aria-checked') !== 'true' ||
    to.getAttribute('aria-checked') !== 'false'
  ) {
    throw new Error(
      `[storybook-contracts:segmented-control.vertical-navigation] Expected "${String(options.fromName)}" to start selected and "${String(options.toName)}" to start unselected.`,
    )
  }

  await harness.expect(group).toHaveAttribute('aria-orientation', 'vertical')
  from.focus()
  await harness.userEvent.keyboard(keyboardDescriptor(options.key))

  await harness.expect(from).toHaveAttribute('aria-checked', 'false')
  await harness.expect(to).toHaveAttribute('aria-checked', 'true')
  await harness.expect(to).toHaveFocus()
}

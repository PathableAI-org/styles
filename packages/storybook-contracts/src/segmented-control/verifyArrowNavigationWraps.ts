import type { StoryHarness } from '../types.js'
import type { SingleNavigationOptions } from './types.js'
import { getNamedGroup, getNamedOption, keyboardDescriptor } from './_lib.js'

export async function verifyArrowNavigationWraps(
  harness: StoryHarness,
  options: SingleNavigationOptions,
) {
  const group = getNamedGroup(harness, 'radiogroup', options.groupName)
  const radios = harness.within(group).getAllByRole('radio')
  const from = getNamedOption(harness, group, 'radio', options.fromName)
  const to = getNamedOption(harness, group, 'radio', options.toName)

  const movesBackward = options.key === 'ArrowLeft' || options.key === 'ArrowUp'
  const expectedFrom = movesBackward ? radios[0] : radios[radios.length - 1]
  const expectedTo = movesBackward ? radios[radios.length - 1] : radios[0]

  if (radios.length < 2 || from !== expectedFrom || to !== expectedTo) {
    throw new Error(
      `[storybook-contracts:segmented-control.arrow-navigation] Expected ${options.key} to wrap between the first and last radio in "${String(options.groupName)}".`,
    )
  }

  if (from.getAttribute('aria-checked') !== 'true') {
    throw new Error(
      `[storybook-contracts:segmented-control.arrow-navigation] Expected "${String(options.fromName)}" to start selected before testing ${options.key}.`,
    )
  }

  from.focus()
  await harness.userEvent.keyboard(keyboardDescriptor(options.key))

  await harness.expect(from).toHaveAttribute('aria-checked', 'false')
  await harness.expect(to).toHaveAttribute('aria-checked', 'true')
  await harness.expect(to).toHaveFocus()
}

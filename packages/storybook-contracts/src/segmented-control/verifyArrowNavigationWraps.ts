import type { StoryHarness } from '../types.js'
import type { SingleNavigationOptions } from './types.js'
import { getNamedGroup, getNamedOption, keyboardDescriptor } from './_lib.js'

export async function verifyArrowNavigationWraps(
  harness: StoryHarness,
  options: SingleNavigationOptions,
) {
  const group = getNamedGroup(harness, 'radiogroup', options.groupName)
  const radios = harness.within(group).getAllByRole('radio')
  const enabledRadios = radios.filter(
    (radio) =>
      radio.getAttribute('disabled') === null &&
      radio.getAttribute('aria-disabled') !== 'true',
  )
  const from = getNamedOption(harness, group, 'radio', options.fromName)
  const to = getNamedOption(harness, group, 'radio', options.toName)

  const movesBackward = options.key === 'ArrowLeft' || options.key === 'ArrowUp'
  const expectedFrom = movesBackward
    ? enabledRadios[0]
    : enabledRadios[enabledRadios.length - 1]
  const expectedTo = movesBackward
    ? enabledRadios[enabledRadios.length - 1]
    : enabledRadios[0]

  if (enabledRadios.length < 2 || from !== expectedFrom || to !== expectedTo) {
    throw new Error(
      `[storybook-contracts:segmented-control.arrow-navigation] Expected ${options.key} to wrap between the first and last enabled radio in "${String(options.groupName)}".`,
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

import type { StoryHarness } from '../types.js'
import type { DisabledNavigationOptions } from './types.js'
import { getNamedGroup, getNamedOption, keyboardDescriptor } from './_lib.js'

export async function verifyDisabledOptionSkipped(
  harness: StoryHarness,
  options: DisabledNavigationOptions,
) {
  const group = getNamedGroup(harness, 'radiogroup', options.groupName)
  const radios = harness.within(group).getAllByRole('radio')
  const from = getNamedOption(harness, group, 'radio', options.fromName)
  const disabled = getNamedOption(harness, group, 'radio', options.disabledName)
  const to = getNamedOption(harness, group, 'radio', options.toName)
  const direction =
    options.key === 'ArrowRight' || options.key === 'ArrowDown' ? 1 : -1
  const fromIndex = radios.indexOf(from)
  const expectedDisabled =
    radios[(fromIndex + direction + radios.length) % radios.length]
  const expectedTo =
    radios[(fromIndex + direction * 2 + radios.length * 2) % radios.length]

  if (
    radios.length < 3 ||
    disabled !== expectedDisabled ||
    to !== expectedTo ||
    from.getAttribute('aria-checked') !== 'true' ||
    disabled.getAttribute('aria-checked') !== 'false' ||
    to.getAttribute('aria-checked') !== 'false'
  ) {
    throw new Error(
      `[storybook-contracts:segmented-control.disabled-option-skip] Expected ${options.key} to start on "${String(options.fromName)}", skip adjacent disabled option "${String(options.disabledName)}", and select "${String(options.toName)}" in "${String(options.groupName)}".`,
    )
  }

  await harness.expect(disabled).toBeDisabled()
  from.focus()
  await harness.userEvent.keyboard(keyboardDescriptor(options.key))

  await harness.expect(from).toHaveAttribute('aria-checked', 'false')
  await harness.expect(disabled).toHaveAttribute('aria-checked', 'false')
  await harness.expect(to).toHaveAttribute('aria-checked', 'true')
  await harness.expect(to).toHaveFocus()
}

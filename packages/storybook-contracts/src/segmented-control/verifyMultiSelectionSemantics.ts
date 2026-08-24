import type { StoryHarness } from '../types.js'
import { getNamedGroup, getNamedOption } from './_lib.js'

export async function verifyMultiSelectionSemantics(
  harness: StoryHarness,
  groupName: string | RegExp,
  optionNames: readonly (string | RegExp)[],
) {
  const group = getNamedGroup(harness, 'group', groupName)

  if (optionNames.length < 2) {
    throw new Error(
      '[storybook-contracts:segmented-control.multi-selection] Expected at least two toggle options.',
    )
  }

  for (const optionName of optionNames) {
    const option = getNamedOption(harness, group, 'button', optionName)
    const pressed = option.getAttribute('aria-pressed')

    if (pressed !== 'true' && pressed !== 'false') {
      throw new Error(
        `[storybook-contracts:segmented-control.multi-selection] Option "${String(optionName)}" must expose aria-pressed as true or false.`,
      )
    }
  }
}

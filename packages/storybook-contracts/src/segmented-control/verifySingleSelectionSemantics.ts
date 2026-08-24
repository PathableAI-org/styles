import type { StoryHarness } from '../types.js'
import { getNamedGroup, getNamedOption } from './_lib.js'

export async function verifySingleSelectionSemantics(
  harness: StoryHarness,
  groupName: string | RegExp,
  selectedName: string | RegExp,
) {
  const group = getNamedGroup(harness, 'radiogroup', groupName)
  const radios = harness.within(group).getAllByRole('radio')
  const selected = getNamedOption(harness, group, 'radio', selectedName)
  const checked = radios.filter(
    (radio) => radio.getAttribute('aria-checked') === 'true',
  )

  if (radios.length < 2 || checked.length !== 1 || checked[0] !== selected) {
    throw new Error(
      `[storybook-contracts:segmented-control.single-selection] Expected "${String(groupName)}" to contain multiple radios with only "${String(selectedName)}" selected.`,
    )
  }

  await harness.expect(selected).toHaveAttribute('aria-checked', 'true')
  await harness.expect(selected).toHaveAttribute('tabindex', '0')

  for (const radio of radios) {
    if (radio !== selected) {
      await harness.expect(radio).toHaveAttribute('aria-checked', 'false')
      await harness.expect(radio).toHaveAttribute('tabindex', '-1')
    }
  }
}

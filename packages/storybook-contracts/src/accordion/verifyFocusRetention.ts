import type { StoryHarness } from '../types.js'
import { getDisclosureButton } from './_lib.js'

/**
 * Shared capability: focus retention.
 * Focus stays on the disclosure control after activation.
 */
export async function verifyFocusRetention(
  harness: StoryHarness,
  disclosureName: string | RegExp,
) {
  const button = getDisclosureButton(harness, disclosureName)

  button.focus()
  await harness.userEvent.click(button)

  await harness.expect(button).toHaveFocus()
}

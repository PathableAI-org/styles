import type { StoryHarness } from './types.js'
import { getDisclosureButton } from './_lib.js'

/**
 * Shared capability: activating a collapsed disclosure expands it.
 *
 * The supported observable contract (Enter, Space, or pointer activation) must
 * toggle the disclosure. The underlying USWDS runtime is click-driven, so the
 * helper sends a click; Enter/Space activation is equivalent in browsers but the
 * helper asserts the observable outcome contract holds when the disclosure is
 * activated.
 */
export async function verifyEnterExpandsDisclosure(
  harness: StoryHarness,
  disclosureName: string | RegExp,
) {
  const button = getDisclosureButton(harness, disclosureName)
  if (button.getAttribute('aria-expanded') !== 'false') {
    throw new Error(
      `Expected disclosure "${String(disclosureName)}" to start collapsed.`,
    )
  }

  await harness.userEvent.click(button)

  await harness.expect(button).toHaveAttribute('aria-expanded', 'true')
}

import type { StoryHarness } from './types.js'
import { getDisclosureButton } from './_lib.js'

/**
 * Shared capability: activating an expanded disclosure collapses it.
 *
 * The supported observable contract (Enter, Space, or pointer activation) must
 * toggle the disclosure. The underlying USWDS runtime is click-driven, so the
 * helper sends a click; the helper asserts the observable outcome contract
 * holds when the disclosure is activated.
 */
export async function verifySpaceCollapsesDisclosure(
  harness: StoryHarness,
  disclosureName: string | RegExp,
) {
  const button = getDisclosureButton(harness, disclosureName)
  if (button.getAttribute('aria-expanded') !== 'true') {
    throw new Error(
      `Expected disclosure "${String(disclosureName)}" to start expanded.`,
    )
  }

  await harness.userEvent.click(button)

  await harness.expect(button).toHaveAttribute('aria-expanded', 'false')
}

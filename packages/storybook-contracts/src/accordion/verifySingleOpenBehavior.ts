import type { StoryHarness } from '../types.js'
import { getDisclosureButton } from './_lib.js'

/**
 * Shared capability: single-open behavior.
 * Activating a second disclosure closes the currently open one.
 */
export async function verifySingleOpenBehavior(
  harness: StoryHarness,
  firstDisclosureName: string | RegExp,
  secondDisclosureName: string | RegExp,
) {
  const first = getDisclosureButton(harness, firstDisclosureName)
  const second = getDisclosureButton(harness, secondDisclosureName)

  if (first.getAttribute('aria-expanded') !== 'true') {
    throw new Error(
      `Expected "${String(firstDisclosureName)}" to start expanded for single-open verification.`,
    )
  }

  await harness.userEvent.click(second)

  await harness.expect(second).toHaveAttribute('aria-expanded', 'true')
  await harness.expect(first).toHaveAttribute('aria-expanded', 'false')
}

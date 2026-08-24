import type { StoryHarness } from '../types.js'

/**
 * Shared capability: an overlay dialog is a `dialog` landmark with an
 * accessible name that resolves by accessible query.
 *
 * Shared by modal and, later, any framework overlay that exposes the same
 * promise. Deterministic and static in the Styles package (the open/close
 * runtime is owned by the framework/USWDS JS, not Styles).
 */
export async function verifyDialogName(
  harness: StoryHarness,
  name: string | RegExp,
) {
  harness.within(harness.root).getByRole('dialog', { name })
}

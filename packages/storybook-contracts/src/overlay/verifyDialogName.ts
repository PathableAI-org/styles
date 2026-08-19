import type { StoryHarness } from '../accordion/types.js'

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
  const dialog = harness.within(harness.root).getByRole('dialog', { name })
  if (!dialog) {
    throw new Error(
      `Expected a dialog with accessible name "${String(name)}" to be present.`,
    )
  }
}

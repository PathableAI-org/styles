import type { StoryHarness } from '../types.js'

/**
 * Shared capability: a control has an accessible name (an explicit `<label>`,
 * `aria-label`, or associated text) that resolves by accessible query.
 *
 * This is the common, deterministic, static contract shared by form controls
 * (checkbox, radio, select, input, textarea, combo box, search) and dialog
 * triggers. It does not assume runtime toggling is owned by the Styles package.
 */
export async function verifyAccessibleName(
  harness: StoryHarness,
  role: string,
  name: string | RegExp,
) {
  harness.within(harness.root).getByRole(role, { name })
}

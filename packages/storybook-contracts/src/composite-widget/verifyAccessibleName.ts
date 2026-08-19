import type { StoryHarness } from '../accordion/types.js'

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
  const element = harness.within(harness.root).getByRole(role, { name })
  if (!element) {
    throw new Error(
      `Expected a "${role}" with accessible name "${String(name)}" to be present.`,
    )
  }
}

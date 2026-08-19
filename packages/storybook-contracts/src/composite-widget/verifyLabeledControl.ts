import type { StoryHarness } from '../accordion/types.js'

/**
 * Shared capability: a form control has an accessible label via `<label for>`
 * (or wrapping label), resolvable by `getByLabelText`.
 *
 * This is the renderer-neutral form-control contract and is robust where role
 * name computation may be affected by a container's presentational CSS (e.g. a
 * date-picker input's visual wrapper). It does not assume runtime toggling is
 * owned by the Styles package.
 */
export async function verifyLabeledControl(
  harness: StoryHarness,
  labelText: string | RegExp,
) {
  harness.within(harness.root).getByLabelText(labelText)
}

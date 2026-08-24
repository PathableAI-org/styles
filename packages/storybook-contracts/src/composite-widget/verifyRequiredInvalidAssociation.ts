import type { StoryHarness } from '../types.js'

/**
 * Shared capability: a labeled required control exposes its invalid state.
 */
export async function verifyRequiredInvalidAssociation(
  harness: StoryHarness,
  labelText: string | RegExp,
) {
  const control = harness.within(harness.root).getByLabelText(labelText)

  await harness.expect(control).toHaveAttribute('required')
  await harness.expect(control).toHaveAttribute('aria-invalid', 'true')
}

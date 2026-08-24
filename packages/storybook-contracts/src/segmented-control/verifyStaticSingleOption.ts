import type { StoryHarness } from '../types.js'

export async function verifyStaticSingleOption(
  harness: StoryHarness,
  visibleText: string | RegExp,
) {
  const canvas = harness.within(harness.root)
  canvas.getByText(visibleText)

  for (const role of ['button', 'radio', 'radiogroup', 'group']) {
    if (canvas.queryByRole(role) !== null) {
      throw new Error(
        `[storybook-contracts:segmented-control.static-single-option] Static content "${String(visibleText)}" must not expose ${role} semantics.`,
      )
    }
  }
}

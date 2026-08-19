import type { StoryHarness } from '../accordion/types.js'

/**
 * Shared capability: a navigational container is a landmark with an accessible
 * name that resolves by accessible query.
 *
 * Shared by the header/sidenav/application-shell navigations (e.g. a `nav`
 * with `aria-label`). Deterministic and static in the Styles package.
 */
export async function verifyLandmarkName(
  harness: StoryHarness,
  landmark: string,
  name: string | RegExp,
) {
  const element = harness.within(harness.root).getByRole(landmark, { name })
  if (!element) {
    throw new Error(
      `Expected a ${landmark} landmark with accessible name "${String(name)}" to be present.`,
    )
  }
}

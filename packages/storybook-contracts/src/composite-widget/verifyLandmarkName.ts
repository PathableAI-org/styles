import type { StoryHarness } from '../types.js'

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
  harness.within(harness.root).getByRole(landmark, { name })
}

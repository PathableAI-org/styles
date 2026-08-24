import type { StoryHarness } from '../types.js'

/**
 * Shared capability: a current navigation item communicates the current page.
 *
 * Shared by sidenav/header/breadcrumb navigations: exactly one item carries
 * `aria-current="page"` and it resolves by accessible name. Deterministic and
 * static in the Styles package.
 */
export async function verifyCurrentPageState(
  harness: StoryHarness,
  currentName: string | RegExp,
) {
  const link = harness
    .within(harness.root)
    .getByRole('link', { name: currentName })
  if (link.getAttribute('aria-current') !== 'page') {
    throw new Error(
      `Expected link "${String(currentName)}" to carry aria-current="page".`,
    )
  }
}

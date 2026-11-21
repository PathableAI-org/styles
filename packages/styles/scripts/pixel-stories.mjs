/**
 * The pixel visual-regression story entries and rollout list for the styles
 * Storybook, kept apart from test-pixels.mjs so other scripts can read them
 * without running the suite (check-component-pages.mjs reads `covers`).
 */

/**
 * Story entries: each canonical story with baselines and its
 * renderer-independent `<component>/<state>` key (the baseline directory, not
 * derived from the story ID, so a React capture of the same state can share
 * it). One image per viewport; which stories get an entry is in the docs.
 *
 * An entry may list `covers`: the component page guarantees its images are
 * the test for, as `<page>/<guarantee-id>` (components/, the source pages). The
 * suite itself ignores the field; pnpm check:component-pages reads it.
 */
export const STORIES = []

/** Components whose baselines are enforced. Only these are compared. */
export const ROLLOUT = []

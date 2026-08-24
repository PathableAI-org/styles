/**
 * @pathable/storybook-contracts
 *
 * Private, renderer-neutral shared component-behavior validators.
 *
 * This package is intentionally NOT publishable. It is a workspace-only
 * dependency that the HTML Storybook (and, later, framework storybooks) import
 * to exercise one shared observable capability per exported helper. Helpers do
 * not accept React props, Storybook renderer context types, CSS selectors, or
 * package internals.
 *
 * To author a shared validator:
 * - Accept an `HTMLElement` (or a minimal structural interface) alongside the
 *   minimal browser-testing primitives the caller supplies.
 * - Assert observable semantic outcomes using accessible roles, names, ARIA
 *   state, focus, and panel availability.
 * - Keep the helper named for exactly one capability.
 */
export type { StoryHarness } from './types.js'
export * from './accordion/manifest.js'
export * from './accordion/verifyEnterExpandsDisclosure.js'
export * from './accordion/verifySpaceCollapsesDisclosure.js'
export * from './accordion/verifySingleOpenBehavior.js'
export * from './accordion/verifyDisclosurePanelAssociation.js'
export * from './accordion/verifyPanelAvailability.js'
export * from './accordion/verifyFocusRetention.js'
export * from './segmented-control/manifest.js'
export * from './segmented-control/types.js'
export * from './segmented-control/verifySingleSelectionSemantics.js'
export * from './segmented-control/verifyArrowNavigationWraps.js'
export * from './segmented-control/verifyDisabledOptionSkipped.js'
export * from './segmented-control/verifyVerticalNavigation.js'
export * from './segmented-control/verifyMultiSelectionSemantics.js'
export * from './segmented-control/verifyMultiKeyboardToggle.js'
export * from './segmented-control/verifyStaticSingleOption.js'
export * from './rollout/types.js'
export * from './rollout/rollout.js'
export * from './overlay/index.js'
export * from './composite-widget/index.js'
export * from './focus/index.js'

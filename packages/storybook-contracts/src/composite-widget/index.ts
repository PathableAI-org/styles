/**
 * composite-widget shared capability group.
 *
 * Composite controls (form fields, listboxes, calendars, search, navigations)
 * share accessible-label, landmark, current-state, entry, and selection
 * semantics. Each helper exercises one capability and asserts an observable
 * outcome. Promote a helper only when two or more components share the exact
 * observable promise (Constitution XIV, FR-013).
 */
export { verifyAccessibleLabel } from './verifyAccessibleLabel.js'
export { verifyAccessibleName } from './verifyAccessibleName.js'
export { verifyCurrentPageState } from './verifyCurrentPageState.js'
export { verifyHintErrorAssociation } from './verifyHintErrorAssociation.js'
export { verifyLabeledControl } from './verifyLabeledControl.js'
export { verifyLandmarkName } from './verifyLandmarkName.js'
export { verifyRequiredInvalidAssociation } from './verifyRequiredInvalidAssociation.js'

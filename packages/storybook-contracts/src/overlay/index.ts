/**
 * overlay shared capability group.
 *
 * Overlays (dialog/modal, later dropdowns/calendars/toasts) share dialog
 * structure and dismissal semantics. Each helper exercises one capability and
 * asserts an observable outcome. Promote a helper only when two or more
 * components share the exact observable promise (Constitution XIV, FR-013). In
 * the Styles package the open/close runtime is owned by the framework/USWDS
 * JS, so helpers here assert deterministic static semantics unless a runtime
 * binding is present.
 */
export { verifyDialogName } from './verifyDialogName.js'

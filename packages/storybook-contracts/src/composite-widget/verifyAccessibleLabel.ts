import { verifyLabeledControl } from './verifyLabeledControl.js'

/**
 * Shared capability: a form control resolves through its accessible label.
 *
 * This Wave B name delegates to the existing renderer-neutral label query so
 * current adopters and new form-control stories share one implementation.
 */
export const verifyAccessibleLabel = verifyLabeledControl

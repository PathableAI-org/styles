import type { StoryHarness } from '../accordion/types.js'
import { verifyLabeledControl } from './verifyLabeledControl.js'

/**
 * Shared capability: a form control resolves through its accessible label.
 *
 * This Wave B name delegates to the existing renderer-neutral label query so
 * current adopters and new form-control stories share one implementation.
 */
export function verifyAccessibleLabel(
  harness: StoryHarness,
  labelText: string | RegExp,
) {
  return verifyLabeledControl(harness, labelText)
}

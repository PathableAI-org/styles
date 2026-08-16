import type { StoryHarness } from './types.js'
import { getDisclosureButton, getAssociatedPanel } from './_lib.js'

function isHidden(element: HTMLElement): boolean {
  if (element.hasAttribute('hidden')) return true
  return element.getAttribute('aria-hidden') === 'true'
}

/**
 * Shared capability: panel availability.
 * A panel is available only while its disclosure is expanded (managed via the
 * `hidden` attribute when collapsed).
 */
export async function verifyPanelAvailability(
  harness: StoryHarness,
  disclosureName: string | RegExp,
) {
  const button = getDisclosureButton(harness, disclosureName)
  const panel = getAssociatedPanel(button)
  const expanded = button.getAttribute('aria-expanded') === 'true'

  if (expanded && isHidden(panel)) {
    throw new Error(
      `Panel for "${String(disclosureName)}" is hidden while its disclosure is expanded.`,
    )
  }

  if (!expanded && !isHidden(panel)) {
    throw new Error(
      `Panel for "${String(disclosureName)}" is available while its disclosure is collapsed.`,
    )
  }
}

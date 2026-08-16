import type { StoryHarness } from './types.js'

/**
 * Resolve a disclosure button (a `button` with `aria-controls`) by its
 * accessible name within the harness root. Generated `id`s may vary, so we
 * anchor on the accessible name and the disclosure relationship rather than a
 * specific selector.
 */
export function getDisclosureButton(
  harness: StoryHarness,
  name: string | RegExp,
): HTMLElement {
  const button = harness.within(harness.root).getByRole('button', { name })
  const controls = button.getAttribute('aria-controls')

  if (!controls) {
    throw new Error(
      `Disclosure button "${String(name)}" is not associated with a panel (missing aria-controls).`,
    )
  }

  return button
}

/**
 * Resolve the panel a disclosure button is associated with, using
 * `aria-controls` → element id. Throws if the association does not resolve.
 */
export function getAssociatedPanel(button: HTMLElement): HTMLElement {
  const controls = button.getAttribute('aria-controls')

  if (!controls) {
    throw new Error('Disclosure button has no aria-controls.')
  }

  const panel = button.ownerDocument.getElementById(controls)

  if (!panel) {
    throw new Error(
      `Disclosure button references panel "${controls}" which does not exist in the document.`,
    )
  }

  return panel
}

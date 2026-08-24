import type { StoryHarness } from '../types.js'

export function getNamedGroup(
  harness: StoryHarness,
  role: 'group' | 'radiogroup',
  name: string | RegExp,
): HTMLElement {
  return harness.within(harness.root).getByRole(role, { name })
}

export function getNamedOption(
  harness: StoryHarness,
  group: HTMLElement,
  role: 'button' | 'radio',
  name: string | RegExp,
): HTMLElement {
  return harness.within(group).getByRole(role, { name })
}

export function keyboardDescriptor(key: string): string {
  return key === 'Space' ? ' ' : `{${key}}`
}

export function stateAttribute(role: 'button' | 'radio'): string {
  return role === 'radio' ? 'aria-checked' : 'aria-pressed'
}

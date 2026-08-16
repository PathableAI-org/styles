/**
 * Accordion shared-contract domain types.
 *
 * These are renderer-neutral: they describe observable capabilities and
 * fixtures, never a framework's props, state model, or public API.
 */

export type AccordionCapabilityState = 'initial' | 'resolved' | 'unresolved'
export type AccordionCapabilityScope = 'shared' | 'package-specific'

export interface AccordionCapability {
  /** Stable identity, e.g. `accordion.keyboard-enter`. */
  id: string
  /** Human-readable label for the observable behavior. */
  label: string
  /** Where the capability is owned. Shared capabilities must first be proven by Styles. */
  scope: AccordionCapabilityScope
  /** `initial` = part of the Phase-1 shared contract; `unresolved` = deferred. */
  state: AccordionCapabilityState
}

export interface AccordionFixture {
  /** Shared fixture identity, e.g. `accordion.default`. */
  name: string
  /** Whether the first disclosure starts expanded. */
  firstExpanded: boolean
}

export interface AccordionManifest {
  /** The six initial shared (obligatory) capabilities. */
  shared: AccordionCapability[]
  /** Deliberately package-specific; stays out of the shared contract. */
  packageSpecific: string[]
  /** Deferred until the Styles package documents/exposes the same promise. */
  unresolved: AccordionCapability[]
  /** Shared fixture set a target must provide. */
  fixtures: AccordionFixture[]
}

/**
 * Minimal accessible-query surface (structural subset of testing-library's
 * `within` result). Kept intentionally small so helpers never import a renderer.
 */
export interface Queryable {
  getByRole(role: string, options?: { name?: string | RegExp }): HTMLElement
  getByText(text: string | RegExp): HTMLElement
}

/**
 * A jest-style matcher object (structural subset). Storybook's `expect(elt)`
 * returns an object shaped like this; helpers accept it structurally so they
 * stay renderer-neutral.
 */
export interface StructuralAssertion {
  toHaveAttribute(attribute: string, value?: string): Promise<void>
  toHaveFocus(): Promise<void>
}

/**
 * The minimal browser-testing surface a helper is given to act on. The caller
 * supplies these (from `@storybook/test`), so helpers stay renderer-neutral.
 */
export interface StoryHarness {
  /** Root DOM element of the rendered component. */
  root: HTMLElement
  /** Scoped accessible queries against `root` (from `within(root)`). */
  within: (element: HTMLElement) => Queryable
  /** User-action primitives (from `@storybook/test`). */
  userEvent: {
    keyboard(input: string): Promise<void>
    click(element: HTMLElement): Promise<void>
    tab(): Promise<void>
  }
  /** Assertion primitive (from `@storybook/test`). */
  expect: (actual: HTMLElement) => StructuralAssertion
}

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

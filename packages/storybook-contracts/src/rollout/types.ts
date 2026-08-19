/**
 * Component rollout ledger domain types.
 *
 * These are renderer-neutral: they describe the observable capabilities and
 * Styles-proven status of every component (and Styles-only surface) in the
 * component-test rollout, never a framework's props, state model, or public API.
 */

export type RolloutWave = 'A' | 'B' | 'C' | 'D' | 'E'
export type RolloutCategory = 'shared' | 'styles-only'
export type RolloutStatus =
  'not-started' | 'styles-proven' | 'adopted' | 'unresolved'

/** A shared capability group; helpers must exercise one capability each. */
export type CapabilityGroup =
  'disclosure' | 'overlay' | 'composite-widget' | 'focus'

/** Reference to a shared single-capability helper proven by a component. */
export interface CapabilityRef {
  /** Stable identity, e.g. `modal.escape-closes`. */
  id: string
  /** The shared capability group the helper belongs to. */
  group: CapabilityGroup
  /** Human-readable label of the observable behavior. */
  label: string
}

/** Reference to a deterministic starting-state fixture. */
export interface FixtureRef {
  /** Stable fixture identity, e.g. `modal.closed`. */
  name: string
  /** Storybook id the fixture resolves to, e.g. `components-communication-modal--closed`. */
  storyId: string
}

/** A downstream package that adopted an unchanged shared helper. */
export interface DownstreamAdoption {
  /** e.g. `styles`, `react`, or a future framework package. */
  package: string
  /** How runtime isolation was proven for this framework. */
  isolationGuard: string
  /** When the Styles proof and adoption were recorded. */
  provenAt: string
}

export interface RolloutEntry {
  /** Stable story-id base, e.g. `components-form-controls-combobox`. */
  component: string
  /** Human label, e.g. `ComboBox`. */
  name: string
  /** Plan risk-order wave A–E. */
  wave: RolloutWave
  /** Whether a downstream package exposes the same user-facing promise. */
  category: RolloutCategory
  /** Styles-proof lifecycle state. */
  status: RolloutStatus
  /** Shared helpers this component proves (`shared` only). */
  capabilities: CapabilityRef[]
  /** Deterministic starting states. */
  fixtures: FixtureRef[]
  /** Stable Storybook id for the focused run. */
  storyId: string
  /** Downstream adoptions of the unchanged helpers (`adopted` only). */
  downstream: DownstreamAdoption[]
}

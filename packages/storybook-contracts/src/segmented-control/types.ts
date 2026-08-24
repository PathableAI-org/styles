export type SegmentedControlCapabilityState =
  'initial' | 'resolved' | 'unresolved'
export type SegmentedControlCapabilityScope = 'shared' | 'package-specific'

export interface SegmentedControlCapability {
  id: string
  label: string
  scope: SegmentedControlCapabilityScope
  state: SegmentedControlCapabilityState
}

export interface SegmentedControlFixture {
  name: string
}

export interface SegmentedControlManifest {
  shared: SegmentedControlCapability[]
  packageSpecific: string[]
  unresolved: SegmentedControlCapability[]
  fixtures: SegmentedControlFixture[]
}

export type ArrowKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

export type ActivationKey = 'Space' | 'Enter'

export interface SingleNavigationOptions {
  groupName: string | RegExp
  fromName: string | RegExp
  toName: string | RegExp
  key: ArrowKey
}

export interface DisabledNavigationOptions extends SingleNavigationOptions {
  disabledName: string | RegExp
}

export interface MultiToggleOptions {
  groupName: string | RegExp
  optionName: string | RegExp
  key: ActivationKey
}

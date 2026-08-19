// Re-export value types from resolver modules
import type { Width, MaxWidth } from './sizing'
import type { SpacingScale } from './spacing'
import type { Display } from './display'
import type { AlignItems, JustifyContent, TextAlign } from './alignment'
import type { Flex } from './flexGrid'
import type { FontFamily, FontWeight } from './typography'
import type { BackgroundColor, TextColor } from './colorTone'

export type { Width, MaxWidth } from './sizing'
export type { WidthClass, MaxWidthClass } from './sizing'
export type { SpacingScale } from './spacing'
export type {
  PaddingClass,
  PaddingXClass,
  PaddingYClass,
  MarginClass,
  MarginXClass,
  MarginYClass,
  MarginTopClass,
  MarginBottomClass,
} from './spacing'
export type { Display } from './display'
export type { DisplayClass } from './display'
export type { AlignItems, JustifyContent, TextAlign } from './alignment'
export type {
  AlignItemsClass,
  JustifyContentClass,
  TextAlignClass,
} from './alignment'
export type { Flex } from './flexGrid'
export type { FlexClass } from './flexGrid'
export type { FontFamily, FontWeight } from './typography'
export type { FontFamilyClass, FontWeightClass } from './typography'
export type { BackgroundColor, TextColor } from './colorTone'
export type { BackgroundColorClass, TextColorClass } from './colorTone'

// Capability interfaces — each is a set of optional props a component can opt into.
// All props are optional: a component with SizingProps is not required to set width.

export interface SizingProps {
  width?: Width
  maxWidth?: MaxWidth
}

export interface SpacingProps {
  padding?: SpacingScale
  paddingX?: SpacingScale
  paddingY?: SpacingScale
  margin?: SpacingScale
  marginX?: SpacingScale
  marginY?: SpacingScale
  marginTop?: SpacingScale
  marginBottom?: SpacingScale
}

export interface DisplayProps {
  display?: Display
}

export interface AlignmentProps {
  alignItems?: AlignItems
  justifyContent?: JustifyContent
  textAlign?: TextAlign
}

export interface FlexGridProps {
  flex?: Flex
}

export interface TypographyProps {
  fontFamily?: FontFamily
  fontWeight?: FontWeight
}

export interface ColorToneProps {
  backgroundColor?: BackgroundColor
  textColor?: TextColor
}

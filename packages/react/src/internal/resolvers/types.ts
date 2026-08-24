// Re-export value types from resolver modules
import type { Width, MaxWidth } from './sizing.js'
import type { SpacingScale, MarginScale } from './spacing.js'
import type { Display } from './display.js'
import type { AlignItems, JustifyContent, TextAlign } from './alignment.js'
import type { Flex } from './flexGrid.js'
import type { FontFamily, FontWeight } from './typography.js'
import type { BackgroundColor, TextColor } from './colorTone.js'

export type { Width, MaxWidth } from './sizing.js'

export type { TextTone, SurfaceTone, BorderTone } from './tone.js'
export type { SurfaceElevation, SurfaceElevationClass } from './surface.js'
export type { WidthClass, MaxWidthClass } from './sizing.js'
export type { SpacingScale, MarginScale } from './spacing.js'
export type {
  PaddingClass,
  PaddingXClass,
  PaddingYClass,
  MarginClass,
  MarginXClass,
  MarginYClass,
  MarginTopClass,
  MarginBottomClass,
} from './spacing.js'
export type { Display } from './display.js'
export type { DisplayClass } from './display.js'
export type { AlignItems, JustifyContent, TextAlign } from './alignment.js'
export type {
  AlignItemsClass,
  JustifyContentClass,
  TextAlignClass,
} from './alignment.js'
export type { Flex } from './flexGrid.js'
export type { FlexClass } from './flexGrid.js'
export type { FontFamily, FontWeight } from './typography.js'
export type { FontFamilyClass, FontWeightClass } from './typography.js'
export type { BackgroundColor, TextColor } from './colorTone.js'
export type { BackgroundColorClass, TextColorClass } from './colorTone.js'

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
  margin?: MarginScale
  marginX?: MarginScale
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

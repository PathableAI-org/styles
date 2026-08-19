// Sizing value types
export type Width = 'auto' | 'full'
export type MaxWidth = 'mobile' | 'mobile-lg' | 'tablet' | 'desktop'

// Spacing value type (shared across all padding/margin properties)
export type SpacingScale =
  '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '15'

// Display value types
export type Display = 'flex' | 'block' | 'inline' | 'inline-block' | 'none'

// Alignment value types
export type AlignItems = 'center' | 'start' | 'end' | 'stretch' | 'baseline'
export type JustifyContent = 'center' | 'start' | 'end' | 'between' | 'around'
export type TextAlign = 'center' | 'left' | 'right'

// Flex/Grid value types
export type Flex = '1' | 'fill'

// Typography value types
export type FontFamily = 'heading' | 'body' | 'mono' | 'alt'
export type FontWeight = 'normal' | 'semibold' | 'bold'

// Color/Tone value types
export type BackgroundColor =
  | 'primary'
  | 'base'
  | 'surface'
  | 'accent'
  | 'link'
  | 'focus-ring'
  | 'danger'
  | 'success'
  | 'transparent'
export type TextColor =
  'base' | 'primary' | 'muted' | 'accent' | 'link' | 'white'

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

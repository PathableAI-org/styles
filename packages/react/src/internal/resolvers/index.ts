// Internal resolver barrel — aggregates all resolver modules for internal import.
// NOT re-exported from src/index.ts (public entry point). Components import directly
// from this file when they adopt semantic props.

export type {
  Width,
  WidthClass,
  MaxWidth,
  MaxWidthClass,
  SpacingScale,
  MarginScale,
  PaddingClass,
  PaddingXClass,
  PaddingYClass,
  MarginClass,
  MarginXClass,
  MarginYClass,
  MarginTopClass,
  MarginBottomClass,
  Display,
  DisplayClass,
  AlignItems,
  AlignItemsClass,
  JustifyContent,
  JustifyContentClass,
  TextAlign,
  TextAlignClass,
  Flex,
  FlexClass,
  FontFamily,
  FontFamilyClass,
  FontWeight,
  FontWeightClass,
  BackgroundColor,
  BackgroundColorClass,
  TextColor,
  TextColorClass,
  TextTone,
  SurfaceTone,
  BorderTone,
  SizingProps,
  SpacingProps,
  DisplayProps,
  AlignmentProps,
  FlexGridProps,
  TypographyProps,
  ColorToneProps,
} from './types.js'

export { widthClass, maxWidthClass } from './sizing.js'
export {
  paddingAllClass,
  paddingXClass,
  paddingYClass,
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
} from './spacing.js'
export { displayClass } from './display.js'
export {
  alignItemsClass,
  justifyContentClass,
  textAlignClass,
} from './alignment.js'
export { flexClass } from './flexGrid.js'
export { fontFamilyClass, fontWeightClass } from './typography.js'
export { backgroundColorClass, textColorClass } from './colorTone.js'
export { textToneClass } from './tone.js'
export { mergeClasses } from './mergeClasses.js'

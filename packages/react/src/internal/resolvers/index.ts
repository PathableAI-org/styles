// Internal resolver barrel — aggregates all resolver modules for internal import.
// NOT re-exported from src/index.ts (public entry point). Components import directly
// from this file when they adopt semantic props.

export type {
  Width,
  MaxWidth,
  SpacingScale,
  Display,
  AlignItems,
  JustifyContent,
  TextAlign,
  Flex,
  FontFamily,
  FontWeight,
  BackgroundColor,
  TextColor,
  SizingProps,
  SpacingProps,
  DisplayProps,
  AlignmentProps,
  FlexGridProps,
  TypographyProps,
  ColorToneProps,
} from './types'

export { widthClass, maxWidthClass } from './sizing'
export {
  paddingAllClass,
  paddingXClass,
  paddingYClass,
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
} from './spacing'
export { displayClass } from './display'
export {
  alignItemsClass,
  justifyContentClass,
  textAlignClass,
} from './alignment'
export { flexClass } from './flexGrid'
export { fontFamilyClass, fontWeightClass } from './typography'
export { backgroundColorClass, textColorClass } from './colorTone'
export { mergeClasses } from './mergeClasses'

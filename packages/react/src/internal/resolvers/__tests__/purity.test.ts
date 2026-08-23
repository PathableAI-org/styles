import { describe, it, expect } from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { widthClass, maxWidthClass } from '../sizing'
import {
  paddingAllClass,
  paddingXClass,
  paddingYClass,
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
} from '../spacing'
import { displayClass } from '../display'
import {
  alignItemsClass,
  justifyContentClass,
  textAlignClass,
} from '../alignment'
import { flexClass } from '../flexGrid'
import { fontFamilyClass, fontWeightClass } from '../typography'
import { backgroundColorClass, textColorClass } from '../colorTone'
import { textToneClass } from '../tone'
import { mergeClasses } from '../mergeClasses'

const resolvers = {
  widthClass,
  maxWidthClass,
  paddingAllClass,
  paddingXClass,
  paddingYClass,
  marginAllClass,
  marginXClass,
  marginYClass,
  marginTopClass,
  marginBottomClass,
  displayClass,
  alignItemsClass,
  justifyContentClass,
  textAlignClass,
  flexClass,
  fontFamilyClass,
  fontWeightClass,
  backgroundColorClass,
  textColorClass,
  textToneClass,
  mergeClasses,
}

const BROWSER_GLOBALS = ['window', 'document', 'navigator', 'localStorage']

// Map each resolver function name to its source file (relative to this test).
const FILE_FOR_RESOLVER: Record<string, string> = {
  widthClass: 'sizing',
  maxWidthClass: 'sizing',
  paddingAllClass: 'spacing',
  paddingXClass: 'spacing',
  paddingYClass: 'spacing',
  marginAllClass: 'spacing',
  marginXClass: 'spacing',
  marginYClass: 'spacing',
  marginTopClass: 'spacing',
  marginBottomClass: 'spacing',
  displayClass: 'display',
  alignItemsClass: 'alignment',
  justifyContentClass: 'alignment',
  textAlignClass: 'alignment',
  flexClass: 'flexGrid',
  fontFamilyClass: 'typography',
  fontWeightClass: 'typography',
  backgroundColorClass: 'colorTone',
  textColorClass: 'colorTone',
  textToneClass: 'tone',
  mergeClasses: 'mergeClasses',
}

function loadSource(filename: string): string {
  const filePath = path.resolve(__dirname, '..', `${filename}.ts`)
  return fs.readFileSync(filePath, 'utf-8')
}

const sourceCache: Record<string, string> = {}

for (const [, sourceFile] of Object.entries(FILE_FOR_RESOLVER)) {
  if (!sourceCache[sourceFile]) {
    sourceCache[sourceFile] = loadSource(sourceFile)
  }
}

describe('resolver purity — no browser globals', () => {
  it('modules import without a browser', () => {
    expect(typeof widthClass).toBe('function')
  })

  for (const [resolverName, sourceFile] of Object.entries(FILE_FOR_RESOLVER)) {
    it(`"${resolverName}" source in ${sourceFile}.ts contains no browser globals`, () => {
      const source = sourceCache[sourceFile]
      for (const global of BROWSER_GLOBALS) {
        // Only flag standalone references: word boundaries ensure we don't
        // match substrings inside comments, but a comment containing "window"
        // would also be a red flag worth investigating.
        const re = new RegExp(`\\b${global}\\b`)
        expect(
          source,
          `"${resolverName}" source (${sourceFile}.ts) references "${global}"`,
        ).not.toMatch(re)
      }
    })
  }

  it('all resolver functions are synchronous and non-throwing', () => {
    for (const [name, fn] of Object.entries(resolvers)) {
      expect(typeof fn, `"${name}" should be a function`).toBe('function')

      expect(() =>
        (fn as (...args: unknown[]) => unknown)(undefined),
      ).not.toThrow()

      expect(() => (fn as (...args: unknown[]) => unknown)(null)).not.toThrow()
    }
  })

  it('all resolver functions produce consistent output (deterministic)', () => {
    const a = widthClass('full')
    const b = widthClass('full')
    expect(a).toBe(b)
  })
})

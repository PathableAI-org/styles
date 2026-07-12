/**
 * Token Custom-Property Lint
 *
 * Validates that every var(--pathable-*) reference in SCSS source files and
 * story files references a token that is actually defined in the token source
 * files. Reports undefined references with file:line and Levenshtein-based
 * suggestions.
 *
 * Usage:
 *   node packages/styles/scripts/lint-tokens.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STYLES_ROOT = resolve(__dirname, '..')
const SRC = resolve(STYLES_ROOT, 'src')
const LEGACY_ALLOWED_TOKENS = new Set([
  '--pathable-font-size-body-xs',
  '--pathable-font-size-heading-xl',
])

// ---------------------------------------------------------------------------
// Levenshtein distance for suggestions
// ---------------------------------------------------------------------------

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) => [i])
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function suggest(token, definedTokens, max = 3) {
  return definedTokens
    .map((d) => ({ token: d, dist: levenshtein(token, d) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, max)
    .filter((d) => d.dist <= 5)
    .map((d) => d.token)
}

// ---------------------------------------------------------------------------
// SCSS map parser
// ---------------------------------------------------------------------------

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Parse a flat SCSS map like:
 *   $map: (
 *     'key1': value1,
 *     'key2': value2,
 *   );
 * Uses paren counting to handle nested function calls like uswds.color(...).
 */
function parseScssMap(content, mapName) {
  const startRe = new RegExp(`\\$${escapeRegex(mapName)}\\s*:\\s*\\(`, 's')
  const startM = content.match(startRe)
  if (!startM) return new Map()

  const startIdx = startM.index + startM[0].length
  let depth = 1
  let endIdx = startIdx
  while (depth > 0 && endIdx < content.length) {
    if (content[endIdx] === '(') {
      depth++
    } else if (content[endIdx] === ')') {
      depth--
    }
    endIdx++
  }
  const block = content.slice(startIdx, endIdx - 1)

  // Strip Sass comments
  const cleaned = block
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')

  const result = new Map()
  // Match 'key': value pairs using paren counting for values
  const pairRe = /(['"]?)([a-zA-Z0-9_\-.]+)\1\s*:/g
  let pm
  const matches = []
  while ((pm = pairRe.exec(cleaned)) !== null) {
    matches.push({ key: pm[2], start: pm.index + pm[0].length })
  }

  for (let i = 0; i < matches.length; i++) {
    const { key, start } = matches[i]
    const nextStart =
      i + 1 < matches.length ? matches[i + 1].start : cleaned.length
    let value = cleaned.slice(start, nextStart).trim()
    // Remove trailing comma
    if (value.endsWith(',')) value = value.slice(0, -1).trim()
    result.set(key, value)
  }

  return result
}

/**
 * Parse a nested SCSS utility map like:
 *   $pathable-utilities: (
 *     'bg': ( ... 'values': ( 'primary': ..., 'base': ..., ), ... ),
 *     ...
 *   );
 * Returns Map<moduleName, valueKey[]>
 */
function parseNestedMapValues(content, mapName) {
  const entries = new Map()

  const startRe = new RegExp(`\\$${escapeRegex(mapName)}\\s*:\\s*\\(`, 's')
  const startM = content.match(startRe)
  if (!startM) return entries

  const startIdx = startM.index + startM[0].length
  let depth = 1
  let endIdx = startIdx
  while (depth > 0 && endIdx < content.length) {
    if (content[endIdx] === '(') {
      depth++
    } else if (content[endIdx] === ')') {
      depth--
    }
    endIdx++
  }
  const block = content.slice(startIdx, endIdx - 1)

  // Find top-level entries: 'key': ( ... ),
  const entryRe = /(['"]?)([a-zA-Z0-9_\-.]+)\1\s*:\s*\(/g
  let em
  while ((em = entryRe.exec(block)) !== null) {
    const key = em[2]
    const valStart = em.index + em[0].length

    // Find matching closing paren
    let vDepth = 1
    let vEnd = valStart
    while (vDepth > 0 && vEnd < block.length) {
      if (block[vEnd] === '(') {
        vDepth++
      } else if (block[vEnd] === ')') {
        vDepth--
      }
      vEnd++
    }
    const valueBlock = block.slice(valStart, vEnd - 1)

    // Find the 'values' sub-map
    const valuesRe = /['"]values['"]\s*:\s*\(/s
    const vm = valueBlock.match(valuesRe)
    if (vm) {
      const valMapStart = vm.index + vm[0].length
      let valDepth = 1
      let valMapEnd = valMapStart
      while (valDepth > 0 && valMapEnd < valueBlock.length) {
        if (valueBlock[valMapEnd] === '(') {
          valDepth++
        } else if (valueBlock[valMapEnd] === ')') {
          valDepth--
        }
        valMapEnd++
      }
      const valMapBlock = valueBlock.slice(valMapStart, valMapEnd - 1)
      const valKeyRe = /(['"]?)([a-zA-Z0-9_\-.]+)\1\s*:/g
      const valueKeys = []
      let vkm
      while ((vkm = valKeyRe.exec(valMapBlock)) !== null) {
        valueKeys.push(vkm[2])
      }
      entries.set(key, valueKeys)
    }
  }

  return entries
}

// ---------------------------------------------------------------------------
// Token extraction from SCSS source files
// ---------------------------------------------------------------------------

/**
 * Extract static --pathable-* tokens from :root { ... } blocks.
 * Uses brace counting to handle nested interpolations like #{...}.
 */
function extractStaticTokens(content, tokens) {
  const rootRe = /:root\s*\{/g
  let rm
  while ((rm = rootRe.exec(content)) !== null) {
    const startIdx = rm.index + rm[0].length
    let depth = 1
    let endIdx = startIdx
    while (depth > 0 && endIdx < content.length) {
      if (content[endIdx] === '{') {
        depth++
      } else if (content[endIdx] === '}') {
        depth--
      }
      endIdx++
    }
    const block = content.slice(startIdx, endIdx - 1)
    const propRe = /--pathable-[a-zA-Z0-9_-]+\s*:/g
    let pm
    while ((pm = propRe.exec(block)) !== null) {
      tokens.add(pm[0].replace(/\s*:\s*$/, '').trim())
    }
  }
}

function extractDefinedTokens() {
  const tokens = new Set()

  // _colors.scss — static --pathable-brand-* in :root
  const colors = readFileSync(resolve(SRC, '_colors.scss'), 'utf-8')
  extractStaticTokens(colors, tokens)

  // _semantic.scss — static --pathable-color-* in :root
  const semantic = readFileSync(resolve(SRC, '_semantic.scss'), 'utf-8')
  extractStaticTokens(semantic, tokens)

  // _typography.scss — static tokens in :root (font roles) + @each over $typography-tokens
  const typography = readFileSync(resolve(SRC, '_typography.scss'), 'utf-8')
  extractStaticTokens(typography, tokens)

  // Parse $typography-tokens map for dynamically generated tokens
  const typographyTokensMap = parseScssMap(typography, 'typography-tokens')
  for (const key of typographyTokensMap.keys()) {
    tokens.add(`--pathable-${key}`)
  }

  // _spacing.scss — @each over $pathable-spacing-scale
  const spacing = readFileSync(resolve(SRC, '_spacing.scss'), 'utf-8')
  extractStaticTokens(spacing, tokens)

  const spacingScale = parseScssMap(spacing, 'pathable-spacing-scale')
  for (const step of spacingScale.keys()) {
    tokens.add(`--pathable-space-${step}`)
  }

  // _utilities.scss — @each over $pathable-utilities (nested)
  const utilities = readFileSync(resolve(SRC, '_utilities.scss'), 'utf-8')
  extractStaticTokens(utilities, tokens)

  const utilEntries = parseNestedMapValues(utilities, 'pathable-utilities')
  for (const [moduleName, valueKeys] of utilEntries) {
    for (const vk of valueKeys) {
      tokens.add(`--pathable-${moduleName}-${vk}`)
    }
  }

  // _components-custom-properties.scss — static --pathable-* in :root
  const comp = readFileSync(
    resolve(SRC, '_components-custom-properties.scss'),
    'utf-8',
  )
  extractStaticTokens(comp, tokens)

  return Array.from(tokens).sort()
}

// ---------------------------------------------------------------------------
// Scanning for var(--pathable-*) references
// ---------------------------------------------------------------------------

function findPathableReferences(filePath, fileContent) {
  const lines = fileContent.split('\n')
  const refs = []
  const varRe = /var\(\s*(--pathable-[a-zA-Z0-9_-]+)\s*([),])/g
  for (let i = 0; i < lines.length; i++) {
    varRe.lastIndex = 0
    let m
    while ((m = varRe.exec(lines[i])) !== null) {
      refs.push({
        token: m[1],
        line: i + 1,
        file: filePath,
        hasFallback: m[2] === ',',
      })
    }
  }
  return refs
}

function extractDeclaredTokens(fileContent) {
  const tokens = new Set()
  const declRe = /(--pathable-[a-zA-Z0-9_-]+)\s*:/g
  let m
  while ((m = declRe.exec(fileContent)) !== null) {
    tokens.add(m[1])
  }
  return tokens
}

// ---------------------------------------------------------------------------
// File walking
// ---------------------------------------------------------------------------

function walkDir(dir, filterFn) {
  const results = []
  const stack = [dir]
  while (stack.length > 0) {
    const current = stack.pop()
    let entries
    try {
      entries = readdirSync(current)
    } catch {
      continue
    }
    for (const entry of entries) {
      const full = resolve(current, entry)
      let stat
      try {
        stat = statSync(full)
      } catch {
        continue
      }
      if (stat.isDirectory()) {
        stack.push(full)
      } else if (stat.isFile() && filterFn(entry)) {
        results.push(full)
      }
    }
  }
  return results
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const definedTokens = extractDefinedTokens()
  const definedSet = new Set(definedTokens)

  console.log(`Defined tokens: ${definedTokens.length}\n`)

  // Scan SCSS source files and story files
  const scssFiles = walkDir(SRC, (name) => name.endsWith('.scss'))
  const storyFiles = walkDir(resolve(SRC, 'stories'), (name) =>
    name.endsWith('.stories.js'),
  )

  const declaredInScss = new Set()
  for (const file of scssFiles) {
    const content = readFileSync(file, 'utf-8')
    for (const token of extractDeclaredTokens(content)) {
      declaredInScss.add(token)
    }
  }

  const allFiles = [...scssFiles, ...storyFiles]
  const issues = []

  for (const file of allFiles) {
    const content = readFileSync(file, 'utf-8')
    const refs = findPathableReferences(file, content)
    for (const ref of refs) {
      if (
        !definedSet.has(ref.token) &&
        !declaredInScss.has(ref.token) &&
        !ref.hasFallback &&
        !LEGACY_ALLOWED_TOKENS.has(ref.token)
      ) {
        const suggestions = suggest(ref.token, definedTokens)
        issues.push({ ...ref, suggestions })
      }
    }
  }

  if (issues.length === 0) {
    console.log('All var(--pathable-*) references resolve to defined tokens.')
    process.exit(0)
  }

  console.log(`Undefined token references: ${issues.length}\n`)
  for (const issue of issues) {
    const relPath = relative(process.cwd(), issue.file)
    console.log(`${relPath}:${issue.line}: undefined token "${issue.token}"`)
    if (issue.suggestions.length > 0) {
      console.log(`  Did you mean: ${issue.suggestions.join(', ')}?`)
    }
  }

  process.exit(1)
}

main()

/**
 * Token Custom-Property Lint
 *
 * Validates that every var(--*) reference in SCSS source files and story files
 * references a custom property that is actually defined. That covers the
 * --pathable-* namespace and the non-prefixed design tokens (--elevation-*). A reference
 * resolves when the token source files define it, when any SCSS source file
 * declares it, or when it carries a fallback value. References inside comments
 * are checked too, so a comment that names a token must name a real one;
 * declarations inside comments do not count. Reports undefined references with
 * file:line and Levenshtein-based suggestions.
 *
 * Usage:
 *   node packages/styles/scripts/lint-tokens.mjs
 */

import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs'
import { resolve, relative, dirname, basename } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STYLES_ROOT = resolve(__dirname, '..')
const SRC = resolve(STYLES_ROOT, 'src')

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

function extractBraceBlock(content, startIndex) {
  let depth = 1
  const depthChange = { '{': 1, '}': -1 }
  for (const match of content.slice(startIndex).matchAll(/[{}]/g)) {
    depth += depthChange[match[0]]
    if (depth === 0) {
      return content.slice(startIndex, startIndex + match.index)
    }
  }
  return content.slice(startIndex)
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
    matches.push({
      key: pm[2],
      index: pm.index,
      start: pm.index + pm[0].length,
    })
  }

  for (let i = 0; i < matches.length; i++) {
    const { key, start } = matches[i]
    const nextStart =
      i + 1 < matches.length ? matches[i + 1].index : cleaned.length
    let value = cleaned.slice(start, nextStart).trim()
    // Remove trailing comma
    if (value.endsWith(',')) value = value.slice(0, -1).trim()
    result.set(key, value)
  }

  return result
}

// ---------------------------------------------------------------------------
// Token extraction from SCSS source files
// ---------------------------------------------------------------------------

/**
 * A custom-property declaration: `--name:` not preceded by a word character,
 * hyphen, `&`, `}` or `(`, so a BEM modifier before a pseudo-class
 * (`.card--sm:hover`, `&--sm:hover`, `#{&}--sm:hover`) and an `@supports`
 * feature query (`(--x: y)`) are not mistaken for declarations. Interpolated
 * names (`--pathable-#{$x}:`) do not match, so token source files declare
 * each defined token with a literal name.
 * Callers strip comments first (see stripComments).
 */
const DECLARATION_PATTERN = /(?<![\w&}(-])(--[a-zA-Z0-9_-]+)\s*:/g

/**
 * Remove block comments and line comments, so prose such as
 * `// --space-2: unused` is not read as a declaration. A `//` only starts a
 * comment at the start of a line or after whitespace, which leaves URLs such
 * as `url(https://…)` intact.
 *
 * @param {string} content
 * @returns {string}
 */
function stripComments(content) {
  // One left-to-right pass, so a `/*` inside a line comment (or `//` inside a
  // block comment) does not start a second comment.
  return content.replace(/\/\*[\s\S]*?\*\/|(^|\s)\/\/.*$/gm, (match, lead) =>
    match.startsWith('/*') ? '' : lead,
  )
}

/**
 * Extract static custom-property tokens from :root and :where(:root) blocks.
 * Uses brace counting to handle nested interpolations like #{...}.
 */
function extractStaticTokens(content, tokens) {
  const rootRe = /(?::where\(\s*:root\s*\)|:root)\s*\{/g
  let rm
  while ((rm = rootRe.exec(content)) !== null) {
    const startIdx = rm.index + rm[0].length
    const block = stripComments(extractBraceBlock(content, startIdx))
    for (const pm of block.matchAll(DECLARATION_PATTERN)) {
      tokens.add(pm[1])
    }
  }
}

/**
 * Collect every token the token source files declare. Exported for the
 * tooling tests.
 *
 * @returns {string[]} sorted token names
 */
export function extractDefinedTokens() {
  const tokens = new Set()

  // _colors.scss (--pathable-brand-*), _semantic.scss (--pathable-color-*),
  // _typography.scss (font roles and weights) and _elevation.scss
  // (--elevation-*): static declarations in :root / :where(:root)
  for (const file of [
    '_colors.scss',
    '_semantic.scss',
    '_typography.scss',
    '_elevation.scss',
  ]) {
    extractStaticTokens(readFileSync(resolve(SRC, file), 'utf-8'), tokens)
  }

  return Array.from(tokens).sort()
}

// ---------------------------------------------------------------------------
// Scanning for var(--*) references
// ---------------------------------------------------------------------------

/**
 * Find var(--*) references across the whole file, so a reference that
 * Prettier wraps (`var(\n  --space-4\n)`) is still checked. The reported line
 * is the line of the token name.
 */
function findTokenReferences(filePath, fileContent) {
  const refs = []
  const varRe = /var\(\s*(--[a-zA-Z0-9_-]+)\s*([),])/g
  for (const m of fileContent.matchAll(varRe)) {
    const tokenIndex = m.index + m[0].indexOf(m[1])
    refs.push({
      token: m[1],
      line: fileContent.slice(0, tokenIndex).split('\n').length,
      file: filePath,
      hasFallback: m[2] === ',',
    })
  }
  return refs
}

/**
 * Custom properties declared anywhere in a file, such as component-scoped
 * properties set on a selector. Exported for the tooling tests.
 *
 * @param {string} fileContent
 * @returns {Set<string>}
 */
export function extractDeclaredTokens(fileContent) {
  const tokens = new Set()
  for (const m of stripComments(fileContent).matchAll(DECLARATION_PATTERN)) {
    tokens.add(m[1])
  }
  return tokens
}

/**
 * Report every var(--*) reference without a fallback that resolves to neither
 * a defined token nor a declared custom property. Exported for the tooling
 * tests.
 *
 * @param {{ file: string, content: string }[]} files files to scan
 * @param {string[]} definedTokens tokens from the token source files
 * @param {Set<string>} declaredTokens custom properties declared in SCSS
 * @returns {{ token: string, line: number, file: string, hasFallback: boolean, suggestions: string[] }[]}
 */
export function findUndefinedReferences(files, definedTokens, declaredTokens) {
  const definedSet = new Set(definedTokens)
  const issues = []
  for (const { file, content } of files) {
    for (const ref of findTokenReferences(file, content)) {
      if (
        !definedSet.has(ref.token) &&
        !declaredTokens.has(ref.token) &&
        !ref.hasFallback
      ) {
        issues.push({ ...ref, suggestions: suggest(ref.token, definedTokens) })
      }
    }
  }
  return issues
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

/**
 * Enforce the consolidated theme token invariant:
 *   1. Exactly one SCSS source file may declare --pathable-color-* properties
 *      (in a zero-specificity :where(:root) block), and that file must be
 *      _semantic.scss.
 *   2. The canonical block must declare the complete semantic color set
 *      (the same count of distinct token names produced by the $semantic-colors
 *      map in _semantic.scss).
 */
function checkColorTokenConsolidation() {
  const scssFiles = walkDir(SRC, (name) => name.endsWith('.scss'))
  const colorBlockFiles = []
  const allDeclarations = new Set()

  for (const file of scssFiles) {
    const content = readFileSync(file, 'utf-8')

    // Find any --pathable-color-* declaration anywhere in the file (not just
    // inside :root — a declaration accidentally nested under a selector would
    // still violate the single-block invariant).
    const declRe = /--pathable-color-[a-z0-9-]+\s*:/g
    let dm
    while ((dm = declRe.exec(content)) !== null) {
      const token = dm[0].replace(/\s*:\s*$/, '').trim()
      if (basename(file) !== '_semantic.scss') {
        // Only report non-semantic-scss declarations as violations;
        // _semantic.scss is the canonical source.
        allDeclarations.add(token)
      }
    }

    // Check low-specificity root blocks for the canonical declaration source.
    const rootRe = /:where\(\s*:root\s*\)\s*\{/g
    let rm
    while ((rm = rootRe.exec(content)) !== null) {
      const startIdx = rm.index + rm[0].length
      const block = extractBraceBlock(content, startIdx)
      if (/--pathable-color-[a-z0-9-]+\s*:/.test(block)) {
        colorBlockFiles.push(file)
      }
    }
  }

  const issues = []
  if (colorBlockFiles.length !== 1) {
    issues.push(
      `Expected exactly 1 :where(:root) block declaring --pathable-color-* tokens, found ${colorBlockFiles.length}.`,
    )
  }
  for (const file of colorBlockFiles) {
    if (basename(file) !== '_semantic.scss') {
      issues.push(
        `--pathable-color-* tokens must be declared only in _semantic.scss; found in ${relative(process.cwd(), file)}.`,
      )
    }
  }

  // Report any --pathable-color-* declarations outside _semantic.scss.
  if (allDeclarations.size > 0) {
    issues.push(
      `Found ${allDeclarations.size} --pathable-color-* declaration(s) outside _semantic.scss.`,
    )
  }

  // Completeness check: parse the $semantic-colors map from _semantic.scss
  // and verify the number of distinct color tokens it defines is unchanged.
  // The map is the single source of truth for the expected color token set.
  const semantic = readFileSync(resolve(SRC, '_semantic.scss'), 'utf-8')
  const semanticMap = parseScssMap(semantic, 'semantic-colors')
  const expectedCount = semanticMap.size
  // Count distinct --pathable-color-* tokens from the semantic root block.
  const rootDeclRe = /(--pathable-color-[a-z0-9-]+)\s*:/g
  const declaredColorTokens = new Set()
  let rdm
  while ((rdm = rootDeclRe.exec(semantic)) !== null) {
    declaredColorTokens.add(rdm[1])
  }
  if (declaredColorTokens.size !== expectedCount) {
    issues.push(
      `_semantic.scss :where(:root) block declares ${declaredColorTokens.size} --pathable-color-* token(s); expected ${expectedCount} from the $semantic-colors map.`,
    )
  }

  return issues
}

/**
 * The files the lint scans: every SCSS source file, and every JavaScript or
 * TypeScript file under `src/stories` (story files and their helpers).
 * Exported for the tooling tests.
 *
 * @returns {{ scssFiles: string[], storyFiles: string[] }}
 */
export function listScannedFiles() {
  return {
    scssFiles: walkDir(SRC, (name) => name.endsWith('.scss')),
    storyFiles: walkDir(resolve(SRC, 'stories'), (name) =>
      /\.(js|ts)$/.test(name),
    ),
  }
}

function main() {
  const consolidationIssues = checkColorTokenConsolidation()
  if (consolidationIssues.length > 0) {
    console.log('--pathable-color-* :root consolidation check failed:\n')
    for (const issue of consolidationIssues) {
      console.log(`  ${issue}`)
    }
    process.exit(1)
  }

  const definedTokens = extractDefinedTokens()

  console.log(`Defined tokens: ${definedTokens.length}\n`)

  const { scssFiles, storyFiles } = listScannedFiles()

  const declaredInScss = new Set()
  for (const file of scssFiles) {
    const content = readFileSync(file, 'utf-8')
    for (const token of extractDeclaredTokens(content)) {
      declaredInScss.add(token)
    }
  }

  const allFiles = [...scssFiles, ...storyFiles].map((file) => ({
    file,
    content: readFileSync(file, 'utf-8'),
  }))
  const issues = findUndefinedReferences(
    allFiles,
    definedTokens,
    declaredInScss,
  )

  if (issues.length === 0) {
    console.log('All var(--*) references resolve to defined tokens.')
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

// Compare real paths so a run through a symlinked checkout still lints.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
) {
  main()
}

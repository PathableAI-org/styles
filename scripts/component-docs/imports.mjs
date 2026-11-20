/**
 * Rewrites a React example module's imports into the ones a consumer writes.
 *
 * Example modules live in packages/react/src/components/<Name>/examples/ and
 * import the component relatively (`import { SrOnly } from '../SrOnly'`),
 * because a self-reference to `@pathableai/react` would resolve to `dist`.
 * The docs show consumer code, so each relative import becomes an import from
 * `@pathableai/react`. The rewrite is strict: it fails on any import it cannot
 * map, instead of showing it unchanged.
 *
 * An import is kept as it is when it comes from `react` or
 * `@pathableai/react`. A relative import is rewritten when it resolves inside
 * packages/react/src and every name it imports is a public export of the
 * package entry point (src/index.ts) under that name. Anything else fails: a
 * default, namespace or side-effect import from a relative path, a name the
 * entry point does not export, or another package.
 */

import { readFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'

import ts from 'typescript'

import { reactSourceDir, repoRoot } from './paths.mjs'

export const PACKAGE = '@pathableai/react'
const KEPT = new Set(['react', PACKAGE])

const parse = (file, source) =>
  ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

/** Every name the package entry point exports, value and type alike. */
export function publicExports(indexSource) {
  const names = new Set()
  for (const statement of parse('index.ts', indexSource).statements) {
    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) {
        names.add(element.name.text)
      }
    }
  }
  return names
}

let cachedExports
const entryExports = () =>
  (cachedExports ??= publicExports(
    readFileSync(join(reactSourceDir, 'index.ts'), 'utf8'),
  ))

/**
 * Returns the example source with its relative imports rewritten. `file` is
 * the module's absolute path. Throws an Error listing every import that
 * cannot be mapped. `exportsOf` is for tests.
 */
export function consumerSource(file, source, exportsOf = entryExports) {
  const problems = []
  const edits = []
  const where = relative(repoRoot, file)

  const tree = parse(file, source)
  for (const statement of tree.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    const specifier = statement.moduleSpecifier.text
    const line =
      tree.getLineAndCharacterOfPosition(statement.getStart()).line + 1
    const at = `${where}:${line}`

    if (KEPT.has(specifier)) continue
    if (!specifier.startsWith('.')) {
      problems.push(
        `${at}: imports "${specifier}"; an example may import only react, ${PACKAGE} or the component relatively`,
      )
      continue
    }
    const target = resolve(dirname(file), specifier)
    if (!`${target}${sep}`.startsWith(`${reactSourceDir}${sep}`)) {
      problems.push(`${at}: "${specifier}" is outside packages/react/src`)
      continue
    }
    const clause = statement.importClause
    const named = clause?.namedBindings
    if (!clause || clause.name || !named || !ts.isNamedImports(named)) {
      problems.push(
        `${at}: "${specifier}" must be imported with named imports only, as from ${PACKAGE}`,
      )
      continue
    }
    const missing = named.elements
      .map((element) => (element.propertyName ?? element.name).text)
      .filter((name) => !exportsOf().has(name))
    if (missing.length > 0) {
      problems.push(
        `${at}: ${missing.join(', ')} from "${specifier}" ${missing.length === 1 ? 'is' : 'are'} not exported by ${PACKAGE}`,
      )
      continue
    }
    const literal = statement.moduleSpecifier
    edits.push({
      start: literal.getStart(),
      end: literal.getEnd(),
      text: `'${PACKAGE}'`,
    })
  }

  if (problems.length > 0) throw new Error(problems.join('\n'))
  return edits
    .sort((a, b) => b.start - a.start)
    .reduce(
      (text, edit) =>
        text.slice(0, edit.start) + edit.text + text.slice(edit.end),
      source,
    )
}

export { reactSourceDir }

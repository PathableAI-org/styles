import type { FixtureFolderMapping } from './fixture-manifest'

export interface FixtureCoverageInput {
  /** Every fixture in `@pathableai/fixtures`, as `folder/state`. */
  fixtures: string[]
  /** Every example module, as `Component/state` (`components/<Component>/examples/<state>.tsx`). */
  examples: string[]
  /** Fixture test source files, by path. */
  testSources: Record<string, string>
  manifest: Record<string, FixtureFolderMapping>
  /** Source of `src/index.ts`. */
  indexSource: string
}

export interface FixtureCoverageResult {
  /** Problems that fail the check. */
  errors: string[]
  /** Exported React components that no fixture folder maps to yet. */
  unmappedComponents: string[]
  /** Fixture folders that the manifest does not map to a component yet. */
  unmappedFolders: string[]
}

const DEFAULT_IMPORT = /import\s+(\w+)\s+from\s+'([^']+)'/gu
const COMPARISON = /expectToRenderFixture\(\s*(\w+)\s*,\s*(\w+)\s*,?\s*\)/gu
const FIXTURE_SPECIFIER =
  /^@pathableai\/fixtures\/([a-z0-9-]+)\/([a-z0-9-]+)\.html\?raw$/u
const EXAMPLE_SPECIFIER = /^\.\.\/examples\/([a-z0-9-]+)$/u
const CALL = /expectToRenderFixture\(/gu
const SKIPPED_BY_OPTION = /\{\s*skip\s*:\s*true\b|\bskip\s*\(/u
const SKIPPED =
  /\b(?:it|test|describe)\.(?:skip|todo|fails|skipIf|runIf)\b|\bx(?:it|test|describe)\(/u
const COMMENT = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/gu
const TEST_FILE = /^components\/([^/]+)\/__tests__\//u
const COMPONENT_EXPORT = /export\s*\{([^}]*)\}\s*from\s*'\.\/components\//gu

/** Value exports from `src/index.ts` that come from `./components/`. */
export function exportedComponents(indexSource: string): string[] {
  return [...indexSource.matchAll(COMPONENT_EXPORT)].flatMap((match) =>
    match[1]
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
  )
}

export interface FixturePair {
  /** The example compared, as `Component/state`. */
  example: string
  /** The fixture it is compared with, as `folder/state`. */
  fixture: string
}

/**
 * The `expectToRenderFixture(example, fixture)` calls in a fixture test, read
 * through the test's default imports. A call is an error unless its first
 * argument is imported from `../examples/<state>` and its second from
 * `@pathableai/fixtures/<folder>/<state>.html?raw`, with the same state.
 */
export function comparisonsIn(
  file: string,
  source: string,
): { comparisons: FixturePair[]; errors: string[] } {
  const comparisons: FixturePair[] = []
  const errors: string[] = []
  const component = TEST_FILE.exec(file)?.[1]
  if (component === undefined) {
    return {
      comparisons,
      errors: [`${file} is not in components/<Component>/__tests__/`],
    }
  }
  // Commented-out calls never run, so they do not count.
  const code = source.replace(COMMENT, '')
  if (SKIPPED.test(code) || SKIPPED_BY_OPTION.test(code)) {
    errors.push(
      `${file} skips a test; a skipped comparison does not cover its fixture`,
    )
  }
  const imports = new Map(
    [...code.matchAll(DEFAULT_IMPORT)].map((match) => [match[1], match[2]]),
  )
  const calls = [...code.matchAll(CALL)].length
  const readable = [...code.matchAll(COMPARISON)].length
  if (calls !== readable) {
    errors.push(
      `${file}: every expectToRenderFixture call must take two imported names, an example and a fixture`,
    )
  }

  for (const [call, exampleName, fixtureName] of code.matchAll(COMPARISON)) {
    const example = EXAMPLE_SPECIFIER.exec(imports.get(exampleName) ?? '')
    const fixture = FIXTURE_SPECIFIER.exec(imports.get(fixtureName) ?? '')
    if (!example || !fixture) {
      errors.push(
        `${file}: ${call.replace(/\s+/gu, ' ')} must compare an import from ../examples/<state> with an import from @pathableai/fixtures/<folder>/<state>.html?raw`,
      )
    } else if (example[1] !== fixture[2]) {
      errors.push(
        `${file} compares example ${example[1]} with fixture ${fixture[1]}/${fixture[2]}; the states must match`,
      )
    } else {
      comparisons.push({
        example: `${component}/${example[1]}`,
        fixture: `${fixture[1]}/${fixture[2]}`,
      })
    }
  }
  return { comparisons, errors }
}

/**
 * Check that every fixture of a mapped folder has an example module that a
 * fixture test compares with it, or a "not offered in React" entry with a
 * reason, and that examples and tests only name fixtures that exist.
 */
export function checkFixtureCoverage({
  fixtures,
  examples,
  testSources,
  manifest,
  indexSource,
}: FixtureCoverageInput): FixtureCoverageResult {
  const errors: string[] = []
  const existing = new Set(fixtures)
  const components = exportedComponents(indexSource)
  const folderOf = new Map(
    Object.entries(manifest).map(([folder, { component }]) => [
      component,
      folder,
    ]),
  )

  const tested = new Set<string>()
  for (const [file, source] of Object.entries(testSources)) {
    const result = comparisonsIn(file, source)
    errors.push(...result.errors)
    for (const { example, fixture } of result.comparisons) {
      tested.add(fixture)
      if (!existing.has(fixture)) {
        errors.push(`${file} names fixture ${fixture}, which does not exist`)
      }
      const folder = folderOf.get(example.split('/')[0])
      if (folder !== fixture.split('/')[0]) {
        errors.push(
          `${file} compares ${example} with ${fixture}, but the fixture manifest maps ${example.split('/')[0]} to ${folder ?? 'no folder'}`,
        )
      }
    }
  }

  const exampled = new Set<string>()
  for (const example of examples) {
    const [component, state] = example.split('/')
    const folder = folderOf.get(component)
    if (folder === undefined) {
      errors.push(
        `Example ${example} belongs to ${component}, which is not in the fixture manifest`,
      )
      continue
    }
    const fixture = `${folder}/${state}`
    exampled.add(fixture)
    if (!existing.has(fixture)) {
      errors.push(
        `Example ${example} has no fixture ${fixture}; name examples after their fixture`,
      )
    } else if (!tested.has(fixture)) {
      errors.push(`Example ${example} has no fixture test naming ${fixture}`)
    }
  }

  for (const [folder, mapping] of Object.entries(manifest)) {
    if (!components.includes(mapping.component)) {
      errors.push(
        `Fixture folder ${folder} maps to ${mapping.component}, which src/index.ts does not export`,
      )
    }
    const states = fixtures
      .filter((fixture) => fixture.startsWith(`${folder}/`))
      .map((fixture) => fixture.slice(folder.length + 1))
    if (states.length === 0) {
      errors.push(`Fixture folder ${folder} has no fixtures`)
    }
    const notOffered = mapping.notOffered ?? {}
    for (const [state, reason] of Object.entries(notOffered)) {
      const fixture = `${folder}/${state}`
      if (!states.includes(state)) {
        errors.push(
          `${fixture} is listed as not offered in React, but the fixture does not exist`,
        )
      } else if (reason.trim() === '') {
        errors.push(`${fixture} is listed as not offered with no reason`)
      } else if (exampled.has(fixture)) {
        errors.push(
          `${fixture} has an example and is also listed as not offered`,
        )
      }
    }
    for (const state of states) {
      const fixture = `${folder}/${state}`
      if (!exampled.has(fixture) && !(state in notOffered)) {
        errors.push(
          `${fixture} has no example and no "not offered in React" entry`,
        )
      }
    }
  }

  const mapped = new Set(folderOf.keys())
  return {
    errors,
    unmappedComponents: components.filter((name) => !mapped.has(name)),
    unmappedFolders: [
      ...new Set(fixtures.map((fixture) => fixture.split('/')[0])),
    ].filter((folder) => !(folder in manifest)),
  }
}

import { globSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { checkFixtureCoverage } from '../fixture-coverage'
import { fixtureManifest } from '../fixture-manifest'

// Read from disk rather than imported, so the check stays out of other files'
// module graphs: `vitest --changed` then selects only the tests that use a
// changed file, and CI runs this check on every run instead.
const srcDir = fileURLToPath(new URL('../../', import.meta.url))
const fixturesDir = resolve(srcDir, '../../../fixtures')

const fixtures = globSync('*/*.html', { cwd: fixturesDir }).map((path) =>
  path.replace(/\.html$/u, ''),
)
const examples = globSync('components/*/examples/*.tsx', { cwd: srcDir }).map(
  (path) =>
    path.replace(/^components\/([^/]+)\/examples\/(.+)\.tsx$/u, '$1/$2'),
)
const testSources = Object.fromEntries(
  globSync('**/*.fixtures.test.tsx', { cwd: srcDir }).map((path) => [
    path,
    readFileSync(resolve(srcDir, path), 'utf8'),
  ]),
)
const indexSource = readFileSync(resolve(srcDir, 'index.ts'), 'utf8')

describe('fixture coverage', () => {
  it('has a fixture test or a "not offered" reason for every fixture of a mapped component', async ({
    annotate,
  }) => {
    const { errors, unmappedComponents, unmappedFolders } =
      checkFixtureCoverage({
        fixtures,
        examples,
        testSources,
        manifest: fixtureManifest,
        indexSource,
      })

    await annotate(
      `Not a failure. Fixture folders not mapped to a React component yet: ${unmappedFolders.join(', ') || 'none'}. React components with no fixture folder mapped yet: ${unmappedComponents.join(', ')}.`,
    )
    expect(errors).toEqual([])
  })
})

describe('checkFixtureCoverage', () => {
  const testFile = 'components/SrOnly/__tests__/SrOnly.fixtures.test.tsx'
  const srOnlyTest = `import headingFixture from '@pathableai/fixtures/sr-only/heading.html?raw'
import inlineFixture from '@pathableai/fixtures/sr-only/inline.html?raw'
import headingExample from '../examples/heading'
import inlineExample from '../examples/inline'
expectToRenderFixture(inlineExample, inlineFixture)
expectToRenderFixture(headingExample, headingFixture)`
  const base = {
    fixtures: ['sr-only/inline', 'sr-only/heading'],
    examples: ['SrOnly/inline', 'SrOnly/heading'],
    testSources: { [testFile]: srOnlyTest },
    manifest: { 'sr-only': { component: 'SrOnly' } },
    indexSource: `export { SrOnly } from './components/SrOnly/SrOnly.js'
export { Button, ButtonGroup } from './components/Button/Button.js'
export type { SrOnlyProps } from './components/SrOnly/SrOnly.js'`,
  }

  it('passes when every fixture has a tested example, and reports unmapped components', () => {
    expect(checkFixtureCoverage(base)).toEqual({
      errors: [],
      unmappedComponents: ['Button', 'ButtonGroup'],
      unmappedFolders: [],
    })
  })

  it('fails for a fixture with no example and no "not offered" entry', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      examples: ['SrOnly/inline'],
    })
    expect(errors).toEqual([
      'sr-only/heading has no example and no "not offered in React" entry',
    ])
  })

  it('accepts a "not offered" entry with a reason', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      examples: ['SrOnly/inline'],
      manifest: {
        'sr-only': {
          component: 'SrOnly',
          notOffered: { heading: 'Reason for the example.' },
        },
      },
    })
    expect(errors).toEqual([])
  })

  it('fails for a "not offered" entry with no reason', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      examples: ['SrOnly/inline'],
      manifest: {
        'sr-only': { component: 'SrOnly', notOffered: { heading: ' ' } },
      },
    })
    expect(errors).toEqual([
      'sr-only/heading is listed as not offered with no reason',
    ])
  })

  it('fails when an example or a test names a fixture that does not exist', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      fixtures: ['sr-only/heading'],
    })
    expect(errors).toEqual([
      `${testFile} names fixture sr-only/inline, which does not exist`,
      'Example SrOnly/inline has no fixture sr-only/inline; name examples after their fixture',
    ])
  })

  it('fails when an example has no fixture test', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      testSources: {
        [testFile]: srOnlyTest.replace(
          'expectToRenderFixture(headingExample, headingFixture)',
          '',
        ),
      },
    })
    expect(errors).toEqual([
      'Example SrOnly/heading has no fixture test naming sr-only/heading',
    ])
  })

  it('fails when a test compares an example with the fixture of another state', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      testSources: {
        [testFile]: srOnlyTest.replace(
          'expectToRenderFixture(headingExample, headingFixture)',
          'expectToRenderFixture(headingExample, inlineFixture)',
        ),
      },
    })
    expect(errors).toEqual([
      `${testFile} compares example heading with fixture sr-only/inline; the states must match`,
      'Example SrOnly/heading has no fixture test naming sr-only/heading',
    ])
  })

  it('fails when a comparison does not use an example and a fixture import', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      testSources: {
        [testFile]: `${srOnlyTest}\nexpectToRenderFixture(element, inlineFixture)`,
      },
    })
    expect(errors).toEqual([
      `${testFile}: expectToRenderFixture(element, inlineFixture) must compare an import from ../examples/<state> with an import from @pathableai/fixtures/<folder>/<state>.html?raw`,
    ])
  })

  it('does not count a commented-out comparison', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      testSources: {
        [testFile]: srOnlyTest.replace(
          'expectToRenderFixture(headingExample, headingFixture)',
          '// expectToRenderFixture(headingExample, headingFixture)',
        ),
      },
    })
    expect(errors).toEqual([
      'Example SrOnly/heading has no fixture test naming sr-only/heading',
    ])
  })

  it('fails when a fixture test is skipped', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      testSources: { [testFile]: `${srOnlyTest}\nit.skip('later', () => {})` },
    })
    expect(errors).toEqual([
      `${testFile} skips a test; a skipped comparison does not cover its fixture`,
    ])
  })

  it('fails when a fixture test is skipped through its options or context', () => {
    for (const skipped of [
      `it('later', { skip: true }, () => {})`,
      `it('later', ({ skip }) => { skip() })`,
    ]) {
      const { errors } = checkFixtureCoverage({
        ...base,
        testSources: { [testFile]: `${srOnlyTest}\n${skipped}` },
      })
      expect(errors).toEqual([
        `${testFile} skips a test; a skipped comparison does not cover its fixture`,
      ])
    }
  })

  it('reports fixture folders the manifest does not map', () => {
    const { errors, unmappedFolders } = checkFixtureCoverage({
      ...base,
      fixtures: [...base.fixtures, 'activity-list/compact'],
    })
    expect(errors).toEqual([])
    expect(unmappedFolders).toEqual(['activity-list'])
  })

  it('fails when a comparison passes inline JSX instead of an example', () => {
    const { errors } = checkFixtureCoverage({
      ...base,
      testSources: {
        [testFile]: `${srOnlyTest}\nexpectToRenderFixture(<SrOnly>Text</SrOnly>, inlineFixture)`,
      },
    })
    expect(errors).toEqual([
      `${testFile}: every expectToRenderFixture call must take two imported names, an example and a fixture`,
    ])
  })
})

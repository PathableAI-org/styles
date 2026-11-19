import assert from 'node:assert/strict'
import test from 'node:test'

import {
  REQUIRED_SECTIONS,
  checkPage,
  hasClass,
  modifiersOf,
  readStories,
  storyId,
  wrapperComponents,
} from './check-component-pages.mjs'
import { parsePage, renderIndex } from './component-pages.mjs'

const STORY = 'widgets-widget--all-variants'

const frontMatter = `---
name: Widget
slug: widget
kind: static
summary: A test widget.
styles-class: pathable-widget
canonical-story: ${STORY}
baseline: widget/all-variants
variants:
  - axis: tone
    default: plain
    values: [plain, loud]
states: []
guarantees:
  - id: looks-right
    claim: It looks right.
    evidence:
      - pixel widget/all-variants
      - play ${STORY} > is centred
---
`

const body = `
# Widget

${REQUIRED_SECTIONS.map((section) => `## ${section}\n\nText.\n`).join('\n')}

Add \`pathable-widget--loud\` to shout.

\`\`\`html
<span class="pathable-widget pathable-widget--loud"></span>
\`\`\`
`

const page = (markdown = frontMatter + body) => ({
  file: 'widget.md',
  slug: 'widget',
  markdown,
  ...parsePage(markdown),
})

const story = (steps = ['is centred']) => ({
  play: true,
  steps,
  fileSource: 'pathable-widget--loud',
})

const facts = (overrides = {}) => ({
  scss: '.pathable-widget { } .pathable-widget--loud { }',
  stories: new Map([[STORY, story()]]),
  canonicalStories: new Set([STORY]),
  baselines: new Map([['widget/all-variants', STORY]]),
  ...overrides,
})

const includes = (errors, text) => errors.some((error) => error.includes(text))

test('parses the front matter subset, CRLF included', () => {
  const { data } = parsePage((frontMatter + body).replace(/\n/gu, '\r\n'))
  assert.equal(data.name, 'Widget')
  assert.deepEqual(data.states, [])
  assert.deepEqual(data.variants, [
    { axis: 'tone', default: 'plain', values: ['plain', 'loud'] },
  ])
  assert.deepEqual(data.guarantees[0].evidence, [
    'pixel widget/all-variants',
    `play ${STORY} > is centred`,
  ])
})

test('rejects front matter outside the subset', () => {
  assert.throws(
    () => parsePage('# No front matter\n'),
    /must start with front matter/u,
  )
  assert.throws(
    () => parsePage('---\nname: A\nname: B\n---\n'),
    /Duplicate key/u,
  )
  assert.throws(() => parsePage('---\nname\n---\n'), /Expected "key: value"/u)
  assert.throws(() => parsePage('---\nlist:\n---\n'), /no value/u)
})

test('a page that agrees with the code passes', () => {
  assert.deepEqual(checkPage(page(), facts()), [])
})

test('reports a class or variant the styles source does not have', () => {
  const errors = checkPage(page(), facts({ scss: '.pathable-other { }' }))
  assert.ok(includes(errors, 'styles-class "pathable-widget" has no rule'))
  assert.ok(includes(errors, 'no .pathable-widget--loud rule'))
  assert.ok(includes(errors, 'the html example uses .pathable-widget--loud'))
  assert.ok(includes(errors, 'the page names `pathable-widget--loud`'))
})

test('reports a modifier the page leaves out', () => {
  const scss = `${facts().scss} .pathable-widget--quiet { }`
  assert.deepEqual(checkPage(page(), facts({ scss })), [
    'the styles source defines .pathable-widget--quiet, which is not a variant on the page',
  ])
})

test('reports a default that has a modifier rule', () => {
  const scss = `${facts().scss} .pathable-widget--plain { }`
  const errors = checkPage(page(), facts({ scss }))
  assert.ok(includes(errors, 'the default has a .pathable-widget--plain rule'))
})

test('reports a variant the page body or the story leaves out', () => {
  const quiet = page(
    frontMatter + body.replace('Add `pathable-widget--loud` to shout.', ''),
  )
  assert.ok(includes(checkPage(quiet, facts()), 'the page body never names'))

  const unrendered = new Map([[STORY, { ...story(), fileSource: '' }]])
  assert.ok(
    includes(
      checkPage(page(), facts({ stories: unrendered })),
      "the canonical story's file never renders .pathable-widget--loud",
    ),
  )
})

test('reports a canonical story or baseline that does not line up', () => {
  const errors = checkPage(
    page(),
    facts({
      canonicalStories: new Set(),
      baselines: new Map([['widget/all-variants', 'widgets-widget--other']]),
    }),
  )
  assert.ok(includes(errors, "is not in the quality gates' CANONICAL_STORIES"))
  assert.ok(includes(errors, 'captures "widgets-widget--other"'))
})

test('reports guarantees without evidence', () => {
  const errors = checkPage(
    page(),
    facts({
      baselines: new Map(),
      stories: new Map([[STORY, story([])]]),
    }),
  )
  assert.ok(
    includes(errors, 'no committed pixel baseline "widget/all-variants"'),
  )
  assert.ok(includes(errors, 'has no step "is centred"'))

  const prefixed = page(
    frontMatter.replace(`play ${STORY} >`, `play styles/${STORY} >`) + body,
  )
  assert.ok(
    includes(checkPage(prefixed, facts()), `no story "styles/${STORY}"`),
  )
})

test('a static component may not list states', () => {
  const markdown = frontMatter.replace(
    'states: []',
    `states:\n  - name: hover\n    story: ${STORY}`,
  )
  const errors = checkPage(page(markdown + body), facts())
  assert.deepEqual(errors, [
    'a static component has no states; mark it behavioural instead',
  ])
})

test('consumer pages must not mention usa-* classes', () => {
  const errors = checkPage(
    page(`${frontMatter + body}\nAlso usa-button.\n`),
    facts(),
  )
  assert.deepEqual(errors, [
    'consumer-facing pages must not mention usa-* classes',
  ])
})

test('reports missing fields before anything else', () => {
  const errors = checkPage(
    page(frontMatter.replace('kind: static\n', '') + body),
    facts(),
  )
  assert.deepEqual(errors, ['missing front matter field "kind"'])
})

test('derives Storybook ids and steps from CSF source', () => {
  assert.equal(
    storyId('Interaction Controls/Icon Tile', 'AllVariants'),
    'interaction-controls-icon-tile--all-variants',
  )
  const stories = readStories(`export default { title: 'A/B' }
export const AllVariants = {
  play: async ({ step }) => { await step('is centred', async () => {}) },
}
export const Default = AllVariants
export const Plain = {}
`)
  assert.deepEqual(
    stories.map(({ id, play, steps }) => ({ id, play, steps })),
    [
      { id: 'a-b--all-variants', play: true, steps: ['is centred'] },
      { id: 'a-b--default', play: true, steps: ['is centred'] },
      { id: 'a-b--plain', play: false, steps: [] },
    ],
  )
})

test('reads classes and modifiers from stylesheet source', () => {
  const scss = '.pathable-widget--loud {} .pathable-widget--loud:hover {}'
  assert.ok(hasClass(scss, 'pathable-widget--loud'))
  assert.ok(!hasClass('.pathable-widget--loudest {}', 'pathable-widget--loud'))
  assert.deepEqual(modifiersOf(scss, 'pathable-widget'), ['loud'])
})

test('counts only wrapper files named after the class they define', () => {
  assert.deepEqual(
    wrapperComponents([
      { name: 'pathable-widget', source: '.pathable-widget { }' },
      { name: 'pathable-all', source: "@forward 'pathable-widget';" },
      { name: '_index', source: '' },
    ]),
    ['pathable-widget'],
  )
})

test('renders the index from front matter', () => {
  assert.match(
    renderIndex([page()]),
    /\| \[Widget\]\(widget\.md\) \| static \| A test widget\. \| `pathable-widget` \|/u,
  )
})

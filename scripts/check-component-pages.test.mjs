import assert from 'node:assert/strict'
import test from 'node:test'

import {
  REQUIRED_SECTIONS,
  checkPage,
  hasClass,
  readStories,
  storyId,
} from './check-component-pages.mjs'
import { parsePage, renderIndex } from './component-pages.mjs'

const frontMatter = `---
name: Widget
slug: widget
kind: static
summary: A test widget.
styles-class: pathable-widget
react-export: Widget
canonical-story: widgets-widget--all-variants
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
      - play styles/widgets-widget--all-variants > is centred
---
`

const body = `
# Widget

${REQUIRED_SECTIONS.map((section) => `## ${section}\n\nText.\n`).join('\n')}

\`\`\`tsx
export const x = 1
\`\`\`

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
  fileSource: "'plain' 'loud' pathable-widget--loud",
})

const facts = (overrides = {}) => ({
  scss: '.pathable-widget { } .pathable-widget--loud { }',
  stories: {
    styles: new Map([['widgets-widget--all-variants', story()]]),
    react: new Map([['widgets-widget--all-variants', story()]]),
  },
  canonicalStories: new Set(['widgets-widget--all-variants']),
  baselines: new Map([['widget/all-variants', 'widgets-widget--all-variants']]),
  reactExports: new Map([
    [
      'Widget',
      {
        props: new Map([
          ['tone', { values: ['plain', 'loud'], default: 'plain' }],
        ]),
      },
    ],
  ]),
  compileExample: () => [],
  ...overrides,
})

test('parses the front matter subset, CRLF included', () => {
  const { data } = parsePage((frontMatter + body).replace(/\n/gu, '\r\n'))
  assert.equal(data.name, 'Widget')
  assert.deepEqual(data.states, [])
  assert.deepEqual(data.variants, [
    { axis: 'tone', default: 'plain', values: ['plain', 'loud'] },
  ])
  assert.deepEqual(data.guarantees[0].evidence, [
    'pixel widget/all-variants',
    'play styles/widgets-widget--all-variants > is centred',
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

test('reports variants the code does not have', () => {
  const errors = checkPage(
    page(),
    facts({
      scss: '.pathable-widget { }',
      reactExports: new Map([
        [
          'Widget',
          {
            props: new Map([['tone', { values: ['plain'], default: 'loud' }]]),
          },
        ],
      ]),
    }),
  )
  assert.ok(
    errors.some((error) => error.includes('no .pathable-widget--loud rule')),
  )
  assert.ok(
    errors.some((error) => error.includes('React does not accept loud')),
  )
  assert.ok(errors.some((error) => error.includes('React defaults to "loud"')))
  assert.ok(
    errors.some((error) => error.includes('uses .pathable-widget--loud')),
  )
})

test('reports a react export that does not exist', () => {
  const errors = checkPage(page(), facts({ reactExports: new Map() }))
  assert.ok(
    errors.some((error) =>
      error.includes('react-export "Widget" is not exported'),
    ),
  )
})

test('reports guarantees without evidence', () => {
  const errors = checkPage(
    page(),
    facts({
      baselines: new Map(),
      stories: {
        styles: new Map([['widgets-widget--all-variants', story([])]]),
        react: new Map([['widgets-widget--all-variants', story()]]),
      },
    }),
  )
  assert.ok(
    errors.some((error) =>
      error.includes('no committed pixel baseline "widget/all-variants"'),
    ),
  )
  assert.ok(errors.some((error) => error.includes('has no step "is centred"')))
})

test('reports an example that does not compile', () => {
  const errors = checkPage(
    page(),
    facts({ compileExample: () => ['Bad prop'] }),
  )
  assert.deepEqual(errors, ['the tsx example does not compile: Bad prop'])
})

test('a static component may not list states', () => {
  const markdown = frontMatter.replace(
    'states: []',
    'states:\n  - name: hover\n    story: styles/widgets-widget--all-variants',
  )
  const errors = checkPage(page(markdown + body), facts())
  assert.ok(
    errors.includes(
      'a static component has no states; mark it behavioural instead',
    ),
  )
})

test('consumer pages must not mention usa-* classes', () => {
  const errors = checkPage(
    page(`${frontMatter + body}\nAlso usa-button.\n`),
    facts(),
  )
  assert.ok(
    errors.includes('consumer-facing pages must not mention usa-* classes'),
  )
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

test('matches whole class names only', () => {
  assert.ok(hasClass('.pathable-widget--loud {}', 'pathable-widget--loud'))
  assert.ok(!hasClass('.pathable-widget--loudest {}', 'pathable-widget--loud'))
})

test('renders the index from front matter', () => {
  const index = renderIndex([page()])
  assert.match(
    index,
    /\| \[Widget\]\(widget\.md\) \| static \| A test widget\. \| `pathable-widget` \| `Widget` +\|/u,
  )
})

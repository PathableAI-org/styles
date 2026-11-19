import assert from 'node:assert/strict'
import test from 'node:test'

import {
  REQUIRED_SECTIONS,
  checkCitations,
  checkPage,
  hasClass,
  modifiersOf,
  pixelCitations,
  readStoryFile,
  renderTrace,
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
variants:
  - axis: tone
    default: plain
    values: [plain, loud]
states: []
guarantees:
  - id: looks-right
    claim: It looks right.
  - id: is-centred
    claim: It is centred.
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

const pixel = (id = 'widget/looks-right') => ({
  id,
  kind: 'pixel',
  story: STORY,
  source: `baseline widget/all-variants of ${STORY}`,
  problems: [],
})

const play = (id = 'widget/is-centred') => ({
  id,
  kind: 'play',
  story: STORY,
  source: `${STORY} (Widget.stories.ts)`,
  problems: [],
})

const facts = (overrides = {}) => ({
  scss: '.pathable-widget { } .pathable-widget--loud { }',
  stories: new Map([[STORY, 'pathable-widget--loud']]),
  citations: [pixel(), play()],
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
  assert.deepEqual(data.guarantees, [
    { id: 'looks-right', claim: 'It looks right.' },
    { id: 'is-centred', claim: 'It is centred.' },
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

test('a page that agrees with the code and is cited by tests passes', () => {
  assert.deepEqual(checkPage(page(), facts()), [])
  assert.deepEqual(checkCitations([page()], facts().citations), [])
})

test('fails when no test cites a guarantee', () => {
  assert.deepEqual(checkPage(page(), facts({ citations: [pixel()] })), [
    'guarantee "is-centred" is cited by no test: cite "widget/is-centred" from a play step (guarantee) or a pixel entry (covers)',
  ])
})

test('fails when a test cites a page or guarantee that does not exist', () => {
  const errors = checkCitations(
    [page()],
    [
      play('widget/is-centered'),
      pixel('gadget/looks-right'),
      play('widget'),
      { ...pixel(), problems: ['the baseline x/desktop.png is not committed'] },
    ],
  )
  assert.deepEqual(errors, [
    `${STORY} (Widget.stories.ts) cites "widget/is-centered", but widget.md has no guarantee "is-centered"`,
    `baseline widget/all-variants of ${STORY} cites "gadget/looks-right", but there is no component page "gadget.md"`,
    `${STORY} (Widget.stories.ts) cites "widget", which is not "<page>/<guarantee-id>"`,
    `baseline widget/all-variants of ${STORY} cites "widget/looks-right": the baseline x/desktop.png is not committed`,
  ])
})

test('a static component needs a pixel citation', () => {
  const citations = [play('widget/looks-right'), play()]
  assert.deepEqual(checkPage(page(), facts({ citations })), [
    'a static component needs a pixel baseline: no pixel entry covers a guarantee of this page',
  ])
})

test('evidence does not belong on the page', () => {
  const markdown = frontMatter.replace(
    '    claim: It looks right.\n',
    '    claim: It looks right.\n    evidence: [pixel widget/all-variants]\n',
  )
  const errors = checkPage(page(markdown + body), facts())
  assert.ok(includes(errors, 'only "id" and "claim" belong on the page'))
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

test('reports a variant the page body or the pixel story leaves out', () => {
  const quiet = page(
    frontMatter + body.replace('Add `pathable-widget--loud` to shout.', ''),
  )
  assert.ok(includes(checkPage(quiet, facts()), 'the page body never names'))

  assert.deepEqual(
    checkPage(page(), facts({ stories: new Map([[STORY, '']]) })),
    [
      'variant "tone=loud": no story with a pixel baseline covering this page renders .pathable-widget--loud',
    ],
  )
})

test('a static component may not list states, and a state needs a story', () => {
  const withState = (story) =>
    page(
      frontMatter.replace(
        'states: []',
        `states:\n  - name: hover\n    story: ${story}`,
      ) + body,
    )
  assert.deepEqual(checkPage(withState(STORY), facts()), [
    'a static component has no states; mark it behavioural instead',
  ])
  assert.ok(includes(checkPage(withState('nope'), facts()), 'no story "nope"'))
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

test('reads story ids and guarantee calls from the syntax tree', () => {
  assert.equal(
    storyId('Interaction Controls/Icon Tile', 'AllVariants'),
    'interaction-controls-icon-tile--all-variants',
  )
  const { stories, citations } = readStoryFile(
    `import { guarantee } from '../shared/guarantee'
const meta = { title: 'A/B' } satisfies Meta
export default meta
// guarantee(step, 'a/in-a-comment', async () => {})
const text = "guarantee(step, 'a/in-a-string', async () => {})"
export const AllVariants = {
  play: async ({ step }) => {
    await guarantee(step, 'a/centred', async () => {})
  },
}
export const Default = AllVariants
export const Dynamic = {
  play: async ({ step }) => { await guarantee(step, id, async () => {}) },
}
const helper = (step) => guarantee(step, 'a/hidden', async () => {})
`,
    'B.stories.ts',
  )
  assert.deepEqual(stories, [
    'a-b--all-variants',
    'a-b--default',
    'a-b--dynamic',
  ])
  assert.deepEqual(
    citations.map(({ id, story, problems }) => ({ id, story, problems })),
    [
      { id: 'a/centred', story: 'a-b--all-variants', problems: [] },
      {
        id: '?',
        story: 'a-b--dynamic',
        problems: ['the id must be a string literal'],
      },
      {
        id: 'a/hidden',
        story: undefined,
        problems: [
          "call guarantee() directly in a story's play function, so the story is known",
        ],
      },
    ],
  )
})

test('reads pixel citations from covers and requires the images', () => {
  const entries = [
    { id: STORY, key: 'widget/all-variants', covers: ['widget/looks-right'] },
    { id: 'other--story', key: 'other/story' },
  ]
  const citations = pixelCitations(entries, {
    viewportsOf: () => ['desktop', 'mobile'],
    hasBaseline: (key, viewport) => viewport === 'desktop',
  })
  assert.deepEqual(citations, [
    {
      id: 'widget/looks-right',
      kind: 'pixel',
      story: STORY,
      source: `baseline widget/all-variants of ${STORY}`,
      problems: [
        'the baseline widget/all-variants/mobile.png is not committed',
      ],
    },
  ])
})

test('prints which test cites each guarantee', () => {
  assert.equal(
    renderTrace([page()], [pixel()]),
    [
      'Widget (widget.md)',
      '  looks-right: It looks right.',
      `    pixel baseline widget/all-variants of ${STORY}`,
      '  is-centred: It is centred.',
      '    (no test cites this)',
    ].join('\n'),
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

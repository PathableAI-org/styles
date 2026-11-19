import assert from 'node:assert/strict'
import test from 'node:test'

import {
  REQUIRED_SECTIONS,
  checkExecuted,
  checkPage,
  checkPixelCitations,
  currentRecords,
  modifiersOf,
  readCss,
  readPixels,
  renderTrace,
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
guarantees:
  - id: looks-right
    claim: It looks right.
  - id: is-centred
    claim: It is centred.
  - id: glows
    status: unmet
    claim: It glows.
---
`

const body = `
# Widget

A test widget. It does little.

${REQUIRED_SECTIONS.filter((name) => name !== 'Variants')
  .map((name) => `## ${name}\n\nText.\n`)
  .join('\n')}

Its colour is \`--widget-colour\`.

\`\`\`html
<span class="pathable-widget pathable-widget--loud"></span>
\`\`\`

## Variants

| Axis | Value   | Class                   | What it is for |
| ---- | ------- | ----------------------- | -------------- |
| tone | \`plain\` | none                    | Most places    |
| tone | \`loud\`  | \`pathable-widget--loud\` | Shouting       |
`

const page = (markdown = frontMatter + body) => ({
  file: 'widget.md',
  slug: 'widget',
  markdown,
  ...parsePage(markdown),
})

const css = (extra = '') =>
  readCss(`
    /* .pathable-widget--ghost is only named in this comment */
    .pathable-widget { color: var(--widget-colour, red); }
    .pathable-widget--loud { font-weight: bold; }
    ${extra}
  `)

const pixel = (overrides = {}) => ({
  id: STORY,
  key: 'widget/all-variants',
  covers: ['widget/looks-right'],
  enforced: true,
  missing: [],
  ...overrides,
})

const record = (overrides = {}) => ({
  story: STORY,
  guarantees: [{ id: 'widget/is-centred', mode: 'met' }],
  classes: ['pathable-widget', 'pathable-widget--loud'],
  ...overrides,
})

const facts = (overrides = {}) => ({
  css: css(),
  pixels: [pixel()],
  ...overrides,
})

const includes = (errors, text) => errors.some((error) => error.includes(text))

// --- Front matter ---------------------------------------------------------

test('parses front matter as YAML, CRLF and wrapped flow lists included', () => {
  // Prettier wraps a long flow list over several lines; YAML allows that.
  const wrapped = frontMatter.replace(
    '    values: [plain, loud]',
    '    values:\n      [\n        plain,\n        loud,\n      ]',
  )
  const { data } = parsePage((wrapped + body).replace(/\n/gu, '\r\n'))
  assert.deepEqual(data.variants, [
    { axis: 'tone', default: 'plain', values: ['plain', 'loud'] },
  ])
  assert.deepEqual(data.guarantees[2], {
    id: 'glows',
    status: 'unmet',
    claim: 'It glows.',
  })
})

test('rejects a page without a front matter mapping', () => {
  assert.throws(() => parsePage('# No front matter\n'), /front matter/u)
  assert.throws(() => parsePage('---\n- a\n---\n'), /YAML mapping/u)
})

test('reports unknown and missing fields before anything else', () => {
  const missing = page(frontMatter.replace('kind: static\n', '') + body)
  assert.deepEqual(checkPage(missing, facts()), [
    'missing front matter field "kind"',
  ])
  const extra = page(
    frontMatter.replace('kind: static', 'kind: static\nstates: []') + body,
  )
  assert.deepEqual(checkPage(extra, facts()), [
    'unknown front matter field "states"',
  ])
  const behavioural = page(frontMatter.replace('static', 'behavioural') + body)
  assert.ok(
    includes(checkPage(behavioural, facts()), 'kind must be one of static'),
  )
})

test('a guarantee holds only id, claim and status', () => {
  const evidence = page(
    frontMatter.replace(
      '    claim: It looks right.\n',
      '    claim: It looks right.\n    evidence: [pixel widget/all-variants]\n',
    ) + body,
  )
  assert.ok(
    includes(checkPage(evidence, facts()), 'only "id", "claim" and "status"'),
  )
  const status = page(
    frontMatter.replace('status: unmet', 'status: broken') + body,
  )
  assert.ok(includes(checkPage(status, facts()), 'status must be met or unmet'))
})

// --- Stage 1: compiled CSS ------------------------------------------------

test('a page that agrees with the compiled CSS passes stage 1', () => {
  assert.deepEqual(checkPage(page(), facts()), [])
  assert.deepEqual(checkPixelCitations([page()], [pixel()]), [])
})

test('reads classes from selectors, not from comments', () => {
  const parsed = css('.card .pathable-widget--loud:hover > .other { }')
  assert.ok(parsed.classes.has('pathable-widget--loud'))
  assert.ok(parsed.classes.has('other'))
  assert.ok(!parsed.classes.has('pathable-widget--ghost'))
  assert.deepEqual(modifiersOf(parsed, 'pathable-widget'), ['loud'])
})

test('a modifier named only in a comment does not count as defined', () => {
  const onlyComment = readCss(`
    /* .pathable-widget--loud — the loud one */
    .pathable-widget { color: var(--widget-colour); }
  `)
  const errors = checkPage(page(), facts({ css: onlyComment }))
  assert.ok(
    includes(errors, 'no .pathable-widget--loud rule in the compiled CSS'),
  )
  assert.ok(includes(errors, 'the html example uses .pathable-widget--loud'))
})

test('reports a modifier the page leaves out, and a default with a rule', () => {
  assert.deepEqual(
    checkPage(page(), facts({ css: css('.pathable-widget--quiet { }') })),
    [
      'the compiled CSS has .pathable-widget--quiet, which is not a variant on the page',
    ],
  )
  assert.ok(
    includes(
      checkPage(page(), facts({ css: css('.pathable-widget--plain { }') })),
      'the default has a .pathable-widget--plain rule',
    ),
  )
})

test('the body must agree with the front matter it repeats', () => {
  const summary = page(frontMatter + body.replace('A test widget. It', 'It'))
  assert.deepEqual(checkPage(summary, facts()), [
    'the paragraph under the title must start with the front matter summary',
  ])

  const wrongClass = page(
    frontMatter + body.replace('| none  ', '| `pathable-widget--plain`'),
  )
  assert.ok(
    includes(checkPage(wrongClass, facts()), 'the front matter means none'),
  )

  const noRow = page(frontMatter + body.replace(/^\| tone \| `loud`.*\n/mu, ''))
  assert.deepEqual(checkPage(noRow, facts()), [
    'the Variants table has no row for tone | `loud`',
  ])

  const extraRow = page(
    `${frontMatter + body}| tone | \`huge\` | none | Never |\n`,
  )
  assert.deepEqual(checkPage(extraRow, facts()), [
    'the Variants table has a row for tone | `huge`, which is not in the front matter',
  ])
})

test('classes and tokens named in prose must exist', () => {
  const errors = checkPage(
    page(
      `${frontMatter + body}\nUse \`pathable-gadget\` and \`--gadget-colour\`.\n`,
    ),
    facts(),
  )
  assert.deepEqual(errors, [
    'the page names `pathable-gadget`, which the compiled CSS does not define',
    "the page names `--gadget-colour`, which the component's rules do not use",
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

// --- Stage 1: pixel citations ---------------------------------------------

test('a pixel citation must resolve, be enforced and have its images', () => {
  const pixels = [
    pixel({ covers: ['widget/looks-wrong', 'gadget/looks-right', 'widget'] }),
    pixel({ key: 'other/thing', enforced: false }),
    pixel({ missing: ['widget/all-variants/mobile.png'] }),
    pixel({ covers: ['widget/glows'] }),
  ]
  assert.deepEqual(checkPixelCitations([page()], pixels), [
    'pixel entry widget/all-variants cites "widget/looks-wrong", but widget.md has no guarantee "looks-wrong"',
    'pixel entry widget/all-variants cites "gadget/looks-right", but there is no component page "gadget.md"',
    'pixel entry widget/all-variants cites "widget", which is not "<page>/<guarantee-id>"',
    'pixel entry other/thing cites "widget/looks-right", but "other" is not on ROLLOUT, so the suite never compares this baseline',
    'pixel entry widget/all-variants cites "widget/looks-right", but the baseline widget/all-variants/mobile.png is not committed',
    'pixel entry widget/all-variants cites "widget/glows", which is unmet: a baseline cannot be expected to fail; cite it with guarantee.unmet() in a play function',
  ])
})

test('a static page needs an enforced pixel citation', () => {
  for (const pixels of [[], [pixel({ enforced: false })]]) {
    assert.deepEqual(checkPage(page(), facts({ pixels })), [
      'a static component needs a pixel baseline: no enforced pixel entry covers a guarantee of this page. While tests are still being written, mark the guarantees no test cites "status: unverified"',
    ])
  }
})

test('reads which pixel entries are enforced and which images are missing', () => {
  const pixels = readPixels({
    stories: [
      { id: STORY, key: 'widget/all-variants' },
      { id: 'other--story', key: 'other/story' },
    ],
    rollout: ['widget'],
    viewportsOf: () => ['desktop', 'mobile'],
    hasImage: (image) => image.endsWith('desktop.png'),
  })
  assert.deepEqual(
    pixels.map(({ enforced, missing }) => ({ enforced, missing })),
    [
      { enforced: true, missing: ['widget/all-variants/mobile.png'] },
      { enforced: false, missing: ['other/story/mobile.png'] },
    ],
  )
})

// --- Stage 2: what ran ----------------------------------------------------

test('passes when every met guarantee ran or is pictured', () => {
  assert.deepEqual(checkExecuted([page()], [record()], [pixel()]), [])
})

test('fails when no test that ran covers a met guarantee', () => {
  // The source may still contain a guarantee() call that never executes:
  // only the record of what ran counts.
  const idle = record({ guarantees: [] })
  assert.deepEqual(checkExecuted([page()], [idle], [pixel()]), [
    'widget.md: guarantee "is-centred" is met but no test covers it: no play function executed guarantee(step, \'widget/is-centred\', …) and no enforced pixel entry lists it in covers. Mark it "status: unverified" if it holds but no test exists yet, or "status: unmet" if the component does not do this yet',
  ])
})

test('an unmet guarantee may have no test, or an expected-to-fail one', () => {
  const failing = record({
    guarantees: [
      { id: 'widget/is-centred', mode: 'met' },
      { id: 'widget/glows', mode: 'unmet' },
    ],
  })
  assert.deepEqual(checkExecuted([page()], [failing], [pixel()]), [])
})

test('fails when the form of the citation disagrees with the status', () => {
  const swapped = record({
    guarantees: [
      { id: 'widget/is-centred', mode: 'unmet' },
      { id: 'widget/glows', mode: 'met' },
    ],
  })
  assert.deepEqual(checkExecuted([page()], [swapped], [pixel()]), [
    `story ${STORY} executed "widget/is-centred" with guarantee.unmet(), but the page does not mark it unmet`,
    `story ${STORY} executed "widget/glows" with guarantee(), but the page marks it unmet: use guarantee.unmet(), or set its status to met`,
  ])
})

test('fails when a test that ran cites an id no page defines', () => {
  const unknown = record({
    guarantees: [
      { id: 'widget/is-centred', mode: 'met' },
      { id: 'widget/is-centered', mode: 'met' },
      { id: 'gadget/x', mode: 'met' },
    ],
  })
  assert.deepEqual(checkExecuted([page()], [unknown], [pixel()]), [
    `story ${STORY} executed "widget/is-centered", but widget.md has no guarantee "is-centered"`,
    `story ${STORY} executed "gadget/x", but there is no component page "gadget.md"`,
  ])
})

test('the pictured story must have rendered every variant', () => {
  const plainOnly = record({ classes: ['pathable-widget'] })
  assert.deepEqual(checkExecuted([page()], [plainOnly], [pixel()]), [
    `widget.md: no story whose pixel baseline covers this page rendered .pathable-widget--loud (${STORY})`,
  ])
  // Another story rendering it does not help: the picture is of this one.
  const elsewhere = record({ story: 'widgets-widget--loud', guarantees: [] })
  assert.ok(
    includes(
      checkExecuted([page()], [plainOnly, elsewhere], [pixel()]),
      'rendered .pathable-widget--loud',
    ),
  )
  assert.deepEqual(
    checkExecuted(
      [page()],
      [{ ...record(), story: 'another--story' }],
      [pixel()],
    ),
    [
      `widget.md: no record of story ${STORY}, whose pixel baseline covers this page; run pnpm test:storybook-styles`,
    ],
  )
})

// --- Trace, coverage, index -----------------------------------------------

test('prints which test cites each guarantee, unmet ones marked', () => {
  const failing = record({
    guarantees: [{ id: 'widget/glows', mode: 'unmet' }],
  })
  assert.equal(
    renderTrace([page()], [pixel()], [failing]),
    [
      'Widget (widget.md)',
      '  looks-right: It looks right.',
      `    pixel  baseline widget/all-variants of ${STORY}`,
      '  is-centred: It is centred.',
      '    (no test)',
      '  [UNMET] glows: It glows.',
      `    play   ${STORY} (expected to fail)`,
    ].join('\n'),
  )
})

const unverifiedPage = () =>
  page(
    (frontMatter + body).replace(
      '    claim: It is centred.',
      '    status: unverified\n    claim: It is centred.',
    ),
  )

test('a page with an unverified guarantee owes no baseline and no test yet', () => {
  assert.deepEqual(checkPage(unverifiedPage(), facts({ pixels: [] })), [])
  const ran = record({
    guarantees: [
      { id: 'widget/looks-right', mode: 'met' },
      { id: 'widget/glows', mode: 'unmet' },
    ],
  })
  assert.deepEqual(checkExecuted([unverifiedPage()], [ran], []), [])
})

test('a test that cites an unverified guarantee makes the page say so', () => {
  const ran = record({
    guarantees: [
      { id: 'widget/looks-right', mode: 'met' },
      { id: 'widget/is-centred', mode: 'met' },
      { id: 'widget/glows', mode: 'unmet' },
    ],
  })
  assert.deepEqual(checkExecuted([unverifiedPage()], [ran], []), [
    `story ${STORY} executed "widget/is-centred", which the page marks unverified: a test now cites it, so set its status to met`,
  ])
  assert.deepEqual(
    checkPixelCitations(
      [unverifiedPage()],
      [pixel({ covers: ['widget/is-centred'] })],
    ),
    [
      'pixel entry widget/all-variants cites "widget/is-centred", which the page marks unverified: a test now cites it, so set its status to met',
    ],
  )
})

test('drops the record of a story the built Storybook no longer has', () => {
  const build = { storyIds: new Set([STORY]), builtAt: 100 }
  const kept = { story: STORY, guarantees: [], classes: [] }
  const removed = { story: 'widgets-widget--deleted', guarantees: [] }
  assert.deepEqual(
    currentRecords(
      [
        { record: kept, writtenAt: 200 },
        { record: removed, writtenAt: 200 },
      ],
      build,
    ),
    { records: [kept], errors: [] },
  )
})

test('rejects a record written before the Storybook was built', () => {
  const build = { storyIds: new Set([STORY]), builtAt: 100 }
  const stale = { story: STORY, guarantees: [], classes: [] }
  const { records, errors } = currentRecords(
    [{ record: stale, writtenAt: 50 }],
    build,
  )
  assert.deepEqual(records, [])
  assert.equal(errors.length, 1)
  assert.match(errors[0], /is older than the Storybook build/u)
})

test('counts only wrapper files named after a class the CSS defines', () => {
  assert.deepEqual(
    wrapperComponents(
      ['pathable-widget.scss', 'pathable-all.scss', '_index.scss'],
      css(),
    ),
    ['pathable-widget'],
  )
})

test('renders the index as one unpadded line per page', () => {
  assert.ok(
    renderIndex([page()]).includes(
      '\n- [Widget](widget.md) (`pathable-widget`, static): A test widget.\n',
    ),
  )
})

test('the index explains the unmet and unverified guarantee statuses', () => {
  const index = renderIndex([page()]).replace(/\n/g, ' ')

  assert.match(index, /status: unmet` is expected behaviour.*do not rely on it/)
  assert.match(index, /status: unverified` was read from the package source/)
})

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  REQUIRED_SECTIONS,
  SETTINGS_SECTIONS,
  SETTINGS_VALUES_SECTION,
  TOKEN_SECTIONS,
  UTILITY_SECTIONS,
  checkExecuted,
  checkPage,
  currentRecords,
  modifiersOf,
  readCss,
  readUtilityClasses,
  renderForCheck,
  renderTrace,
  undeclaredUtilityClasses,
  utilityPatterns,
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
    .pathable-widget { color: red; }
    .pathable-widget--loud { font-weight: bold; }
    ${extra}
  `)

const record = (overrides = {}) => ({
  story: STORY,
  guarantees: [
    { id: 'widget/looks-right', mode: 'met' },
    { id: 'widget/is-centred', mode: 'met' },
  ],
  classes: ['pathable-widget', 'pathable-widget--loud'],
  ...overrides,
})

const facts = (overrides = {}) => ({
  css: css(),
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
      '    claim: It looks right.\n    evidence: [play widget/all-variants]\n',
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
    .pathable-widget { color: red; }
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

test('classes named in prose must exist, and no custom property is named', () => {
  const errors = checkPage(
    page(
      `${frontMatter + body}\nUse \`pathable-gadget\` and \`--gadget-colour\`.\n`,
    ),
    facts(),
  )
  assert.deepEqual(errors, [
    'the page names `pathable-gadget`, which the compiled CSS does not define',
    'the page names `--gadget-colour`, but a page names no custom property: none is public',
  ])
})

test('a static page naming a custom property in prose fails', () => {
  // The CSS rule for the page's class reads the property, and the page still
  // may not name it: no property is public, used or not.
  const reading = css('.pathable-widget { color: var(--pathable-color-text); }')
  const errors = checkPage(
    page(`${frontMatter + body}\nSet \`--pathable-color-text\`.\n`),
    facts({ css: reading }),
  )
  assert.deepEqual(errors, [
    'the page names `--pathable-color-text`, but a page names no custom property: none is public',
  ])
})

test('a guarantee claim naming a custom property fails', () => {
  const claimed = (claim) =>
    checkPage(
      page(frontMatter.replace('It looks right.', claim) + body),
      facts(),
    )
  const expected = [
    'guarantee "looks-right" names `--pathable-color-text`, but a page names no custom property: none is public',
  ]
  assert.deepEqual(claimed('Text uses `--pathable-color-text`.'), expected)
  assert.deepEqual(claimed('Text uses var(--pathable-color-text).'), expected)
  assert.deepEqual(claimed('The pathable-widget--big class is wide.'), [])
})

test('a claim cut short by a YAML comment fails, and passes once quoted', () => {
  const claim = 'It is #4899e8 when active.'
  const withClaim = (text) =>
    checkPage(
      page(frontMatter.replace('It looks right.', text) + body),
      facts(),
    )
  assert.deepEqual(withClaim(claim), [
    'guarantee "looks-right": the claim stops before " #", which YAML reads as a comment; quote the claim',
  ])
  assert.deepEqual(withClaim(`'${claim}'`), [])
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

// --- Stage 2: what ran ----------------------------------------------------

test('passes when every met guarantee ran', () => {
  assert.deepEqual(checkExecuted([page()], [record()]), [])
})

test('fails when no test that ran covers a met guarantee', () => {
  // The source may still contain a guarantee() call that never executes:
  // only the record of what ran counts.
  const idle = record({
    guarantees: [{ id: 'widget/looks-right', mode: 'met' }],
  })
  assert.deepEqual(checkExecuted([page()], [idle]), [
    'widget.md: guarantee "is-centred" is met but no test covers it: no play function executed guarantee(step, \'widget/is-centred\', …). Mark it "status: unverified" if it holds but no test exists yet, or "status: unmet" if the component does not do this yet',
  ])
})

test('an unmet guarantee may have no test, or an expected-to-fail one', () => {
  const failing = record({
    guarantees: [
      { id: 'widget/looks-right', mode: 'met' },
      { id: 'widget/is-centred', mode: 'met' },
      { id: 'widget/glows', mode: 'unmet' },
    ],
  })
  assert.deepEqual(checkExecuted([page()], [failing]), [])
})

test('fails when the form of the citation disagrees with the status', () => {
  const swapped = record({
    guarantees: [
      { id: 'widget/looks-right', mode: 'met' },
      { id: 'widget/is-centred', mode: 'unmet' },
      { id: 'widget/glows', mode: 'met' },
    ],
  })
  assert.deepEqual(checkExecuted([page()], [swapped]), [
    `story ${STORY} executed "widget/is-centred" with guarantee.unmet(), but the page does not mark it unmet`,
    `story ${STORY} executed "widget/glows" with guarantee(), but the page marks it unmet: use guarantee.unmet(), or set its status to met`,
  ])
})

test('fails when a test that ran cites an id no page defines', () => {
  const unknown = record({
    guarantees: [
      { id: 'widget/looks-right', mode: 'met' },
      { id: 'widget/is-centred', mode: 'met' },
      { id: 'widget/is-centered', mode: 'met' },
      { id: 'gadget/x', mode: 'met' },
    ],
  })
  assert.deepEqual(checkExecuted([page()], [unknown]), [
    `story ${STORY} executed "widget/is-centered", but widget.md has no guarantee "is-centered"`,
    `story ${STORY} executed "gadget/x", but there is no component page "gadget.md"`,
  ])
})

// --- Trace, coverage, index -----------------------------------------------

test('prints which test cites each guarantee, unmet ones marked', () => {
  const failing = record({
    guarantees: [{ id: 'widget/glows', mode: 'unmet' }],
  })
  assert.equal(
    renderTrace([page()], [failing]),
    [
      'Widget (widget.md)',
      '  looks-right: It looks right.',
      '    (no test)',
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

test('a page with an unverified guarantee owes no test yet', () => {
  assert.deepEqual(checkPage(unverifiedPage(), facts()), [])
  const ran = record({
    guarantees: [
      { id: 'widget/looks-right', mode: 'met' },
      { id: 'widget/glows', mode: 'unmet' },
    ],
  })
  assert.deepEqual(checkExecuted([unverifiedPage()], [ran]), [])
})

test('a test that cites an unverified guarantee makes the page say so', () => {
  const ran = record({
    guarantees: [
      { id: 'widget/looks-right', mode: 'met' },
      { id: 'widget/is-centred', mode: 'met' },
      { id: 'widget/glows', mode: 'unmet' },
    ],
  })
  assert.deepEqual(checkExecuted([unverifiedPage()], [ran]), [
    `story ${STORY} executed "widget/is-centred", which the page marks unverified: a test now cites it, so set its status to met`,
  ])
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
      '\n- [Widget (`pathable-widget`)](widget.md) (static): A test widget.\n',
    ),
  )
})

test('the index explains the unmet and unverified guarantee statuses', () => {
  const index = renderIndex([page()]).replace(/\n/g, ' ')

  assert.ok(
    index.includes(
      'A guarantee marked `status: unmet` is expected behaviour the component does not have yet: do not rely on it.',
    ),
  )
  assert.ok(
    index.includes(
      'One marked `status: unverified` was read from the package source and no test checks it yet.',
    ),
  )
})

// --- Pages with placeholders ----------------------------------------------

const loud = '<span class="pathable-widget pathable-widget--loud"></span>\n'
const converted = (frontMatter + body).replace(
  '```html\n' + loud + '```\n',
  '<!-- css-files -->\n\n<!-- example: loud -->\n\n## States\n\n<!-- examples -->\n',
)
const sources = (overrides = {}) => ({
  fixtures: new Map([
    ['loud', { description: 'Loud.', html: loud }],
    [
      'plain',
      {
        description: undefined,
        html: '<span class="pathable-widget"></span>\n',
      },
    ],
  ]),
  cssFiles: ['base.css', 'widget.css', 'utilities.css'],
  examples: undefined,
  component: undefined,
  ...overrides,
})

test('checks a converted page with its fixtures in place', () => {
  const { page: rendered, errors } = renderForCheck(page(converted), sources())
  assert.deepEqual(errors, [])
  assert.deepEqual(checkPage(rendered, facts()), [])
})

test('checks the classes of every fixture a page shows', () => {
  const unknown = sources()
  unknown.fixtures.set('odd', {
    html: '<span class="pathable-widget--odd"></span>\n',
  })
  const { page: rendered } = renderForCheck(page(converted), unknown)
  assert.ok(
    includes(
      checkPage(rendered, facts()),
      'the html example uses .pathable-widget--odd',
    ),
  )
})

test('fails on a placeholder naming a missing fixture', () => {
  const { page: rendered, errors } = renderForCheck(
    page(converted.replace('example: loud', 'example: gone')),
    sources(),
  )
  assert.equal(rendered, undefined)
  assert.ok(includes(errors, 'fixtures/widget/gone.html does not exist'))
})

test('fails when a converted page does not show every fixture', () => {
  const { errors } = renderForCheck(
    page(converted.replace('<!-- examples -->\n', '')),
    sources(),
  )
  assert.deepEqual(errors, [
    'fixtures/widget/plain.html is not shown: add "<!-- examples -->" (or "<!-- example: plain -->")',
  ])
})

test('fails when the React package covers an unconverted page', () => {
  const covered = sources({ examples: new Map(), component: 'Widget' })
  assert.ok(
    includes(
      // A kind other than static, so the styles page needs no css-files.
      renderForCheck(
        page(frontMatter.replace('kind: static', 'kind: token') + body),
        covered,
      ).errors,
      'must take its examples',
    ),
  )
})

test('fails when a covered page has a state with no React example', () => {
  const covered = sources({
    examples: new Map([['loud', 'export default null\n']]),
    component: 'Widget',
  })
  assert.ok(
    includes(
      renderForCheck(page(converted), covered).errors,
      'Widget/examples/plain.tsx does not exist',
    ),
  )
})

test('counts an example placeholder as the one html example', () => {
  const two = converted.replace('<!-- examples -->', '<!-- example: plain -->')
  const { page: rendered } = renderForCheck(page(two), sources())
  assert.ok(includes(checkPage(rendered, facts()), 'expected one html example'))
})

test('does not count an example placeholder inside any kind of code block', () => {
  const fenced = converted.replace(
    '## States',
    '~~~md\n<!-- example: plain -->\n~~~\n\n## States',
  )
  const { page: rendered } = renderForCheck(page(fenced), sources())
  assert.deepEqual(checkPage(rendered, facts()), [])
})

test('does not count an html block in a React-only package block', () => {
  const withReactSnippet = converted.replace(
    '## States',
    '<!-- package: react -->\n\n```html\n<span class="pathable-widget"></span>\n```\n\n<!-- /package -->\n\n## States',
  )
  const { page: rendered, errors } = renderForCheck(
    page(withReactSnippet),
    sources(),
  )
  assert.deepEqual(errors, [])
  assert.deepEqual(checkPage(rendered, facts()), [])
})

test('reads a fixture shown in a fence longer than three backticks', () => {
  const backticks = sources()
  backticks.fixtures.set('code', {
    description: undefined,
    html: '<span class="pathable-widget--odd">```</span>\n',
  })
  const { page: rendered, errors } = renderForCheck(page(converted), backticks)
  assert.deepEqual(errors, [])
  assert.match(rendered.markdown, /^````html$/mu)
  assert.ok(
    includes(
      checkPage(rendered, facts()),
      'the html example uses .pathable-widget--odd',
    ),
  )
})

test('tracks coverage by state, not by markup two states share', () => {
  const shared = sources()
  shared.fixtures.set('loud-again', { description: undefined, html: loud })
  const onlyLoud = converted.replace('<!-- examples -->\n', '')
  const { errors } = renderForCheck(page(onlyLoud), shared)
  assert.ok(includes(errors, 'fixtures/widget/loud-again.html is not shown'))
  assert.ok(includes(errors, 'fixtures/widget/plain.html is not shown'))
})

test('fails on a placeholder in a React block that names no fixture', () => {
  const reactOnly = converted.replace(
    '## States',
    '<!-- package: react -->\n\n<!-- example: missing-state -->\n\n<!-- /package -->\n\n## States',
  )
  const examples = new Map([
    ['loud', 'export default <Widget loud />\n'],
    ['plain', 'export default <Widget />\n'],
  ])
  const { errors } = renderForCheck(
    page(reactOnly),
    sources({ examples, component: 'Widget' }),
  )
  assert.ok(
    includes(errors, 'fixtures/widget/missing-state.html does not exist'),
  )
})

// --- Utility and token pages ----------------------------------------------

const sectionsText = (names) =>
  names.map((name) => `## ${name}\n\nText.\n`).join('\n')

const utilityFront = `---
name: Spacing
slug: utilities-spacing
kind: utility
summary: Space utilities.
uswds: https://designsystem.digital.gov/utilities/spacing/
classes:
  - margin-<value>
guarantees:
  - id: margin-2
    status: unverified
    claim: margin-2 sets margin to 1rem.
---
`
const uswdsBody = (names, example = '<span class="margin-2"></span>') => `
# Spacing

Space utilities. Used a lot.

${sectionsText(names)
  .replace('## States\n\nText.', '## States\n\n<!-- examples -->')
  .replace(
    '## Example\n\nText.',
    `## Example\n\n\`\`\`html\n${example}\n\`\`\``,
  )}`
const utility = (front = utilityFront, body = uswdsBody(UTILITY_SECTIONS)) => ({
  ...page(front + body),
  slug: front.match(/^slug: (.+)$/mu)[1],
})
const utilityCss = () => readCss('.margin-2 { margin: 1rem; }')
const utilityFacts = () => ({ css: utilityCss() })

test('a utility page with no class or variants passes', () => {
  assert.deepEqual(checkPage(utility(), utilityFacts()), [])
})

test('a utility page is rejected for styles-class, variants and a missing uswds link', () => {
  const extra = utilityFront.replace(
    'classes:',
    'styles-class: pathable-widget\nvariants: []\nclasses:',
  )
  const errors = checkPage(utility(extra), utilityFacts())
  assert.ok(includes(errors, 'a utility page has no "styles-class"'))
  assert.ok(includes(errors, 'a utility page has no "variants"'))
  const bare = utilityFront.replace(/^uswds:.*\n/mu, '')
  assert.ok(
    includes(
      checkPage(utility(bare), utilityFacts()),
      'missing front matter field "uswds"',
    ),
  )
})

test('a utility page needs a non-empty classes list and a USWDS utilities link', () => {
  const empty = utilityFront.replace(
    'classes:\n  - margin-<value>',
    'classes: []',
  )
  assert.ok(
    includes(
      checkPage(utility(empty), utilityFacts()),
      'at least one class pattern',
    ),
  )
  const elsewhere = utilityFront.replace(
    'designsystem.digital.gov',
    'example.com',
  )
  assert.ok(
    includes(
      checkPage(utility(elsewhere), utilityFacts()),
      '"uswds" must be a https://designsystem.digital.gov/utilities/',
    ),
  )
  const slug = utilityFront.replace('slug: utilities-spacing', 'slug: spacing')
  assert.ok(
    includes(
      checkPage({ ...utility(slug), slug: 'spacing' }, utilityFacts()),
      'slug must start with "utilities-"',
    ),
  )
})

test('a token page has no classes field and its own sections, in order', () => {
  const front = utilityFront
    .replace(/classes:\n {2}- margin-<value>\n/u, '')
    .replace('utilities-spacing', 'tokens-spacing')
    .replace('/utilities/', '/design-tokens/')
    .replace('kind: utility', 'kind: token')
  const token = (names) => page(front + uswdsBody(names))
  const ok = { ...token(TOKEN_SECTIONS), slug: 'tokens-spacing' }
  assert.deepEqual(checkPage(ok, utilityFacts()), [])

  const swapped = [...TOKEN_SECTIONS]
  ;[swapped[2], swapped[3]] = [swapped[3], swapped[2]]
  const errors = checkPage(
    { ...token(swapped), slug: 'tokens-spacing' },
    utilityFacts(),
  )
  assert.ok(includes(errors, 'the sections must come in this order'))

  const withClasses = front.replace(
    'guarantees:',
    'classes:\n  - a\nguarantees:',
  )
  assert.ok(
    includes(
      checkPage(
        {
          ...page(withClasses + uswdsBody(TOKEN_SECTIONS)),
          slug: 'tokens-spacing',
        },
        utilityFacts(),
      ),
      'unknown front matter field "classes"',
    ),
  )
})

test("a utility page lacks the sections of the kind, and uses no other kind's", () => {
  const errors = checkPage(
    utility(utilityFront, uswdsBody(REQUIRED_SECTIONS)),
    utilityFacts(),
  )
  assert.ok(includes(errors, 'missing section "## Classes"'))
  assert.ok(includes(errors, 'missing section "## States"'))
})

test('a utility or token page has no Sass or Settings section', () => {
  assert.ok(!UTILITY_SECTIONS.includes('Sass'))
  assert.ok(!UTILITY_SECTIONS.includes('Settings'))
  assert.ok(!TOKEN_SECTIONS.includes('Sass'))
  assert.ok(!TOKEN_SECTIONS.includes('Settings'))
  assert.deepEqual(TOKEN_SECTIONS.slice(0, 4), [
    'When to use',
    'Example',
    'Values',
    'Utilities',
  ])
})

test('the classes in a utility page example must be in the compiled CSS', () => {
  const unknown = utility(
    utilityFront,
    uswdsBody(UTILITY_SECTIONS, '<span class="margin-2 margin-99"></span>'),
  )
  assert.deepEqual(checkPage(unknown, utilityFacts()), [
    'the html example uses .margin-99, which the compiled CSS does not define',
  ])
})

test('reads a responsive utility class, escaped in the CSS, by its unescaped name', () => {
  const responsive = readCss(
    '@media (min-width: 40em) { .tablet\\:margin-2 { margin: 1rem } }',
  )
  assert.ok(responsive.classes.has('tablet:margin-2'))
})

test('a utility or token page may not name a custom property or a usa- class', () => {
  const named = utility(
    utilityFront,
    uswdsBody(UTILITY_SECTIONS) + '\nUse `--margin-gap`.\n',
  )
  assert.ok(
    includes(
      checkPage(named, utilityFacts()),
      'a page names no custom property',
    ),
  )
  const prefixed = utility(
    utilityFront,
    uswdsBody(UTILITY_SECTIONS) + '\nSee usa-sr-only.\n',
  )
  assert.ok(
    includes(checkPage(prefixed, utilityFacts()), 'must not mention usa-'),
  )
})

test('a utility page shows its fixtures under States', () => {
  const states =
    utilityFront +
    uswdsBody(UTILITY_SECTIONS, '<!-- example: spaced -->')
      .replace('## States\n\nText.', '## States\n\n<!-- examples -->')
      .replace(
        '```html\n<!-- example: spaced -->\n```',
        '<!-- example: spaced -->',
      )
  const fixtureSources = {
    fixtures: new Map([
      ['spaced', { html: '<span class="margin-2"></span>\n' }],
    ]),
    examples: undefined,
    component: undefined,
  }
  const { page: rendered, errors } = renderForCheck(
    utility(states, ''),
    fixtureSources,
  )
  assert.deepEqual(errors, [])
  assert.deepEqual(checkPage(rendered, utilityFacts()), [])

  const missing = states.replace('<!-- examples -->', 'Nothing.')
  const bare = renderForCheck(utility(missing, ''), fixtureSources)
  assert.ok(
    includes(checkPage(bare.page, utilityFacts()), '"<!-- examples -->"'),
  )
})

test('the index groups tokens, utilities and components, naming a class only for components', () => {
  const index = renderIndex([page(), utility()])
  assert.ok(index.indexOf('## Utilities') < index.indexOf('## Components'))
  assert.ok(
    index.includes(
      '\n- [Spacing](widget.md) (utility): Space utilities.\n'.replace(
        'widget.md',
        'widget.md',
      ),
    ),
  )
  assert.ok(!index.includes('## Design tokens'))
})

// --- Settings pages -------------------------------------------------------

const settingsFront = `---
name: Color
slug: settings-color
kind: settings
summary: The color settings.
uswds: https://designsystem.digital.gov/documentation/settings/#color-settings
---
`
const settingsBody = (
  sections = [...SETTINGS_SECTIONS, SETTINGS_VALUES_SECTION],
  extra = '',
) => `
# Color

The color settings. They are fixed at build time.

${sectionsText(sections)}
${extra}`
const settings = (
  front = settingsFront,
  body = settingsBody(),
  slug = front.match(/^slug: (.+)$/mu)[1],
) => ({ ...page(front + body), slug })

test('a settings page with the two sections, no guarantees and an anchored link passes', () => {
  assert.deepEqual(checkPage(settings(), utilityFacts()), [])
})

test('the settings overview needs only "Not public API"; a settings-<name> page also needs "Values"', () => {
  const overview = settings(
    settingsFront
      .replace('slug: settings-color', 'slug: settings')
      .replace('name: Color', 'name: Overview'),
    settingsBody(SETTINGS_SECTIONS).replace('# Color', '# Overview'),
  )
  assert.deepEqual(checkPage(overview, utilityFacts()), [])
  const noValues = settings(settingsFront, settingsBody(SETTINGS_SECTIONS))
  assert.ok(
    includes(
      checkPage(noValues, utilityFacts()),
      'missing section "## Values"',
    ),
  )
})

test('a settings page must open with "Not public API"', () => {
  const late = settings(
    settingsFront,
    settingsBody([SETTINGS_VALUES_SECTION, ...SETTINGS_SECTIONS]),
  )
  const errors = checkPage(late, utilityFacts())
  assert.ok(includes(errors, 'the first section must be "## Not public API"'))
  assert.ok(includes(errors, 'the sections must come in this order'))
})

test('a settings page takes no guarantees, classes, styles-class or variants', () => {
  const extra = settingsFront.replace(
    'uswds:',
    'styles-class: pathable-widget\nvariants: []\nclasses:\n  - a\nguarantees:\n  - id: a\n    claim: b\nuswds:',
  )
  const errors = checkPage(settings(extra), utilityFacts())
  for (const field of ['styles-class', 'variants', 'classes', 'guarantees']) {
    assert.ok(includes(errors, `a settings page has no "${field}"`), field)
  }
  const bare = settingsFront.replace(/^uswds:.*\n/mu, '')
  assert.deepEqual(checkPage(settings(bare), utilityFacts()), [])
})

test('a settings page has a settings slug and a settings link', () => {
  const elsewhere = settingsFront.replace(
    'designsystem.digital.gov/documentation/settings/',
    'designsystem.digital.gov/utilities/',
  )
  assert.ok(
    includes(
      checkPage(settings(elsewhere), utilityFacts()),
      '"uswds" must be a https://designsystem.digital.gov/documentation/settings/',
    ),
  )
  const slug = settingsFront.replace('slug: settings-color', 'slug: color')
  assert.ok(
    includes(
      checkPage(settings(slug), utilityFacts()),
      'slug must be "settings" or start with "settings-"',
    ),
  )
})

test('a settings page may name Sass settings but no example, placeholder, custom property or usa- class', () => {
  const sass = settings(
    settingsFront,
    settingsBody(undefined, 'Set `$theme-color-primary` in `@use` ... with.\n'),
  )
  assert.deepEqual(checkPage(sass, utilityFacts()), [])

  const html = settings(
    settingsFront,
    settingsBody(undefined, '```html\n<span class="margin-2"></span>\n```\n'),
  )
  assert.ok(includes(checkPage(html, utilityFacts()), 'has no example'))

  const placeholder = settings(
    settingsFront,
    settingsBody(undefined, '<!-- examples -->\n'),
  )
  assert.ok(
    includes(
      checkPage(placeholder, utilityFacts()),
      'has no fixture or example',
    ),
  )

  const property = settings(
    settingsFront,
    settingsBody(undefined, 'See `--pathable-color-link`.\n'),
  )
  assert.ok(
    includes(
      checkPage(property, utilityFacts()),
      'documents Sass settings only',
    ),
  )

  const usa = settings(
    settingsFront,
    settingsBody(undefined, 'The usa-link.\n'),
  )
  assert.ok(includes(checkPage(usa, utilityFacts()), 'usa-'))
})

test('a settings page renders for the check without a fixture folder', () => {
  const { page: rendered, errors } = renderForCheck(settings(), {
    fixtures: new Map(),
    examples: undefined,
    component: undefined,
  })
  assert.deepEqual(errors, [])
  assert.deepEqual(checkPage(rendered, utilityFacts()), [])
})

test('the index lists no settings page', () => {
  const index = renderIndex([page(), settings()])
  assert.ok(!index.includes('settings-color.md'))
  assert.ok(!index.includes('Color'))
})

// --- PathAble utility classes ----------------------------------------------

const utilitiesCss = `
.pathable-margin-top-2 { margin-top: 1rem; }
.pathable-bg-link { background-color: #015a76; }
.hover\\:pathable-bg-link:hover { background-color: #015a76; }
.focus\\:pathable-bg-link:focus { background-color: #015a76; }
.pathable-bg-link:not(:where(.pathable-button, .pathable-link)) { --x: 1; }
`
const utilityFacts2 = (
  declared = ['pathable-bg-<role>', 'hover:pathable-bg-<role>'],
) => ({
  css: readCss(`.margin-2 { margin: 1rem; } ${utilitiesCss}`),
  utilities: readUtilityClasses(utilitiesCss),
  utilityPatterns: utilityPatterns([{ data: { classes: declared } }]),
})
const withExample = (example) =>
  utility(utilityFront, uswdsBody(UTILITY_SECTIONS, example))

test('readUtilityClasses ignores classes inside a pseudo-class argument', () => {
  const found = readUtilityClasses(utilitiesCss)
  assert.ok(found.has('pathable-bg-link'))
  assert.ok(found.has('hover:pathable-bg-link'))
  assert.ok(!found.has('pathable-button'))
  assert.ok(!found.has('pathable-link'))
})

test('a page citing an undeclared pathable utility fails', () => {
  const errors = checkPage(
    withExample('<span class="pathable-margin-top-2"></span>'),
    utilityFacts2(),
  )
  assert.ok(includes(errors, '.pathable-margin-top-2 is a PathAble utility'))
})

test('declared pathable utilities and their hover variant pass', () => {
  const example =
    '<span class="pathable-bg-link hover:pathable-bg-link"></span>'
  assert.deepEqual(checkPage(withExample(example), utilityFacts2()), [])
})

test('a focus: variant is not declared by the hover: pattern', () => {
  const errors = checkPage(
    withExample('<span class="focus:pathable-bg-link"></span>'),
    utilityFacts2(),
  )
  assert.ok(includes(errors, '.focus:pathable-bg-link is a PathAble utility'))
})

test('a guarantee claim citing an undeclared utility fails', () => {
  const front = utilityFront.replace(
    'claim: margin-2 sets margin to 1rem.',
    'claim: pathable-margin-top-2 sets margin.',
  )
  const errors = checkPage(utility(front), utilityFacts2())
  assert.ok(includes(errors, '.pathable-margin-top-2 is a PathAble utility'))
})

test('a component class used only inside :not(:where()) is not a utility', () => {
  const found = readUtilityClasses(utilitiesCss)
  assert.deepEqual(
    undeclaredUtilityClasses(
      new Set(['pathable-button']),
      found,
      utilityPatterns([]),
    ),
    [],
  )
})

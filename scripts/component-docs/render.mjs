/**
 * Pure renderers: one source page and its sources in, one target's output
 * out. Nothing here reads or writes files.
 *
 *   render(page, 'styles', sources)     the @pathableai/styles page (Markdown)
 *   render(page, 'react', sources)      the @pathableai/react page (Markdown)
 *   render(page, 'storybook', sources)  { mdx, stories } for the styles Storybook
 *
 * `page` is { slug, markdown, data }, as readPages() returns it. `sources` is
 * { fixtures, examples, component, notOffered, titles }:
 * `fixtures` maps state to { description, html } (see sources.mjs);
 * `examples` maps state to React example module source, or is undefined when
 * the React package does not cover the component; `component` is the React
 * component name when it does; `notOffered` maps the states React does not
 * offer to the reason (the fixture manifest's `notOffered`). The React page
 * leaves those states out of `<!-- examples -->`. Storybook is documentation
 * for the HTML and CSS only: it shows every state with its HTML, skips the
 * React package's blocks and examples, and hides the story file that backs
 * the previews from the sidebar. `titles` (Storybook target only, optional)
 * maps the slug of every page that has a Storybook page to its title, so a
 * link to another page can be rewritten to its docs route (rewritePageLinks).
 *
 * A page with no placeholder renders to itself, byte for byte, for the
 * Markdown targets.
 */

import { ComponentDocsError, findPlaceholders, segment } from './segments.mjs'

export const TARGETS = ['styles', 'react', 'storybook']

/** `no-actions` to `No actions`, for a state's heading. */
export const stateTitle = (state) =>
  state.charAt(0).toUpperCase() + state.slice(1).replace(/-/gu, ' ')

/**
 * `no-actions` to `NoActions`, for a story export name. A state may start
 * with a digit (`2-up`), which an identifier cannot, so such a name gets a
 * `State` prefix (`State2Up`).
 */
export const storyName = (state) => {
  const name = state
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return /^[0-9]/u.test(name) ? `State${name}` : name
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/u

/**
 * The story export name of every state, checked up front: each must be a
 * valid identifier, and no two states may turn into the same name (`foo-1`
 * and `foo1` both become `Foo1`). Throws ComponentDocsError naming the
 * states, before any file is written.
 */
export function storyNames(slug, states) {
  const problems = []
  const byName = new Map()
  for (const state of states) {
    const name = storyName(state)
    if (!IDENTIFIER.test(name)) {
      problems.push(
        `fixtures/${slug}/${state}.html gives the story name "${name}", which is not a valid identifier; rename the fixture`,
      )
    } else if (byName.has(name)) {
      problems.push(
        `fixtures/${slug}/${byName.get(name)}.html and ${state}.html both give the story name "${name}"; rename one`,
      )
    } else {
      byName.set(name, state)
    }
  }
  if (problems.length > 0) throw new ComponentDocsError(problems)
  return new Map([...byName].map(([name, state]) => [state, name]))
}

/** A fenced code block whose fence is longer than any backtick run inside. */
export function fence(language, code) {
  const longest = Math.max(
    2,
    ...[...code.matchAll(/`+/gu)].map((match) => match[0].length),
  )
  const marks = '`'.repeat(longest + 1)
  return `${marks}${language}\n${code.replace(/\n+$/u, '')}\n${marks}`
}

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n/u

const stripFrontMatter = (markdown) => markdown.replace(FRONT_MATTER, '')

/**
 * Resolves the states a placeholder names against the sources, collecting
 * problems instead of stopping at the first.
 */
function resolveStates(item, slug, target, sources, problems) {
  const notOffered = sources.notOffered ?? {}
  const states =
    item.type === 'example'
      ? [item.state]
      : [...sources.fixtures.keys()].filter(
          // The React page lists only the states React offers.
          (state) => target !== 'react' || !(state in notOffered),
        )
  if (item.type === 'examples' && sources.fixtures.size === 0) {
    problems.push(
      `line ${item.line}: "<!-- examples -->" but fixtures/${slug}/ holds no fixture`,
    )
  }
  for (const state of states) {
    if (!sources.fixtures.has(state)) {
      problems.push(
        `line ${item.line}: "<!-- example: ${state} -->" names no fixture: fixtures/${slug}/${state}.html does not exist`,
      )
    }
    if (target === 'react' && state in notOffered) {
      problems.push(
        `line ${item.line}: "${state}" is not offered by the React package (${notOffered[state]}), so the React page cannot show it; put this example in a styles package block`,
      )
      continue
    }
    if (
      target === 'react' &&
      sources.examples &&
      !sources.examples.has(state)
    ) {
      problems.push(
        `line ${item.line}: "${state}" has no React example: packages/react/src/components/${sources.component}/examples/${state}.tsx does not exist`,
      )
    }
  }
  return states.filter((state) => sources.fixtures.has(state))
}

/**
 * Every placeholder the target shows resolves, or ComponentDocsError lists
 * what does not. Each target skips the other package's blocks, which it does
 * not show; Storybook shows the styles blocks only.
 */
function resolveAll(segments, slug, target, sources) {
  const problems = []
  const resolved = new Map()
  const shows = (block) =>
    block.name === (target === 'storybook' ? 'styles' : target)
  const visit = (items) => {
    for (const item of items) {
      if (item.type === 'package' && shows(item)) visit(item.segments)
      if (item.type === 'example' || item.type === 'examples') {
        resolved.set(item, resolveStates(item, slug, target, sources, problems))
      }
    }
  }
  visit(segments)
  if (target === 'react' && !sources.examples) {
    problems.push(
      `the React package does not cover "${slug}", so it has no React page`,
    )
  }
  if (problems.length > 0) throw new ComponentDocsError(problems)
  return resolved
}

const trimNewlines = (text) => text.replace(/^\n+|\n+$/gu, '')

/** The Markdown targets: styles (HTML examples) and react (JSX examples). */
function renderMarkdown(page, target, sources) {
  const segments = segment(page.markdown)
  if (findPlaceholders(page.markdown).placeholders.length === 0) {
    if (target === 'react') {
      // A React page made from an unconverted page would show HTML examples.
      resolveAll(segments, page.slug, target, sources)
      throw new ComponentDocsError([
        `the React fixture manifest lists "${page.slug}", so the page must take its examples from the fixtures through placeholders`,
      ])
    }
    return page.markdown
  }
  const resolved = resolveAll(segments, page.slug, target, sources)

  const code = (state) =>
    target === 'react'
      ? fence('tsx', sources.examples.get(state))
      : fence('html', sources.fixtures.get(state).html)

  const blocks = (items) =>
    items.flatMap((item) => {
      if (item.type === 'markdown') return [trimNewlines(item.text)]
      if (item.type === 'package') {
        return item.name === target ? blocks(item.segments) : []
      }
      if (item.type === 'example') return [code(item.state)]
      return resolved.get(item).flatMap((state) => {
        const { description } = sources.fixtures.get(state)
        return [
          `### ${stateTitle(state)}`,
          ...(description ? [description] : []),
          code(state),
        ]
      })
    })

  return `${blocks(segments).filter(Boolean).join('\n\n')}\n`
}

/** A JavaScript string literal for generated code. */
const literal = (value) => JSON.stringify(value)

/**
 * The CSF file: one story per fixture, rendering its markup. It only backs
 * the previews on the component page, so it is hidden from the sidebar.
 */
function renderStories(page, sources) {
  const lines = [
    `// Generated by scripts/component-docs from fixtures/${page.slug}/. Do not edit.`,
    '',
    'export default {',
    `  title: ${literal(`Component examples/${page.slug}`)},`,
    "  tags: ['!autodocs', '!dev'],",
    '}',
  ]
  for (const [state, fixture] of sources.fixtures) {
    lines.push(
      '',
      `export const ${storyName(state)} = {`,
      `  render: () => ${literal(fixture.html)},`,
      '  parameters: {',
      '    componentDocs: {',
      `      html: ${literal(fixture.html)},`,
      '    },',
      '  },',
      '}',
    )
  }
  return `${lines.join('\n')}\n`
}

/**
 * The Storybook sidebar section of a page, by its kind: design tokens and
 * utilities have their own sections, ahead of the component pages
 * (.storybook/preview.js sorts them in that order).
 */
export const storybookSection = (kind) =>
  ({ token: 'Design tokens', utility: 'Utilities' })[kind] ?? 'Component pages'

/**
 * Storybook's id for a title, as its `sanitize` makes it: lower case, every
 * character that is not a letter or digit becomes a dash, dashes collapse and
 * are trimmed. `Utilities/Border` gives `utilities-border`.
 */
export const storybookId = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]/gu, '-')
    .replace(/-+/gu, '-')
    .replace(/^-|-$/gu, '')

/**
 * The docs route of a page in the Storybook, as a path the docs `<a>` turns
 * into a link on the top window (`/docs/<id>` becomes `./?path=/docs/<id>`
 * with `target="_top"`, so it leaves the preview iframe).
 */
export const storybookDocsPath = (title) => `/docs/${storybookId(title)}--docs`

/** The sidebar title `renderMdx` gives a page. */
export const storybookTitle = (page) =>
  `${storybookSection(page.data?.kind)}/${page.data?.name ?? page.slug}`

/**
 * Rewrites a relative link to another component page (`foo.md`,
 * `./foo.md#anchor`) into that page's Storybook docs route. `titles` maps a
 * slug to its Storybook title; a link to a page with no Storybook page, or to
 * anything else, is left as written. Fenced code is not touched.
 */
export function rewritePageLinks(text, titles) {
  if (!titles || titles.size === 0) return text
  const link = /\]\((?:\.\/)?([a-z0-9][a-z0-9-]*)\.md(#[^)\s]*)?\)/gu
  return text
    .split(/(^```[\s\S]*?^```$)/gmu)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part.replace(link, (whole, slug, anchor = '') =>
            titles.has(slug)
              ? `](${storybookDocsPath(titles.get(slug))}${anchor})`
              : whole,
          ),
    )
    .join('')
}

/** The MDX page: the shared prose, with each example as a live preview. */
function renderMdx(page, name, sources) {
  // Segment the whole page, so problems cite source line numbers, then drop
  // the front matter from the first segment; the page does not show it.
  const segments = segment(page.markdown)
  if (segments[0]?.type === 'markdown') {
    segments[0] = { ...segments[0], text: stripFrontMatter(segments[0].text) }
  }
  const resolved = resolveAll(segments, page.slug, 'storybook', sources)

  const markdown = (text) =>
    trimNewlines(text)
      ? [
          `<Markdown>{${literal(rewritePageLinks(trimNewlines(text), sources.titles))}}</Markdown>`,
        ]
      : []
  // Each story is previewed once per page: a second live preview of the same
  // fixture would repeat its ids, and its ID references could resolve to the
  // first copy. A state shown again gets its code tabs only.
  const previewed = new Set()
  const example = (state) => {
    const tabs = `<CodeTabs of={Stories.${storyName(state)}} />`
    if (previewed.has(state)) {
      return [
        ...markdown('Its live preview is shown earlier on this page.'),
        tabs,
      ]
    }
    previewed.add(state)
    return [
      `<Canvas of={Stories.${storyName(state)}} sourceState="none" />`,
      tabs,
    ]
  }

  const blocks = (items) =>
    items.flatMap((item) => {
      if (item.type === 'markdown') return markdown(item.text)
      if (item.type === 'package') {
        // Storybook documents HTML and CSS only, so it skips React blocks.
        if (item.name !== 'styles') return []
        return [
          `<PackageNote name=${literal(item.name)}>`,
          ...blocks(item.segments),
          '</PackageNote>',
        ]
      }
      if (item.type === 'example') return example(item.state)
      return resolved.get(item).flatMap((state) => {
        const { description } = sources.fixtures.get(state)
        return [
          ...markdown(
            [`### ${stateTitle(state)}`, description]
              .filter(Boolean)
              .join('\n\n'),
          ),
          ...example(state),
        ]
      })
    })

  return [
    `{/* Generated by scripts/component-docs from components/${page.slug}.md. Do not edit. */}`,
    '',
    "import { Canvas, Markdown, Meta } from '@storybook/addon-docs/blocks'",
    "import { CodeTabs, PackageNote } from '../.storybook/component-docs-blocks'",
    `import * as Stories from './${page.slug}.stories'`,
    '',
    `<Meta title=${literal(`${storybookSection(page.data?.kind)}/${name}`)} />`,
    '',
    blocks(segments).join('\n\n'),
    '',
  ].join('\n')
}

/**
 * The fixture states a page's placeholders show on one target, by name, so
 * coverage does not depend on which states happen to share markup. Throws
 * ComponentDocsError when a placeholder does not resolve.
 */
export function shownStates(page, target, sources) {
  const resolved = resolveAll(
    segment(page.markdown),
    page.slug,
    target,
    sources,
  )
  return new Set([...resolved.values()].flat())
}

/** Renders one page for one target. Throws ComponentDocsError on problems. */
export function render(page, target, sources) {
  if (target === 'styles' || target === 'react') {
    return renderMarkdown(page, target, sources)
  }
  if (target === 'storybook') {
    storyNames(page.slug, sources.fixtures.keys())
    return {
      mdx: renderMdx(page, page.data?.name ?? page.slug, sources),
      stories: renderStories(page, sources),
    }
  }
  throw new Error(`unknown target "${target}"; expected ${TARGETS.join(', ')}`)
}

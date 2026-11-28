import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'

import { readPages } from '../../packages/styles/scripts/component-pages.mjs'
import {
  fence,
  render,
  rewritePageLinks,
  storybookDocsPath,
  stateTitle,
  storyName,
  storyNames,
} from '../component-docs/render.mjs'
import {
  ComponentDocsError,
  findPlaceholders,
  segment,
} from '../component-docs/segments.mjs'
import {
  consumerSource,
  publicExports,
  reactSourceDir,
} from '../component-docs/imports.mjs'
import {
  coverageFrom,
  parseFixture,
  readCoverage,
} from '../component-docs/sources.mjs'
import {
  compareFiles,
  cssFilesFor,
  renderTarget,
  storybookOnly,
  writeFiles,
} from '../component-docs/write.mjs'

const frontMatter = '---\nname: Widget\nslug: widget\n---\n\n'
const page = (body) => ({
  slug: 'widget',
  file: 'widget.md',
  markdown: `${frontMatter}${body}`,
  data: { name: 'Widget' },
})

const fixtures = new Map([
  [
    'loud',
    { description: 'The loud one.', html: '<p class="w w--loud">Hi</p>\n' },
  ],
  ['quiet', { description: undefined, html: '<p class="w">Hi</p>\n' }],
])
const examples = new Map([
  ['loud', "import { W } from 'w'\n\nexport default <W loud>Hi</W>\n"],
  ['quiet', "import { W } from 'w'\n\nexport default <W>Hi</W>\n"],
])
const stylesOnly = { fixtures, examples: undefined, component: undefined }
const covered = { fixtures, examples, component: 'Widget' }

/** The problems a render reports, or [] when it succeeds. */
function problems(fn) {
  try {
    fn()
    return []
  } catch (error) {
    if (!(error instanceof ComponentDocsError)) throw error
    return error.problems
  }
}

describe('component docs: unconverted pages', () => {
  it('renders a page with no placeholder to itself, byte for byte', () => {
    const source = page('# Widget\n\n```html\n<p class="w">Hi</p>\n```\n\n\n')
    assert.equal(render(source, 'styles', stylesOnly), source.markdown)
  })

  it('renders every source page without placeholders to itself', async () => {
    for (const source of await readPages()) {
      if (findPlaceholders(source.markdown).placeholders.length > 0) continue
      assert.equal(
        render(source, 'styles', stylesOnly),
        source.markdown,
        source.file,
      )
    }
  })
})

describe('component docs: placeholders', () => {
  const body =
    '# Widget\n\nIntro.\n\n<!-- example: loud -->\n\n## States\n\n<!-- examples -->\n\n## End\n'

  it('puts the fixture in an html block for the styles package', () => {
    assert.equal(
      render(page(body), 'styles', stylesOnly),
      `${frontMatter}# Widget\n\nIntro.\n\n\`\`\`html\n<p class="w w--loud">Hi</p>\n\`\`\`\n\n## States\n\n### Loud\n\nThe loud one.\n\n\`\`\`html\n<p class="w w--loud">Hi</p>\n\`\`\`\n\n### Quiet\n\n\`\`\`html\n<p class="w">Hi</p>\n\`\`\`\n\n## End\n`,
    )
  })

  it('puts the example module source in a tsx block for the React package', () => {
    const output = render(page(body), 'react', covered)
    assert.ok(
      output.includes(
        "```tsx\nimport { W } from 'w'\n\nexport default <W loud>Hi</W>\n```",
      ),
    )
    assert.ok(!output.includes('```html'))
  })

  it('leaves a placeholder inside a code block untouched', () => {
    const inCode =
      '# Widget\n\n<!-- example: quiet -->\n\n```md\n<!-- example: missing -->\n<!-- examples -->\n```\n'
    const output = render(page(inCode), 'styles', stylesOnly)
    assert.ok(
      output.includes(
        '```md\n<!-- example: missing -->\n<!-- examples -->\n```',
      ),
    )
  })

  it('leaves other HTML comments alone', () => {
    const source = page('# Widget\n\n<!-- a note for authors -->\n')
    assert.equal(render(source, 'styles', stylesOnly), source.markdown)
  })

  it('fails on a placeholder naming a missing fixture', () => {
    assert.deepEqual(
      problems(() =>
        render(
          page('# Widget\n\n<!-- example: gone -->\n'),
          'styles',
          stylesOnly,
        ),
      ),
      [
        'line 8: "<!-- example: gone -->" names no fixture: fixtures/widget/gone.html does not exist',
      ],
    )
  })

  it('fails on a state with no React example', () => {
    const partial = { ...covered, examples: new Map([['loud', 'x']]) }
    assert.deepEqual(
      problems(() =>
        render(page('# Widget\n\n<!-- examples -->\n'), 'react', partial),
      ),
      [
        'line 8: "quiet" has no React example: packages/react/src/components/Widget/examples/quiet.tsx does not exist',
      ],
    )
  })

  it('fails on <!-- examples --> with no fixtures', () => {
    const none = { fixtures: new Map(), examples: undefined }
    assert.equal(
      problems(() => render(page('<!-- examples -->\n'), 'styles', none))
        .length,
      1,
    )
  })

  it('fails on a placeholder that is not on its own top-level line', () => {
    assert.match(
      problems(() => segment('Text <!-- example: loud --> more.\n'))[0] ?? '',
      /not inside a paragraph/u,
    )
    assert.match(
      problems(() => segment('- item\n\n  <!-- examples -->\n'))[0] ?? '',
      /not inside a listItem/u,
    )
  })

  it('fails on a malformed placeholder', () => {
    assert.equal(
      problems(() => segment('<!-- example: Loud State -->\n')).length,
      1,
    )
    assert.equal(problems(() => segment('<!-- examples all -->\n')).length, 1)
    assert.equal(problems(() => segment('<!-- package: vue -->\n')).length, 1)
  })
})

describe('component docs: package blocks', () => {
  const body =
    '# Widget\n\nShared.\n\n<!-- package: styles -->\n\nStyles only.\n\n<!-- /package -->\n\n<!-- package: react -->\n\nReact only.\n\n<!-- /package -->\n\nAfter.\n'

  it('keeps a block for its own package and drops the other', () => {
    assert.equal(
      render(page(body), 'styles', stylesOnly),
      `${frontMatter}# Widget\n\nShared.\n\nStyles only.\n\nAfter.\n`,
    )
    assert.equal(
      render(page(body), 'react', covered),
      `${frontMatter}# Widget\n\nShared.\n\nReact only.\n\nAfter.\n`,
    )
  })

  it('fails on a block that is never closed', () => {
    assert.deepEqual(
      problems(() => segment('<!-- package: react -->\n\nA\n')),
      [
        'line 1: "<!-- package: react -->" is never closed with "<!-- /package -->"',
      ],
    )
  })

  it('fails on a close with no open block', () => {
    assert.deepEqual(
      problems(() => segment('A\n\n<!-- /package -->\n')),
      ['line 3: "<!-- /package -->" closes no open package block'],
    )
  })

  it('fails on nested blocks', () => {
    const nested =
      '<!-- package: react -->\n\n<!-- package: styles -->\n\n<!-- /package -->\n'
    assert.match(problems(() => segment(nested))[0] ?? '', /opens inside/u)
  })
})

describe('component docs: Storybook', () => {
  const body =
    '# Widget\n\n<!-- example: loud -->\n\n<!-- package: react -->\n\nR.\n\n<!-- /package -->\n'

  it('writes one hidden story per fixture with its verbatim HTML and no React', () => {
    const { stories } = render(page(body), 'storybook', covered)
    assert.ok(!stories.includes('Fixtures/'))
    assert.ok(stories.includes('title: "Component examples/widget"'))
    assert.ok(stories.includes("tags: ['!autodocs', '!dev']"))
    assert.ok(stories.includes('export const Loud = {'))
    assert.ok(stories.includes('export const Quiet = {'))
    assert.ok(!stories.includes('react'))
  })

  it('renders each story in a fullscreen layout with a 1.25rem gutter', () => {
    const { stories } = render(page(body), 'storybook', covered)
    assert.ok(stories.includes("parameters: { layout: 'fullscreen' }"))
    assert.ok(stories.includes('<div style="padding: 1.25rem">'))
    const html = [...stories.matchAll(/ {6}html: (".*"),\n/gu)].map((m) =>
      JSON.parse(m[1]),
    )
    assert.ok(html.length > 0)
    for (const markup of html) assert.ok(!markup.includes('padding: 1.25rem'))
  })

  it('renders the same stories whether or not the React package covers the component', () => {
    assert.equal(
      render(page(body), 'storybook', stylesOnly).stories,
      render(page(body), 'storybook', covered).stories,
    )
  })

  it('turns an example into a preview and code tabs, and marks package blocks', () => {
    const { mdx } = render(page(body), 'storybook', covered)
    assert.ok(mdx.includes('<Meta title="Component pages/Widget" />'))
    assert.ok(mdx.includes('<Canvas of={Stories.Loud} sourceState="none" />'))
    assert.ok(mdx.includes('<CodeTabs of={Stories.Loud} />'))
    assert.ok(!mdx.includes('<PackageNote'))
    assert.ok(!mdx.includes('"R."'))
    assert.ok(!mdx.includes('slug: widget\n---'))
  })
})

describe('component docs: Storybook sections', () => {
  it('puts each kind of page in its own section', () => {
    const body = '<!-- example: loud -->\n'
    const titleOf = (kind) =>
      render(
        { ...page(body), data: { name: 'Widget', kind } },
        'storybook',
        stylesOnly,
      ).mdx.match(/<Meta title="([^"]*)"/u)[1]
    assert.equal(titleOf('token'), 'Design tokens/Widget')
    assert.equal(titleOf('utility'), 'Utilities/Widget')
    assert.equal(titleOf('static'), 'Component pages/Widget')
    assert.equal(titleOf('settings'), 'Settings/Widget')
  })
})

describe('component docs: settings pages', () => {
  const settings = {
    slug: 'settings-widget',
    file: 'settings-widget.md',
    markdown:
      '---\nname: Widget\nslug: settings-widget\nkind: settings\n---\n\n# Widget\n\nSee [Overview](settings.md).\n',
    data: { name: 'Widget', kind: 'settings' },
  }
  const overview = {
    ...settings,
    slug: 'settings',
    file: 'settings.md',
    data: { name: 'Overview', kind: 'settings' },
  }
  const noSources = { fixtures: new Map() }

  it('renders an MDX page with no stories file, imports or previews', () => {
    const { mdx, stories } = render(settings, 'storybook', noSources)
    assert.equal(stories, undefined)
    assert.ok(mdx.includes('<Meta title="Settings/Widget" />'))
    assert.ok(!mdx.includes('Canvas'))
    assert.ok(!mdx.includes('Stories'))
    assert.ok(!mdx.includes('component-docs-blocks'))
    assert.ok(mdx.includes('<Markdown>'))
  })

  it('rewrites a link to another settings page to its docs route', () => {
    const titles = new Map([['settings', 'Settings/Overview']])
    const { mdx } = render(settings, 'storybook', { ...noSources, titles })
    assert.ok(mdx.includes('/docs/settings-overview--docs'))
  })

  it('is for the Storybook only: the styles and React targets skip it', async () => {
    assert.ok(storybookOnly(settings))
    assert.ok(!storybookOnly(page('Text.\n')))
    const options = { pages: [settings, overview], coverage: new Map() }
    assert.deepEqual([...(await renderTarget('styles', options)).keys()], [])
    const react = await renderTarget('react', options)
    assert.deepEqual([...react.keys()], ['index.md'])
    assert.ok(!react.get('index.md').includes('Widget'))
    const storybook = await renderTarget('storybook', options)
    assert.deepEqual([...storybook.keys()].sort(), [
      'settings-widget.mdx',
      'settings.mdx',
    ])
    assert.ok(
      storybook
        .get('settings-widget.mdx')
        .includes('/docs/settings-overview--docs'),
    )
  })
})

describe('component docs: links between pages in Storybook', () => {
  const titles = new Map([
    ['utilities-border', 'Utilities/Border'],
    ['tokens-color-state-tokens', 'Design tokens/Color state tokens'],
    ['button', 'Component pages/Button'],
  ])

  it('turns a title into the docs id Storybook gives it', () => {
    assert.equal(
      storybookDocsPath('Utilities/Border'),
      '/docs/utilities-border--docs',
    )
    assert.equal(
      storybookDocsPath('Design tokens/Color state tokens'),
      '/docs/design-tokens-color-state-tokens--docs',
    )
  })

  it('rewrites relative page links, with or without an anchor', () => {
    const text =
      '[a](utilities-border.md), [b](./button.md#variants), [c](tokens-color-state-tokens.md#x-y)'
    assert.equal(
      rewritePageLinks(text, titles),
      '[a](/docs/utilities-border--docs), [b](/docs/component-pages-button--docs#variants), [c](/docs/design-tokens-color-state-tokens--docs#x-y)',
    )
  })

  it('leaves other links, unknown pages and fenced code alone', () => {
    const text = [
      '[x](https://example.com/a.md) [y](missing.md) [z](#top)',
      '',
      '```md',
      '[a](utilities-border.md)',
      '```',
    ].join('\n')
    assert.equal(rewritePageLinks(text, titles), text)
  })

  it('rewrites in the Storybook page only, and keeps .md for the styles page', () => {
    const body =
      '<!-- example: loud -->\n\nSee [Border](utilities-border.md#widths).\n'
    const withTitles = { ...stylesOnly, titles }
    const { mdx } = render(page(body), 'storybook', withTitles)
    assert.ok(mdx.includes('(/docs/utilities-border--docs#widths)'))
    assert.ok(!mdx.includes('utilities-border.md'))
    const markdown = render(page(body), 'styles', withTitles)
    assert.ok(markdown.includes('(utilities-border.md#widths)'))
  })
})

describe('component docs: helpers', () => {
  it('reads a leading description comment from a fixture', () => {
    assert.deepEqual(
      parseFixture('<!-- description: Two\n  lines. -->\n<p>Hi</p>\n'),
      { description: 'Two lines.', html: '<p>Hi</p>\n' },
    )
    assert.deepEqual(parseFixture('<p>Hi</p>\n'), {
      description: undefined,
      html: '<p>Hi</p>\n',
    })
  })

  it('names states and stories from file names', () => {
    assert.equal(stateTitle('no-actions'), 'No actions')
    assert.equal(storyName('no-actions'), 'NoActions')
  })

  it('uses a fence longer than any backtick run in the code', () => {
    assert.equal(fence('md', 'a ``` b\n'), '````md\na ``` b\n````')
  })

  it('writes files, removes stale ones and reports drift', () => {
    const dir = mkdtempSync(join(tmpdir(), 'component-docs-'))
    try {
      writeFileSync(join(dir, 'old.md'), 'old')
      writeFileSync(join(dir, 'keep.txt'), 'not ours')
      const files = new Map([['a.md', 'A\n']])
      assert.deepEqual(compareFiles(dir, files, /\.md$/u).length, 2)
      writeFiles(dir, files, /\.md$/u)
      assert.deepEqual(compareFiles(dir, files, /\.md$/u), [])
      assert.equal(readFileSync(join(dir, 'keep.txt'), 'utf8'), 'not ours')
      writeFileSync(join(dir, 'a.md'), 'changed')
      assert.match(compareFiles(dir, files, /\.md$/u)[0], /out of date/u)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('component docs: consumer imports in React examples', () => {
  const file = join(reactSourceDir, 'components/Widget/examples/loud.tsx')
  const exportsOf = () => new Set(['Widget', 'WidgetProps'])
  const rewrite = (source) => consumerSource(file, source, exportsOf)

  it('rewrites a relative component import to @pathableai/react', () => {
    assert.equal(
      rewrite(
        "import { Widget } from '../Widget'\n\nexport default <Widget />\n",
      ),
      "import { Widget } from '@pathableai/react'\n\nexport default <Widget />\n",
    )
    assert.equal(
      rewrite("import type { WidgetProps } from '../Widget/Widget.js'\n"),
      "import type { WidgetProps } from '@pathableai/react'\n",
    )
  })

  it('keeps react and @pathableai/react imports as they are', () => {
    const source =
      "import { useId } from 'react'\nimport { Widget } from '@pathableai/react'\n"
    assert.equal(rewrite(source), source)
  })

  it('fails on a name the package does not export', () => {
    assert.throws(
      () => rewrite("import { Widget, internal } from '../Widget'\n"),
      /internal from "\.\.\/Widget" is not exported by @pathableai\/react/u,
    )
  })

  it('fails on default, namespace and side-effect relative imports', () => {
    for (const source of [
      "import Widget from '../Widget'\n",
      "import * as W from '../Widget'\n",
      "import '../Widget/styles.css'\n",
    ]) {
      assert.throws(() => rewrite(source), /named imports only/u, source)
    }
  })

  it('fails on another package or a path outside the React source', () => {
    assert.throws(() => rewrite("import x from 'lodash'\n"), /may import only/u)
    assert.throws(
      () => rewrite("import { a } from '../../../../../fixtures/a'\n"),
      /outside packages\/react\/src/u,
    )
  })

  it('reads the public exports of the entry point', () => {
    const names = publicExports(
      "export { A } from './a.js'\nexport type { B } from './b.js'\nexport { C as D } from './c.js'\n",
    )
    assert.deepEqual([...names].sort(), ['A', 'B', 'D'])
  })
})

describe('component docs: states React does not offer', () => {
  const notOffered = { quiet: 'React has no quiet prop' }
  const partial = {
    fixtures,
    examples: new Map([['loud', examples.get('loud')]]),
    component: 'Widget',
    notOffered,
  }

  it('leaves them out of the React page and keeps them on the styles page', () => {
    const body = '# Widget\n\n<!-- example: loud -->\n\n<!-- examples -->\n'
    const react = render(page(body), 'react', partial)
    assert.ok(react.includes('### Loud'))
    assert.ok(!react.includes('### Quiet'))
    const styles = render(page(body), 'styles', partial)
    assert.ok(styles.includes('### Quiet'))
  })

  it('fails when the React page would show one', () => {
    assert.match(
      problems(() =>
        render(page('# Widget\n\n<!-- example: quiet -->\n'), 'react', partial),
      )[0] ?? '',
      /"quiet" is not offered by the React package \(React has no quiet prop\)/u,
    )
  })

  it('shows them in Storybook with only the HTML source', () => {
    const { stories } = render(
      page('# Widget\n\n<!-- examples -->\n'),
      'storybook',
      partial,
    )
    assert.match(stories, /export const Quiet = \{/u)
    assert.ok(!stories.includes('react'))
  })
})

describe('component docs: the React fixture manifest', () => {
  it('reads each folder with its component and states not offered', async () => {
    // The real manifest maps no folder yet.
    assert.equal((await readCoverage()).size, 0)

    const dir = mkdtempSync(join(tmpdir(), 'manifest-'))
    try {
      const manifest = join(dir, 'fixture-manifest.mjs')
      writeFileSync(
        manifest,
        "export const fixtureManifest = { widget: { component: 'Widget' } }\n",
      )
      const coverage = await readCoverage(manifest)
      assert.equal(coverage.get('widget')?.component, 'Widget')
      assert.deepEqual(coverage.get('widget')?.notOffered, {})
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('component docs: pre-push review fixes', () => {
  it('lets a styles block show a state React does not offer', () => {
    const partial = {
      fixtures,
      examples: new Map([['loud', examples.get('loud')]]),
      component: 'Widget',
      notOffered: { quiet: 'not in React' },
    }
    const body =
      '# Widget\n\n<!-- package: styles -->\n\n<!-- example: quiet -->\n\n<!-- /package -->\n\n<!-- example: loud -->\n'
    assert.ok(render(page(body), 'react', partial).includes('<W loud>'))
    assert.ok(render(page(body), 'styles', partial).includes('w">Hi'))
  })

  it('makes no React page from a page without placeholders', () => {
    assert.match(
      problems(() =>
        render(page('# Widget\n\n```html\n<p>Hi</p>\n```\n'), 'react', covered),
      )[0] ?? '',
      /must take its examples from the fixtures/u,
    )
  })

  it('cites source line numbers in Storybook problems', () => {
    assert.match(
      problems(() =>
        render(
          page('# Widget\n\n<!-- example: gone -->\n'),
          'storybook',
          covered,
        ),
      )[0] ?? '',
      /^line 8:/u,
    )
  })

  it('gives a state that starts with a digit a valid story name', () => {
    assert.equal(storyName('2-up'), 'State2Up')
  })
})

describe('component docs: one live preview per story', () => {
  it('previews a state shown twice only once', () => {
    const { mdx } = render(
      page('# Widget\n\n<!-- example: loud -->\n\n<!-- examples -->\n'),
      'storybook',
      covered,
    )
    assert.equal(mdx.match(/<Canvas of=\{Stories\.Loud\}/gu).length, 1)
    assert.equal(mdx.match(/<CodeTabs of=\{Stories\.Loud\} \/>/gu).length, 2)
  })
})

describe('component docs: story export names', () => {
  it('fails on two states that give the same story name, naming both', () => {
    assert.deepEqual(
      problems(() => storyNames('widget', ['foo-1', 'foo1'])),
      [
        'fixtures/widget/foo-1.html and foo1.html both give the story name "Foo1"; rename one',
      ],
    )
    assert.equal(
      problems(() => storyNames('widget', ['2-up', 'state-2-up'])).length,
      1,
    )
  })

  it('fails on a state that gives an invalid identifier', () => {
    assert.match(
      problems(() => storyNames('widget', ['two.up']))[0] ?? '',
      /"Two\.up", which is not a valid identifier/u,
    )
  })

  it('fails the Storybook render before writing anything', () => {
    const clashing = {
      ...stylesOnly,
      fixtures: new Map([
        ['foo-1', { html: '<p>A</p>\n' }],
        ['foo1', { html: '<p>B</p>\n' }],
      ]),
    }
    assert.match(
      problems(() => render(page('# Widget\n'), 'storybook', clashing))[0] ??
        '',
      /both give the story name "Foo1"/u,
    )
  })
})

describe('component docs: one fixture folder per component', () => {
  it('fails on two folders mapped to the same component, naming both', () => {
    assert.deepEqual(
      problems(() =>
        coverageFrom({
          'sr-only': { component: 'SrOnly' },
          'visually-hidden': { component: 'SrOnly' },
        }),
      ),
      [
        'the React fixture manifest maps both "sr-only" and "visually-hidden" to SrOnly; each component may own one fixture folder',
      ],
    )
  })
})

describe('component docs: css-files placeholder', () => {
  const staticPage = (body) => ({
    ...page(body),
    data: { name: 'Widget', kind: 'static' },
  })
  const body = '# Widget\n\nIntro.\n\n<!-- css-files -->\n\n## End\n'
  const cssFiles = ['base.css', 'tag.css', 'utilities.css']

  it('lists one @import per file on the styles page', () => {
    assert.equal(
      render(staticPage(body), 'styles', { ...stylesOnly, cssFiles }),
      `${frontMatter}# Widget\n\nIntro.\n\nTo load only the CSS this component needs instead of the whole bundle, import these files in this order:\n\n\`\`\`css\n@import '@pathableai/styles/css/base.css';\n@import '@pathableai/styles/css/tag.css';\n@import '@pathableai/styles/css/utilities.css';\n\`\`\`\n\n## End\n`,
    )
  })

  it('renders nothing for it on the react page', () => {
    assert.equal(
      render(staticPage(body), 'react', { ...covered, cssFiles }),
      `${frontMatter}# Widget\n\nIntro.\n\n## End\n`,
    )
  })

  it('renders nothing for it in Storybook', () => {
    const { mdx } = render(staticPage(body), 'storybook', {
      ...stylesOnly,
      cssFiles,
    })
    assert.doesNotMatch(mdx, /css-files|@import/u)
  })

  it('does not treat it as an example', () => {
    const { stories } = render(staticPage(body), 'storybook', stylesOnly)
    assert.doesNotMatch(stories, /CssFiles/u)
  })

  it('requires exactly one on a static page', () => {
    const none = problems(() =>
      render(staticPage('# Widget\n\n<!-- example: loud -->\n'), 'styles', {
        ...stylesOnly,
        cssFiles,
      }),
    )
    assert.match(none.join('\n'), /exactly one .*found 0/u)
    const two = problems(() =>
      render(
        staticPage('<!-- css-files -->\n\n<!-- css-files -->\n'),
        'styles',
        { ...stylesOnly, cssFiles },
      ),
    )
    assert.match(two.join('\n'), /exactly one .*found 2/u)
  })

  it('is not allowed on a page of another kind', () => {
    assert.match(
      problems(() =>
        render(page(body), 'styles', { ...stylesOnly, cssFiles }),
      ).join('\n'),
      /only for kind: static/u,
    )
  })

  it('needs css files from the sources', () => {
    for (const empty of [undefined, []]) {
      assert.match(
        problems(() =>
          render(staticPage(body), 'styles', {
            ...stylesOnly,
            cssFiles: empty,
          }),
        ).join('\n'),
        /no CSS module files/u,
      )
    }
  })

  it('is an error inside a package block', () => {
    const inside =
      '<!-- package: styles -->\n\n<!-- css-files -->\n\n<!-- /package -->\n'
    assert.match(
      problems(() => segment(inside)).join('\n'),
      /top level, outside package blocks/u,
    )
  })

  it('takes no argument', () => {
    assert.match(
      problems(() => segment('<!-- css-files: base -->\n')).join('\n'),
      /takes no argument/u,
    )
  })

  it('counts as a placeholder', () => {
    assert.equal(findPlaceholders(body).placeholders.length, 1)
  })

  it('takes the union of the fixtures modules in manifest order', () => {
    const manifest = {
      modules: [
        { name: 'base', file: 'base.css', classes: [], requires: [] },
        {
          name: 'a',
          file: 'a.css',
          classes: ['pathable-a'],
          requires: ['base'],
        },
        {
          name: 'b',
          file: 'b.css',
          classes: ['pathable-b'],
          requires: ['base'],
        },
        { name: 'utilities', file: 'utilities.css', classes: [], requires: [] },
      ],
    }
    const pageFixtures = new Map([
      ['one', { html: '<p class="pathable-b">x</p>' }],
      ['two', { html: '<p class="pathable-a">x</p>' }],
    ])
    assert.deepEqual(cssFilesFor(pageFixtures, manifest), [
      'base.css',
      'a.css',
      'b.css',
      'utilities.css',
    ])
    assert.deepEqual(cssFilesFor(new Map(), manifest), [])
  })
})

describe('component docs: manifest loading', () => {
  it('does not read the manifest for pages that are not static', async () => {
    const files = await renderTarget('styles', {
      pages: [page('# Widget\n')],
      loadManifest: () => {
        throw new Error('the manifest must not be read')
      },
    })
    assert.deepEqual([...files.keys()], ['widget.md'])
  })
})

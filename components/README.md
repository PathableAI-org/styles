# Component pages

One Markdown page per component, named after its slug (`button.md`).
A page is the product specification of the component: what it is for, an
example, its variants, its tokens, how to compose it, what it guarantees and
what the consumer owns. These are the source pages; every published copy is
built from them:

| Reader                      | Built output                                                                     | Examples        | Committed |
| --------------------------- | -------------------------------------------------------------------------------- | --------------- | --------- |
| `@pathableai/styles` on npm | `packages/styles/components/<slug>.md` and `index.md`                            | HTML (fixtures) | No        |
| `@pathableai/react` on npm  | `packages/react/agent-guidance/pathable-react/references/components/<Name>.md`   | JSX (examples)  | Yes       |
| People, on GitHub Pages     | The styles Storybook's **Component pages** section (`apps/storybook/generated/`) | Live, with tabs | No        |

The generator is [`scripts/component-docs/`](../scripts/component-docs/). The
styles `build` writes the styles pages, the Storybook `storybook` and
`build-storybook` scripts write the Storybook pages, and
`node scripts/component-docs/cli.mjs react` writes the React pages, which are
committed because the React agent guidance checks and reviews read them from
the repository. `pnpm check:agent-guidance` fails when they are out of date.

Edit only the source pages here. Never edit built output.

## What a page contains

The front matter fields and the required sections are checked by
[`check-component-pages.mjs`](../packages/styles/scripts/check-component-pages.mjs),
whose header lists every rule. Run it after building styles:

```sh
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/styles check:component-pages
```

How tests cite a page's guarantees is in
[`STORY_AUTHORING.md`](../packages/styles/STORY_AUTHORING.md#component-page-guarantees).

## What a page describes

A page describes the contract the component should have, stated as if it
already held. It has no `status:` on its guarantees and no language about what
the stylesheet does or does not do yet ("today", "not yet", "has no effect").
Where the implementation falls short of a page, the gap is tracked in an
issue, and the page stays as written. A guarantee has only an `id` and a
`claim`.

The front matter `name:` is the human name of the matching USWDS component
(`Button group`, `Icon list`, `Input prefix/suffix`), and the page's `# H1`
repeats it. The slug and file name stay in kebab case.

### Writing an example

Every example follows the USWDS example for the same component:

1. Start from the current USWDS example markup and its complete class list.
2. Rename the prefix to `pathable-`, so the current-item class is
   `pathable-current`. Page text never names the USWDS prefix.
3. Use PathAble brand values wherever a theme value is involved.
4. Use realistic PathAble product content, not placeholder text.
5. Do not change the tags, the child hierarchy, the element classes, where a
   modifier sits or the ARIA relationships.
6. Icons inside a component reference the sprite with `<use>`, as USWDS does,
   and are not drawn with inline paths.

Pages follow USWDS 3.14.0.

## Catalog scope

Every component in the USWDS component overview is classified here. Included
components are static: their defining behaviour needs no JavaScript.

| USWDS component     | Scope                                                                     |
| ------------------- | ------------------------------------------------------------------------- |
| Accordion           | Excluded: defining behaviour needs JavaScript                             |
| Alert               | Included (`alert`)                                                        |
| Banner              | Excluded: defining behaviour needs JavaScript                             |
| Breadcrumb          | Included (`breadcrumb`)                                                   |
| Button              | Included (`button`)                                                       |
| Button group        | Included (`button-group`)                                                 |
| Card                | Included (`card`)                                                         |
| Character count     | Excluded: defining behaviour needs JavaScript                             |
| Checkbox            | Included (`checkbox`)                                                     |
| Collection          | Included (`collection`)                                                   |
| Combo box           | Excluded: defining behaviour needs JavaScript                             |
| Data visualizations | Omitted: USWDS gives guidance, not component markup                       |
| Date picker         | Excluded: defining behaviour needs JavaScript                             |
| Date range picker   | Excluded: defining behaviour needs JavaScript                             |
| File input          | Excluded: defining behaviour needs JavaScript                             |
| Footer              | Included (`footer`)                                                       |
| Form                | Included (`form`)                                                         |
| Header              | Excluded: defining behaviour needs JavaScript                             |
| Icon                | Included (`icon`)                                                         |
| Icon list           | Included (`icon-list`)                                                    |
| Identifier          | Omitted: a federal identity component that does not apply to PathAble     |
| In-page navigation  | Excluded: defining behaviour needs JavaScript                             |
| Input mask          | Excluded: defining behaviour needs JavaScript                             |
| Input prefix/suffix | Included (`input-prefix-suffix`)                                          |
| Language selector   | Excluded: defining behaviour needs JavaScript                             |
| Link                | Included (`link`)                                                         |
| List                | Included (`list`)                                                         |
| Memorable date      | Included (`memorable-date`)                                               |
| Modal               | Excluded: defining behaviour needs JavaScript                             |
| Pagination          | Included (`pagination`)                                                   |
| Process list        | Included (`process-list`)                                                 |
| Prose               | Included (`prose`)                                                        |
| Radio buttons       | Included (`radio`)                                                        |
| Range slider        | Excluded: defining behaviour needs JavaScript                             |
| Search              | Included (`search`)                                                       |
| Select              | Included (`select`)                                                       |
| Side navigation     | Included (`side-navigation`)                                              |
| Site alert          | Included (`site-alert`)                                                   |
| Step indicator      | Included (`step-indicator`)                                               |
| Summary box         | Included (`summary-box`)                                                  |
| Table               | Included (`table`)                                                        |
| Tag                 | Included (`tag`)                                                          |
| Text input          | Included (`text-input`, which also covers the textarea)                   |
| Time picker         | Excluded: defining behaviour needs JavaScript                             |
| Tooltip             | Excluded: defining behaviour needs JavaScript                             |
| Typography          | Foundation, not a component: tokens and the prose and list pages cover it |
| Validation          | Excluded: defining behaviour needs JavaScript                             |

## Examples from fixtures

A page either writes its one minimal example as a literal `html` code block,
or takes its examples from the component's HTML fixtures
([`fixtures/<slug>/`](../fixtures/README.md)) through placeholders. A page
with any placeholder is a converted page. Placeholders are HTML comments, so a
source page still renders cleanly on GitHub:

| Placeholder                 | Becomes                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| `<!-- example: <state> -->` | The fixture `fixtures/<slug>/<state>.html` (styles) or the example module `<state>.tsx` (React)  |
| `<!-- examples -->`         | Every fixture in the folder, in file-name order, each under a `###` heading with its description |
| `<!-- package: styles -->`  | Content up to `<!-- /package -->` that only the styles page shows                                |
| `<!-- package: react -->`   | Content up to `<!-- /package -->` that only the React page shows                                 |

For example:

```md
## Example

<!-- package: styles -->

Load the stylesheet once in the application:

<!-- /package -->

<!-- example: inline -->

## States

<!-- examples -->
```

Rules:

- Put each placeholder on its own line at the top level of the page, with a
  blank line before and after it: not inside a list, a quote or a paragraph.
- A placeholder inside a code block is code, never expanded, as in the
  example above.
- A package block cannot hold another package block. Example placeholders
  may sit inside one.
- Each state's description comes from the fixture's optional leading
  `<!-- description: … -->` comment. The example shows the rest of the fixture
  verbatim.
- The React page takes the example module
  `packages/react/src/components/<Name>/examples/<state>.tsx` verbatim. The
  React fixture tests prove it renders the same markup as the fixture.
- Any other HTML comment is left in the page as it is.

A converted page must show every fixture in its folder: use
`<!-- examples -->` in a **States** section. The React package covers a
component when its fixture manifest
([`packages/react/src/test/fixture-manifest.ts`](../packages/react/src/test/fixture-manifest.ts))
lists the folder. Only a covered component gets a React page, and its page
must be converted: every state the React page shows needs an example module.
A state the manifest marks `notOffered` is left out of the React page's
`<!-- examples -->`; to show it on its own, put its `<!-- example: … -->` in a
styles package block. The check above and the build fail on a placeholder that
names a missing fixture or example, and on a malformed package block.

A page with no placeholder is copied to the styles package unchanged, byte for
byte. The styles build reads only the source pages and the fixtures, never the
React package.

## The Storybook page

The styles Storybook shows each page that has a fixture folder under
**Component pages**, with one live preview per example rendered with
`styles.css`, and **HTML** and **React** tabs beneath it showing the fixture
and the example module verbatim (only **HTML** when the React package does not
cover the component). Package blocks are shown labelled with their package.
The front matter is not shown. Each fixture is also a story
under **Fixtures**, which the Storybook test-runner checks with axe. The pages
publish to GitHub Pages with the rest of the Storybook.

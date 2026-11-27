# Component pages

One Markdown page per component, named after its slug (`button.md`). A page is
the product specification of the component: what it is for, an example, its
variants, how to compose it, what it guarantees and what the
consumer owns. Together with the exact HTML in `fixtures/`, these pages are the
shared source for human product documentation and version-matched consumer
agent guidance; neither output maintains its own component semantics or
snippet. Every published copy is built from them:

| Audience or retained target | Built output                                                                                                                         | Examples                                 | Committed |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- | --------- |
| Styles consumer agents      | `packages/styles/components/<slug>.md` and `index.md`, shipped in `@pathableai/styles`                                               | HTML (fixtures)                          | No        |
| People, on GitHub Pages     | The styles Storybook's **Design tokens**, **Utilities**, **Settings** and **Component pages** sections (`apps/storybook/generated/`) | Live, with tabs; none on a settings page | No        |
| Retained React guidance     | `packages/react/agent-guidance/pathable-react/references/components/<Name>.md`                                                       | JSX (examples)                           | Yes       |

The generator is [`scripts/component-docs/`](../scripts/component-docs/). The
styles `build` writes the installed styles pages, and the Storybook
`storybook` and `build-storybook` scripts write the human product pages. A
future styles consumer-guidance entry point will route agents to the installed
pages and add package-wide selection and bug-reporting guidance; do not create
a second component-prose source for it.

`node scripts/component-docs/cli.mjs react` still writes the retained React
pages, which are committed because existing checks read them.
`pnpm check:agent-guidance` fails when they are out of date. When a styles page
or fixture change requires a mechanical regeneration, make that update without
expanding or redesigning the React API. Stop and ask if generation requires a
semantic React decision.

Edit only the source pages here. Never edit built output.

## Four kinds of page

The `kind` front matter field decides what a page documents, its front matter
and its sections. Each kind has its own Storybook section, in this order. All
kinds but `settings` have their own heading in the styles `index.md`.

| `kind`     | Documents                                                  | Slug                                                                    | Storybook section   |
| ---------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------- |
| `token`    | A group of USWDS design tokens, as the CSS outputs them    | `tokens-<uswds path>`, the path under `/design-tokens/` with `/` as `-` | **Design tokens**   |
| `utility`  | A family of unprefixed USWDS utility classes               | `utilities-<uswds slug>`, the segment under `/utilities/`               | **Utilities**       |
| `settings` | How the build configures USWDS (information only)          | `settings`, or `settings-<name>` for one USWDS settings file            | **Settings**        |
| `static`   | One component, with a `pathable-*` class and its modifiers | The component name, such as `button`                                    | **Component pages** |

Utility and token pages describe names that USWDS does not prefix, which
`@pathableai/styles` keeps unchanged (`margin-x-2`, `tablet:padding-3`). They
have no `styles-class` and no `variants`, and take a `uswds` link to the
matching page on designsystem.digital.gov instead; a utility page also lists
the class patterns it defines in `classes`, unprefixed except for the few
`pathable-` utilities (`pathable-bg-<role>`). A page or fixture may cite a
`pathable-` utility class (one in `dist/utilities.css`, with or without a
`hover:` prefix) only when some page's `classes` declares it, and
`<name>` in a pattern matches one or more of `a-z`, `0-9` and `-`. A token page has no
classes: its fixtures show the tokens through the utility classes that read
them. The sections, in order:

- `utility`: When to use, Example, Classes, Variants, States, Guarantees, The
  consumer owns.
- `token`: When to use, Example, Values, Utilities, States, Guarantees, The
  consumer owns. **Values** is a table of token, PathAble value and notes,
  marking each value as a brand choice or the USWDS default; **Utilities**
  lists the class suffixes that encode the values, linking to the utility
  pages.
- `static`: When to use, Example, Variants, Composition, Guarantees, The
  consumer owns.
- `settings`: Not public API, then Values on every page but the overview.
  See [Settings pages](#settings-pages).

**No page names a custom property.** The package's runtime CSS custom
properties are internal implementation, not consumer API, so none is public.
No page of any kind (static, utility, token or settings) names one, and the
checker fails any page that does. Do not deny that they exist either.

**The public contract of a utility or token page is the compiled CSS only.**
Consumers import `@pathableai/styles` as CSS. These pages therefore document
class names and the values the classes output, and nothing else:

- no Sass: no `@use`, no functions such as `units()` or `color()`, no `u-*`
  or grid mixins, no `$theme-*` or `$*-settings` variables, and no
  instruction to enable a class "through settings". A class the package does
  not output is simply not in the contract; do not tell consumers how to turn
  it on. There are no `## Sass` or `## Settings` sections;
- guarantees are about compiled CSS for a class (selector, computed property
  and value at PathAble defaults), never about Sass functions, and carry no
  `status:` line;
- where a value exists because of a PathAble brand choice, say so in plain
  words ("PathAble outputs `text-semibold` at weight 600"). Where the USWDS
  website differs from what 3.14.0 compiles, add one short note saying so.
  How the package configures USWDS for the build is contributor material
  (`docs/styles/uswds-build-settings.md`), not linked from these pages.

A utility or token page must have at least one fixture, shown with
`<!-- examples -->` under **States**. Every other rule holds: one example, no `usa-` anywhere, and every
class in an example, fixtures included, must be a class selector in the
compiled CSS.

Links to another component page are plain relative links (`utilities-border.md`
or `tokens-color.md#anchor`). They resolve as files in the styles package; the
Storybook render rewrites each into the docs route of that page.

## Settings pages

A `settings` page records how the build sets the USWDS Sass settings
(`$theme-*`, passed to `@use 'uswds-core' with (...)` in
`packages/styles/src/_uswds-theme.scss`). It is information for people who
want to know why a token or class has the value it has. It is not consumer
documentation: the package ships compiled CSS, a consumer cannot set these
settings, and they are not part of the public API.

- Pages: `settings.md` (name "Overview": what USWDS settings are, why ours are
  fixed, how to get the effect from the documented tokens, utilities and
  components, and the settings groups left at USWDS defaults) and one
  `settings-<name>.md` for each USWDS settings file the build overrides
  (`settings-general.md`, `settings-color.md`, `settings-typography.md`,
  `settings-components.md`).
- Front matter: `name`, `slug`, `kind` and `summary`, and optionally `uswds`,
  a link under `https://designsystem.digital.gov/documentation/settings/`
  (an anchor is fine). No `styles-class`, `variants`, `classes` or
  `guarantees`: there is no consumer contract to guarantee or test.
- Sections, in order: **Not public API** first, which says plainly, near the
  top, that the page is information only and the settings are not public API.
  Every page but the overview then has **Values**, a table of every setting
  the build sets, with the columns Setting, USWDS default, PathAble value and
  Notes. List a setting that is set to its USWDS default too, and mark it
  "Same as default". Other sections may follow.
- Take every value from `_uswds-theme.scss` and every default from the USWDS
  3.14.0 settings files. Do not invent a value.
- No fixtures, no `<!-- example -->` placeholders, no package blocks and no
  `html` code blocks. The page may name Sass settings; it names no custom
  property and no `usa-` class.
- A settings page renders to the Storybook only. The styles build does not
  write it into the package, it is not in the styles `index.md`, and the React
  guidance does not include it. It links to other pages as any page does.

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

The styles Storybook shows each page that has a fixture folder, and each
settings page, under the section of its kind (**Design tokens**,
**Utilities**, **Settings** or **Component pages**, in that order; `storySort`
in `apps/storybook/.storybook/preview.js`). A settings page is prose and
tables only, with no stories file. For the others, there is one live preview per example rendered with
`styles.css`, and **HTML** and **React** tabs beneath it showing the fixture
and the example module verbatim (only **HTML** when the React package does not
cover the component). Package blocks are shown labelled with their package.
The front matter is not shown. Each fixture is also a story
under **Fixtures**; the fixture checks ([HTML fixtures](../docs/testing/fixtures.md))
run axe on the same HTML. The pages
publish to GitHub Pages with the rest of the Storybook.

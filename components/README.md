# Component pages

One Markdown page per component, named after its slug (`button.md`).
A page is the product specification of the component: what it is for, an
example, its variants, its tokens, how to compose it, what it guarantees and
what the consumer owns. These are the source pages; every published copy is
built from them:

| Reader                      | Built output                                                                                                           | Examples        | Committed |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------- | --------- |
| `@pathableai/styles` on npm | `packages/styles/components/<slug>.md` and `index.md`                                                                  | HTML (fixtures) | No        |
| `@pathableai/react` on npm  | `packages/react/agent-guidance/pathable-react/references/components/<Name>.md`                                         | JSX (examples)  | Yes       |
| People, on GitHub Pages     | The styles Storybook's **Design tokens**, **Utilities** and **Component pages** sections (`apps/storybook/generated/`) | Live, with tabs | No        |

The generator is [`scripts/component-docs/`](../scripts/component-docs/). The
styles `build` writes the styles pages, the Storybook `storybook` and
`build-storybook` scripts write the Storybook pages, and
`node scripts/component-docs/cli.mjs react` writes the React pages, which are
committed because the React agent guidance checks and reviews read them from
the repository. `pnpm check:agent-guidance` fails when they are out of date.

Edit only the source pages here. Never edit built output.

## Three kinds of page

The `kind` front matter field decides what a page documents, its front matter
and its sections. Each kind has its own Storybook section, in this order, and
its own heading in the styles `index.md`.

| `kind`    | Documents                                                  | Slug                                                                    | Storybook section   |
| --------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------- |
| `token`   | A group of USWDS design tokens, as the CSS outputs them    | `tokens-<uswds path>`, the path under `/design-tokens/` with `/` as `-` | **Design tokens**   |
| `utility` | A family of unprefixed USWDS utility classes               | `utilities-<uswds slug>`, the segment under `/utilities/`               | **Utilities**       |
| `static`  | One component, with a `pathable-*` class and its modifiers | The component name, such as `button`                                    | **Component pages** |

Utility and token pages describe names that USWDS does not prefix, which
`@pathableai/styles` keeps unchanged (`margin-x-2`, `tablet:padding-3`). They
have no `styles-class` and no `variants`, and take a `uswds` link to the
matching page on designsystem.digital.gov instead; a utility page also lists
the unprefixed class patterns it defines in `classes`. A token page has no
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

**The public contract of a utility or token page is the compiled CSS only.**
Consumers import `@pathableai/styles` as CSS. These pages therefore document
class names and the values the classes output, and nothing else:

- no Sass: no `@use`, no functions such as `units()` or `color()`, no `u-*`
  or grid mixins, no `$theme-*` or `$*-settings` variables, and no
  instruction to enable a class "through settings". A class the package does
  not output is simply not in the contract; do not tell consumers how to turn
  it on. There are no `## Sass` or `## Settings` sections;
- no custom properties: runtime `--pathable-*` properties are documented
  elsewhere, and the checker fails a utility or token page that names one. Do
  not deny that they exist either;
- guarantees are about compiled CSS for a class (selector, computed property
  and value at PathAble defaults), never about Sass functions, and carry no
  `status:` line;
- where a value exists because of a PathAble brand choice, say so in plain
  words ("PathAble outputs `text-semibold` at weight 600"). Where the USWDS
  website differs from what 3.14.0 compiles, add one short note saying so.
  How the package configures USWDS for the build is contributor material
  (`docs/styles/uswds-build-settings.md`), not linked from these pages.

A utility or token page needs no pixel baseline (it has no component to
draw). It must have at least one fixture, shown with `<!-- examples -->` under
**States**. Every other rule holds: one example, no `usa-` anywhere, and every
class in an example, fixtures included, must be a class selector in the
compiled CSS.

Links to another component page are plain relative links (`utilities-border.md`
or `tokens-color.md#anchor`). They resolve as files in the styles package; the
Storybook render rewrites each into the docs route of that page.

## What a page contains

The front matter fields, the required sections and what each guarantee status
means are checked by
[`check-component-pages.mjs`](../packages/styles/scripts/check-component-pages.mjs),
whose header lists every rule. Run it after building styles:

```sh
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/styles check:component-pages
```

How tests cite a page's guarantees is in
[`STORY_AUTHORING.md`](../packages/styles/STORY_AUTHORING.md#component-page-guarantees).

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

The styles Storybook shows each page that has a fixture folder under the
section of its kind (**Design tokens**, **Utilities** or **Component pages**,
in that order; `storySort` in `apps/storybook/.storybook/preview.js`), with one live preview per example rendered with
`styles.css`, and **HTML** and **React** tabs beneath it showing the fixture
and the example module verbatim (only **HTML** when the React package does not
cover the component). Package blocks are shown labelled with their package,
and the front matter is shown as YAML at the end. Each fixture is also a story
under **Fixtures**, which the Storybook test-runner checks with axe. The pages
publish to GitHub Pages with the rest of the Storybook.

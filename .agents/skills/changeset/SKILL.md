---
name: changeset
description: Write or review the changeset for a change to @pathableai/styles or @pathableai/react - decide whether one is needed, choose the bump and write the consumer-facing summary. Use when a change touches anything a published package ships, or when reviewing a .changeset file.
---

# Changeset

A changeset records one consumer-visible change to `@pathableai/styles` or
`@pathableai/react` and becomes that change's entry in the package's
`CHANGELOG.md`. This skill owns the rules for changesets: the steps come first,
and the reference sections they apply follow.

## Steps

1. **Inventory.** List every consumer-visible change in the diff against its
   base, one line each, per package. Read the built output and the component
   pages, not only the commit messages: a renamed class or a moved file path is
   a change even when the commit calls it a refactor. Done when every changed
   path is either on the list or explained as something nothing installs.
2. **Decide whether one is needed**, by [When one is needed](#when-one-is-needed).
   If the list is empty, write no changeset and say why in the pull request's
   Changeset section.
3. **Classify.** Give each item one row of [the bump table](#choosing-the-bump),
   for the package's current version line (read its `package.json`). Ask, for
   each item: does markup or an import a consumer already has stop working, or
   change meaning? If yes, or if you cannot tell, it is breaking. Then group
   the items by kind (addition, fix, visual change, breaking change): each
   group becomes one changeset with that group's bump. Done when every item has
   a row and a group.
4. **Write.** For each group, write the [headline](#the-headline) first, in the
   form for its kind, and check that it stands alone: a consumer who reads only
   that sentence knows which thing changed and whether they are affected. Then
   add only [body](#the-body) sentences that are a visible effect, a cause that
   changes what the consumer does, or an action. For a breaking group, the
   `**Migration**` paragraph covers every rename and removal from step 1, each
   with what to use instead.
5. **Supersede.** If any item removes, renames or reverses something, search
   the pending `.changeset/*.md` files for it by class, token, property, file
   and component name, and fix each match as
   [Superseded changesets](#superseded-changesets) says. Done when no pending
   changeset describes something consumers of this release will not receive.
6. **Check.** Read each summary sentence by sentence against
   [Writing the summary](#writing-the-summary): one kind of change, the
   headline form, every body sentence an effect, cause or action, nothing from
   the excluded list, the breaking markers and the style rules. Rewrite each
   sentence that fails. Confirm each bump against the tier table in
   [`git-workflow.md`](../../../docs/engineering/git-workflow.md#tiers-and-changesets).
   Done when every sentence passes.

When reviewing someone else's changesets, run steps 1 to 6 against the diff and
report each difference from the changesets they wrote, quoting each sentence
that fails a rule.

## When one is needed

A pull request needs a changeset when it changes anything a consumer installs:

- **Package code**: source, styles, build output, entry points, file paths,
  types or other runtime behaviour.
- **Consumer agent guidance**: the component pages built into
  `packages/styles/components/` from `components/` and `fixtures/`, and
  `packages/react/agent-guidance/`. A fixture change counts when it changes
  what a built component page says.
- **Other shipped documentation**: any file in the package tarball, such as
  the package's `README.md`, `AGENTS.md` or `BRAND_RULES.md`.

It needs none for changes nothing installs: tests, stories, the Storybook
documentation site, `docs/`, repository tooling and CI.

One pull request may carry several changesets; one changeset may name several
packages when the same summary is true for each.

## The public contract

The bump is judged against what consumers can depend on. For
`@pathableai/styles` that is:

- component, element, modifier and utility class names;
- tokens and CSS custom properties, their names and what they mean;
- cascade layer names and their order;
- the per-component CSS file paths and the package entry points;
- the markup each component requires, as its component page describes it;
- the consumer agent guidance, as a description of all of the above.

Not part of the contract:

- **Fixtures.** They show the contract; they do not define it. A difference
  between a fixture and the CSS is a defect in the CSS
  ([AGENTS.md](../../../AGENTS.md)).
- **USWDS.** An upstream upgrade is judged only by what it changes in the list
  above.
- **Exact appearance.** Colour, spacing, typography and similar values may
  change in a patch, unless the change alters what the component means or how
  it is meant to be used.

## Choosing the bump

Each changeset takes the bump of the changes it describes; Changesets releases
each package at the highest bump among its pending changesets.

| Change                                                                                                                                                                                                                                        | Below 1.0.0                              | From 1.0.0              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------- |
| **Breaking**: removes or renames a class, token, custom property, cascade layer, file path or entry point, or changes what one means; requires consumers to change their markup; changes what a component means or how it is meant to be used | `minor`, marked breaking, with migration | `major`, with migration |
| **Addition**: a new component, element, modifier, utility, token, file or entry point; existing markup is unaffected                                                                                                                          | `minor`                                  | `minor`                 |
| **Deprecation** of anything public                                                                                                                                                                                                            | not used below 1.0.0                     | `minor`                 |
| **Fix**: brings the CSS into line with its component page or fixture, and existing markup keeps working                                                                                                                                       | `patch`                                  | `patch`                 |
| **Appearance**: a colour, spacing, typography or similar value, with no change in meaning or use                                                                                                                                              | `patch`                                  | `patch`                 |
| **Documentation only**: shipped guidance or documentation clarifies existing behaviour                                                                                                                                                        | `patch`                                  | `patch`                 |

Both packages are below 1.0.0. There, never use `major`: Changesets would
publish 1.0.0, and moving to 1.0.0 is a maintainer decision. Below 1.0.0,
breaking changes remove things directly, with no deprecation release first.

When a fix changes behaviour consumers may rely on, it is breaking. When it is
unclear whether a change is breaking, treat it as breaking.

## Writing the summary

The summary is copied word for word into `CHANGELOG.md`, where it sits among
dozens of others. Write it for a consumer who is scanning the release to decide
whether an entry affects them and what to do, not for a reviewer of the pull
request.

### One kind of change per changeset

Give each kind of change its own changeset: an addition, a fix, a visual change
and a breaking change to the same component are separate entries, so a reader
can find each one. A pull request that adds a modifier and fixes the
component's spacing carries two changesets.

### The headline

The first sentence is the headline. On its own it must tell a consumer which
thing changed and whether they are affected. Use one of these forms:

- **A change to the contract** starts with the verb: _Adds_, _Removes_,
  _Renames_, or _Deprecates_ from 1.0.0, then the thing.
  "Adds the `pathable-alert--no-icon` modifier, which hides the status icon."
- **A fix or visual change** starts with the thing and says what it does now
  and what it did before.
  "`pathable-breadcrumb` separators now have 6.7:1 contrast on white, instead
  of 1.3:1."

Use the present tense and name the thing as consumers write it: the class,
token, custom property, file path or entry point, in inline code. Name a
component by its class, not its React name.

### The body

Most summaries are the headline alone, or the headline and one or two
sentences. When there is more to say, put each further point on its own bullet
after the headline, rather than in one long paragraph. Every sentence must be
one of these:

- **A visible effect**: what renders, sizes, wraps or responds differently, with
  concrete values (`24px`, `4.5:1`, `480px` and wider).
- **The cause**, only when it changes what the consumer does (for example, that
  a utility now beats a component class whatever order the files load in).
- **An action** the consumer must or may take.

Everything else stays out of the summary:

- How the change was made: Sass internals, `@extend`, selectors, specificity
  arithmetic, which declarations moved or why the build dropped them.
- The repository process: stories, fixtures, issues, test or audit tools,
  follow-up work and other changesets. Name only what ships, such as a
  component page or a file in the package.
- Disclaimers the bump already makes. A `patch` or a plain `minor` already
  says nothing was renamed or removed; say what is unchanged only when a
  reader would otherwise expect it to change.

### Breaking changes

Below 1.0.0, a breaking summary starts with `**Breaking change**:` followed by
the headline as a full sentence. A `**Migration**` paragraph follows, with
steps a consumer can follow mechanically: a find-and-replace list for renames,
the replacement for each removal, and before-and-after markup when the markup
must change. Use a table when there are many replacements.

```md
---
'@pathableai/styles': minor
---

**Breaking change**: Renames the card's header and body element classes to
match the component naming convention.

**Migration**: replace in your markup:

- `pathable-card__head` with `pathable-card__header`
- `pathable-card__content` with `pathable-card__body`
```

### Style

- British spelling in prose (_colour_, _centre_), whatever the identifier
  spells (`--pathable-color-text`).
- Units without a space, as CSS writes them: `480px`, `200%`, `1.5rem`.
- Contrast as a ratio: `4.5:1`.
- Hard-wrap prose at 80 columns, as Prettier leaves it.

## Superseded changesets

The next release's changelog is every pending changeset together. When a
change removes, renames or reverses something, fix the pending changesets that
describe it in the same pull request:

- Delete a pending changeset whose change no longer reaches consumers, such as
  a fix to a component this release removes.
- Edit one that is now partly wrong, such as a change to a token this release
  renames, so it describes what consumers will receive.

A changeset may be edited or deleted until it is released. If a released
changelog entry missed a breaking change, correct that entry in the package's
`CHANGELOG.md` rather than leaving the history wrong.

# Current target of `@pathableai/styles`

This document owns the direction and current scope of the
`@pathableai/styles` refactor. It is current-state documentation, reviewed on
2026-11-22 with `main` at `28cc03eb`. Update it as the refactor progresses and
remove transitional statements when they stop being true.

The [constitution](../../.specify/memory/constitution.md) wins where it states
a repository-wide rule, but it predates this narrower refactor target. Where a
package document describes the old `usa-` model, JavaScript components or
React as the current delivery path, this document owns the current direction.

## Three deliverables

The refactor is working toward three `@pathableai/styles` products:

### Human product documentation

The styles Storybook published at `https://pathableai-org.github.io/styles/`
explains each supported component, shows its meaningful states, and provides
copyable HTML. It also documents the design tokens, utility classes and fixed
USWDS build settings the package exposes.

The website is a rolling view built from the repository. It must identify the
version or revision it represents rather than implying that it necessarily
matches every installed npm version.

### Compiled CSS

The npm package is a thin wrapper around USWDS for the supported static
catalog. It encapsulates USWDS configuration, applies PathAble brand defaults
and makes only narrow, evidenced deviations. A normal consumer installs the
package and imports compiled CSS; it does not install or configure USWDS.

The target contract is:

- supported component selectors use `pathable-` names with no `usa-` class
  required in consumer markup;
- USWDS design tokens and utility classes that are already unprefixed keep
  their USWDS names, such as `grid-container`, `margin-top-2` and `text-bold`;
- the default rendering encodes the PathAble brand; and
- no supported component requires design-system JavaScript for its defining
  behavior.

### Consumer agent guidance

The completed guidance will be human-readable Markdown in the same
`@pathableai/styles` npm package as the CSS. It will tell agents in consuming
repositories how to choose components by semantic intent, copy canonical
markup, compose supported variants, preserve accessibility and report defects.
Installing it with the package will tie it to that CSS version rather than the
rolling website. Generated component Markdown already ships; the dedicated
routing entry point and package-wide selection and bug-reporting guidance do
not.

This is **consumer agent guidance**. Repository-local `AGENTS.md`, engineering
documents, skills and role instructions are **contributor agent guidance**.
Agents must not use the ambiguous phrase "agent-facing docs" when the audience
is not otherwise clear.

## Shared sources

The outputs above derive from three owning sources:

- [`components/`](../../components/README.md) holds the product specification
  for each component, token family and utility family. A component page owns
  purpose, variants, composition, guarantees and consumer responsibilities.
- [`fixtures/`](../../fixtures/README.md) holds the canonical HTML snippets.
  The same fixture is rendered in Storybook, embedded in human and consumer
  documentation, checked against compiled CSS, and exercised by HTML and
  accessibility tooling.
- `packages/styles/src/` holds the SCSS and assets that produce the installed
  CSS.

Generated outputs may add navigation or presentation for their audience, but
they must not copy and independently maintain component semantics or example
markup.

## Supported component scope

The current catalog is the static set classified in
[`components/README.md`](../../components/README.md#catalog-scope). "Static"
means that the component's defining behavior does not require JavaScript from
the design-system package. Native interactive HTML controls such as buttons,
checkboxes and selects remain in scope.

Accordion, combo box, date picker, modal, tooltip and the other components
whose defining behavior needs package JavaScript are outside the current
catalog. Their existing source does not make them part of the target.

The design-token and utility documentation and fixture slices are in place.
Current implementation work is bringing the documented static components into
conformance with their pages and fixtures through small component slices.
Alert, breadcrumb, button, button group, card, checkbox and collection are in place; the remaining catalog
is still being completed.

## USWDS deviation policy

Begin with current USWDS markup and compiled styles, configure its supported
theme settings for PathAble, and keep local deviations exceptional.

A deviation is in scope only when it:

- encodes an approved PathAble brand choice that USWDS configuration cannot
  express adequately; or
- corrects a demonstrated accessibility defect.

Each deviation must be as narrow as practical, state its motivation, and have
evidence in a fixture, story, automated check or documented visual review.
General redesign, convenience divergence, application-specific behavior and
new interaction behavior are outside the current refactor. A generally useful
USWDS defect should be considered for an upstream report; a local workaround
must still remain understandable and removable.

## Retained but deferred areas

Presence in the repository is not the same as active support scope. The
following areas remain to avoid accidental breaking changes, but are not
current refactor targets unless a task explicitly names them:

| Area                                                      | Current instruction                                                                                                                                                              |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/react/`                                         | Do not expand, modernize or remove React components, APIs, stories or guidance as part of static styles work. Do not use React behavior to redefine a component page or fixture. |
| React Storybook and the former `/react` Pages surface     | Retained but not currently built or deployed during the static styles refactor. Do not re-enable, expand or remove it without an explicitly scoped task.                         |
| `packages/styles/src/js/` and the existing `./js` exports | Do not add JavaScript behavior, make a static component depend on it, modernize it opportunistically or delete it.                                                               |
| JavaScript-dependent component wrappers                   | Do not bring them into the supported catalog or change their DOM contract during static component work.                                                                          |
| Legacy PathAble-only components                           | Keep them unless a separate decision says to retain, move or remove one. They do not expand the USWDS static catalog.                                                            |

A component-page or fixture change may make committed React guidance stale.
When an existing check requires it, update only the generated output
mechanically and describe it that way. If generation requires a semantic React
decision, stop and ask rather than widening the styles task.

Nothing in this document authorizes deletion of deferred code.

## Hybrid state and defects

The repository is intentionally hybrid while the CSS catches up:

- the token, utility and static component pages describe the target contract;
- fixtures contain target markup with no `usa-` classes;
- parts of the compiled CSS still carry legacy selectors, custom properties or
  wrapper behavior;
- generated component Markdown already ships in `@pathableai/styles`, but the
  dedicated styles consumer-guidance entry point and package-wide instructions
  are not complete; and
- contributor-oriented `packages/styles/AGENTS.md` is still included in the
  npm package and must not be mistaken for the intended consumer guidance.

For an in-scope static component, a difference between the component page or
fixture and compiled CSS is a defect in the CSS. Do not change a fixture, page
or documented class back toward legacy SCSS. Fix the implementation in the
component's scoped work, or record the known gap without expanding the pull
request.

Existing drift in a deferred React, JavaScript or legacy component area is not
an invitation to fix it. Do not introduce a new failure there, but keep a
confirmed unrelated defect out of the current change and report it through the
repository bug process.

## Bug reporting target

Consumer agents and contributor agents use the same defect vocabulary:

- search for an existing issue first;
- identify the released `@pathableai/styles` version or base SHA;
- identify the component slug, or a non-component area such as tokens,
  utilities, packaging or documentation;
- state observed and expected behavior, reproduction steps and the broken
  component-page guarantee when one exists;
- name the relevant WCAG criterion for an accessibility defect; and
- use synthetic content and include no credentials or sensitive data.

A styles defect carries `bug` and `package:styles`. A component defect also
identifies the affected component so repository triage can apply a component
label. The exact label names and automation, and how an installed third-party
agent submits when it lacks GitHub authority, remain follow-up product work;
agents must not invent those mechanisms independently.

## Order of work

1. **Keep shared sources authoritative.** Maintain the token, utility and
   static component pages and fixtures as the target. Generate human and
   installed documentation from them rather than copying content.
2. **Bring static component CSS into conformance.** Work in small component
   slices. Rename and implement only the selectors, variants and behavior the
   page and fixtures require, with narrow brand or accessibility deviations.
3. **Complete styles consumer guidance.** Add a clear installed entry point,
   semantic component-selection guidance and the shared bug-reporting
   instructions to `@pathableai/styles`. Do not use React guidance as its
   substitute.
4. **Restore and tighten gates as implementation catches up.** Make fixture,
   accessibility, package-content and documentation-drift checks protect the
   supported contract, then retire transitional allowances.

## Open decisions

These decisions belong to the maintainer and must not be made incidentally in
a component pull request:

- the final installed path and routing entry point for styles consumer agent
  guidance;
- whether and how GitHub issue automation applies component and area labels;
- whether GitHub Pages becomes versioned or continues as a clearly identified
  rolling build;
- the eventual disposition of React, styles JavaScript, JavaScript-dependent
  wrappers and PathAble-only legacy components; and
- any future compiled-CSS entry points beyond the package's current bundle
  shape.

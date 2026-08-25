# Research: Theming Documentation and End-to-End Validation

This feature ships no new runtime surface, so the research questions are all *placement and
evidence* decisions, not library or API design decisions. Each decision below resolves a Technical
Context unknown or a spec assumption with a concrete choice, rationale, and the alternatives
considered.

## Decision 1 — Documentation lives under `docs/theming/`, linked from package READMEs

- **Decision**: The token vocabulary reference, consumer guide, and acceptance-verification record
  live under a new `docs/theming/` directory. `packages/react/README.md` and
  `packages/styles/README.md` link to them; neither duplicates the content.
- **Rationale**: The parent plan (`docs/plans/react-theming/06-theming-documentation.md` "DONE
  Means") and the spec assumption both require the artifacts to live "under `docs/`". Constitution
  XII assigns distinct responsibilities to each surface: the `docs/` area is the curated reference,
  the Astro site is the public entry point, Storybook is the executable catalog, and package READMEs
  carry operational instructions. Placing the canonical vocabulary/guide in `docs/theming/` and
  linking from READMEs honors "one canonical source per fact; other surfaces derive from or link to
  it". The Astro site (`apps/docs`) has no authored source checked into this repo (only build
  output), so it cannot be the canonical home today; a future docs-site page should link here.
- **Alternatives considered**: (a) package READMEs as the canonical home — rejected because READMEs
  are operational, not reference, surfaces per constitution XII and would force the vocabulary
  table to be duplicated across two packages; (b) Astro `apps/docs` — rejected because its source is
  not in-repo and adding a content-collection source would be a docs-site change well beyond this
  feature's scope; (c) Storybook-only — rejected because Storybook is the executable catalog, not a
  prose reference, and the vocabulary needs a human-readable role column that belongs in prose.

## Decision 2 — The end-to-end rendered test is a Storybook story + a browser-executed assertion

- **Decision**: Add a deterministic story to `packages/react/src/stories/components/theme/`
  rendering a representative existing layout (`AppShell`) wrapped in `ThemeProvider` with a partial
  theme, and wire a browser-executed assertion into `apps/storybook-react/.storybook/test-runner.js`
  (keyed to the new story id) that asserts `getComputedStyle` resolution.
- **Rationale**: The spec requires asserting *resolved* colors for overridden and unspecified
  tokens, and subtree scoping — i.e., what `var(--pathable-color-*)` actually resolves to in a real
  cascade. jsdom does not resolve CSS custom properties, so a Vitest-only test would only inspect
  the wrapper's inline `style` (a proxy, not resolution). The React Storybook already runs a real
  Chromium page via the test-runner and `axe-playwright`, so the browser is already available with
  no new dependency. Constitution XIV names Storybook the "executable component contracts" surface
  and constitution X requires rendered accessibility; this aligns the resolution proof with that
  existing harness.
- **Alternatives considered**: (a) a Vitest/jsdom integration test — rejected because jsdom cannot
  compute `var()` resolution; (b) a new standalone Playwright script outside Storybook — rejected
  because it would duplicate the build/serve/test lifecycle already owned by `test-storybook.mjs`
  and the test-runner, adding surface with no benefit; (c) a `@storybook/test` `play` function —
  evaluated and deferred: the interaction addon is not currently a `apps/storybook-react`
  dependency, and a `postVisit` hook in the existing test-runner achieves the same assertion
  without a new dependency.

## Decision 3 — "Resolved color" is measured via `getComputedStyle` on real layout nodes

- **Decision**: The assertion reads `getComputedStyle(el).getPropertyValue('--pathable-color-…')`
  on an element inside the `AppShell` that references that token (e.g. a `Button` primary action
  for `--pathable-color-action-primary-bg`, a text node for `--pathable-color-text`), and compares
  it to the expected hex. For tokens with no convenient rendered consumer, the assertion falls back
  to inspecting the provider wrapper's inline custom property, with a comment documenting that
  limitation.
- **Rationale**: This is the only faithful reading of FR-006/FR-007 ("rendered output is inspected",
  "resolves to"). `getComputedStyle` exercises the full cascade and the component's own
  `var(--pathable-*)` references, proving the end-to-end path rather than the provider's emission in
  isolation.
- **Alternatives considered**: (a) only inspect the wrapper `style` attribute — rejected as a proxy
  that does not prove a component actually consumes the token; (b) parse compiled CSS — rejected as
  an indirect, brittle proof that does not exercise rendering.

## Decision 4 — Backward compatibility is evidenced by existing gates, not new fixtures

- **Decision**: US2/FR-009 is satisfied by the existing deterministic stable stories plus the visual
  smoke suite (`pnpm test:visual`) and the story contract gate (`pnpm test:storybook-react`), which
  all render the no-provider path against the pre-theming baseline. The verification record cites
  these gates rather than creating a bespoke before/after fixture.
- **Rationale**: Every existing story renders with no `ThemeProvider` (theming was added on top of
  an unchanged component layer), so the no-provider path is already the regression fixture set. The
  visual smoke suite asserts render/non-blank/overflow across canonical stories at three viewports,
  and the story contract gate asserts structure. Re-running them is the honest backward-compat
  evidence; a new "before" snapshot would be a fabrication since the pre-theming output is exactly
  the current no-provider output.
- **Alternatives considered**: (a) a dedicated no-provider vs. default-theme-provider story pair —
  retained as an optional *supplementary* story (both render identically, confirming the
  `ThemeProvider` no-wrapper optimization), but it is not the primary evidence; (b) committing new
  "pre-theming" snapshots — rejected as redundant with the existing stable-story baseline.

## Decision 5 — The representative layout is `AppShell`

- **Decision**: The rendered test uses the React `AppShell` (already available as a story and used
  by the visual/quality gates) as the representative layout, rather than a bespoke fixture.
- **Rationale**: The spec assumption names "the app-shell or a page-composition pattern". `AppShell`
  is the richest single existing layout, is already a canonical story, and consumes multiple
  color tokens (surface, text, border, action, brand), giving the resolution assertion real
  coverage. Reusing it avoids a bespoke fixture that could silently drift from the real layout.
- **Alternatives considered**: (a) `DashboardOverview` — rejected as heavier and more token-specific;
  (b) a minimal synthetic layout — rejected by the spec assumption (no bespoke fixture).

## Decision 6 — The vocabulary reference is generated from `defaultTheme` and reviewed, not hand-typed

- **Decision**: The vocabulary table's default-value column is produced from `defaultTheme.colors`
  (itself generated from `$semantic-colors` in `_semantic.scss`) and reviewed as a human-readable
  table; the role column is a plain-language description added by the author. Completeness and
  accuracy are enforced by `pnpm lint:tokens` (which already fails on any drift between the SCSS
  token set and `THEME_COLOR_KEYS`) and by a table-vs-`defaultTheme` spot-check in the verification
  record.
- **Rationale**: This matches the spec assumption that the reference "cannot drift" because it is
  derived from `defaultTheme`, and matches constitution VIII (SCSS is the source of truth). It also
  avoids the classic defect of a hand-maintained table that silently falls out of sync with the
  theme.
- **Alternatives considered**: (a) fully hand-typed table — rejected as drift-prone (spec edge case
  names a missing/extra token as a defect); (b) an auto-generated table with no role column —
  rejected because the role column (FR-001) is the human value-add and cannot be generated.

## Decision 7 — The verification record is a prose checklist with evidence pointers, not a script

- **Decision**: `docs/theming/acceptance-verification.md` lists each of the 11 parent-plan
  acceptance criteria with a status ("satisfied" or "addressed") and a pointer to the evidence
  (a gate command, a contract, or a story). FR-011 (invalid keys rejected at type-check) is verified
  by a compile-failure assertion in the record; FR-013 (tone-type imports) and FR-014
  (structural-subpath independence) are verified by `test-next-consumer`/`check:types` plus the
  061 contract.
- **Rationale**: The parent plan's acceptance criteria are the contract for the whole series
  (spec FR-010, SC-005). A prose record with evidence pointers is reviewable, durable, and does not
  invent a new automation surface. Where an existing gate already proves a criterion, the record
  cites it rather than re-implementing it.
- **Alternatives considered**: (a) a new CI script that re-checks everything — rejected as redundant
  with existing gates and higher maintenance; (b) leaving the criteria in the parent plan unchecked
  — rejected (FR-010 explicitly requires every criterion checked off or addressed).

## Open items resolved

No NEEDS CLARIFICATION remains after research. The one deferred micro-decision (whether to add a
supplementary no-provider vs. default-theme-provider story for FR-009) is settled as "optional
supplementary story; the primary evidence is the existing gates" (Decision 4).

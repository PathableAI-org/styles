# Quickstart: Validating Theming Documentation and End-to-End Proof

This guide proves the feature works end-to-end: the docs are complete and accurate, and a partial
theme demonstrably resolves in a rendered layout. Full contracts live in
[`contracts/token-vocabulary.md`](./contracts/token-vocabulary.md),
[`contracts/consumer-guide.md`](./contracts/consumer-guide.md), and
[`contracts/rendered-validation.md`](./contracts/rendered-validation.md); the domain facts are in
[`data-model.md`](./data-model.md). It is a validation/run guide — implementation details belong to
`tasks.md` and the implementation phase.

## Prerequisites

- Repo checked out on branch `062-theming-documentation`.
- `pnpm` (see root `package.json` `packageManager` / `engines.node`).
- Dependencies installed: `pnpm install`.

## 1. Verify the vocabulary is complete and accurate (FR-001/FR-002)

Confirm the token set did not drift and the reference is derived from `defaultTheme`:

```bash
pnpm lint:tokens
```

Expected: exit `0` — the 25 `ThemeColors` keys match the `$semantic-colors` token set exactly.
Then read `docs/theming/token-vocabulary.md` and confirm every `defaultTheme` color appears exactly
once with the correct `--pathable-color-*` property and a role description.

## 2. Verify the consumer guide is self-sufficient (FR-003/FR-004/FR-005)

Read `docs/theming/consumer-guide.md` and confirm a developer can, without consulting package source:

- produce a working `createTheme` + `ThemeProvider` override with no hand-written CSS;
- extend `defaultTheme` by overriding individual keys;
- decide between the default stylesheet import and the provider-driven path.

## 3. Build the packages (prerequisite for the rendered test)

```bash
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/react build
```

Expected: both builds succeed; `dist/components.css` and `dist/utilities.css` exist.

## 4. Run the rendered end-to-end test (FR-006/FR-007/FR-008)

```bash
pnpm test:storybook-react
```

Expected: the new `AppShell`-under-partial-theme story renders, and the browser-executed assertion
passes — overridden tokens resolve to `#7c3aed`, unspecified tokens resolve to defaults, and the
override stays scoped to the provider subtree.

## 5. Verify backward compatibility (FR-009)

```bash
pnpm test:visual
pnpm test:storybook
```

Expected: all canonical stories (rendered with no `ThemeProvider`) pass visual smoke and contract
checks — identical to the pre-theming state.

## 6. Cross-cutting verification (FR-011/FR-012/FR-013/FR-014)

```bash
pnpm --filter @pathableai/react typecheck          # FR-011: invalid keys fail at type-check
pnpm --filter @pathableai/react test:unit          # FR-012: defaultTheme + token list exported
pnpm --filter @pathableai/react check:types        # FR-013: tone types importable (attw)
pnpm test:next-consumer                            # FR-014: structural subpaths independent
pnpm --filter @pathableai/styles pack --dry-run    # subpaths present in the tarball
```

Expected: all exit `0`. `typecheck` demonstrates a `createTheme({ colors: { accentColour: … } })`
call fails to compile (invalid key rejected at type-check, not silently at runtime).

## 7. Full quality gates (SC-006)

```bash
pnpm lint            # js + styles + markdown + tokens + format
pnpm typecheck
pnpm test:storybook-react
pnpm test:visual
```

Expected: all exit `0`.

## Acceptance trace

| Spec scenario | Validated by |
| ------------- | ------------ |
| Story 1: partial theme resolves | §3–§4 (`test:storybook-react` browser assertion) |
| Story 2: no-provider identical rendering | §5 (`test:visual` + `test:storybook`) |
| Story 3: discover what each token controls | §1 (`token-vocabulary.md` read check) |
| Story 4: follow the guide | §2 (`consumer-guide.md` read check) |
| Story 5: parent criteria closed out | §6 + `docs/theming/acceptance-verification.md` |
| FR-015: no new runtime surface | source diff — only `docs/` + story/test files change |

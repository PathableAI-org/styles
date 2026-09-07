# Quickstart: Validating React Entry Point Wiring

This guide proves the feature works end-to-end across the three supported consumer paths and the
package-content/build validation gates. Full contracts live in
[`contracts/react-entry-point.md`](./contracts/react-entry-point.md) and
[`contracts/styles-subpaths.md`](./contracts/styles-subpaths.md); the domain facts are in
[`data-model.md`](./data-model.md). It is a validation/run guide — implementation details belong to
`tasks.md` and the implementation phase.

## Prerequisites

- Repo checked out on branch `061-react-entry-point-wiring`.
- `pnpm` (see root `package.json` `packageManager` / `engines.node`).
- Dependencies installed: `pnpm install`.

## 1. Build both packages

```bash
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/react build
```

Expected: the styles build emits `dist/components.css` and `dist/utilities.css` (among others); the
React build succeeds.

## 2. Verify the React package's structural imports (FR-001)

Inspect the built entry:

```bash
head -n 2 packages/react/dist/index.js
```

Expected: the output begins with the two structural side-effect imports and does **not** import the
default `.` root:

```js
import "@pathableai/styles/components";
import "@pathableai/styles/utilities";
```

Confirm no `import "@pathableai/styles";` (root) remains and that the compiled CSS was not bundled
into the React output (no `.css` asset emitted next to `index.js`).

## 3. Provider-driven path (Story 1 / FR-002)

Run the React unit tests (which include the `ThemeProvider` emission/scoping assertions from feature
060):

```bash
pnpm --filter @pathableai/react test:unit
```

Then spot-check a provider-only render: wrap content in `ThemeProvider` with `createTheme(...)` and
import no default stylesheet. Assert the rendered element's custom properties come exclusively from
the provider — no package-provided default token values interleave.

## 4. Default and theme-subpath paths (Story 2 / Story 3 / FR-003 / FR-004)

Render the same component set twice, once with `import '@pathableai/styles'` and once with
`import '@pathableai/styles/theme'`, and compare the visual + structural output to the pre-change
baseline:

```bash
pnpm --filter @pathableai/styles build
pnpm --filter @pathable/storybook-react storybook
```

Expected: identical rendering in both cases (the default token layer comes from the
application-level import, not the React package). The story contract gate re-runs the regression
suite:

```bash
pnpm test:storybook-react
```

## 5. Package-content and build validation (Story 5 / FR-006)

```bash
pnpm --filter @pathableai/react check:package   # publint --pack false
pnpm --filter @pathableai/react check:types     # attw --pack --profile esm-only
pnpm --filter @pathableai/styles pack --dry-run
```

Expected: zero failures; the styles tarball still contains `dist/components.css` and
`dist/utilities.css` with the `exports` map intact.

## 6. Packed-consumer and server-compat checks

```bash
pnpm test:next-consumer
pnpm test:storybook-react-server
```

Expected: the generated Next.js consumer installs the packed packages and renders; the server
compatibility audit reports no new findings.

## 7. Full quality gates

```bash
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react test:unit
pnpm --filter @pathableai/react build
pnpm lint:tokens
```

Expected: all exit `0`; `pnpm lint:tokens` confirms the token vocabulary is untouched (FR-008).

## Acceptance trace

| Spec scenario | Validated by |
| ------------- | ------------ |
| Story 1: provider-only tokens, no cascade fight | §3 + `ThemeProvider.test.tsx` |
| Story 2: default path renders identically | §4 + `test:storybook-react` |
| Story 3: theme-subpath renders identically | §4 |
| Story 4: documentation + breaking-change note | `packages/react/README.md` + Changeset (read check) |
| Story 5: structural subpaths resolve in the package | §2 + §5 + §6 |
| FR-008: no token/component change | §7 `pnpm lint:tokens` + unchanged exports |

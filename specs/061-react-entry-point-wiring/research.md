# Research: React Entry Point Wiring

This document resolves the open design questions for the plan's Technical Context into concrete,
implementable decisions. Each section follows the Decision / Rationale / Alternatives structure.
The findings are grounded in the current repository state: the styles package already ships the
structural subpaths, the React package already depends on it via the workspace protocol, and the
React library build already externalizes the styles entry.

## 1. How `@pathableai/styles` exposes the structural subpaths

**Decision**: The `@pathableai/styles` package already exposes the two structural subpaths this
feature needs — `./components` and `./utilities` — through its `package.json` `exports` map
(delivered by feature 057, "consolidated-theme-token-css"):

```jsonc
"exports": {
  ".":            "./dist/styles.css",
  "./js":         "./dist/pathable.js",
  "./js/init":    "./dist/pathable-init.js",
  "./components": "./dist/components.css",
  "./utilities":  "./dist/utilities.css",
  "./theme":      "./dist/theme-default.css",
  "./dist/*":     "./dist/*",
  "./src/*":      "./src/*"
}
```

Each subpath is produced by the styles `build` script from a dedicated SCSS entry:

| Subpath      | SCSS entry                     | Compiled output           | Contents                                                                 |
| ------------ | ------------------------------ | ------------------------- | ------------------------------------------------------------------------ |
| `.`          | `src/index.scss`               | `dist/styles.css`         | Full stylesheet: tokens + utilities + component wrappers + layout grid   |
| `./components` | `src/components.scss`        | `dist/components.css`     | Fonts + component wrappers + USWDS layout grid; **no** `:root` tokens    |
| `./utilities`  | `src/utilities.scss`         | `dist/utilities.css`      | Utility classes; **no** `:root` tokens                                   |
| `./theme`      | `src/theme-default.scss`     | `dist/theme-default.css`  | Default `:root` token declarations (brand + semantic + non-color)        |

**Rationale**: The spec's Assumption — "the granular stylesheet subpath exports already exist" — is
confirmed by the current `packages/styles/package.json`, the four compiled `dist/*.css` files, and
`packages/styles/README.md` (which already documents the `components`/`utilities`/`theme` subpaths).
This feature is therefore purely a consumer-side re-pointing; it must not add or rename subpaths.

**Alternatives considered**:

- Add the subpaths in this feature — rejected: they already exist (feature 057); re-adding would
  duplicate or risk divergence.
- Import `./dist/*` paths directly — rejected: violates the package `exports` contract and the
  "no private dist import" guidance in `packages/react/README.md`.

## 2. How `@pathableai/react` depends on `@pathableai/styles`

**Decision**: `packages/react/package.json` already declares `@pathableai/styles` as a runtime
dependency via the workspace protocol (`"@pathableai/styles": "workspace:*"`), satisfying
constitution V/VI (wrapper declares the styles package as a runtime dependency and imports compiled
styles at its public entry point). This feature does not change the dependency declaration — only
which of the styles package's subpaths the React entry point imports.

**Rationale**: The dependency graph is already correct; the change is in the import statement, not
the manifest. The workspace protocol ensures the dev-time import resolves to the local
`packages/styles` build, and pnpm rewrites it to a published version at pack/publish time.

**Alternatives considered**:

- Move `@pathableai/styles` to `peerDependencies` — rejected: constitution V/VI require it as a
  runtime dependency so consumers receive styles automatically without a separate install/import.
- Change the dependency range — rejected: out of scope; the workspace protocol is the established
  convention across the monorepo.

## 3. The exact entry-point edit

**Decision**: In `packages/react/src/index.ts`, replace the single side-effect import

```ts
import '@pathableai/styles'
```

with the two structural subpath imports:

```ts
import '@pathableai/styles/components'
import '@pathableai/styles/utilities'
```

The comment currently reading "Retain the styles package's public CSS entry as a consumer-visible
side effect" is updated to state that the package now imports only structural layers, not the
default theme token layer. No export statement changes.

**Rationale**: `import '@pathableai/styles'` resolves to `dist/styles.css`, which includes the
`:root` default theme token layer (FR-001 violation). `./components` and `./utilities` together
provide the structural styles consumers need (component wrappers + utilities) without the default
tokens, exactly satisfying FR-001 while preserving the automatic-styles contract for the structural
layers. The two imports are kept as separate subpath imports rather than one combined import
because no combined "structural only" entry exists.

**Alternatives considered**:

- Import only `./components` — rejected: utility classes (`.pathable-margin-*`, etc.) would be
  missing for consumers relying on the React package for structural styles.
- Import only `./utilities` — rejected: component wrapper classes (`.pathable-button`, etc.) would
  be missing.
- Introduce a new `./structural` subpath in styles — rejected: invents a new contract not required
  by the spec and expands scope into `packages/styles`.

## 4. Vite build must externalize the subpaths

**Decision**: `packages/react/vite.config.ts` must be updated so the two new side-effect imports
are externalized, not bundled. The current config externalizes only the exact specifier
`'@pathableai/styles'`:

```ts
rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', '@pathableai/styles'] }
```

Rollup/Vite `external` array entries are exact string matches, so `@pathableai/styles/components`
and `@pathableai/styles/utilities` are **not** covered by the existing entry. The fix replaces the
exact entry with a regex that matches the package root and all subpaths:

```ts
external: [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  /^@pathableai\/styles(\/|$)/,
]
```

**Rationale**: Without this, Vite resolves the two CSS files and bundles/extracts them into a CSS
asset instead of leaving runtime side-effect imports in `dist/index.js`. That would (a) break the
"automatic styles through the wrapper" contract — the published JS would no longer import the styles
subpaths — and (b) duplicate the compiled CSS in the React tarball, violating the architecture
decision in feature 034 ("treat that exact package entry as external during the React library
build") and constitution IV/V. The current `dist/index.js` already begins with
`import "@pathableai/styles";` (confirmed), proving the externalization behavior; the change extends
that behavior to the two subpaths.

**Alternatives considered**:

- Add `'@pathableai/styles/components'` and `'@pathableai/styles/utilities'` as two extra exact
  strings — acceptable but more brittle than a regex and would need a third edit if a future
  subpath is added.
- A `(id) => id.startsWith('@pathableai/styles')` function — equivalent to the regex; the regex is
  more concise and is the documented Rollup form.
- Leave the config unchanged and rely on Vite to bundle CSS — rejected for the reasons above.

## 5. How build/package checks validate subpath resolution

**Decision**: The change is validated by three complementary mechanisms, all already present in the
repo:

1. **`pnpm --filter @pathableai/react build`** — `vite build` emits `dist/index.js`; with the
   externalization fix, the output begins with `import "@pathableai/styles/components";` and
   `import "@pathableai/styles/utilities";` and contains no bundled CSS asset. `tsc -p
   tsconfig.build.json` then type-checks/emits declarations.
2. **`pnpm --filter @pathableai/react check:package`** (`publint --pack false`) — verifies the React
   package's own `exports` map, entry points, and files. The CSS side-effect imports are external
   runtime imports and do not affect the type surface, so publint does not flag them.
3. **`pnpm --filter @pathableai/react check:types`** (`attw --pack --profile esm-only`) — packs the
   package and verifies the types resolve for consumers. Because the two new imports are side-effect
   CSS imports (no types), attw's type resolution is unaffected; the styles subpaths are owned by
   `@pathableai/styles`, whose own `exports` map provides them.

Additionally, the repo's `scripts/test-next-consumer.mjs` packs both packages and installs them into
a generated Next.js consumer, which is the strongest end-to-end proof that the structural subpaths
resolve in the published artifacts. `pnpm --filter @pathableai/styles pack --dry-run` confirms the
styles tarball still contains `dist/components.css` and `dist/utilities.css` with the `exports` map
intact.

**Rationale**: These are the exact tools the spec names (`publint`, `attw`/`@arethetypeswrong/cli`),
and they are already wired into the package scripts. The key correctness risk is not types but
bundling, which the `vite build` externalization (Section 4) plus the packed-consumer check cover.

**Alternatives considered**:

- A new dedicated script — rejected: unnecessary; the existing scripts already cover the surface.
- Relying on the monorepo build alone — explicitly rejected by the constitution ("A successful
  monorepo build alone MUST NOT be treated as proof that a package is publishable").

## 6. Documentation and the breaking-change note

**Decision**: `packages/react/README.md` is the canonical consumer-facing surface for the change. It
must state, for each supported path, the exact stylesheet import required, and must add an explicit
breaking-change note for consumers who previously relied on the React package's implicit default
theme import:

- **Provider-driven (ThemeProvider)**: `import '@pathableai/react'` only — structural styles load
  automatically; no default theme import needed; supply tokens via `ThemeProvider`.
- **Default path**: `import '@pathableai/react'` + `import '@pathableai/styles'` — full default
  token layer (unchanged behavior).
- **Theme-subpath path**: `import '@pathableai/react'` + `import '@pathableai/styles/theme'` —
  default tokens via the theme subpath (unchanged behavior).

A `.changeset` entry records the breaking change for release management (constitution XIII); the
`@pathableai/styles` package itself does not need a changeset because its subpaths and mappings are
unchanged.

**Rationale**: FR-005 requires exact per-path instructions and an explicit breaking-change warning;
the spec's edge cases require the "import react with no stylesheet" case to be called out as the
breaking change. `packages/styles/README.md` already documents the subpath → `dist/*.css` mapping
(feature 057), so the React README links to it rather than duplicating it (constitution XII —
canonical source for each fact).

**Alternatives considered**:

- Document only in the styles README — rejected: the consumer change is in the React package; the
  React README is the surface consumers read after `pnpm add @pathableai/react`.
- Document in Astro docs site — rejected: no docs-site change is required for this feature; the
  README is the canonical operational surface (constitution XII).

## 7. Backward-compatibility verification strategy

**Decision**: The two backward-compatible paths (default and theme-subpath) render identically to
today because the default token layer comes from the *application-level* import of `@pathableai/styles`
or `@pathableai/styles/theme` — not from the React package. Removing the React package's implicit
default import only changes the `import '@pathableai/react'`-only case. Verification is a
before/after visual + structural comparison of the existing stable Storybook stories:

- Storybook loads the full styles at the application boundary, so the story set is unchanged and
  remains the regression fixture for the default path.
- The provider-driven path is proven by rendering with `ThemeProvider` and no default stylesheet
  import and asserting the rendered custom properties come exclusively from the provider.

**Rationale**: The spec defines "identical rendering" as visual and structural (snapshot)
comparison; the repo's Storybook + contract gates are the existing mechanism for this. No new
fixtures or token changes are required, keeping the change minimal.

**Alternatives considered**:

- Add a dedicated "no-default-token" story — rejected: not required; the provider-driven path is
  already covered by the `ThemeProvider` stories from feature 060, and the breaking-change behavior
  is a consumer-education concern documented in the README/Changeset.

## Consolidated decision summary

| Question | Decision |
| -------- | -------- |
| Structural subpaths | Already exist: `./components` → `dist/components.css`, `./utilities` → `dist/utilities.css` |
| Dependency | `@pathableai/styles: workspace:*` (runtime) — unchanged |
| Entry-point edit | Replace `import '@pathableai/styles'` with the two structural subpath imports |
| Vite build | Externalize `/^@pathableai\/styles(\/|$)/` so runtime side-effect imports survive |
| Package checks | `vite build` + `publint --pack false` + `attw --pack` + `test-next-consumer.mjs` |
| Documentation | `packages/react/README.md` per-path instructions + breaking-change note + Changeset |
| Backward compat | Verified via unchanged Storybook fixtures + provider-driven render assertion |

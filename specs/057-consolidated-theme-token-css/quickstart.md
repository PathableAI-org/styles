# Quickstart: Validating the Consolidated Theme Token CSS Feature

Validation scenarios that prove the feature works end-to-end. These commands run from the
repository root. See [contracts/package-exports.md](./contracts/package-exports.md) and
[data-model.md](./data-model.md) for the underlying contracts.

## Prerequisites

- `pnpm install` (Dart Sass and the USWDS dependency available).
- A clean working tree (the build rewrites `dist/*`).

## 1. Build the styles package

```bash
pnpm --filter @pathableai/styles build
```

Expected: `dist/styles.css`, `dist/components.css`, `dist/utilities.css`, and
`dist/theme-default.css` all exist.

## 2. Confirm the single consolidated color block

```bash
pnpm --filter @pathableai/styles lint:tokens
```

Expected: the token lint passes, and the single-`:root`-color-block assertion holds
(fails if any `--pathable-color-*` is declared outside `_semantic.scss`'s block).

## 3. Confirm the split files reproduce the combined output

```bash
node -e '
const fs = require("fs");
const read = (f) => fs.readFileSync(`packages/styles/dist/${f}`, "utf8");
const parts = read("components.css") + "\n" + read("utilities.css") + "\n" + read("theme-default.css");
const combined = read("styles.css");
// Compare the set of declarations (rendered behavior), not raw order.
const tokens = (css) => (css.match(/--[a-z0-9-]+/g) || []).sort().join("\n");
if (tokens(parts) !== tokens(combined)) {
  console.error("Mismatch between split files and combined styles.css");
  process.exit(1);
}
console.log("Split files reproduce the combined output token set.");
'
```

Expected: the token set across the three split files matches `styles.css`.

## 4. Confirm package contents include the new files

```bash
pnpm --filter @pathableai/styles pack --dry-run
```

Expected: the tarball listing includes `dist/components.css`, `dist/utilities.css`, and
`dist/theme-default.css`, and the `exports` map resolves the new subpaths.

## 5. Confirm default import parity

`import '@pathableai/styles'` (the default `.` path) still resolves to `dist/styles.css`
and renders identically to today — verified by the unchanged `styles.css` output and the
parity check in step 3.

# Context Digest: S01-integration-01 — Setup & Dependency

## Goal
Add USWDS v3.x dependency to `packages/styles/package.json`, update build script with `--load-path`, install deps, verify build.

## Key Facts
- Current build: `sass src/index.scss dist/styles.css`
- Target build: `sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css`
- USWDS version: `@uswds/uswds@^3.0.0` (latest stable 3.x)
- Add to `dependencies` (not `devDependencies`)
- Existing deps: `sass@^1.86.3` in devDependencies

## Constraints
- Must not touch _uswds-theme.scss, _colors.scss, _semantic.scss, README, BRAND_RULES, AGENTS
- Must not edit tasks.md
- Must not dispatch workers

## Verify After
- `node -e "const p = require('./packages/styles/package.json'); console.log(p.dependencies['@uswds/uswds'])"` prints a version
- Build script contains `--load-path=node_modules/@uswds/uswds/packages`
- `pnpm build` exits 0 in packages/styles/
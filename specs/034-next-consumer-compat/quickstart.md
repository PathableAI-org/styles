# Quickstart: Validate Next Consumer Compatibility

## Prerequisites

- Use the repository-declared Node and pnpm versions.
- Install workspace dependencies before running consumer validation.
- Keep the existing generated Changesets worktree changes in place.

## Focused validation

```bash
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/react build
pnpm test:next-consumer
```

Expected outcomes:

- Both packages pack successfully.
- Packed manifest, runtime, and CSS asset assertions pass.
- The temporary Next.js 15/React 18 application builds and statically server-renders all representative component text.
- No registry publication occurs.

### Baseline reproduced

Before the fix, the packed smoke failed because `@pathableai/react/dist/index.js`
did not retain any stylesheet import and embedded both
`react-jsx-runtime.production` and `react-jsx-runtime.development`, including
`ReactCurrentOwner`. The packed styles tarball placed a subset of icons under
`dist/img`, while `dist/styles.css` resolved package-root `img` paths and six
absent Roboto Mono files under package-root `fonts`.

## Package quality gates

```bash
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react check:package
pnpm --filter @pathableai/react check:types
```

## Repository gates

```bash
pnpm test:storybook-react
pnpm check:format
pnpm changeset:status
git diff --check
```

Changesets status should project patch releases newer than `0.0.1` for both packages. Do not run `pnpm release` or `changeset publish` as part of this feature.

Current status projects `@pathableai/react@0.0.2` and
`@pathableai/styles@0.0.2` from Changeset `bright-owls-render`. No versioning or
publication command has been run.

## Final validation evidence

Validated on 2026-08-12 with Node 26.7.0 and pnpm 11.11.0:

- `pnpm --filter @pathableai/styles build`: PASS. Copied 32 CSS-referenced
  images to both package-root and compatibility `dist/img` locations, plus five
  PathAble and six Roboto Mono font files.
- `pnpm --filter @pathableai/react build`: PASS. `dist/index.js` is 78.07 kB,
  retains `import "@pathableai/styles"`, imports `react/jsx-runtime`, and contains
  no `ReactCurrentOwner` or bundled production/development JSX runtime marker.
- `pnpm test:next-consumer`: PASS. Packed manifests contain no workspace
  protocol, the styles root export is `./dist/styles.css`, all local CSS asset
  references exist, and a temporary Next.js 15.5.22 App Router application on
  React/React DOM 18.3.1 builds and statically server-renders Card, Link, List,
  Tag, and Loading content.
- `pnpm --filter @pathableai/react lint`: PASS.
- `pnpm --filter @pathableai/react typecheck`: PASS.
- `pnpm --filter @pathableai/react check:package`: PASS (`publint`: all good).
- `pnpm --filter @pathableai/react check:types`: PASS under the repository's
  ESM-only profile. The command required a writable temporary npm cache because
  the machine's default npm cache contains root-owned files.
- `pnpm lint:js`: PASS.
- `pnpm lint:md`: PASS.
- `pnpm test:storybook-react`: PASS after running with localhost permission;
  the React Storybook built and its Chromium test-runner completed.
- `pnpm check:format`: PASS.
- `git diff --check`: PASS.
- `pnpm changeset:status`: PASS, projecting `0.0.2` for both packages.

## Remaining limitations

- On a cold machine, the temporary fixture first attempts an offline install and
  then uses `--prefer-offline` if an external transitive tarball is absent from
  pnpm's content store. Both PathAble packages always install from freshly
  created local tarballs. Once the store is warm, the complete fixture install
  is offline.
- The smoke asserts Next's generated static server HTML instead of binding a
  live port. `next build` executes the App Router page during static
  server-rendering, satisfying the render contract without a port dependency.
- The corrected packages are prepared but have not been versioned to generated
  changelogs, published, or installed into the downstream repository.

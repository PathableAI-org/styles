---
'@pathableai/styles': minor
---

**Breaking change**: Removes `dist/img/`. Images now ship once, under `img/`.

- The build empties `dist/`, `img/`, `fonts/` and `components/` first, so the
  package tarball holds only current build output.
- The package adds the exports `./package.json`, `./components/*` (the component
  pages) and `./img/*`. Existing entry points resolve unchanged.

**Migration**: replace `@pathableai/styles/dist/img/...` with
`@pathableai/styles/img/...`, for example the icon sprite
`@pathableai/styles/img/sprite.svg`.

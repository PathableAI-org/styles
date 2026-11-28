---
'@pathableai/styles': minor
---

**Breaking change**: the build now empties `dist/`, `img/`, `fonts/` and
`components/` first, so the package tarball holds only current build output.
Images ship once, under `img/`, and `dist/img/` is removed. Replace
`@pathableai/styles/dist/img/...` with `@pathableai/styles/img/...`, for
example the icon sprite `@pathableai/styles/img/sprite.svg`. The package adds
the exports `./package.json`, `./components/*` (the component pages) and
`./img/*`. Existing entry points resolve unchanged.

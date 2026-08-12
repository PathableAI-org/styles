# Data Model: Next Consumer Compatibility

This feature has no persisted business data. The validation model consists of build and package artifacts.

## PublishablePackage

- **name**: Registry package name.
- **version**: Current generated release version used as the patch-release base.
- **manifest**: Consumer-visible packed `package.json` after workspace protocol rewriting.
- **tarball**: Immutable archive produced by the workspace pack command.
- **exports**: Consumer-visible entrypoints.
- **files**: Paths included in the tarball.
- **relationships**: React depends on the packed styles package and peers with consumer React and React DOM.

### Validation rules

- React's packed runtime dependencies contain no `workspace:*` value.
- React's peer dependency ranges admit React 18.
- React's public entry loads the styles package through a public export.
- Styles includes every local asset referenced from its compiled CSS.

## StylesheetAssetReference

- **rawUrl**: Value parsed from a stylesheet `url(...)` expression.
- **stylesheetPath**: `dist/styles.css` within the packed styles package.
- **resolvedPackagePath**: Normalized path obtained relative to the stylesheet.
- **kind**: Font, SVG/image, or ignored non-local reference.
- **present**: Whether the resolved path exists in the packed tarball.

### Validation rules

- Empty, data, fragment, and remote URLs are ignored.
- A local path must remain inside the package root and must exist exactly once or as one tarball file path.

## ConsumerFixture

- **frameworkVersion**: Next.js 15.5.22.
- **reactVersion**: React and React DOM 18.3.1.
- **packageInputs**: Packed styles and React tarballs.
- **page**: App Router server page rendering Card, Link, List, Tag, and Loading.
- **buildResult**: Production build exit status and output.
- **renderResult**: HTTP status and returned component text.

### State transitions

`created -> dependencies installed -> built -> server started -> content verified -> removed`

Any failed transition fails the smoke test. Temporary cleanup still runs after failure.

## ReleaseIntent

- **packages**: `@pathableai/styles` and `@pathableai/react`.
- **bumpType**: Patch for each package.
- **summary**: Consumer runtime/styling/asset compatibility correction.
- **published**: Always false within this feature.

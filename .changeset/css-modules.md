---
'@pathableai/styles': minor
---

Adds one stylesheet per part of the package under `@pathableai/styles/css/*`:

- `css/base.css`, the font faces and default tokens.
- `css/utilities.css`, the utilities and the layout grid.
- One `css/<name>.css` per component wrapper, such as `css/button.css` and
  `css/form-group.css`.
- `css/shared-input.css` and `css/shared-alert.css`, for USWDS rules several
  wrappers use.

Each file is a slice of `styles.css`. Load `base.css`, the component files a
page uses with the files they require, and `utilities.css`, in the bundle's
order, instead of the full bundle. Every file declares the same cascade layer
order, so the utilities still win over the components whatever order the files
load in.

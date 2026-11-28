---
'@pathableai/styles': patch
---

Corrects the shipped `README.md`, `BRAND_RULES.md` and component index so they
describe only what the package contains.

- The README no longer lists dark and high-contrast theme foundations: the
  package ships one theme, the light default.
- The README says the full `@pathableai/styles` import includes the theme,
  components and utilities, and points to the font-family page for Poppins
  subheadings, because no class applies Poppins.
- `BRAND_RULES.md` describes focus-ring and paragraph colours by class and
  resulting colour, without naming internal custom properties.
- The component index says every component class appears on one of its pages.

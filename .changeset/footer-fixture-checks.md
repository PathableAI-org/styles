---
'@pathableai/styles': minor
---

Adds `pathable-footer` to the compiled stylesheet, which did not include it, so
the footer classes now reach `dist/styles.css`: `pathable-footer--big`,
`pathable-footer__primary-container`,
`pathable-footer__primary-content--collapsible`,
`pathable-footer__primary-link`, `pathable-footer__secondary-link`,
`pathable-footer__logo`, `pathable-footer__logo-img`,
`pathable-footer__contact-links`, `pathable-social-link`,
`pathable-social-link__icon`, `pathable-sign-up` and
`pathable-sign-up__heading`.

- Lists, labels and buttons inside a footer get the USWDS footer spacing, scoped
  to the footer so they render as before elsewhere.

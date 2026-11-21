---
name: Footer
slug: footer
kind: static
summary: The footer at the end of every page, with a return-to-top link, primary links, and the logo, social links and contact details of the organization.
styles-class: pathable-footer
variants:
  - axis: size
    default: default
    values: [default, slim, big]
guarantees:
  - id: text
    claim: The footer text is set in Nunito at the theme's body size.
  - id: return-to-top
    claim: The return-to-top link sits in its own row with 20 px of padding above and below, in the theme link colour.
  - id: primary-section
    claim: The primary section has the theme's lightest grey background, and its links are bold PathAble Blue text.
  - id: secondary-section
    claim: The secondary section has 20 px of padding above and below and a light grey background with PathAble Blue text and links.
  - id: social-links
    claim: Each social link is a square the size of a touch target, with 4 px of padding, a translucent dark background that turns white while hovered, and an icon that fills the link.
  - id: slim
    claim: The slim footer shows the primary links in one row beside the contact details, and its logo is at most 48 px wide.
  - id: big
    claim: The big footer shows its primary links in groups of four columns at desktop width, each with a heading in the heading font and the links of the group always expanded, and has a sign-up form beside them.
  - id: layout
    claim: At the mobile-lg width and above the secondary section places the logo on the left and the social links and contact details aligned to the right.
---

# Footer

The footer at the end of every page, with a return-to-top link, primary links,
and the logo, social links and contact details of the organization. Put
`pathable-footer` on a `<footer>` element. At the top level of a page, the
element is the page's `contentinfo` landmark.

## When to use

- The closing area of every page of an application, so a person can always
  find the main sections, support and contact details.

Use something else when:

- the links are the main navigation for the page's content: use the header;
- the links are specific to a section: use `pathable-sidenav`.

The big footer's link groups collapse into an accordion on narrow screens,
which needs JavaScript. This component shows the groups expanded and does not
include that behaviour.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one presentation of the footer. Copy the
one closest to what you need.

<!-- examples -->

## Variants

Add at most one modifier class to `pathable-footer`.

| Axis | Value     | Class                   | What it is for                                               |
| ---- | --------- | ----------------------- | ------------------------------------------------------------ |
| size | `default` | none                    | A row of primary links and a full secondary section          |
| size | `slim`    | `pathable-footer--slim` | Few links, with the contact details beside them              |
| size | `big`     | `pathable-footer--big`  | Many links in headed groups, with a sign-up form beside them |

## Composition

- `pathable-footer__return-to-top`: a row holding a link to the top of the
  page, on a `grid-container`.
- `pathable-footer__primary-section`: the lightest grey area with the primary
  links.
- `pathable-footer__nav`: a `<nav>` inside the primary section. Give it an
  `aria-label` such as `Footer navigation`.
- `pathable-footer__primary-content` and `pathable-footer__primary-link`: one
  primary link in the default and slim footer, and one group heading in the big
  footer.
- `pathable-footer__primary-content--collapsible`: marks a big footer group.
  The group shows its links expanded.
- `pathable-footer__secondary-link`: a link in a big footer group, inside a
  `pathable-list pathable-list--unstyled` list.
- `pathable-footer__primary-container`: the row of the slim footer's primary
  section.
- `pathable-footer__secondary-section`: the area with the logo, social links
  and contact details.
- `pathable-footer__logo`, `pathable-footer__logo-img` and
  `pathable-footer__logo-heading`: the logo and the organization name.
- `pathable-footer__contact-links`, `pathable-footer__contact-heading`,
  `pathable-footer__address` and `pathable-footer__contact-info`: the contact
  details, in an `<address>`.
- `pathable-footer__social-links`, `pathable-social-link` and
  `pathable-social-link__icon`: the social links. The icon is an `<svg>` that
  references the icon sprite with `<use>` and is named by a `<title>`.
- `pathable-sign-up` and `pathable-sign-up__heading`: the sign-up form of the
  big footer.
- The layout classes `grid-container`, `grid-row`, `grid-gap` and `grid-col-*`
  place the sections as the examples show.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour.

The colours come from the theme, so a themed application may show other
colours; the figures on this page are those of the default theme.

## The consumer owns

- The links, their targets and their text, and the organization's name, logo
  and contact details.
- The `aria-label` of the `<nav>`, and the accessible name of each social
  link icon.
- The `alt` text of the logo: empty when the name beside it already says the
  same.
- The return-to-top target and the sign-up form's handling of submission.
- Collapsing the big footer's link groups on narrow screens, if the
  application wants it.

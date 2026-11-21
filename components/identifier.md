---
name: Identifier
slug: identifier
kind: static
summary: A dark organisation footer band with a masthead that names who runs the service, its domain and logos, above a row of required policy links.
styles-class: pathable-identifier
variants: []
guarantees:
  - id: dark-surface
    status: unverified
    claim: The identifier has the theme's darkest base background with light text, and 16 px of padding below its last section.
  - id: focus-ring
    status: unverified
    claim: Controls inside the identifier draw their focus outline in the default focus ring colour, whatever surface the identifier sits in.
  - id: container-width
    status: unverified
    claim: Each container is centred and at most 1024 px wide.
  - id: section-padding
    status: unverified
    claim: Each section has 16 px of padding above and below, except the required links section from 640 px wide, which has 8 px.
  - id: logos-row
    status: unverified
    claim: Logos sit side by side in a row, each logo link 48 px high with 8 px between neighbours, and the logos block has a 16 px right margin.
  - id: links-columns
    status: unverified
    claim: The required links list has no bullets or margin, and from 640 px wide it flows into 2 columns and from 1024 px wide into 4, with a 32 px column gap.
  - id: masthead-layout
    status: unmet
    claim: From 640 px wide the masthead container is a flex row with its items centred vertically, and below that the logos, identity and disclaimer stack. The pathable-identifier__section--masthead class is not in the stylesheet yet.
  - id: required-links-section
    status: unmet
    claim: From 1024 px wide the required links text is 14 px. The pathable-identifier__section--required-links class is not in the stylesheet yet.
  - id: logo-img-size
    status: unmet
    claim: A logo image fills the 48 px height of its link and keeps its proportions. The pathable-identifier__logo-img class is not in the stylesheet yet.
  - id: domain-colour
    status: unmet
    claim: The domain is set in the muted light base colour with no margin or padding. The pathable-identifier__identity-domain class is not in the stylesheet yet.
  - id: disclaimer-weight
    status: unmet
    claim: The disclaimer is bold with no margin or padding. The pathable-identifier__identity-disclaimer class is not in the stylesheet yet.
  - id: required-links-spacing
    status: unmet
    claim: Each required link item stays whole in one column, with 24 px below it (16 px from 1024 px wide) and none below the last. The pathable-identifier__required-links-item class is not in the stylesheet yet.
  - id: required-link-colour
    status: unmet
    claim: A required link is inline-block and in the muted light base colour, readable on the dark background. The pathable-identifier__required-link class is not in the stylesheet yet.
---

# Identifier

A dark organisation footer band with a masthead that names who runs the service,
its domain and logos, above a row of required policy links. Put the class on a
`<div>` at the end of the page, once per site. It adds no roles: label the
masthead and the links yourself.

## When to use

- The footer band of an application or site that must say which organisation
  operates it and link to its accessibility statement, privacy policy and terms
  of use.
- A partner-delivered service that shows its own logo beside the operating
  organisation's.

Use something else when:

- the footer holds site navigation, contact details or sign-up forms: build it
  with the layout components, not the identifier;
- the page is not an application page, such as an email: the identifier needs the
  stylesheet and a dark band across the page width.

PathAble is not a government agency, so this component has no "official
website" wording and no USA.gov section. The masthead says that the service is
operated by an organisation, and the links are the organisation's own policy
pages. A government section that points to USA.gov is not part of this
component.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## States

Each state is complete markup for one use of the identifier. Copy the one
closest to what you need.

<!-- examples -->

## Variants

The identifier has no variants. What changes between states is which parts are
present, and the logos are optional.

## Composition

- `pathable-identifier__section`: a band of the identifier, with vertical
  padding. Use two, one for the masthead and one for the required links.
  - `pathable-identifier__section--masthead`: marks the masthead band, which
    holds the logos and identity. Not in the stylesheet yet; see
    `masthead-layout`.
  - `pathable-identifier__section--required-links`: marks the band that holds
    the policy links. Not in the stylesheet yet; see `required-links-section`.
- `pathable-identifier__container`: centres the content and limits its width.
  Each section holds one.
- `pathable-identifier__logos`: optional row of logos. Omit it when the
  organisation has no logo.
  - `pathable-identifier__logo`: a link around one logo, 48 px high. Several
    logos sit side by side.
  - `pathable-identifier__logo-img`: the `<img>` inside the link. Not in the
    stylesheet yet; see `logo-img-size`.
- `pathable-identifier__identity`: takes the remaining width beside the logos
  from 640 px wide, with a 16 px top margin below that; it holds the next two
  elements.
  - `pathable-identifier__identity-domain`: a `<p>` with the domain name. Not in
    the stylesheet yet; see `domain-colour`.
  - `pathable-identifier__identity-disclaimer`: a `<p>` that says who operates the
    service, with a link to the organisation. Not in the stylesheet yet; see
    `disclaimer-weight`.
- `pathable-identifier__required-links-list`: a `<ul>` of links in columns.
  - `pathable-identifier__required-links-item`: an `<li>`, one per link. Not in
    the stylesheet yet; see `required-links-spacing`.
  - `pathable-identifier__required-link`: the `<a>` in each item, together with
    `pathable-link`. Not in the stylesheet yet; see `required-link-colour`.

The USA.gov section is not part of this component, so there is no
`pathable-identifier__section--usagov` or `pathable-identifier__usagov-description`
class to use, even though the stylesheet still defines the description class.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Today a page written with every class above gets the dark band, the container,
the section padding, the logo row and the link columns. It does not get the
masthead row, the bold disclaimer, the domain colour or the item spacing, so
the masthead stacks and the link colours come from the surrounding styles. The
colours of the unmet classes, once added, must be readable on the dark band;
the identifier does not use PathAble tokens for its colours today.

## The consumer owns

- Labels: give the masthead `<section>` and the links `<nav>` an `aria-label`
  with clean text in the page language, such as "Organisation identifier" and
  "Organisation policies", with no trailing punctuation.
- The content: the organisation's name, domain, disclaimer wording and which
  required links to show.
- Logos: the image files, their `alt` text (for example "PathAble logo"), and
  where each logo links to. A logo link has no other text, so its `alt` is its
  name; give each logo in a masthead a different `alt`.
- Real `href` values on every link; an empty or placeholder `href` is a broken
  link.
- Link styling: put `pathable-link` on the disclaimer and required links so that
  they take the PathAble link colour and focus ring.
- Placement: one identifier at the end of the page, after the main content.

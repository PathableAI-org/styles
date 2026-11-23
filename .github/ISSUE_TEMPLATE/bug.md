---
name: Bug
about: Report a defect in one package. File a separate issue for each package affected
title: ''
labels: bug
---

<!-- Add exactly one package label: package:styles or package:react. A defect that affects both packages is two issues, one per package, each linking the other. A defect in neither package, such as repository tooling, carries neither label. For a component defect, also identify the component below and apply the repository's component label when one exists; do not invent a new label. -->

## Package and component

<!-- Name the package and released version or base SHA. For a component defect, give the component-page slug, such as button or summary-box. For a non-component styles defect, use tokens, utilities, packaging or documentation. -->

## Observed

<!-- What happens, with the story ID, viewport and condition, or the file and line. -->

## Expected

## Guarantee

<!-- Optional. When the component has a page under components/, the guarantee this defect breaks, as <page>/<guarantee-id> (for example icon-tile/icon-contrast). If the page does not state the expected behaviour yet, say so. -->

## How to reproduce

<!-- Search existing issues first. Give minimal steps and canonical fixture-based markup where possible. Include no credentials, private data or sensitive content. -->

## Proposed risk tier

<!-- High, Standard, or Light, with the trigger or condition. The maintainer sets it. See "Risk tiers" in docs/engineering/git-workflow.md. -->

## Found by

<!-- Person or agent role, and the pull request if any. For a Section 508 failure, name the WCAG criterion. -->

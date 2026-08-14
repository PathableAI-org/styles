# Component testing

This documentation describes how this project tests components and maintains
behavioral parity between `@pathableai/styles`, `@pathableai/react`, and future
framework packages.

Parity means that equivalent components provide the same user-facing and
assistive-technology-facing capabilities. It does not require each package to
use the same markup generator, state model, or event implementation.

## Start here

- [Testing principles](principles.md) explains the values behind the test
  strategy.
- [Choosing what to test](choosing-tests.md) helps place a requirement at the
  correct test layer.
- [Baseline component coverage](component-baseline.md) defines the checks that
  normally apply to every component.
- [Behavioral parity](behavior-parity.md) explains shared validation across
  package implementations.
- [Tooling and structure](tooling-and-structure.md) describes Storybook, its
  browser tests, and the repository layout.
- [Adding tests for a component](adding-component-tests.md) is the practical
  workflow for new work.

## The testing model

The project uses several complementary forms of evidence:

| Evidence | Primary question |
| --- | --- |
| Fixed Storybook stories | Does every supported state have a deterministic example? |
| Storybook `play` tests | Can a user operate the component and observe the expected result? |
| Shared behavior validations | Do equivalent implementations preserve the same contract? |
| Automated accessibility checks | Does the rendered story contain detectable accessibility violations? |
| Visual regression | Does the supported appearance remain stable? |
| Package-specific tests | Does the framework API and implementation work correctly? |
| Application E2E tests | Can a user complete a product workflow? |

No single row replaces the others. Use the smallest test layer that can prove
the requirement without coupling the test to irrelevant implementation detail.

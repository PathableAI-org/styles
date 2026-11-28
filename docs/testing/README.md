# Component testing

This documentation describes how this project tests components.

## Start here

- [Tooling and structure](tooling-and-structure.md) describes Storybook, its
  browser tests, and the repository layout.
- [HTML fixtures](fixtures.md) describes the canonical per-state HTML in
  `fixtures/`, the checks that validate it, and the React fixture tests that
  hold `@pathableai/react` components to it.

## The testing model

The project uses several complementary forms of evidence:

| Evidence                       | Primary question                                                                |
| ------------------------------ | ------------------------------------------------------------------------------- |
| Fixed Storybook stories        | Does every supported state have a deterministic example?                        |
| Storybook `play` tests         | Can a user operate the component and observe the expected result?               |
| Shared behavior validations    | Do equivalent implementations preserve the same contract?                       |
| Automated accessibility checks | Does the rendered fixture or story contain detectable accessibility violations? |
| Package-specific tests         | Does the framework API and implementation work correctly?                       |
| React fixture tests            | Does a React component render the classes and structure of a fixture?           |
| Application E2E tests          | Can a user complete a product workflow?                                         |

No single row replaces the others. Use the smallest test layer that can prove
the requirement without coupling the test to irrelevant implementation detail.

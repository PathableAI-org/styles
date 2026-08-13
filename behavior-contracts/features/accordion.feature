@component-accordion
Feature: Accordion disclosure behavior
  The design system defines observable Accordion behavior once so every
  implementation can provide native runtime behavior without drifting from the
  shared keyboard, state, panel, and focus contract.

  @SCN-ACC-001 @accordion-keyboard-enter
  Scenario: Expanding a collapsed disclosure with Enter
    Given an Accordion with all disclosures collapsed
    When the user focuses the first disclosure
    And the user presses Enter
    Then the first disclosure is expanded
    And the first disclosure panel is available
    And focus remains on the first disclosure

  @SCN-ACC-002 @accordion-keyboard-space
  Scenario: Collapsing an expanded disclosure with Space
    Given an Accordion with the first disclosure expanded
    When the user focuses the first disclosure
    And the user presses Space
    Then the first disclosure is collapsed
    And the first disclosure panel is unavailable
    And focus remains on the first disclosure

  @SCN-ACC-003 @accordion-single-open
  Scenario: Opening another disclosure closes the current disclosure
    Given an Accordion with the first disclosure expanded
    When the user focuses the second disclosure
    And the user presses Enter
    Then the second disclosure is expanded
    And the second disclosure panel is available
    And the first disclosure is collapsed
    And the first disclosure panel is unavailable
    And focus remains on the second disclosure

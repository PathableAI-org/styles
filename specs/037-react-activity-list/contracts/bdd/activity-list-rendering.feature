Feature: Activity List row rendering
  As a product developer
  I want Activity List rows to preserve supplied content and status meaning
  So that users can scan complete dashboard activity without wrapper-owned business behavior

  Background:
    Given the corrected Pathable Activity List source contract is available
    And ActivityList is imported from @pathableai/react

  Scenario: Render populated rows in supplied order
    Given FIX-001 contains ordered synthetic rows with documented statuses
    When the flat Activity List is rendered at default density
    Then every row is exposed as a listitem in supplied order
    And every title, context, date, owner, and visible status label is present
    And the decorative marker is hidden from assistive technology

  Scenario: Omit action markup when an action is absent
    Given FIX-001 contains a row without consumer action content
    When the flat Activity List is rendered
    Then the row remains present and complete
    And no empty action container or inactive control is rendered for that row

  Scenario: Preserve an unfamiliar status
    Given FIX-002 contains status value "awaiting-review" and label "Awaiting review"
    When the Activity List is rendered
    Then "Awaiting review" is visible and available to assistive technology
    And the supplied status value remains present
    And the marker uses the neutral base presentation

  Scenario: Constrain long metadata without removing content
    Given FIX-004 contains long localized-looking title, context, status, date, and owner values
    When the story is reviewed at narrow width and increased text size
    Then each text region applies its documented ellipsis contract
    And each complete supplied value remains in the rendered document
    And there is no horizontal page overflow or clipped focus indicator
    And a supplied action remains available

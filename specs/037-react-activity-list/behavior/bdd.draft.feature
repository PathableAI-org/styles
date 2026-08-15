Feature: React Activity List wrapper
  As a product developer
  I want a typed Activity List from the React package
  So that dashboard activity remains consistent, accessible, and usable in consumer environments

  Scenario: Present populated activity in supplied order
    Given a populated ungrouped activity collection with documented statuses and an optional action
    When the Activity List is rendered
    Then every row presents its supplied title, context, date or time, owner, visible status label, and available action in supplied order

  Scenario: Omit unavailable item actions
    Given an activity item without an action
    When the Activity List is rendered
    Then the row remains complete and no empty action container or inactive control is presented

  Scenario: Preserve an unfamiliar status
    Given an activity item with an unfamiliar status value and supplied text label
    When the Activity List is rendered
    Then the supplied label is visible and available to assistive technology
    And the status uses the neutral presentation without being converted to a documented status

  Scenario: Present grouped and ungrouped density variants
    Given ordered activity data in grouped or ungrouped form
    When the Activity List is rendered at default, compact, or comfortable density
    Then item order and meaning are preserved
    And only the documented density treatment is applied

  Scenario: Constrain long content at narrow widths
    Given long localized-looking activity content in a narrow viewport or at increased text size
    When the Activity List is rendered
    Then titles remain on one line and truncate with an ellipsis
    And context, status, date, and owner text remain within their available dimensions and truncate with an ellipsis
    And complete supplied text remains in the rendered document
    And no horizontal page overflow, clipped focus indicator, or unavailable action is introduced

  Scenario: Associate grouped rows with their heading
    Given a non-empty activity group with a visible heading
    When the grouped Activity List is rendered
    Then the heading is visually adjacent to its rows
    And the group container references the visible heading through aria-labelledby

  Scenario: Produce meaningful packaged server output
    Given a consumer imports ActivityList only from the packaged React entrypoint
    When the consumer renders grouped activity before browser scripting is available
    Then the initial output contains the supplied content, statuses, group headings, and links
    And the required Pathable styling is available without a separate styles-package import

  Scenario: Present the supplied empty state for zero resolved rows
    Given an empty item collection or groups containing no items
    When the Activity List is rendered
    Then empty groups and fabricated rows are omitted
    And only the supplied empty-state content is presented

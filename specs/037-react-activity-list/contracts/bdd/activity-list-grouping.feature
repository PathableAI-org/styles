Feature: Activity List grouping and empty states
  As a product developer
  I want grouped and ungrouped activity to retain meaningful structure
  So that users can understand group relationships and empty results

  Background:
    Given ActivityList receives deterministic synthetic activity data

  Scenario: Render documented densities without changing meaning
    Given FIX-003 contains grouped and ungrouped items in fixed order
    When each collection is rendered at default, compact, and comfortable density
    Then only the matching documented density treatment is applied
    And item content and order remain unchanged

  Scenario: Render ungrouped items without an unnecessary heading
    Given FIX-003 provides flat items
    When the Activity List is rendered
    Then the root is a list with direct listitem rows
    And no group heading is fabricated

  Scenario: Associate each group with its visible heading
    Given FIX-003 provides two non-empty groups and one empty group
    When the grouped Activity List is rendered
    Then each visible heading immediately precedes its nested list
    And each nested list aria-labelledby resolves to that heading
    And the empty group is omitted

  Scenario: Render the consumer empty state for zero resolved rows
    Given FIX-006 contains no flat rows or only empty groups
    When the Activity List is rendered
    Then no row, group, or heading is fabricated
    And only the supplied empty-state content is presented

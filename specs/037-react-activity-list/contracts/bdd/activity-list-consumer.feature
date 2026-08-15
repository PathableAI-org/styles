Feature: Packaged Activity List consumption
  As a React package consumer
  I want ActivityList to work from the package entrypoint before browser scripting
  So that server-rendered applications receive complete markup and styling

  Scenario: Render meaningful initial server output
    Given FIX-005 installs the packed @pathableai/react artifact in the Next consumer
    And the consumer imports ActivityList without directly importing @pathableai/styles
    When the App Router page is built and rendered
    Then generated HTML contains the supplied headings, rows, statuses, dates, owners, and links
    And every group label relationship is present in initial output

  Scenario: Expose the complete packed package surface
    Given FIX-005 installs the packed React and Styles artifacts
    When package exports, declarations, and built assets are inspected
    Then ActivityList and its public types are exported
    And the React package retains its runtime Styles dependency
    And required Activity List styling reaches the consumer without a direct Styles import

Feature: Storybook Composition
  As a developer working in the monorepo
  I want to browse React Button stories in the main Storybook
  So that I can see all components in a single interface

  Background:
    Given the main Storybook is running on port 6006

  Scenario: Main Storybook shows React stories when React Storybook is running
    Given the React Storybook is running on port 6007
    And the main Storybook has a composition ref configured for http://localhost:6007
    When a developer views the main Storybook sidebar
    Then a "React" section is visible
    And the "React" section contains the Button story
    And the Button story renders a native <button> with the pathable-button class

  Scenario: Main Storybook shows React Storybook as unavailable when it is down
    Given the React Storybook is not running
    And the main Storybook has a composition ref configured for http://localhost:6007
    When a developer views the main Storybook sidebar
    Then a "React" section is visible
    And the "React" section shows as "unavailable" or similar
    And the main Storybook does not crash or error
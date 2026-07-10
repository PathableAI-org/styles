Feature: React Package Workspace Setup

  As a React application developer
  I want to install only @pathable/react and get styled React components
  So that I don't need to separately install @pathable/styles

  Background:
    Given a consumer pnpm workspace project
    And @pathable/react is available as a workspace dependency

  Scenario: Consumer installs @pathable/react and gets styles automatically
    Given a consumer project adds @pathable/react as a dependency
    When the dependency is resolved via pnpm install
    Then the dependency tree resolves without errors
    And @pathable/styles is included as a transitive dependency

  Scenario: Consumer renders Button with styles applied
    Given a consumer project with @pathable/react installed
    When the consumer imports { Button } from @pathable/react
    And renders <Button>Click Me</Button> in a React component
    Then the rendered button has the pathable-button CSS class applied
    And the text "Click Me" appears inside the rendered <button> element

  Scenario: Built output includes styles CSS
    Given a consumer project with @pathable/react installed
    When the consumer runs the production build
    And the built output is inspected
    Then the CSS from @pathable/styles is included in the stylesheet

  Scenario: React Storybook displays Button story
    Given the React Storybook server is running on port 6007
    When a developer navigates to the React Storybook in a browser
    Then the Button story is displayed
    And the rendered Button has the pathable-button CSS class applied

  Scenario: Main Storybook composes React stories
    Given the main Storybook is running on port 6006
    And the React Storybook is running on port 6007
    When a developer views the main Storybook sidebar
    Then there is a "React" section containing the React Button stories

  Scenario: Main Storybook degrades gracefully when React Storybook is unavailable
    Given the main Storybook is running on port 6006
    And the React Storybook is not running
    When a developer views the main Storybook sidebar
    Then the composed "React" section shows as unavailable
    And the main Storybook continues to function without errors
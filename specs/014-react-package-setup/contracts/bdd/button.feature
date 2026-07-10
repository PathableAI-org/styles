Feature: React Package Button Component
  As a React developer
  I want to use a PathAble-styled Button component from @pathable/react
  So that I get styled buttons without separately installing @pathable/styles

  Background:
    Given the @pathable/react package is built
    And the compiled CSS from @pathable/styles is included

  Scenario: Button renders with pathable-button class
    When a consumer renders <Button>Click Me</Button>
    Then the rendered element is a native <button>
    And the element has the "pathable-button" CSS class
    And the element contains the text "Click Me"

  Scenario: Button renders with children text
    When a consumer renders <Button>Hello</Button>
    Then the rendered <button> element contains the text "Hello"
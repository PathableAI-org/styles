# Semantic Markup Contract

## Required Structure

```html
<fieldset class="pathable-fieldset pathable-filterable-option-list">
  <legend class="pathable-legend">Standards</legend>

  <div class="pathable-filterable-option-list__filter">
    <label class="pathable-label" for="generated-filter-id">
      Filter standards
    </label>
    <input
      class="pathable-input pathable-filterable-option-list__filter-input"
      id="generated-filter-id"
      type="search"
    />
  </div>

  <p
    class="pathable-filterable-option-list__status"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    2 selected · 8 matches
  </p>

  <ul class="pathable-checkbox__list pathable-filterable-option-list__options">
    <li class="pathable-filterable-option-list__option">
      <label class="pathable-checkbox">
        <input
          class="pathable-checkbox__input"
          type="checkbox"
          aria-describedby="generated-details-id"
        />
        <span class="pathable-checkbox__label">Employment support</span>
      </label>
      <span
        class="pathable-filterable-option-list__details"
        id="generated-details-id"
      >
        <span class="pathable-filterable-option-list__description">
          Services related to obtaining or retaining work.
        </span>
        <span class="pathable-filterable-option-list__meta">EMP-01</span>
      </span>
    </li>
  </ul>

  <input type="hidden" name="standards" value="employment" />
</fieldset>
```

## Semantics

- The root is a native fieldset and its first naming child is a legend.
- The filter is a native search input with an explicit label.
- The options container is a list, not a listbox.
- Every option is a native checkbox with one concise visible label.
- Description and metadata content is non-interactive and referenced through
  `aria-describedby` when present.
- The single status node reports selection and results. Empty and no-match text
  may also appear in the option region but must not create another live region.
- No-match and empty output are not list options.
- Hidden form controls mirror selected IDs exactly once when `name` is supplied.

## Class Ownership

- Existing shared contracts: `pathable-fieldset`, `pathable-legend`,
  `pathable-label`, `pathable-input`, `pathable-checkbox__list`,
  `pathable-checkbox__input`, and `pathable-checkbox__label`.
- New shared composition contract: `pathable-filterable-option-list` and its
  `__filter`, `__filter-input`, `__status`, `__options`, `__option`, `__details`,
  `__description`, `__meta`, and `__empty` elements.
- Selected, focus, checked, and disabled visuals rely on native state and the
  existing checkbox/input contracts rather than duplicate modifier state.

## Keyboard Contract

- Tab and Shift+Tab traverse the search input and enabled checkboxes in document
  order.
- Space toggles the focused checkbox through native behavior.
- Disabled options are not focusable or mutable.
- Arrow keys are not intercepted for option navigation.
- Query changes keep focus in the search input.
- The scroll region must reveal a natively focused checkbox and must not clip
  its focus indicator.

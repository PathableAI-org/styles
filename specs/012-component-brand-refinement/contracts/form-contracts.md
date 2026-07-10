# Form Workflow Pattern Contracts

**Files**: Various form component wrappers in `packages/styles/src/pathable-component-wrappers/`

## Interface

Form workflow patterns are Storybook-exclusive content additions. No new CSS classes or modifiers are needed — they use existing `.pathable-*` form component classes.

### CSS Classes Used (all existing)

| Class | Pattern Examples |
| ------- | ----------------- |
| `.pathable-form` | All form patterns |
| `.pathable-input` | Compliance field, goal selector |
| `.pathable-textarea` | Session note, supervisor comment |
| `.pathable-select` / `.pathable-combo-box` | Participant goal selector |
| `.pathable-checkbox` | Intervention checklist |
| `.pathable-radio` | Progress signal picker |
| `.pathable-label` | All patterns |
| `.pathable-hint` | Session note, compliance field |
| `.pathable-error-message` | Compliance field (error state) |
| `.pathable-fieldset` / `.pathable-legend` | Intervention checklist |
| `.pathable-validation` | Compliance field |

### Pattern Content Contracts

#### Pattern 1: Session Note Field

```
Story title: "Workflow: Session Note"
Components: textarea, label, hint, form
HTML structure:
  <form class="pathable-form">
    <label class="pathable-label" for="session-note">Session Note</label>
    <span class="pathable-hint" id="session-note-hint">
      Document the key observations, interventions, and progress from this session.
    </span>
    <textarea class="pathable-textarea" id="session-note" 
      aria-describedby="session-note-hint" rows="6"
      placeholder="Enter session notes..."></textarea>
  </form>
```

#### Pattern 2: Participant Goal Selector

```
Story title: "Workflow: Participant Goal Selector"
Components: select or combo-box, label, form
```

#### Pattern 3: Intervention Checklist

```
Story title: "Workflow: Intervention Checklist"
Components: checkbox group, fieldset, legend, form
```

#### Pattern 4: Progress Signal Picker

```
Story title: "Workflow: Progress Signal Picker"
Components: radio group, label, hint, form
```

#### Pattern 5: Required Compliance Field

```
Story title: "Workflow: Required Compliance Field (with error state)"
Components: input, label, error-message, validation, form
Content: "Medicaid ID" or similar compliance field
Error state: "Medicaid ID is required. Please enter a valid ID."
```

#### Pattern 6: Supervisor Approval Comment

```
Story title: "Workflow: Supervisor Approval Comment"
Components: textarea, label, hint, form
```

### Error State Contract

When a form workflow pattern includes an error state:

1. The error MUST be displayed using `.pathable-error-message`
2. The error message MUST include human-readable recovery guidance (not just "Required field")
3. The error message MUST be associated with the input via `aria-describedby`
4. Contrast: error text uses `--pathable-color-danger` (#dc3545) or USWDS default

### Notes

- All form patterns are additive Storybook content; no component wrapper SCSS files need modification
- Patterns should be organized under a "Workflow Patterns" subheading in their respective Storybook component sections, or organized as a new "Workflow" category in Storybook

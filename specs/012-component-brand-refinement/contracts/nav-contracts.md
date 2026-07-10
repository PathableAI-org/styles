# Navigation Workflow Pattern Contracts

**Files**: Navigation-related wrapper files in `packages/styles/src/pathable-component-wrappers/`

## Interface

Navigation workflow patterns are Storybook-exclusive content additions. No new CSS classes or modifiers are needed — they use existing `.pathable-*` navigation classes.

### CSS Classes Used (all existing)

| Class | Component | Used By |
| ------- | ----------- | --------- |
| `.pathable-sidenav` | Side navigation | Sidenav story |
| `.pathable-sidenav__item` | Side nav item | Sidenav story |
| `.pathable-sidenav__sublist` | Nested nav items | Sidenav story |
| `.pathable-nav` | Horizontal navigation | Nav story |
| `.pathable-header` | Site header | Header story |
| `.pathable-breadcrumb` | Breadcrumb | Breadcrumb story |
| `.pathable-pagination` | Pagination | Pagination story |
| `.pathable-search` | Search | Search story |
| `.pathable-skipnav` | Skip to content | Skipnav story |

### Navigation Item Contract

The following Pathable staff workflow labels replace generic navigation labels in Storybook examples:

| Label | Section | Component Story to Modify |
| ------- | --------- | -------------------------- |
| Today's Sessions | Primary | Sidenav, Nav |
| Participants | Primary | Sidenav, Nav |
| Approvals | Primary | Sidenav, Nav |
| Reports | Primary | Sidenav, Nav |
| Templates | Primary or Settings | Sidenav, Nav |
| Settings | End | Sidenav, Nav |

### Sidenav HTML Structure Contract

```html
<aside class="pathable-sidenav">
  <ul class="pathable-sidenav__sublist">
    <li class="pathable-sidenav__item">
      <a href="#" class="pathable-current" aria-current="page">Today's Sessions</a>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Participants</a>
      <ul class="pathable-sidenav__sublist">
        <li class="pathable-sidenav__item"><a href="#">All Participants</a></li>
        <li class="pathable-sidenav__item"><a href="#">Add Participant</a></li>
      </ul>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Approvals</a>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Reports</a>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Templates</a>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Settings</a>
    </li>
  </ul>
</aside>
```

### Accessibility Contract

- All navigation items MUST be reachable via Tab key
- Current/active page MUST use `aria-current="page"`
- Focus indicators MUST be visible (USWDS default provides this)
- Keyboard navigation MUST work: Enter to follow link, Tab to move between items, Arrow keys for nested lists (USWDS provides this natively)

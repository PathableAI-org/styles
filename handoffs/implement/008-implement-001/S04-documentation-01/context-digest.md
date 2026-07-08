# Context Digest — S04-documentation-01 (US1 Form Controls + Layout)

## Tasks
10 story files — 8 Form Controls + 2 Layout.

## JS-Driven Components (MUST include USWDS JS dependency note per FR-012)
- **T016** ComboBox — JS-driven
- **T017** DatePicker — JS-driven
- **T018** DateRangePicker — JS-driven

The note should read something like:
> *Note: This component requires USWDS JavaScript for full interactivity. The examples below show static CSS styling only.*

## Story File Contract
- Default export with `title: 'Components/{Category}/{Name}', tags: ['autodocs']`
- JS-driven components: add `parameters: { notes: 'Requires USWDS JavaScript...' }` or inline comment
- NO `.usa-*` class references — use only `pathable-*` prefixed classes

## Title Assignments
- Checkbox → `Components/Form Controls/Checkbox`
- ComboBox → `Components/Form Controls/ComboBox`
- DatePicker → `Components/Form Controls/Date Picker`
- DateRangePicker → `Components/Form Controls/Date Range Picker`
- Input → `Components/Form Controls/Input`
- Radio → `Components/Form Controls/Radio`
- Select → `Components/Form Controls/Select`
- Textarea → `Components/Form Controls/Textarea`
- Icon → `Components/Layout/Icon`
- MediaBlock → `Components/Layout/Media Block`
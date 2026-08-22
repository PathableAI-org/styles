import type {
  CapabilityRef,
  FixtureRef,
  RolloutEntry,
  RolloutStatus,
  RolloutWave,
} from './types.js'
import { segmentedControlManifest } from '../segmented-control/manifest.js'

/**
 * Component rollout ledger (Phase 3 of the component-testing refactor).
 *
 * Records, per component target, its wave (A–E), whether it is a shared
 * contract or a Styles-only surface, its Styles-proof status, the shared
 * capabilities it proves, its deterministic fixtures, and the order of any
 * downstream adoption.
 *
 * Rules enforced by `validateRolloutLedger` (invoked by the evidence report):
 * - `shared` entries MUST list at least one capability.
 * - `adopted` entries MUST be `styles-proven` first (a Styles proof precedes
 *   any downstream adoption).
 * - `styles-only` entries MUST NOT list capabilities or downstream adoptions.
 * - A `styles-proven`/`adopted` entry MUST have a green focused run recorded in
 *   `scripts/.storybook-evidence.json` (checked by the evidence report).
 *
 * See `specs/043-component-test-rollout/contracts/rollout-ledger.md` for the
 * full contract.
 */

export function rolloutEntry(entry: RolloutEntry): RolloutEntry {
  return entry
}

/** Frame a downstream adoption (helpers are adopted unchanged). */
export function adoption(entry: {
  package: string
  isolationGuard: string
  provenAt: string
}): { package: string; isolationGuard: string; provenAt: string } {
  return entry
}

/** Mark an entry `styles-proven` only when it carries its proof status. */
export function markStylesProven(entry: RolloutEntry): RolloutEntry {
  return { ...entry, status: normalizeStatus(entry.status, 'styles-proven') }
}

function normalizeStatus(
  current: RolloutStatus,
  target: RolloutStatus,
): RolloutStatus {
  // A proven entry must stay proven; an adopted entry must remain adopted.
  if (current === 'adopted' || current === target) return current
  return target
}

/**
 * Validate ledger invariants and return an array of problems (empty === valid).
 * Mutates nothing.
 */
export function validateRolloutLedger(entries: RolloutEntry[]): string[] {
  const problems: string[] = []
  const seen = new Set<string>()

  for (const entry of entries) {
    if (seen.has(entry.component)) {
      problems.push(`Duplicate rollout entry for ${entry.component}`)
    }
    seen.add(entry.component)

    if (!entry.component || !entry.name || !entry.storyId) {
      problems.push(
        `Incomplete rollout entry: ${entry.component || entry.name || '(unnamed)'}`,
      )
    }

    if (entry.category === 'shared' && entry.capabilities.length === 0) {
      problems.push(
        `Shared entry ${entry.component} lists no capabilities; shared components must prove at least one capability.`,
      )
    }

    if (entry.category === 'styles-only' && entry.capabilities.length > 0) {
      problems.push(
        `Styles-only entry ${entry.component} lists capabilities; styles-only surfaces must stay fixture-only.`,
      )
    }

    if (entry.category === 'styles-only' && entry.downstream.length > 0) {
      problems.push(
        `Styles-only entry ${entry.component} lists downstream adoptions; styles-only surfaces cannot be adopted.`,
      )
    }

    if (entry.status === 'adopted' && entry.category !== 'shared') {
      problems.push(
        `Entry ${entry.component} is marked adopted but is ${entry.category}; only shared components can be adopted.`,
      )
    }

    if (entry.status === 'adopted' && entry.downstream.length === 0) {
      problems.push(
        `Entry ${entry.component} is marked adopted with no downstream adoption recorded.`,
      )
    }
  }

  return problems
}

/** Build a ledger entry for a `styles-only` surface (no capabilities/downstream). */
function stylesOnly(
  component: string,
  name: string,
  wave: RolloutWave,
  storyId: string,
  status: RolloutStatus = 'not-started',
): RolloutEntry {
  return {
    component,
    name,
    wave,
    category: 'styles-only',
    status,
    capabilities: [],
    fixtures: [],
    storyId,
    downstream: [],
  }
}

/** Build a ledger entry for a `shared` component (needs at least one capability). */
function shared(
  component: string,
  name: string,
  wave: RolloutWave,
  storyId: string,
  capabilities: CapabilityRef[],
  fixtures: FixtureRef[] = [],
  status: RolloutStatus = 'not-started',
): RolloutEntry {
  return {
    component,
    name,
    wave,
    category: 'shared',
    status,
    capabilities,
    fixtures,
    storyId,
    downstream: [],
  }
}

/**
 * The component rollout ledger.
 *
 * Accordion already carries `styles-proven` from Phase 1 (its six shared
 * capabilities and fixtures were validated by `scripts/test-storybook.mjs`).
 * Every other component and Styles-only surface is `not-started` and is proven
 * one at a time within its wave.
 */
export const rolloutLedger: RolloutEntry[] = [
  // ---- Wave A: stateful keyboard and focus (shared) ----
  // Each entry's capabilities reflect exactly what the Styles `play` tests
  // proved green. Interactive scope owned by the USWDS/runtime (open/close,
  // focus trap, calendar sync, option navigation) is recorded only where the
  // Styles story executes it; otherwise it remains framework-owned.
  shared(
    'components-communication-modal',
    'Modal',
    'A',
    'components-communication-modal',
    [
      {
        id: 'modal.dialog-name',
        group: 'overlay',
        label: 'The overlay is a named dialog with a labelled close',
      },
    ],
    [
      {
        name: 'modal.default',
        storyId: 'components-communication-modal--default',
      },
    ],
    'styles-proven',
  ),
  shared(
    'components-communication-banner',
    'Banner',
    'A',
    'components-communication-banner',
    [
      {
        id: 'banner.disclosure-toggle',
        group: 'disclosure',
        label: 'Activation toggles disclosure',
      },
      {
        id: 'banner.content-availability',
        group: 'disclosure',
        label: 'Content available only when open',
      },
    ],
    [
      {
        name: 'banner.default',
        storyId: 'components-communication-banner--default',
      },
      {
        name: 'banner.initially-expanded',
        storyId: 'components-communication-banner--initially-expanded',
      },
    ],
    'styles-proven',
  ),
  shared(
    'components-form-controls-combo-box',
    'ComboBox',
    'A',
    'components-form-controls-combo-box',
    [
      {
        id: 'combo-box.label',
        group: 'composite-widget',
        label: 'Accessible label resolves',
      },
    ],
    [
      {
        name: 'combo-box.default',
        storyId: 'components-form-controls-combo-box--default',
      },
    ],
    'styles-proven',
  ),
  shared(
    'components-form-controls-date-picker',
    'DatePicker',
    'A',
    'components-form-controls-date-picker',
    [
      {
        id: 'date-picker.label',
        group: 'composite-widget',
        label: 'The date input has an accessible label',
      },
    ],
    [
      {
        name: 'date-picker.default',
        storyId: 'components-form-controls-date-picker--default',
      },
    ],
    'styles-proven',
  ),
  shared(
    'components-form-controls-date-range-picker',
    'DateRangePicker',
    'A',
    'components-form-controls-date-range-picker',
    [
      {
        id: 'date-range-picker.labels',
        group: 'composite-widget',
        label: 'Both range inputs have accessible labels',
      },
    ],
    [
      {
        name: 'date-range-picker.default',
        storyId: 'components-form-controls-date-range-picker--default',
      },
    ],
    'styles-proven',
  ),
  shared(
    'components-navigation-header',
    'Header',
    'A',
    'components-navigation-header',
    [
      {
        id: 'header.landmark',
        group: 'composite-widget',
        label: 'Primary navigation is a named landmark',
      },
    ],
    [
      {
        name: 'header.default',
        storyId: 'components-navigation-header--default',
      },
    ],
    'styles-proven',
  ),
  shared(
    'components-navigation-sidenav',
    'Sidenav',
    'A',
    'components-navigation-sidenav',
    [
      {
        id: 'sidenav.landmark',
        group: 'composite-widget',
        label: 'Side navigation is a named landmark',
      },
      {
        id: 'sidenav.current',
        group: 'composite-widget',
        label: 'Current item communicates the current page',
      },
    ],
    [
      {
        name: 'sidenav.default',
        storyId: 'components-navigation-sidenav--default',
      },
    ],
    'styles-proven',
  ),
  shared(
    'components-navigation-search',
    'Search',
    'A',
    'components-navigation-search',
    [
      {
        id: 'search.landmark',
        group: 'composite-widget',
        label: 'Search form is a named landmark',
      },
      {
        id: 'search.label',
        group: 'composite-widget',
        label: 'Input has an accessible label',
      },
    ],
    [
      {
        name: 'search.default',
        storyId: 'components-navigation-search--default',
      },
      { name: 'search.big', storyId: 'components-navigation-search--big' },
    ],
    'styles-proven',
  ),

  // ---- Wave B: native and custom form controls (shared) ----
  shared(
    'components-form-controls-checkbox',
    'Checkbox',
    'B',
    'components-form-controls-checkbox',
    [
      {
        id: 'checkbox.label',
        group: 'composite-widget',
        label: 'Accessible label',
      },
      {
        id: 'checkbox.entry',
        group: 'composite-widget',
        label: 'Checked entry',
      },
      {
        id: 'checkbox.disabled',
        group: 'composite-widget',
        label: 'Disabled state',
      },
      {
        id: 'checkbox.required',
        group: 'composite-widget',
        label: 'Required state',
      },
      {
        id: 'checkbox.invalid',
        group: 'composite-widget',
        label: 'Invalid state',
      },
      {
        id: 'checkbox.hint-error',
        group: 'composite-widget',
        label: 'Hint/error association',
      },
    ],
  ),
  shared(
    'components-form-controls-radio',
    'Radio',
    'B',
    'components-form-controls-radio',
    [
      {
        id: 'radio.grouping',
        group: 'composite-widget',
        label: 'Grouping and labeling',
      },
      {
        id: 'radio.keyboard-select',
        group: 'composite-widget',
        label: 'Keyboard selection',
      },
    ],
  ),
  shared(
    'components-form-controls-select',
    'Select',
    'B',
    'components-form-controls-select',
    [
      {
        id: 'select.label',
        group: 'composite-widget',
        label: 'Accessible label',
      },
      {
        id: 'select.option-select',
        group: 'composite-widget',
        label: 'Option selection',
      },
      {
        id: 'select.error-association',
        group: 'composite-widget',
        label: 'Error association',
      },
    ],
  ),
  shared(
    'components-form-controls-input',
    'Input',
    'B',
    'components-form-controls-input',
    [
      {
        id: 'input.label',
        group: 'composite-widget',
        label: 'Accessible label',
      },
      { id: 'input.entry', group: 'composite-widget', label: 'Text entry' },
      {
        id: 'input.required',
        group: 'composite-widget',
        label: 'Required state',
      },
      {
        id: 'input.invalid',
        group: 'composite-widget',
        label: 'Invalid state',
      },
      {
        id: 'input.hint-error',
        group: 'composite-widget',
        label: 'Hint/error association',
      },
    ],
  ),
  shared(
    'components-form-controls-textarea',
    'Textarea',
    'B',
    'components-form-controls-textarea',
    [
      {
        id: 'textarea.label',
        group: 'composite-widget',
        label: 'Accessible label',
      },
      { id: 'textarea.entry', group: 'composite-widget', label: 'Text entry' },
      {
        id: 'textarea.hint-error',
        group: 'composite-widget',
        label: 'Error association',
      },
    ],
  ),

  // ---- Wave C: navigation, collections, and activation (shared) ----
  shared('components-basic-button', 'Button', 'C', 'components-basic-button', [
    {
      id: 'button.activates',
      group: 'composite-widget',
      label: 'Activates on activation',
    },
  ]),
  shared(
    'components-basic-button-group',
    'ButtonGroup',
    'C',
    'components-basic-button-group',
    [
      {
        id: 'button-group.grouping',
        group: 'composite-widget',
        label: 'Group semantics',
      },
    ],
  ),
  shared('components-basic-link', 'Link', 'C', 'components-basic-link', [
    {
      id: 'link.activates',
      group: 'composite-widget',
      label: 'Activation semantics',
    },
  ]),
  shared(
    'components-navigation-pagination',
    'Pagination',
    'C',
    'components-navigation-pagination',
    [
      {
        id: 'pagination.current-page',
        group: 'composite-widget',
        label: 'Current-page semantics',
      },
    ],
  ),
  shared(
    'components-navigation-breadcrumb',
    'Breadcrumb',
    'C',
    'components-navigation-breadcrumb',
    [
      {
        id: 'breadcrumb.navigation',
        group: 'composite-widget',
        label: 'Navigation landmark semantics',
      },
    ],
  ),
  shared(
    'components-navigation-skipnav',
    'Skipnav',
    'C',
    'components-navigation-skipnav',
    [
      {
        id: 'skipnav.bypass',
        group: 'focus',
        label: 'Bypass behavior on focus',
      },
    ],
  ),
  shared('components-basic-table', 'Table', 'C', 'components-basic-table', [
    {
      id: 'table.headers',
      group: 'composite-widget',
      label: 'Headers/captions',
    },
    {
      id: 'table.grouping',
      group: 'composite-widget',
      label: 'Row/column grouping',
    },
  ]),
  shared('components-basic-list', 'List', 'C', 'components-basic-list', [
    {
      id: 'list.collection',
      group: 'composite-widget',
      label: 'Collection/grouping semantics',
    },
  ]),

  // ---- Wave D: status, feedback, and progress (shared) ----
  shared(
    'components-communication-alert',
    'Alert',
    'D',
    'components-communication-alert',
    [
      {
        id: 'alert.role',
        group: 'composite-widget',
        label: 'Role and accessible name',
      },
      {
        id: 'alert.content',
        group: 'composite-widget',
        label: 'Meaningful content',
      },
    ],
  ),
  shared(
    'components-communication-site-alert',
    'SiteAlert',
    'D',
    'components-communication-site-alert',
    [
      {
        id: 'site-alert.role',
        group: 'composite-widget',
        label: 'Role/live exposure',
      },
      {
        id: 'site-alert.dismiss',
        group: 'composite-widget',
        label: 'Dismissal where supported',
      },
    ],
  ),
  shared(
    'components-feedback-toast',
    'Toast',
    'D',
    'components-feedback-toast',
    [
      {
        id: 'toast.role',
        group: 'composite-widget',
        label: 'Role/live exposure',
      },
      { id: 'toast.dismiss', group: 'composite-widget', label: 'Dismissal' },
    ],
  ),
  shared(
    'components-feedback-page-error',
    'PageError',
    'D',
    'components-feedback-page-error',
    [
      {
        id: 'page-error.role',
        group: 'composite-widget',
        label: 'Role and content',
      },
    ],
  ),
  shared(
    'components-feedback-loading',
    'Loading',
    'D',
    'components-feedback-loading',
    [
      {
        id: 'loading.status',
        group: 'composite-widget',
        label: 'Live/status exposure',
      },
    ],
  ),
  shared(
    'components-feedback-skeleton',
    'Skeleton',
    'D',
    'components-feedback-skeleton',
    [
      {
        id: 'skeleton.status',
        group: 'composite-widget',
        label: 'State exposure',
      },
    ],
  ),
  shared(
    'components-communication-process-list',
    'ProcessList',
    'D',
    'components-communication-process-list',
    [
      {
        id: 'process-list.progress',
        group: 'composite-widget',
        label: 'Progress/current state',
      },
    ],
  ),
  shared(
    'components-communication-step-indicator',
    'StepIndicator',
    'D',
    'components-communication-step-indicator',
    [
      {
        id: 'step-indicator.current',
        group: 'composite-widget',
        label: 'Current/progress state',
      },
    ],
  ),
  shared(
    'components-communication-summary-box',
    'SummaryBox',
    'D',
    'components-communication-summary-box',
    [
      {
        id: 'summary-box.content',
        group: 'composite-widget',
        label: 'Meaningful content/state',
      },
    ],
  ),
  shared(
    'components-feedback-empty-state',
    'EmptyState',
    'D',
    'components-feedback-empty-state',
    [
      {
        id: 'empty-state.role',
        group: 'composite-widget',
        label: 'Role and meaningful content',
      },
    ],
  ),

  // ---- Wave E: visual and composition-led (styles-only) ----
  stylesOnly('components-basic-card', 'Card', 'E', 'components-basic-card'),
  stylesOnly('components-basic-tag', 'Tag', 'E', 'components-basic-tag'),
  stylesOnly(
    'components-layout-media-block',
    'MediaBlock',
    'E',
    'components-layout-media-block',
  ),
  stylesOnly('components-layout-icon', 'Icon', 'E', 'components-layout-icon'),
  shared(
    'interaction-controls-segmentedcontrol',
    'SegmentedControl',
    'E',
    'interaction-controls-segmentedcontrol',
    segmentedControlManifest.shared.map(({ id, label }) => ({
      id,
      group: 'composite-widget',
      label,
    })),
    [
      {
        name: 'segmented-control.single-select',
        storyId: 'interaction-controls-segmentedcontrol--single-select',
      },
      {
        name: 'segmented-control.multi-select',
        storyId: 'interaction-controls-segmentedcontrol--multi-select',
      },
      {
        name: 'segmented-control.vertical',
        storyId: 'interaction-controls-segmentedcontrol--vertical',
      },
      {
        name: 'segmented-control.disabled-option',
        storyId: 'interaction-controls-segmentedcontrol--disabled-option',
      },
      {
        name: 'segmented-control.static-single-option',
        storyId: 'interaction-controls-segmentedcontrol--static-single-option',
      },
    ],
    'styles-proven',
  ),
  ...stylesOnlySurfaces(),
  // ---- Already-proven from Phase 1 (shared, accordion) ----
  existingAccordion(),
]

/** Wave E category surfaces that are not single widgets (styles-only). */
function stylesOnlySurfaces(): RolloutEntry[] {
  return [
    'app-shell/AppShell',
    'app-shell/AppShellMobile',
    'app-shell/AppShellVariants',
    'brand/ColorUsage',
    'brand/Typography',
    'dashboard/ActivityList',
    'dashboard/DashboardHeader',
    'dashboard/DashboardOverview',
    'dashboard/KpiGrid',
    'dashboard/RecordHeader',
    'dashboard/ScheduleItem',
    'dashboard/TableModifiers',
    'discovery/FilterBar',
    'discovery/FilterPill',
    'discovery/ResourceCard',
    'discovery/ResourceStates',
    'discovery/Wayfinder',
    'interaction-controls/IconButton',
    'interaction-controls/IconTile',
    'interaction-controls/Integration',
    'interaction-controls/InteractionStates',
    'layout-composition/CardGrid',
    'layout-composition/Cluster',
    'layout-composition/Container',
    'layout-composition/NestedComposition',
    'layout-composition/SidebarLayout',
    'layout-composition/Split',
    'layout-composition/Stack',
    'layout-composition/StickyPanel',
    'layout-composition/Surface',
    'marketing-patterns/BentoGrid',
    'marketing-patterns/ChipRail',
    'marketing-patterns/Combined',
    'marketing-patterns/DecorativeBackground',
    'marketing-patterns/MarketingLandingPage',
    'marketing-patterns/OperationalDashboard',
    'marketing-patterns/ResourceDirectory',
    'marketing-patterns/ScreenshotFrame',
    'marketing-patterns/StructuredWorkflow',
    'marketing-patterns/TextHighlight',
    'recipes/AccommodationsIntakeWizard',
    'recipes/OperationalDashboard',
    'recipes/QuestionnaireResultsFlow',
    'recipes/ResourceFinder',
    'recipes/ToolLandingPage',
    'structured-workflow/Wizard',
    'structured-workflow/WorkflowPanel',
  ].map((path) =>
    stylesOnly(
      `styles-only-${path.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      path,
      'E',
      path,
    ),
  )
}

/** Accordion is already `styles-proven` from Phase 1. */
function existingAccordion(): RolloutEntry {
  return {
    component: 'components-communication-accordion',
    name: 'Accordion',
    wave: 'A',
    category: 'shared',
    status: 'styles-proven',
    capabilities: [
      {
        id: 'accordion.keyboard-enter',
        group: 'disclosure',
        label: 'Enter expands a collapsed disclosure',
      },
      {
        id: 'accordion.keyboard-space',
        group: 'disclosure',
        label: 'Space collapses an expanded disclosure',
      },
      {
        id: 'accordion.single-open',
        group: 'disclosure',
        label: 'Opening a second disclosure closes the current one',
      },
      {
        id: 'accordion.panel-association',
        group: 'disclosure',
        label: 'A disclosure is associated with its panel',
      },
      {
        id: 'accordion.panel-availability',
        group: 'disclosure',
        label: 'A panel is available only when expanded',
      },
      {
        id: 'accordion.focus-retention',
        group: 'disclosure',
        label: 'Focus remains on the disclosure after activation',
      },
    ],
    fixtures: [
      {
        name: 'accordion.default',
        storyId: 'components-communication-accordion--default',
      },
      {
        name: 'accordion.first-expanded',
        storyId: 'components-communication-accordion--initially-expanded',
      },
    ],
    storyId: 'components-communication-accordion',
    downstream: [],
  }
}

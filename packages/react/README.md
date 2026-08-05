# @pathable/react

React components for the PathAble design system, wrapping `@pathable/styles` with idiomatic React components.

## Installation

```bash
# In a pnpm workspace
pnpm add @pathable/react
```

No separate installation of `@pathable/styles` is required — styles are included automatically as a dependency.

## Usage

```tsx
import {
  Accordion,
  Alert,
  Banner,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  ComboBox,
  ErrorMessage,
  Checkbox,
  EmptyState,
  Form,
  FormGroup,
  Fieldset,
  Header,
  Hint,
  Input,
  Label,
  Link,
  List,
  MediaBlock,
  Loading,
  Modal,
  PageError,
  Pagination,
  ProcessList,
  Radio,
  Search,
  SiteAlert,
  Skeleton,
  Skipnav,
  StepIndicator,
  SummaryBox,
  Table,
  Tag,
  Select,
  Sidenav,
  Textarea,
} from '@pathable/react'

function App() {
  return (
    <>
      <Skipnav href="#main-content">Skip to main content</Skipnav>

      <Header
        brand="PathAble"
        brandHref="#main-content"
        navigationLabel="Primary navigation"
        items={[
          {
            id: 'participants',
            content: 'Participants',
            href: '#participants',
          },
          { id: 'sessions', content: 'Coaching sessions', href: '#sessions' },
          { id: 'resources', content: 'Resources', href: '#resources' },
        ]}
      />

      <main id="main-content">
        <h1>Participant dashboard</h1>
        <p>Review coaching sessions and agreed action plans.</p>
      </main>

      <Breadcrumb
        aria-label="Breadcrumbs"
        items={[
          { content: 'Home', href: '#home', key: 'home' },
          { content: 'Participant resources', current: true, key: 'resources' },
        ]}
      />

      <Pagination
        aria-label="Participant result pages"
        currentPage={3}
        previous={{ href: '/participants?page=2' }}
        items={[
          {
            key: 'page-1',
            type: 'page',
            page: 1,
            href: '/participants?page=1',
          },
          {
            key: 'page-2',
            type: 'page',
            page: 2,
            href: '/participants?page=2',
          },
          {
            key: 'page-3',
            type: 'page',
            page: 3,
            href: '/participants?page=3',
          },
          {
            key: 'page-4',
            type: 'page',
            page: 4,
            href: '/participants?page=4',
          },
          { key: 'overflow', type: 'overflow' },
          {
            key: 'page-10',
            type: 'page',
            page: 10,
            href: '/participants?page=10',
          },
        ]}
        next={{ href: '/participants?page=4' }}
      />

      <Sidenav
        aria-label="Participant navigation"
        currentId="all-participants"
        items={[
          { id: 'overview', content: 'Overview', href: '/participants' },
          {
            id: 'participants',
            content: 'Participants',
            children: [
              {
                id: 'all-participants',
                content: 'All participants',
                href: '/participants/all',
              },
              {
                id: 'add-participant',
                content: 'Add participant',
                href: '/participants/new',
              },
            ],
          },
        ]}
      />

      <Card
        title="Upcoming coaching session"
        footer={<a href="/sessions/42">Open session</a>}
        className="dashboard-card"
      >
        <p>Review the participant notes and prepare the next action plan.</p>
      </Card>

      <EmptyState
        variant="no-results"
        icon={
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" />
          </svg>
        }
        heading="No matching results"
        body="Try adjusting your search terms or filters."
        action={
          <a href="#clear-filters" className="pathable-button">
            Clear filters
          </a>
        }
      />

      <PageError
        layout="compact"
        heading="Unable to load data"
        body="The data for this section could not be retrieved. Please try again."
        retry={<Button>Try again</Button>}
        nav={<a href="#go-back">Go back</a>}
      />

      <p>Loading participant summary</p>
      <Skeleton>
        <Skeleton variant="text-heading" />
        <Skeleton variant="text-body" />
        <Skeleton variant="text-body" />
      </Skeleton>

      <Loading text="Loading participant records..." />

      <Card
        presentation="media"
        title="Resource spotlight"
        media={<img src="/resource.jpg" alt="Resource preview" />}
      >
        <p>Share a helpful resource with the participant.</p>
      </Card>

      <Card
        presentation="workflow"
        title="Employment progress report"
        metadata="Generated today"
        status="Completed"
        actions={<Button variant="secondary">Download report</Button>}
        tabIndex={0}
      >
        <p>All employment goal milestones have been met this period.</p>
      </Card>

      <Button>Click Me</Button>
      <Button variant="primary" size="big">
        Primary
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive" disabled>
        Disabled
      </Button>

      <ButtonGroup>
        <Button variant="save">Save</Button>
        <Button variant="continue">Continue</Button>
      </ButtonGroup>

      <Search
        size="big"
        label="Search participant resources"
        buttonLabel="Search resources"
        action="/resources"
        method="get"
        inputProps={{
          id: 'participant-resource-search',
          name: 'query',
          placeholder: 'Search coaching resources',
        }}
      />

      <Link href="/sessions/42">Open coaching session</Link>

      <Link href="https://external.example.com" presentation="external">
        External resource
      </Link>

      <List
        items={[
          'Review participant goals',
          'Prepare coaching resources',
          'Send follow-up notes',
        ]}
      />

      <List
        presentation="ordered"
        items={[
          'Complete intake notes',
          'Schedule follow-up session',
          'Send resource summary',
        ]}
      />

      <List
        presentation="unstyled"
        className="dashboard-list"
        aria-label="Session actions"
        items={[
          {
            content: <a href="/sessions/42">Open session notes</a>,
            key: 'session-notes',
          },
          {
            content: <strong>Confirm next appointment</strong>,
            key: 'next-appointment',
          },
        ]}
      />

      <MediaBlock
        media={
          <img
            src="/participants/jordan-lee.jpg"
            alt="Portrait of participant Jordan Lee"
            width={96}
            height={96}
          />
        }
        title={<h2>Jordan Lee</h2>}
        description="Employment coaching participant"
        aria-label="Participant summary for Jordan Lee"
      >
        <p>Current goal: prepare for a customer-service placement interview.</p>
      </MediaBlock>

      <Table
        presentation="striped"
        className="my-custom-class"
        id="my-table-1"
        aria-label="Data table"
      >
        <caption>Team members</caption>
        <thead>
          <tr>
            <th scope="col">Header 1</th>
            <th scope="col">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </Table>

      <Form
        aria-label="Participant details"
        onSubmit={(event) => {
          event.preventDefault()
          // Consumer-owned submission handling goes here.
        }}
      >
        <label htmlFor="session-note">Session note</label>
        <Textarea
          id="session-note"
          name="sessionNote"
          rows={5}
          aria-describedby="session-note-hint"
        />
        <Hint id="session-note-hint">Include the agreed next action.</Hint>

        <FormGroup>
          <Label htmlFor="participant-email">Participant email</Label>
          <Input
            id="participant-email"
            name="participantEmail"
            type="email"
            required
            aria-invalid="true"
            aria-describedby="participant-email-error"
          />
          <ErrorMessage id="participant-email-error" role="alert">
            Enter an email address in the format name@example.com.
          </ErrorMessage>
        </FormGroup>

        <Fieldset>
          <legend>Employment preferences</legend>
          <FormGroup>
            <Label htmlFor="employment-goal">Employment goal</Label>
            <Select id="employment-goal" name="employmentGoal">
              <option value="">Select a goal</option>
              <option value="job-search">Job search skills</option>
              <option value="interview">Interview preparation</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="employment-hours">Preferred weekly hours</Label>
            <Input
              id="employment-hours"
              name="employmentHours"
              type="number"
              min={1}
              max={40}
            />
          </FormGroup>
        </Fieldset>

        <Radio name="employmentGoal" value="job-search" defaultChecked>
          Job search skills
        </Radio>
        <Checkbox
          name="sessionReminders"
          value="enabled"
          description="You can change this preference at any time."
        >
          Send session reminders
        </Checkbox>

        <Button type="submit">Save participant details</Button>
      </Form>

      <Tag>Active</Tag>

      <Tag size="big">Urgent</Tag>
    </>
  )
}
```

The rendered components include the corresponding `pathable-*` CSS classes with all PathAble styling. Consumers import components from `@pathable/react`; they do not need to import `@pathable/styles` separately in application code.

Header's mobile navigation uses the USWDS JavaScript distributed by `@pathable/styles`. Import it once at the application boundary; do not import it in individual components:

```tsx
import '@pathable/styles/js'
```

> **Navigation policy**: The `external` Link presentation changes only the visual treatment (adds `pathable-link--external`). Consumers remain responsible for `href`, `target`, `rel`, download behavior, and any routing logic.

### Link Props

| Prop         | Type                      | Default     | Description                                                                         |
| ------------ | ------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| presentation | `'default' \| 'external'` | `'default'` | Selects an implemented Link treatment. Unsupported values fall back to `'default'`. |
| children     | `React.ReactNode`         | —           | Consumer-supplied link content. Preserved unchanged inside the anchor.              |
| className    | `string`                  | —           | Additional root class names. Appended without replacing `pathable-link`.            |

Any other valid anchor attributes (e.g., `href`, `target`, `rel`, `aria-*`, `data-*`, event handlers) are forwarded to the root `<a>` element.

### Tag Props

| Prop      | Type                 | Default     | Description                                                                   |
| --------- | -------------------- | ----------- | ----------------------------------------------------------------------------- |
| size      | `'default' \| 'big'` | `'default'` | Selects an implemented Tag size. Unsupported values fall back to `'default'`. |
| children  | `React.ReactNode`    | —           | Consumer-supplied inline content. Preserved unchanged inside the span.        |
| className | `string`             | —           | Additional root class names. Appended without replacing `pathable-tag`.       |

The Tag is a non-interactive presentational inline label. Any other valid span attributes (e.g., `aria-*`, `data-*`, event handlers) are forwarded to the root `<span>` element.

### List Props

| Prop         | Type                                       | Default       | Description                         |
| ------------ | ------------------------------------------ | ------------- | ----------------------------------- |
| presentation | `'unordered' \| 'ordered' \| 'unstyled'`   | `'unordered'` | Existing Pathable list presentation |
| items        | `Array<React.ReactNode \| ListItemObject>` | —             | Ordered list item content           |
| children     | `React.ReactNode`                          | —             | Consumer-composed list content      |
| className    | `string`                                   | —             | Additional root element class names |

`ListItemObject` supports `content`, optional `key`, optional `className`, and optional `attributes` for item-level `aria-*`, `data-*`, and standard list item attributes.

### MediaBlock Props

`MediaBlock` composes consumer-owned media with optional supporting content using the existing PathAble media-block regions. It does not alter the media element, invent alt text, or choose a heading level.

| Prop        | Type              | Default  | Description                                                                                                         |
| ----------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| media       | `React.ReactNode` | required | Consumer-owned image, SVG, video, iframe, or other media. Its native semantics and attributes remain unchanged.     |
| title       | `React.ReactNode` | —        | Optional title content in a neutral styled region. Supply a heading element when the document outline requires one. |
| description | `React.ReactNode` | —        | Optional concise supporting content in the description region.                                                      |
| children    | `React.ReactNode` | —        | Optional rich body content rendered after the title and description.                                                |
| className   | `string`          | —        | Additional root class names appended after `pathable-media-block`.                                                  |

Any other standard `<div>` attributes, including `id`, `aria-*`, `data-*`, and event handlers, are forwarded to the root element. The body is omitted when `title`, `description`, and `children` are all empty; empty title and description regions are never rendered.

#### MediaBlock Accessibility

Provide meaningful `alt` text for informative images and `alt=""` for decorative images. Supply semantic title content, such as the heading level appropriate to the surrounding page, because MediaBlock intentionally does not create an implicit heading. Keep interactive media and body content responsible for their own native keyboard and accessible-name behavior.

### Card Props

| Prop         | Type                                                          | Default  | Description                         |
| ------------ | ------------------------------------------------------------- | -------- | ----------------------------------- |
| children     | `React.ReactNode`                                             | —        | Main card body content              |
| title        | `React.ReactNode`                                             | —        | Card heading content                |
| footer       | `React.ReactNode`                                             | —        | Footer region content               |
| media        | `React.ReactNode`                                             | —        | Media region content                |
| presentation | `'base' \| 'media' \| 'flag' \| 'header-first' \| 'workflow'` | `'base'` | Existing Pathable card presentation |
| metadata     | `React.ReactNode`                                             | —        | Workflow metadata content           |
| status       | `React.ReactNode`                                             | —        | Workflow status content             |
| actions      | `React.ReactNode`                                             | —        | Workflow action content             |
| className    | `string`                                                      | —        | Additional root element class names |

### EmptyState Props

`EmptyState` renders a structured empty view using the `pathable-empty-state` class and one of its four supported variants.

| Prop      | Type                                                           | Default     | Description                                                                                  |
| --------- | -------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| variant   | `'no-data' \| 'no-results' \| 'setup-required' \| 'completed'` | `'no-data'` | Empty-state context and matching PathAble modifier.                                          |
| icon      | `React.ReactElement`                                           | —           | Optional decorative icon. It receives `pathable-empty-state__icon` and `aria-hidden="true"`. |
| heading   | `React.ReactNode`                                              | required    | Primary message rendered as an `<h2>`.                                                       |
| body      | `React.ReactNode`                                              | required    | Explanation rendered as a `<p>`.                                                             |
| action    | `React.ReactElement`                                           | —           | Optional link or button. The element must accept `className`.                                |
| className | `string`                                                       | —           | Additional root class names appended after the PathAble empty-state classes.                 |

Any other standard `<div>` attributes, including `id`, `aria-*`, `data-*`, and event handlers, are forwarded to the root element.

#### EmptyState Accessibility

Use the variant that accurately describes why content is absent. Provide a clear heading and explanation. Icons are decorative and hidden from assistive technology. Use a meaningful link or button for `action`; the component preserves its native keyboard behavior and event handlers.

### Skeleton Props

`Skeleton` renders a decorative loading placeholder using the existing PathAble skeleton classes. It does not manage loading state, replacement content, timers, or announcements.

| Prop      | Type                                                                          | Default | Description                                                                    |
| --------- | ----------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| variant   | `'text-heading' \| 'text-body' \| 'avatar' \| 'card' \| 'table-row' \| 'row'` | —       | Selects an implemented placeholder shape; omit it for a composition container. |
| children  | `React.ReactNode`                                                             | —       | Optional placeholder composition, primarily when `variant` is omitted.         |
| className | `string`                                                                      | —       | Additional root class names appended after the PathAble skeleton classes.      |

Any other standard non-focusable `<div>` attributes, including `id` and `data-*`, are forwarded to the root element. The wrapper always renders `aria-hidden="true"`; consumers cannot override the accessibility-tree exclusion or make the root focusable through `tabIndex` or `contentEditable`.

#### Skeleton Accessibility

Match each placeholder to the approximate dimensions of the content it replaces to reduce layout shift. Skeletons are decorative and excluded from the accessibility tree, so keep interactive or meaningful content outside them. Provide separate visible or assistive loading status text when users need an announcement. Replace Skeleton with real content when loading completes in consumer-owned state; the component does not run timers or make that transition itself.

### PageError Props

`PageError` renders a page-level error using the `pathable-page-error` class, a compact or full-page layout, and the supported generic, not-found, and access-restricted variants.

| Prop      | Type                                              | Default     | Description                                                                                 |
| --------- | ------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| layout    | `'compact' \| 'full-page'`                        | `'compact'` | Selects the inline panel or full-page layout.                                               |
| variant   | `'generic' \| 'not-found' \| 'access-restricted'` | `'generic'` | Error context and matching PathAble modifier.                                               |
| icon      | `React.ReactElement`                              | —           | Optional decorative icon. It receives `pathable-page-error__icon` and `aria-hidden="true"`. |
| heading   | `React.ReactNode`                                 | required    | Primary message rendered as an `<h2>` for compact or `<h1>` for full-page layout.           |
| body      | `React.ReactNode`                                 | required    | Explanation rendered as a `<p>`.                                                            |
| retry     | `React.ReactElement`                              | —           | Retry action: use `Button` or a native button with `pathable-button`; accepts `className`.  |
| nav       | `React.ReactElement`                              | —           | Optional navigation action. The element must accept `className`.                            |
| className | `string`                                          | —           | Additional root class names appended after the PathAble page-error classes.                 |

The wrapper adds `pathable-page-error__retry` to the retry action but does not add button styling automatically.

Any other standard `<div>` attributes, including `id`, `aria-*`, `data-*`, and event handlers, are forwarded to the root element.

#### PageError Accessibility

Use `compact` for an inline error panel and `full-page` for a page-level failure. Provide a clear heading and explanation, use a retry action when recovery is possible, and provide navigation when the user needs another destination. Icons are decorative and hidden from assistive technology.

### Loading Props

`Loading` renders the existing `pathable-loading` inline indicator with a decorative spinner and optional status text. It does not own loading state, timers, requests, or the replacement content shown when work completes.

| Prop      | Type                               | Default     | Description                                                                                        |
| --------- | ---------------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| size      | `'default' \| 'large'`             | `'default'` | Selects the 24px default indicator or the 40px `pathable-loading--large` treatment.                |
| text      | `React.ReactNode`                  | —           | Optional visible status text rendered with `pathable-loading__text`.                               |
| className | `string`                           | —           | Additional class names appended after the PathAble loading classes.                                |
| role      | `string`                           | —           | Optional consumer-selected role, such as `status` for spinner-only usage.                          |
| aria-live | `'off' \| 'polite' \| 'assertive'` | `'polite'`  | Live-region politeness for status text; consumers may override it for their announcement strategy. |

Any other standard `<div>` attributes, including `id`, `aria-label`, `data-*`, and event handlers, are forwarded to the root element. The spinner always receives `aria-hidden="true"`.

#### Loading Accessibility

Use concise `text` that identifies what is loading. The root defaults to `aria-live="polite"`; use a consumer-provided `role="status"` and accessible `aria-label` when rendering spinner-only loading. Consumers remain responsible for showing and replacing the indicator, choosing announcement timing, and providing any page-level loading status required by the application.

### Button Props

| Prop      | Type                                                                                                                                                                                  | Default     | Description                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| variant   | `'primary' \| 'secondary' \| 'accent-cool' \| 'accent-warm' \| 'outline' \| 'inverse' \| 'base' \| 'unstyled' \| 'save' \| 'continue' \| 'review' \| 'destructive' \| 'low-emphasis'` | `'primary'` | Visual variant of the button   |
| size      | `'default' \| 'big'`                                                                                                                                                                  | `'default'` | Size variant of the button     |
| children  | `React.ReactNode`                                                                                                                                                                     | —           | Button content                 |
| disabled  | `boolean`                                                                                                                                                                             | —           | Whether the button is disabled |
| className | `string`                                                                                                                                                                              | —           | Additional CSS class names     |

### ButtonGroup Props

| Prop      | Type              | Description                |
| --------- | ----------------- | -------------------------- |
| children  | `React.ReactNode` | Button group content       |
| className | `string`          | Additional CSS class names |

### Header Props

`Header` renders the basic USWDS header hierarchy with both `pathable-*` styling classes and the required `usa-*` compatibility classes. It does not own mobile-menu state or import the USWDS JavaScript bundle.

| Prop            | Type                       | Default                | Description                                                   |
| --------------- | -------------------------- | ---------------------- | ------------------------------------------------------------- |
| brand           | `React.ReactNode`          | required               | Visible content for the native brand link                     |
| brandHref       | `string`                   | required               | Consumer-owned destination for the brand link                 |
| items           | `readonly HeaderNavItem[]` | required               | Consumer-owned primary-navigation records                     |
| menuLabel       | `string`                   | `'Menu'`               | Visible label for the mobile menu button                      |
| closeLabel      | `string`                   | `'Close navigation'`   | Accessible name for the icon-only mobile close button         |
| navigationLabel | `string`                   | `'Primary navigation'` | Accessible name for the navigation landmark                   |
| className       | `string`                   | —                      | Additional class names appended after the Header root classes |

Each `HeaderNavItem` requires a stable `id`, `content`, `href`, and accepts optional native anchor `attributes`. Destinations, routing, link callbacks, targets, and relationships remain consumer-owned.

#### Header Accessibility And JavaScript

Import `@pathable/styles/js` once at the application boundary to enable USWDS mobile menu opening, focus movement to the close button, Escape handling, and focus restoration. The wrapper deliberately has no `open` prop or internal open state, preventing competing React and USWDS state owners. Without JavaScript, the semantic header, labeled navigation landmark, brand link, and navigation links remain in the DOM as native elements.

### Breadcrumb Props

`Breadcrumb` renders a semantic navigation landmark with a PathAble ordered list. It applies the nested PathAble classes for items and links so consumers only provide content, destinations, and current-page meaning.

| Prop      | Type               | Default | Description                               |
| --------- | ------------------ | ------- | ----------------------------------------- |
| items     | `BreadcrumbItem[]` | `[]`    | Breadcrumb content and navigation records |
| className | `string`           | —       | Additional CSS class names                |

Each `BreadcrumbItem` supports `content`, optional `href`, optional `current`, optional `key`, `className`, `attributes` for native list-item attributes, `linkClassName`, and `linkAttributes` for native anchor attributes. Current items render as text with `aria-current="page"`; items without an `href` also render as text.

Any other standard navigation attributes, including `aria-label`, `data-*`, and event handlers, are forwarded to the underlying `<nav>` element.

#### Breadcrumb Accessibility

Provide an accessible navigation name with `aria-label` or another accessible naming mechanism. Mark exactly one current page when the breadcrumb represents the current location. Keep labels concise and preserve a meaningful page heading separately.

### Pagination Props

`Pagination` renders a consumer-supplied page window as native links inside a semantic navigation landmark. The component does not calculate which pages to show, change `currentPage`, intercept navigation, or integrate with a router.

| Prop        | Type                        | Default  | Description                                                                        |
| ----------- | --------------------------- | -------- | ---------------------------------------------------------------------------------- |
| items       | `readonly PaginationItem[]` | required | Ordered page and overflow records supplied by the consumer.                        |
| currentPage | `number`                    | required | Consumer-owned page number. The matching page link receives `aria-current="page"`. |
| previous    | `PaginationLink`            | —        | Optional previous-page native link. Omit it when there is no previous destination. |
| next        | `PaginationLink`            | —        | Optional next-page native link. Omit it when there is no next destination.         |
| className   | `string`                    | —        | Additional root class names appended without replacing `pathable-pagination`.      |

Any other standard navigation attributes, including `aria-label`, `aria-labelledby`, `id`, `data-*`, and event handlers, are forwarded to the root `<nav>` element.

`PaginationItem` is a discriminated union. Page records require `key`, `type: 'page'`, `page`, and `href`, plus optional native anchor `attributes`. Overflow records contain only `key` and `type: 'overflow'`; they render as a non-interactive ellipsis. `PaginationLink` requires `href` and accepts an optional accessible `label` and native anchor `attributes`. Anchor destinations, targets, relations, download behavior, and event handlers remain consumer-owned.

#### Pagination Accessibility

Give each Pagination landmark a concise accessible name. Supply `currentPage` from application state; if it does not match a page record, Pagination renders no false current marker. Previous, next, and page destinations are native anchors and retain browser keyboard and navigation behavior. Overflow is presentational and cannot receive focus or activation.

### Sidenav Props

`Sidenav` renders persistent application or section navigation as an `<aside>` containing recursive lists and native anchors. The application derives `currentId` from its routing state; Sidenav does not intercept navigation or own active or expansion state.

| Prop         | Type                     | Default | Description                                                                        |
| ------------ | ------------------------ | ------- | ---------------------------------------------------------------------------------- |
| items        | `readonly SidenavItem[]` | —       | Immutable recursive destination and section records.                               |
| currentId    | `string`                 | —       | Stable item ID to receive `pathable-current` and `aria-current="page"`.            |
| className    | `string`                 | —       | Additional root class names appended after `pathable-sidenav`.                     |
| `aria-label` | `string`                 | —       | Accessible name for the side-navigation landmark. `aria-labelledby` is also valid. |

Each `SidenavItem` requires a stable `id` and `content`. An optional `href` renders a native anchor; without one, content remains text and is not exposed as a fake link. Optional recursive `children` render a nested `pathable-sidenav__sublist`. Records may provide `className` and `attributes` for the list item, `linkClassName` and `linkAttributes` for its anchor, and `listClassName` and `listAttributes` for its child list.

`currentId` is matched depth-first. An omitted or unknown ID marks no item current. If malformed data repeats an ID, only the first match receives current-page semantics, preserving the single-current contract.

#### Sidenav Accessibility

Give every Sidenav an accessible name with `aria-label` or `aria-labelledby`. Keep destination labels concise and use stable, unique item IDs. Derive `currentId` from the router without duplicating route state inside the wrapper. Native anchors preserve browser navigation and keyboard order; section labels without `href` remain non-interactive text.

### Table Props

| Prop         | Type                                                  | Default     | Description                                                                                 |
| ------------ | ----------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| children     | `React.ReactNode`                                     | —           | Table content, typically `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements |
| className    | `string`                                              | —           | Additional CSS class names to apply to the table element                                    |
| presentation | `'default' \| 'borderless' \| 'compact' \| 'striped'` | `'default'` | Visual presentation of the table. Unsupported values fall back to `'default'`               |

Any other standard HTML attributes (e.g., `id`, `aria-label`, `data-testid`) can also be passed directly as props and will be applied to the underlying `<table>` element.

#### Table Accessibility

Use a `<caption>` element or `aria-label` to give the table an accessible name. Use `scope="col"` or `scope="row"` on `<th>` elements to identify header cells.

### ComboBox Props

`ComboBox` is a searchable single-choice control. It keeps a visually hidden native `<select>` as the form-value source and renders the searchable input and listbox with React-owned behavior. It does not require a separate `@pathable/styles/js` import.

| Prop             | Type                        | Default  | Description                                                                                            |
| ---------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| label            | `React.ReactNode`           | required | Visible label for the combobox input.                                                                  |
| options          | `readonly ComboBoxOption[]` | required | Options with `value`, `label`, and optional `disabled` properties.                                     |
| selectProps      | `ComboBoxSelectProps`       | `{}`     | Native select attributes, including `id`, `name`, `value`, `defaultValue`, `required`, and `disabled`. |
| inputProps       | `ComboBoxInputProps`        | `{}`     | Visible input attributes, including `placeholder`, `aria-describedby`, and event handlers.             |
| disableFiltering | `boolean`                   | `false`  | Shows all options while typing instead of filtering the list.                                          |
| className        | `string`                    | —        | Additional root class names appended after the PathAble ComboBox classes.                              |

`ComboBoxOption` requires a string `value` and `label`; `disabled` options remain visible but cannot be selected. Empty option values are reserved for the hidden native placeholder option.

#### ComboBox Accessibility

ComboBox supplies the visible label, `combobox` role, `listbox` relationship, active-descendant state, keyboard navigation, and polite result announcements. Use `inputProps.aria-describedby` for hints or validation messages. The hidden native select retains the submitted field name and selected value. Use `selectProps.value` with `selectProps.onChange` for controlled selection or `selectProps.defaultValue` for uncontrolled selection.

### Input Props

`Input` wraps a native `<input>` with the `pathable-input` class and forwards standard input attributes.

| Prop         | Type                                    | Default | Description                                              |
| ------------ | --------------------------------------- | ------- | -------------------------------------------------------- |
| type         | `React.HTMLInputTypeAttribute`          | —       | Native input type, such as `text`, `email`, or `search`. |
| className    | `string`                                | —       | Additional CSS class names                               |
| value        | `string \| number \| readonly string[]` | —       | Controlled field value                                   |
| defaultValue | `string \| number \| readonly string[]` | —       | Initial uncontrolled field value                         |
| disabled     | `boolean`                               | —       | Prevents interaction and form submission                 |
| readOnly     | `boolean`                               | —       | Allows reading and selection without editing             |
| required     | `boolean`                               | —       | Enables native required-field validation                 |

Any other standard input attributes, including `id`, `name`, `placeholder`, `min`, `max`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<input>` element.

#### Input Accessibility

Provide a visible associated `<label>` or an appropriate ARIA label. Use `aria-describedby` to associate hints or validation messages. Use `value` with `onChange` for controlled fields and `defaultValue` for uncontrolled fields.

### Search Props

`Search` renders a native search landmark with an associated search input and submit button. It applies the existing `pathable-search` contract and uses the package's `Input` and `Button` primitives. The search icon is a fixed decorative SVG and does not depend on the public Icon wrapper.

| Prop        | Type                     | Default     | Description                                                                                  |
| ----------- | ------------------------ | ----------- | -------------------------------------------------------------------------------------------- |
| size        | `'default' \| 'big'`     | `'default'` | Selects the icon-button treatment or the big treatment with a visible button label.          |
| label       | `React.ReactNode`        | required    | Accessible label associated with the native search input.                                    |
| buttonLabel | `React.ReactNode`        | `'Search'`  | Accessible submit action label; visually hidden at the default size and visible in big mode. |
| inputProps  | `SearchInputProps`       | `{}`        | Native search input attributes other than `type`, which is always `search`.                  |
| className   | `string`                 | —           | Additional class names appended after the PathAble search classes.                           |
| onSubmit    | `React.FormEventHandler` | —           | Native form submit handler; the wrapper does not prevent default submission.                 |

Any other standard form attributes, including `id`, `action`, `method`, `target`, `aria-*`, `data-*`, and event handlers, are forwarded to the root `<form role="search">`. `inputProps` forwards native input attributes such as `name`, `placeholder`, `value`, `defaultValue`, `onChange`, `disabled`, `required`, `aria-*`, and `data-*`.

#### Search Accessibility

Use a specific `label` that describes what content is searched. The wrapper associates that label with the searchbox, hides the decorative SVG from assistive technology, and keeps `buttonLabel` available as the submit button's accessible name in both sizes. Big mode shows that label at wider viewports and follows the owning responsive search contract by collapsing to the named icon button on small viewports. The input and button retain native keyboard and submission behavior: Enter in the searchbox or activation of the submit button submits the form once.

Search does not own the query, results, validation, request, or keyboard routing. Use controlled input attributes when the application owns the query, or native `defaultValue` for an uncontrolled field. A disabled search input remains disabled according to native behavior; disable or remove the submit action at the application level only when that action is also unavailable.

### Form Props

`Form` wraps a native `<form>` with the `pathable-form` class and forwards standard form attributes.

| Prop       | Type                                                  | Default | Description                                                                   |
| ---------- | ----------------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| children   | `React.ReactNode`                                     | —       | Labeled form controls and submit or other form actions.                       |
| className  | `string`                                              | —       | Additional class names appended after `pathable-form`.                        |
| action     | `React.FormHTMLAttributes<HTMLFormElement>['action']` | —       | Native submission URL or React form action.                                   |
| method     | `React.FormHTMLAttributes<HTMLFormElement>['method']` | `'get'` | Native browser submission method.                                             |
| noValidate | `boolean`                                             | —       | Disables native constraint validation; provide an equivalent accessible flow. |

Any other standard form attributes, including `id`, `encType`, `target`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<form>` element.

#### Form Accessibility

Use a visible heading with `aria-labelledby` or an appropriate `aria-label` when the form needs an accessible name. Give every contained control an accessible label and provide a clearly labeled submit action. Do not nest forms. Form does not manage control state, validation, submission requests, or server responses.

### FormGroup Props

`FormGroup` wraps a native `<div>` with the `pathable-form-group` class and forwards standard div attributes.

| Prop      | Type              | Default | Description                                                  |
| --------- | ----------------- | ------- | ------------------------------------------------------------ |
| children  | `React.ReactNode` | —       | Label, form control, and related hint or validation content. |
| className | `string`          | —       | Additional class names appended after `pathable-form-group`. |
| id        | `string`          | —       | Optional native div ID.                                      |

Any other standard div attributes, including `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<div>` element.

#### FormGroup Accessibility

FormGroup is a visual styling wrapper and does not create a semantic group or accessible name. Give each contained control a visible associated `<label>` or an appropriate ARIA label. Associate hints and validation messages with the control through `aria-describedby`. Use a native `<fieldset>` when related controls need a shared group name, and do not use FormGroup as a replacement for a fieldset.

### Hint Props

`Hint` wraps a native `<span>` with the `pathable-hint` class and forwards standard span attributes.

| Prop      | Type              | Default | Description                                                       |
| --------- | ----------------- | ------- | ----------------------------------------------------------------- |
| children  | `React.ReactNode` | —       | Supplemental guidance for completing the associated form control. |
| id        | `string`          | —       | Identifier referenced by the control through `aria-describedby`.  |
| className | `string`          | —       | Additional class names appended after `pathable-hint`.            |

Any other standard span attributes, including `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<span>` element.

#### Hint Accessibility

Keep guidance concise and specific. Give the Hint an `id` and connect it to the related control with `aria-describedby` when it describes that control. Use ErrorMessage for validation recovery guidance and do not use Hint as an announcement or general status message.

### Label Props

`Label` wraps a native `<label>` with the `pathable-label` class and forwards standard label attributes.

| Prop      | Type              | Default | Description                                                        |
| --------- | ----------------- | ------- | ------------------------------------------------------------------ |
| children  | `React.ReactNode` | —       | Visible text or inline content naming the associated form control. |
| htmlFor   | `string`          | —       | `id` of the associated form control.                               |
| className | `string`          | —       | Additional CSS class names appended after `pathable-label`.        |

Any other standard label attributes, including `id`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<label>` element.

#### Label Accessibility

Give each form control an accessible name with a visible `Label` and a matching `htmlFor`/`id` pair, or place the control inside the label. Use `aria-describedby` for supporting hints or validation messages rather than putting all instructions in the label.

### Textarea Props

`Textarea` wraps a native `<textarea>` with the `pathable-textarea` class and forwards standard textarea attributes.

| Prop         | Type                                    | Default | Description                                  |
| ------------ | --------------------------------------- | ------- | -------------------------------------------- |
| className    | `string`                                | —       | Additional CSS class names                   |
| rows         | `number`                                | —       | Visible number of text rows                  |
| cols         | `number`                                | —       | Visible number of character columns          |
| value        | `string \| number \| readonly string[]` | —       | Controlled field value                       |
| defaultValue | `string \| number \| readonly string[]` | —       | Initial uncontrolled field value             |
| disabled     | `boolean`                               | —       | Prevents interaction and form submission     |
| readOnly     | `boolean`                               | —       | Allows reading and selection without editing |

Any other standard textarea attributes, including `id`, `name`, `placeholder`, `required`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<textarea>` element.

#### Textarea Accessibility

Provide a visible associated `<label>` or an appropriate ARIA label. Use `aria-describedby` to associate hints or validation messages. Use `value` with `onChange` for controlled fields and `defaultValue` for uncontrolled fields.

### Skipnav Props

`Skipnav` wraps a native `<a>` with the `pathable-skipnav` class. It is intended for bypassing repeated navigation and moving keyboard users directly to the page's main content.

| Prop      | Type              | Default | Description                                                   |
| --------- | ----------------- | ------- | ------------------------------------------------------------- |
| children  | `React.ReactNode` | —       | Visible text describing the main content destination.         |
| href      | `string`          | —       | Fragment or URL for the main content target.                  |
| className | `string`          | —       | Additional CSS class names appended after `pathable-skipnav`. |

Any other standard anchor attributes, including `id`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<a>` element.

#### Skipnav Accessibility

Place Skipnav near the beginning of the page or application shell. Point `href` to a unique `id` on the page's main content landmark, for example `<main id="main-content">`. Provide meaningful link text and keep the target landmark present in the rendered page.

### Select Props

`Select` wraps a native `<select>` with the `pathable-select` class and forwards standard select attributes.

| Prop         | Type                                    | Default | Description                              |
| ------------ | --------------------------------------- | ------- | ---------------------------------------- |
| children     | `React.ReactNode`                       | —       | Native `<option>` elements               |
| className    | `string`                                | —       | Additional CSS class names               |
| multiple     | `boolean`                               | —       | Allows selecting multiple options        |
| size         | `number`                                | —       | Number of visible options                |
| value        | `string \| number \| readonly string[]` | —       | Controlled field value                   |
| defaultValue | `string \| number \| readonly string[]` | —       | Initial uncontrolled field value         |
| disabled     | `boolean`                               | —       | Prevents interaction and form submission |
| required     | `boolean`                               | —       | Enables native required-field validation |

Any other standard select attributes, including `id`, `name`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<select>` element.

#### Select Accessibility

Provide a visible associated `<label>` or an appropriate ARIA label. Use `aria-describedby` to associate hints or validation messages. For required fields, provide a prompt option with an empty value rather than treating instructional text as a valid selection.

### Fieldset Props

`Fieldset` wraps a native `<fieldset>` with the `pathable-fieldset` class and forwards standard fieldset attributes.

| Prop      | Type              | Default | Description                                                     |
| --------- | ----------------- | ------- | --------------------------------------------------------------- |
| children  | `React.ReactNode` | —       | Related form controls with a meaningful first-child `<legend>`. |
| className | `string`          | —       | Additional class names appended after `pathable-fieldset`.      |
| disabled  | `boolean`         | —       | Disables descendant form controls through native behavior.      |
| name      | `string`          | —       | Optional native fieldset name.                                  |

Any other standard fieldset attributes, including `id`, `form`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<fieldset>` element.

#### Fieldset Accessibility

Use a meaningful `<legend>` as the first child so assistive technology can identify the group. Use Fieldset for related controls, not as a generic layout container. Disabled Fieldset descendants follow native browser behavior.

### ErrorMessage Props

`ErrorMessage` wraps a native `<span>` with the `pathable-error-message` class and forwards standard span attributes. It does not automatically set `role="alert"` or manage validation state.

| Prop      | Type                               | Default  | Description                                                             |
| --------- | ---------------------------------- | -------- | ----------------------------------------------------------------------- |
| children  | `React.ReactNode`                  | required | Human-readable recovery guidance                                        |
| className | `string`                           | —        | Additional CSS class names appended after `pathable-error-message`      |
| id        | `string`                           | —        | Identifier referenced by the invalid control through `aria-describedby` |
| role      | `string`                           | —        | Optional consumer-selected role, such as `alert` or `status`            |
| aria-live | `'off' \| 'polite' \| 'assertive'` | —        | Optional live-region behavior selected by the consuming validation flow |

Any other standard span attributes, including `aria-*`, `data-*`, and event handlers, are forwarded to the underlying `<span>` element.

#### ErrorMessage Accessibility

Provide specific recovery guidance and associate the message with the invalid control through `aria-describedby`. Use `aria-invalid="true"` on the associated control when application validation identifies an error. Choose `role="alert"` or `aria-live` only when the validation flow should announce the message immediately.

### Radio Props

`Radio` renders a native `<input type="radio">` inside a PathAble label structure. It forwards native radio attributes while applying the PathAble input, label, and optional description classes.

| Prop           | Type              | Default  | Description                                           |
| -------------- | ----------------- | -------- | ----------------------------------------------------- |
| children       | `React.ReactNode` | required | Visible radio label and accessible name               |
| description    | `React.ReactNode` | —        | Optional supporting content rendered inside the label |
| className      | `string`          | —        | Additional classes appended to the root label         |
| checked        | `boolean`         | —        | Controlled selected state; use with `onChange`        |
| defaultChecked | `boolean`         | —        | Initial selected state for an uncontrolled radio      |
| disabled       | `boolean`         | —        | Prevents interaction and form submission              |
| required       | `boolean`         | —        | Enables native required-field validation              |
| name           | `string`          | —        | Native group name shared by mutually exclusive radios |
| value          | `string`          | —        | Native value submitted when selected                  |

Any other supported native input attributes, including `id`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying radio input. The wrapper does not manage selected state, validation, or submission.

The wrapper exposes the default radio contract only. The `pathable-radio--tile` modifier is not exposed because it is not implemented by the owning stylesheet contract. For related choices, compose Radio instances inside a native `<fieldset>` with a `<legend>` and give every option the same `name`.

#### Radio Accessibility

The required `children` content supplies the visible label through a native `<label>`. Use `aria-describedby` to associate external hints or validation messages, and use `aria-invalid` when application validation identifies an error. Native arrow-key navigation is preserved for radios that share a `name`.

### Checkbox Props

`Checkbox` renders a native `<input type="checkbox">` inside a PathAble label structure. It forwards native checkbox attributes while applying the PathAble input, label, and optional description classes.

| Prop           | Type              | Default  | Description                                           |
| -------------- | ----------------- | -------- | ----------------------------------------------------- |
| children       | `React.ReactNode` | required | Visible checkbox label and accessible name            |
| description    | `React.ReactNode` | —        | Optional supporting content rendered inside the label |
| className      | `string`          | —        | Additional classes appended to the root label         |
| checked        | `boolean`         | —        | Controlled checked state; use with `onChange`         |
| defaultChecked | `boolean`         | —        | Initial checked state for an uncontrolled checkbox    |
| disabled       | `boolean`         | —        | Prevents interaction and form submission              |
| required       | `boolean`         | —        | Enables native required-field validation              |
| name           | `string`          | —        | Native form field name                                |
| value          | `string`          | —        | Native value submitted when checked                   |

Any other supported native input attributes, including `id`, `aria-*`, `data-*`, and event handlers, are forwarded to the underlying checkbox input. The wrapper does not manage checked state, validation, or submission.

The wrapper exposes the default checkbox contract only. The `pathable-checkbox--tile` modifier is not exposed because it is not implemented by the owning stylesheet contract. For related choices, compose Checkbox instances inside a native `<fieldset>` with a `<legend>`.

#### Checkbox Accessibility

The required `children` content supplies the visible label through a native `<label>`. Use `aria-describedby` to associate external hints or validation messages, and use `aria-invalid` when application validation identifies an error. Use a radio group instead when choices are mutually exclusive.

### Communication Components

| Component     | Description                                                                                                                         | Props                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Accordion     | Expandable disclosure panels with single or multiple selection. Supports controlled/uncontrolled expanded state and disabled items. | `items`, `expandedIds`, `defaultExpandedIds`, `allowMultiple`, `onExpandedChange`                |
| Alert         | Status messages with info, success, warning, error, and emergency severity levels. Optional slim variant.                           | `status`, `slim`, `heading`, `children`, `role`                                                  |
| Banner        | Official site banner with disclosure toggle. Controlled/uncontrolled expanded state.                                                | `summary`, `children`, `expanded`, `defaultExpanded`, `onExpandedChange`                         |
| Modal         | Dialog rendered via portal with focus trapping, Escape close, scroll locking, and focus restoration.                                | `open`, `onClose`, `title`, `description`, `children`, `footer`, `closeLabel`, `initialFocusRef` |
| Loading       | Inline CSS-only loading indicator with optional status text and a large page-level treatment.                                       | `size`, `text`, `role`, `aria-live`                                                              |
| ProcessList   | Ordered list of process steps with headings and body content.                                                                       | `items` (array of `{id, heading, body}`)                                                         |
| SiteAlert     | Site-wide notifications. Supports default, info, and emergency statuses. Optional slim variant.                                     | `status`, `slim`, `heading`, `children`, `role`                                                  |
| StepIndicator | Multi-step progress indicator with derived completed/current states. One-based current step validation.                             | `steps`, `currentStep`, `heading`                                                                |
| SummaryBox    | Key information callout box with optional heading.                                                                                  | `heading`, `children`                                                                            |

## Development

```bash
# Build the package
pnpm build

# Start the standalone React Storybook (port 6007)
pnpm --filter @pathable/storybook-react storybook

# Start the main Storybook (port 6006) with React composition
pnpm --filter @pathable/storybook storybook
```

## Peer Dependencies

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

## License

Proprietary — PathAble

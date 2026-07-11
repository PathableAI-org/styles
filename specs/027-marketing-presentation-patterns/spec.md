# Feature Specification: Expressive Marketing and Product-Presentation Patterns

**Feature Branch**: `027-marketing-presentation-patterns`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "create a feature to address issue #36"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Staff Creates a Polished Public-Facing Marketing Page (Priority: P1)

A marketing or communications staff member can assemble attractive public-facing landing pages using expressive decorative backgrounds, gradient regions, subtle textures, and branded color treatments — without writing custom CSS that would be difficult to maintain or audit.

**Why this priority**: Decorative backgrounds and brand treatments are foundational for all marketing pages. Without these, every page requires custom, ungoverned decorative CSS.

**Independent Test**: Can be fully tested by applying each decorative variant (gradient, radial glow, texture, organic shape) to a page region and verifying they render correctly, do not reduce text contrast, and are excluded from the accessibility tree.

**Acceptance Scenarios**:

1. **Given** a marketing page section, **When** a gradient background pattern is applied, **Then** the section displays a gradient using semantic PathAble color variables with no raw brand color values embedded.
2. **Given** a marketing page section, **When** a radial glow is applied, **Then** the glow is layered behind content without reducing text or control contrast.
3. **Given** a decorative background, **When** assistive technology reads the page, **Then** the decorative element is excluded from the accessibility tree.
4. **Given** a page with decorative motion, **When** the user has `prefers-reduced-motion` enabled, **Then** the motion is suppressed.

---

### User Story 2 - Staff Presents Product Screenshots in Context (Priority: P1)

A staff member can display product screenshots inside intentionally framed containers — browser frame, phone frame, or dashboard frame — that elevate the image without embedding device-specific assumptions into ordinary content images.

**Why this priority**: Screenshot presentations are the most common visual element on product marketing pages. Frames provide visual polish while maintaining image accessibility and responsiveness.

**Independent Test**: Can be fully tested by rendering each frame variant with a placeholder image and verifying the frame renders correctly, the image maintains its intrinsic aspect ratio, captions are displayed, and interactive triggers have keyboard-visible focus.

**Acceptance Scenarios**:

1. **Given** a product screenshot, **When** displayed in a browser frame, **Then** it shows a browser chrome treatment with a caption below preserving the image's intrinsic aspect ratio.
2. **Given** a product screenshot, **When** displayed in a phone frame, **Then** it shows a phone device bezel treatment with a caption below.
3. **Given** a screenshot frame with a caption, **When** the page is rendered, **Then** the caption is visible and associated with the image.
4. **Given** a screenshot with hover enlargement, **When** the user has `prefers-reduced-motion` enabled, **Then** hover lift or enlargement is disabled or simplified.
5. **Given** an interactive screenshot trigger (lightbox preview), **When** focused via keyboard, **Then** it displays a visible focus indicator.

---

### User Story 3 - Staff Creates a Bento Collection Grid (Priority: P2)

A marketing staff member can lay out product features, metrics, or content in a bento-style grid with one featured tile and several supporting tiles, while retaining logical reading and keyboard order.

**Why this priority**: Bento grids are a distinctive modern layout for product pages. Visual tile spans must not alter semantic or tab order.

**Independent Test**: Can be fully tested by rendering a bento grid with featured, standard, metric, and image tiles and verifying that visual spans do not change the DOM tab order and the layout collapses predictably on narrow screens.

**Acceptance Scenarios**:

1. **Given** a bento grid, **When** it includes a featured tile and multiple supporting tiles, **Then** the visual spans render correctly without changing the semantic or tab order.
2. **Given** a bento grid on a narrow screen, **When** the viewport shrinks, **Then** tiles collapse into a single-column layout predictably without overlapping.
3. **Given** a bento grid with a metric tile, **When** the tile displays a number and label, **Then** the metric is readable and visually distinct from other tile types.

---

### User Story 4 - Staff Creates an Accessible Chip Rail (Priority: P2)

A marketing staff member can display a horizontal row of category or tag chips that scrolls or wraps naturally, with optional animated marquee motion that respects accessibility preferences.

**Why this priority**: Chip rails are a common pattern for displaying topic categories or feature tags. The default must be a static, accessible presentation with animation as an opt-in enhancement.

**Independent Test**: Can be fully tested by rendering a chip rail with multiple chip items and verifying the static overflow version renders by default, marquee motion pauses on hover/focus, and marquee is disabled under reduced-motion.

**Acceptance Scenarios**:

1. **Given** a chip rail, **When** rendered without animation classes, **Then** chips display in a horizontal row that overflows or wraps naturally with no motion.
2. **Given** a marquee chip rail, **When** the user hovers or focuses on the rail, **Then** the animation pauses.
3. **Given** a marquee chip rail, **When** the user has `prefers-reduced-motion` enabled, **Then** the marquee stops and displays as a static overflow.
4. **Given** a marquee chip rail with duplicated content, **When** assistive technology reads the page, **Then** duplicated decorative content is hidden from the accessibility tree.

---

### User Story 5 - Staff Highlights Key Text in Branded Treatments (Priority: P3)

A marketing staff member can apply branded text highlight treatments — marker-style, underline, and soft-background — that remain readable when text wraps across lines and work in inverse and forced-colors contexts.

**Why this priority**: Text highlights add visual emphasis to key marketing copy. They are lower priority than layout and background patterns but essential for complete page polish.

**Independent Test**: Can be fully tested by applying each highlight variant to multi-line text and verifying readability on wrap, and testing in forced-colors mode.

**Acceptance Scenarios**:

1. **Given** a paragraph with a marker highlight applied, **When** the text wraps across multiple lines, **Then** the highlight remains readable on each wrapped line segment.
2. **Given** highlighted text, **When** the page is rendered in forced-colors mode, **Then** the highlight pattern provides a documented fallback or renders as expected.
3. **Given** underline and soft-background highlight variants, **When** applied to inline text, **Then** each variant is visually distinct from the others.

---

### Edge Cases

- What happens when multiple decorative elements overlap? The layering must preserve content contrast and readability.
- How do screenshots behave when the image fails to load? The frame should display a placeholder or maintain its structural dimensions.
- What happens when a bento grid has fewer tiles than expected? Empty or missing tiles should not break the layout structure.
- How does a chip rail behave with very few chips? The rail should not overflow or appear broken — chips display inline naturally.
- What happens when text highlight is applied to very small or very large text? The highlight should scale proportionally and remain readable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide decorative background recipes including at least a quiet gradient, radial glow, subtle texture, and optional organic shape.
- **FR-002**: Decorative background layers MUST use semantic PathAble color variables and MUST NOT embed raw brand color values.
- **FR-003**: Decorative elements MUST be removed from the accessibility tree in all examples so assistive technology does not announce them.
- **FR-004**: Default opacity and placement of decorative elements MUST NOT reduce contrast of text or interactive controls.
- **FR-005**: Any decorative motion MUST be optional and disabled when `prefers-reduced-motion: reduce` is active.
- **FR-006**: Screenshot presentation MUST support plain elevated, browser-frame, phone-frame, and dashboard-frame variants.
- **FR-007**: Screenshot frames MUST preserve the intrinsic aspect ratio of the contained image and support an optional caption.
- **FR-008**: Interactive screenshot or lightbox triggers MUST receive keyboard-visible focus.
- **FR-009**: Hover enlargement or lift on screenshot frames MUST be disabled or simplified under `prefers-reduced-motion: reduce`.
- **FR-010**: Bento grids MUST support featured, standard, metric, and image tile variants.
- **FR-011**: Visual tile spans in bento grids MUST NOT change the semantic DOM order or keyboard tab order.
- **FR-012**: Bento layouts MUST collapse predictably into a single column on narrow screens.
- **FR-013**: Chip rails MUST have a static overflow or wrapping version as the default (no animation).
- **FR-014**: Optional marquee animation on chip rails MUST pause on hover and focus, and MUST stop under `prefers-reduced-motion: reduce`.
- **FR-015**: Duplicated decorative content in marquee chip rails MUST be hidden from assistive technology.
- **FR-016**: Highlight treatments MUST include marker, underline, and soft-background variants.
- **FR-017**: Highlighted text MUST remain readable when it wraps across multiple lines (no single-line background assumptions).
- **FR-018**: All decorative patterns MUST work in inverse and forced-colors contexts or provide a documented fallback.
- **FR-019**: Storybook MUST include combined examples demonstrating restraint and layering limits.
- **FR-020**: Selective imports and all-in-one imports MUST compile successfully.

### Key Entities *(include if feature involves data)*

- **Decorative Background**: A visual background treatment such as a gradient, radial glow, texture, or organic shape applied to a page section. May include optional motion via a separate variant.
- **Screenshot Frame**: A visual container for product images that provides device-context appearance. Supports caption, optional lightbox trigger, and variants (plain, browser, phone, dashboard).
- **Bento Tile**: A grid cell within a collection grid with types: featured (larger visual footprint), standard (equal footprint), metric (number with label), image (media emphasis).
- **Chip Rail**: A horizontal row of chip-style items (categories, tags). Default presentation is static overflow; a marquee variant provides optional auto-scrolling.
- **Text Highlight**: An inline text treatment applied to selected words or phrases. Variants: marker (solid highlight), underline (accent underline), soft-background (subtle fill).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All five decorative background variants render correctly without reducing text contrast when tested with automated color-contrast verification.
- **SC-002**: All four screenshot frame variants display correctly with placeholder images, maintaining intrinsic aspect ratio.
- **SC-003**: Bento grids with 3-6 tiles of mixed types collapse correctly on a 320px viewport without horizontal overflow.
- **SC-004**: Marquee chip-rail animation pauses within 100ms of hover or focus and is fully disabled under `prefers-reduced-motion: reduce`.
- **SC-005**: Text highlight treatments remain readable when applied to text that wraps across 3+ lines, verified by visual inspection.
- **SC-006**: All 20 acceptance criteria can be demonstrated through Storybook stories.
- **SC-007**: New styles can be imported individually or as a combined set; both approaches work correctly and introduce only the expected visual classes.
- **SC-008**: All decorative patterns render without errors when tested with forced-colors mode active.

## Assumptions

- Consumers will apply decorative backgrounds to containers that already have sufficient padding for content.
- Screenshot images will be provided by the consuming application; the frame does not generate or host images.
- Bento grid markup will follow the documented DOM order for accessibility; CSS grid placement handles visual spans.
- Chip-rail marquee content duplication is the consumer's responsibility; the presentation layer provides a mechanism for hiding duplicated decorative content from assistive technology.
- The existing USWDS design-token system provides adequate color, spacing, and typography primitives for all patterns.
- Mobile support includes viewports as narrow as 320px.
- Consumers may choose to use any subset of these patterns; each must compile independently.
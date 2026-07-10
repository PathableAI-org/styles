# Quickstart: Compositional Layout Primitives and Semantic Surfaces

## Getting Started

All primitives are included in `@pathable/styles`. If you already import the full stylesheet, they are already available.

### 1. Import

**Option A: Compiled CSS (recommended for most consumers)**

```css
/* Already includes everything */
@import '@pathable/styles/dist/styles.css';
```

**Option B: Selective SCSS imports (advanced consumers)**

```scss
// Import only the primitives you need
@use '@pathable/styles/src/pathable-component-wrappers/pathable-container';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-stack';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-cluster';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-card-grid';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-surface';

// Or import the composition bundle
@use '@pathable/styles/src/pathable-component-wrappers/pathable-layout-composition';
```

### 2. Basic Usage

**Quick page layout**:

```html
<div class="pathable-container pathable-container--standard">
  <div class="pathable-stack pathable-stack--gap-lg">

    <!-- Header -->
    <header>
      <h1>Page Title</h1>
    </header>

    <!-- Card grid -->
    <div class="pathable-card-grid">
      <div class="pathable-surface pathable-surface--raised">Card 1</div>
      <div class="pathable-surface pathable-surface--raised">Card 2</div>
      <div class="pathable-surface pathable-surface--raised">Card 3</div>
    </div>

    <!-- Split content + sidebar -->
    <div class="pathable-sidebar-layout">
      <main>
        <div class="pathable-stack">
          <h2>Main Content</h2>
          <p>Primary content area...</p>
        </div>
      </main>
      <aside>
        <div class="pathable-sticky-panel pathable-surface pathable-surface--raised">
          <div class="pathable-stack">
            <h3>Sidebar</h3>
            <p>Sticky sidebar content</p>
          </div>
        </div>
      </aside>
    </div>

    <!-- Tag cluster -->
    <div class="pathable-cluster">
      <span class="pathable-tag">Tag 1</span>
      <span class="pathable-tag">Tag 2</span>
      <span class="pathable-tag">Tag 3</span>
    </div>

  </div>
</div>
```

### 3. Validation Checklist

Before shipping, verify:

- [ ] Container widths match expected values at each breakpoint
- [ ] Stack gap is consistent between all children
- [ ] Cluster wraps correctly when items overflow one row
- [ ] Split collapses below 1024px with preserved reading order
- [ ] Card grid shows correct column count at desktop (3), tablet (2), mobile (1)
- [ ] Sidebar layout stacks sidebar below content below 1024px
- [ ] Sticky panel sticks on tall viewports, becomes static below 600px height
- [ ] Each surface variant is visually distinct from adjacent variants
- [ ] Interactive surface shows hover, focus-visible, focus-within, active, and disabled states
- [ ] Nested surfaces (raised inside inset) remain distinguishable
- [ ] All primitives work at 200% browser zoom
- [ ] Forced-colors mode shows visible surface boundaries
- [ ] Reduced-motion removes non-essential transitions
- [ ] Selective SCSS import compiles without errors
- [ ] Full bundle import compiles without errors

### 4. Storybook Verification

Each primitive has a Storybook story:

1. Open `apps/storybook` → `Layout Composition` section
2. Verify each story renders correctly at desktop (1024px+) and mobile (<480px)
3. Verify `Nested Composition` story shows all primitives working together
4. Run Playwright a11y tests against each story

### 5. Build and Bundle

```bash
# Verify everything compiles
cd packages/styles
pnpm build

# Verify all SCSS files parse correctly
sass --load-path=node_modules/@uswds/uswds/packages src/index.scss /dev/null
```
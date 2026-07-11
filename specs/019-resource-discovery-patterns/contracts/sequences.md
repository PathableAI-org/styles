# Sequence Contracts: Resource Discovery Patterns

**Created**: 2026-07-11

## Resource Card: Interaction Sequence

```
User                Resource Card                     Screen Reader
 |                       |                                 |
 |--- hover over card ---|                                 |
 |                       |--- apply emphasis elevation ----|
 |                       |   (box-shadow increase)         |
 |<-- visible feedback --|                                 |
 |                                                         |
 |--- tab to card link --|                                 |
 |                       |--- focus-visible ring appears --|
 |<-- visible focus -----|                                 |
 |                                                         |
 |--- tab to secondary --|                                 |
 |     action            |--- independent focus ring  -----|
 |                       |   appears on action button      |
 |<-- visible focus -----|                                 |--- announces
 |                       |                                 |    "Save resource,
 |                       |                                 |     button"
```

## Filter Bar: Filter Application Sequence

```
User                    Filter Bar                        Resource Grid
 |                         |                                  |
 |--- select facet --------|                                  |
 |                         |--- pill appears in filters ------|
 |                         |   region                         |
 |                         |--- result count updates ---------|
 |                         |   (aria-live="polite" triggers   |
 |                         |    announcement)                 |
 |<-- pill + new count ----|<-- grid updates with filtered ---|
 |                         |    results                       |
 |                                                             |
 |--- click pill dismiss --|                                  |
 |                         |--- pill removed                  |
 |                         |--- result count re-calculated ---|
 |                         |--- announcement triggers --------|
 |<-- pill gone + count ---|<-- grid reverts to unfiltered ---|
 |                         |    results                       |
```

## Wayfinder: Question Selection Sequence

```
User                    Wayfinder                         Result
 |                         |                                |
 |--- view panel ----------|                                |
 |                         |--- all controls unselected ----|
 |                         |   (no forced default)          |
 |<-- neutral state -------|                                |
 |                                                          |
 |--- select audience -----|                                |
 |                         |--- radio checked               |
 |--- select need ---------|                                |
 |                         |--- option selected             |
 |                                                          |
 |--- click "Show results" |                                |
 |                         |--- triggers consumer action ---|
 |                         |                                |--- resources
 |                         |                                |    displayed
```

## Wayfinder: Mobile Responsive Collapse

```
Wide Viewport (>1024px)           Narrow Viewport (<1024px)
┌─────────────────────────────┐   ┌─────────────────────┐
│ 🎯 What are you looking     │   │ 🎯 What are you     │
│    for?                     │   │    looking for?     │
│                             │   │                     │
│ Who are you  │ What do you  │   │ Who are you         │
│ helping?     │ need?        │   │ helping?            │
│ ○ Myself     │ ○ Training   │   │ ○ Myself            │
│ ○ My team    │ ○ Assessment │   │ ○ My team           │
│ ○ A client   │ ○ Support    │   │ ○ A client          │
│                             │   │                     │
│              [Show results] │   │ What do you need?   │
└─────────────────────────────┘   │ ○ Training          │
                                  │ ○ Assessment        │
                                  │ ○ Support           │
                                  │                     │
                                  │      [Show results] │
                                  └─────────────────────┘
```
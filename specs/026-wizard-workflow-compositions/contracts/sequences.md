# Flow Sequences: Structured Wizard and Guided Workflow Compositions

## Sequence 1: Wizard Navigation Flow (Desktop)

```
User                  Wizard                 Step Indicator        Action Footer
 │                       │                        │                    │
 │  Navigates to         │                        │                    │
 │  step 2               │                        │                    │
 │──────────────────────►│                        │                    │
 │                       │  Updates step to        │                    │
 │                       │  "current"              │                    │
 │                       │──────────────────────►  │                    │
 │                       │                        │  step 1 →          │
 │                       │                        │  "completed"       │
 │                       │  Shows validation       │                    │
 │                       │  (if errors exist)      │                    │
 │                       │  Hides previous step    │                    │
 │                       │  shows new step content │  ────────────────► │
 │                       │                        │                    │  Show "Back"
 │                       │                        │                    │  Show "Continue"
 │                       │  Renders new content    │                    │
 │◄──────────────────────┤────────────────────────┼────────────────────┤
```

## Sequence 2: Wizard Mobile Presentation

```
User                  Wizard (Mobile)
 │                       │
 │  Enters wizard        │
 │──────────────────────►│
 │                       │  Shows compact summary
 │                       │  "Step 2 of 4: Verify Identity"
 │                       │  (full step indicator hidden)
 │                       │
 │  Taps Continue        │
 │──────────────────────►│
 │                       │  Updates compact summary
 │                       │  "Step 3 of 4: Set Up Profile"
 │◄──────────────────────┤
```

## Sequence 3: Wizard Validation Error

```
User                  Wizard                 Validation Summary
 │                       │                        │
 │  Taps Continue        │                        │
 │  (errors on page)     │                        │
 │──────────────────────►│                        │
 │                       │  Detects form errors   │
 │                       │──────────────────────► │
 │                       │                        │  Shows error list
 │                       │                        │  Provides focus guidance
 │                       │◄───────────────────────│
 │                       │  Focus is moved to     │
 │                       │  validation summary or │
 │                       │  page heading          │
 │◄──────────────────────┤                        │
```

## Sequence 4: Workflow Panel State Transitions

```
User             Workflow Panel           Save Status          UI Rendering
 │                     │                      │                    │
 │ Opens record        │                      │                    │
 │────────────────────►│                      │                    │
 │                     │  State: loading      │                    │
 │                     │─────────────────────►│                    │
 │                     │                      │  Spinner/skeleton  │
 │                     │                      │───────────────────►│
 │                     │  Data loaded         │                    │
 │                     │  State: idle         │                    │
 │                     │─────────────────────►│                    │
 │                     │                      │  Status hidden     │
 │                     │                      │───────────────────►│
 │  Enters note        │                      │                    │
 │────────────────────►│                      │                    │
 │                     │  Autosave triggered   │                    │
 │                     │  State: saving       │                    │
 │                     │─────────────────────►│                    │
 │                     │                      │  "Saving..."       │
 │                     │                      │  + spinner icon    │
 │                     │                      │───────────────────►│
 │                     │  Save complete       │                    │
 │                     │  State: saved        │                    │
 │                     │─────────────────────►│                    │
 │                     │                      │  "Saved"           │
 │                     │                      │  + checkmark icon  │
 │                     │                      │───────────────────►│
 │                     │  (after 3 seconds)   │                    │
 │                     │  State: idle         │                    │
 │                     │─────────────────────►│                    │
 │                     │                      │  Status fades out  │
 │                     │                      │───────────────────►│
```

## Sequence 5: Workflow Panel Offline State

```
User             Workflow Panel           UI Rendering
 │                     │                      │
 │  Network lost       │                      │
 │────────────────────►│                      │
 │                     │  State: offline      │
 │                     │─────────────────────►│
 │                     │                      │  Shows offline
 │                     │                      │  banner + text
 │                     │                      │  ("You're offline.
 │                     │                      │   Changes will sync
 │                     │                      │   when connected.")
 │                     │                      │
 │  Network restored   │                      │
 │────────────────────►│                      │
 │                     │  State: saving       │
 │                     │─────────────────────►│
 │                     │                      │  Shows "Syncing..."
 │                     │                      │  + spinner
 │                     │  State: saved        │
 │                     │─────────────────────►│
 │                     │                      │  Shows "Saved"
 │                     │                      │  + checkmark
```

## Sequence 6: Workflow Panel Completion

```
User             Workflow Panel           UI Rendering
 │                     │                      │
 │  Taps Complete      │                      │
 │────────────────────►│                      │
 │                     │  Validate inputs      │
 │                     │  State: validation-   │
 │                     │  error (if invalid)   │
 │                     │─────────────────────►│
 │                     │                      │  Shows error count
 │                     │                      │  + error highlights
 │                     │  Submit valid form    │
 │                     │  State: completed     │
 │                     │─────────────────────►│
 │                     │                      │  Shows completion
 │                     │                      │  summary
 │                     │                      │  Hides input areas
 │                     │                      │  Shows "Completed"
 │                     │                      │  message with icon
```

## Mobile Layout Behavior

```
Desktop (1024px+)         Tablet (768-1023px)         Phone (<768px)
┌─────────────────┐      ┌──────────────────┐      ┌────────────┐
│ Step 1│Step 2│S3│      │ Step 1│Step 2│S3│      │ Step 2 of 4│
│━━━━━━│━━━━━━│───│      │ (compact label)  │      │ ────────── │
│                 │      │                  │      │ Verify     │
│  Page Heading   │      │  Page Heading    │      │ Identity   │
│                 │      │                  │      │            │
│ ┌─────────────┐ │      │ ┌──────────────┐ │      │ ┌────────┐ │
│ │ Form Content│ │      │ │ Form Content │ │      │ │ Form   │ │
│ │             │ │      │ │              │ │      │ │ Content│ │
│ └─────────────┘ │      │ └──────────────┘ │      │ └────────┘ │
│                 │      │                  │      │            │
│ [Save&Exit]     │      │ [Save&Exit]     │      │ [Save&Exit]│
│ [Back][Continue]│      │ [Back][Continue]│      │ [Back]     │
│                 │      │                  │      │ [Continue] │
└─────────────────┘      └──────────────────┘      └────────────┘
```

On phones, the action footer condenses to a 2-column layout. Back is left-aligned, Continue/Submit is right-aligned and full-height to maintain touch-target size.
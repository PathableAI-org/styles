## Extension Hooks

**Automatic Pre-Hook**: git
Executing: `/speckit-git-commit`

## Outline

1.  **Setup**: Run the `.specify/scripts/bash/setup-plan.sh --json` command from the repo root and parse the output for `FEATURE_SPEC`, `IMPL_PLAN`, `SPECS_DIR`, and `BRANCH`.
    - The command has been executed and the following artifacts were identified:
        - `FEATURE_SPEC`: `/Users/jake/Documents/GitHub/styles/specs/029-react-card-wrapper/spec.md`
        - `IMPL_PLAN`: `/Users/jake/Documents/GitHub/styles/specs/029-react-card-wrapper/plan.md`
        - `SPECS_DIR`: `/Users/jake/Documents/GitHub/styles/specs/029-react-card-wrapper`
        - `BRANCH`: (empty)
    - The script `setup-plan.sh` was executed successfully.

2.  **Load context**:
    - Read feature specification: `/Users/jake/Documents/GitHub/styles/specs/029-react-card-wrapper/spec.md`
    - Read constitution: `/Users/jake/.config//.cursor/global_config/constitution.md` (This path is an assumption. If it fails, we'll need to find the correct path for the constitution.)
    - The `plan.md` template (which is `/Users/jake/Documents/GitHub/styles/specs/029-react-card-wrapper/plan.md`) has been copied.

3.  **Execute plan workflow**:
    - **Phase 0: Research**:
        - Construct research tasks based on unknowns and dependencies identified in the feature specification.
        - Generate `research.md` by resolving these tasks.
        - Findings:
            - **Decision**: Adherence to `@pathable/styles` Contract.
            - **Decision**: React Naming Parity.
            - **Decision**: Transitive Styling Inclusion.
            - **Unknown**: Exact list of documented card presentations in `packages/styles`.
            - **Clarification Needed**: Definitive list of supported card presentations and their corresponding class names/modifiers.
            - **Dependency**: `@pathable/styles` Card Contract.
            - **Best Practices**: Validate `Card` component against styles contract.
            - **Task**: Verify transitive dependencies via `pnpm pack --dry-run`.
            - **Validation**: Check for `Card` export and transitive styling assets.
        - **Output**: `research.md` created.
    - **Phase 1: Design & Contracts**:
        - Extract entities from feature specification for `data-model.md`.
            - **Entities**: `Card`, `CardRegion`, `CardPresentation`.
        - Define interface contracts for `/contracts/`.
            - **Contract**: `props.md` detailing `Card` component props, including type, optionality, description, and mapping to `@pathable/styles`.
        - Create `quickstart.md` for validation scenarios.
            - **Content**: Installation, basic card usage, card with footer, media card, workflow card examples, and style import instructions.
        - Update agent context: The plan reference in `AGENTS.md` needs to be updated to point to `/Users/jake/Documents/GitHub/styles/specs/029-react-card-wrapper/plan.md`.
            - **Note**: The `AGENTS.md` file needs to be read and modified.
    - **Phase 2**: The planning phase (Phase 0 and 1) is complete.

## Plan Execution Summary

The following artifacts have been generated:
-   `research.md`
-   `data-model.md`
-   `specs/029-react-card-wrapper/contracts/props.md`
-   `quickstart.md`

The `plan.md` file has been updated with the generated content.

## Mandatory Post-Execution Hooks

No hooks are defined under `hooks.after_plan` in `.specify/extensions.yml`.

## Completion Report

The planning phase for the React Card Wrapper feature is complete. The generated artifacts provide detailed research, data modeling, contracts, and a quickstart guide. The implementation plan is documented in `plan.md`.

**Generated Artifacts**:
-   `specs/029-react-card-wrapper/research.md`
-   `specs/029-react-card-wrapper/data-model.md`
-   `specs/029-react-card-wrapper/contracts/props.md`
-   `specs/029-react-card-wrapper/quickstart.md`
-   `specs/029-react-card-wrapper/plan.md` (updated based on generated artifacts)

**Next Steps**: Proceed with implementation based on the generated plan.

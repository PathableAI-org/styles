# PathAble design system

The PathAble design system: a branded CSS package built on USWDS, the human
documentation that describes it and the agent guidance that ships with it.
This glossary fixes what its terms mean so that people, agents and documents
use one word for one concept.

## Deliverables and documentation

**Deliverable**:
One of the three products of the current refactor: human product
documentation, compiled CSS and consumer agent guidance.
_Avoid_: Output, product (for these three)

**Human product documentation**:
The published styles Storybook that people read to understand and copy the
design system.
_Avoid_: Website, docs, installed documentation

**Consumer agent guidance**:
Auditable Markdown, shipped in an installed package, that agents use when
building with that package version. Say styles or React consumer agent
guidance when the package is not clear from context.
_Avoid_: Agent-facing docs, agent docs, consumer guidance

**Contributor agent guidance**:
Repository-local instructions, engineering documents, skills and role files
that agents use to change this repository.
_Avoid_: Agent-facing docs, agent docs

**Shared sources**:
The component pages, the fixtures and the styles source from which every
deliverable is produced.
_Avoid_: Owning sources, source of truth

**Component page**:
The product specification of one component, token family, utility family or
settings group: its purpose, variants, composition, guarantees and what the
consumer owns.
_Avoid_: Component spec, source page

**Fixture**:
The canonical HTML for one example of a component, which consumers copy and the
checks and documentation are built from.
_Avoid_: Canonical snippet, example HTML, copyable HTML

**Example**:
One named rendering of a component that a single fixture shows, such as a
card's flag layout, a card list or a card inside prose.
_Avoid_: State, fixture state

**Variant**:
One value of a variant axis declared on a component page, such as the flag
value of a card's layout axis. A non-default variant is selected by its
variant class. Light, dark and high-contrast versions are themes, not
variants.
_Avoid_: Modifier, modifier class, modifier variant

**Interaction state**:
A condition a user puts a component into, such as hover, focus or disabled.
_Avoid_: State (alone)

**Guarantee**:
A testable claim a component page makes about its component, stated as met.
Guarantees are part of the contract.

**Contract**:
What a released package promises consumers they can rely on: its component
classes and their markup, tokens, utilities, assets, the component pages'
guarantees and its consumer agent guidance. Qualify it by deliverable when
needed: styles contract, guidance contract, React contract. Checks named after
the contract verify it; they are not a second meaning.
_Avoid_: Public contract, consumer contract, supported contract, compiled-CSS
contract, package contract, public API

**Target contract**:
The contract the component pages and fixtures describe, which the compiled CSS
must meet. While they differ, the CSS is the defect.
_Avoid_: Target state (for the contract itself)

## Package scope

**Static component**:
A component whose defining behaviour needs no design-system JavaScript.
Native HTML controls count as static.
_Avoid_: JS-free component

**Catalog**:
The exact set of static components the styles package supports.
_Avoid_: Supported contract, component list

**Component class**:
The class consumers put in markup for a catalog component, with its element
and modifier classes, such as `pathable-card`. "Wrapper" describes only the
package's relationship to USWDS, never a class.
_Avoid_: Component wrapper, wrapper class

**Breakpoint prefix**:
The part of a utility class name that applies it only from a viewport width
upward, such as `tablet:`.
_Avoid_: Responsive variant

**State prefix**:
The part of a utility class name that applies it only in an interaction state,
such as `hover:`.
_Avoid_: State variant

**React adapter**:
A React component that renders a styles component class, so it adds no visual
behaviour of its own.
_Avoid_: React wrapper

**Token**:
A named USWDS design value, such as a colour, spacing step or type size, as
this package configures it, documented on a token page and reachable through
the compiled CSS. Tokens are part of the styles contract.
_Avoid_: Design token (for anything else), semantic token, color token

**Runtime custom property**:
A CSS custom property the compiled CSS declares for its own rules to read. It
is internal and not part of the styles contract; no component page names one.
_Avoid_: Semantic token, color token, public token, token

**Theme colour**:
A key of the React package's theme that maps to one runtime custom property
and that React consumers may override. It is part of the React contract, not
the styles contract.
_Avoid_: Public color token, color token

**USWDS deviation**:
A local departure from USWDS, allowed only for an approved PathAble brand
choice that USWDS settings cannot express or for a demonstrated accessibility
defect.
_Avoid_: Fix, override

**Source-first**:
The ordering rule that new visual behaviour lands in the styles package before
any React adapter or guidance describes it.

**Retained but deferred**:
Kept in the repository for compatibility but not a refactor target unless a
delivery explicitly puts it in scope. Applies to the React package, the React
Storybook and its consumer guidance.
_Avoid_: Legacy, deprecated

## Audiences

**Consumer**:
An application that installs a released PathAble package, and the people and
agents building it.
_Avoid_: Consuming project, consuming repository, client

**Contributor**:
A person or agent changing this repository.

**Maintainer**:
The human with authority over this repository: sets and alone lowers risk
tiers, accepts outcomes, answers escalations, reviews guardrail changes, and
approves and merges pull requests.
_Avoid_: Person, human reviewer, reviewer (for this role)

## Planning and delivery

**Milestone**:
An informal grouping of specs toward a future release, kept by a person to
order work. Agents do not act on it unless asked.

**Spec**:
A GitHub issue stating one outcome, its scope, contract impact and risk tier.
A spec that fits one pull request is itself the delivery issue; a larger one
is split into child issues.
_Avoid_: Specification stack, plan

**Child issue**:
A sub-issue of a spec that delivers exactly one pull request, ordered against
its siblings by native blocking links.
_Avoid_: Ticket, slice

**Delivery issue**:
The issue one lead session runs to a single pull request: a child issue, or a
spec with no children.
_Avoid_: Task

**Outcome**:
What a consumer can do once the work is released.

**Contract impact**:
Which published contracts a change touches, in source-first order, each marked
additive, visible change, or removal or rename.
_Avoid_: Contract change

**Risk tier**:
The classification, High, Standard or Light, that sets how much evidence a
delivery needs and whether a maintainer must accept its outcome first.
_Avoid_: Process weight, risk level

**Seam**:
A specific place where one delivery's outcome can be observed, such as one
fixture, one story or the packed package, agreed with a person for that
delivery.
_Avoid_: Test point, check (for the place itself)

**Evidence channel**:
One of a fixed set of kinds of observation through which a seam or claim is
observed, such as Storybook tests, visual capture or fixture checks. Each seam
is observed through exactly one channel.
_Avoid_: Seam (for the kind), verification method

**Claim**:
A numbered, observable assertion that High-tier work must establish before it
merges.

**Guardrail change**:
A change to the rules agents work under, which waits for a person at any risk
tier.

**Bug**:
A confirmed case where the package does not meet its contract or target
contract, filed as its own issue rather than fixed inside an unrelated
delivery.
_Avoid_: Defect (for a filed bug; a review finding is a finding)

**Drift**:
The slow decay of a design-system area away from what its owning document
promises, through many individually acceptable changes.

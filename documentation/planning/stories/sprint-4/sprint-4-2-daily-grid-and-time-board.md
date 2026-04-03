# Sprint 4.2: Daily grid and time-board experience

## Goal

Make time, effort, and daily progression visible through a dedicated daily-grid or time-board system so the product feels more like an active game board and less like a set of disconnected cards.

## User Story

As a HeroHour user, I want to see my day represented as a visual grid or time board so that I can quickly understand how I spent time, what I completed, and what still needs attention.

## Description

HeroHour’s current product identity strongly suggests a time-aware experience:

- realm activity
- quests
- recovery
- daily progress
- world-state evolution

But the present dashboard experience is still mostly list- and card-driven. Sprint 4 should add a more visual daily progression layer that turns a user’s day into something glanceable, rewarding, and strategically useful.

The daily grid or time board should:

- show the shape of the day
- connect activity to progression
- make consistency more visible
- support future focus-session and habit features

This is both an engagement feature and a product comprehension feature. It gives the app a stronger identity and reduces the cognitive cost of understanding daily behavior.

## Scope

In scope:

- Angular daily-grid/time-board component
- Flutter daily-grid/time-board component
- initial data contract for grid state
- mapping of existing activities and task states into visual daily progress
- entry/re-entry summary hooks

Out of scope:

- full long-term analytics dashboards
- advanced calendar integrations
- external device or third-party time trackers

## Tasks

- [ ] Define the Sprint 4 daily-grid data model and determine whether it is event-based, session-based, or hybrid.
- [ ] Decide the minimum time granularity for the first release.
- [ ] Design grid states for:
  - empty
  - planned
  - active
  - completed
  - recovery/rest
  - challenge-related
- [ ] Implement the daily-grid/time-board component in Angular.
- [ ] Implement the daily-grid/time-board component in Flutter.
- [ ] Map existing user actions such as activity logging and quest completion into the grid model.
- [ ] Add readable animation for cell fill, state update, or progress linkage.
- [ ] Add drill-in context for hover, tap, or focus.
- [ ] Add empty-state messaging for users with no entries yet.
- [ ] Add re-entry summary hooks so the board can support “what happened today?” messaging.
- [ ] Add tests for empty, partial, and active day rendering states.
- [ ] Document how future focus sessions and weekly challenge overlays should integrate.

## Product Behavior Guidance

The time board should not feel like a generic analytics heatmap. It should feel like HeroHour:

- a tactical daily board
- a living schedule surface
- a progression map tied to personal actions

Good first-release behavior may include:

- activity categories mapped to cell families
- completed quests shown as overlay marks or badges
- recovery or rest blocks visually differentiated from work blocks
- simple momentum indicators showing whether the day is balanced or one-dimensional

## Cross-Platform Guidance

Angular:

- prioritize clarity and quick scanning on desktop
- support responsive collapse for smaller widths
- allow hover/focus tooltips or expansion affordances

Flutter:

- prioritize touch interaction and fluid cell-state transitions
- allow a denser, more expressive mobile-friendly board
- support swiping or segmented time views if needed later

## Acceptance Criteria

- Angular includes a usable daily-grid/time-board component tied to meaningful user data or mapped events.
- Flutter includes a usable daily-grid/time-board component tied to meaningful user data or mapped events.
- The component supports empty, partial, and active day states in both frontends.
- Users can understand what the board represents without needing documentation.
- New activity or completion events can appear on the board with a short readable update animation.
- The component is usable on smaller mobile layouts and wider desktop layouts.
- The board structure is extensible to future focus-session and challenge overlays.

## Non-Functional Requirements

- Rendering must remain performant with a realistic number of daily cells or events.
- Motion must support reduced-motion alternatives.
- State meaning cannot rely on color alone.
- Screen-reader accessible summaries should exist for key board states.

## Exit Strategy

- Demo an empty-day state in Angular and Flutter.
- Demo a partially completed day with multiple activity types.
- Demo a new action flowing into the board.
- Confirm the component can evolve into future focus-session or challenge integrations.

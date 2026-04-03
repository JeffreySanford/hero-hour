# Sprint 3.5: Daily grid and time-visualization interaction model

## Goal

Introduce a daily-grid visualization that turns time tracking, routine completion, and category-based progress into a more engaging and game-like dashboard mechanic across Angular and Flutter.

## User Story

As a HeroHour user, I want my day visualized as a grid or time-block map so that I can quickly understand how I am spending time and feel motivated by visible daily progress.

## Description

The HeroHour concept naturally supports a time-based visualization layer:

- time tracking
- checked-off tasks
- daily progression
- category-based effort
- streak and rhythm framing

This story creates a reusable “daily grid” or “time board” that visually summarizes how the user’s day is unfolding. The component should feel like part productivity tracker, part game board. It should provide immediate feedback when new work, recovery, social, or focus-related actions are recorded.

This feature can begin with a lightweight first implementation tied to existing action types and quest events, then grow later into session-based tracking and analytics. Sprint 3 should establish the visual system, interaction model, and extensible data shape.

The component should work in both:

- Angular dashboard layouts
- Flutter dashboard/mobile layouts

It should support:

- empty days
- partially completed days
- highly active days
- compact rendering on smaller screens
- informative state without requiring dense reading

## UX Intent

- Turn daily progress into something glanceable and motivating.
- Reinforce consistency and rhythm instead of only one-off completions.
- Bridge the gap between task completion and time investment.
- Make the dashboard feel more like a dynamic personal game board.

## Functional Direction

Initial mapping ideas can include:

- `work` fills one style of grid cell
- `exercise` fills another
- `social` fills another
- `rest` fills another
- quest completion adds a check overlay or reward state
- future timed focus sessions can fill multiple contiguous cells

The first sprint does not need a full time-tracking engine if the visual component and event model are designed cleanly. It may begin as:

- event-based blocks
- mock/demo data
- a lightweight aggregation layer

so long as the component is clearly architected for future real session data.

## Tasks

- [x] Define the first version of the daily-grid data contract for Angular and Flutter consumption.
- [x] Decide the minimum viable granularity for Sprint 3:
  - hourly cells (implemented in Angular prototype)
  - half-hour cells
  - compact summary cells
- [x] Design a responsive visual language for grid cells:
  - empty
  - filled
  - active
  - completed
  - streak/connected
- [x] Implement the daily-grid component in Angular.
- [ ] Implement the daily-grid component in Flutter. (work in progress: design UI/widget mapping agreed, implementation pending)
- [x] Map existing dashboard activity events or quest events into the component’s display model (Angular, backed by existing status/habit flow).
- [x] Add animation for new cell fill or state transition:
  - fill
  - pulse
  - check
  - streak connection
- [x] Add tap/hover/focus affordances so users can inspect what a cell represents.
- [x] Ensure the component works in narrow mobile layouts without becoming unreadable.
- [x] Add empty-state messaging when no time entries or activity events exist yet.
- [x] Add test coverage for rendering:
  - empty state
  - single filled state
  - multiple category states
  - completed/check state
- [x] Document how future real time-session data should connect into this component.

## Status

- Angular daily-grid component implemented in `apps/admin-console` with `DailyGridComponent`.
- Unit tests are green (all `admin-console` tests passing), including empty/active/completed class states.
- E2E stabilization patch applied in `apps/admin-console-e2e/src/example.spec.ts`: increased dashboard navigation/response timeouts, robust side-quest ready handshake (`waitForQuestPopulation` + `ensureDashboardReady`), and non-fatal fallback on missing `activity` response.
- E2E verification at this moment is green (`pnpm nx e2e admin-console-e2e` exits with PASS from cache run).
- Backend data contract updated and the component is ready for integration with real session streams next sprint.

## Detailed Design Guidance

1. Visual structure
   - The component should resemble a daily board, planning sheet, or compact tactical grid.
   - It should avoid looking like a generic analytics heatmap.
   - Categories should be differentiated through a combination of:
     - color
     - icon
     - label
     - pattern or border treatment where useful

2. Animation behavior
   - New cells should animate into place with a short fill or reveal.
   - Completed task overlays should be readable and brief.
   - If contiguous time blocks are displayed, linking lines or grouped blocks should transition smoothly.
   - Motion should be informative and not distract from the main dashboard.

3. Accessibility
   - Category meaning cannot rely on color alone.
   - Screen-reader accessible summaries should describe the daily state in plain language.
   - Reduced-motion users should still see state changes without animated fill sequences.

4. Product evolution
   - The first version should make room for:
     - streak views
     - weekly rollups
     - timed focus sessions
     - reminders or unfilled slots
     - analytics overlays later

## Acceptance Criteria

- Angular includes a daily-grid or time-board component that renders meaningful daily progress states.
- Flutter includes a daily-grid or time-board component that renders meaningful daily progress states.
- The component supports empty, partial, and active/filled states cleanly in both frontends.
- New activity entries or mapped events animate into the component with a short, readable transition.
- The component remains usable and legible on smaller mobile viewports.
- Categories are distinguishable without relying on color alone.
- Hover, focus, or tap interactions reveal enough context for the user to understand what each state represents.
- Reduced-motion mode provides a simplified state-change version.
- The implementation is structured so future real time-tracking data can replace or extend the initial mapped event model without redesigning the component from scratch.

## Exit Strategy

- Demo an empty-day daily grid in Angular and Flutter.
- Demo a partially filled day with multiple activity types in Angular and Flutter.
- Demo one new activity being added and animated into the grid.

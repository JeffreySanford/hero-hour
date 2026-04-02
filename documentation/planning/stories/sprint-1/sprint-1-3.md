# Sprint 1.3 – Mode Switching (Casual / Pro)

## Goal

Implement UI mode switching between Casual and Pro in the admin console, with persistence and rendering-only behavior.

## Benefit Hypothesis

If users can toggle between Casual and Pro modes and retain preference, they can tailor the experience while keeping model data stable.

## Scope

- New Angular service for mode persistence
- UI toggle in app bar/dashboard
- Mode-aware presentation style only
- Unit + e2e tests for persistence and reload behavior

## Tasks

1. Add mode store service (`mode.service.ts`)
   - export `Mode = 'casual' | 'pro'`
   - `setMode(mode: Mode)` and `getMode(): Mode`
   - `localStorage` persistence key `hero-hour-mode`
   - `initialize()` reads from localStorage on app boot

2. Add mode toggle UI
   - add button/toggle in `app-bar` or `dashboard` component
   - show current mode label
   - on click: toggle mode value and persist via `ModeService`

3. Conditional presentation
   - create theme CSS classes for casual vs pro (colors, layouts, card styles)
   - apply root class or ngClass based on mode service value
   - data model and store stay unchanged

4. Unit tests
   - `mode.service.spec.ts`: persistence to localStorage,
     - initial default mode is `casual` (if missing)
     - saving mode and rehydrate should return same value

5. E2E tests (Playwright)
   - `admin-console-e2e/src/mode-switch.spec.ts`
   - flow:
     - login (existing setup)
     - set mode to `pro`
     - reload page
     - assert mode button/text is `pro`
     - set mode to `casual`, reload, assert `casual`

6. PI documentation updates
   - `documentation/planning/features/PI-1-Features.md`:
     - mark `Feature 1.4` acceptance criteria as done when implemented
     - add feature completion notes and references to sprint-1-3

## Acceptance Criteria

- mode selection persists across refresh and browser restart
- switching mode only changes presentation style (no data changes)
- mode service has unit tests and passes
- Playwright e2e test passes.

## Dependencies

- existing admin-console style and component layout
- existing auth/login e2e flow

## Output

- code changes in admin-console (service + UI + styles)
- new tests under admin-console and admin-console-e2e
- documentation update in PI-1 feature matrix

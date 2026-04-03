# Sprint 3.7: Prologue/Loading & World Seed Convergence

## Goal

Ship a consistent app-start onboarding/prologue UX and ensure world seed state changes are directly linked to completed actions and reflected in UI state immediately.

## User Story

As a HeroHour user, I want a premium startup prologue and confident world-state feedback so I can trust that each action (quest completion, activity log) meaningfully moves my world forward.

## Description

This story closes the gap between brand-first on-ramp experience and core progression engine feedback. It builds on the existing 3.6 prologue + 3.5 progression feature set.

- Angular app: refresh `AppLoadingComponent` + route `/splash` + `''` entry; `AuthService` determines login/dashboard.
- Flutter app: existing `PrologueScreen` flow + `HeroHourAppState` world ready, plus reduced-motion path.
- World seed: deterministic update from `logActivity` and side-quest completion.
- Test soundness: e2e tests ensure tasks actually lift `worldState.seed`, queue to `health` toggles, etc.

## Product Intent

- blend motion and utility: prologue feels meaningful not filler
- reduce “I still wait after load” in initial app-entry
- make world seed / realm growth direct result of user behavior
- confirm state is durable across navigation reloads

## Acceptance Criteria

- [ ] Angular and Flutter prologue flows exist and are runnable
- [ ] `splash` route transitions to login or dashboard in <4s with fallback manual continue
- [ ] reduced-motion path exists and disables long animation
- [ ] world seed state updates in UI whenever user completes a quest or logs activity
- [ ] world seed state is persisted and reloaded by core store and/or backend on subsequent sessions
- [x] end-to-end tests cover splash route, prologue stage completion, and world seed progression from a task
- [x] unit tests for `AppLoadingComponent` and `HeroHourAppState` around completion and timeout safeguards

## Test Coverage Additions

### Unit tests

- `apps/admin-console/src/app/app-loading.component.spec.ts`
  - test `ngOnInit` stage progression timing
  - test fallback timeout triggers `complete()` and redirects
  - test `skip()` calls `complete()`
- `apps/mobile_flutter/test/widget_test.dart`
  - ensure first-run prologue shows sequential stages and routes to login/dashboard
  - ensure reduced-motion mode short-circuits sequence
  - ensure long-init timeout fallback shown
- `apps/admin-console/src/app/dashboard/dashboard.component.spec.ts`
  - test `logActivity` updates `worldState.seed` and `progress`
  - test side quest completion updates `worldState.seed` and UI label

### E2E integration

- `apps/admin-console-e2e/src/example.spec.ts`
  - test `splash` route at `/splash` and `/` transitions to login/dashboard with explicit continue fallback
  - test completion of quick quest increments `span.progress-label` and `div.world-state .world-state__seed`
  - test activity button (`Exercise`) updates world seed and persisted state after reload
  - test reduced-motion simulator does not require full timed animation (faster check)

## Tasks

1. Validate 3.6 code path is wired into central app shell routes.
2. Add lightweight branded loader to UI and redirection logic.
3. Add world-state seed increment mapping in `QuestService/logActivity` and side-quest completion handlers.
4. Add e2e test scenario to assert world seed path changes on quest and activity.
5. Add debug mode story notes for QA: check sequential stage text during splash.

## Notes

- This is a cleanup plus continuity story for 3.7 (not a brand-new epic). It ensures the product edge case "why did I just see prologue but not state change?" is closed.
- If time allows, add instrumentation metric: `prologueComplete`, `worldSeedDelta`.
- CI quick check added in `package.json`: `ci:prologue-world-seed` runs `pnpm nx e2e admin-console-e2e -- --grep "world seed updates after activity" --project=chromium`.

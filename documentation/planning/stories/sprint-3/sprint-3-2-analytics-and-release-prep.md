# Sprint 3.2: Analytics hooks + release cadence

## Goal

Implement telemetry event hooks and release cadence gating with signoff checklist automation.

## Tasks

- [x] Add event emission in `apps/api` for:
  - `lifeProfileUpdated`
  - `questCompleted`
  - `focusSessionCompleted`
- [x] Add persistence for events in `domain` audit tables.
- [x] Add unit tests for event payload validation and edge-case fields.
- [x] Add e2e tests at `apps/admin-console-e2e` to assert events are emitted on:
  - onboarding complete
  - life profile save
  - challenge completion
- [x] Add `coverage` CI step with `pnpm exec nx e2e admin-console-e2e` and contract assertions.
- [x] Update `documentation/planning/epics/pi3.md` with release cadence checklist and signoff gating.

## Acceptance

- All new events appear in telemetry contract (`apps/api` + `analytics` schema).
- 90%+ telemetry data schema coverage in unit tests.
- E2E smoke verifies at least one event emitted per flow.
- PI3 release signoff checklist in docs and sprint closure is recorded.

# Sprint 3.1: Growth + Guidance foundation

## Goal

Deliver first iteration of progress growth, avatar guidance, and telemetry foundation with unit/e2e coverage.

## Tasks

- [x] Implement village expansion data model in `apps/api` and `domain`.
- [x] Add UI screens in `apps/admin-console` for growth map and tooltips.
- [x] Add `game-profile` service unit tests for growth state `initProfile` and `updateProfile`.
- [x] Add e2e journey in `apps/admin-console-e2e`:
  - start from login
  - visit dashboard -> growth map
  - trigger village update action
  - assert growth metrics and tile states
- [x] Add API contract tests for `GET /game-profile/:userId` and `POST /game-profile/:userId/quests` in `apps/api-e2e`.
- [x] Add migration docs and runbook in `documentation/planning/`.

## Acceptance

- Village expansion visible and stable across re-load.
- Growth service branches 100% unit-test coverage.
- E2E covers UI path with contract JSON shape verification.
- API contract tests validate required `progress` fields.

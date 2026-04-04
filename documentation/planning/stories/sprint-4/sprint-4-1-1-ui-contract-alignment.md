# Sprint 4.1.1: Frontend user flow alignment (Angular + Flutter)

## Goal

Fully align user-facing progression flows (quest and world-state updates) across Angular and Flutter using the hardened backend persistence contract from Sprint 4.1.

## User story

As a HeroHour user, I expect the same progress, world-state and quest completion behavior to appear in both my browser and mobile app so that I can confidently switch devices without losing progress or seeing divergent results.

## Description

This sub-story is focused solely on the user path for progression, not admin dashboard capabilities. The backend contract is already hardened in Sprint 4.1; here we establish the UI-client integration and test coverage footprint:

- Angular and Flutter should both use the same `api-interfaces` definitions for `GameProfile`, `WorldState`, `Quest`, `SideQuest`.
- Both should drive the same endpoint semantics for workout/quest updates.
- It is acceptable to re-use existing admin-friendly endpoints internally, but this story is user path only.

## In-scope

- Angular user path:
  - Quest completion action → `POST /api/game-profile/{userId}/quests/{questId}/complete` (or equivalent existing endpoint)
  - world state query: `GET /api/game-profile/{userId}/world-state`
  - ensure persisted post-complete world state surface reflected
- Flutter user path:
  - same endpoints as Angular (licit API flows)
  - the same user identity (`userId`) is used to verify state consistency after updates
- backend contract test for world-state update on quest completion

## Tasks

- [x] Implement backend endpoint for quest-complete world-state response:
  - `POST /game-profile/{userId}/quests/{questId}/complete`
  - Response: updated `Quest`, updated `WorldState`, updated `GameProfile` (as needed)
- [x] Add API-level contract test for that endpoint from `api-interfaces` or API tests.
- [x] Add Angular integration test:
  - endpoint-level service test or e2e verifies:
    - create quest
    - update quest complete
    - GET world-state returns updated seed/progress
- [x] Add Flutter integration test path (may be a mocked integration test or driver test):
  - same user, same flow, asserts backend truth match
- [x] Add user-level cross-device e2e test, same userId, confirm world state read by 2 clients.
- [x] Document expected state after quest complete in user API contract docs.
- [x] Confirm shared `api-interfaces` types are imported in both Angular and Flutter project models.

## Acceptance criteria

- Both Angular and Flutter can complete a quest and read back the updated world state from the same backend contract.
- `POST /game-profile/{userId}/quests/{questId}/complete` returns the updated world state object and ensures world state advancement.
- Backend path works under persisted data store and after API restart.
- Contract test assert API response schema includes world-state fields.

## Non-functional

- No UI styling: user path only.
- Operation must be deterministic and reproduces on local and CI.
- Use shared DTO types from `api-interfaces` declarations.

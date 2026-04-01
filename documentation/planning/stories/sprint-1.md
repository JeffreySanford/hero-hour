# Sprint 1: Life Profile Vertical Slice

## Goal

Deliver the first full integrated product flow from UI through API to in-memory persistence.

## Objectives

- Finish backend and frontend contract alignment for **life-profile**
- Ensure end-to-end test coverage around the flow
- Create stable launchpad for mobile Flutter conversion

## User stories

1. As a logged-in user, I can open the life-profile page and fill a profile form.
2. As a user, I can submit the life-profile form and receive a success acknowledgement.
3. As a user, I can view my stored life profile after submit.
4. As a developer, I can run automated e2e flow with mocked API health and real life-profile backend.

## Tasks

- [ ] Define shared DTOs for LifeProfile (company: `api-interfaces`, `shared-types`).
- [x] Implement Nest endpoint `POST /api/life-profile` and `GET /api/life-profile/:userid`.
- [x] Add in-memory repository or service `LifeProfileService` (create/update/fetch).
- [x] Wire Nest module/controller/service for life-profile.
- [x] Implement Angular `LifeProfileService` API client with actual API URL and error handling.
- [x] Build LiveProfileComponent form + validation for required fields and role enum.
- [x] Add life-profile page route as auth-guard-protected.
- [x] Add Dashboard health call integration for quick status check.
- [x] Add Playwright scenario:
  - go to login, login, open life-profile
  - submit profile (real backend call)
  - verify profile saved/re-fetched
- [x] Add Jest + Nest tests for controller/service/dto
- [x] Run `nx test api`, `nx test admin-console`, `nx e2e` and fix failures.

## Acceptance Criteria

- API endpoints for life-profile respond with valid payloads (201/200)
- Angular life-profile form succeeds and shows `Saved` message
- E2E path passes from login→life-profile submit→dashboard
- No lint errors on new code

## Dependencies

- `start:all` scripts functioning
- `api` and `admin-console` served in parallel
- shared types repo linkage

## Output

- PR created and merged with this sprint implementation
- new `documentation/planning/stories/sprint-1.md` tracked
- CI passes for tests and e2e

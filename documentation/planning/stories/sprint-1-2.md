# Sprint 1.2n: Life Profile Mobile Maturity

## Goal

Bring the Flutter mobile life-profile flow from prototype to verified vertical-slice readiness, with clear completion criteria and handoff-ready status.

## Description

Deliver a complete mobile path for life profile that includes form entry, backend submission, profile retrieval, state feedback and automated tests. This sprint extends the initial Sprint 1 work by fully closing the mobile track and adding operational runbooks for developer handoff.

## Tasks

- [x] Define the existing scope and goal alignment against Sprint 1.
- [x] Add Flutter `life-profile` flow to `apps/mobile_flutter/lib/main.dart`.
- [x] Implement API client integration (`POST /api/life-profile`, `GET /api/life-profile/:userId`).
- [x] Add life-profile validation UI for required fields and role select.
- [x] Add status UI for success/failure and profile refresh.
- [x] Add widget test: fill form, click save, assert success message.
- [ ] Add integration test path for full live backend (optional when API available).
- [ ] Add form-level error handling for offline / network timeouts.
- [ ] Document mobile run/play command in repo README or package.json scripts.

## Exit strategy

- All tasks marked as either complete or tracked in follow-up backlog.
- Unit/widget tests green in CI (`flutter test`).
- Smoke end-to-end flow with API available manually verified:
  - login (existing auth path simulated)
  - open life-profile screen
  - submit life-profile payload
  - verify server response is persisted and returned
- Sprint report and PR summary updated with test command outputs.

## Dependencies

- `apps/api` up and running for `/api/life-profile` endpoints.
- `apps/admin-console` auth route to mirror user identity (for future true auth integration).
- `flutter` toolchain installed with windows/android support.
- Nx workspace scripts in root `package.json` for parallel start.

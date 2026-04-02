# Sprint 2.3: Auth + Health contract end-to-end tests

## Goal

Add explicit contract tests for `POST /auth/login` and `GET /health`, as required by PI2.

## Description

Make contract guarantees observable through automated tests in API and e2e suites.

## Tasks

- [ ] Add unit tests in `api` for `POST /auth/login` response shape using shared types.
- [ ] Add unit tests in `api` for `GET /health` response shape using shared types.
- [ ] Add e2e assertions in `api-e2e` for both endpoints with payload validation and contract version metadata checks.
- [ ] Add E2E integration in `admin-console-e2e` to verify login + dashboard + health and life-profile contract flows in a single smoke scenario.
- [ ] Add JSON Schema contract test in `api-interfaces` to validate runtime responses.
- [ ] Add post-deploy contract checkpoint job (in CI script) that runs `api-e2e` health checks and contract schema assertions.
- [ ] Update `documentation/testing.md` with `auth/login`, `health`, and `life-profile` contract test requirements.

## Acceptance Criteria

- API tests fail if response differs from shared contract.
- e2e path includes contract validation for login/health, and the same contract types are reused by the front-end app.
- CI runs the tests, including modules: `api`, `admin-console`, `api-e2e`, `admin-console-e2e`.
- Additional assertion: `health` endpoint shape holds for at least three consecutive checks under nominal and degraded stubbed values.

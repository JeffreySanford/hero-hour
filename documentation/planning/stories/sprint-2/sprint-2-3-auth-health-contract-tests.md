# Sprint 2.3: Auth + Health contract end-to-end tests

## Goal

Add explicit contract tests for `POST /auth/login` and `GET /health`, as required by PI2.

## Description

Make contract guarantees observable through automated tests in API and e2e suites.

## Tasks

- [ ] Add unit tests in `api` for `POST /auth/login` response shape using shared types.
- [ ] Add unit tests in `api` for `GET /health` response shape using shared types.
- [ ] Add e2e assertions in `api-e2e` for both endpoints with payload verification.
- [ ] Add JSON Schema contract test in `api-interfaces` to validate runtime responses.
- [ ] Update `documentation/testing.md` with `auth/login` and `health` test requirements.

## Acceptance Criteria

- API tests fail if response differs from shared contract.
- e2e path includes contract validation for login/health.
- CI runs the tests.

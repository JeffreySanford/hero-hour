# Sprint 2.2: CI quality and coverage gates

## Goal

Harden CI for PI2 with contract regression checks and minimum coverage requirements.

## Description

Ensure the pipeline prevents regressions by applying strict contract tests and coverage thresholds.

## Tasks

- [ ] Add `test:ci:contract` job in root `package.json` / `ci` config.
- [ ] Write contract regression tests for shared interfaces (snapshot/JSON schema validations).
- [ ] Enforce 80% coverage threshold for `api` and `admin-console` tests.
- [ ] Add smoke check in CI for `nx test api --code-coverage` and `nx test admin-console --code-coverage`.
- [ ] Document expected CI behavior in `documentation/testing.md`.

## Acceptance Criteria

- CI fails with <80% coverage and passes with ≥80%.
- Contract regression tests are auto-run in CI and detect an injected mismatch.
- `rn lint`, `nx test`, `nx e2e` pipeline is updated and documented.

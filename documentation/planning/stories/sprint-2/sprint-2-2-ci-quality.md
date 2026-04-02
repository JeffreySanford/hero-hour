# Sprint 2.2: CI quality and coverage gates

## Goal

Harden CI for PI2 with contract regression checks and minimum coverage requirements.

## Description

Ensure the pipeline prevents regressions by applying strict contract tests and coverage thresholds.

## Tasks

- [x] Started sprint 2.2 CI quality tasks: drafted CI docs, updated workflow pipeline, and added teklif health gating.
- [x] Add `test:ci:contract` job in root `package.json` / `ci` config.
- [x] Write contract regression tests for shared interfaces (snapshot/JSON schema validations).
- [x] Enforce 80% coverage threshold for `api` and `admin-console` tests.
- [x] Add smoke check in CI for `nx test api --code-coverage` and `nx test admin-console --code-coverage`.
- [x] Add E2E gate step in CI for `admin-console-e2e` with contract assertions on `auth/login`, `health`, `life-profile`, and other key endpoints.
- [x] Document expected CI behavior in `documentation/testing.md`.
- [x] Add `apps/api` Nx target `teklif-ci-check` that runs `pnpm run docker:teklif:ci-check`.
- [x] Add API coverage tests to reach 80% threshold with additional life-profile service branches.

## CI docker-compose:teklif gating and fail-fast behavior

- [x] Ensure `docker-compose -f docker-compose.teklif.yml up --build --abort-on-container-exit` is invoked in CI pre-check.
- [x] Add health check script `scripts/ensure-docker-teklif.sh` to verify:
  - [x] Redis `hero-redis` reachable and healthy
  - [x] `hero-teklif` starts, responds to `/health`, and sets readiness key in Redis
- [x] If the health check fails, exit non-zero immediately and stop CI pipeline early (bazel-style fail-fast).
- [x] Document failure semantics: startup timeout 60s, fail fast if image build fails, service unhealthy, or readiness key absent.

## Acceptance Criteria

- CI fails with <80% coverage and passes with ≥80%.
- Contract regression tests are auto-run in CI and detect an injected mismatch.
- `nx lint`, `nx test`, `nx e2e` pipeline is updated and documented.
- E2E contract target runs in CI and covers `auth/login`, `health`, `life-profile` API shapes.
- CI includes `docker-compose:teklif` readiness check, and failure in startup or health check stops the pipeline fast.
- If any Docker check or contract assertion fails, CI marks as failed and halts further jobs (bazel-style fail-fast behavior).

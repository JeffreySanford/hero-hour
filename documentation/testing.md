# Testing Guide (PI1)

## Unit tests

- Backend (Nest): `pnpm nx test api`
  - Runs service/controller specs in `apps/api/src/app`.
  - Includes auth, life-profile, onboarding, etc.

- Frontend (Angular): `pnpm nx test admin-console`
  - Runs component/service tests in `apps/admin-console/src/app`.

- Flutter: `cd apps/mobile_flutter && flutter test`

## E2E tests

- Admin console e2e: `pnpm nx e2e admin-console-e2e`
- API integration tests: `pnpm nx e2e api-e2e` or `pnpm nx test api-e2e` depending on workspace config.
- Playwright: `pnpm exec playwright test --config=playwright.config.ts`.

## CI helper scripts

- `pnpm run test:ci:life-profile` (includes api, admin-console, admin-console-e2e)
- `pnpm run test:ci:flutter` (includes flutter unit + integration tests)
- `pnpm run docker:teklif:ci-check` (ensure Redis + hero-teklif are healthy and seeded before CI tests)
- `pnpm exec nx run api:teklif-ci-check` (Nx target wrapper for the same pre-check command)

## CI fail-fast and readiness expectations

1. `docker compose -f docker-compose.redis.yml -f docker-compose.teklif.yml up --build -d --wait hero-redis hero-teklif`
2. Health waits up to 60s for both services to become `healthy`.
3. Runs `pnpm run docker:ensure-teklif` for service status and readiness key seeding.
4. On misconfiguration, health failure, or timeout -> exit 1 immediately and stop the job (bazel-style fail-fast).

## Auth/Health/Life-profile contract validation

- `apps/api` unit tests cover `POST /auth/login` and `GET /health` their shared contract shapes from `@org/api-interfaces`.
- `apps/api-e2e` includes contract checks for `auth/login` and `health`, plus three consecutive health status checks.
- `apps/admin-console-e2e` verifies end-to-end login/dash/health/life-profile contract flows in a single smoke path.
- `api-interfaces` has Ajv runtime JSON schema checks for `LoginResponse` and `HealthResponse`.
- CI adds post-deploy contract checkpoint job in `.github/workflows/ci.yml` via `pnpm run ci:post-deploy-contract`.

## Quick dev loop

1. Start backend and frontend in parallel:
   - `pnpm run start:all`
2. Run a focused test slice:
   - `pnpm nx test api --files apps/api/src/app/auth/auth.service.spec.ts`
   - `pnpm nx test admin-console --files apps/admin-console/src/app/services/auth.service.spec.ts`
3. For contract sanity checks:
   - `pnpm nx test api && pnpm nx test admin-console && pnpm nx e2e api-e2e`

## Contract validation (covered for PI1)

- `LoginResponse` type in `api-interfaces` shared with both `apps/api` and `apps/admin-console`.
- `HealthResponse` type shared and returned by API health endpoint.
- Add future step (PI2): Strict contract tests using JSON Schema test runner.

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

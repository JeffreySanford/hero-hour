# Sprint 3 migrations runbook

## Objective

Add village progression and telemetry release-level hooks with safe rollout and rollback.

## Steps

1. Feature branch: add `VillageState`/`VillageStructure` model and API routes.
2. Add tests:
   - unit and integration in `apps/api`/`apps/api-e2e`
   - UI e2e in `apps/admin-console-e2e`
3. Review with QA run: execute `pnpm exec nx test api`, `pnpm exec nx test admin-console`, `pnpm exec nx test api-e2e`, `pnpm exec playwright test apps/admin-console-e2e/src/example.spec.ts`
4. Tag release candidate from main after all paths green.

## Rollout

- Start with canary on 10% traffic; verify no error spikes (auth, health, life-profile endpoints).
- Monitor `villageProgress` event counts and this service logs.

## Rollback

- Revert to previous image in deployment pipeline.
- Run smoke checks again and confirm onboarding and health flows work.

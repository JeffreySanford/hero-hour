# PI2 12-week Roadmap

## Program Increment 2 (12 weeks)

Goal: deliver stable onboarding, life profile, streak/reward loops, and jumpstart retention for core user missions.

### Week 1-2: Sprint 2.1

- Setup includes shared contract (`api-interfaces`) and baseline health/auth pipelines.
- Implement `life-profile` API, contract tests, and first admin-console UI.
- Baseline e2e contract and smoke paths (`auth/login`, `health`, `life-profile`).

### Week 3-4: Sprint 2.2

- Harden CI: docker-teklif readiness, coverage gates (80%), contract regression checks.
- Add `test:ci:contract` pipeline; e2e gating for key endpoints.
- Release notes template + signoff criteria added.

### Week 5-6: Sprint 2.3

- Onboarding workflow + reward/cadence model.
- Add stateful streaks, notifications, focus sessions.
- Expand e2e onboarding path, contract shape assert.

### Week 7-8: Sprint 2.4

- Onboarding cadence + release notes + signoff checklist finalization.
- Prepare PI2 launch checklist and product rollout ticket.

### Week 9-12: Sprint 2.5 / Closeout

- Candidate stabilization, bug bash, dependency updates.
- Analytics telemetry + usage tracking instrumentation.
- PI2 signoff review and PI3 planning prep.

## Milestones

- `M1`: Contract baseline and CI gating complete
- `M2`: Onboarding flows + e2e gating success
- `M3`: Release notes + signoff checklist for PI2 doors
- `M4`: PI2 release candidate and stake-holder review

## Handoff Criteria
>
- > 95% of critical tests pass in CI e2e and unit
- Contract tests detect mutation injections (schema mismatch)
- Release documentation and signoff artifacts reviewed by PO
- Service-level objective tracking in place for key API endpoints

## PI2 Signoff checklist

- [x] 12-week PI2 roadmap in `documentation/planning/pi2-roadmap.md`
- [x] Release notes template + guide in `documentation/README.md`
- [x] Signoff criteria and exit checklist in this file + `documentation/planning/README.md`
- [x] PI2 door steps: feature gates, runbook, rollback plan
- [x] E2E gating: auth/login, health, life-profile, onboarding completion

## PI2 Next steps details

- Milestone 1: overloaded feature gates pass and no high-risk regressions
- Milestone 2: cross-team acceptance + documentation update done
- Milestone 3: final release note and signoff PR merged

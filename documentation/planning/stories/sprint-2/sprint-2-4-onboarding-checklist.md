# Sprint 2.4: Onboarding cadence, release notes, and signoff

## Goal

Establish PI2 delivery cadence (12-week), release notes process, and formal signoff checklist.

## Description

Document a repeatable, inspectable approval flow for PI2 and future increments.

## Tasks

- [x] Define 12-week PI roadmap in `documentation/planning/pi2-roadmap.md`.
- [x] Add release notes template and content guide in `documentation/README.md`.
- [x] Add signoff checklist with exit criteria to `documentation/planning/README.md` or `pi-1-closeout.md`.
- [x] Update `documentation/pi-1-closeout.md` with PI2 door and next steps section.
- [x] Add e2e release checklist item so `admin-console-e2e` contains a gated release test that validates Finish criteria for contract update + onboarding flows.
- [x] Add a cross-link from `documentation/planning/stories/sprint-2` to `documentation/planning/epics` / `features` for PI2 accountability.

## Acceptance Criteria

- New onboarding cadence doc created showing milestones and handoff criteria.
- Release notes template exists and is referenced in sprint docs.
- Signoff checklist is included and optionally used in sprint closure.
- E2E gating in CI includes smoke to verify onboarding / signoff pipeline (redirect login flow, onboarding complete, life-profile complete, auth health checks).

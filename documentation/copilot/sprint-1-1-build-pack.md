# Copilot Build Pack — Sprint 1.1

## Status

- **State:** in-progress
- **Live:** no / yes
- **Last updated:** 2026-03-30
- **Notes:** Sprint 1.1 started, onboarding + timer plumbing is being built.

## Objective

Implement onboarding, account creation, avatar selection, timer loop, XP feedback, and mode switching for the player surface.

## File Tree Targets

- frontend: Flutter onboarding flow, avatar/theme selection, timer state machine, mode switch UI
- backend: NestJS auth, user, onboarding, session, XP, and mode preference APIs/entities

## Feature Boundaries

- Onboarding and account creation must be end-to-end testable
- Avatar/theme selection must persist and be queryable
- Timer and XP logic must be idempotent and event-driven
- Mode switch must not affect data integrity

## Implementation Prompts

- Implement GoRouter-based onboarding navigation
- Use DTOs for all API payloads
- Use feature-first folder structure
- No business logic in controllers
- Add rationale fields to recommendation outputs

## Guardrails

- DTOs must be separate from entities
- No god services
- Deterministic rule logic for XP and rewards
- Placeholder TODOs for incomplete logic
- Test idempotent event and reward handling

## Required Tests

- Registration/login/onboarding flow
- Timer start/pause/resume/complete/cancel
- XP update and event emission
- Mode switch persistence

## TDD Checklist

- [ ] Write tests for all Required Tests items
- [ ] Implement minimal code to satisfy each test
- [ ] Refactor with tests passing
- [ ] Add regression case for reported bug/feature

## Done Criteria

- All acceptance criteria in sprint-1-1.md are met
- All endpoints and UI flows are test-covered

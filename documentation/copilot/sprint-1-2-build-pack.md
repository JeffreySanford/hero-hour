# Copilot Build Pack — Sprint 1.2

## Status

- **State:** planned / in-progress / done
- **Live:** no / yes
- **Last updated:** 2026-03-30
- **Notes:** x

## Objective

Implement life-profile onboarding, life areas, village prototype, side quests, and offline sync.

## File Tree Targets

- frontend: Flutter life-profile onboarding, quest creation, village state, side quest UI, offline queue
- backend: NestJS entities/services for LifeProfile, ScheduleProfile, PriorityProfile, FrictionProfile, HabitAnchor, PersonalizationSettings, village state, side quest generation, offline sync endpoints

## Feature Boundaries

- Life-profile onboarding must be stepwise and editable
- Village state must update in response to activity
- Side quests must be generated from profile/habits
- Offline queue must persist and sync safely

## Implementation Prompts

- Use DTOs for all onboarding/profile API payloads
- Use feature-first folder structure
- No business logic in controllers
- Idempotent event handling for sync

## Guardrails

- DTOs must be separate from entities
- No god services
- Deterministic rule logic for side quests and sync
- Placeholder TODOs for incomplete logic
- Test idempotent event and reward handling

## Required Tests

- Life-profile onboarding flow
- Village state update from activity
- Side quest generation and claim
- Offline queue and sync

## TDD Checklist

- [ ] Write tests for all Required Tests items
- [ ] Implement minimal code to satisfy each test
- [ ] Refactor with tests passing
- [ ] Add regression case for reported bug/feature

## Done Criteria

- All acceptance criteria in sprint-1-2.md are met
- All endpoints and UI flows are test-covered

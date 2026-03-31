# Copilot Build Pack — Sprint 3.2

## Status

- **State:** planned / in-progress / done
- **Live:** no / yes
- **Last updated:** 2026-03-30
- **Notes:** x

## Objective

Implement avatar progression, companion, and achievement system.

## File Tree Targets

- frontend: Avatar progression UI, companion UI, achievement gallery
- backend: CompanionState, AchievementDefinition, AchievementProgress, cosmetic unlocks, telemetry

## Feature Boundaries

- Avatar and companion state must persist and update
- Achievements must be explainable and idempotent

## Implementation Prompts

- Use DTOs for all progression/achievement API payloads
- Use feature-first folder structure
- No business logic in controllers

## Guardrails

- DTOs must be separate from entities
- No god services
- Deterministic rule logic for achievements
- Placeholder TODOs for incomplete logic

## Required Tests

- Avatar/companion progression
- Achievement unlocks
- Gallery display

## TDD Checklist

- [ ] Write tests for all Required Tests items
- [ ] Implement minimal code to satisfy each test
- [ ] Refactor with tests passing
- [ ] Add regression case for reported bug/feature

## Done Criteria

- All acceptance criteria in sprint-3-2.md are met
- All endpoints and UI flows are test-covered

# Copilot Build Pack — Sprint 3.1

## Status

- **State:** planned / in-progress / done
- **Live:** no / yes
- **Last updated:** 2026-03-30
- **Notes:** x

## Objective

Implement village expansion, realm growth, and inspectable structures.

## File Tree Targets

- frontend: Village/realm UI, inspect panel, milestone progress
- backend: VillageState, RealmGrowthState, unlock-threshold service, telemetry events

## Feature Boundaries

- Village and realm growth must be data-driven
- Inspect panel must show rationale for growth

## Implementation Prompts

- Use DTOs for all progression API payloads
- Use feature-first folder structure
- No business logic in controllers

## Guardrails

- DTOs must be separate from entities
- No god services
- Deterministic rule logic for unlocks
- Placeholder TODOs for incomplete logic

## Required Tests

- Village/realm growth flows
- Inspect panel logic
- Milestone progress

## TDD Checklist

- [ ] Write tests for all Required Tests items
- [ ] Implement minimal code to satisfy each test
- [ ] Refactor with tests passing
- [ ] Add regression case for reported bug/feature

## Done Criteria

- All acceptance criteria in sprint-3-1.md are met
- All endpoints and UI flows are test-covered

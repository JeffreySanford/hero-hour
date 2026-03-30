# Copilot Build Pack — Sprint 3.1

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

## Done Criteria

- All acceptance criteria in sprint-3-1.md are met
- All endpoints and UI flows are test-covered

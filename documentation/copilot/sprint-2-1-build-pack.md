# Copilot Build Pack — Sprint 2.1

## Status

- **State:** planned / in-progress / done
- **Live:** no / yes
- **Last updated:** 2026-03-30
- **Notes:** x

## Objective

Implement daily planning, effort estimation, overload visibility, and sub-quest structure.

## File Tree Targets

- frontend: Daily planning screen, quest editor, drag/reorder UI
- backend: DailyQuest, SubQuest, effort scoring, overload service, planning telemetry

## Feature Boundaries

- Planning must support create/edit/reorder/estimate/decompose
- Overload scoring must be visible and actionable

## Implementation Prompts

- Use DTOs for all quest/planning API payloads
- Use feature-first folder structure
- No business logic in controllers

## Guardrails

- DTOs must be separate from entities
- No god services
- Deterministic rule logic for effort/overload
- Placeholder TODOs for incomplete logic

## Required Tests

- Daily quest CRUD
- Effort estimation and overload warning
- Sub-quest progress

## TDD Checklist

- [ ] Write tests for all Required Tests items
- [ ] Implement minimal code to satisfy each test
- [ ] Refactor with tests passing
- [ ] Add regression case for reported bug/feature

## Done Criteria

- All acceptance criteria in sprint-2-1.md are met
- All endpoints and UI flows are test-covered

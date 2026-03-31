# Copilot Build Pack — Sprint 2.2

## Status

- **State:** planned / in-progress / done
- **Live:** no / yes
- **Last updated:** 2026-03-30
- **Notes:** x

## Objective

Implement streaks, focus sessions, reward scaling, and re-entry support.

## File Tree Targets

- frontend: Streak UI, focus block mode, reward animation, re-entry prompts
- backend: Streak engine, focus session logic, reward-tier rules, re-entry summary API

## Feature Boundaries

- Streaks and focus sessions must be persistent and testable
- Reward scaling must be explainable
- Re-entry must be supportive

## Implementation Prompts

- Use DTOs for all streak/focus/reward API payloads
- Use feature-first folder structure
- No business logic in controllers

## Guardrails

- DTOs must be separate from entities
- No god services
- Deterministic rule logic for streaks/rewards
- Placeholder TODOs for incomplete logic

## Required Tests

- Streak and focus session flows
- Reward scaling
- Re-entry prompt logic

## TDD Checklist

- [ ] Write tests for all Required Tests items
- [ ] Implement minimal code to satisfy each test
- [ ] Refactor with tests passing
- [ ] Add regression case for reported bug/feature

## Done Criteria

- All acceptance criteria in sprint-2-2.md are met
- All endpoints and UI flows are test-covered

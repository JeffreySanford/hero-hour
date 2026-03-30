# Copilot Build Pack — Sprint 2.3

## Objective

Implement daily reflection, weekly review, and recommendation summary.

## File Tree Targets

- frontend: Reflection UI, weekly review screen
- backend: DailyReflection, WeeklyReviewSnapshot, review-summary rules, privacy boundaries

## Feature Boundaries

- Reflections and reviews must be private and retrievable
- Recommendations must be explainable

## Implementation Prompts

- Use DTOs for all reflection/review API payloads
- Use feature-first folder structure
- No business logic in controllers

## Guardrails

- DTOs must be separate from entities
- No god services
- Deterministic rule logic for recommendations
- Placeholder TODOs for incomplete logic

## Required Tests

- Reflection and review flows
- Recommendation summary

## Done Criteria

- All acceptance criteria in sprint-2-3.md are met
- All endpoints and UI flows are test-covered

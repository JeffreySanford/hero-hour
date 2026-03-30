# Copilot Build Pack — Sprint 3.3

- Challenge and roadmap progress must update automatically
Implement challenges, roadmap, and strategy profile MVP.

## File Tree Targets

- frontend: Challenge cards, milestone roadmap, strategy profile screen
- backend: ChallengeDefinition, ChallengeProgress, MilestoneTrack, UserStrategySnapshot, recommendation rules

## Feature Boundaries

- Challenge and roadmap progress must update automatically
- Strategy profile must be private and explainable

## Implementation Prompts

- Use DTOs for all challenge/strategy API payloads
- Use feature-first folder structure
- No business logic in controllers

## Guardrails

- DTOs must be separate from entities
- No god services
- Deterministic rule logic for challenges/strategy
- Placeholder TODOs for incomplete logic

## Required Tests

- Challenge progress
- Roadmap display
- Strategy profile logic

## Done Criteria

- All acceptance criteria in sprint-3-3.md are met
- All endpoints and UI flows are test-covered

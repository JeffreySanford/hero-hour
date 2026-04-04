# Sprint 4.3: Weekly challenges and retention loops

## Goal

Introduce medium-term challenge loops that turn HeroHour from a series of isolated actions into a recurring progression system with stronger retention potential.

## User Story

As a HeroHour user, I want weekly challenges and visible multi-day goals so that I have something meaningful to work toward beyond individual tasks and one-off completions.

## Description

The current product already supports immediate loops:

- add quest
- complete quest
- claim side quest
- log activity
- see world-state movement

What is still missing is a medium-term structure that helps users return intentionally. Sprint 4 should create the first real retention loop by introducing weekly challenge systems and visible multi-day goals.

This is important because emotionally engaging products are not built only on instant reward. They also need:

- anticipation
- accumulation
- partial progress
- a reason to come back tomorrow

Weekly challenges are a strong first step because they are:

- concrete
- measurable
- easy to explain
- useful to instrument
- compatible with both productivity and game-like progression

## Scope

In scope:

- weekly challenge model
- challenge assignment/presentation
- challenge progress and completion
- challenge rewards and progression hooks
- Angular and Flutter presentation
- telemetry and persistence hooks for challenge behavior

Out of scope:

- full monthly journey systems
- seasonal content systems
- monetized challenge tracks

## Tasks

- [x] Define the first weekly challenge taxonomy:
  - balance challenges
  - completion challenges
  - consistency/streak challenges
  - recovery or reflection challenges
- [x] Define challenge data structures and persistence needs.
- [x] Add challenge API support and durable state handling.
- [x] Add Angular dashboard surfaces for:
  - active weekly challenge
  - current progress
  - reward or unlock preview
- [x] Add Flutter surfaces for the same challenge loop with stronger motivational presentation.
- [x] Define reward behavior:
  - XP
  - cosmetic/theme unlocks
  - badge or title progress
  - world-state or village-state effects
- [x] Ensure challenge progress responds to real user actions rather than mock-only counters.
- [x] Add challenge completion feedback and next-challenge or next-step behavior.
- [x] Add telemetry around challenge assignment, progress, completion, and abandonment.
- [x] Add tests for challenge progression logic and visible UI states.

## Challenge Design Guidance

Challenges should reward healthy behavior, not just raw volume. Good first-release examples:

- complete 5 quests this week
- log activity in 3 different life areas
- maintain balance across work, recovery, and social categories
- finish 3 daily boards with at least one recovery action

This matters because the app should reinforce sustainable productivity, not compulsive grinding.

## UX Guidance

- Progress must be visible before completion, not only after.
- Reward meaning must be understandable.
- Challenge status should feel motivating rather than stressful.
- Failure or expiration should be non-punitive and framed as reset or refresh, not punishment.

## Acceptance Criteria

- The product supports at least one real weekly challenge type end-to-end.
- Users can view challenge progress in Angular and Flutter.
- Challenge progress updates when relevant actions occur.
- Challenge completion grants a visible reward or progression effect.
- Progress state is durable across reloads and restarts.
- Challenge events are emitted into telemetry with a stable schema.
- Tests validate challenge assignment, progression, and completion behavior.

## Non-Functional Requirements

- Challenge calculations should be deterministic and testable.
- Challenge rendering should not introduce noticeable dashboard latency.
- Telemetry coverage must be sufficient to measure challenge adoption and completion.
- Reward behavior must remain idempotent under retries or repeated submissions.

## Exit Strategy

- Demo one weekly challenge from assignment through completion.
- Verify progress durability after reload.
- Verify telemetry records assignment and completion.
- Confirm both Angular and Flutter expose the same challenge truth.

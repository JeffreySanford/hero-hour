# Sprint 4.1: Progression persistence and contract hardening

## Goal

Replace prototype-era in-memory progression behavior with durable, trustworthy state handling and a stronger shared contract model so HeroHour can support real retention, analytics, and cross-platform progression safely.

## User Story

As a HeroHour user, I want my profile, progression, quests, and world state to persist reliably across sessions and devices so that the effort I put into the app feels real and worth investing in.

## Description

The current codebase already demonstrates meaningful gameplay and productivity concepts:

- life profile
- quests
- side quests
- world state
- village/growth state
- telemetry

However, several of these systems still rely on in-memory maps or local/UI-owned state patterns. That is acceptable for early iteration, but it becomes a structural limitation as soon as the product tries to deepen retention loops, analytics, or cross-platform continuity.

Sprint 4 should treat durable progression architecture as a first-class enabler. This is not just a backend refactor. It is a user trust feature, an analytics prerequisite, and an agility investment.

This story should establish:

- durable persistence for core product state
- clearer boundaries between DTOs, domain models, and UI view models
- stronger shared contracts across Angular, Flutter, and NestJS
- better synchronization and error handling for frontend progression state

## Why This Matters

Without durable progression:

- rewards feel cosmetic rather than earned
- users cannot trust continuity
- analytics become misleading
- weekly challenges and re-entry flows become fragile
- Angular and Flutter can drift in behavior

This story is therefore a high-priority enabler and should be treated as architectural runway for the rest of Sprint 4 and PI4.

## Scope

In scope:

- life profile persistence
- game profile persistence
- quest and side-quest persistence
- world-state and village-state persistence
- telemetry persistence handoff contract
- shared contract cleanup and alignment
- frontend state reconciliation behavior

Out of scope:

- full reporting dashboard implementation
- monetization or premium entitlements
- advanced recommendation logic

## Tasks

- [x] Inventory all currently in-memory or UI-local progression/state stores in `apps/api`, `apps/admin-console`, and `apps/mobile_flutter`.
- [x] Define the canonical progression entities and lifecycle boundaries:
  - life profile
  - game profile
  - quests
  - side quests
  - world state
  - village state
  - telemetry event references
- [ ] Design or implement a durable persistence strategy for these entities.
- [x] Refactor `apps/api` services so core progression state is not lost on restart.
- [ ] Harden API contract definitions in `api-interfaces` to reflect canonical payloads and response shapes.
- [ ] Reduce duplicated or divergent local type definitions where shared contracts already exist or should exist.
- [ ] Add API-level validation and explicit error semantics for progression write flows.
- [ ] Update Angular services to align with durable backend truth rather than relying on local assumptions.
- [ ] Update Flutter state flows to better distinguish:
  - optimistic local state
  - confirmed backend state
  - error/retry state
- [ ] Improve offline sync behavior so queued actions reconcile cleanly once the backend is reachable again.
- [x] Add tests for persistence and reload scenarios.
- [x] Add migration/runbook documentation if local dev setup or test setup changes.

## Implementation Considerations

### Backend

- Favor a model that can evolve into production-grade persistence without rewriting every service later.
- Keep the storage layer behind clear service/repository boundaries.
- Ensure write operations are traceable and testable.
- Do not leave progression-critical logic spread across controller-level mutation patterns.

### Contracts

- `api-interfaces` should represent the canonical external contract.
- DTOs should validate transport-level rules.
- Domain models should express core product semantics.
- Frontend view models should be derived and not treated as truth.

### Frontend Behavior

- When a quest or world-state update is submitted, the UI should know whether the state is:
  - pending
  - confirmed
  - failed
  - replayed after offline queue sync
- User-visible feedback should remain honest under failure conditions.

## Acceptance Criteria

- Core progression state survives API restarts and application reloads.
- Angular and Flutter can both retrieve the same durable progression truth for the same user.
- Shared contracts for progression-critical payloads are explicit and test-covered.
- Frontend state transitions distinguish local optimistic state from confirmed backend state.
- Offline queued actions can be replayed without silently corrupting visible user progress.
- Contract and persistence behavior are validated in automated tests.
- Documentation explains the new persistence assumptions and local development expectations.

## Non-Functional Requirements

- Persistence changes must not materially degrade normal request latency for core game-profile flows.
- Contract validation must fail fast for malformed payloads.
- Durability changes must be covered by automated tests for restart/reload scenarios.
- The solution must be maintainable enough to support future challenge, achievement, and analytics features.

## Exit Strategy

- Demonstrate restart-safe persistence for life profile and game profile.
- Demonstrate quest creation/completion surviving reload.
- Demonstrate world-state continuity across sessions.
- Verify Angular and Flutter both consume the hardened contract successfully.

# Sprint 4.6: Telemetry hardening, analytics readiness, and feature flags

## Goal

Turn early telemetry into a trustworthy product signal layer and add feature flags so higher-risk engagement features can be released and measured safely.

## User Story

As a product operator or engineering team member, I want telemetry and feature controls to be trustworthy so that I can measure user engagement, validate experiments, and release new progression features safely.

## Description

The repository already includes telemetry concepts and a telemetry service, but the current implementation is still at an early stage. Sprint 4 should harden the event model so it can support:

- product decisions
- admin analytics
- challenge measurement
- recommendation measurement
- safer rollouts

At the same time, new engagement systems such as weekly challenges, daily boards, and guidance should not be deployed without basic release controls. Feature flags should be introduced so higher-risk features can be enabled incrementally and evaluated with confidence.

This story is both an analytics enabler and a release safety enabler.

## Scope

In scope:

- event naming and schema normalization
- event persistence and retrieval reliability
- analytics-ready aggregate event definitions
- source/session tagging
- feature flag model and exposure
- release-safe wiring for high-risk Sprint 4 features

Out of scope:

- full BI/dashboard platform buildout
- advanced experimentation platforms

## Tasks

- [x] Inventory current telemetry events and event-producing flows.
- [x] Define the canonical product event taxonomy for Sprint 4:
  - challenge assigned
  - challenge progressed
  - challenge completed
  - daily board viewed
  - strategy profile viewed
  - recommendation acted on
  - progression milestone reached
- [x] Normalize event payload shape and versioning expectations.
- [x] Add source tagging such as Angular, Flutter, or backend-generated.
- [x] Add session or correlation information where appropriate.
- [x] Ensure event storage is durable and queryable for later aggregate analysis.
- [x] Define a small initial set of aggregate metrics for product use and retention analysis.
  - weekly challenge start rate
  - weekly challenge completion rate
  - dashboard return rate after re-entry guidance exposure
  - side quest completion frequency
  - life profile completion and update rate
- [x] Introduce a feature flag model for higher-risk engagement features.
- [x] Add frontend and backend wiring so feature availability can be controlled safely.
- [x] Add tests for event schema integrity and feature-flag-driven behavior.
- [x] Document rollout guidance and which Sprint 4 features should be flag-protected.

## Current Status

- Completed: telemetry model hardening, source/session tagging, API telemetry persistence and retrieval, feature flag API and UI wiring, Angular dashboard gating for weekly challenge and guidance features.
- Completed: automated coverage added for API telemetry, feature flag service, and admin-console Playwright scenarios.
- Completed: initial aggregate metric definitions for product use and retention analysis.
- In progress: stabilizing one admin-console e2e empty-state flow in headless Chromium and ensuring side-quest mock coverage remains reliable.
- Remaining: resolve the one failing empty-state assertion in `apps/admin-console-e2e/src/example.spec.ts`.

## Event Quality Guidance

Telemetry should distinguish:

- diagnostic events
- product events
- backend system events
- user-visible outcome events

A useful Sprint 4 telemetry model should make it possible to answer questions such as:

- How many users view the daily board?
- How many users start and complete weekly challenges?
- Do users return after seeing re-entry guidance?
- Are guidance recommendations being acted on?
- Do Flutter and Angular users engage differently with the same progression systems?

## Feature Flag Guidance

Recommended flag candidates:

- weekly challenges
- strategy profile
- re-entry guidance
- richer progression polish or premium intro behaviors

Flags should support:

- internal enablement
- staged rollout
- fast disable in case of regressions

## Acceptance Criteria

- Sprint 4 product events follow a documented and testable schema.
- Events are durable enough to support later aggregate analysis.
- Event payloads identify source surface and relevant context consistently.
- At least the highest-risk Sprint 4 engagement features are controllable through feature flags.
- Telemetry and flag behavior are verified through automated tests.
- Documentation explains rollout and measurement expectations for Sprint 4 features.

## Non-Functional Requirements

- Event recording must not materially degrade core interaction performance.
- Event contracts must be stable and version-aware enough for future analytics consumers.
- Feature flag evaluation should remain simple and reliable.
- Telemetry should not leak inappropriate sensitive data.

## Exit Strategy

- Demo event generation for at least two new Sprint 4 product flows.
- Verify event persistence and retrieval.
- Verify one high-risk feature can be enabled and disabled safely.
- Confirm rollout documentation exists for flagged features.

# Sprint 4.4: Strategy profile and guidance surfaces

## Goal

Give users a lightweight but meaningful strategy profile and guidance layer that interprets their behavior, helps tailor quests from the life profile, supports re-entry, and increases the sense that HeroHour is coaching rather than merely recording.

## User Story

As a HeroHour user, I want a simple personal strategy profile and a few actionable recommendations so that I can understand my habits, improve my planning, and know what to do next when I return.

## Description

HeroHour already has the beginnings of:

- identity through life profile
- progression through quests and world-state
- early telemetry foundations

The next meaningful step is to connect those systems into a simple player-guidance layer. Sprint 4 should introduce a first version of a strategy profile or play-style surface that translates raw activity into actionable insight.

This should not be an overbuilt AI feature. The initial release should remain understandable and deterministic:

- clear metrics
- explainable scorecards
- gentle suggestions
- lightweight re-entry guidance

The goal is not to overwhelm the user with analytics. The goal is to help them feel seen, guided, and supported.

## Scope

In scope:

- first strategy-profile or habit-profile screen/surface
- explainable dimensions such as planning, completion, focus, balance, and recovery
- one to three user-facing recommendations
- returning-user or re-entry snapshot behavior
- life-profile-informed quest recommendation or tailoring inputs
- Angular and Flutter presentation
- telemetry and backend support for derived guidance inputs

This should include explicit mapping from life-profile signals such as `preferredRole`, `priorities`, `habitAnchors`, and `frictionPoints` to realm/category quest suggestions. Guidance should be able to explain why a specific quest or category was recommended by referencing the user’s profile and current strategy dimensions.

Out of scope:

- complex machine-learning systems
- external recommendation engines
- social comparison or competitive ranking

## Tasks

- [x] Define the first strategy-profile dimensions and how they are calculated.
- [x] Define the minimum data requirements for each dimension.
- [x] Define which life-profile inputs should influence quest tailoring and recommendation quality.
- [x] Implement API/domain support for returning strategy-profile data.
- [x] Create Angular presentation for the strategy-profile summary and recommendations.
- [x] Create Flutter presentation for the strategy-profile summary and recommendations.
- [x] Add re-entry guidance behavior for returning users:
  - what changed
  - where momentum was gained or lost
  - one suggested next action
- [x] Ensure recommendations are explainable and tied to visible user behavior.
- [x] Ensure guidance can influence or explain realm/category quest suggestions for the logged-in user.
- [x] Add supportive copy and tone guidelines so the feature remains encouraging rather than judgmental.
- [x] Add tests for strategy metric calculation and recommendation selection.
- [x] Add telemetry to measure strategy-profile views and recommendation interaction.

## Design Guidance

Suggested first strategy dimensions:

- planning consistency
- completion reliability
- focus depth
- life-area balance
- recovery quality

Suggested first recommendation types:

- one completion-oriented suggestion
- one balance/recovery suggestion
- one momentum-preserving next step

Re-entry summary ideas:

- “You made strong progress in work, but your week is light on recovery.”
- “You completed several quests, but your planning rhythm dropped after midweek.”
- “One quick win today could preserve your current streak.”

## Product Constraints

- Recommendations must not pretend to be deeply intelligent if they are simple rules.
- The guidance layer should remain private and user-centered.
- The feature should make the app feel more helpful, not more managerial.

## Acceptance Criteria

- Users can view a strategy-profile summary with at least several understandable dimensions.
- Users receive at least one explainable recommendation tied to real behavior.
- Quest guidance and tailoring can reference life-profile inputs in a deterministic and understandable way.
- Returning users can see a lightweight re-entry or momentum summary.
- Angular and Flutter surfaces present the guidance coherently, with appropriate platform differences.
- Recommendation and profile behavior are backed by deterministic logic and tests.
- Telemetry captures profile views and recommendation interaction events.

## Non-Functional Requirements

- Derived profile metrics must be explainable from source data.
- Recommendation logic must be deterministic and testable.
- Guidance surfaces must remain readable and accessible on mobile and desktop.
- Sensitive personal data should remain private and not be exposed through inappropriate admin surfaces.

## Exit Strategy

- Demo a user with enough data to generate a strategy profile.
- Demo at least two distinct recommendation outcomes.
- Demo a returning-user summary after simulated inactivity or partial completion patterns.

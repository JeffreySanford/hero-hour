# Sprint 4.5: Cross-platform engagement polish and interaction coherence

## Goal

Make Angular and Flutter feel like coherent expressions of the same product by aligning feedback behavior, onboarding quality, progression presentation, and re-entry polish while still respecting each platform’s strengths.

## User Story

As a HeroHour user, I want the app to feel polished and consistent whether I use Angular or Flutter so that I can trust the product, enjoy using it, and recognize the same progression system across platforms.

## Description

The repository already contains two frontend experiences:

- Angular admin-console
- Flutter mobile/web client

They share product concepts but not yet a fully unified interaction model. Flutter already carries more premium visual potential, while Angular is a clearer desktop planning surface. Sprint 4 should improve cross-platform coherence without forcing visual sameness.

This story is about behavior and quality, not only aesthetics:

- same progression truth
- same reward semantics
- same conceptual structure
- intentionally different platform expression

The result should be that users feel they are using one product ecosystem rather than two separate prototypes.

## Scope

In scope:

- shared feedback and interaction rules
- onboarding and first-use polish
- empty-state and re-entry polish
- progression presentation consistency
- reduced-motion and accessibility alignment

Out of scope:

- full design system rewrite
- exact one-to-one visual parity

## Tasks

- [x] Define shared cross-platform interaction principles:
  - acknowledge action immediately
  - show visible state transition
  - reflect progress change clearly
  - preserve honest failure states
- [x] Audit Angular and Flutter for mismatched progression or feedback behavior.
- [x] Improve onboarding clarity in both frontends:
  - first-use framing
  - profile completion expectations
  - next-step guidance
- [x] Improve empty-state quality in both frontends so blank states feel intentional and motivating.
- [x] Improve returning-user re-entry surfaces and “what should I do next?” behavior.
- [x] Ensure core progression widgets and summaries map to the same conceptual model across platforms.
- [x] Add reduced-motion and accessibility-safe interaction standards across both frontends.
- [x] Apply Flutter-specific premium polish where appropriate:
  - richer transitions
  - smoother progression reveal
  - stronger emotional feedback
- [x] Apply Angular-specific strengths where appropriate:
  - scannability
  - operational clarity
  - richer desktop planning layout
- [x] Add tests or regression checks for critical onboarding and progression paths.

## Design Guidance

Shared concepts that should align:

- quest status
- challenge progress
- world-state progress
- profile completeness
- user guidance/re-entry messaging

Allowed platform differences:

- Flutter can use more expressive motion and richer full-screen transitions.
- Angular can use lighter motion and stronger information density.
- Flutter can emphasize emotional immersion.
- Angular can emphasize operational clarity and overview.

## Acceptance Criteria

- Angular and Flutter present the same core progression model and state meanings.
- First-use flows are clearer and more motivating in both frontends.
- Empty states feel intentional and not unfinished.
- Re-entry guidance is more visible in both frontends.
- Reduced-motion and accessibility-safe interaction standards exist in both frontends.
- Critical onboarding and progression paths remain test-covered after polish changes.

## Non-Functional Requirements

- Motion changes must not reduce usability for keyboard or assistive-technology users.
- Cross-platform alignment must not create brittle shared dependencies that slow down each frontend.
- Polished transitions must not introduce obvious startup or navigation lag.

## Exit Strategy

- Demo first-use and returning-user flow in Angular.
- Demo first-use and returning-user flow in Flutter.
- Verify shared progression meanings remain aligned.
- Verify reduced-motion and accessible interaction states are present.

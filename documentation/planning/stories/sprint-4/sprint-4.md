# Sprint 4: PI4 gameplay foundation and engagement convergence

This folder contains Sprint 4 planning stories derived from `documentation/planning/stories/sprint-4/sprint-4-overview.md`.

## Sprint 4 stories

- `sprint-4-1-progression-persistence-and-contract-hardening.md` - durable progression architecture, canonical contracts, and state trustworthiness.
- `sprint-4-1-1-ui-contract-alignment.md` - UI/API alignment cleanup and contract follow-through.
- `sprint-4-2-1-realm-category-quest-gameplay.md` - category-driven quest decks, life-profile tailoring, and realm/world consequences.
- `sprint-4-2-daily-grid-and-time-board.md` - daily time visualization and progress board experience.
- `sprint-4-3-weekly-challenges-and-retention-loops.md` - medium-term engagement loops and challenge structure.
- `sprint-4-4-strategy-profile-and-guidance.md` - player guidance, coaching surfaces, and re-entry recommendations.
- `sprint-4-5-cross-platform-engagement-polish.md` - Angular/Flutter interaction coherence, onboarding polish, and progression presentation.
- `sprint-4-6-telemetry-analytics-and-feature-flags.md` - trustworthy telemetry, analytics readiness, and controlled rollout.
- `sprint-4-7-release-readiness-and-safe-delivery.md` - SAFe-aligned release guardrails, NFRs, CI gates, and implementation traceability.

## Intent

Sprint 4 should move HeroHour from a promising themed prototype toward a durable gameplay-oriented time tracking system. The stories in this folder intentionally mix user-facing features with architectural and delivery enablers, because the product can no longer safely separate engagement work from platform maturity.

The most important correction is this:

- category switching must change the quests available
- quest completion must mutate world state in category-aware ways
- life profile must influence which quests the user is likely to receive
- guidance, challenges, and rewards must sit on top of that loop, not replace it

## Sprint 4 outcome target

By the end of Sprint 4:

- core progression data should be durable
- category or realm switching should change the quest deck the user sees
- quest generation should be tailored to the logged-in user using life-profile inputs
- world progress should respond visibly to category-specific quest completion
- daily progress should be more visible and motivating
- at least one medium-term challenge loop should exist
- user guidance should be more actionable and more personal
- Angular and Flutter should feel more coherent as parts of one product
- telemetry and release gates should be strong enough to support PI4 decisions

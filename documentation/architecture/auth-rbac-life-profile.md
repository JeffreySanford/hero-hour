# Auth, RBAC, and Life-Profile Architecture

## Module Boundaries

- auth: registration, login, refresh, logout, email verification, session issuance
- roles/permissions: role definitions, permission resolution, RBAC enforcement, scoped role assignment
- users: base user profile, account status, core identity fields
- onboarding: step progression, save onboarding selections, orchestration of profile creation and world generation
- life-profile: life roles, schedule, priorities, frictions, habit anchors, privacy-safe read and update flows
- game-profile: avatar seed, display name, world theme, onboarding state, base game stats
- time-tracking: quest sessions, timer state, time log creation, pause/resume/complete flows
- side-quests: side quest generation, eligibility, claim validation, reward linkage
- planning: daily quests, sub-quests, effort estimation, overload scoring
- streaks: daily streaks, focus streaks, streak break/recovery logic
- reflections: daily reflection intake, weekly review source data
- village/progression: village state, realm growth, unlock thresholds, roadmap progress
- achievements: definitions, progress, unlock evaluation
- challenges: weekly/monthly challenge definitions and progress
- strategy-profile: user-facing scorecards, private strategy snapshots, recommendation read models
- recommendations: rule registry, signal interpretation, deterministic recommendation outputs
- analytics: event ingestion, rollups, admin dashboard API payloads
- audit: role assignment logs, admin read logs, sensitive state changes

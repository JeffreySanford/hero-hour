# Time-Forge: Life Quest – Project Documentation

## Overview

**Time-Forge: Life Quest** is a mobile-first, highly animated gamified time tracker that transforms everyday productivity into an RPG adventure. It targets both non-technical users (teachers, parents, freelancers, students) and professionals (with a toggle for Pro/Agile mode). The app combines real-time time tracking, habit-building, and deep agile methodology, all wrapped in a fun, approachable game layer.

### Key Features

- Animated hero/avatar and living world (village, garden, spaceship, etc.)
- XP, leveling, streaks, badges, and achievements
- Daily/weekly quests (disguised agile sprints)
- Side quests for quick XP and habit reinforcement
- Village/life realm that grows with time logged
- Reflection/retrospective disguised as "campfire" moments
- Toggle between Casual (game) and Pro (agile) modes
- Real-time updates via WebSocket

### Tech Stack

- **Frontend:** Flutter (Dart), Riverpod, Flame, Rive, Custom Shaders, Particle Systems
- **Backend:** NestJS (TypeScript) + PostgreSQL + TypeORM (for gamification layer)
- **Existing Core:** Node.js WebSocket time-tracking (real-time DTOs, auditing)

### Target Outcomes

- Make time tracking addictive and fun for everyone
- Teach agile principles through gameplay
- Maintain professional-grade compliance and reporting for power users

---

## Documentation Structure

- `documentation/README.md` – This overview
- `documentation/planning/` – PI and sprint plans, user stories, acceptance criteria
- `documentation/screenshots/` – App screenshots and UI mockups
- `documentation/diagrams/` – Mermaid diagrams and architecture visuals

## Getting Started (Quick Start)

1. Clone repository and install dependencies:
   - `pnpm install`
2. Start API for local development:
   - `pnpm nx serve api`
3. Run domain unit tests:
   - `pnpm nx test domain`
4. Run full test suite (optional):
   - `pnpm nx test --all`

## Release notes template + content guide

When preparing an increment release, add a `documentation/release-notes.md` entry and link it from this README.

### Template

- **Release version**: `vYYYY.MM` (or `vX.Y`)
- **Date**: `YYYY-MM-DD`
- **PI**: PI2
- **Summary**: short bullet overview of business impact
- **New Features**:
  - `-`
- **Improvements**:
  - `-`
- **Bug fixes**:
  - `-`
- **Risk notes**: e.g., compatibility or migration actions
- **Signoff**:
  - QA: [name]
  - PO: [name]
  - DEV: [name]

### Content guide

- Prioritize narrative for stakeholders (value, safety, metrics).
- Link to related issues/PRs and testing evidence.
- Include runtime rollout checklist items (rollout window, feature flags, canary checks).

## How to Contribute

- Branch names: `feature/<brief-name>`, `bugfix/<brief-name>`, `chore/<brief-name>`
- Commit style: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)
- PR title: `<type>(<scope>): <short summary>`
- PR description: include Problem, Solution, Testing, and Rollback notes.
- Review checklist:
  - [ ] Code builds with no lint warnings
  - [ ] Unit tests added/updated
  - [ ] E2E tests added for user flows (when needed)
  - [ ] Docs updated for behavior changes

---

## Next Steps

- See `documentation/planning/` for the Program Increment plans and sprint stories
- See `documentation/diagrams/` for system and UI diagrams
- See `documentation/screenshots/` for visual references

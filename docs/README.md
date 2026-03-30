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

- `docs/README.md` – This overview
- `docs/agile/` – PI and sprint plans, user stories, acceptance criteria
- `docs/screenshots/` – App screenshots and UI mockups
- `docs/diagrams/` – Mermaid diagrams and architecture visuals

---

## Next Steps

- See `docs/agile/PI-1.md` for the first Program Increment plan
- See `docs/diagrams/` for system and UI diagrams
- See `docs/screenshots/` for visual references

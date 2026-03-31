# Program Increment 1 – Sprint Backlog & User Stories

## Sprint 1.1 – Character & Basic Tracking

### User Stories (Sprint 1.1)

- As a new user, I want to create a custom avatar so that I feel personally invested in the game.
- As a user, I want to start and stop a timer for my quest so that I can track my time easily.
- As a user, I want to see my XP increase in real-time as I log time so that I feel rewarded for my effort.
- As a user, I want to toggle between Casual (game) and Pro (agile) mode so that I can choose my preferred experience.

### Tasks (Sprint 1.1)

- Set up Flutter project with Riverpod and GoRouter
- Implement character creation UI with Rive animations
- Build quest timer screen with animated progress ring
- Integrate WebSocket for real-time updates
- Create UserGameProfile DTO and XP calculation logic in NestJS

---

## Sprint 1.2 – Life Areas & Village Prototype

### User Stories (Sprint 1.2)

- As a user, I want to assign time to different life areas so that I can balance my activities.
- As a user, I want to see my village grow as I log time so that my progress feels tangible.
- As a user, I want to complete side quests for quick XP so that I stay motivated.
- As a user, I want my data to sync after being offline so that I never lose progress.

### Tasks (Sprint 1.2)

- Add life area selection and icons
- Implement animated village screen (at least 3 buildings)
- Add side quest system (quick-win type)
- Implement offline support with Hive/Isar
- Ensure all XP/quest data syncs with backend

---

## Exit Criteria (Sprint Level)

[ ] All user stories are demoed and pass acceptance criteria
[ ] No critical bugs or animation jank
[ ] All new features are covered by automated tests

## Acceptance Criteria (PI Level)

[ ] Foundation gameplay loop is fun and visually engaging
[ ] All core data flows (time log → XP → village growth) are functional
[ ] No critical bugs or animation jank
[ ] Product Owner signs off on demo

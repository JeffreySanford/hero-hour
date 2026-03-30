# Sprint 1.1 — Character, Onboarding, and Core Tracking

## Feature Focus

- Player identity
- Account creation, auth
- Avatar selection
- Timer loop
- XP feedback
- Mode switch

## User Stories

- As a new user, I want to create an account so that my progress is saved securely.
- As a new user, I want to verify my email so that my account is protected.
- As a new user, I want to choose an avatar archetype so that I feel emotionally invested in the game.
- As a new user, I want to choose a world theme so that my game begins with a tone I enjoy.
- As a user, I want to enter a display name so that the world feels personal.
- As a user, I want to start, pause, resume, and complete a quest timer so that I can track effort reliably.
- As a user, I want to see XP increase in response to time logged so that work feels rewarding.
- As a user, I want to toggle between Casual and Pro mode so that I can choose the interface that fits me.

## Technical Tasks

- Create Flutter onboarding flow shell with GoRouter
- Create account registration, login, verification, and refresh flows in NestJS
- Seed default USER role on registration
- Create User, AuthSession, UserGameProfile, and minimal onboarding-state entities
- Implement avatar selection UI and theme selection UI
- Implement timer state machine in Flutter and matching session APIs in NestJS
- Implement XP calculation service and event emission for timer completion
- Add mode-switch preference persistence

## Acceptance Criteria

- Registration, verification, and login function end-to-end
- Timer supports start/pause/resume/complete/cancel flows
- XP updates correctly on valid quest completion
- User mode selection persists across app restarts
- Onboarding selections persist after restart

## Estimates / Priority / Dependencies

- Priority: Critical
- Story Points: 34
- Dependencies: none

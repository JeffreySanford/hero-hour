# Sprint 1.2 — Life Profile Intake, Life Areas, Village Prototype, and Offline Sync

## Feature Focus

- Life-shape capture
- Schedule profiling
- Priorities/frictions
- Side quests
- World seeding
- Offline trust

## User Stories

- As a user, I want to tell the app about my life rhythm so that quests fit my real day.
- As a user, I want to assign quests to life areas so that my time reflects what matters.
- As a user, I want my world to visibly grow when I log time so that progress feels tangible.
- As a user, I want personalized side quests based on my habits so that the game feels relevant.
- As a user, I want to continue tracking while offline so that the app is reliable anywhere.
- As a user, I want offline actions to sync later so that I never lose meaningful progress.

## Technical Tasks

- Build life-profile onboarding steps for life roles, schedule, priorities, frictions, and habit anchors
- Create LifeProfile, ScheduleProfile, PriorityProfile, FrictionProfile, HabitAnchor, and PersonalizationSettings entities
- Add life-area selection to quest creation and completion flows
- Create village state MVP with at least 3 reactive regions
- Create side quest generation service using life-profile inputs
- Implement local queue for offline time logs, side quest claims, and XP events
- Build sync reconciliation endpoints with idempotent event handling

## Acceptance Criteria

- Life-profile data can be collected, saved, and edited
- Quests can be categorized into life areas
- Village visibly responds to logged activity
- Side quests can be generated from profile and habit anchors
- Offline logs sync successfully after reconnection

## Estimates / Priority / Dependencies

- Priority: Critical
- Story Points: 42
- Dependencies: Sprint 1.1 auth and profile shell

# Sprint 3.1 — Village Expansion and Realm Growth

## Feature Focus

- Deeper world growth
- Inspectable structures
- Next-unlock visibility

## User Stories

- As a user, I want my village to expand over time so that long-term progress is visible.
- As a user, I want each realm to affect a distinct area of the world so that balance matters.
- As a user, I want to inspect buildings and understand why they grew so that the world feels legible.
- As a user, I want to know what unlock comes next so that I have medium-term goals.

## Technical Tasks

- Expand VillageState and RealmGrowthState models
- Add unlock-threshold service
- Add inspect panel and next-upgrade progress UI
- Add ambient world motion tuning and milestone animation hooks
- Emit building-upgrade telemetry events

## Acceptance Criteria

- Village supports multiple unlock stages
- Realm-specific growth is visible and data-driven
- Users can inspect structures and next milestones

## Estimates / Priority / Dependencies

- Priority: Medium-High
- Story Points: 30
- Dependencies: PI 1 village MVP

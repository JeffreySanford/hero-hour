# API Contracts

> Each endpoint should be backed by OpenAPI 3.0 definitions in the API project (e.g. `apps/api/src/openapi` or generated docs endpoint `/api/docs`).
> For each route below, link to the OpenAPI path entry when available.

## Auth

- POST /auth/register
- POST /auth/verify-email
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout

## Onboarding

- GET /onboarding/state
- POST /onboarding/avatar
- POST /onboarding/display-name
- POST /onboarding/theme
- POST /onboarding/life-roles
- POST /onboarding/schedule
- POST /onboarding/priorities
- POST /onboarding/frictions
- POST /onboarding/habit-anchors
- POST /onboarding/personalization
- POST /onboarding/complete

## Gameplay

- POST /quests/session/start
- POST /quests/session/pause
- POST /quests/session/resume
- POST /quests/session/complete
- POST /quests/session/cancel
- GET /quests/daily
- POST /quests/daily
- PATCH /quests/daily/:id
- POST /quests/daily/reorder

## Side Quests / Progression

- GET /side-quests/available
- POST /side-quests/:id/claim
- GET /village/state
- GET /progression/roadmap
- GET /achievements
- GET /challenges

## Guidance

- GET /strategy-profile/me
- GET /strategy-profile/me/recommendations
- GET /reviews/weekly/current

## Admin / Analytics

- GET /admin/analytics/live
- GET /admin/analytics/engagement
- GET /admin/analytics/progression
- GET /admin/analytics/cohorts

# Event Taxonomy & Analytics

## Event Taxonomy Goals

- Support reward logic
- Support strategy profile generation
- Support admin dashboards
- Support operator tuning of progression and retention

## Core Event Types

- user_registered
- email_verified
- onboarding_step_completed
- onboarding_completed
- quest_created
- quest_started
- quest_paused
- quest_resumed
- quest_completed
- quest_canceled
- daily_plan_created
- daily_plan_reordered
- effort_estimated
- side_quest_generated
- side_quest_claimed
- xp_awarded
- level_up
- streak_continued
- streak_broken
- focus_block_completed
- reflection_submitted
- weekly_review_generated
- achievement_unlocked
- challenge_progressed
- challenge_completed
- building_unlocked
- companion_state_changed
- strategy_snapshot_generated
- recommendation_generated
- admin_dashboard_viewed

## Event Schema Guidance

Each event should include:

- event id
- event type
- user id
- timestamp
- correlated entity id where applicable
- source module
- metadata payload kept lean and documented

## Rollups Needed

- daily completion rate
- estimation accuracy
- streak continuity
- realm balance score
- focus block length distribution
- side quest response rate
- achievement penetration
- weekly retention
- challenge participation

# Program Increment Acceptance Criteria

## PI 1 – Foundation & Core Gameplay Loop

- Users can create a character and start/stop a timer
- XP is awarded in real-time and saved to PostgreSQL
- Hero has at least 3 idle animations + 1 level-up animation
- Timer screen shows particle feedback every 60 seconds
- Village renders with at least 3 animated buildings that grow based on logged time
- Side quests award XP with flying orb animation
- Data syncs correctly after offline session
- A new user can complete onboarding in < 90 seconds and see their village grow within the first 30 minutes of use
- All core animations run at ≥ 55 fps on a 2022 mid-range phone
- Backend logs every XP award with audit trail linked to original TimeLog
- Product Owner can demo the full loop end-to-end
- No critical bugs or animation jank

## PI 2 – Quests, Streaks & Heavy Animations

- Users can plan 3–5 daily quests every morning
- Completing a quest triggers a 3-second cinematic animation
- Quest completion animation includes screen shake + XP explosion + hero celebration
- All quest and reward animations are production-ready and feel “juicy”
- 5-second video demo of a full quest completion feels like a real game moment
- Users report “this feels fun” in internal playtesting (minimum 8/10 score)
- No animation-related crashes or frame drops > 2 seconds

## PI 3 – Village Builder & Progression Depth

- Village can have ≥ 12 unique animated elements that react to user behavior
- Users can reach level 5 and feel meaningful progression
- All new animations are configurable via Riverpod for future tuning

## PI 4 – Polish, Pro Mode, Launch Readiness

- App passes 100% of automated + manual test cases
- Average session length in playtests > 12 minutes
- Zero critical bugs on launch devices
- Product Owner signs off on “this feels like a real game”

## Overall Project Success Metrics

- ≥ 4.5 star rating target on App Store
- 60% of users return on day 7 (retention)
- Average daily time tracked per user > 90 minutes
- Users in Casual Mode unknowingly complete agile practices (measured via backend analytics)

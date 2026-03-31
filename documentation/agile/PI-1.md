
# Program Increment 1 (PI 1): Foundation, Intelligence, and Guidance

**Objective:** Build the minimal viable game and analytics platform so users immediately feel they are playing something fun, not just tracking time, and administrators/coaches have actionable insights.

**Duration:** 4–6 weeks (2–3 sprints)

**Business Value:**

- Users can create a character, start gaining XP, and receive personal guidance
- Admins/coaches can analyze engagement, progression, and risk with animated dashboards

---

## Sprint 1.1 – Character, Tracking, and Telemetry Foundations (Weeks 1–2)

[ ] Set up Flutter project with Riverpod + GoRouter
[ ] Implement character creation screen with Rive animations
[ ] Build basic time-tracking screen with new “Quest Entry” UI
[ ] Connect to existing WebSocket for live timer
[ ] Create UserGameProfile entity + basic XP calculation service in NestJS
[ ] Define telemetry event taxonomy (quest, time log, badge, reflection, etc.)
[ ] Implement event ingestion endpoints in backend
[ ] Create analytics rollup tables/materialized views
[ ] Compute baseline personal performance metrics
[ ] Create initial admin analytics APIs

### Exit Criteria (Sprint 1.1)

- App builds and runs on iOS & Android with 60 fps minimum
- User can create avatar and start/stop a timer
- XP is awarded in real-time and saved to PostgreSQL
- Telemetry events persist from all core quest interactions
- Daily/weekly rollups computed correctly
- APIs return meaningful aggregate analytics for user/admin views
- All animations are smooth (no jank on mid-range devices)
- All analytics DTOs are strongly typed and documented

### Acceptance Criteria (Sprint 1.1)

[ ] Hero has at least 3 idle animations + 1 level-up animation
[ ] Timer screen shows particle feedback every 60 seconds
[ ] Backend DTOs are strongly typed and validated
[ ] User can toggle between Casual (game) and Pro (original) mode
[ ] Every quest completion generates an event and updates rollups
[ ] Analytics endpoints return consistent values for completion rate, streak, balance score
[ ] Event ingestion is resilient to duplicates/retries
[ ] Rollup generation completes within MVP performance bounds
[ ] Swagger or equivalent API docs exist for analytics endpoints

---

## Sprint 1.2 – Life Areas, Village, and Personal Guidance (Weeks 3–4)

[ ] Add 5 life-area system with visual icons
[ ] Create simple village screen with animated buildings
[ ] Implement life-area balance calculation
[ ] Add first side-quest system (quick-win type)
[ ] Basic offline support with Hive/Isar
[ ] Build personal scorecard model (planning, focus, completion, balance, recovery, adaptation)
[ ] Create rule engine and registry for recommendations
[ ] Expose personal guidance APIs
[ ] Implement user-facing guidance screen contract
[ ] Support daily, weekly, monthly insight generation

### Exit Criteria (Sprint 1.2)

- Village renders with at least 3 animated buildings that grow based on logged time
- Side quests award XP with flying orb animation
- Data syncs correctly after offline session
- Private guidance profile available per user
- At least 10 explainable recommendation rules working end-to-end
- User can see scores, insights, and next-step suggestions
- Each recommendation links to measurable source behavior

### Acceptance Criteria (Sprint 1.2)

[ ] A new user can complete onboarding in < 90 seconds and see their village grow within the first 30 minutes of use
[ ] All core animations run at ≥ 55 fps on a 2022 mid-range phone
[ ] Backend logs every XP award with audit trail linked to original TimeLog
[ ] Product Owner (you) can demo the full loop end-to-end
[ ] Users see updated score dimensions and recommendations
[ ] Recommendations are generated from real telemetry
[ ] Each insight includes supporting rationale/metrics
[ ] Recommendation generation can run daily and on-demand
[ ] Privacy boundaries enforced

---

## Sprint 1.3 – Admin Analytics Command Surface (Weeks 5–6)

[ ] Build admin dashboard shell (Angular + D3)
[ ] Implement live analytics streams
[ ] Create visualizations for operations, behavior, progression
[ ] Add filtering, cohort selection, drill-downs
[ ] Support animated transitions/live updates

### Exit Criteria (Sprint 1.3)

- Admin dashboard renders live/historical analytics
- At least 5 high-value visualizations implemented and interactive
- Dashboard supports animation without usability loss
- Filtering by date, cohort, user segment, realm/category

### Acceptance Criteria (Sprint 1.3)

[ ] Admins access analytics in a secure surface
[ ] Charts animate smoothly and update on stream refresh
[ ] At least one visualization supports drill-down
[ ] Dashboard uses typed DTO contracts from backend
[ ] Role-based access enforced

---

## Acceptance Criteria (PI 1)

[ ] Foundation gameplay loop is fun and visually engaging
[ ] All core data flows (time log → XP → village growth) are functional
[ ] No critical bugs or animation jank
[ ] Users receive actionable personal guidance
[ ] Admins/coaches can analyze engagement, progression, and risk visually

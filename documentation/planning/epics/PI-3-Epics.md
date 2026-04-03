# Program Increment 3 – Epics

## PI 3 Goal

Deepen player attachment, increase long-term progression, and begin surfacing meaningful intelligence by expanding:

[ ] village/world evolution
[ ] avatar and companion progression
[ ] badge and achievement systems
[ ] long-term rewards and unlocks
[ ] weekly and monthly challenge loops
[ ] stronger retention structures
[ ] first guidance/profile foundations
[ ] first admin-facing analytical hooks

### Epic A: Village Expansion

### Epic B: Realm-Specific World Growth

### Epic C: Interactive Village Feedback

### Epic D: Avatar Progression

### Epic E: Companion Systems

### Epic F: Achievement Depth

### Epic G: Achievement Gallery and Profile Identity

### Epic H: Weekly and Monthly Challenges

### Epic I: Progression Roadmap

### Epic J: Personal Guidance Foundations

### Epic K: Guidance Signals and Recommendation Seeds

### Epic L: Progression Telemetry for Future Admin Analytics

#### Release cadence checklist (signoff gating)

- [x] Add telemetry event contract and API types in `api-interfaces` for `lifeProfileUpdated`, `questCompleted`, `focusSessionCompleted`.
- [x] Emit telemetry from API services for life-profile updates, quest completions, and focus session completions.
- [x] Store telemetry events in domain audit repository (`TelemetryAuditRepository`) and accessible runtime list.
- [x] Add API endpoint to query telemetry events (`GET /telemetry`).
- [x] Add API hooks in admin-console e2e to assert event emission for onboarding, life profile save, and challenge completion.
- [x] Add CI step in `.github/workflows/ci.yml` to run `pnpm exec nx e2e admin-console-e2e` as contract gate with telemetry coverage.
- [x] Post-release and PI closeout signoff in documentation updated for epic completion.


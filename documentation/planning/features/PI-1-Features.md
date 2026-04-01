# PI 1 – SAFe-Style Features

## Epic: Player Foundation and Core Loop

### Feature 1.1 – Player Identity and Onboarding

Benefit Hypothesis: If new users can create an identity and understand the game quickly, they will be more likely to complete first-session onboarding and begin tracking time.
Acceptance Criteria:

- users can create avatar, name, and starter theme
[ ] users can create avatar, name, and starter theme
- onboarding is skippable/resumable
[ ] onboarding is skippable/resumable
- identity persists across sessions
[ ] identity persists across sessions
Stories:
- As a new user, I want to choose an avatar so that I feel invested.
- As a new user, I want to choose a starter world theme so that my game feels personal.
- As a new user, I want a brief onboarding flow so that I understand the basics quickly.
- As a returning user, I want onboarding completion remembered so that I can jump back in.

### Feature 1.2 – Core Quest Timing and Session Tracking

Benefit Hypothesis: If users can reliably start, pause, resume, and complete tracked quests, the platform will establish trust in the core loop.
Acceptance Criteria:

- timer actions work end-to-end
[ ] timer actions work end-to-end
- quest sessions persist reliably
[ ] quest sessions persist reliably
- completed sessions save valid records
[ ] completed sessions save valid records
Stories:
- As a user, I want to start a quest timer so that I can track work.
- As a user, I want to pause and resume a quest timer so that interruptions do not ruin my session.
- As a user, I want to complete a quest session so that my progress is saved.
- As a user, I want to cancel accidental starts so that my history stays clean.

### Feature 1.3 – Real-Time XP and Reward Feedback

Benefit Hypothesis: If users receive immediate visible rewards while tracking, the experience will feel more engaging and habit-friendly.
Acceptance Criteria:

- XP updates correctly
[ ] XP updates correctly
- completion rewards display clearly
[ ] completion rewards display clearly
- level-up logic functions correctly
[ ] level-up logic functions correctly
Stories:
- As a user, I want to see XP grow while I work so that effort feels rewarded.
- As a user, I want satisfying completion feedback so that finishing feels meaningful.
- As a user, I want to level up when I cross thresholds so that long-term progress exists.

### Feature 1.4 – Mode Switching Between Casual and Pro

Benefit Hypothesis: If users can choose between a playful surface and a structured surface, the product can serve both ordinary users and power users without splitting the data model.
Acceptance Criteria:

- mode selection persists
[x] mode selection persists
- data remains intact across modes
[x] data remains intact across modes
- UI changes presentation, not data truth
[x] UI changes presentation, not data truth
Stories:
- As a user, I want to switch between Casual and Pro mode so that I can use the app my way.
- As a user, I want my preferred mode remembered so that I do not reselect it every session.

### Feature 1.5 – Life Areas and World Seed

Benefit Hypothesis: If tracked time is categorized into meaningful life areas and reflected in a visible world, users will understand that the product values balanced life management rather than generic output.
Acceptance Criteria:

- quests can be assigned to life areas
[x] quests can be assigned to life areas
- village/world updates from logged activity
[x] village/world updates from logged activity
- at least 3 world elements visibly respond
[x] at least 3 world elements visibly respond
Stories:
- As a user, I want to assign quests to life areas so that my time means something.
- As a user, I want my village to grow from activity so that my progress is tangible.
- As a user, I want realm visuals to be easy to recognize so that categorization is fast.

### Feature 1.6 – Side Quests and Quick Wins

Benefit Hypothesis: If users can complete small optional objectives, they will stay engaged and experience more momentum during early usage.
Acceptance Criteria:

- at least 3 side quest types exist
[x] at least 3 side quest types available
- side quest completion grants valid rewards
[x] side quest completion grants valid rewards
- claims are idempotent and clear
[x] claims are idempotent and clear
Stories:
- As a user, I want simple side quests so that I can earn quick wins.
- As a user, I want side quest rewards to be visible so that optional effort feels worth it.

### Feature 1.7 – Offline Reliability and Sync

Benefit Hypothesis: If the app remains reliable offline and syncs safely later, users will trust it in real life rather than only in ideal conditions.
Acceptance Criteria:

- quest timing works offline
[ ] quest timing works offline
- local queue persists unsynced work
[ ] local queue persists unsynced work
- reconnect sync is safe and clear
[ ] reconnect sync is safe and clear
Stories:
- As a user, I want to keep tracking while offline so that the app stays useful anywhere.
- As a user, I want offline work to sync later so that I do not lose progress.
- As a user, I want to know sync status so that the app feels trustworthy.

### Feature 1.8 – Life-Profile API + Flutter Client

Benefit Hypothesis: If life-profile can work end-to-end across Angular and Flutter with shared API contract, we can support cross-platform onboarding and persistence in sprint 1.
Acceptance Criteria:

- api life-profile endpoints are implemented and tested
[x] api life-profile endpoints are implemented and tested
- Angular life-profile form + e2e flow is complete
[x] Angular life-profile form + e2e flow is complete
- Flutter life-profile form + API integration test is complete
[x] Flutter life-profile form + API integration test is complete
Stories:
- As a user, I can submit life-profile in Angular and see profile data saved.
- As a user, I can submit life-profile in Flutter and verify via API that data persists.
- As a developer, I can run `flutter test --dart-define=ENABLE_FLUTTER_API_INTEGRATION=true` against live API.

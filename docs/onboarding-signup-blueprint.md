# Time-Forge: Life Quest

## Verbose Onboarding / Signup Blueprint

### Design Intent

The onboarding process for Time-Forge: Life Quest is designed to:

- Create trust and emotional attachment
- Securely create the user account
- Collect real-life structure for personalized quests
- Generate the user’s first playable world and day plan

Onboarding is not a form—it is world creation for your real life. The emotional frame: **You are not filling out a profile. You are teaching the world how to support your life.**

---

## Onboarding Flow Overview

1. Intro / splash experience
2. Account creation
3. Security and consent
4. Identity and avatar
5. Life-shape profiling
6. Routine and schedule profiling
7. Priority and friction profiling
8. Habit anchor profiling
9. Personalization and tone
10. Role / group context (if relevant)
11. World generation reveal
12. First quest plan
13. First side quests
14. First reflection prompt
15. Entry into live home screen

---

### Detailed Screen-by-Screen Blueprint

#### Screen 1 – Intro / Opening Screen

- **Purpose:** Establish emotional promise and visual tone.
- **Visuals:** Animated twilight world, parallax, fireflies, forge, path, ambient movement.
- **Copy:**
  - Title: Forge Your Day
  - Subtitle: Build a better real life through play, rhythm, and progress.
  - Body: Every quest you complete strengthens the world you live in here — and the life you live out there.
  - CTA: Begin Your Journey
  - Secondary: I Already Have an Account
  - Tertiary: Preview the World
- **Interactions:** Particle ripples, world preview pan, reduced-motion support.

#### Screen 2 – Account Creation

- **Purpose:** Create core account identity.
- **Inputs:** Email/username, password, confirm password, SSO (optional).
- **Copy:**
  - Title: Create Your Account
  - Subtitle: Your world needs a keeper.
  - Body: Create your account to save your progress, protect your data, and shape quests around your real life.
  - Field labels and helper text for privacy and security.
- **Validation:** Email, password strength, match.
- **System:** Create auth identity, hash password, assign USER role, create profile shells, issue pre-verification token.

#### Screen 3 – Security, Privacy, and Consent

- **Purpose:** Explain life questions and privacy.
- **Copy:**
  - Title: Before We Shape Your World
  - Subtitle: A few important things.
  - Body: We ask about your routines, priorities, and habits so we can create better quests, better pacing, and better support for your real life.
  - Consent checkboxes for ToS, privacy, personalization, reminders.
- **Notes:** Personalization is purposeful, private by default, roles are controlled.

#### Screen 4 – Verify Identity

- **Purpose:** Confirm email ownership.
- **Copy:**
  - Title: Check Your Email
  - Subtitle: One more step to secure your world.
  - Field: Verification code
  - Actions: Verify, resend, use different email.
- **System:** Mark email verified, upgrade session.

#### Screen 5 – Choose Your Traveler / Avatar

- **Purpose:** Create emotional identity.
- **Visuals:** Archetype carousel (Builder, Scholar, Guardian, etc.)
- **Copy:**
  - Title: Choose How You Enter the World
  - Subtitle: This is your starting form — you can grow and change later.
  - Body: Pick the traveler that feels most like you right now.
- **System:** Save avatar seed, initialize animation, customization baseline.

#### Screen 6 – Name Your Character / Profile Identity

- **Purpose:** Humanize the account and world.
- **Copy:**
  - Title: What Should the World Call You?
  - Subtitle: This can be your name, a nickname, or a title.
  - Field: Display Name
- **System:** Save display name.

#### Screen 7 – Choose World Theme

- **Purpose:** Set visual flavor.
- **Themes:** Cozy Village, Floating Garden, Starforge Camp, etc.
- **Copy:**
  - Title: Choose Your Starting World
  - Subtitle: Your world will grow with your time, habits, and priorities.
- **System:** Set themeId, asset pack, seed layout.

#### Screen 8 – Life Shape Profile

- **Purpose:** Understand broad life structure.
- **Copy:**
  - Title: Tell Us About the Shape of Your Life
  - Subtitle: We use this to build better quests around your reality.
  - Options: Employee, Student, Parent, Freelancer, etc. (multi-select)
- **System:** Populate lifeRoles[], influence quest templates.

#### Screen 9 – Schedule Rhythm

- **Purpose:** Collect realistic time windows.
- **Inputs:** Wake/sleep times, work/school, commute, family, weekends, recurring blocks.
- **Copy:**
  - Title: What Does Your Usual Rhythm Look Like?
- **System:** Create ScheduleProfile, derive quest windows, quiet hours.

#### Screen 10 – Priorities

- **Purpose:** Learn what outcomes the app should support.
- **Copy:**
  - Title: What Do You Want This World to Help You Improve?
  - Options: Focus, planning, health, family, learning, etc.
- **System:** Populate PriorityProfile, seed quest engine.

#### Screen 11 – Friction Points

- **Purpose:** Understand obstacles.
- **Copy:**
  - Title: Where Do Things Usually Break Down?
  - Options: Overcommit, procrastinate, lose focus, burnout, etc.
- **System:** Populate FrictionProfile, seed recommendations.

#### Screen 12 – Habit Anchors

- **Purpose:** Find recurring real-life hooks for side quests.
- **Copy:**
  - Title: What Already Happens Most Days?
  - Examples: Coffee, lunch, dog walk, commute, dinner, reading, etc.
- **System:** Create HabitAnchor[], map to quest generators.

#### Screen 13 – Tone and Play Style

- **Purpose:** Tailor emotional experience.
- **Copy:**
  - Title: How Should This World Feel?
  - Options: Cozy, heroic, calm, strategic, playful, serious.
  - Controls: Animation, sound, haptics, reminders.
- **System:** Populate PersonalizationSettings.

#### Screen 14 – Group / Community Context (Optional)

- **Purpose:** Set up moderated spaces.
- **Copy:**
  - Title: Are You Joining a Group?
  - Options: Myself, invitation code, join group.
- **System:** Validate invitation, assign group, pending role if invited.

#### Screen 15 – World Generation Reveal

- **Purpose:** Reward information entry with emotional payoff.
- **Visuals:** World assembles based on answers, avatar and companion appear, village lights ignite.
- **Copy:**
  - Title: Your World Is Taking Shape
- **System:** Generate world, seed quests.

#### Screen 16 – First Main Quests

- **Purpose:** Show practical value immediately.
- **Copy:**
  - Title: Here’s a Starter Plan for Today
  - Quests: Plan 3 tasks, focus block, real-world reset, etc.
- **System:** Editable plan, user guided.

#### Screen 17 – First Side Quests

- **Purpose:** Demonstrate personalization from habit anchors.
- **Copy:**
  - Title: A Few Side Quests, Tailored to Your Day
- **System:** Side quests based on routines.

#### Screen 18 – First Reflection Prompt

- **Purpose:** Plant the inspect/adapt loop early.
- **Copy:**
  - Title: One Last Thing
  - Prompt: What would feel like a win today?
- **System:** Save reflection.

#### Screen 19 – Home Screen Arrival

- **Purpose:** Land the user in a living, useful home screen.
- **Contents:** Avatar, companion, level, quests, streak, strategy, animated world.
- **Copy:**
  - Welcome, [Display Name]. Your world is ready. Your first quest begins when you do.

---

## Privacy and Consent Principles

- All life-profile and strategy data is private by default
- Users can skip, edit, or disable categories
- Moderators see only aggregates, not private details
- Admin access is auditable

---

## See also

- [Auth + RBAC + Life-Profile Architecture Spec](auth-rbac-life-profile-architecture.md)

# Time-Forge: Life Quest

## NestJS Auth + RBAC + Life-Profile Architecture Spec

### Architectural Principles

- Authentication, authorization, and life personalization are separate modules
- Public signup creates only a standard USER
- Moderator/admin roles are assigned by invitation, promotion, or admin action
- Life-profile data is private by default
- JWT is used for authentication and role claims; backend enforces authorization
- Recommendation logic consumes structured life-profile data
- All critical role/permission changes are auditable

---

## Recommended NestJS Module Structure

```bash
src/
  modules/
    auth/
    users/
    roles/
    permissions/
    groups/
    life-profile/
    game-profile/
    personalization/
    onboarding/
    invitations/
    audit/
    recommendations/
    strategy-profile/
```

---

## Core Auth / RBAC Domain Model

- **User**: id, email, username, passwordHash, emailVerified, status, timestamps
- **AuthSession**: id, userId, refreshTokenHash, device info, expiresAt, revokedAt
- **Role**: id, name (USER, GROUP_MODERATOR, ADMIN, etc.), description
- **Permission**: id, key, description
- **RolePermission**: roleId, permissionId
- **UserRoleAssignment**: id, userId, roleId, scopeType (GLOBAL|GROUP), scopeId, assignedBy, source, timestamps
- **Group**: id, name, type, createdBy, timestamps
- **GroupMembership**: id, groupId, userId, status, joinedAt, leftAt
- **Invitation**: id, email, groupId, invitedRoleId, tokenHash, expiresAt, acceptedAt, invitedBy, createdAt

---

## Life Profile Domain Model

### Data Ethics & Personality Profiling

**Principle:** Use personal and behavioral data to help the user first. Do not infer or sell user-level personality types (e.g., MBTI) to third parties. All profiling and strategy data is private by default.

**Allowed:**

- Use onboarding and behavior data to personalize quests, pacing, nudges, and coaching
- Provide user-facing insights and adaptive feedback
- Offer premium features based on in-app intelligence
- Sell aggregate, non-user-identifiable trend intelligence (never user-linked)
- Strictly opt-in, transparent partner offers (with separate consent and easy revoke)

**Prohibited:**

- Inferring and selling user-level MBTI/personality types or marketing personas
- Sharing or selling any user-level life-profile, friction, or strategy data without explicit, granular, revocable consent
- Bundling data sharing with core app use or coercing consent
- Hidden or surprise sharing of inferred traits

**Internal Play-Style Taxonomy (for in-app use only):**

- BehaviorStyleSnapshot: Internal, adaptive, not exported
- PlanningStyle: STRUCTURED | FLEXIBLE | OVERCOMMITTING | MINIMALIST
- FocusStyle: DEEP_BLOCK | BURST | INTERRUPTED | ROUTINE_ANCHORED
- MotivationStyle: STREAK_DRIVEN | WORLD_BUILDER | ACHIEVEMENT_HUNTER | BALANCE_SEEKER

**Monetization Options (Trust-Aligned):**

- Subscription and premium plans (coaching, advanced analytics, premium content)
- Family/team dashboards and group features
- Aggregate, non-identifiable analytics products
- Strictly opt-in, transparent partner offers (never default)

**Regulatory & Platform Compliance:**

- Comply with GDPR, CCPA, and other privacy laws regarding profiling, data sale, and user rights
- Provide accessible deletion and opt-out controls
- Disclose all data practices in privacy policy and app store listings
- Audit all admin and partner data accesses

- **LifeProfile**: id, userId, primaryLifeStage, notes, onboardingCompleted, timestamps
- **LifeRoleSelection**: id, lifeProfileId, roleType (enum)
- **ScheduleProfile**: id, userId, wake/sleep/work windows, commute, quiet hours, timestamps

### Standard API Schema (shared in `@org/api-interfaces`)

```ts
export type LifeRole = 'leader' | 'member' | 'observer' | 'parent' | 'worker' | 'student' | 'athlete';
export type ProfileStatus = 'draft' | 'active' | 'suspended' | 'archived';
export type PrivacySetting = 'private' | 'friends' | 'workspace' | 'public';

export interface LifeProfile {
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  preferredRole: LifeRole;
  roles: LifeRole[];
  schedule: Record<string, any>;
  priorities: string[];
  frictionPoints: string[];
  habitAnchors: string[];
  status: ProfileStatus;
  privacy: PrivacySetting;
  createdAt: string;
  updatedAt: string;
}
```

- **ScheduleBlock**: id, scheduleProfileId, blockType, dayOfWeek, start/end, label
- **PriorityProfile**: id, userId, priorityType (enum), weight
- **FrictionProfile**: id, userId, frictionType (enum), severity
- **HabitAnchor**: id, userId, anchorType (enum), label, time windows, daysMask, isCustom, createdAt
- **PersonalizationSettings**: id, userId, toneStyle, animationIntensity, sound, haptics, reducedMotion, notificationStyle, personalizationEnabled, timestamps

---

## Gameplay / Profile Seed Entities

- **UserGameProfile**: id, userId, displayName, avatarArchetype, themeId, level, xp, streak, onboardingState, timestamps
- **CompanionState**: id, userId, companionType, growthStage, moodState, lastInteraction
- **VillageState**: id, userId, themeId, stateVersion, serializedState, lastUpdatedAt

---

## Strategy / Recommendations Entities

- **UserStrategySnapshot**: id, userId, planning/focus/completion/balance/recovery/adaptation scores, snapshotDate, createdAt
- **RecommendationOutput**: id, userId, category, title, body, rationale, priority, sourceSnapshotId, createdAt, expiresAt

---

## DTO Design

- **Auth DTOs**: RegisterUserDto, VerifyEmailDto, LoginDto, RefreshTokenDto, LogoutDto
- **Onboarding DTOs**: SaveAvatarSelectionDto, SaveDisplayNameDto, SaveThemeSelectionDto, SaveLifeRoleSelectionsDto, SaveScheduleProfileDto, SaveScheduleBlocksDto, SavePrioritySelectionsDto, SaveFrictionSelectionsDto, SaveHabitAnchorsDto, SavePersonalizationSettingsDto, CompleteOnboardingDto
- **Group/Invitation DTOs**: AcceptInvitationDto, CreateInvitationDto, AssignRoleDto

---

## Auth Flow Specification

- **Registration**: RegisterUserDto → validate → create User, assign USER, create shells, send verification, return onboarding session
- **Email Verification**: VerifyEmailDto → verify code → mark emailVerified, issue tokens
- **Login**: Validate credentials → issue JWT, refresh token, include roles and onboarding state
- **JWT Claims**: sub, email, roles, scopeSummary, emailVerified, onboardingState, sessionId

---

## RBAC Guard Rules

- **USER**: manage own profile, quests, personalization, accept invitations
- **GROUP_MODERATOR**: moderate assigned groups, manage group challenges, invite users (scoped)
- **ADMIN**: assign/revoke roles, manage users/groups/invitations, access analytics, manage challenges/rewards, audit logs

---

## Recommended Controllers

- **AuthController**: /auth/register, /auth/verify-email, /auth/login, /auth/refresh, /auth/logout
- **OnboardingController**: /onboarding/state, /onboarding/avatar, /onboarding/display-name, /onboarding/theme, /onboarding/life-roles, /onboarding/schedule, /onboarding/schedule-blocks, /onboarding/priorities, /onboarding/frictions, /onboarding/habit-anchors, /onboarding/personalization, /onboarding/complete
- **LifeProfileController**: /life-profile/me, PATCH endpoints for schedule, priorities, frictions, habit-anchors
- **InvitationsController**: /invitations, /invitations/accept, /invitations/my-pending
- **RolesController**: (admin) /roles/assign, /roles/revoke, /roles/my, /roles/user/:userId
- **StrategyProfileController**: /strategy-profile/me, /strategy-profile/me/recommendations

---

## Service Layer Responsibilities

- **AuthService**: register, hash/verify passwords, issue/refresh/revoke tokens, email verification
- **RoleService**: role assignment, scope validation, permission resolution, promotion/demotion
- **OnboardingService**: step persistence, progression, world generation trigger
- **LifeProfileService**: save/update life roles, schedule, priorities, frictions, habit anchors, privacy-safe read model
- **PersonalizationService**: convert life profile to personalization, generate starter quests/world/nudges
- **InvitationService**: create/validate invitations, attach group memberships, assign scoped roles
- **StrategyProfileService**: compute strategy snapshots, expose profile data, generate recommendations

---

## Role Assignment & Privacy Rules

- Public signup: USER only
- Invitation: group membership, scoped moderator if permitted
- Admin: only admins can grant/revoke ADMIN
- Group creators may invite moderators (explicit policy)
- **Private by default:** life profile, friction, habit anchors, strategy, recommendations, reflections
- **Moderators:** see only aggregates, not private details
- **Admins:** access is auditable
- **AuditLog**: id, actorUserId, actionType, targetType, targetId, metadata, createdAt

---

## Copilot-Ready Prompt Packs

- **Auth + JWT + Sessions:** Create NestJS auth module with JWT, registration, email verification, login, refresh, logout, bcrypt, session persistence, DTOs, Swagger, guards, unit tests
- **RBAC:** Create RBAC module with Role, Permission, RolePermission, UserRoleAssignment (scoped), decorators, guards, audit
- **Life Profile:** Create life-profile module with entities, DTOs, services, private controllers, validation, unit tests
- **Onboarding Orchestration:** Create onboarding module for state tracking, avatar, display name, theme, life-profile, completion, world/quest generation, DTOs, services, controllers

---

## See also

- [Onboarding / Signup Blueprint](onboarding-signup-blueprint.md)

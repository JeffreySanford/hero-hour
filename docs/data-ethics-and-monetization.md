# Data Ethics & Monetization Design

## Guiding Principle

Use personal data to help the user first. Only monetize in ways that do not require betraying user trust.

---

## Allowed Data Uses

- Personalize quests, pacing, nudges, and coaching
- Adapt world, reminders, and challenge difficulty to user’s real behavior
- Provide user-facing insights and adaptive feedback
- Offer premium features (advanced strategy, deeper reports, premium content) based on in-app intelligence
- Sell aggregate, non-user-identifiable trend intelligence (e.g., "parents with shift-work schedules prefer evening micro-quests")
- Strictly opt-in, transparent partner offers (with separate consent, clear explanation, and easy revoke)

## Prohibited Data Uses

- Inferring and selling user-level personality types (e.g., MBTI) to third parties
- Creating or exporting user-linked marketing personas for sale
- Sharing or selling any user-level life-profile, friction, or strategy data without explicit, granular, revocable consent
- Bundling data sharing with core app use or coercing consent
- Hidden or surprise sharing of inferred traits

## Consent Model

- All personal data is private by default
- Users can skip, edit, or disable profiling categories
- Any partner/marketing data use is strictly opt-in, with clear, specific consent and easy revocation
- No core features require data sharing for external monetization
- All data sales/sharing are disclosed in privacy policy and user-facing settings

## Internal Play-Style Taxonomy (for in-app use only)

- **BehaviorStyleSnapshot**: Internal, adaptive, not exported
- **PlanningStyle**: STRUCTURED | FLEXIBLE | OVERCOMMITTING | MINIMALIST
- **FocusStyle**: DEEP_BLOCK | BURST | INTERRUPTED | ROUTINE_ANCHORED
- **MotivationStyle**: STREAK_DRIVEN | WORLD_BUILDER | ACHIEVEMENT_HUNTER | BALANCE_SEEKER
- **Example Feedback:**
  - "You currently play like a Strategic Builder."
  - "Your recent pattern suggests Adaptive Explorer."
  - "You’re strongest when working in short structured bursts."

## Monetization Options (Trust-Aligned)

- Subscription and premium plans (coaching, advanced analytics, premium content)
- Family/team dashboards and group features
- Aggregate, non-identifiable analytics products
- Strictly opt-in, transparent partner offers (never default)

## Data Architecture Recommendations

- Keep all profiling and strategy data internal and private by default
- Do not create or export MBTI or similar personality types for sale
- If a style model is used, keep it adaptive, explainable, and user-facing only
- All external data products must be aggregate and non-identifiable

## Regulatory & Platform Compliance

- Comply with GDPR, CCPA, and other privacy laws regarding profiling, data sale, and user rights
- Provide accessible deletion and opt-out controls
- Disclose all data practices in privacy policy and app store listings
- Audit all admin and partner data accesses

---

## See also

- [Onboarding / Signup Blueprint](onboarding-signup-blueprint.md)
- [Auth + RBAC + Life-Profile Architecture Spec](auth-rbac-life-profile-architecture.md)

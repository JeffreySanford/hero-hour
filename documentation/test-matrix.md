# Test Matrix: Web + Mobile

## Web (Angular + Playwright/Vitest)

1. Auth flow
   - [X] no token -> login page
   - [X] login success -> dashboard
   - [X] dashboard nav -> life-profile
   - [X] logout -> login
2. Content hierarchy
   - [X] dashboard cards order (api, world, sync)
3. Side quests
   - [X] cards displayed
   - [X] claim button updates state
4. Forms (consistency)
   - [X] hero-input focus states
   - [X] validation message shown for empty quest title

## Mobile (Flutter integration/widget)

1. Auth route guard
   - [X] no token -> login route
   - [X] token -> dashboard route
2. Login flow
   - [X] successful call sets token and redirect dashboard
   - [X] failed call shows error
3. Onboarding/life-profile
   - [X] first-run user -> life-profile route
   - [X] completed profile -> dashboard
4. Form controls
   - [X] text input styles and focus states
   - [X] helper/error hint verification

## Notes

- Use shared API contract from `api-interfaces` for model definitions.
- Keep navigation and state logic path consistent between apps.

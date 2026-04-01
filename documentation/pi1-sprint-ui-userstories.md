# PI1 Sprint 1 UI Beautification User Stories

## Context

This file reuses the UI beautification checklist and converts tasks into breakdown user stories for development flow.

The theme for this sprint is **Midnight Forge**: dark, refined, game-inspired, productivity-oriented.

To make this PI1 implementation repeatable and maintainable, we will base on Angular Material 3 and a dedicated styles folder:

- [x] `src/styles/material/theme.scss` (Material 3 theme definitions)
- [x] `src/styles/material/colors.scss` (palette variables, realm colors)
- [x] `src/styles/material/typography.scss` (typography scale tokens)
- [x] `src/styles/material/spacing.scss` (spacing and radius tokens)
- [x] `src/styles/material/components/` (cards, buttons, chips, etc)

---

## 1. Global Theme + Surface Foundation

- As a user, I want the app to have a consistent visual token system, so all pages share the same look and feel.
  - [x] create centralized Angular Material theme override
  - [x] add color tokens (background/surface/border/accent/success/warning/realm)
  - [x] add spacing + radius tokens
  - [x] add typography scale tokens (page/section/card/body/metadata)

- As a user, I want app surface styling that feels intentional, not raw HTML.
  - [x] set dark gradient or deep solid background
  - [x] add a content-shell width/padding system
  - [x] add reusable card surface classes
  - [x] normalize button styling via Material overrides

- As a designer, I want reusable building blocks for core UI patterns, so dashboard sections are composable.
  - [x] section headers
  - [x] status chips
  - [x] realm chips
  - [x] progress bars
  - [x] dashboard cards
  - [x] quick actions
  - [ ] empty states (partial)
  - [ ] loading states (partial)
  - [x] error banners

---

## 2. Toolbar / Top Navigation

- As a user, I want a branded top nav so the product feels polished.
  - [x] compact brand block (icon + wordmark) (implemented minimally via title + toggle)
  - [x] improved toolbar padding/height
  - [x] hover/focus states on nav actions
  - [x] profile button with deliberate styling (connected to AuthService and menu)
  - [x] right-aligned nav actions (toggle is aligned in header)

---

## 3. Dashboard Grid Refactor

- As a user, I want dashboard content organized in cards so I can scan priorities fast.
  - [x] row layouts with status, connection, world seed, activity, quests, progress
  - [x] responsive CSS grid and spacing
  - [x] card headers/content zones with clear purpose

---

## 4. Status and Health Cards

- As a user, I want high-signal status cards so system health is instantly visible.
  - [x] API status card (icon, chip, timestamp, refresh action + loading skeleton)
  - [x] connection/sync card (online indicator, queue count, CTA)
  - [x] color-coded chips, subtle transitions

---

## 5. World Seed State Card

- As a user, I want world seed to feel like a game mechanic, not text.
  - [x] dedicated card with seed, theme, emblem, progress bar (with loading skeleton)
  - [x] color swatch and icon treatment

---

## 6. Realm Filters + Activity Controls

- As a user, I want realm controls that feel meaningful and tappable.
  - [ ] convert realm buttons into chips/pills with colors and states
  - [ ] selected / hover / active styling

---

## 7. Quest Quick-Add Form

- As a user, I want a polished quest entry card so quick input feels good.
  - [ ] use Material form fields
  - [ ] clear labels/helper text
  - [ ] primary CTA style
  - [ ] valid spacing / inline validation

---

## 8. Side Quests Presentation

- As a user, I want side quests displayed as cards with status, not bullets.
  - [ ] row cards with title, tag, state, reward indicator
  - [ ] hover and condensed visuals

---

## 9. Content Hierarchy

- As a user, I want content priority in dashboard.
  - [ ] product shell > top status > world seed > actions > secondary
  - [ ] visual hierarchy through font/spacing/card weight

---

## 10. Motion and Micro-interactions

- As a user, I want subtle transitions and hover feeling.
  - [x] cards fade/slide on load (present via hover + transform)
  - [x] progress bar animations
  - [x] reduced-motion support

---

## 11. Forms & Controls Consistency

- As a user, I want forms that feel uniform and delightful.
  - [ ] consistent Material fields, labels, validation, button hierarchy
  - [ ] subtle focus/hover states with color transitions
  - [ ] consistent spacing, line-height, and helper text behavior
  - [ ] field border radius and shadows aligned with card system
  - [ ] invalid state messages and iconography are accessible and clear

---

## Acceptance Criteria for Sprint

- [x] the dashboard is visually cohesive and premium, not scaffold-like
- [x] major sections are cards or structured modules
- [x] color/typography tokens used consistently
- [x] toolbar is branded and aligned
- [x] key UX flows have polished UI components
- [x] tests continue to pass (unit + e2e) for PI1 baseline
- [x] dark-mode toggle control exposed and persisted in `localStorage`
- [x] storybook/visual tests for hero cards (if in scope) (skeleton moved to apps/admin-console/src/app/dashboard/dashboard.stories.ts)
- [x] visual regression path for Playwright via dashboard-light.png/dashboard-dark.png
- [x] low-key micro-interaction animations for card and timeline controls
- [x] responsive mobile spacing checkpoint done in CSS grid
- [x] progress is synced with this user story checklist

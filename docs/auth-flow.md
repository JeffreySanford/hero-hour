# Auth Flow (Canonical)

## Overview

This document defines the canonical cross-platform auth and navigation behavior for HeroHour.

### 1. App start

- Check for auth token (and curated state) in secure storage.
- If token missing or expired -> route to login.
- If token present -> route to dashboard.

### 2. Login success

- Write tokens and `hero-hour-authenticated=true`.
- Write user profile summary (optional: `hero-hour-user`, `hero-hour-profile-complete`).
- Navigate to `/dashboard`.

### 3. Dashboard vs life-profile

- Dashboard is primary post-login path.
- Life-profile is post-onboarding and available from nav.
- If profile is incomplete and first login, redirect to `/life-profile` (or in mobile, push route).

### 4. Route guard (both web & mobile)

- Guard presence:
  - `if (!isAuthenticated()) { redirect/login(); }`
  - `if (isAuthenticated() && path == '/login') { redirect('/dashboard'); }`

### 5. Logout

- Clear saved token/profile data.
- Hit `/api/auth/logout` (best effort).
- Redirect to login.

## API contract (shared)

- `POST /api/auth/login`  -> login response (accessToken/refreshToken)
- `POST /api/auth/logout` -> success
- `GET /api/life-profile` -> profile
- `POST /api/life-profile` -> upsert profile
- `GET /api/game-profile/:userId/quests` -> quests
- `GET /api/game-profile/:userId/side-quests` -> side quests
- `GET /api/game-profile/:userId/world-state` -> world state
- `POST /api/game-profile/:userId/activity` -> log activity
- `POST /api/game-profile/:userId/side-quests/:id/claim` -> claim

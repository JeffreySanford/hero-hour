# Sprint 3.3: Quest celebration and completion motion

## Goal

Make quest completion, side-quest claiming, and progress updates feel rewarding and game-like across the Angular and Flutter frontends without degrading performance, accessibility, or clarity.

## User Story

As a HeroHour user, I want completing a quest or claiming a side quest to trigger a polished animated celebration so that progress feels satisfying, visible, and emotionally rewarding instead of transactional.

## Description

HeroHour already frames product actions as quests, side quests, world progress, and realm activity. The current UI language already supports a game-inspired experience, but most key state changes still resolve as immediate text or layout updates. This story converts the highest-value task completion moments into feedback loops that feel intentional and memorable.

The scope covers both:

- `apps/admin-console` for Angular web
- `apps/mobile_flutter` for Flutter mobile/web

The implementation should focus on high-signal interaction moments that directly reinforce user effort:

- completing a quest
- claiming a side quest
- seeing XP/progress advance
- recognizing that the system accepted the action successfully

This should not become decorative animation for its own sake. The motion must support comprehension:

- what changed
- why it changed
- what reward or progression the user earned
- what state the item is now in

Angular should implement this with restrained but expressive motion using CSS transitions, Angular animation primitives, SVG, or compact Lottie if needed for isolated effects. Flutter should implement the same behavioral patterns with richer composition and tighter timing where appropriate.

## UX Intent

- Reinforce completion as an achievement moment.
- Make status changes legible without requiring the user to re-scan the full page.
- Support the game layer already implied by the product vocabulary.
- Keep motion short, responsive, and professional rather than flashy or childish.

## Current Surfaces

- Angular quest list and side-quest list in `apps/admin-console/src/app/dashboard/`
- Flutter quest list and side-quest cards in `apps/mobile_flutter/lib/main.dart`
- Existing world progress visuals in both frontends should animate in response to completion

## Tasks

- [x] Review current quest and side-quest completion flows in Angular and Flutter and document every state transition that currently snaps abruptly.
- [ ] Define a shared animation vocabulary for completion moments:
  - [x] enter
  - [x] success pulse
  - [ ] progress increment
  - [ ] completed-state settle
- [x] Add quest completion animation for Angular:
  - [x] animate card emphasis on click
  - [x] animate success/check state
  - [x] animate progress bar change
  - [x] visually settle item into completed state
- [x] Add side-quest claim animation for Angular:
  - [x] reward pulse
  - [x] completed badge reveal
  - [x] state transition with no hard flicker
- [x] Add quest completion animation for Flutter:
  - [x] tactile press response
  - [x] success state reveal
  - [x] progress increment animation
  - [x] completed card rest state
- [x] Add side-quest claim animation for Flutter:
  - [x] reward emphasis
  - [x] subtle celebratory glow or icon pulse
  - [x] final completed state
- [x] Add world progress synchronization so completion events animate the related progress indicator instead of jumping to the new value instantly.
- [x] Ensure repeated actions or rapid sequential completions do not produce broken or overlapping animations.
- [x] Add a reduced-motion fallback for both frontends:
  - [x] shorter duration
  - [x] no large scale transforms
  - [x] no unnecessary particle effects
- [x] Add unit/component/widget tests where practical for completion state changes and DOM/widget rendering after animation-triggering actions.
  - [x] tiny direct helper test for `activateCompletionAnimation()` verifies immediate set + timeout clear
- [x] Add e2e or smoke coverage for at least one completion interaction in Angular and one in Flutter to ensure motion wiring does not break the underlying success flow.
  - [x] minimal Flutter widget test for side quest claim and world-progress update

## Implementation Notes

1. Angular direction
   - [x] Prefer transform and opacity over layout-heavy animation.
   - [x] Avoid animations that force expensive reflow on large lists.
   - [x] Keep completed-state styling stable once the animation ends.
   - [x] Consider animating:
     - [x] checkmark draw
     - [x] reward badge pulse
     - [x] progress-fill interpolation
     - [x] card elevation/glow transition

2. Flutter direction
   - [x] Prefer implicit or controller-driven animations attached directly to quest card state.
   - [x] Use composited effects sparingly and keep them synchronized with success state changes.
   - [x] Avoid long cinematic motion on routine repeated actions.
   - [x] Consider animating:
     - [x] scale + glow on tap success
     - [x] value tween for progress
     - [x] AnimatedSwitcher or animated badge replacement
     - [x] small particle/spark accent only if it remains performant and restrained

3. Shared product behavior
   - [x] Success feedback should start immediately when the action is accepted locally or when the request succeeds.
   - [x] If a backend failure occurs, the system must not leave the card in a false completed state.
   - [x] Completion motion must never prevent the user from continuing to use the dashboard.

## Acceptance Criteria

- [x] Quest completion in Angular produces a visible success transition rather than an abrupt static state change.
- [x] Side-quest claim in Angular produces a visible reward/completion transition rather than an abrupt static state change.
- [x] Quest completion in Flutter produces a visible success transition rather than an abrupt static state change.
- [x] Side-quest claim in Flutter produces a visible reward/completion transition rather than an abrupt static state change.
- [x] Related world progress indicators animate smoothly from previous value to next value in both frontends.
- [x] Completed items end in a clear final visual state that remains readable after the animation finishes.
- [x] No animation blocks input for longer than the completion interaction requires.
- [x] Reduced-motion users receive a simplified version that preserves clarity while minimizing motion intensity.
- [x] The completion interaction remains performant on standard laptop browsers and mid-tier mobile devices.
- [x] Under failure conditions, users receive accurate feedback and the UI does not falsely present an item as completed.

## Exit Strategy

- Demo one quest completion and one side-quest claim in Angular.
- Demo one quest completion and one side-quest claim in Flutter.
- Validate reduced-motion behavior in both surfaces.
- Verify that all success, failure, and rapid-repeat cases leave the UI in a correct state.

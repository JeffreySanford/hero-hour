# Sprint 3.4: World-state and realm-activity motion system

## Goal

Bring the dashboard world-state layer to life so that realm activity, world seed progress, and dashboard ambience react to user actions in a way that feels alive, game-like, and still professional.

## User Story

As a HeroHour user, I want the dashboard world state and realm activity controls to visually react to my actions so that the application feels responsive, immersive, and connected to my progress.

## Description

HeroHour’s dashboard already presents a strong game frame:

- world seed state
- realm color
- forge iconography
- activity chips
- progress bars
- quest progression

Today, most of those elements update as static value changes. This story introduces a coordinated motion system for the dashboard’s ambient layer and action-response layer so that the world appears responsive rather than decorative.

The intended result is not a noisy animated dashboard. The result should be a subtle “living board” effect:

- a calm ambient background with minor motion
- clear activity feedback when the user logs an action
- visible progress interpolation when world values change
- stronger thematic connection between user behavior and the world-state model

This story applies to both Angular and Flutter, but the execution should differ by platform capability:

- Angular should remain lightweight and efficient with CSS/SVG/Angular animations
- Flutter can use smoother layered motion and higher-fidelity transitions

## UX Intent

- Make realm activity feel consequential.
- Show that the dashboard is a system that responds to user actions.
- Increase delight without reducing usability.
- Keep the motion language aligned with “forge / realm / progress / identity,” not abstract tech animation.

## Scope

In scope:

- world-state card
- realm activity chips/buttons
- progress-fill behavior
- icon or emblem response
- subtle ambient dashboard motion

Out of scope:

- full-screen intro cinematic
- unrelated decorative animation in forms or utility pages
- audio or haptic feedback unless separately planned

## Tasks

- [x] Audit current Angular and Flutter dashboard elements that represent world-state data and activity selection.
- [x] Define a motion system that distinguishes:
  - [x] ambient motion
  - [x] hover/focus/pressed motion
  - [x] success/update motion
  - [x] idle/rest state
- [x] Add subtle ambient motion to Angular dashboard background or world-state region:
  - [x] soft glow drift
  - [x] low-contrast grid movement
  - [x] restrained emblem shimmer
- [x] Add realm-activity selection feedback in Angular:
  - [x] pressed state
  - [x] active state transition
  - [x] world progress response
- [x] Add world-state progress interpolation in Angular so value changes animate smoothly.
- [x] Add subtle ambient motion to Flutter dashboard background or world-state region with platform-appropriate performance constraints.
- [x] Add realm-activity selection feedback in Flutter:
  - [x] responsive chip/button motion
  - [x] progress pulse
  - [x] icon or seed response
- [x] Add world-state progress interpolation in Flutter so value changes animate smoothly and clearly.
- [x] Ensure the selected activity state remains understandable after the animation completes.
- [x] Add guardrails to prevent distracting infinite motion:
  - [x] cap animation amplitude
  - [x] cap duration
  - [x] avoid stacking multiple ambient loops that compete visually
- [x] Add reduced-motion handling for both frontends.
- [x] Add verification coverage that confirms selected activity state, world progress values, and persistence still behave correctly after animation changes.

## Detailed Behavior Proposal

1. Ambient world motion
   - Slow, nearly imperceptible grid or glow movement behind the world-state surface.
   - Gentle icon breathing or aura pulse at low frequency.
   - Background motion should pause or simplify in reduced-motion environments.

2. Activity selection response
   - On press/tap, selected realm activity should acknowledge input immediately.
   - The active chip should transition into a stronger “chosen” state.
   - The world-state card should respond with a short linked reaction:
     - progress fill nudge
     - icon flare
     - color accent pulse

3. Progress update behavior
   - World progress should tween to the new value rather than snap.
   - The label/value should remain readable during motion.
   - The visual change should support comprehension, not hide it.

4. Accessibility
   - Motion must not be required to understand the state.
   - Selection state must remain visible through color, label, border, and/or icon treatment.
   - Keyboard focus, hover, and touch interactions must remain distinct.

## Technical Considerations

Angular:

- Favor GPU-friendly transforms and opacity.
- Avoid expensive DOM churn inside dashboard lists.
- Keep animations component-scoped when possible.
- Prefer small, reusable classes or animation triggers over one-off inline rules.

Flutter:

- Use built-in animation primitives for clear state-driven transitions.
- Separate ambient loops from event-driven motion so they can be paused or simplified.
- Avoid continuous animation that materially affects battery or frame rate.

## Acceptance Criteria

- Realm activity selection in Angular produces immediate visible feedback and a stable selected state.
- Realm activity selection in Flutter produces immediate visible feedback and a stable selected state.
- World-state progress changes animate smoothly in Angular without jank or layout instability.
- World-state progress changes animate smoothly in Flutter without jank or layout instability.
- Ambient dashboard motion is subtle, theme-consistent, and does not distract from primary task completion.
- Selected activity remains understandable after the animation completes and after page/app refresh where persistence exists.
- Reduced-motion mode provides a simplified and less animated version while preserving state clarity.
- Keyboard, mouse, and touch interactions remain usable and visibly distinct.
- Performance remains acceptable on standard desktop browsers and mid-tier mobile hardware.

## Exit Strategy

- Demo dashboard idle state and one realm activity interaction in Angular.
- Demo dashboard idle state and one realm activity interaction in Flutter.
- Confirm reduced-motion behavior and verify persisted activity state remains correct.

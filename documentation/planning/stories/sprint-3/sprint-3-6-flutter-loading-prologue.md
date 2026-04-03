# Sprint 3.6: Flutter loading prologue and branded app-entry animation

## Goal

Create a professional Flutter-first branded loading/prologue experience that communicates HeroHour’s product identity during cold start and transitions smoothly into the usable application without introducing unnecessary wait time.

## User Story

As a HeroHour user, I want to see a polished branded loading or entry animation before the app becomes interactive so that the product feels premium, coherent, and purpose-built around time tracking, task completion, and daily progress.

## Description

Flutter is the right primary platform for a premium HeroHour intro because it offers tighter control over composition, frame timing, transitions, and full-screen visual polish than the current Angular surface. Angular can still receive a lighter branded loader, but this story is explicitly Flutter-first.

The loading/prologue sequence should not feel like a disconnected marketing splash. It should communicate the app’s functional identity:

- time tracking
- task completion
- daily grid progression
- world/realm activation
- identity/profile framing

The preferred direction is for the sequence to operate as the application’s opening state rather than a separate pre-app animation that disappears and then reloads into a different visual language. In practical terms, the intro should feel like the app is “assembling itself”:

- timeline begins
- grid cells fill
- tasks are checked
- world seed ignites
- dashboard or login becomes ready

This creates a stronger brand impression while still respecting startup performance and user impatience.

## Product Intent

- Replace “blank wait” with meaningful branded motion.
- Use the opening seconds to explain the product emotionally without text-heavy onboarding.
- Make the app feel polished and premium.
- Ensure the animation supports, rather than delays, first interaction.

## Status

- Implemented Flutter prologue entry flow in `apps/mobile_flutter/lib/main.dart`.
- Prologue includes step progression (time, grid, tasks, world activation), adaptive duration, reduced-motion behavior, and timeout fallback.
- Added Flutter widget tests in `apps/mobile_flutter/test/widget_test.dart` for:
  - cold start prologue to login
  - warm start short prologue to dashboard
  - reduced-motion behavior
  - slow initialization with fallback state timeout
- Verified all Flutter tests pass (`flutter test`).

## Scope

Primary scope:

- Flutter cold start / first interactive transition
- branded entry motion tied to HeroHour concepts
- transition into login or dashboard

Secondary scope:

- define whether Angular receives a small thematic loading treatment later
- document the lighter Angular counterpart recommendation

Out of scope:

- long cinematic trailer
- mandatory onboarding carousel
- audio
- startup motion that blocks the app after data is already ready

## Tasks

- [x] Define the narrative arc of the Flutter loading prologue:
  - time begins
  - grid activates
  - tasks/checkmarks appear
  - world seed or forge emblem ignites
  - app shell resolves into usable state
- [x] Create visual design references for the sequence using the existing HeroHour palette and dashboard motifs.
- [x] Decide whether the sequence is:
  - a cold-start only intro
  - a conditional loader while required app state initializes
  - both, with shortened warm-start behavior
- [x] Implement the Flutter intro/loading container as part of the app entry path in `apps/mobile_flutter/lib/main.dart` or extracted widgets.
- [x] Create smooth transition logic from prologue into:
  - login screen when unauthenticated
  - dashboard when authenticated
- [x] Add logic so the intro can shorten or finish early when initialization completes quickly.
- [x] Add safeguards so the intro does not artificially prolong startup if required data is already available.
- [x] Add reduced-motion fallback:
  - static or lightly animated brand state
  - no cinematic sequence
- [x] Add failure/slow-start behavior so a stuck network or backend does not trap the user in a perpetual animation.
- [x] Add test coverage for entry flow states:
  - cold start
  - warm start
  - reduced motion
  - slow initialization
  - failure fallback
- [x] Document a lighter Angular equivalent recommendation for future parity:
  - branded loading card
  - brief progress shimmer
  - no full cinematic dependency

## Detailed Sequence Proposal

1. Opening frame
   - Dark forge-like backdrop already aligned with the existing Flutter visual system.
   - A central emblem, clock mark, or seed marker appears.

2. Time-tracking cue
   - A line, dial, or segmented timeline begins moving.
   - Motion should imply time progressing rather than generic loading.

3. Daily-grid cue
   - Small cells or a compact board illuminate in sequence.
   - Different categories can appear as distinct accents.

4. Task completion cue
   - One or more task marks animate from pending to checked.
   - This should read as progress, not confetti.

5. World activation cue
   - The forge/realm/world icon ignites or pulses once.
   - The motion should imply “your day is ready” or “your world is loaded.”

6. Transition to app
   - The prologue should dissolve or morph into the app shell.
   - The user should not perceive a hard cut between intro and application.

## Design Constraints

- Duration target should generally stay in the 2-4 second range on cold start.
- If startup work finishes earlier, the sequence should abbreviate gracefully.
- If startup work takes longer, the prologue should shift into an honest loading state rather than looping theatrically forever.
- Motion should feel premium, restrained, and product-relevant.
- The sequence should remain readable on mobile, tablet, desktop, and Flutter web targets if supported.

## Angular Consideration

Angular can support a smaller complementary loader, but a full equivalent cinematic intro is not required for this sprint. The recommended Angular treatment is:

- brief branded loading surface
- subtle shimmer or grid reveal
- fast handoff into usable content

This preserves parity of tone without forcing the web app into a heavier startup experience than it needs.

## Acceptance Criteria

- Flutter displays a professional branded app-entry animation or loading prologue on cold start.
- The prologue visually communicates HeroHour themes of time tracking, checked tasks, daily progression, and world activation.
- Transition from prologue to login or dashboard is smooth and does not flash blank or unrelated intermediate states.
- The intro does not artificially block access longer than necessary once required startup conditions are satisfied.
- Warm or already-ready starts use a shortened or simplified version rather than replaying a long full sequence.
- Reduced-motion users receive a simplified non-cinematic alternative.
- Slow-load and failure conditions are handled explicitly so users are not trapped inside an endless decorative loop.
- The implementation is maintainable and integrated into the app-entry flow rather than bolted on as an isolated splash artifact.
- Documentation includes a recommendation for a lighter Angular counterpart.

## Exit Strategy

- Demo cold-start Flutter entry animation from launch to usable app shell.
- Demo shortened or skipped warm-start behavior.
- Demo reduced-motion fallback.
- Confirm slow-start handling transitions into an honest loading or retry-capable state rather than looping indefinitely.

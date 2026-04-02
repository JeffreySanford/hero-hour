# Sprint 1.4 – Feature 1.4: Mode Switching (Casual / Pro)

## Goal

Implement and ship mode switching UX and persistence for Casual/Pro.

## Acceptance Criteria

- mode selection persists after reload (localStorage)
- mode does not mutate core session data
- UI updates are style-only (casual/pro presentation)

## Tasks

- Add `ModeService` in admin-console
- Add toggle in app bar or dashboard
- Apply CSS class changes for modes
- Add unit tests for persistence + reload
- Add e2e mode persistence test

## Done

- [x] Implemented
- [x] Test coverage added
- [x] Docs + PI updates done

### Notes

- Added API controller tests for normal and duplicate `POST /api/life-profile` paths.
- Added e2e life-profile route stub in `apps/admin-console-e2e/src/example.spec.ts` for UI-driven stability.
- Updated docs and sprint completion flags.

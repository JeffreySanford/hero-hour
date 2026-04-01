# Sprint 1.8 – Feature 1.8: Life-Profile API + Flutter Client finalization

## Goal

Complete final testing, exit criteria, and documentation for Life-Profile API + Flutter client.

## Status

- API: implemented and unit-tested
- Angular: implemented life-profile form + e2e flow
- Flutter: form implemented, integration test exists

## Finalization tasks

- [x] Record final integration protocol in doc
- [x] Run real API against Flutter integration test:
  - `npm run start:api`
  - `npm run test:mobile:integration`
- [x] Add CI gating note to include this path in `ci-flutter`

## Exit Criteria

- `pnpm exec nx test api` passes
- `pnpm exec nx test admin-console` passes
- `npm run test:mobile` passes
- `npm run test:mobile:integration` passes against live local API
- `PI-1` documentation has Feature 1.8 status, link to test command
- merge commit and release note includes "life-profile API + Flutter integration validated"

## Notes

Feature 1.8 is complete and currently test-verified; this story tracks the final confirmation and CI ready state.

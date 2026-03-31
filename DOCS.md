# Hero Hour Repo Analysis and Next Steps

## Current status
- Monorepo with Angular admin, Nest API, Playwright & Jest in place.
- Core tests pass for admin and API after a series of fixes.
- `start:all` now runs; API + admin build pipeline is stable.
- Shared modules (`api-interfaces`, `domain`, `shared-types`, `util`) exist but should be formalized as Nx libs.

## Growth plan

### Sprint 1: true integrated vertical slice
1. Finish life-profile complete path:
   - Angular form, typed service, guard, API endpoint wiring, shared DTOs
   - In-memory repository implementation in backend
   - e2e scenario: login -> life-profile submit -> fetch
2. Add a real persistence or mock persistence layer.
3. Add contract tests for DTO alignment.

### Sprint 2: shared code normalization
- Turn root shared folders into managed libs.
- Update `nx.json` and `tsconfig.base` paths.
- Add internal boundaries and lint rules.

### Sprint 3: operational trimming
- Change `start:all` to explicit project query to reduce risk.
- Add local env / proxy documentation (`apiBaseUrl`, ports, JWT).

### Sprint 4: test strategy & product behavior
- Keep unit tests around:
  - Health service
  - Route guards
  - Life profile form behavior
  - Dashboard state
- Keep e2e focused on behavior, not coverage.

## Mobile Flutter next phase
- Add `apps/mobile-flutter` as player surface.
- Keep Angular admin as internal tooling surface.
- Connect to same Nest endpoints and DTO contracts.
- Priority first mobile slice:
   1. Splash/login/onboarding + life-profile
   2. Submit + fetch profile -> dashboard
   3. Add quest flow later.

## Checklist for commits
- `git add -A` + `git commit` + `git push` on each phase
- API and UI tests must be green before each integration story merge.
- Document decisions in `README.md` and `DOCS.md`.

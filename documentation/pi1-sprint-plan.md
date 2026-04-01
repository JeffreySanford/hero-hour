# PI1 Sprint Plan (1-10)

## Sprint 1: README replacement (PI1 hygiene)

- Story: As a contributor, I need a project-specific README so developers onboard fast.
- Acceptance:
  - `README.md` includes project purpose, architecture, run commands, ports, milestone status.
  - `README` no longer contains generic Nx starter text.

## Sprint 2: Shared code formalization

- Story: As an architect, I need shared components to be explicit Nx libs, removing ambiguity.
- Acceptance:
  - `api-interfaces`, `domain`, `shared-types`, `util` are formal Nx libs under `libs/` (or workspace packages with docs).
  - Apps and libs compile and tests pass.

## Sprint 3: Script tightening

- Story: As a maintainer, I need explicit scripts for serve/build/test without `run-many --all`.
- Acceptance:
  - `start:admin`, `start:api`, `start:mobile`, `start:all` (concurrently) target specific projects.
  - `build:all` is explicit `nx run-many -t build -p (...)`, no aggressive `--all`.

## Sprint 4: Simple contract slice + federation

- Story: As a product engineer, I need at least one shared contract set (Auth + Health).
- Acceptance:
  - [X] Shared DTO/enum in `libs/api-interfaces`: `LoginDto`, `LoginResponse`, `HealthResponse`.
  - [X] API and frontend import same types.
  - [X] API route (`/auth/login`, `/health`) uses shared types.

## Sprint 5: Contract validation tests

- Story: As QA, I need tests verifying shared contracts are synchronized.
- Acceptance:
  - [X] API unit tests ensure `LoginResponse` shape.
  - [X] Frontend service tests check expected fields.
  - [X] e2e asserts `/auth/login` returns contract.
  - [X] CI pass.

## Sprint 6: start:all fail mode & Flutter device fixed

- Story: As a dev, I need `start:all` to run reliably in bash and not abort due missing Flutter device.
- Acceptance:
  - [X] `start:mobile` set to `flutter run -d chrome` (or specific device).
  - [X] `start:all` uses `concurrently -k -n frontend,api,mobile`.
  - [X] Dev run works with all components alive.

## Sprint 7: PI1 closeout doc

- Story: As stakeholder, I need formal PI1 closeout notes.
- Acceptance:
  - [X] `documentation/pi-1-closeout.md` with achieved, deferred, debt.
  - [X] includes transitive "this is door to PI2".

## Sprint 8: Architecture and test docs

- Story: As team, we need architecture doc + testing guide.
- Acceptance:
  - [X] `documentation/architecture.md` with at least one diagram or mermaid.
  - [X] `documentation/testing.md` explains unit/e2e flow and how to run.
  - [X] Contains new quick restart scripts.

## Sprint 9: CI / lint follow-ups

- Story: As dev ops, I need smoke in CI that validates P1 contract and scripts.
- Acceptance:
  - [X] `pnpm nx test admin-console && pnpm nx test api && pnpm nx e2e ...` in CI.
  - [X] lint pass and nomimal coverage required.

## Sprint 10: PI1 acceptance review + handoff

- Story: As Product, I need final signoff with closure criteria.
- Acceptance:
  - [X] Checklist from PI1 done: README, shared libs clarity, scripts explicit, contract baseline, closeout doc.
  - [X] Demonstration run and signoff notes captured.

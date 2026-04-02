# Sprint 2.1: Full life-profile domain contract

## Goal

Implement the full life-profile domain contract in shared interfaces and enforce through NX lint tests.

## Description

Close the data contract for PI2 by extending `libs/api-interfaces` to include life-profile types and ensuring API + frontend compile against the same schemas.

## Tasks

- [X] Add life-profile domain DTOs to `libs/api-interfaces` (request/response/model).
- [X] Add shared-enum definitions for profile status, role, privacy settings.
- [X] Update `api` endpoint definitions to use shared contract types.
- [X] Update `admin-console`/`mobile_flutter` services to consume shared contract types.
- [X] Add NX lint rule and tests that fail if `api-interfaces` contract diverges.
- [X] Add contract docs snippet and examples in `documentation/auth-rbac-life-profile-architecture.md`.
- [X] Add e2e assertion in `admin-console-e2e` for life-profile contract payload and response shape.
- [X] Add `api-interfaces` schema verify tests to assert `LifeProfile` request/response semantics.

## Offer / "teklif" behavior plan (pre-sprint-2.2)

This plan codifies behavior and contract expectations for sprint 2.1 completion and should be used to drive the next CI gating step.

1. Behavior goal
   - User chooses life-profile values and submits via UI.
   - Backend receives `LifeProfileRequest` and responds with full `LifeProfile` contract.

2. Contract payload specifics
   - Request contains: `userId`, `firstName`, `lastName`, `age`, `preferredRole`, optional `roles`, `schedule`, `priorities`, `frictionPoints`, `habitAnchors`, `privacy`.
   - Response contains added required fields: `status`, `privacy`, `createdAt`, `updatedAt`, and complete contract array/objects.

3. Runtime test assertions
   - `admin-console-e2e`: POST `/api/life-profile` returns `201`, status='active', privacy='private', roles includes the preferred role, createdAt/updatedAt exist.
   - `api-interfaces`: snapshot + object containing enforcement.

4. CI/KPI enforce
   - If any contract property is missing, fail pipeline in step 2.2.
   - This is pre-2.2: contract defined, validated, and now ready for strict coverage gating.

## Acceptance Criteria

- `nx lint api-interfaces` passes and catches a manual contract mismatch in a test case.
- Build of `api`, `admin-console`, and `mobile_flutter` passes after contract changes.
- Contract doc section exists and references new DTOs.
- `admin-console-e2e` includes a dedicated life-profile contract assertion that validates full LifeProfile response shape.
- `api-interfaces` tests include versioning/snapshot contract check plus type-compatibility assertions.

# Sprint 2.1: Full life-profile domain contract

## Goal

Implement the full life-profile domain contract in shared interfaces and enforce through NX lint tests.

## Description

Close the data contract for PI2 by extending `libs/api-interfaces` to include life-profile types and ensuring API + frontend compile against the same schemas.

## Tasks

- [ ] Add life-profile domain DTOs to `libs/api-interfaces` (request/response/model).
- [ ] Add shared-enum definitions for profile status, role, privacy settings.
- [ ] Update `api` endpoint definitions to use shared contract types.
- [ ] Update `admin-console`/`mobile_flutter` services to consume shared contract types.
- [ ] Add NX lint rule and tests that fail if `api-interfaces` contract diverges.
- [ ] Add contract docs snippet and examples in `documentation/auth-rbac-life-profile-architecture.md`.

## Acceptance Criteria

- `nx lint api-interfaces` passes and catches a manual contract mismatch in a test case.
- Build of `api`, `admin-console`, and `mobile_flutter` passes after contract changes.
- Contract doc section exists and references new DTOs.

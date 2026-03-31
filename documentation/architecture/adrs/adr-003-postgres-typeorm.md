# ADR-003: PostgreSQL + TypeORM for Structured Domain Data

## Decision

Favor relational persistence for auth, roles, life profile, planning, and progression.

## Rationale

- Strong fit for relations, role scopes, snapshots, reporting, and analytics rollups

## Tradeoffs

- Some highly dynamic world state may require JSON support or hybrid tables

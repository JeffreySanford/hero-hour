# hero-teklif service

## Overview

`hero-teklif` is a small Node service that validates and exposes the TEKLIF contract in the stack.
It reads/writes Redis state and provides contract metadata and health endpoints.

## Local startup

1. Build service:
   ```bash
   docker build -t hero-teklif ./services/hero-teklif
   ```
2. Bring up infrastructure:
   ```bash
   pnpm run docker:ensure-teklif
   ```
3. Verify health:
   ```bash
   curl http://localhost:4000/health
   curl http://localhost:4000/contract
   ```

## Startup flow (embedded in `start:all`)

1. Ensure `hero-redis` and `hero-teklif` exist and pass health checks (via `scripts/ensure-docker-teklif.sh`).
2. Seed required keys:
   - `teklif:ready` => `1`
   - `teklif:version`
   - `teklif:last-start`
   - `app:settings` (feature toggle and session TTL)
3. Start services:
   - `pnpm start:api`
   - `pnpm start:admin`
   - `pnpm start:mobile`

## Verification assertions

- `curl http://localhost:4000/health` responds 200 with status `ready`.
- `curl http://localhost:4000/contract` returns contract details including required fields.
- `docker exec hero-redis redis-cli GET "teklif:ready"` returns `1`.
- `docker exec hero-redis redis-cli HGETALL "app:settings"` includes `feature.teklif`.

## Health contract for application code

- `LifeProfile` response required fields:
  - `userId`, `firstName`, `lastName`, `age`, `preferredRole`
  - `roles`, `schedule`, `priorities`, `frictionPoints`, `habitAnchors`
  - `status`, `privacy`, `createdAt`, `updatedAt`

- `hero-teklif` should provide this contract shape in endpoint assertions.

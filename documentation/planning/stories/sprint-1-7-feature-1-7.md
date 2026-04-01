# Sprint 1.7 – Feature 1.7: Offline Reliability and Sync

## Goal

Implement offline queue/sync for reliable tracking while disconnected.

## Acceptance Criteria

- quest timing works offline
- local queue persists unsynced actions
- reconnect sync is safe and clear

## Tasks

- add offline queue layer in local storage
- add sync-on-reconnect logic with conflict safe merge
- add status indicator (offline/syncing/online)
- add tests for offline queue and reconnect path

## Done

- [ ] Implemented
- [ ] Test coverage added
- [ ] Docs updated

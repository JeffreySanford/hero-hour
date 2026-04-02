# api-interfaces

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build api-interfaces` to build the library.

## Running unit tests

Run `nx test api-interfaces` to execute the unit tests via [Jest](https://jestjs.io).

## Shared API model contract

This package defines canonical API interfaces used by both Angular and Flutter:

- `HealthResponse` (API health)
- `LoginResponse` (auth token payload)
- `UserProfile` (life-profile payload)
- `Quest`, `SideQuest`, `WorldState` (game profile payloads)

Do not duplicate these types in app-specific code.

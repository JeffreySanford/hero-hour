# System Architecture Diagram (Mermaid)

```mermaid
flowchart TD
    subgraph Mobile App (Flutter)
        A1[User
        (Avatar, Village, Quests)]
        A2[Flutter UI
        (Riverpod, Flame, Rive, Animations)]
        A3[Game State Mgmt
        (XP, Quests, Village)]
        A4[WebSocket Client
        (Real-time Timer)]
        A5[REST API Client
        (Dio)]
    end
    subgraph Backend
        B1[NestJS API
        (Game Layer, DTOs, XP, Badges)]
        B2[PostgreSQL
        (Game Data, Quests, Village)]
        B3[Node.js WebSocket
        (Time Tracking, Auditing)]
        B4[MongoDB
        (Legacy Time Logs)]
    end
    A1 --> A2
    A2 --> A3
    A3 --> A4
    A3 --> A5
    A4 --> B3
    A5 --> B1
    B1 --> B2
    B3 --> B4
    B1 --> B3
```

**Description:**

- The Flutter mobile app manages all game UI, animations, and state.
- Real-time timer updates use WebSocket to the legacy Node.js backend.
- During scaffolding, the flow was validated with a new player flow: onboarding -> timer loop -> XP events -> village state.
- API contract docs were added/updated in `docs/architecture/api-contracts.md` to reflect route coverage.
- All game data (XP, quests, badges, village) is handled by the new NestJS API and stored in PostgreSQL.
- Legacy time logs and auditing remain in MongoDB.
- The architecture allows seamless toggling between Casual (game) and Pro (agile) modes.

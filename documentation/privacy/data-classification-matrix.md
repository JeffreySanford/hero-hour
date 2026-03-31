# Data Classification Matrix

| Data Type         | Purpose               | Sensitivity | Access Scope        | Retention Policy      |
|-------------------|-----------------------|-------------|---------------------|-----------------------|
| Auth Identity     | Login/auth            | High        | User, Admin         | Until account deleted |
| Life Profile      | Personalization       | High        | User (private)      | User-controlled       |
| Game Progression  | Gameplay              | Medium      | User, Admin (agg.)  | Until account deleted |
| Strategy Profile  | Private coaching      | High        | User (private)      | User-controlled       |
| Analytics Events  | Product improvement   | Low         | Admin (agg.)        | 2 years (default)     |
| Reflection/Review | Self-improvement      | High        | User (private)      | User-controlled       |
| Habit Anchors     | Quest personalization | Medium      | User (private)      | User-controlled       |
| Admin Logs        | Security/audit        | High        | Admin               | 2 years (default)     |

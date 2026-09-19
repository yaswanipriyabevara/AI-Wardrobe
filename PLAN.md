# StyleSync AI — Engineering & Demo Plan

## Product flow

Login → Wardrobe → upload/tag → Outfit Planner → weather + occasion → recommendations → wardrobe gaps → outfit rating → insights → optional calendar export.

## Architecture

- **Frontend:** React + Vite, responsive UI, local demo persistence.
- **API:** Express with route/service separation.
- **AI layer:** provider adapter with strict JSON validation and demo-safe rule fallback.
- **Authentication:** JWT access tokens with scrypt password hashing.
- **Storage:** versioned, atomic per-user JSON storage for offline/demo mode; optional Supabase/PostgreSQL persistence for deployment.
- **Weather:** Open-Meteo, no API key required.
- **Testing:** Node built-in test runner for outfit recommendation rules.

## Quality gates

1. `npm.cmd run build` in `frontend/` must pass.
2. `npm.cmd test` in `backend/` must pass.
3. Invalid image, coordinates, tags and profile payloads must return clear 4xx responses.
4. Protected API routes must reject missing/expired JWTs.
5. No secrets are committed.
6. Demo remains usable without an AI key through the deterministic fallback.

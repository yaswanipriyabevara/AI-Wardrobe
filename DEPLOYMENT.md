# Deployment

## Frontend — Vercel

Deploy the repository root. The root `vercel.json` points Vercel at the Vite frontend and preserves SPA routes.

## Backend — Render/Railway

Set:

- `PORT`
- `JWT_SECRET`
- `FRONTEND_ORIGIN`
- `AI_PROVIDER` (`mock` is demo-safe)
- AI provider key only when using a real provider
- `STORAGE_PROVIDER=supabase`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Create the `stylesync_state` table using `backend/SUPABASE_SCHEMA.sql`.

The backend reports its selected AI provider and storage provider at `/api/health`.

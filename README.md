# StyleSync AI — AI Wardrobe & Outfit Planner

StyleSync AI is a polished React + Vite wardrobe assistant with an optional Express API. It combines a photo-backed wardrobe, weather-aware outfit planning, wardrobe-gap analysis, outfit feedback, insights and calendar export.

## Highlights

- Responsive React/Vite frontend with a self-contained 24-item fashion demo catalog.
- Garment upload with editable tag suggestions and input validation.
- Weather-aware planning using Open-Meteo and occasion-aware outfit rules.
- Three-look recommendation flow with owned-item explanations.
- Wardrobe gap analysis and product-search links.
- Rate My Outfit flow with demo-safe feedback.
- Insights for color distribution and wear history.
- **Save to Calendar** export as a standard `.ics` file.
- Optional Express backend with modular routes/services.
- JWT authentication with 12-hour tokens and scrypt password hashing.
- Per-user application state and protected API routes.
- Request rate limiting, CORS configuration, body-size limits and input validation.
- Atomic JSON demo storage with an optional Supabase/PostgreSQL persistence provider.
- Automated Node tests for outfit recommendation rules.
- AI provider adapter with deterministic fallback so the demo remains usable without an API key.

## Run the frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

## Run backend

```powershell
cd backend
npm.cmd install
npm.cmd start
```

Copy `.env.example` to `.env` and set a long random `JWT_SECRET` before exposing the API.

## Test backend

```powershell
cd backend
npm.cmd test
```

## Production storage

For a deployed multi-user setup, create `backend/SUPABASE_SCHEMA.sql` in Supabase and configure:

```text
STORAGE_PROVIDER=supabase
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

The service role key is backend-only and must never be placed in Vite/frontend environment variables.

## Demo story

Login → My Wardrobe → upload/tag a garment → Outfit Planner → live weather → three visual looks → Wardrobe Gaps → Rate My Outfit → Insights → Save to Calendar.

## Data and licensing

The bundled images are local demo assets. External fashion datasets are referenced in `dataset/` rather than redistributed. The project remains lightweight and self-contained for evaluation.

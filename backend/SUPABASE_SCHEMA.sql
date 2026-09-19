-- Optional production persistence for StyleSync AI.
-- Run this in Supabase SQL Editor, then set SUPABASE_URL and
-- SUPABASE_SERVICE_ROLE_KEY on the backend. Never expose the service role key
-- to the frontend.

create table if not exists public.stylesync_state (
  user_id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists stylesync_state_updated_at_idx
  on public.stylesync_state (updated_at desc);

-- The Express API uses the server-only service role key for this table.
-- Keep the table private and do not put the service role key in Vite env vars.

-- Entities table
create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('auteur','editeur','illustrateur','librairie','bibliotheque','lieu','independant','autre')) not null,
  name text not null,
  slug text unique not null,
  bio text,
  commune text,
  site text,
  reseaux jsonb,
  tags text[],
  status text check (status in ('draft','pending','published','rejected')) not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Simple trigger to update updated_at
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists t_set_updated_at on public.entities;
create trigger t_set_updated_at before update on public.entities
for each row execute function public.set_updated_at();

-- Public view that exposes only published entities
create or replace view public.entities_public as
  select id, type, name, slug, bio, commune, site, reseaux, tags, status, created_at, updated_at
  from public.entities
  where status = 'published';

-- RLS
alter table public.entities enable row level security;

-- Policy: anyone can insert but rows start as pending (handled by server inserting status=pending).
drop policy if exists insert_entities on public.entities;
create policy insert_entities on public.entities
  for insert
  to anon, authenticated
  with check (true);

-- Policy: only service role (server) can update status or edit arbitrary.
-- Deny updates by default; allow none.
drop policy if exists update_entities on public.entities;
create policy update_entities on public.entities
  for update
  to service_role
  using (true)
  with check (true);

-- Policy: anyone can select published rows from entities (but better use the view).
drop policy if exists select_entities_published on public.entities;
create policy select_entities_published on public.entities
  for select
  to anon, authenticated
  using (status = 'published');

-- Indexes
create index if not exists idx_entities_slug on public.entities (slug);
create index if not exists idx_entities_type on public.entities (type);
create index if not exists idx_entities_status on public.entities (status);

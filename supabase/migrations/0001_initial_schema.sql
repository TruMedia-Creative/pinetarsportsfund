-- ============================================================================
-- Pine Tar Sports Fund — Initial Supabase Schema
-- Run this in the Supabase SQL editor for your project.
--
-- SETUP STEPS:
--   1. Open supabase.com → your project → SQL Editor
--   2. Paste this entire file and click Run
--   3. Create your admin user: Authentication → Users → Invite user
--   4. Copy your project URL + anon key from Settings → API
-- ============================================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Tenants ──────────────────────────────────────────────────────────────────
create table if not exists public.tenants (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique,
  name        text        not null,
  domain      text,
  branding    jsonb       not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Financial Models ─────────────────────────────────────────────────────────
create table if not exists public.financial_models (
  id                  uuid        primary key default gen_random_uuid(),
  project_name        text        not null,
  minimum_investment  text,
  target_raise        text,
  preferred_return    text,
  equity_structure    text,
  use_of_funds        jsonb       not null default '[]',
  forecast_rows       jsonb       not null default '[]',
  assumptions         text        not null default '',
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── Assets ───────────────────────────────────────────────────────────────────
create table if not exists public.assets (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  type        text        not null check (type in ('image','chart','logo','headshot','rendering','document')),
  url         text        not null,
  alt         text,
  tags        jsonb       default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Decks ────────────────────────────────────────────────────────────────────
create table if not exists public.decks (
  id                  uuid        primary key default gen_random_uuid(),
  title               text        not null,
  slug                text        not null unique,
  audience_type       text        not null check (audience_type in ('investor','lender','sponsor','municipality','internal')),
  status              text        not null default 'draft' check (status in ('draft','ready','exported','archived')),
  template_id         text        not null,
  project_name        text        not null,
  subtitle            text,
  summary             text,
  goal                text        check (goal in ('raise_equity','secure_debt','win_sponsor','municipal_partnership','board_update','teaser')),
  depth               text        check (depth in ('short','standard','deep_dive')),
  sections            jsonb       not null default '[]',
  asset_ids           jsonb       not null default '[]',
  financial_model_id  uuid        references public.financial_models(id) on delete set null,
  theme               jsonb,
  published           boolean     not null default false,
  marketing_metadata  jsonb,
  published_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_tenants
  before update on public.tenants
  for each row execute function public.set_updated_at();

create trigger set_updated_at_financial_models
  before update on public.financial_models
  for each row execute function public.set_updated_at();

create trigger set_updated_at_assets
  before update on public.assets
  for each row execute function public.set_updated_at();

create trigger set_updated_at_decks
  before update on public.decks
  for each row execute function public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.tenants          enable row level security;
alter table public.financial_models enable row level security;
alter table public.assets           enable row level security;
alter table public.decks            enable row level security;

-- Tenants: anyone can read; authenticated users can manage
create policy "tenants_anon_read"          on public.tenants          for select to anon      using (true);
create policy "tenants_auth_all"           on public.tenants          for all    to authenticated using (true) with check (true);

-- Financial models: authenticated only
create policy "financial_models_auth_all"  on public.financial_models for all    to authenticated using (true) with check (true);

-- Assets: anyone can read; authenticated users can manage
create policy "assets_anon_read"           on public.assets           for select to anon      using (true);
create policy "assets_auth_all"            on public.assets           for all    to authenticated using (true) with check (true);

-- Decks: anon can read published decks; authenticated can manage all
create policy "decks_anon_read_published"  on public.decks            for select to anon      using (published = true);
create policy "decks_auth_all"             on public.decks            for all    to authenticated using (true) with check (true);

-- ── Seed: Default tenant ─────────────────────────────────────────────────────
insert into public.tenants (slug, name, domain, branding) values (
  'pinetarsportsfund',
  'Pine Tar Sports Fund',
  'pinetarsportsfund.com',
  '{"logoUrl": null, "primaryColor": "#0d2b6b", "fontFamily": "Inter"}'
) on conflict (slug) do nothing;

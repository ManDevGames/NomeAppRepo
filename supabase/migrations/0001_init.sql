-- Relationship Pattern Assessment — core schema.
-- Run via `supabase db push` or the Supabase SQL editor. See README.md.

create extension if not exists pgcrypto;

-- Stable, machine-readable pattern identifiers — mirrors PatternId in types/index.ts.
-- Keep these two definitions in sync if patterns are ever added/renamed.
create type pattern_id as enum (
  'abandonment',
  'overthinking',
  'selfWorth',
  'trustProtection',
  'peoplePleasing',
  'repeatingPattern'
);

create table leads (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  whatsapp_number        text not null,
  email                  text not null,
  utm_source             text,
  utm_medium             text,
  utm_campaign           text,
  created_at             timestamptz not null default now(),
  assessment_completed   boolean not null default false,
  primary_pattern        pattern_id,
  secondary_pattern      pattern_id
);

-- Used by the 24-hour duplicate-submission check in /api/submit-assessment.
create index leads_whatsapp_number_created_at_idx on leads (whatsapp_number, created_at desc);
create index leads_created_at_idx on leads (created_at desc);
create index leads_primary_pattern_idx on leads (primary_pattern);

create table responses (
  id                uuid primary key default gen_random_uuid(),
  lead_id           uuid not null references leads (id) on delete cascade,
  question_id       text not null,
  selected_option   text not null,
  created_at        timestamptz not null default now(),
  unique (lead_id, question_id)
);

create index responses_lead_id_idx on responses (lead_id);

create table scores (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid not null references leads (id) on delete cascade,
  pattern_name   pattern_id not null,
  score_value    integer not null default 0,
  unique (lead_id, pattern_name)
);

create index scores_lead_id_idx on scores (lead_id);

-- Row Level Security.
--
-- Deliberately no policies are defined for `anon` or `authenticated` on any
-- of these three tables — with RLS enabled and zero policies, both roles
-- are denied all access by default (select/insert/update/delete). Every
-- read and write in this app goes through server-side code using the
-- service-role key (lib/supabase/admin.ts), which bypasses RLS entirely by
-- design. This means: public visitors can never query leads/responses/
-- scores directly via the Supabase REST/JS client, and neither can a signed-
-- in admin's browser session — admin pages read data via server components
-- that use the service-role client only after verifying the admin session.
alter table leads enable row level security;
alter table responses enable row level security;
alter table scores enable row level security;

-- Migration: add production-quality startup fields to startups
-- Run this against your Supabase Postgres database (psql or supabase migration tool)

BEGIN;

ALTER TABLE IF EXISTS public.startups
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS problem_statement text,
  ADD COLUMN IF NOT EXISTS solution text,
  ADD COLUMN IF NOT EXISTS target_market text,
  ADD COLUMN IF NOT EXISTS business_model text,
  ADD COLUMN IF NOT EXISTS competitive_advantage text,
  ADD COLUMN IF NOT EXISTS funding_stage text,
  ADD COLUMN IF NOT EXISTS funding_required numeric,
  ADD COLUMN IF NOT EXISTS current_funding_raised numeric,
  ADD COLUMN IF NOT EXISTS revenue numeric,
  ADD COLUMN IF NOT EXISTS growth_rate numeric,
  ADD COLUMN IF NOT EXISTS founder_name text,
  ADD COLUMN IF NOT EXISTS founder_role text,
  ADD COLUMN IF NOT EXISTS founder_linkedin text,
  ADD COLUMN IF NOT EXISTS team_size integer,
  ADD COLUMN IF NOT EXISTS one_pager_url text;

COMMIT;

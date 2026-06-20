-- Migration: add portfolio_companies, avatar_url, pitch_deck_url to investors
-- Run this against your Supabase Postgres database (psql or supabase migration tool)

BEGIN;

-- Add columns if they do not already exist
ALTER TABLE IF EXISTS public.investors
  ADD COLUMN IF NOT EXISTS portfolio_companies jsonb,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS pitch_deck_url text;

-- Optional: set default empty array for portfolio_companies
UPDATE public.investors
SET portfolio_companies = COALESCE(portfolio_companies, '[]'::jsonb)
WHERE portfolio_companies IS NULL;

COMMIT;

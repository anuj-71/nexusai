-- Migration: Add saved_startups, profile_views, matches, notifications, and onboarding_status to profiles
-- Run with: supabase db execute --file db/migrations/2026-06-20-add-architecture-tables.sql

BEGIN;

-- Ensure pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create onboarding_status enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'onboarding_status') THEN
    CREATE TYPE onboarding_status AS ENUM ('not_started','in_progress','completed');
  END IF;
END$$;

-- Add onboarding_status to profiles (preserve existing onboarded boolean if exists)
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_status onboarding_status DEFAULT 'not_started';

-- If an `onboarded` boolean exists, migrate values then drop column
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarded') THEN
    UPDATE public.profiles SET onboarding_status = CASE WHEN onboarded THEN 'completed' ELSE 'not_started' END;
    ALTER TABLE public.profiles DROP COLUMN IF EXISTS onboarded;
  END IF;
END$$;

-- Saved startups table
CREATE TABLE IF NOT EXISTS public.saved_startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_saved_startups_investor ON public.saved_startups (investor_id);
CREATE INDEX IF NOT EXISTS idx_saved_startups_startup ON public.saved_startups (startup_id);

-- Profile views table
CREATE TABLE IF NOT EXISTS public.profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_profile_views_startup ON public.profile_views (startup_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON public.profile_views (viewer_id);

-- Matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  investor_id uuid NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  score numeric DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_matches_startup ON public.matches (startup_id);
CREATE INDEX IF NOT EXISTS idx_matches_investor ON public.matches (investor_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);

COMMIT;

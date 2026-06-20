export type Role = 'startup' | 'investor';

export interface Profile {
  id: string; // matches auth.users.id
  role: Role;
  created_at: string;
}

export interface Startup {
  id: string;
  user_id: string; // references auth.users.id
  startup_name: string;
  tagline?: string | null;
  industry?: string | null;
  stage?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  
  funding_required?: number | null;
  current_funding_raised?: number | null;
  description?: string | null;
  website?: string | null;
  location?: string | null;
  problem_statement?: string | null;
  solution?: string | null;
  target_market?: string | null;
  business_model?: string | null;
  competitive_advantage?: string | null;
  revenue?: number | null;
  growth_rate?: number | null;
  team_size?: number | null;
  pitch_deck_url?: string | null;
  one_pager_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StartupResult {
  id: string
  name: string
  sector?: string | null
  stage?: string | null
  location?: string | null
  fundingNeeded?: string | null
  fundingRaised?: string | null
  revenue?: string | null
  growthRate?: number | null
  teamSize?: number | null
  growthPotential?: "High" | "Low"
  growthScore?: number | null
  matchScore?: number | null
  logo_url?: string | null
  banner_url?: string | null
  pitch_deck_url?: string | null
  one_pager_url?: string | null
}

export interface Investor {
  id: string;
  user_id: string; // references auth.users.id
  investor_name: string;
  preferred_industries?: string[] | null;
  portfolio_companies?: string[] | null;
  preferred_stage?: string | null;
  investment_min?: number | null;
  investment_max?: number | null;
  location?: string | null;
  bio?: string | null;
  linkedin_url?: string | null;
  avatar_url?: string | null;
  pitch_deck_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PredictionResult {
  growthPotential: "High" | "Low"
  score: number
  confidence: number
}

export interface InvestorMatch {
  id: string
  name: string
  firm?: string | null
  sector?: string | null
  preferredStage?: string | null
  matchScore?: number | null
  investmentRange?: string | null
  avatar?: string | null
}

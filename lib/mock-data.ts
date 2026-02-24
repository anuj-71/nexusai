// Mock data and API simulation for the platform

export const SECTORS = [
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-Commerce",
  "SaaS",
  "AI/ML",
  "CleanTech",
  "BioTech",
  "Cybersecurity",
  "PropTech",
] as const

export const STAGES = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Growth",
] as const

export const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Boston, MA",
  "London, UK",
  "Berlin, DE",
  "Bangalore, IN",
  "Singapore, SG",
  "Tel Aviv, IL",
  "Toronto, CA",
] as const

export interface PredictionInput {
  sector: string
  stage: string
  location: string
  fundingNeeded: number
  revenue: number
  growthRate: number
  teamSize: number
}

export interface PredictionResult {
  growthPotential: "High" | "Low"
  score: number
  confidence: number
}

export interface InvestorMatch {
  id: string
  name: string
  firm: string
  sector: string
  preferredStage: string
  matchScore: number
  investmentRange: string
  avatar: string
}

export interface StartupResult {
  id: string
  name: string
  sector: string
  stage: string
  location: string
  fundingNeeded: string
  revenue: string
  growthRate: number
  teamSize: number
  growthPotential: "High" | "Low"
  growthScore: number
  matchScore: number
}

// Simulate POST /predict
export async function predictGrowth(input: PredictionInput): Promise<PredictionResult> {
  await new Promise((r) => setTimeout(r, 1800))
  const baseScore = Math.random() * 40 + 30
  const growthBonus = input.growthRate > 20 ? 20 : input.growthRate > 10 ? 10 : 0
  const revenueBonus = input.revenue > 500000 ? 15 : input.revenue > 100000 ? 8 : 0
  const teamBonus = input.teamSize > 20 ? 5 : input.teamSize > 10 ? 3 : 0
  const score = Math.min(98, baseScore + growthBonus + revenueBonus + teamBonus)
  return {
    growthPotential: score >= 60 ? "High" : "Low",
    score: Math.round(score),
    confidence: Math.round(80 + Math.random() * 18),
  }
}

// Simulate POST /match
export async function matchInvestors(input: PredictionInput): Promise<InvestorMatch[]> {
  await new Promise((r) => setTimeout(r, 800))
  const investors: InvestorMatch[] = [
    { id: "1", name: "Sarah Chen", firm: "Sequoia Capital", sector: "AI/ML", preferredStage: "Series A", matchScore: 94, investmentRange: "$5M - $20M", avatar: "SC" },
    { id: "2", name: "Michael Torres", firm: "a16z", sector: "SaaS", preferredStage: "Seed", matchScore: 89, investmentRange: "$1M - $10M", avatar: "MT" },
    { id: "3", name: "Emily Zhang", firm: "Accel Partners", sector: "FinTech", preferredStage: "Series A", matchScore: 86, investmentRange: "$10M - $50M", avatar: "EZ" },
    { id: "4", name: "David Park", firm: "Lightspeed", sector: "HealthTech", preferredStage: "Series B", matchScore: 82, investmentRange: "$15M - $40M", avatar: "DP" },
    { id: "5", name: "Lisa Morgan", firm: "Benchmark", sector: "E-Commerce", preferredStage: "Seed", matchScore: 78, investmentRange: "$2M - $15M", avatar: "LM" },
    { id: "6", name: "James Wilson", firm: "Index Ventures", sector: "Cybersecurity", preferredStage: "Series A", matchScore: 75, investmentRange: "$5M - $25M", avatar: "JW" },
  ]

  return investors
    .map((inv) => ({
      ...inv,
      matchScore: inv.sector === input.sector ? Math.min(99, inv.matchScore + 5) : inv.matchScore,
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
}

// Mock startups for investor dashboard
export function getStartups(): StartupResult[] {
  return [
    { id: "1", name: "NeuraFlow", sector: "AI/ML", stage: "Series A", location: "San Francisco, CA", fundingNeeded: "$12M", revenue: "$2.4M", growthRate: 45, teamSize: 28, growthPotential: "High", growthScore: 92, matchScore: 96 },
    { id: "2", name: "PaySync", sector: "FinTech", stage: "Seed", location: "New York, NY", fundingNeeded: "$3M", revenue: "$480K", growthRate: 35, teamSize: 12, growthPotential: "High", growthScore: 85, matchScore: 91 },
    { id: "3", name: "MediScan", sector: "HealthTech", stage: "Series A", location: "Boston, MA", fundingNeeded: "$8M", revenue: "$1.2M", growthRate: 28, teamSize: 22, growthPotential: "High", growthScore: 81, matchScore: 88 },
    { id: "4", name: "EduVerse", sector: "EdTech", stage: "Pre-Seed", location: "Austin, TX", fundingNeeded: "$1.5M", revenue: "$120K", growthRate: 52, teamSize: 6, growthPotential: "High", growthScore: 78, matchScore: 84 },
    { id: "5", name: "ShopAI", sector: "E-Commerce", stage: "Series B", location: "London, UK", fundingNeeded: "$25M", revenue: "$8.5M", growthRate: 22, teamSize: 65, growthPotential: "High", growthScore: 88, matchScore: 82 },
    { id: "6", name: "GreenGrid", sector: "CleanTech", stage: "Seed", location: "Berlin, DE", fundingNeeded: "$4M", revenue: "$340K", growthRate: 40, teamSize: 14, growthPotential: "High", growthScore: 76, matchScore: 79 },
    { id: "7", name: "SecureNet", sector: "Cybersecurity", stage: "Series A", location: "Tel Aviv, IL", fundingNeeded: "$10M", revenue: "$3.1M", growthRate: 30, teamSize: 35, growthPotential: "High", growthScore: 83, matchScore: 77 },
    { id: "8", name: "BioGen+", sector: "BioTech", stage: "Series B", location: "San Francisco, CA", fundingNeeded: "$30M", revenue: "$5.2M", growthRate: 18, teamSize: 48, growthPotential: "Low", growthScore: 55, matchScore: 72 },
    { id: "9", name: "PropVault", sector: "PropTech", stage: "Seed", location: "Singapore, SG", fundingNeeded: "$2M", revenue: "$200K", growthRate: 15, teamSize: 8, growthPotential: "Low", growthScore: 48, matchScore: 65 },
    { id: "10", name: "CloudBase", sector: "SaaS", stage: "Growth", location: "Toronto, CA", fundingNeeded: "$50M", revenue: "$22M", growthRate: 12, teamSize: 120, growthPotential: "Low", growthScore: 42, matchScore: 60 },
  ]
}

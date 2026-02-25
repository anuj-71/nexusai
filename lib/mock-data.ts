// Full dataset generator - ported from Python generate-startup-id.py
// Generates 1500 startups with the same fields and distributions

export const SECTORS = [
  "AI",
  "FinTech",
  "Healthcare",
  "EdTech",
  "E-commerce",
  "Cybersecurity",
] as const

export const STAGES = [
  "Idea",
  "Prototype",
  "Seed",
  "Series A",
  "Series B",
] as const

export const BUSINESS_MODELS = [
  "SaaS",
  "Marketplace",
  "Subscription",
  "B2B",
  "B2C",
] as const

export const LOCATIONS = [
  "India",
  "USA",
  "UK",
  "Germany",
  "Canada",
] as const

const STAGE_PARAMS: Record<string, {
  funding_min: number; funding_max: number
  team_min: number; team_max: number
  user_min: number; user_max: number
}> = {
  Idea: { funding_min: 5000, funding_max: 25000, team_min: 1, team_max: 3, user_min: 0, user_max: 100 },
  Prototype: { funding_min: 25000, funding_max: 100000, team_min: 2, team_max: 5, user_min: 50, user_max: 500 },
  Seed: { funding_min: 100000, funding_max: 500000, team_min: 4, team_max: 10, user_min: 500, user_max: 5000 },
  "Series A": { funding_min: 500000, funding_max: 5000000, team_min: 10, team_max: 50, user_min: 5000, user_max: 50000 },
  "Series B": { funding_min: 5000000, funding_max: 20000000, team_min: 50, team_max: 200, user_min: 50000, user_max: 500000 },
}

// Seeded PRNG for deterministic data (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function createRng(seed = 42) {
  const rand = mulberry32(seed)
  return {
    int: (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min,
    choice: <T>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)],
    float: () => rand(),
  }
}

export interface Startup {
  id: string
  name: string
  sector: string
  stage: string
  business_model: string
  funding_needed: number
  funding_raised: number
  valuation: number
  team_size: number
  revenue: number
  growth_rate: number
  burn_rate: number
  runway_months: number
  user_count: number
  traction_score: number
  location: string
  created_at: string
}

export interface PredictionInput {
  sector: string
  stage: string
  location: string
  fundingNeeded: number
  revenue: number
  growthRate: number
  teamSize: number
  businessModel?: string
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
  businessModel: string
  fundingRaised: string
  valuation: string
  burnRate: number
  runwayMonths: number
  userCount: number
  tractionScore: number
}

function generateStartupId(num: number): string {
  return "ST" + num.toString(16).toUpperCase().padStart(6, "0")
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

// Generate the full 1500-startup dataset (deterministic via seed)
let _cachedDataset: Startup[] | null = null

export function generateDataset(count = 1500): Startup[] {
  if (_cachedDataset && _cachedDataset.length === count) return _cachedDataset

  const rng = createRng(42)
  const data: Startup[] = []

  for (let i = 1; i <= count; i++) {
    const startupId = generateStartupId(i)
    const stage = rng.choice(Object.keys(STAGE_PARAMS))
    const s = STAGE_PARAMS[stage]

    const fundingNeeded = rng.int(s.funding_min, s.funding_max)
    const teamSize = rng.int(s.team_min, s.team_max)
    const userCount = rng.int(s.user_min, s.user_max)
    const revenue = userCount * rng.int(10, 50)
    const growthRate = rng.int(20, 300)
    const valuation = revenue * rng.int(5, 15)
    const fundingRaised = Math.floor(fundingNeeded * (0.2 + rng.float() * 0.6))
    const burnRate = teamSize * rng.int(1000, 3000)
    const runwayMonths = burnRate > 0 ? Math.floor(fundingRaised / burnRate) : 0

    const tractionScore = Math.min(
      100,
      Math.floor(
        (revenue / 1000000) * 40 +
        (growthRate / 300) * 30 +
        (userCount / 500000) * 30
      )
    )

    const daysAgo = rng.int(365, 730)
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

    data.push({
      id: startupId,
      name: `Startup_${startupId}`,
      sector: rng.choice(SECTORS),
      stage,
      business_model: rng.choice(BUSINESS_MODELS),
      funding_needed: fundingNeeded,
      funding_raised: fundingRaised,
      valuation,
      team_size: teamSize,
      revenue,
      growth_rate: growthRate,
      burn_rate: burnRate,
      runway_months: runwayMonths,
      user_count: userCount,
      traction_score: tractionScore,
      location: rng.choice(LOCATIONS),
      created_at: createdAt.toISOString().replace("T", " ").slice(0, 19),
    })
  }

  _cachedDataset = data
  return data
}

// Convert raw startup to display format
export function toStartupResult(s: Startup): StartupResult {
  const growthScore = Math.min(100, Math.floor(s.traction_score * 0.6 + (s.growth_rate / 300) * 40))
  const matchScore = Math.min(100, Math.floor(s.traction_score * 0.5 + growthScore * 0.3 + (s.runway_months / 12) * 20))

  return {
    id: s.id,
    name: s.name,
    sector: s.sector,
    stage: s.stage,
    location: s.location,
    fundingNeeded: formatCurrency(s.funding_needed),
    fundingRaised: formatCurrency(s.funding_raised),
    revenue: formatCurrency(s.revenue),
    valuation: formatCurrency(s.valuation),
    growthRate: s.growth_rate,
    teamSize: s.team_size,
    growthPotential: growthScore >= 50 ? "High" : "Low",
    growthScore,
    matchScore,
    businessModel: s.business_model,
    burnRate: s.burn_rate,
    runwayMonths: s.runway_months,
    userCount: s.user_count,
    tractionScore: s.traction_score,
  }
}

// Predict growth - replicates the Python ML scoring logic
export function predictGrowthSync(input: PredictionInput): PredictionResult {
  const baseScore =
    (input.growthRate / 300) * 35 +
    (input.revenue / 5000000) * 25 +
    (input.teamSize / 200) * 10

  const stageBonus: Record<string, number> = {
    Idea: 5, Prototype: 10, Seed: 15, "Series A": 20, "Series B": 25,
  }
  const sectorBonus: Record<string, number> = {
    AI: 8, Cybersecurity: 6, FinTech: 5, Healthcare: 4, EdTech: 3, "E-commerce": 2,
  }

  const score = Math.min(
    98,
    Math.round(
      baseScore + (stageBonus[input.stage] || 10) + (sectorBonus[input.sector] || 3) + Math.random() * 5
    )
  )

  return {
    growthPotential: score >= 55 ? "High" : "Low",
    score,
    confidence: Math.round(78 + Math.random() * 20),
  }
}

// Match investors based on input criteria
const INVESTOR_POOL = [
  { name: "Sarah Chen", firm: "Sequoia Capital", sectors: ["AI", "Cybersecurity"], stages: ["Series A", "Series B"], range: "$5M - $20M" },
  { name: "Michael Torres", firm: "a16z", sectors: ["FinTech", "AI"], stages: ["Seed", "Series A"], range: "$1M - $10M" },
  { name: "Emily Zhang", firm: "Accel Partners", sectors: ["FinTech", "E-commerce"], stages: ["Series A", "Series B"], range: "$10M - $50M" },
  { name: "David Park", firm: "Lightspeed", sectors: ["Healthcare", "EdTech"], stages: ["Seed", "Series A"], range: "$5M - $25M" },
  { name: "Lisa Morgan", firm: "Benchmark", sectors: ["E-commerce", "EdTech"], stages: ["Prototype", "Seed"], range: "$2M - $15M" },
  { name: "James Wilson", firm: "Index Ventures", sectors: ["Cybersecurity", "AI"], stages: ["Series A", "Series B"], range: "$5M - $25M" },
  { name: "Priya Sharma", firm: "Tiger Global", sectors: ["FinTech", "E-commerce"], stages: ["Series A", "Series B"], range: "$10M - $50M" },
  { name: "Alex Kim", firm: "GV (Google Ventures)", sectors: ["AI", "Healthcare"], stages: ["Seed", "Series A"], range: "$3M - $15M" },
  { name: "Robert Lee", firm: "Khosla Ventures", sectors: ["Healthcare", "Cybersecurity"], stages: ["Seed", "Series A"], range: "$2M - $12M" },
  { name: "Nina Patel", firm: "Founders Fund", sectors: ["AI", "EdTech"], stages: ["Idea", "Prototype", "Seed"], range: "$500K - $5M" },
]

export function matchInvestorsSync(input: PredictionInput): InvestorMatch[] {
  return INVESTOR_POOL.map((inv, i) => {
    let score = 50
    if (inv.sectors.includes(input.sector)) score += 25
    if (inv.stages.includes(input.stage)) score += 15
    score += Math.min(10, Math.floor(input.growthRate / 30))
    score = Math.min(99, score + Math.floor(Math.random() * 5))

    return {
      id: String(i + 1),
      name: inv.name,
      firm: inv.firm,
      sector: inv.sectors[0],
      preferredStage: inv.stages[0],
      matchScore: score,
      investmentRange: inv.range,
      avatar: inv.name.split(" ").map((n) => n[0]).join(""),
    }
  })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6)
}

// Get formatted startups for investor dashboard
export function getStartups(options?: {
  sector?: string
  stage?: string
  location?: string
  sortBy?: "matchScore" | "growthScore" | "growthRate"
  page?: number
  perPage?: number
}): { startups: StartupResult[]; total: number } {
  const dataset = generateDataset()
  let results = dataset.map(toStartupResult)

  if (options?.sector && options.sector !== "all") {
    results = results.filter((s) => s.sector === options.sector)
  }
  if (options?.stage && options.stage !== "all") {
    results = results.filter((s) => s.stage === options.stage)
  }
  if (options?.location && options.location !== "all") {
    results = results.filter((s) => s.location === options.location)
  }

  const sortKey = options?.sortBy || "matchScore"
  results.sort((a, b) => b[sortKey] - a[sortKey])

  const total = results.length
  const page = options?.page || 1
  const perPage = options?.perPage || 30
  const paginated = results.slice((page - 1) * perPage, page * perPage)

  return { startups: paginated, total }
}

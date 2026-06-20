import { createClient } from '@/lib/supabase/server'

export interface AIMatch {
  profileId: string
  score: number
  confidence: number
  reasons: string[]
  strengths: string[]
  concerns: string[]
  nextAction: string
  fundingReadiness: {
    score: number
    assessment: string
  }
  investorFit: {
    score: number
    assessment: string
  }
}

export async function analyzeMatch(
  userProfileId: string,
  targetProfileId: string,
  userRole: 'startup' | 'investor'
): Promise<AIMatch> {
  const supabase = await createClient()

  // Fetch user profile
  const userTable = userRole === 'startup' ? 'startup_profiles' : 'investor_profiles'
  const targetTable = userRole === 'startup' ? 'investor_profiles' : 'startup_profiles'

  const [userRes, targetRes] = await Promise.all([
    supabase.from(userTable).select('*').eq('user_id', userProfileId).single(),
    supabase.from(targetTable).select('*').eq('user_id', targetProfileId).single(),
  ])

  if (userRes.error || targetRes.error) {
    throw new Error('Failed to fetch profiles')
  }

  const user = userRes.data
  const target = targetRes.data

  let score = 0
  let confidence = 0
  const reasons: string[] = []
  const strengths: string[] = []
  const concerns: string[] = []

  if (userRole === 'startup') {
    // Analyzing investor fit for startup
    score = calculateStartupInvestorMatch(user, target, reasons, strengths, concerns)
  } else {
    // Analyzing startup fit for investor
    score = calculateInvestorStartupMatch(user, target, reasons, strengths, concerns)
  }

  confidence = Math.min(95, score + Math.random() * 10)

  return {
    profileId: targetProfileId,
    score,
    confidence,
    reasons,
    strengths,
    concerns,
    nextAction: generateNextAction(score, userRole),
    fundingReadiness: calculateFundingReadiness(user, userRole),
    investorFit: calculateInvestorFit(user, target, userRole),
  }
}

function calculateStartupInvestorMatch(
  startup: any,
  investor: any,
  reasons: string[],
  strengths: string[],
  concerns: string[]
): number {
  let score = 0

  // Stage fit (35 points max)
  if (investor.preferred_stages?.includes(startup.funding_stage)) {
    score += 35
    strengths.push(`Investor actively funds ${startup.funding_stage} companies`)
    reasons.push('Stage alignment')
  } else {
    concerns.push(`Investor typically funds different stages`)
  }

  // Sector fit (30 points max)
  if (investor.preferred_sectors?.some((s: string) => startup.industry?.toLowerCase().includes(s.toLowerCase()))) {
    score += 30
    strengths.push(`${investor.firm_name} specializes in ${startup.industry} sector`)
    reasons.push('Sector expertise match')
  } else {
    concerns.push(`${startup.industry} not in stated investment focus`)
  }

  // Funding amount fit (25 points max)
  if (
    startup.target_raise >= investor.min_investment &&
    startup.target_raise <= investor.max_investment
  ) {
    score += 25
    strengths.push(`Raise amount ($${(startup.target_raise / 1000000).toFixed(1)}M) fits investment range`)
    reasons.push('Funding amount alignment')
  } else if (startup.target_raise < investor.max_investment) {
    score += 12
    concerns.push(`Funding request is below typical check size`)
  } else {
    concerns.push(`Funding request exceeds maximum investment`)
  }

  // Profile quality (10 points max)
  if (startup.completion_percentage >= 85) {
    score += 10
    strengths.push('Complete, professional profile')
  }

  return Math.min(100, score)
}

function calculateInvestorStartupMatch(
  investor: any,
  startup: any,
  reasons: string[],
  strengths: string[],
  concerns: string[]
): number {
  let score = 0

  // Stage fit (30 points)
  if (investor.preferred_stages?.includes(startup.funding_stage)) {
    score += 30
    strengths.push(`Investor focuses on ${startup.funding_stage} rounds`)
    reasons.push('Funding stage match')
  }

  // Sector fit (35 points)
  if (investor.preferred_sectors?.some((s: string) => startup.industry?.toLowerCase().includes(s.toLowerCase()))) {
    score += 35
    strengths.push(`${investor.firm_name} has deep expertise in ${startup.industry}`)
    reasons.push('Industry expertise alignment')
  }

  // Team size consideration (15 points)
  if (startup.team_size >= 5) {
    score += 15
    strengths.push(`Experienced team of ${startup.team_size} members`)
  } else {
    concerns.push(`Early-stage team (${startup.team_size} members) - may require more support`)
  }

  // Raised amount momentum (20 points)
  if (startup.raised_amount > 0 && startup.raised_amount >= (startup.target_raise * 0.3)) {
    score += 20
    strengths.push(`Strong early traction with $${(startup.raised_amount / 1000000).toFixed(1)}M already raised`)
    reasons.push('Momentum and validation')
  }

  return Math.min(100, score)
}

function calculateFundingReadiness(profile: any, role: 'startup' | 'investor'): { score: number; assessment: string } {
  if (role === 'investor') {
    return {
      score: 85,
      assessment: 'Ready to invest - portfolio is well-established',
    }
  }

  let score = 0
  let assessment = ''

  if (profile.completion_percentage >= 90) score += 30
  else if (profile.completion_percentage >= 70) score += 20
  else score += 10

  if (profile.team_size >= 10) score += 25
  else if (profile.team_size >= 5) score += 15
  else score += 5

  if (profile.raised_amount > 0) score += 20
  if (profile.funding_stage === 'Series A' || profile.funding_stage === 'Series B') score += 20

  score = Math.min(100, score)

  if (score >= 80) {
    assessment = 'Highly prepared for fundraising - strong fundamentals in place'
  } else if (score >= 60) {
    assessment = 'Moderately prepared - complete profile and establish more traction'
  } else {
    assessment = 'Early stage - focus on team building and product-market fit first'
  }

  return { score, assessment }
}

function calculateInvestorFit(userProfile: any, targetProfile: any, role: 'startup' | 'investor'): { score: number; assessment: string } {
  let score = 50 // Base score
  let assessment = ''

  if (role === 'startup') {
    // Assessing investor
    if (targetProfile.completion_percentage >= 85) score += 15
    if (targetProfile.portfolio_companies && targetProfile.portfolio_companies.length > 3) score += 15
    if (targetProfile.min_investment <= userProfile.target_raise * 0.5) score += 10

    score = Math.min(100, score)

    if (score >= 80) {
      assessment = `${targetProfile.firm_name} is a strong strategic fit with active portfolio support`
    } else if (score >= 60) {
      assessment = `Good investor fit - aligned on stage and sector`
    } else {
      assessment = `Potential fit but verify alignment on support and capital`
    }
  } else {
    // Assessing startup
    if (userProfile.preferred_sectors && userProfile.preferred_sectors.length > 0) score += 10
    if (userProfile.min_investment <= targetProfile.target_raise) score += 15

    score = Math.min(100, score)

    if (score >= 80) {
      assessment = `Strong investment opportunity with clear traction and team`
    } else if (score >= 60) {
      assessment = `Interesting prospect - track performance over next quarter`
    } else {
      assessment = `Monitor for future investment rounds`
    }
  }

  return { score: Math.max(0, Math.min(100, score)), assessment }
}

function generateNextAction(score: number, role: 'startup' | 'investor'): string {
  if (score >= 80) {
    return role === 'startup' ? 'Reach out immediately with pitch deck' : 'Schedule founder meeting this week'
  } else if (score >= 60) {
    return role === 'startup' ? 'Send intro message and request call' : 'Request more information before deciding'
  } else {
    return role === 'startup' ? 'Consider this investor for future rounds' : 'Keep on watchlist for now'
  }
}

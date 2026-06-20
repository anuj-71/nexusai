'use server'

import { createClient } from '@/lib/supabase/server'

interface MatchScore {
  score: number
  reasons: string[]
}

/**
 * Calculate match compatibility between a startup and investor
 * Considers: sector alignment, funding stage, amount, location preferences
 */
export async function calculateStartupInvestorMatch(
  startupId: string,
  investorId: string
): Promise<MatchScore> {
  const supabase = await createClient()

  const [startupResult, investorResult] = await Promise.all([
    supabase.from('startup_profiles').select('*').eq('id', startupId).single(),
    supabase.from('investor_profiles').select('*').eq('id', investorId).single(),
  ])

  if (startupResult.error || investorResult.error) {
    return { score: 0, reasons: ['Profile data unavailable'] }
  }

  const startup = startupResult.data
  const investor = investorResult.data
  const reasons: string[] = []
  let score = 0

  // 1. Funding amount compatibility (30 points max)
  if (startup.funding_goal && investor.min_investment && investor.max_investment) {
    const startupAmount = startup.funding_goal
    if (startupAmount >= investor.min_investment && startupAmount <= investor.max_investment) {
      score += 30
      reasons.push(`Funding range match: $${(investor.min_investment / 1000000).toFixed(1)}M - $${(investor.max_investment / 1000000).toFixed(1)}M`)
    } else if (startupAmount >= investor.min_investment * 0.7 && startupAmount <= investor.max_investment * 1.3) {
      score += 15
      reasons.push('Funding amount in similar range')
    }
  }

  // 2. Stage compatibility (25 points max)
  if (startup.stage && investor.preferred_stages) {
    if (investor.preferred_stages.includes(startup.stage)) {
      score += 25
      reasons.push(`Stage match: ${startup.stage}`)
    } else {
      // Check if stages are close
      const stageOrder = ['Idea', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Growth']
      const startupStageIdx = stageOrder.indexOf(startup.stage)
      const investorStages = investor.preferred_stages.map(s => stageOrder.indexOf(s))
      const minDiff = Math.min(...investorStages.map(idx => Math.abs(idx - startupStageIdx)))
      if (minDiff <= 1) {
        score += 12
        reasons.push('Adjacent funding stage')
      }
    }
  }

  // 3. Industry/Sector alignment (35 points max)
  if (startup.industry && investor.preferred_sectors) {
    const sectorMatch = investor.preferred_sectors.some(
      sector =>
        startup.industry.toLowerCase().includes(sector.toLowerCase()) ||
        sector.toLowerCase().includes(startup.industry.toLowerCase())
    )

    if (sectorMatch) {
      score += 35
      reasons.push(`Sector alignment: ${startup.industry}`)
    } else {
      // Check for related sectors
      const relatedSectors: Record<string, string[]> = {
        'AI/ML': ['SaaS', 'Enterprise', 'Data'],
        'FinTech': ['Payments', 'Consumer', 'Banking'],
        'CleanTech': ['Energy', 'Sustainability', 'Agriculture'],
        'HealthTech': ['Medical', 'BioTech', 'Wellness'],
      }

      for (const [category, relatedSectorsList] of Object.entries(relatedSectors)) {
        const startupIsRelated = relatedSectorsList.some(s =>
          startup.industry.toLowerCase().includes(s.toLowerCase())
        )
        const investorIsRelated = investor.preferred_sectors.some(s =>
          relatedSectorsList.includes(s)
        )

        if (startupIsRelated && investorIsRelated) {
          score += 18
          reasons.push('Related sector expertise')
          break
        }
      }
    }
  }

  // 4. Team size / Growth potential (10 points max)
  if (startup.team_size) {
    if (startup.team_size >= 5 && startup.team_size <= 50) {
      score += 10
      reasons.push('Good team size for stage')
    } else if (startup.team_size > 0) {
      score += 5
    }
  }

  // Apply weighting based on profile completeness
  const startupCompleteness = startup.completion_percentage || 0
  const investorCompleteness = investor.completion_percentage || 0
  const completenessBonus = ((startupCompleteness + investorCompleteness) / 2) * 0.1
  score += completenessBonus

  // Cap score at 100
  score = Math.min(score, 100)

  return {
    score: Math.round(score),
    reasons: reasons.length > 0 ? reasons : ['Basic match compatibility'],
  }
}

/**
 * Get top matches for a startup (investors interested in this startup's profile)
 */
export async function getTopStartupMatches(startupUserId: string, limit: number = 10) {
  const supabase = await createClient()

  // Get startup profile
  const { data: startupProfile } = await supabase
    .from('startup_profiles')
    .select('*')
    .eq('user_id', startupUserId)
    .single()

  if (!startupProfile) {
    return []
  }

  // Get all investor profiles
  const { data: investorProfiles } = await supabase.from('investor_profiles').select('*')

  if (!investorProfiles) {
    return []
  }

  // Calculate scores for each investor
  const matchesWithScores = await Promise.all(
    investorProfiles.map(async investor => {
      const match = await calculateStartupInvestorMatch(startupProfile.id, investor.id)
      return {
        ...investor,
        matchScore: match.score,
        matchReasons: match.reasons,
      }
    })
  )

  // Sort by score and return top matches
  return matchesWithScores
    .filter(m => m.matchScore >= 40) // Only show decent matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * Get top matches for an investor (startups interesting to this investor)
 */
export async function getTopInvestorMatches(investorUserId: string, limit: number = 10) {
  const supabase = await createClient()

  // Get investor profile
  const { data: investorProfile } = await supabase
    .from('investor_profiles')
    .select('*')
    .eq('user_id', investorUserId)
    .single()

  if (!investorProfile) {
    return []
  }

  // Get all startup profiles
  const { data: startupProfiles } = await supabase.from('startup_profiles').select('*')

  if (!startupProfiles) {
    return []
  }

  // Calculate scores for each startup
  const matchesWithScores = await Promise.all(
    startupProfiles.map(async startup => {
      const match = await calculateStartupInvestorMatch(startup.id, investorProfile.id)
      return {
        ...startup,
        matchScore: match.score,
        matchReasons: match.reasons,
      }
    })
  )

  // Sort by score and return top matches
  return matchesWithScores
    .filter(m => m.matchScore >= 40) // Only show decent matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * Save a match interaction (interest/connection)
 */
export async function saveMatchInteraction(startupId: string, investorId: string, interested: boolean) {
  const supabase = await createClient()

  const { data: existingMatch } = await supabase
    .from('matches')
    .select('*')
    .eq('startup_id', startupId)
    .eq('investor_id', investorId)
    .single()

  if (existingMatch) {
    // Update existing match
    const { data: { user } } = await supabase.auth.getUser()
    const isStartup = (await supabase.from('profiles').select('role').eq('id', user?.id).single()).data?.role === 'startup'

    return supabase
      .from('matches')
      .update(isStartup ? { startup_interested: interested } : { investor_interested: interested })
      .eq('id', existingMatch.id)
  } else {
    // Create new match
    const { data: { user } } = await supabase.auth.getUser()
    const isStartup = (await supabase.from('profiles').select('role').eq('id', user?.id).single()).data?.role === 'startup'

    return supabase.from('matches').insert({
      startup_id: startupId,
      investor_id: investorId,
      startup_interested: isStartup ? interested : null,
      investor_interested: !isStartup ? interested : null,
    })
  }
}

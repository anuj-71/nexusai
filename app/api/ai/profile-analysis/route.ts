import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 })
    }

    let analysisData
    if (profile.role === 'startup') {
      const { data: startupProfile } = await supabase
        .from('startup_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!startupProfile) {
        return Response.json({ error: 'Startup profile not found' }, { status: 404 })
      }

      analysisData = analyzeStartupProfile(startupProfile)
    } else {
      const { data: investorProfile } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!investorProfile) {
        return Response.json({ error: 'Investor profile not found' }, { status: 404 })
      }

      analysisData = analyzeInvestorProfile(investorProfile)
    }

    return Response.json(analysisData)
  } catch (error) {
    console.error('[v0] Profile analysis error:', error)
    return Response.json({ error: 'Failed to analyze profile' }, { status: 500 })
  }
}

interface StartupProfile {
  id: string
  company_name?: string
  industry?: string
  stage?: string
  team_size?: number
  funding_goal?: number
  description?: string
  website?: string
  completion_percentage?: number
  [key: string]: any
}

interface InvestorProfile {
  id: string
  firm_name?: string
  investment_focus?: string
  min_investment?: number
  max_investment?: number
  preferred_sectors?: string[]
  preferred_stages?: string[]
  completion_percentage?: number
  [key: string]: any
}

function analyzeStartupProfile(profile: StartupProfile) {
  const completionScore = profile.completion_percentage || 0
  let matchabilityScore = completionScore

  const missingFields: Array<{ field: string; impact: 'critical' | 'high' | 'medium'; reason: string }> = []
  const strengths: string[] = []

  // Check critical fields
  if (!profile.company_name) {
    missingFields.push({
      field: 'Company Name',
      impact: 'critical',
      reason: 'Investors need to know who you are. Add your company name to appear in search results.',
    })
  } else {
    strengths.push('Professional company branding established')
  }

  if (!profile.industry) {
    missingFields.push({
      field: 'Industry/Sector',
      impact: 'critical',
      reason: 'Specify your industry for better matching with relevant investors.',
    })
  } else {
    strengths.push(`Active in ${profile.industry} sector with investor focus`)
  }

  if (!profile.description) {
    missingFields.push({
      field: 'Company Description',
      impact: 'high',
      reason: 'A compelling pitch description significantly improves match quality and investor interest.',
    })
  } else {
    strengths.push('Clear value proposition communicated')
  }

  if (!profile.stage) {
    missingFields.push({
      field: 'Funding Stage',
      impact: 'high',
      reason: 'Tell investors what stage you are in (Seed, Series A, etc.) for targeted connections.',
    })
  } else {
    strengths.push(`${profile.stage} stage company targeting right investors`)
  }

  if (!profile.funding_goal) {
    missingFields.push({
      field: 'Funding Goal',
      impact: 'high',
      reason: 'Specify your funding target to match with investors in the right check size range.',
    })
  } else {
    strengths.push(`Clear funding goal of $${(profile.funding_goal / 1000000).toFixed(1)}M`)
  }

  if (!profile.team_size || profile.team_size === 0) {
    missingFields.push({
      field: 'Team Size',
      impact: 'medium',
      reason: 'Showcase your team to demonstrate execution capability.',
    })
  } else if (profile.team_size >= 5) {
    strengths.push(`Strong team of ${profile.team_size} building product`)
  }

  if (!profile.website) {
    missingFields.push({
      field: 'Website/Demo',
      impact: 'medium',
      reason: 'Add a link to your product or website for investor due diligence.',
    })
  } else {
    strengths.push('Live product with investor visibility')
  }

  // Adjust matchability based on missing critical fields
  const criticalFieldsMissing = missingFields.filter(f => f.impact === 'critical').length
  matchabilityScore = Math.max(0, matchabilityScore - criticalFieldsMissing * 15)

  return {
    role: 'startup',
    completionScore,
    matchabilityScore,
    missingFields: missingFields.sort((a, b) => {
      const impactOrder = { critical: 0, high: 1, medium: 2 }
      return impactOrder[a.impact] - impactOrder[b.impact]
    }),
    strengths,
  }
}

function analyzeInvestorProfile(profile: InvestorProfile) {
  const completionScore = profile.completion_percentage || 0
  let matchabilityScore = completionScore

  const missingFields: Array<{ field: string; impact: 'critical' | 'high' | 'medium'; reason: string }> = []
  const strengths: string[] = []

  // Check critical fields
  if (!profile.firm_name) {
    missingFields.push({
      field: 'Firm Name',
      impact: 'critical',
      reason: 'Startups need to know your firm. Add your firm name and branding.',
    })
  } else {
    strengths.push(`Established firm: ${profile.firm_name}`)
  }

  if (!profile.investment_focus) {
    missingFields.push({
      field: 'Investment Focus',
      impact: 'critical',
      reason: 'Describe your investment thesis to attract aligned startups.',
    })
  } else {
    strengths.push('Clear investment thesis communicated')
  }

  if (!profile.min_investment || !profile.max_investment) {
    missingFields.push({
      field: 'Investment Range',
      impact: 'high',
      reason: 'Specify your check size range to match with startups seeking your investment levels.',
    })
  } else {
    strengths.push(`Clear check range: $${(profile.min_investment / 1000000).toFixed(1)}M-$${(profile.max_investment / 1000000).toFixed(1)}M`)
  }

  if (!profile.preferred_sectors || profile.preferred_sectors.length === 0) {
    missingFields.push({
      field: 'Preferred Sectors',
      impact: 'high',
      reason: 'Select industries you focus on for better startup matching.',
    })
  } else {
    strengths.push(`Focused on ${profile.preferred_sectors.length} key sectors`)
  }

  if (!profile.preferred_stages || profile.preferred_stages.length === 0) {
    missingFields.push({
      field: 'Preferred Stages',
      impact: 'medium',
      reason: 'Indicate the funding stages you invest in (Seed, Series A, etc.).',
    })
  } else {
    strengths.push(`Invests across ${profile.preferred_stages.length} funding stages`)
  }

  // Adjust matchability based on missing critical fields
  const criticalFieldsMissing = missingFields.filter(f => f.impact === 'critical').length
  matchabilityScore = Math.max(0, matchabilityScore - criticalFieldsMissing * 15)

  return {
    role: 'investor',
    completionScore,
    matchabilityScore,
    missingFields: missingFields.sort((a, b) => {
      const impactOrder = { critical: 0, high: 1, medium: 2 }
      return impactOrder[a.impact] - impactOrder[b.impact]
    }),
    strengths,
  }
}

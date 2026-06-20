import { NextResponse } from "next/server"
import { createAnonSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const sector = searchParams.get("sector") || "all"
  const stage = searchParams.get("stage") || "all"
  const location = searchParams.get("location") || "all"
  const sortBy = (searchParams.get("sortBy") as "matchScore" | "growthScore" | "growthRate") || "matchScore"
  const page = parseInt(searchParams.get("page") || "1", 10)
  const perPage = parseInt(searchParams.get("perPage") || "30", 10)

  const supabase = createAnonSupabaseClient()

  // Build base filter query
  let query = supabase.from("startups").select(
    `id, user_id, startup_name, tagline, industry, funding_stage, funding_required, current_funding_raised, revenue, growth_rate, team_size, location, logo_url, banner_url, pitch_deck_url, one_pager_url, founder_name, founder_role, founder_linkedin, created_at`,
    { count: "exact" }
  )

  if (sector && sector !== "all") query = query.eq("industry", sector)
  if (stage && stage !== "all") {
    // allow matching on funding_stage or legacy stage column
    query = query.or(`funding_stage.eq.${stage},stage.eq.${stage}`)
  }
  if (location && location !== "all") query = query.eq("location", location)

  // Apply sorting
  if (sortBy === "growthRate") query = query.order("growth_rate", { ascending: false })
  else if (sortBy === "growthScore") query = query.order("revenue", { ascending: false })
  else query = query.order("created_at", { ascending: false })

  // Pagination
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message ?? error }, { status: 500 })

  const rows = (data || []) as any[]

  // Map DB rows to frontend-friendly shape and compute simple scores
  function formatCurrency(n: number | null | undefined) {
    if (n == null) return "-"
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
    return `$${n}`
  }

  const startups = rows.map((s) => {
    const growthRate = Number(s.growth_rate) || 0
    const revenue = Number(s.revenue) || 0
    const team = Number(s.team_size) || 0

    const growthScore = Math.min(100, Math.round((growthRate / 300) * 60 + Math.min(1, revenue / 1_000_000) * 40 * 100 / 100))
    const matchScore = Math.min(100, Math.round(growthScore * 0.6 + (team > 0 ? Math.min(20, team) : 0)))

    return {
      id: s.id,
      name: s.startup_name,
      sector: s.industry,
      stage: s.funding_stage || s.stage || null,
      location: s.location,
      fundingNeeded: formatCurrency(s.funding_required),
      fundingRaised: formatCurrency(s.current_funding_raised),
      revenue: formatCurrency(revenue),
      valuation: null,
      growthRate,
      teamSize: team,
      growthPotential: growthScore >= 50 ? "High" : "Low",
      growthScore,
      matchScore,
      businessModel: null,
      burnRate: null,
      runwayMonths: null,
      userCount: null,
      tractionScore: null,
      logo_url: s.logo_url || null,
      banner_url: s.banner_url || null,
      pitch_deck_url: s.pitch_deck_url || null,
      one_pager_url: s.one_pager_url || null,
    }
  })

  // Fetch filters (distinct values) for client selects
  const [sectorsRes, stagesRes, locationsRes, businessRes] = await Promise.all([
    supabase.from("startups").select("industry").neq("industry", null),
    supabase.from("startups").select("funding_stage").neq("funding_stage", null),
    supabase.from("startups").select("location").neq("location", null),
    supabase.from("startups").select("business_model").neq("business_model", null),
  ])

  const sectors = Array.from(new Set((sectorsRes.data || []).map((r: any) => r.industry).filter(Boolean)))
  const stages = Array.from(new Set((stagesRes.data || []).map((r: any) => r.funding_stage).filter(Boolean)))
  const locations = Array.from(new Set((locationsRes.data || []).map((r: any) => r.location).filter(Boolean)))
  const businessModels = Array.from(new Set((businessRes.data || []).map((r: any) => r.business_model).filter(Boolean)))

  return NextResponse.json({
    startups,
    total: count || startups.length,
    page,
    perPage,
    totalPages: Math.ceil((count || startups.length) / perPage),
    filters: { sectors, stages, locations, businessModels },
  })
}

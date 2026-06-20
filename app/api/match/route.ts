import { NextResponse } from "next/server"
import { createServiceSupabaseClient, getUserFromRequest } from "@/lib/supabase/server"

export type PredictionInput = {
  sector: string
  stage: string
  location?: string
  fundingNeeded?: number
  revenue?: number
  growthRate?: number
  teamSize?: number
}

export async function POST(request: Request) {
  const body = (await request.json()) as PredictionInput

  if (!body.sector || !body.stage) {
    return NextResponse.json({ error: "Missing required fields: sector, stage" }, { status: 400 })
  }

  // Derive authenticated user and ensure only startups can request matches
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceSupabaseClient()

  const { data: profile, error: pErr } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (pErr || !profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  if (profile.role !== 'startup') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Query investors who have preferences that match the sector/stage
  const { data: investorsData, error } = await supabase
    .from("investors")
    .select("id, investor_name, firm, preferred_industries, preferred_stage, investment_min, investment_max, linkedin_url")
    .limit(50)

  if (error) return NextResponse.json({ error: error.message ?? error }, { status: 500 })

  const investors = (investorsData || []).map((inv: any, i: number) => {
    let score = 40
    const prefInd = inv.preferred_industries || []
    if (Array.isArray(prefInd) && prefInd.includes(body.sector)) score += 30
    if (inv.preferred_stage && String(inv.preferred_stage) === String(body.stage)) score += 20
    if (body.growthRate) score += Math.min(10, Math.floor(body.growthRate / 30))
    score = Math.min(99, score + Math.floor(Math.random() * 5))

    return {
      id: inv.id || String(i + 1),
      name: inv.investor_name || inv.name || "",
      firm: inv.firm || "",
      sector: (Array.isArray(inv.preferred_industries) && inv.preferred_industries[0]) || null,
      preferredStage: inv.preferred_stage || null,
      matchScore: score,
      investmentRange: inv.investment_min && inv.investment_max ? `$${inv.investment_min} - $${inv.investment_max}` : null,
      avatar: (inv.investor_name || "").split(" ").map((n: string) => n[0]).join("")
    }
  })
    .sort((a: any, b: any) => b.matchScore - a.matchScore)
    .slice(0, 6)

  // small delay for UX
  await new Promise((r) => setTimeout(r, 300))

  return NextResponse.json({ investors })
}

import { NextResponse } from 'next/server'
import { createServiceSupabaseClient, getUserFromRequest } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceSupabaseClient()

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    let score = 0
    let total = 0
    if (profile.role === 'startup') {
      const { data: s } = await supabase.from('startups').select('*').eq('user_id', user.id).single()
      const fields = ['startup_name','tagline','industry','website','location','problem_statement','solution','target_market','business_model','founder_name','team_size','logo_url']
      total = fields.length
      if (s) {
        let filled = 0
        for (const f of fields) {
          if (s[f] !== null && s[f] !== undefined && String(s[f]).trim() !== '') filled++
        }
        score = Math.round((filled / total) * 100)
      }
    } else if (profile.role === 'investor') {
      const { data: inv } = await supabase.from('investors').select('*').eq('user_id', user.id).single()
      const fields = ['investor_name','preferred_industries','portfolio_companies','investment_min','investment_max','location','bio','avatar_url']
      total = fields.length
      if (inv) {
        let filled = 0
        for (const f of fields) {
          if (inv[f] !== null && inv[f] !== undefined && String(inv[f]).trim() !== '') filled++
        }
        score = Math.round((filled / total) * 100)
      }
    }

    // Map score -> onboarding_status
    let onboarding_status: string = 'not_started'
    if (score === 100) onboarding_status = 'complete'
    else if (score >= 50) onboarding_status = 'in_progress'
    else if (score > 0) onboarding_status = 'onboarding_started'

    // Persist onboarding_status if changed
    await supabase.from('profiles').update({ onboarding_status }).eq('id', user.id)

    return NextResponse.json({ completion_score: score, onboarding_status })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}

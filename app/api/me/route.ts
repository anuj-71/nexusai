import { NextResponse } from 'next/server'
import { createServiceSupabaseClient, getUserFromRequest } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceSupabaseClient()

    const { data: profile } = await supabase.from('profiles').select('role, onboarding_status').eq('id', user.id).single()

    // compute completion score quickly (same logic as completion endpoint)
    let completion_score = 0
    if (profile?.role === 'startup') {
      const sRes = await supabase.from('startups').select('startup_name,tagline,industry,website,location,problem_statement,solution,target_market,business_model,founder_name,team_size,logo_url').eq('user_id', user.id).single()
      const s = sRes.data as any
      const fields = ['startup_name','tagline','industry','website','location','problem_statement','solution','target_market','business_model','founder_name','team_size','logo_url']
      if (s) {
        let filled = 0
        for (const f of fields) { if ((s as Record<string, any>)[f] != null && String((s as Record<string, any>)[f]).trim() !== '') filled++ }
        completion_score = Math.round((filled / fields.length) * 100)
      }
    } else if (profile?.role === 'investor') {
      const invRes = await supabase.from('investors').select('investor_name,preferred_industries,portfolio_companies,investment_min,investment_max,location,bio,avatar_url').eq('user_id', user.id).single()
      const inv = invRes.data as any
      const fields = ['investor_name','preferred_industries','portfolio_companies','investment_min','investment_max','location','bio','avatar_url']
      if (inv) {
        let filled = 0
        for (const f of fields) { if ((inv as Record<string, any>)[f] != null && String((inv as Record<string, any>)[f]).trim() !== '') filled++ }
        completion_score = Math.round((filled / fields.length) * 100)
      }
    }

    const avatar = profile?.role === 'startup' ? (await supabase.from('startups').select('logo_url').eq('user_id', user.id).single()).data?.logo_url : (await supabase.from('investors').select('avatar_url').eq('user_id', user.id).single()).data?.avatar_url

    return NextResponse.json({ id: user.id, email: user.email, role: profile?.role || null, completion_score, onboarding_status: profile?.onboarding_status || null, avatar: avatar || null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}

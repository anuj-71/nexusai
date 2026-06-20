import { NextResponse } from 'next/server'
import { createServiceSupabaseClient, getUserFromRequest } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceSupabaseClient()

    // Ensure this user is a startup
    const { data: profile, error: pErr } = await supabase.from('profiles').select('role, onboarding_status').eq('id', user.id).single()
    if (pErr || !profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    if (profile.role !== 'startup') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // funding progress: from startups table for this user
    const { data: startup } = await supabase.from('startups').select('id, funding_required, current_funding_raised').eq('user_id', user.id).single()

    // matches count
    const { count: matches_count } = await supabase.from('matches').select('*', { count: 'exact' }).eq('startup_id', startup?.id)

    // profile views
    const { count: views_count } = await supabase.from('profile_views').select('*', { count: 'exact' }).eq('startup_id', startup?.id)

    // recent activity
    const { data: feed } = await supabase.from('activity_feed').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)

    return NextResponse.json({ profile: { id: user.id, role: profile.role, onboarding_status: profile.onboarding_status }, funding: startup || null, matches_count: matches_count || 0, views_count: views_count || 0, recent: feed || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}

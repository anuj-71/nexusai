import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceSupabaseClient, getUserFromRequest } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceSupabaseClient()
    const { data: profile } = await supabase.from('profiles').select('role,onboarding_status').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    if (profile.role === 'startup') {
      const { data: s } = await supabase.from('startups').select('*').eq('user_id', user.id).single()
      return NextResponse.json({ role: 'startup', profile: s || null, onboarding_status: profile.onboarding_status || null })
    }

    if (profile.role === 'investor') {
      const { data: inv } = await supabase.from('investors').select('*').eq('user_id', user.id).single()
      return NextResponse.json({ role: 'investor', profile: inv || null, onboarding_status: profile.onboarding_status || null })
    }

    return NextResponse.json({ role: profile.role, profile: null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}

const startupPatchSchema = z.object({
  startup_name: z.string().optional(),
  tagline: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  location: z.string().nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  banner_url: z.string().url().nullable().optional(),
  funding_required: z.number().nullable().optional(),
})

const investorPatchSchema = z.object({
  investor_name: z.string().optional(),
  preferred_industries: z.array(z.string()).nullable().optional(),
  portfolio_companies: z.array(z.string()).nullable().optional(),
  investment_min: z.number().nullable().optional(),
  investment_max: z.number().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
})

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const supabase = createServiceSupabaseClient()

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    if (profile.role === 'startup') {
      const parsed = startupPatchSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: 'Validation failed', issues: parsed.error.errors }, { status: 422 })
      const { error } = await supabase.from('startups').update(parsed.data).eq('user_id', user.id)
      if (error) return NextResponse.json({ error: error.message ?? error }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (profile.role === 'investor') {
      const parsed = investorPatchSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: 'Validation failed', issues: parsed.error.errors }, { status: 422 })
      const { error } = await supabase.from('investors').update(parsed.data).eq('user_id', user.id)
      if (error) return NextResponse.json({ error: error.message ?? error }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unsupported role' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}

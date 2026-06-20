import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    // Derive authenticated user from session
    const { headers } = req
    const user = await (await import('@/lib/supabase/server')).getUserFromRequest(req as unknown as Request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    
    // Zod schemas for validation
    const startupSchema = z.object({
      startup_name: z.string().min(1, 'startup_name is required'),
      tagline: z.string().nullable().optional(),
      industry: z.string().nullable().optional(),
      website: z.preprocess((v) => (v === '' ? null : v), z.string().url('website must be a valid URL').nullable().optional()),
      location: z.string().nullable().optional(),

      problem_statement: z.string().nullable().optional(),
      solution: z.string().nullable().optional(),
      target_market: z.string().nullable().optional(),
      business_model: z.string().nullable().optional(),
      competitive_advantage: z.string().nullable().optional(),

      funding_stage: z.string().nullable().optional(),
      funding_required: z.preprocess((v) => {
        if (v === null || v === undefined || v === '') return null
        return Number(v)
      }, z.number().min(0, 'funding_required must be >= 0').nullable()),
      current_funding_raised: z.preprocess((v) => {
        if (v === null || v === undefined || v === '') return null
        return Number(v)
      }, z.number().min(0, 'current_funding_raised must be >= 0').nullable()),
      revenue: z.preprocess((v) => {
        if (v === null || v === undefined || v === '') return null
        return Number(v)
      }, z.number().min(0, 'revenue must be >= 0').nullable()),
      growth_rate: z.preprocess((v) => {
        if (v === null || v === undefined || v === '') return null
        return Number(v)
      }, z.number().nullable()),

      founder_name: z.string().nullable().optional(),
      founder_role: z.string().nullable().optional(),
      founder_linkedin: z.preprocess((v) => (v === '' ? null : v), z.string().url('founder_linkedin must be a valid URL').nullable().optional()),
      team_size: z.preprocess((v) => {
        if (v === null || v === undefined || v === '') return null
        return Number(v)
      }, z.number().int().min(0, 'team_size must be >= 0').nullable()),

      logo_url: z.preprocess((v) => (v === '' ? null : v), z.string().url('logo_url must be a valid URL').nullable().optional()),
      banner_url: z.preprocess((v) => (v === '' ? null : v), z.string().url('banner_url must be a valid URL').nullable().optional()),
      pitch_deck_url: z.preprocess((v) => (v === '' ? null : v), z.string().url('pitch_deck_url must be a valid URL').nullable().optional()),
      one_pager_url: z.preprocess((v) => (v === '' ? null : v), z.string().url('one_pager_url must be a valid URL').nullable().optional()),
    })

    const investorSchema = z.object({
      investor_name: z.string().min(1, 'investor_name is required'),
      preferred_industries: z.preprocess((v) => {
        if (v == null) return null
        if (Array.isArray(v)) return v
        if (typeof v === 'string') return v.split(',').map((s) => s.trim()).filter(Boolean)
        return null
      }, z.array(z.string()).nullable()),
      portfolio_companies: z.preprocess((v) => {
        if (v == null) return null
        if (Array.isArray(v)) return v
        if (typeof v === 'string') return v.split(',').map((s) => s.trim()).filter(Boolean)
        return null
      }, z.array(z.string()).nullable()),
      preferred_stage: z.string().nullable().optional(),
      investment_min: z.preprocess((v) => {
        if (v === null || v === undefined || v === '') return null
        return Number(v)
      }, z.number().min(0, 'investment_min must be >= 0').nullable()),
      investment_max: z.preprocess((v) => {
        if (v === null || v === undefined || v === '') return null
        return Number(v)
      }, z.number().nullable()),
      location: z.string().nullable().optional(),
      bio: z.string().nullable().optional(),
      avatar_url: z.preprocess((v) => (v === '' ? null : v), z.string().url('avatar_url must be a valid URL').nullable().optional()),
      pitch_deck_url: z.preprocess((v) => (v === '' ? null : v), z.string().url('pitch_deck_url must be a valid URL').nullable().optional()),
      linkedin_url: z.preprocess((v) => (v === '' ? null : v), z.string().url('linkedin_url must be a valid URL').nullable().optional()),
    }).refine((data) => {
      // If both min and max provided, max must be >= min
      if (data.investment_min != null && data.investment_max != null) {
        return data.investment_max >= data.investment_min
      }
      return true
    }, { message: 'investment_max must be greater than or equal to investment_min', path: ['investment_max'] })

    const baseSchema = z.object({
      role: z.enum(['startup', 'investor']),
      startup: z.any().optional(),
      investor: z.any().optional(),
    })

    const parsedBase = baseSchema.safeParse(body)
    if (!parsedBase.success) {
      const issues = parsedBase.error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }))
      return NextResponse.json({ error: 'Validation failed', issues }, { status: 422 })
    }

    const { role, startup, investor } = parsedBase.data

    // role-specific validation
    try {
      if (role === 'startup') {
        startupSchema.parse(startup || {})
      }
      if (role === 'investor') {
        investorSchema.parse(investor || {})
      }
    } catch (err: any) {
      if (err && err.errors) {
        const issues = err.errors.map((e: any) => ({ path: e.path.length ? e.path.join('.') : e.path, message: e.message }))
        return NextResponse.json({ error: 'Validation failed', issues }, { status: 422 })
      }
      throw err
    }

    const supabase = createServiceSupabaseClient()

    // Ensure the session user cannot create/update another user's profile
    const userId = user.id

    // Insert profile row (id is session user id) if missing
    const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', userId).single()
    if (!existingProfile) {
      const { error: pErr } = await supabase.from('profiles').insert({ id: userId, role })
      if (pErr) return NextResponse.json({ error: pErr.message ?? pErr }, { status: 500 })
    }

    // Insert into role-specific table
    if (role === 'startup') {
      const startupRow = { user_id: userId, ...startup }
      const { data: existingStartup } = await supabase.from('startups').select('user_id').eq('user_id', userId).single()
      if (!existingStartup) {
        const { error: sErr } = await supabase.from('startups').insert(startupRow)
        if (sErr) return NextResponse.json({ error: sErr.message ?? sErr }, { status: 500 })
      }
    }

    if (role === 'investor') {
      const investorRow = { user_id: userId, ...investor }
      const { data: existingInvestor } = await supabase.from('investors').select('user_id').eq('user_id', userId).single()
      if (!existingInvestor) {
        const { error: iErr } = await supabase.from('investors').insert(investorRow)
        if (iErr) return NextResponse.json({ error: iErr.message ?? iErr }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}

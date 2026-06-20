import { NextResponse } from 'next/server'
import { createServiceSupabaseClient, getUserFromRequest } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceSupabaseClient()
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
    if (error) return NextResponse.json({ error: error.message ?? error }, { status: 500 })

    return NextResponse.json({ notifications: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createServiceSupabaseClient()
    const body = await request.json()
    // Minimal shape: { title, body, type }
    const notif = { user_id: user.id, title: body.title || '', body: body.body || '', type: body.type || 'info' }
    const { error } = await supabase.from('notifications').insert(notif)
    if (error) return NextResponse.json({ error: error.message ?? error }, { status: 500 })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 })
  }
}

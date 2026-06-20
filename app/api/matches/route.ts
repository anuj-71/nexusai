import { createClient } from '@/lib/supabase/server'
import { getTopStartupMatches, getTopInvestorMatches } from '@/lib/matching-engine'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

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

    let matches
    if (profile.role === 'startup') {
      matches = await getTopStartupMatches(user.id, limit)
    } else {
      matches = await getTopInvestorMatches(user.id, limit)
    }

    return Response.json({ matches, role: profile.role })
  } catch (error) {
    console.error('[v0] Matching error:', error)
    return Response.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

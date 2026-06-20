import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') throw profileError

    if (!profile) {
      // Create new profile
      const { data: newProfile, error: createError } = await supabase
        .from('startup_profiles')
        .insert({
          user_id: user.id,
          completion_percentage: 0,
        })
        .select()
        .single()

      if (createError) throw createError
      return NextResponse.json(newProfile)
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Startup profile GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Calculate completion percentage
    const completionFields = [
      'company_name',
      'company_tagline',
      'company_description',
      'industry',
      'stage',
      'location',
      'website_url',
    ]
    const filledFields = completionFields.filter(
      field => body[field as keyof typeof body]
    ).length
    const completionPercentage = Math.round(
      (filledFields / completionFields.length) * 100
    )

    const { data: profile, error: profileError } = await supabase
      .from('startup_profiles')
      .update({
        ...body,
        completion_percentage: completionPercentage,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (profileError) throw profileError

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Startup profile PUT error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}

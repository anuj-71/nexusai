import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Save to investor_profiles table
    const { data, error } = await supabase
      .from('investor_profiles')
      .upsert({
        user_id: user.id,
        investor_name: body.investorName,
        firm_name: body.firmName,
        investment_thesis: body.investmentThesis,
        preferred_stages: body.preferredStages ? body.preferredStages.split(',') : [],
        preferred_sectors: body.preferredSectors ? body.preferredSectors.split(',') : [],
        ticket_size_min: parseInt(body.minInvestment) || null,
        ticket_size_max: parseInt(body.maxInvestment) || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Error saving investor profile:', error)
      return NextResponse.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

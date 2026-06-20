import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { InvestorProfileClient } from '@/components/investor-profile-client'

export default async function InvestorProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    redirect('/auth/login')
  }

  let { data: investorProfile, error: investorError } = await supabase
    .from('investor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (investorError && investorError.code === 'PGRST116') {
    const { data: newProfile } = await supabase
      .from('investor_profiles')
      .insert({
        user_id: user.id,
        completion_percentage: 0,
      })
      .select()
      .single()

    investorProfile = newProfile
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Investor Profile</h1>
          <p className="text-slate-600">
            Build your investor profile to discover promising startups
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <InvestorProfileClient initialProfile={investorProfile} userId={user.id} />
        </div>
      </div>
    </div>
  )
}

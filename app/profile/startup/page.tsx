import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StartupProfileClient } from '@/components/startup-profile-client'

export default async function StartupProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    redirect('/auth/login')
  }

  // Get or create startup profile
  let { data: startupProfile, error: startupError } = await supabase
    .from('startup_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (startupError && startupError.code === 'PGRST116') {
    // No startup profile exists, create one
    const { data: newProfile } = await supabase
      .from('startup_profiles')
      .insert({
        user_id: user.id,
        completion_percentage: 0,
      })
      .select()
      .single()

    startupProfile = newProfile
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Startup Profile</h1>
          <p className="text-slate-600">
            Build your startup profile to connect with investors
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <StartupProfileClient initialProfile={startupProfile} userId={user.id} />
        </div>
      </div>
    </div>
  )
}

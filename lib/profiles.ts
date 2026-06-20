import { createClient } from '@/lib/supabase/server'

export async function getProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function getStartupProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('startup_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

export async function getInvestorProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('investor_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

export async function updateProfile(userId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

export async function updateStartupProfile(userId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('startup_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}

export async function updateInvestorProfile(userId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('investor_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}

export async function createStartupProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('startup_profiles')
    .insert({
      user_id: userId,
      completion_percentage: 0,
    })
    .select()
    .single()

  return { data, error }
}

export async function createInvestorProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('investor_profiles')
    .insert({
      user_id: userId,
      completion_percentage: 0,
    })
    .select()
    .single()

  return { data, error }
}

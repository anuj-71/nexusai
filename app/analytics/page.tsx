'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MainNav } from '@/components/main-nav'
import { ProfileAnalytics } from '@/components/profile-analytics'
import { Skeleton } from '@/components/ui/skeleton'

interface ProfileStats {
  profileViews: number
  likes: number
  messages: number
  matches: number
  matchRate: number
  completionScore: number
  trendChange: number
}

export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'startup' | 'investor'>('startup')
  const router = useRouter()

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        // Get user profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role, completion_percentage')
          .eq('id', user.id)
          .single()

        if (!userProfile) {
          router.push('/onboarding')
          return
        }

        setUserRole(userProfile.role as 'startup' | 'investor')

        // Get match statistics
        const { data: matchData } = await supabase
          .from('matches')
          .select('match_type, status')
          .or(
            `profile_1_id.eq.${user.id},profile_2_id.eq.${user.id}`
          )

        const likes = matchData?.filter(m => m.match_type === 'like').length || 0
        const connected = matchData?.filter(m => m.status === 'connected').length || 0
        const total = matchData?.length || 0
        const matchRate = total > 0 ? Math.round((connected / total) * 100) : 0

        // Get messages count
        const { count: messageCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)

        // Simulate profile views (in production, track from user_profile_views)
        const profileViews = Math.floor(Math.random() * 100) + 10

        setStats({
          profileViews,
          likes,
          messages: messageCount || 0,
          matches: connected,
          matchRate,
          completionScore: userProfile.completion_percentage || 65,
          trendChange: Math.floor(Math.random() * 20) - 10,
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setStats({
          profileViews: 0,
          likes: 0,
          messages: 0,
          matches: 0,
          matchRate: 0,
          completionScore: 65,
          trendChange: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [router])

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="space-y-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Profile Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your {userRole === 'startup' ? 'investor' : 'startup'} discovery performance
          </p>
        </div>

        <ProfileAnalytics stats={stats} role={userRole} />
      </div>
    </div>
  )
}

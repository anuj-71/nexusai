'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DiscoveryFlow, type DiscoveryProfile } from '@/components/discovery-flow'
import { MainNav } from '@/components/main-nav'

export const dynamic = 'force-dynamic'

export default function DiscoveryPage() {
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'startup' | 'investor'>('startup')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        // Get user profile to determine role
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!userProfile) {
          router.push('/onboarding')
          return
        }

        setUserRole(userProfile.role as 'startup' | 'investor')

        // Fetch profiles based on role
        if (userProfile.role === 'startup') {
          // Fetch investors for this startup
          const { data: investorData } = await supabase
            .from('investor_profiles')
            .select('*')
            .limit(50)

          if (investorData) {
            const discoveryProfiles: DiscoveryProfile[] = investorData.map(
              (investor: any) => ({
                id: investor.user_id,
                name: investor.firm_name,
                tagline: investor.investment_focus,
                description: investor.firm_description,
                category: 'Venture Capital',
                location: investor.location || 'Unknown',
                matchScore: Math.floor(Math.random() * 40) + 60, // 60-100
                tags: investor.preferred_sectors || [],
                details: {
                  'Check Size': `$${(investor.min_investment / 1000000).toFixed(1)}M - $${(investor.max_investment / 1000000).toFixed(1)}M`,
                  'Stages': investor.preferred_stages?.join(', ') || 'N/A',
                },
                liked: false,
              })
            )
            setProfiles(discoveryProfiles)
          }
        } else {
          // Fetch startups for this investor
          const { data: startupData } = await supabase
            .from('startup_profiles')
            .select('*')
            .limit(50)

          if (startupData) {
            const discoveryProfiles: DiscoveryProfile[] = startupData.map(
              (startup: any) => ({
                id: startup.user_id,
                name: startup.company_name,
                tagline: startup.company_tagline,
                description: startup.company_description,
                category: startup.industry,
                location: startup.location || 'Unknown',
                matchScore: Math.floor(Math.random() * 40) + 60, // 60-100
                tags: [startup.stage, startup.industry],
                details: {
                  'Funding Goal': `$${(startup.funding_goal / 1000000).toFixed(1)}M`,
                  'Team Size': `${startup.team_size} people`,
                  'Stage': startup.stage,
                },
                liked: false,
              })
            )
            setProfiles(discoveryProfiles)
          }
        }
      } catch (error) {
        console.error('Error fetching profiles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLike = async (id: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await supabase.from('matches').insert({
        profile_1_id: user.id,
        profile_2_id: id,
        match_type: 'like',
        status: 'pending',
      })

      // Update profile state to show as liked
      setProfiles(prev =>
        prev.map(p => (p.id === id ? { ...p, liked: true } : p))
      )
    } catch (error) {
      console.error('Error liking profile:', error)
    }
  }

  const handlePass = async (id: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await supabase.from('matches').insert({
        profile_1_id: user.id,
        profile_2_id: id,
        match_type: 'pass',
        status: 'dismissed',
      })
    } catch (error) {
      console.error('Error passing profile:', error)
    }
  }

  const handleConnect = async (id: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Create a match conversation
      const { data: matchData } = await supabase
        .from('matches')
        .insert({
          profile_1_id: user.id,
          profile_2_id: id,
          match_type: 'connected',
          status: 'connected',
        })
        .select()

      if (matchData?.[0]) {
        // Redirect to messages or conversation
        router.push(`/messages?match=${matchData[0].id}`)
      }
    } catch (error) {
      console.error('Error connecting:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Discover {userRole === 'startup' ? 'Investors' : 'Startups'}
          </h1>
          <p className="text-muted-foreground">
            Swipe through and find your perfect match
          </p>
        </div>

        <DiscoveryFlow
          profiles={profiles}
          userRole={userRole}
          onLike={handleLike}
          onPass={handlePass}
          onConnect={handleConnect}
        />
      </div>
    </div>
  )
}

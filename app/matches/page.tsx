import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MainNav } from '@/components/main-nav'
import { MatchesDisplay } from '@/components/matches-display'

export default async function MatchesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  const isStartup = profile.role === 'startup'

  // Mock data for demonstration (legacy)
  const mockMatches = isStartup
    ? [
        {
          id: '1',
          name: 'Horizon Ventures',
          type: 'Venture Capital',
          checkSize: '$500K - $5M',
          focusAreas: ['AI/ML', 'B2B SaaS'],
          description: 'We invest in early-stage software companies with strong founders.',
          image: 'HV',
          matchScore: 92,
        },
        {
          id: '2',
          name: 'Catalyst Fund',
          type: 'Angel Group',
          checkSize: '$50K - $500K',
          focusAreas: ['FinTech', 'EdTech'],
          description: 'Supporting diverse founders building financial inclusion.',
          image: 'CF',
          matchScore: 87,
        },
        {
          id: '3',
          name: 'Growth Partners',
          type: 'Venture Capital',
          checkSize: '$1M - $10M',
          focusAreas: ['B2C Commerce', 'SaaS'],
          description: 'Partnering with founders scaling consumer businesses.',
          image: 'GP',
          matchScore: 85,
        },
      ]
    : [
        {
          id: '1',
          name: 'TechFlow AI',
          type: 'Pre-Seed',
          fundingGoal: '$500K',
          industry: 'AI/ML',
          teamSize: 3,
          description: 'Building the next generation of AI-powered analytics.',
          image: 'TF',
          matchScore: 94,
        },
        {
          id: '2',
          name: 'VenueBook',
          type: 'Seed',
          fundingGoal: '$2M',
          industry: 'B2B SaaS',
          teamSize: 8,
          description: 'Marketplace for event space booking and management.',
          image: 'VB',
          matchScore: 88,
        },
        {
          id: '3',
          name: 'HealthSync',
          type: 'Series A',
          fundingGoal: '$5M',
          industry: 'HealthTech',
          teamSize: 15,
          description: 'Connecting healthcare providers with patient data solutions.',
          image: 'HS',
          matchScore: 82,
        },
      ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <MainNav isStartup={isStartup} userName={profile.full_name} />

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {isStartup ? 'Investor Matches' : 'Startup Opportunities'}
          </h1>
          <p className="text-slate-600">
            {isStartup
              ? 'Discover investors interested in your space'
              : 'Find promising startups matching your investment criteria'}
          </p>
        </div>

        {/* AI-Powered Matches Component */}
        <MatchesDisplay role={isStartup ? 'startup' : 'investor'} />
      </div>
    </div>
  )
}

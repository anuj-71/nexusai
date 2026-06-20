import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Edit, Zap, Users, Target, BarChart3, MessageSquare, Settings } from 'lucide-react'
import { MainNav } from '@/components/main-nav'

export default async function DashboardPage() {
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

  const isStartup = profile.role === 'startup'

  if (isStartup) {
    const { data: startupProfile } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <MainNav isStartup={isStartup} userName={profile.full_name} />

        <div className="max-w-6xl mx-auto p-6 md:p-10">
          {/* Welcome Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome back, {startupProfile?.company_name || 'Startup'}!
            </h1>
            <p className="text-slate-600">Track your fundraising journey and connect with investors</p>
          </div>

          {/* Primary CTA Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <Card className="lg:col-span-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <Edit size={20} />
                  Complete Your Profile
                </CardTitle>
                <CardDescription className="text-emerald-800">
                  {startupProfile?.completion_percentage || 0}% complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-emerald-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${startupProfile?.completion_percentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-emerald-900 mb-4">
                  Adding more details helps investors better understand your business
                </p>
                <Link href="/profile/startup">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Complete Profile
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 text-lg">
                  <Users size={20} />
                  Investors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 mb-4">12</div>
                <p className="text-xs text-blue-800 mb-4">Matches waiting</p>
                <Link href="/matches">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                    View All
                    <ArrowRight className="ml-2" size={14} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <BarChart3 size={16} />
                  Profile Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">24</div>
                <p className="text-xs text-slate-600 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Zap size={16} />
                  Investor Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">12</div>
                <p className="text-xs text-slate-600 mt-1">New this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">3</div>
                <p className="text-xs text-slate-600 mt-1">Unread</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Target size={16} />
                  Funding Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  ${startupProfile?.funding_goal ? (startupProfile.funding_goal / 1000000).toFixed(1) : '0'}M
                </div>
                <p className="text-xs text-slate-600 mt-1">Target round</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">Horizon Ventures viewed your profile</p>
                    <p className="text-xs text-slate-600">2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">You matched with 3 new investors</p>
                    <p className="text-xs text-slate-600">1 day ago</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-900">Profile completion reminder</p>
                    <p className="text-xs text-slate-600">3 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Dismiss</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } else {
    const { data: investorProfile } = await supabase
      .from('investor_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <MainNav isStartup={isStartup} userName={profile.full_name} />

        <div className="max-w-6xl mx-auto p-6 md:p-10">
          {/* Welcome Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome back, {investorProfile?.firm_name || 'Investor'}!
            </h1>
            <p className="text-slate-600">Discover promising startups and manage your investments</p>
          </div>

          {/* Primary CTA Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <Card className="lg:col-span-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Target size={20} />
                  Explore Startups
                </CardTitle>
                <CardDescription className="text-blue-800">
                  Discover opportunities matching your criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-900 mb-4">
                  Find high-potential startups tailored to your investment thesis and preferences
                </p>
                <Link href="/matches">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Browse Startups
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <Edit size={20} />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-700 mb-4">
                  {investorProfile?.completion_percentage || 0}% complete
                </div>
                <div className="w-full bg-slate-300 rounded-full h-1.5 mb-4">
                  <div
                    className="bg-slate-700 h-1.5 rounded-full transition-all"
                    style={{ width: `${investorProfile?.completion_percentage || 0}%` }}
                  ></div>
                </div>
                <Link href="/profile/investor">
                  <Button className="w-full" size="sm" variant="outline">
                    Edit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Target size={16} />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">47</div>
                <p className="text-xs text-slate-600 mt-1">Match your criteria</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Users size={16} />
                  Saved Startups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">8</div>
                <p className="text-xs text-slate-600 mt-1">In your watchlist</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">5</div>
                <p className="text-xs text-slate-600 mt-1">Active chats</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <BarChart3 size={16} />
                  Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">3</div>
                <p className="text-xs text-slate-600 mt-1">Active investments</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and discoveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">TechFlow AI responded to your message</p>
                    <p className="text-xs text-slate-600">30 minutes ago</p>
                  </div>
                  <Button variant="outline" size="sm">Reply</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">2 new startups matched your profile</p>
                    <p className="text-xs text-slate-600">2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-900">You saved DataViz Inc to your watchlist</p>
                    <p className="text-xs text-slate-600">Yesterday</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}

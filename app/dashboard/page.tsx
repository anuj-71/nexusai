import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Edit, Zap, Users, Target, TrendingUp, MessageSquare, Settings, Sparkles } from 'lucide-react'
import { MainNav } from '@/components/main-nav'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth/login')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) redirect('/auth/login')

  const isStartup = profile.role === 'startup'

  if (isStartup) {
    const { data: startupProfile } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return (
      <div className="min-h-screen bg-background">
        <MainNav isStartup={isStartup} userName={profile.full_name} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Welcome back, {startupProfile?.company_name || 'Founder'}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your AI-powered fundraising assistant is ready to help
            </p>
          </div>

          {/* Priority Section: AI Recommendations */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles size={24} className="text-accent" />
              AI Insights & Recommendations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Health */}
              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target size={18} className="text-accent" />
                    Profile Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Overall Score</span>
                      <Badge variant="secondary">{startupProfile?.completion_percentage || 0}%</Badge>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${startupProfile?.completion_percentage || 0}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {startupProfile?.completion_percentage! >= 80 
                      ? '✓ Profile looks great!' 
                      : 'Complete profile details to improve match quality'}
                  </p>
                </CardContent>
              </Card>

              {/* Funding Readiness */}
              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent" />
                    Funding Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-foreground">
                    {Math.round(startupProfile?.completion_percentage! * 0.8 / 10) * 10}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {startupProfile?.completion_percentage! >= 70 
                      ? 'Ready for investor conversations' 
                      : 'Get profile to 70% for best results'}
                  </p>
                </CardContent>
              </Card>

              {/* Match Score */}
              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap size={18} className="text-accent" />
                    Average Match Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-foreground">
                    72%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    With reviewed investors
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Match Score First - Most Important */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Users size={24} className="text-primary" />
              Investor Matches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Best Match Card */}
              <Card className="border-border/50 bg-card hover:shadow-lg transition-all md:col-span-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>12 Potential Investors</CardTitle>
                      <CardDescription>Based on your profile and AI matching</CardDescription>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      <Zap size={14} className="mr-1" />
                      72% avg match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    AI has identified investors perfectly aligned with your stage ({startupProfile?.funding_stage}), 
                    sector ({startupProfile?.industry}), and funding goals.
                  </p>
                  <Link href="/discovery">
                    <Button className="w-full gap-2 bg-accent hover:bg-accent/90">
                      <TrendingUp size={16} />
                      Start Browsing Investors
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Funding Readiness */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Funding Readiness</h2>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Your Fundraising Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Profile Completion</span>
                    <span className="text-sm font-semibold text-foreground">{startupProfile?.completion_percentage || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${startupProfile?.completion_percentage || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete your profile to unlock more matches and improve investor visibility
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex gap-3">
                  <Link href="/profile/startup" className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <Edit size={16} />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/analytics" className="flex-1">
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                      <TrendingUp size={16} />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Recommended Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Edit size={16} className="text-primary" />
                    Complete Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    You're {100 - (startupProfile?.completion_percentage || 0)}% away from a complete profile. Add missing details to improve your match quality.
                  </p>
                  <Link href="/profile/startup">
                    <Button size="sm" variant="outline" className="w-full">View Profile</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare size={16} className="text-accent" />
                    Start Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    You have 12 strong matches. Connect with top-tier investors today.
                  </p>
                  <Link href="/discovery">
                    <Button size="sm" className="w-full gap-1 bg-accent hover:bg-accent/90">
                      Browse Investors
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    View Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Track profile views, match quality, and investor engagement metrics.
                  </p>
                  <Link href="/analytics">
                    <Button size="sm" variant="outline" className="w-full">Analytics</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings size={16} className="text-primary" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Manage your preferences and notification settings.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">Settings</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Your Progress</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">12</div>
                  <p className="text-xs text-muted-foreground mt-1">Potential Matches</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Liked Investors</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">72%</div>
                  <p className="text-xs text-muted-foreground mt-1">Avg Match Score</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{startupProfile?.completion_percentage || 0}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Profile Complete</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Investor dashboard
  const { data: investorProfile } = await supabase
    .from('investor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <MainNav isStartup={false} userName={profile.full_name} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Welcome back, {investorProfile?.firm_name || 'Investor'}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover high-quality startups tailored to your investment focus
          </p>
        </div>

        {/* Similar sections for investor */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Startups for You</CardTitle>
            <CardDescription>15 high-quality startups matching your investment criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/discovery">
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Users size={16} />
                Browse Startups
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

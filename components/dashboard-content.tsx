'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AIInsightsCard } from './ai-insights-card'
import { ProfileQualityAnalyzer } from './profile-quality-analyzer'
import { Skeleton } from '@/components/ui/skeleton'

interface AnalysisData {
  role: 'startup' | 'investor'
  completionScore: number
  matchabilityScore: number
  missingFields: Array<{ field: string; impact: string; reason: string }>
  strengths: string[]
}

interface DashboardContentProps {
  role: 'startup' | 'investor'
}

export function DashboardContent({ role }: DashboardContentProps) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch('/api/ai/profile-analysis')
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch profile analysis:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (!analysis) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <p className="text-amber-900">Failed to load profile analysis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Quality Section */}
      <ProfileQualityAnalyzer
        completionScore={analysis.completionScore}
        matchabilityScore={analysis.matchabilityScore}
        missingFields={analysis.missingFields}
        strengths={analysis.strengths}
      />

      {/* AI Recommendations */}
      <AIInsightsCard
        title={role === 'startup' ? 'Fundraising Readiness' : 'Investment Opportunity Assessment'}
        description={
          role === 'startup'
            ? 'How ready is your startup for fundraising'
            : 'Recommended investment strategy based on portfolio'
        }
        metrics={
          role === 'startup'
            ? [
                { label: 'Profile Quality', value: `${analysis.completionScore}%`, status: 'positive' },
                { label: 'Matchability', value: `${analysis.matchabilityScore}%`, status: 'positive' },
                { label: 'Readiness', value: 'Moderate', status: 'neutral' },
                { label: 'Recommendation', value: 'Complete Profile', status: 'warning' },
              ]
            : [
                { label: 'Portfolio Fit', value: 'Good', status: 'positive' },
                { label: 'Deal Flow', value: 'Strong', status: 'positive' },
                { label: 'Avg Check Size', value: 'Optimal', status: 'positive' },
                { label: 'Stage Focus', value: 'Diversified', status: 'positive' },
              ]
        }
        recommendation={
          role === 'startup'
            ? `Complete your profile with ${analysis.missingFields.length} missing items to unlock ${Math.min(100, analysis.matchabilityScore + 20)}% match potential.`
            : 'Your portfolio is well-positioned. Focus on startups with strong team backgrounds in your preferred sectors.'
        }
        icon={role === 'startup' ? 'zap' : 'trending'}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Profile Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{analysis.completionScore}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analysis.completionScore >= 80 ? '✨ Excellent' : 'Room to improve'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Matchability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">{analysis.matchabilityScore}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analysis.matchabilityScore >= 70 ? 'High match rate' : 'Add more details'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{analysis.missingFields.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {analysis.missingFields.length === 0 ? 'All set!' : 'Complete to improve'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Matches Coming Soon */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="text-base">
            {role === 'startup' ? 'Top Investor Matches' : 'Top Startup Matches'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {role === 'startup'
              ? 'Based on your profile, we recommend connecting with investors in your fundraising stage and sector.'
              : 'Based on your investment thesis, we recommend reviewing startups with strong fundamentals in your focus areas.'}
          </p>
          <div className="mt-4 flex gap-2">
            <Badge variant="outline">Complete profile</Badge>
            <Badge variant="outline">View matches</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

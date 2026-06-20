'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  CheckCircle,
  AlertCircle,
  Zap 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileStats {
  profileViews: number
  likes: number
  messages: number
  matches: number
  matchRate: number
  completionScore: number
  trendChange: number
}

interface ProfileAnalyticsProps {
  stats: ProfileStats
  role: 'startup' | 'investor'
}

export function ProfileAnalytics({ stats, role }: ProfileAnalyticsProps) {
  const statCards = [
    {
      title: 'Profile Views',
      value: stats.profileViews,
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '+12% this week',
    },
    {
      title: 'Likes',
      value: stats.likes,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      trend: `${stats.likes > 5 ? '↑' : '↓'} from last week`,
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      trend: 'Active conversations',
    },
    {
      title: 'Matches',
      value: stats.matches,
      icon: CheckCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      trend: `${stats.matchRate}% match rate`,
    },
  ]

  const completionLevels = [
    { label: 'Profile Completion', value: stats.completionScore, min: 0, max: 100 },
    { label: 'Match Quality', value: Math.max(0, stats.matchRate), min: 0, max: 100 },
    { label: 'Engagement', value: Math.min(100, (stats.messages * 20)), min: 0, max: 100 },
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="border-border/50 hover:border-accent/50 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.trend}
                    </p>
                  </div>
                  <div
                    className={cn('p-2.5 rounded-lg', stat.bgColor)}
                  >
                    <Icon className={cn('w-5 h-5', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Progress Indicators */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Profile Strength
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {completionLevels.map((level) => (
            <div key={level.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {level.label}
                </span>
                <span className="text-sm font-semibold text-accent">
                  {level.value}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    level.value >= 80
                      ? 'bg-green-500'
                      : level.value >= 60
                        ? 'bg-accent'
                        : 'bg-amber-500'
                  )}
                  style={{ width: `${level.value}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-border/50 border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-5 h-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {stats.completionScore < 90 && (
              <li className="flex gap-3 text-sm">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span className="text-foreground">
                  Complete your profile details to improve match quality
                </span>
              </li>
            )}
            {stats.matchRate < 50 && (
              <li className="flex gap-3 text-sm">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span className="text-foreground">
                  Refine your preferences to see better matched {role === 'startup' ? 'investors' : 'startups'}
                </span>
              </li>
            )}
            {stats.messages === 0 && stats.likes > 0 && (
              <li className="flex gap-3 text-sm">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span className="text-foreground">
                  Reach out to your likes to start conversations
                </span>
              </li>
            )}
            {stats.profileViews === 0 && (
              <li className="flex gap-3 text-sm">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <span className="text-foreground">
                  Your profile hasn&apos;t been viewed yet. Try the discovery tab!
                </span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            AI Match Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              Based on your activity, you&apos;re showing strong interest in{' '}
              <Badge variant="secondary" className="ml-1">
                {role === 'startup' ? 'Series A funds' : 'B2B SaaS'}
              </Badge>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              Your ideal match score range is{' '}
              <Badge variant="outline" className="ml-1">
                75-95%
              </Badge>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              💡 Tip: Profiles with higher completion scores tend to get 3x more matches
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

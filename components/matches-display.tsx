'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, MessageCircle, Share2, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface Match {
  id: string
  firm_name?: string
  company_name?: string
  matchScore: number
  matchReasons: string[]
  industry?: string
  location?: string
  founded_year?: number
  team_size?: number
  funding_goal?: number
  stage?: string
  min_investment?: number
  max_investment?: number
}

interface MatchesDisplayProps {
  role: 'startup' | 'investor'
}

export function MatchesDisplay({ role }: MatchesDisplayProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [likedMatches, setLikedMatches] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches?limit=12')
        if (!response.ok) throw new Error('Failed to fetch matches')
        const data = await response.json()
        setMatches(data.matches || [])
      } catch (error) {
        console.error('[v0] Error fetching matches:', error)
        toast.error('Failed to load matches')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const toggleLike = (matchId: string) => {
    setLikedMatches(prev => {
      const newSet = new Set(prev)
      if (newSet.has(matchId)) {
        newSet.delete(matchId)
      } else {
        newSet.add(matchId)
      }
      return newSet
    })
    toast.success('Match added to favorites!')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-slate-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50'
    if (score >= 60) return 'bg-blue-50'
    if (score >= 40) return 'bg-amber-50'
    return 'bg-slate-50'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No matches yet</h3>
        <p className="text-slate-600">
          {role === 'startup'
            ? 'Complete your profile to get matched with investors'
            : 'Complete your profile to discover startup opportunities'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {role === 'startup' ? 'Investor Matches' : 'Startup Opportunities'}
          </h2>
          <p className="text-slate-600 mt-1">
            {matches.length} high-quality {role === 'startup' ? 'investors' : 'startups'} match your profile
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-600">Average Match Score</div>
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(matches.reduce((sum, m) => sum + m.matchScore, 0) / matches.length)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map(match => (
          <Card
            key={match.id}
            className="hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {role === 'startup' ? match.firm_name : match.company_name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {role === 'startup'
                      ? match.location
                      : `${match.industry || 'Technology'} • Founded ${match.founded_year || 'Recently'}`}
                  </CardDescription>
                </div>
                <div
                  className={`${getScoreBgColor(match.matchScore)} rounded-lg p-2 min-w-fit`}
                >
                  <div className={`text-2xl font-bold ${getScoreColor(match.matchScore)}`}>
                    {match.matchScore}%
                  </div>
                  <div className="text-xs font-medium text-slate-600">Match</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="space-y-4">
                {/* Match reasons */}
                <div>
                  <div className="text-xs font-semibold text-slate-600 mb-2">Why this match?</div>
                  <div className="space-y-1.5">
                    {match.matchReasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Zap className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-700">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key info */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {role === 'startup' ? (
                      <>
                        <div>
                          <div className="text-slate-600">Investment Range</div>
                          <div className="font-semibold text-slate-900">
                            ${(match.min_investment ? match.min_investment / 1000000 : 0).toFixed(1)}M -{' '}
                            {match.max_investment ? `$${(match.max_investment / 1000000).toFixed(1)}M` : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-600">Profile</div>
                          <div className="font-semibold text-slate-900">Complete</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="text-slate-600">Stage</div>
                          <div className="font-semibold text-slate-900">{match.stage || 'Seed'}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Team Size</div>
                          <div className="font-semibold text-slate-900">{match.team_size || 0}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => toggleLike(match.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${likedMatches.has(match.id) ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    <span className="hidden sm:inline">Like</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Message</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

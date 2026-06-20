'use client'

import { AIMatch } from '@/lib/ai-recommendation-engine'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DiscoveryAIInsightsProps {
  match: AIMatch
  userRole: 'startup' | 'investor'
}

export function DiscoveryAIInsights({ match, userRole }: DiscoveryAIInsightsProps) {
  const scoreColor = match.score >= 80 ? 'accent' : match.score >= 60 ? 'primary' : 'muted'
  
  return (
    <div className="space-y-4 pt-4 border-t border-border">
      {/* Match Score Section */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center space-y-2">
            <div className={cn(
              'text-3xl font-bold',
              match.score >= 80 ? 'text-accent' : match.score >= 60 ? 'text-primary' : 'text-muted-foreground'
            )}>
              {match.score}%
            </div>
            <p className="text-xs text-muted-foreground font-medium">Match Score</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-3xl font-bold text-accent">
              {match.confidence.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground font-medium">Confidence</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-2xl font-bold text-primary">
              {match.fundingReadiness.score}%
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {userRole === 'startup' ? 'Investor' : 'Startup'} Fit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Why Matched */}
      {match.reasons.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap size={16} className="text-accent" />
              Why This Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {match.reasons.map((reason, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-foreground">{reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {match.strengths.length > 0 && (
        <Card className="border-border/50 border-l-2 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-accent" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {match.strengths.map((strength, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-foreground">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Concerns */}
      {match.concerns.length > 0 && (
        <Card className="border-border/50 border-l-2 border-l-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle size={16} className="text-destructive" />
              Things to Verify
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {match.concerns.map((concern, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-destructive mt-1">•</span>
                  <span className="text-foreground">{concern}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Action */}
      <Card className="border-border/50 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Recommended Next Step
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground font-medium">{match.nextAction}</p>
        </CardContent>
      </Card>

      {/* Funding Readiness */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {userRole === 'startup' ? 'Funding Readiness' : 'Investment Readiness'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Readiness Score</span>
              <span className="text-sm font-semibold text-foreground">{match.fundingReadiness.score}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${match.fundingReadiness.score}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{match.fundingReadiness.assessment}</p>
        </CardContent>
      </Card>
    </div>
  )
}

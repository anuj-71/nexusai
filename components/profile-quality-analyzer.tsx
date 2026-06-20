'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react'

interface MissingField {
  field: string
  impact: 'critical' | 'high' | 'medium'
  reason: string
}

interface ProfileQualityAnalyzerProps {
  completionScore: number
  matchabilityScore: number
  missingFields: MissingField[]
  strengths: string[]
}

export function ProfileQualityAnalyzer({
  completionScore,
  matchabilityScore,
  missingFields,
  strengths
}: ProfileQualityAnalyzerProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent'
    if (score >= 60) return 'text-primary'
    return 'text-destructive'
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/30'
      case 'high':
        return 'bg-primary/10 text-primary border-primary/30'
      default:
        return 'bg-accent/10 text-accent border-accent/30'
    }
  }

  return (
    <div className="space-y-4">
      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getScoreColor(completionScore)}`}>
                {completionScore}%
              </span>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${completionScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Matchability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getScoreColor(matchabilityScore)}`}>
                {matchabilityScore}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {matchabilityScore >= 80 ? '✨ Highly matchable' : 'Add more details to improve'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Profile Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {strengths.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-600 mt-0.5">•</span>
                  <span className="text-slate-700 dark:text-slate-300">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missing Fields */}
      {missingFields.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Recommended Additions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {missingFields.map((field, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border space-y-2 ${getImpactColor(field.impact)}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{field.field}</p>
                  <Badge variant="outline" className="text-xs">
                    {field.impact}
                  </Badge>
                </div>
                <p className="text-sm opacity-90">{field.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <Button className="w-full gap-2" variant="outline">
        <Zap className="w-4 h-4" />
        Complete Profile to Unlock More Matches
      </Button>
    </div>
  )
}

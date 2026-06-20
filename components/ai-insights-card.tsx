'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, TrendingUp, AlertCircle } from 'lucide-react'

interface InsightMetric {
  label: string
  value: string | number
  status: 'positive' | 'neutral' | 'warning'
  change?: string
}

interface AIInsightsCardProps {
  title: string
  description?: string
  metrics: InsightMetric[]
  recommendation?: string
  icon?: 'zap' | 'trending' | 'alert'
}

export function AIInsightsCard({
  title,
  description,
  metrics,
  recommendation,
  icon = 'zap'
}: AIInsightsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200'
      case 'warning':
        return 'bg-amber-50 text-amber-900 border-amber-200'
      default:
        return 'bg-slate-50 text-slate-900 border-slate-200'
    }
  }

  const getIconComponent = () => {
    switch (icon) {
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-primary" />
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-amber-500" />
      default:
        return <Zap className="w-5 h-5 text-accent" />
    }
  }

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getIconComponent()}
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              {description && <CardDescription className="text-sm mt-1">{description}</CardDescription>}
            </div>
          </div>
          <Badge className="ml-2 whitespace-nowrap">AI</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${getStatusColor(metric.status)}`}
            >
              <p className="text-xs font-medium opacity-75 mb-1">{metric.label}</p>
              <div className="flex items-end justify-between gap-1">
                <p className="text-lg font-bold">{metric.value}</p>
                {metric.change && (
                  <span className="text-xs opacity-75">{metric.change}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        {recommendation && (
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-3 rounded-lg border border-primary/10">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-primary">AI Recommendation:</span> {recommendation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

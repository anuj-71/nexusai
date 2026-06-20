'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface MatchReason {
  title: string
  explanation: string
  score: number
}

interface PremiumMatchCardProps {
  id: string
  name: string
  type: 'investor' | 'startup'
  description: string
  image?: string
  matchScore: number
  matchReasons: MatchReason[]
  metadata: Record<string, any>
  isFavorite?: boolean
  onLike?: () => void
  onConnect?: () => void
}

export function PremiumMatchCard({
  id,
  name,
  type,
  description,
  image,
  matchScore,
  matchReasons,
  metadata,
  isFavorite = false,
  onLike,
  onConnect
}: PremiumMatchCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
        showDetails ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setShowDetails(!showDetails)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setShowDetails(!showDetails)
        }
      }}
      aria-expanded={showDetails}
      aria-label={`${name} - ${type === 'investor' ? 'Investor' : 'Startup'} profile`}
    >
      {/* Header with Score */}
      <div className={`h-1 ${type === 'investor' ? 'bg-primary' : 'bg-accent'}`} />

      <div className="p-4 space-y-4">
        {/* Title Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate mt-0.5">{description}</p>
          </div>

          {/* Match Score Badge */}
          <div className="flex-shrink-0 text-center">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{matchScore}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Match</p>
          </div>
        </div>

        {/* Key Metadata */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(metadata).slice(0, 2).map(([key, value]) => (
            <div key={key} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
              <p className="text-xs text-muted-foreground font-medium capitalize">{key}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </p>
            </div>
          ))}
        </div>

        {/* Match Reasons (Collapsible) */}
        {showDetails && (
          <div className="space-y-3 border-t pt-3">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">Why This Match</h4>
            {matchReasons.map((reason, idx) => (
              <div key={idx} className="bg-gradient-to-r from-primary/5 to-accent/5 p-3 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm text-slate-900 dark:text-slate-50">{reason.title}</p>
                  <Badge variant="secondary" className="text-xs">
                    +{reason.score}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{reason.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation()
              setFavorite(!favorite)
              onLike?.()
            }}
          >
            <Heart
              size={16}
              className={favorite ? 'fill-red-500 text-red-500' : ''}
            />
            <span className="hidden sm:inline">{favorite ? 'Saved' : 'Save'}</span>
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation()
              onConnect?.()
            }}
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Connect</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(!showDetails)
            }}
          >
            <ChevronRight size={16} className={`transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

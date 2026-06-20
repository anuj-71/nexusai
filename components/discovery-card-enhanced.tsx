'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DiscoveryAIInsights } from '@/components/discovery-ai-insights'
import { AIMatch } from '@/lib/ai-recommendation-engine'
import { Heart, MessageCircle, ChevronLeft, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EnhancedDiscoveryCardProps {
  id: string
  name: string
  tagline: string
  description: string
  location: string
  matchScore: number
  tags: string[]
  details: Record<string, string>
  aiMatch?: AIMatch
  userRole: 'startup' | 'investor'
  onLike: () => Promise<void>
  onPass: () => Promise<void>
  onConnect: () => Promise<void>
  isLoading?: boolean
}

export function EnhancedDiscoveryCard({
  id,
  name,
  tagline,
  description,
  location,
  matchScore,
  tags,
  details,
  aiMatch,
  userRole,
  onLike,
  onPass,
  onConnect,
  isLoading = false,
}: EnhancedDiscoveryCardProps) {
  const [showInsights, setShowInsights] = useState(false)
  const [isActing, setIsActing] = useState(false)

  const handleAction = async (action: () => Promise<void>) => {
    setIsActing(true)
    try {
      await action()
    } finally {
      setIsActing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="space-y-4">
          {/* Header with Match Score */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{name}</h2>
              <p className="text-sm text-accent font-medium mt-1">{tagline}</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-accent-foreground whitespace-nowrap ml-2',
                matchScore >= 80
                  ? 'bg-accent'
                  : matchScore >= 60
                    ? 'bg-primary'
                    : 'bg-muted'
              )}
            >
              <Zap size={16} fill="currentColor" />
              {matchScore}%
            </motion.div>
          </div>

          {/* Location and Tags */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{location}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Details Grid */}
          {Object.entries(details).length > 0 && (
            <div className="grid grid-cols-2 gap-3 py-3 px-3 bg-muted rounded-lg">
              {Object.entries(details).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {key}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* AI Insights Toggle */}
          {aiMatch && (
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-accent/30 hover:bg-accent/5 transition-colors text-sm text-accent font-medium"
            >
              <Zap size={14} />
              {showInsights ? 'Hide' : 'Show'} AI Insights
            </button>
          )}
        </CardContent>
      </Card>

      {/* AI Insights Expanded */}
      {showInsights && aiMatch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <DiscoveryAIInsights match={aiMatch} userRole={userRole} />
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleAction(onPass)}
          disabled={isLoading || isActing}
          className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft size={18} />
          Pass
        </Button>

        <Button
          size="lg"
          onClick={() => handleAction(onConnect)}
          disabled={isLoading || isActing}
          className="flex-1 gap-2 bg-accent hover:bg-accent/90"
        >
          <MessageCircle size={18} />
          Connect
        </Button>

        <Button
          size="lg"
          onClick={() => handleAction(onLike)}
          disabled={isLoading || isActing}
          className="flex-1 gap-2 bg-primary hover:bg-primary/90"
        >
          <Heart size={18} />
          Like
        </Button>
      </div>
    </motion.div>
  )
}

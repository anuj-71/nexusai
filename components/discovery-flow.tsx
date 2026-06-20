'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, ChevronLeft, ChevronRight, Zap, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface DiscoveryProfile {
  id: string
  name: string
  tagline: string
  description: string
  image?: string
  category: string
  location: string
  matchScore: number
  tags: string[]
  details: Record<string, string>
  liked?: boolean
}

interface DiscoveryFlowProps {
  profiles: DiscoveryProfile[]
  userRole: 'startup' | 'investor'
  onLike: (id: string) => Promise<void>
  onPass: (id: string) => Promise<void>
  onConnect: (id: string) => Promise<void>
}

export function DiscoveryFlow({
  profiles,
  userRole,
  onLike,
  onPass,
  onConnect,
}: DiscoveryFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [swiped, setSwiped] = useState<string[]>([])

  const currentProfile = profiles[currentIndex]
  const progress = ((currentIndex + 1) / profiles.length) * 100

  const handlePass = async () => {
    if (!currentProfile || loading) return
    setLoading(true)
    try {
      await onPass(currentProfile.id)
      setSwiped([...swiped, currentProfile.id])
      setCurrentIndex(currentIndex + 1)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!currentProfile || loading) return
    setLoading(true)
    try {
      await onLike(currentProfile.id)
      setSwiped([...swiped, currentProfile.id])
      setCurrentIndex(currentIndex + 1)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!currentProfile || loading) return
    setLoading(true)
    try {
      await onConnect(currentProfile.id)
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSwiped(swiped.slice(0, -1))
    }
  }

  if (!currentProfile && currentIndex >= profiles.length) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-card p-6">
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">You&apos;ve reviewed all profiles!</h2>
            <p className="text-muted-foreground">
              You&apos;ve reviewed {swiped.length} {userRole === 'startup' ? 'investors' : 'startups'}. Check your matches!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                setCurrentIndex(0)
                setSwiped([])
              }}
              className="gap-2"
            >
              <ChevronLeft size={18} />
              Review Again
            </Button>
            <Button variant="outline" className="gap-2">
              <TrendingUp size={18} />
              View Matches
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">
            {Math.min(currentIndex + 1, profiles.length)} / {profiles.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {swiped.length} reviewed
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentProfile && (
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Main Card */}
            <Card className="overflow-hidden border-2 border-border/50 hover:border-accent/50 transition-colors">
              {/* Header with Match Score */}
              <div className="relative h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                {currentProfile.image ? (
                  <img
                    src={currentProfile.image}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-5xl font-bold text-primary/20">
                      {currentProfile.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Match Score Badge */}
                <div className="absolute top-4 right-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-accent-foreground',
                      currentProfile.matchScore >= 80
                        ? 'bg-accent'
                        : currentProfile.matchScore >= 60
                          ? 'bg-primary'
                          : 'bg-muted'
                    )}
                  >
                    <Zap size={16} fill="currentColor" />
                    {currentProfile.matchScore}%
                  </motion.div>
                </div>
              </div>

              <CardHeader className="space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{currentProfile.name}</h2>
                  <p className="text-sm text-accent font-medium">{currentProfile.tagline}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{currentProfile.category}</Badge>
                  <Badge variant="outline">{currentProfile.location}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentProfile.description}
                </p>

                {/* Details Grid */}
                {Object.entries(currentProfile.details).length > 0 && (
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                    {Object.entries(currentProfile.details).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          {key}
                        </p>
                        <p className="text-sm font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {currentProfile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {/* Pass Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePass}
                    disabled={loading}
                    className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft size={18} />
                    Pass
                  </Button>

                  {/* Connect Button (Primary Action) */}
                  <Button
                    size="lg"
                    onClick={handleConnect}
                    disabled={loading}
                    className="flex-1 gap-2 bg-accent hover:bg-accent/90"
                  >
                    <MessageCircle size={18} />
                    Connect
                  </Button>

                  {/* Like Button */}
                  <Button
                    size="lg"
                    onClick={handleLike}
                    disabled={loading}
                    className={cn(
                      'flex-1 gap-2',
                      currentProfile.liked
                        ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                        : 'bg-primary hover:bg-primary/90'
                    )}
                  >
                    <Heart size={18} fill={currentProfile.liked ? 'currentColor' : 'none'} />
                    {currentProfile.liked ? 'Liked' : 'Like'}
                  </Button>
                </div>

                {/* Back Button */}
                {currentIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBack}
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Previous
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

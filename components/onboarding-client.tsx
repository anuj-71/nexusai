'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, CheckCircle } from 'lucide-react'
import { StartupOnboarding } from './startup-onboarding'
import { InvestorOnboarding } from './investor-onboarding'

interface Profile {
  id: string
  role: 'startup' | 'investor'
  full_name?: string
  email?: string
}

interface Props {
  profile: Profile
  userId: string
}

export function OnboardingClient({ profile, userId }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) throw new Error('Failed to complete onboarding')
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      setIsCompleting(false)
    }
  }

  const isStartup = profile.role === 'startup'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with progress */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              {isStartup ? 'Startup' : 'Investor'} Setup
            </h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all ${isStartup ? 'bg-accent' : 'bg-primary'}`}
              style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of 4
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-2xl">
          {isStartup ? (
            <StartupOnboarding
              userId={userId}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onComplete={handleComplete}
              isCompleting={isCompleting}
            />
          ) : (
            <InvestorOnboarding
              userId={userId}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onComplete={handleComplete}
              isCompleting={isCompleting}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

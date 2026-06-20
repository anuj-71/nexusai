'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  userId: string
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => Promise<void>
  isCompleting: boolean
}

export function StartupOnboarding({
  userId,
  currentStep,
  onStepChange,
  onComplete,
  isCompleting,
}: Props) {
  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    industry: '',
    stage: '',
    teamSize: '',
    fundingGoal: '',
  })

  const stages = [
    'Ideation',
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D+',
  ]

  const industries = [
    'AI/ML',
    'B2B SaaS',
    'B2C Commerce',
    'FinTech',
    'HealthTech',
    'ClimaTech',
    'EdTech',
    'Other',
  ]

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile/startup/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        console.error('Failed to save profile')
        return
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const handleStepChange = (newStep: number) => {
    handleSaveProfile()
    onStepChange(newStep)
  }

  const steps = [
    {
      title: 'Welcome to NexusAI',
      description: 'Let&apos;s get your startup set up. This will take just a few minutes.',
      content: (
        <div className="space-y-4">
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
            <h3 className="font-semibold text-accent mb-3">What you&apos;ll do:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex">
                <span className="mr-3">1.</span>
                <span>Tell us about your company</span>
              </li>
              <li className="flex">
                <span className="mr-3">2.</span>
                <span>Share your fundraising goals</span>
              </li>
              <li className="flex">
                <span className="mr-3">3.</span>
                <span>Define your ideal investor</span>
              </li>
              <li className="flex">
                <span className="mr-3">4.</span>
                <span>Get matched with opportunities</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-slate-600">
            You can update your profile anytime in settings.
          </p>
        </div>
      ),
    },
    {
      title: 'Tell us about your company',
      description: 'Basic information helps investors understand your startup',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="font-medium">Company Name *</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Your company name"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline" className="font-medium">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              placeholder="One-line description"
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry" className="font-medium">Industry</Label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg"
              >
                <option value="">Select industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage" className="font-medium">Funding Stage</Label>
              <select
                id="stage"
                value={formData.stage}
                onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg"
              >
                <option value="">Select stage</option>
                {stages.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Fundraising details',
      description: 'Help investors understand your funding needs',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamSize" className="font-medium">Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              value={formData.teamSize}
              onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
              placeholder="Number of employees"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundingGoal" className="font-medium">Funding Goal (USD)</Label>
            <div className="flex">
              <span className="flex items-center px-3 bg-muted border border-input rounded-l-lg text-muted-foreground">$</span>
              <Input
                id="fundingGoal"
                type="number"
                value={formData.fundingGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, fundingGoal: e.target.value }))}
                placeholder="e.g., 1000000"
                className="h-10 rounded-l-none border-l-0"
              />
            </div>
            <p className="text-xs text-muted-foreground">This round&apos;s target</p>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-sm text-foreground">
              💡 <strong>Tip:</strong> Be realistic with your funding goal to attract serious investors
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'You&apos;re all set!',
      description: 'Your profile is ready. Start connecting with investors.',
      content: (
        <div className="space-y-4 text-center">
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-8">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-semibold text-foreground mb-2">Ready to raise!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your startup profile is complete. You can now:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li>• Browse investor matches</li>
              <li>• Complete your detailed profile</li>
              <li>• Start conversations with investors</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]
  const canProceed = currentStep === 0 || currentStep === 3 || (
    currentStep === 1 && formData.companyName && formData.industry && formData.stage
  ) || (
    currentStep === 2 && formData.teamSize && formData.fundingGoal
  )

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
        <p className="text-slate-600 mt-2">{currentStepData.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStepData.content}

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => handleStepChange(currentStep - 1)}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft size={18} />
            Back
          </Button>

          {currentStep === 3 ? (
            <Button
              onClick={() => {
                handleSaveProfile()
                onComplete()
              }}
              disabled={isCompleting}
              className="flex-1"
            >
              {isCompleting ? 'Completing...' : 'Go to Dashboard'}
            </Button>
          ) : (
            <Button
              onClick={() => handleStepChange(currentStep + 1)}
              disabled={!canProceed}
              className="flex-1 gap-2"
            >
              Next
              <ChevronRight size={18} />
            </Button>
          )}
        </div>
      </CardContent>
    </>
  )
}

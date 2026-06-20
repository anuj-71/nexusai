'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  userId: string
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => Promise<void>
  isCompleting: boolean
}

export function InvestorOnboarding({
  userId,
  currentStep,
  onStepChange,
  onComplete,
  isCompleting,
}: Props) {
  const [formData, setFormData] = useState({
    firmName: '',
    investorType: '',
    checkSize: '',
    focusAreas: [] as string[],
    yearsExperience: '',
  })

  const investorTypes = ['Angel', 'Venture Capital', 'Family Office', 'Corporate', 'Other']

  const focusAreasOptions = [
    'AI/ML',
    'B2B SaaS',
    'B2C Commerce',
    'FinTech',
    'HealthTech',
    'ClimaTech',
    'EdTech',
    'Deep Tech',
  ]

  const toggleFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area],
    }))
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile/investor/save', {
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
      description: 'Find promising startups that match your investment thesis.',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">What you&apos;ll do:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex">
                <span className="mr-3">1.</span>
                <span>Set up your investor profile</span>
              </li>
              <li className="flex">
                <span className="mr-3">2.</span>
                <span>Define your investment preferences</span>
              </li>
              <li className="flex">
                <span className="mr-3">3.</span>
                <span>Explore curated startup opportunities</span>
              </li>
              <li className="flex">
                <span className="mr-3">4.</span>
                <span>Connect with promising founders</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-slate-600">
            Updates and filters can be changed anytime in your settings.
          </p>
        </div>
      ),
    },
    {
      title: 'Tell us about yourself',
      description: 'Help startups understand your investment background',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firmName" className="font-medium">Firm/Name</Label>
            <Input
              id="firmName"
              value={formData.firmName}
              onChange={(e) => setFormData(prev => ({ ...prev, firmName: e.target.value }))}
              placeholder="Your firm or name"
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investorType" className="font-medium">Investor Type *</Label>
              <select
                id="investorType"
                value={formData.investorType}
                onChange={(e) => setFormData(prev => ({ ...prev, investorType: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg"
              >
                <option value="">Select type</option>
                {investorTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience" className="font-medium">Years Investing</Label>
              <Input
                id="yearsExperience"
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                placeholder="Years"
                className="h-10"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Your investment profile',
      description: 'Define your investment criteria',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkSize" className="font-medium">Typical Check Size (USD)</Label>
            <div className="flex">
              <span className="flex items-center px-3 bg-slate-100 border border-slate-200 rounded-l-lg">$</span>
              <Input
                id="checkSize"
                type="number"
                value={formData.checkSize}
                onChange={(e) => setFormData(prev => ({ ...prev, checkSize: e.target.value }))}
                placeholder="e.g., 500000"
                className="h-10 rounded-l-none border-l-0"
              />
            </div>
            <p className="text-xs text-slate-600">Range of investments you typically make</p>
          </div>

          <div className="space-y-3">
            <Label className="font-medium">Focus Areas</Label>
            <div className="grid grid-cols-2 gap-2">
              {focusAreasOptions.map(area => (
                <button
                  key={area}
                  onClick={() => toggleFocusArea(area)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                    formData.focusAreas.includes(area)
                      ? 'bg-blue-50 border-blue-500 text-blue-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {formData.focusAreas.includes(area) && <Check size={16} />}
                    {area}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'You&apos;re all set!',
      description: 'Start exploring promising startup opportunities.',
      content: (
        <div className="space-y-4 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="font-semibold text-slate-900 mb-2">Ready to invest!</h3>
            <p className="text-sm text-slate-600 mb-6">
              Your investor profile is complete. You can now:
            </p>
            <ul className="text-sm text-slate-700 space-y-2 text-left">
              <li>• Browse startups by focus area</li>
              <li>• Save interesting companies</li>
              <li>• Schedule meetings with founders</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]
  const canProceed = currentStep === 0 || currentStep === 3 || (
    currentStep === 1 && formData.firmName && formData.investorType
  ) || (
    currentStep === 2 && formData.checkSize
  )

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
        <p className="text-muted-foreground mt-2">{currentStepData.description}</p>
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

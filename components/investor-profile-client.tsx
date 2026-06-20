'use client'

import { useState } from 'react'
import { InvestorProfileEditor } from './investor-profile-editor'
import { toast } from 'sonner'

interface InvestorProfile {
  id?: string
  user_id?: string
  firm_name?: string
  firm_description?: string
  investment_focus?: string
  min_investment?: number
  max_investment?: number
  preferred_sectors?: string[]
  preferred_stages?: string[]
  portfolio_companies?: string[]
  website_url?: string
  logo_url?: string
  location?: string
  completion_percentage?: number
}

interface Props {
  initialProfile: InvestorProfile
  userId: string
}

export function InvestorProfileClient({ initialProfile, userId }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async (updates: InvestorProfile) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/investor-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      toast.success('Profile saved successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <InvestorProfileEditor
      profile={initialProfile}
      onSave={handleSave}
      isLoading={isLoading}
    />
  )
}

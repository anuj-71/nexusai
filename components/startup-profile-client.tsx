'use client'

import { useState } from 'react'
import { StartupProfileEditor } from './startup-profile-editor'
import { toast } from 'sonner'

interface StartupProfile {
  id?: string
  user_id?: string
  company_name?: string
  company_tagline?: string
  company_description?: string
  industry?: string
  stage?: string
  funding_goal?: number
  current_funding?: number
  website_url?: string
  logo_url?: string
  team_size?: number
  founded_year?: number
  location?: string
  completion_percentage?: number
}

interface Props {
  initialProfile: StartupProfile
  userId: string
}

export function StartupProfileClient({ initialProfile, userId }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async (updates: StartupProfile) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/startup-profile', {
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
    <StartupProfileEditor
      profile={initialProfile}
      onSave={handleSave}
      isLoading={isLoading}
    />
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Upload } from 'lucide-react'

interface StartupProfile {
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
  profile: StartupProfile
  onSave: (updates: StartupProfile) => Promise<void>
  isLoading?: boolean
}

export function StartupProfileEditor({ profile, onSave, isLoading = false }: Props) {
  const [formData, setFormData] = useState(profile)
  const [isSaving, setIsSaving] = useState(false)

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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const completionPercentage = formData.completion_percentage || 0

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Profile Completion</h3>
          <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Company Logo Section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Company Logo</h4>
        <div className="flex items-center gap-4">
          {formData.logo_url ? (
            <img
              src={formData.logo_url}
              alt="Company logo"
              className="w-20 h-20 rounded-lg object-cover bg-muted"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
              <Upload size={32} className="text-muted-foreground" />
            </div>
          )}
          <Button variant="outline" className="h-10">
            Upload Logo
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900">Basic Information</h4>
        
        <div className="space-y-2">
          <Label htmlFor="company_name" className="font-medium">Company Name *</Label>
          <Input
            id="company_name"
            value={formData.company_name || ''}
            onChange={(e) => handleChange('company_name', e.target.value)}
            placeholder="Your company name"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_tagline" className="font-medium">Tagline</Label>
          <Input
            id="company_tagline"
            value={formData.company_tagline || ''}
            onChange={(e) => handleChange('company_tagline', e.target.value)}
            placeholder="One-line description of your company"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_description" className="font-medium">Company Description</Label>
          <textarea
            id="company_description"
            value={formData.company_description || ''}
            onChange={(e) => handleChange('company_description', e.target.value)}
            placeholder="Tell us about your company..."
            className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm bg-input"
            rows={4}
          />
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Company Details</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry" className="font-medium">Industry</Label>
            <select
              id="industry"
              value={formData.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full h-10 px-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm bg-input"
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
              value={formData.stage || ''}
              onChange={(e) => handleChange('stage', e.target.value)}
              className="w-full h-10 px-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm bg-input"
            >
              <option value="">Select stage</option>
              {stages.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="founded_year" className="font-medium">Founded Year</Label>
            <Input
              id="founded_year"
              type="number"
              value={formData.founded_year || ''}
              onChange={(e) => handleChange('founded_year', parseInt(e.target.value))}
              placeholder="2024"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_size" className="font-medium">Team Size</Label>
            <Input
              id="team_size"
              type="number"
              value={formData.team_size || ''}
              onChange={(e) => handleChange('team_size', parseInt(e.target.value))}
              placeholder="Number of employees"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="font-medium">Location</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, Country"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website_url" className="font-medium">Website URL</Label>
          <Input
            id="website_url"
            type="url"
            value={formData.website_url || ''}
            onChange={(e) => handleChange('website_url', e.target.value)}
            placeholder="https://yourcompany.com"
            className="h-10"
          />
        </div>
      </div>

      {/* Funding Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900">Funding Information</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current_funding" className="font-medium">Current Funding Raised</Label>
            <div className="flex items-center">
              <span className="text-slate-600 mr-2">$</span>
              <Input
                id="current_funding"
                type="number"
                value={formData.current_funding || ''}
                onChange={(e) => handleChange('current_funding', parseInt(e.target.value))}
                placeholder="0"
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funding_goal" className="font-medium">Funding Goal</Label>
            <div className="flex items-center">
              <span className="text-slate-600 mr-2">$</span>
              <Input
                id="funding_goal"
                type="number"
                value={formData.funding_goal || ''}
                onChange={(e) => handleChange('funding_goal', parseInt(e.target.value))}
                placeholder="0"
                className="h-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <Button
          onClick={handleSave}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          disabled={isSaving || isLoading}
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  )
}

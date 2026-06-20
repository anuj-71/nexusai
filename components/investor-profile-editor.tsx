'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Upload, X } from 'lucide-react'

interface InvestorProfile {
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
  profile: InvestorProfile
  onSave: (updates: InvestorProfile) => Promise<void>
  isLoading?: boolean
}

export function InvestorProfileEditor({ profile, onSave, isLoading = false }: Props) {
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

  const sectors = [
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

  const addTag = (field: 'preferred_sectors' | 'preferred_stages' | 'portfolio_companies', value: string) => {
    if (value && !formData[field]?.includes(value)) {
      handleChange(field, [...(formData[field] || []), value])
    }
  }

  const removeTag = (field: 'preferred_sectors' | 'preferred_stages' | 'portfolio_companies', index: number) => {
    const updated = [...(formData[field] || [])]
    updated.splice(index, 1)
    handleChange(field, updated)
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
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Firm Logo Section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Firm Logo</h4>
        <div className="flex items-center gap-4">
          {formData.logo_url ? (
            <img
              src={formData.logo_url}
              alt="Firm logo"
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
        <h4 className="font-semibold text-foreground">Basic Information</h4>
        
        <div className="space-y-2">
          <Label htmlFor="firm_name" className="font-medium">Firm Name *</Label>
          <Input
            id="firm_name"
            value={formData.firm_name || ''}
            onChange={(e) => handleChange('firm_name', e.target.value)}
            placeholder="Your firm name"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firm_description" className="font-medium">Firm Description</Label>
          <textarea
            id="firm_description"
            value={formData.firm_description || ''}
            onChange={(e) => handleChange('firm_description', e.target.value)}
            placeholder="Describe your firm..."
            className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm bg-input"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment_focus" className="font-medium">Investment Focus / Strategy</Label>
          <textarea
            id="investment_focus"
            value={formData.investment_focus || ''}
            onChange={(e) => handleChange('investment_focus', e.target.value)}
            placeholder="What sectors do you focus on?..."
            className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm bg-input"
            rows={3}
          />
        </div>
      </div>

      {/* Firm Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Firm Details</h4>
        
        <div className="grid grid-cols-2 gap-4">
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
              placeholder="https://yourfirm.com"
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Investment Range */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Investment Range</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="max_investment" className="text-foreground">Maximum Investment</Label>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">$</span>
              <Input
                id="max_investment"
                type="number"
                value={formData.max_investment || ''}
                onChange={(e) => handleChange('max_investment', parseInt(e.target.value))}
                placeholder="0"
                className="h-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Investment Preferences */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Investment Preferences</h4>
        
        {/* Preferred Stages */}
        <div className="space-y-2">
          <Label className="font-medium">Preferred Funding Stages</Label>
          <div className="flex gap-2 flex-wrap mb-3">
            {formData.preferred_stages?.map((stage, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                {stage}
                <button
                  onClick={() => removeTag('preferred_stages', idx)}
                  className="hover:text-accent/80"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addTag('preferred_stages', e.target.value)
                e.target.value = ''
              }
            }}
            className="w-full h-10 px-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm bg-input"
          >
            <option value="">Add a stage</option>
            {stages.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Preferred Sectors */}
        <div className="space-y-2">
          <Label className="font-medium">Preferred Sectors</Label>
          <div className="flex gap-2 flex-wrap mb-3">
            {formData.preferred_sectors?.map((sector, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                {sector}
                <button
                  onClick={() => removeTag('preferred_sectors', idx)}
                  className="hover:text-accent/80"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addTag('preferred_sectors', e.target.value)
                e.target.value = ''
              }
            }}
            className="w-full h-10 px-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm bg-input"
          >
            <option value="">Add a sector</option>
            {sectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Portfolio Companies */}
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900">Portfolio Companies</h4>
        
        <div className="flex gap-2 flex-wrap mb-3">
          {formData.portfolio_companies?.map((company, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
              {company}
              <button
                onClick={() => removeTag('portfolio_companies', idx)}
                className="hover:text-slate-900"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <Input
          placeholder="Add a portfolio company name"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              addTag('portfolio_companies', e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
          className="h-10"
        />
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <Button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          disabled={isSaving || isLoading}
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  )
}

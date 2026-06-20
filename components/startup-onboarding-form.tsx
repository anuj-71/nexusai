"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase/client"

export default function StartupOnboardingForm() {
  const router = useRouter()
  const auth = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.target as HTMLFormElement
    const fd = new FormData(form)

    // Files
    const logoFile = (fd.get("logo") as File) || null
    const bannerFile = (fd.get("banner") as File) || null
    const pitchDeckFile = (fd.get("pitch_deck") as File) || null
    const onePagerFile = (fd.get("one_pager") as File) || null

    const payload = {
      user_id: auth.user?.id,
      role: "startup",
      startup: {
        startup_name: (fd.get("startup_name") as string) || "",
        tagline: (fd.get("tagline") as string) || null,
        industry: (fd.get("industry") as string) || null,
        website: (fd.get("website") as string) || null,
        location: (fd.get("location") as string) || null,

        problem_statement: (fd.get("problem_statement") as string) || null,
        solution: (fd.get("solution") as string) || null,
        target_market: (fd.get("target_market") as string) || null,
        business_model: (fd.get("business_model") as string) || null,
        competitive_advantage: (fd.get("competitive_advantage") as string) || null,

        funding_stage: (fd.get("funding_stage") as string) || (fd.get("stage") as string) || null,
        funding_required: fd.get("funding_required") ? Number(fd.get("funding_required")) : null,
        current_funding_raised: fd.get("current_funding_raised") ? Number(fd.get("current_funding_raised")) : null,
        revenue: fd.get("revenue") ? Number(fd.get("revenue")) : null,
        growth_rate: fd.get("growth_rate") ? Number(fd.get("growth_rate")) : null,

        founder_name: (fd.get("founder_name") as string) || null,
        founder_role: (fd.get("founder_role") as string) || null,
        founder_linkedin: (fd.get("founder_linkedin") as string) || null,
        team_size: fd.get("team_size") ? Number(fd.get("team_size")) : null,

        logo_url: null,
        banner_url: null,
        pitch_deck_url: null,
        one_pager_url: null,
      },
    }

    try {
      // Upload files to Supabase Storage (if present)
      try {
        const bucket = "uploads"

        if (logoFile && auth.user) {
          const logoPath = `startups/${auth.user.id}/logo-${Date.now()}-${logoFile.name}`
          const { error: upErr } = await supabase.storage.from(bucket).upload(logoPath, logoFile, { upsert: true })
          if (upErr) throw upErr
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(logoPath)
          payload.startup.logo_url = (urlData && (urlData.publicUrl || (urlData as any).public_url)) || null
        }

        if (bannerFile && auth.user) {
          const bannerPath = `startups/${auth.user.id}/banner-${Date.now()}-${bannerFile.name}`
          const { error: upErr } = await supabase.storage.from(bucket).upload(bannerPath, bannerFile, { upsert: true })
          if (upErr) throw upErr
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(bannerPath)
          payload.startup.banner_url = (urlData && (urlData.publicUrl || (urlData as any).public_url)) || null
        }

        if (pitchDeckFile && auth.user) {
          const pitchPath = `startups/${auth.user.id}/pitch-${Date.now()}-${pitchDeckFile.name}`
          const { error: upErr } = await supabase.storage.from(bucket).upload(pitchPath, pitchDeckFile, { upsert: true })
          if (upErr) throw upErr
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(pitchPath)
          payload.startup.pitch_deck_url = (urlData && (urlData.publicUrl || (urlData as any).public_url)) || null
        }

        if (onePagerFile && auth.user) {
          const onePath = `startups/${auth.user.id}/onepager-${Date.now()}-${onePagerFile.name}`
          const { error: upErr } = await supabase.storage.from(bucket).upload(onePath, onePagerFile, { upsert: true })
          if (upErr) throw upErr
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(onePath)
          payload.startup.one_pager_url = (urlData && (urlData.publicUrl || (urlData as any).public_url)) || null
        }
      } catch (e: any) {
        setError(e?.message ?? "File upload failed")
        setLoading(false)
        return
      }

      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to save profile")
      }

      // Redirect to startup dashboard
      router.push("/startup")
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <Label>Company Name</Label>
        <Input name="startup_name" required className="border-input bg-background" />
      </div>

      <div>
        <Label>Tagline</Label>
        <Input name="tagline" className="border-input bg-background" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Industry</Label>
          <Input name="industry" className="border-input bg-background" />
        </div>
        <div>
          <Label>Stage</Label>
          <Input name="stage" className="border-input bg-background" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Logo (image)</Label>
          <input name="logo" type="file" accept="image/*" className="mt-1" />
        </div>
        <div>
          <Label>Cover / Banner (image)</Label>
          <input name="banner" type="file" accept="image/*" className="mt-1" />
        </div>
      </div>

      <div>
        <Label>Problem Statement</Label>
        <Textarea name="problem_statement" className="border-input bg-background" />
      </div>

      <div>
        <Label>Solution</Label>
        <Textarea name="solution" className="border-input bg-background" />
      </div>

      <div>
        <Label>Target Market</Label>
        <Input name="target_market" className="border-input bg-background" />
      </div>

      <div>
        <Label>Business Model</Label>
        <Input name="business_model" className="border-input bg-background" />
      </div>

      <div>
        <Label>Competitive Advantage</Label>
        <Input name="competitive_advantage" className="border-input bg-background" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Funding Required</Label>
          <Input name="funding_required" type="number" className="border-input bg-background" />
        </div>
        <div>
          <Label>Current Funding Raised</Label>
          <Input name="current_funding_raised" type="number" className="border-input bg-background" />
        </div>
        <div>
          <Label>Revenue</Label>
          <Input name="revenue" type="number" className="border-input bg-background" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Growth Rate (%)</Label>
          <Input name="growth_rate" type="number" className="border-input bg-background" />
        </div>
        <div>
          <Label>Funding Stage</Label>
          <Input name="funding_stage" className="border-input bg-background" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Website</Label>
          <Input name="website" className="border-input bg-background" />
        </div>
        <div>
          <Label>Location</Label>
          <Input name="location" className="border-input bg-background" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Founder Name</Label>
          <Input name="founder_name" className="border-input bg-background" />
        </div>
        <div>
          <Label>Founder Role</Label>
          <Input name="founder_role" className="border-input bg-background" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Founder LinkedIn</Label>
          <Input name="founder_linkedin" className="border-input bg-background" />
        </div>
        <div>
          <Label>Team Size</Label>
          <Input name="team_size" type="number" className="border-input bg-background" />
        </div>
      </div>

      <div>
        <Label>Pitch Deck (PDF)</Label>
        <input name="pitch_deck" type="file" accept="application/pdf,.pdf,.ppt,.pptx" className="mt-1" />
      </div>

      <div>
        <Label>One-pager (optional)</Label>
        <input name="one_pager" type="file" accept="application/pdf,.pdf" className="mt-1" />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "Saving..." : "Complete Onboarding"}
      </Button>
    </form>
  )
}

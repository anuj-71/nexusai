"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase/client"

export default function InvestorOnboardingForm() {
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

    const preferred_industries = (fd.get("preferred_industries") as string) || ""
    const portfolio_companies = (fd.get("portfolio_companies") as string) || ""

    // Files
    const avatarFile = (fd.get("avatar") as File) || null
    const pitchDeckFile = (fd.get("pitch_deck") as File) || null

    const payload = {
      user_id: auth.user?.id,
      role: "investor",
      investor: {
        investor_name: (fd.get("investor_name") as string) || "",
        preferred_industries: preferred_industries ? preferred_industries.split(",").map(s => s.trim()) : null,
        preferred_stage: (fd.get("preferred_stage") as string) || null,
        investment_min: fd.get("investment_min") ? Number(fd.get("investment_min")) : null,
        investment_max: fd.get("investment_max") ? Number(fd.get("investment_max")) : null,
        location: (fd.get("location") as string) || null,
        bio: (fd.get("bio") as string) || null,
        linkedin_url: (fd.get("linkedin_url") as string) || null,
        portfolio_companies: portfolio_companies ? portfolio_companies.split(",").map(s => s.trim()) : null,
        avatar_url: null,
        pitch_deck_url: null,
      },
    }

    try {
      // Upload files to Supabase Storage (if present)
      try {
        const bucket = "uploads"
        if (avatarFile && auth.user) {
          const avatarPath = `investors/${auth.user.id}/avatar-${Date.now()}-${avatarFile.name}`
          const { error: upErr } = await supabase.storage.from(bucket).upload(avatarPath, avatarFile, { upsert: true })
          if (upErr) throw upErr
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(avatarPath)
          payload.investor.avatar_url = (urlData && (urlData.publicUrl || (urlData as any).public_url)) || null
        }

        if (pitchDeckFile && auth.user) {
          const pitchPath = `investors/${auth.user.id}/pitch-${Date.now()}-${pitchDeckFile.name}`
          const { error: upErr } = await supabase.storage.from(bucket).upload(pitchPath, pitchDeckFile, { upsert: true })
          if (upErr) throw upErr
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(pitchPath)
          payload.investor.pitch_deck_url = (urlData && (urlData.publicUrl || (urlData as any).public_url)) || null
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

      router.push("/investor")
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input name="investor_name" required className="border-input bg-background" />
      </div>

      <div>
        <Label>Preferred Industries (comma separated)</Label>
        <Input name="preferred_industries" className="border-input bg-background" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Preferred Stage</Label>
          <Input name="preferred_stage" className="border-input bg-background" />
        </div>
        <div>
          <Label>Investment Min</Label>
          <Input name="investment_min" type="number" className="border-input bg-background" />
        </div>
        <div>
          <Label>Investment Max</Label>
          <Input name="investment_max" type="number" className="border-input bg-background" />
        </div>
      </div>

      <div>
        <Label>Location</Label>
        <Input name="location" className="border-input bg-background" />
      </div>

      <div>
        <Label>Bio</Label>
        <Textarea name="bio" className="border-input bg-background" />
      </div>

      <div>
        <Label>LinkedIn URL</Label>
        <Input name="linkedin_url" className="border-input bg-background" />
      </div>

      <div>
        <Label>Portfolio Companies (comma separated)</Label>
        <Input name="portfolio_companies" className="border-input bg-background" />
      </div>

      <div>
        <Label>Avatar (image)</Label>
        <input name="avatar" type="file" accept="image/*" className="mt-1" />
      </div>

      <div>
        <Label>Pitch Deck (PDF)</Label>
        <input name="pitch_deck" type="file" accept="application/pdf,.pdf,.ppt,.pptx" className="mt-1" />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "Saving..." : "Complete Onboarding"}
      </Button>
    </form>
  )
}

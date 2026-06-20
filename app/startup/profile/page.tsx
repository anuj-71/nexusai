"use client"
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'

export default function StartupProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch('/api/profile', { credentials: 'include' }).then(async (r) => {
      if (!mounted) return
      if (r.ok) setProfile((await r.json()).profile)
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  return (
    <DashboardLayout role="startup">
      <h1 className="text-2xl font-bold mb-4">Company Profile</h1>
      {loading && <div>Loading...</div>}
      {!loading && !profile && <div>No profile found. Complete onboarding.</div>}
      {!loading && profile && (
        <div className="space-y-6">
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Company Information</h2>
            <div className="mt-2">Name: {profile.startup_name}</div>
            <div>Tagline: {profile.tagline}</div>
            <div>Industry: {profile.industry}</div>
            <div>Website: {profile.website}</div>
          </section>

          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Founder</h2>
            <div className="mt-2">{profile.founder_name} — {profile.founder_role}</div>
          </section>

          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Funding</h2>
            <div className="mt-2">Required: {profile.funding_required}</div>
            <div>Raised: {profile.current_funding_raised}</div>
          </section>
        </div>
      )}
    </DashboardLayout>
  )
}

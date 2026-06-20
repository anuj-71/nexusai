"use client"
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'

export default function InvestorProfilePage() {
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
    <DashboardLayout role="investor">
      <h1 className="text-2xl font-bold mb-4">Investor Profile</h1>
      {loading && <div>Loading...</div>}
      {!loading && !profile && <div>No profile found. Complete onboarding.</div>}
      {!loading && profile && (
        <div className="space-y-6">
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Investor Info</h2>
            <div className="mt-2">Name: {profile.investor_name}</div>
            <div>Firm: {profile.firm}</div>
            <div>Preferred industries: {Array.isArray(profile.preferred_industries) ? profile.preferred_industries.join(', ') : profile.preferred_industries}</div>
          </section>

          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Portfolio</h2>
            <div className="mt-2">{Array.isArray(profile.portfolio_companies) ? profile.portfolio_companies.join(', ') : profile.portfolio_companies}</div>
          </section>
        </div>
      )}
    </DashboardLayout>
  )
}

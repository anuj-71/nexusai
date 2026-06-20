"use client"
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'

export default function StartupDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch('/api/dashboard/startup', { credentials: 'include' }).then(async (r) => {
      if (!mounted) return
      if (r.ok) setData(await r.json())
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  return (
    <DashboardLayout role="startup">
      <h1 className="text-2xl font-bold mb-4">Startup Dashboard</h1>
      {loading && <div>Loading...</div>}
      {!loading && data && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Welcome back</h2>
            <div className="mt-2">Profile status: {data.profile?.onboarding_status}</div>
            <div>Completion: TBD (computed elsewhere)</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Funding</h3>
            <div className="mt-2">Required: {data.funding?.funding_required}</div>
            <div>Raised: {data.funding?.current_funding_raised}</div>
          </div>
          <div className="col-span-3 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Investor Matches</h3>
            <div className="mt-2">Matches count: {data.matches_count}</div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

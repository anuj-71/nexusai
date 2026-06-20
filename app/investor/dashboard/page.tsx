"use client"
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'

export default function InvestorDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch('/api/dashboard/investor', { credentials: 'include' }).then(async (r) => {
      if (!mounted) return
      if (r.ok) setData(await r.json())
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  return (
    <DashboardLayout role="investor">
      <h1 className="text-2xl font-bold mb-4">Investor Dashboard</h1>
      {loading && <div>Loading...</div>}
      {!loading && data && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="font-semibold">Recommended Startups</h2>
            <div className="mt-2">(Recommendation engine to be plugged into predict/match)</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Saved</h3>
            <div className="mt-2">Saved count: {data.saved_count}</div>
          </div>
          <div className="col-span-3 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Recent Matches</h3>
            <ul className="mt-2 space-y-2">
              {(data.recent_matches || []).map((m: any) => (
                <li key={m.id} className="p-2 border rounded">{m.startups?.startup_name || m.startup_name} — score</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

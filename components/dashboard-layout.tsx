"use client"
import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DashboardLayout({ children, role }: { children: React.ReactNode, role?: string }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 border-r bg-white">
        <div className="p-4 font-bold text-lg">Platform</div>
        <nav className="p-4 space-y-2">
          <Link className="block px-3 py-2 rounded hover:bg-slate-100" href={role === 'investor' ? '/investor/dashboard' : '/startup/dashboard'}>Dashboard</Link>
          <Link className="block px-3 py-2 rounded hover:bg-slate-100" href="/profile">Profile</Link>
          {role === 'startup' && <Link className="block px-3 py-2 rounded hover:bg-slate-100" href="/startup/onboarding">Onboarding</Link>}
          {role === 'investor' && <Link className="block px-3 py-2 rounded hover:bg-slate-100" href="/investor/onboarding">Onboarding</Link>}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <div className="text-xl font-semibold">Welcome</div>
          <div className="flex items-center gap-4">
            <Notifications />
            <ProfileMenu />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

function Notifications() {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    let mounted = true
    fetch('/api/notifications', { credentials: 'include' }).then(async (r) => {
      if (!mounted) return
      if (r.ok) {
        const j = await r.json()
        setCount((j.notifications || []).length)
      } else setCount(0)
    }).catch(() => setCount(0))
    return () => { mounted = false }
  }, [])
  return (
    <button aria-label="Notifications" className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" /></svg>
      {count !== null && <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">{count}</span>}
    </button>
  )
}

function ProfileMenu() {
  const [me, setMe] = useState<any>(null)
  useEffect(() => {
    let mounted = true
    fetch('/api/me', { credentials: 'include' }).then(async (r) => {
      if (!mounted) return
      if (r.ok) setMe(await r.json())
    }).catch(() => {})
    return () => { mounted = false }
  }, [])
  return (
    <div className="flex items-center gap-3">
      <div className="text-sm">{me?.email || 'Guest'}</div>
      <Link href="/auth" className="px-3 py-1 bg-slate-100 rounded">Sign out</Link>
    </div>
  )
}

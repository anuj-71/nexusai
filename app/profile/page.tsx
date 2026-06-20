"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase/client"

export default function ProfilePage() {
  const auth = useAuth()
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    if (!auth.user) return

    async function load() {
      try {
        const { data } = await supabase.from('profiles').select('id, role, created_at, metadata').eq('id', auth.user!.id).single()
        setDetails(data)
      } catch (e) {
        setDetails(null)
      }
    }

    load()
  }, [auth.user])

  if (auth.loading) return <div className="p-8">Loading...</div>
  if (!auth.session) return <div className="p-8">You must be signed in to view this page.</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <div><strong>Email:</strong> {auth.user?.email}</div>
        <div><strong>Role:</strong> {details?.role ?? auth.profile?.role ?? '—'}</div>
        <div><strong>Created:</strong> {details?.created_at ? new Date(details.created_at).toLocaleString() : '—'}</div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Details</h2>
        <pre className="mt-2 whitespace-pre-wrap text-sm">{JSON.stringify(details ?? auth.profile ?? {}, null, 2)}</pre>
      </div>
    </div>
  )
}

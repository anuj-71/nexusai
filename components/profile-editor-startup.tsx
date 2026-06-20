"use client"
import React, { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function ProfileEditorStartup({ initial }: { initial?: any }) {
  const [form, setForm] = useState<Record<string, any>>(initial || {})
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  useEffect(() => { setForm(initial || {}) }, [initial])

  function onChange(k: string, v: any) {
    setForm((s) => ({ ...s, [k]: v }))
    setDirty(true)
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || 'Save failed')
      toast({ title: 'Saved', description: 'Profile saved successfully' })
      setDirty(false)
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || String(e) })
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input className="input" placeholder="Company name" value={form.startup_name || ''} onChange={(e) => onChange('startup_name', e.target.value)} />
        <input className="input" placeholder="Tagline" value={form.tagline || ''} onChange={(e) => onChange('tagline', e.target.value)} />
        <input className="input" placeholder="Industry" value={form.industry || ''} onChange={(e) => onChange('industry', e.target.value)} />
        <input className="input" placeholder="Website" value={form.website || ''} onChange={(e) => onChange('website', e.target.value)} />
        <input className="input" placeholder="Location" value={form.location || ''} onChange={(e) => onChange('location', e.target.value)} />
        <input className="input" placeholder="Founder name" value={form.founder_name || ''} onChange={(e) => onChange('founder_name', e.target.value)} />
        <input className="input" placeholder="Founder role" value={form.founder_role || ''} onChange={(e) => onChange('founder_role', e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Problem statement</label>
        <textarea className="w-full" value={form.problem_statement || ''} onChange={(e) => onChange('problem_statement', e.target.value)} />
      </div>

      <div className="flex items-center gap-3">
        <button className="btn" onClick={save} disabled={!dirty || saving}>{saving ? 'Saving...' : 'Save'}</button>
        {dirty && <button className="btn-ghost" onClick={() => { setForm(initial || {}); setDirty(false) }}>Discard</button>}
      </div>
    </div>
  )
}

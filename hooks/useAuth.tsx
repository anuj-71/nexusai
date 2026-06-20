"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import type { Session, User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"

type AuthContextType = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, role?: string) => Promise<{ error?: any }>
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        if (!mounted) return
        setSession(currentSession ?? null)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          // fetch profile if exists
          setProfileLoading(true)
          const { data, error } = await supabase
            .from("profiles")
            .select("id, role, created_at, onboarding_status, avatar_url")
            .eq("id", currentSession.user.id)
            .single()

          if (!error && data) setProfile(data as Profile)
          setProfileLoading(false)
        }
      } catch (e) {
        // ignore - will surface through hooks
        console.error("Auth init error", e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session ?? null)
      setUser(session?.user ?? null)

      if (session?.user) {
        // fetch profile when session begins
        setProfileLoading(true)
        try {
          const { data } = await supabase
            .from("profiles")
            .select("id, role, created_at, onboarding_status, avatar_url")
            .eq("id", session.user.id)
            .single()

          if (data) setProfile(data as Profile)
          else setProfile(null)
        } catch (e) {
          setProfile(null)
        } finally {
          setProfileLoading(false)
        }
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [router])

  async function signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) return { error }

      // If session exists immediately after signUp (email signup may auto-confirm), fetch profile
      // Do NOT create profile here. Onboarding pages will create `profiles` and related rows.
      // Session handling continues via onAuthStateChange listener.

      return { error: null }
    } catch (e) {
      return { error: e }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error }

      // session will be handled by onAuthStateChange listener; return success
      return { error: null }
    } catch (e) {
      return { error: e }
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      setProfile(null)
    } catch (e) {
      console.error("Sign out error", e)
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading: loading || profileLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

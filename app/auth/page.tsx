"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/hooks/useAuth"

export default function AuthPage() {
  const auth = useAuth()
  const router = useRouter()
  const search = useSearchParams()

  useEffect(() => {
    // If user is logged in, redirect to their dashboard
    if (!auth.loading && auth.session) {
      if (auth.profile) router.push(auth.profile.role === 'startup' ? '/startup' : '/investor')
      else router.push('/profile')
    }
  }, [auth.loading, auth.session, auth.profile, router])

  // Allow ?tab=signup externally, handled inside AuthForm
  return <AuthForm />
}

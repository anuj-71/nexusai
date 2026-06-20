'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl"></div>
            <AlertCircle className="w-24 h-24 text-red-600 relative" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Authentication Error</h1>
        <p className="text-slate-600 mb-8">
          {errorDescription || error || 'An error occurred during authentication. Please try again.'}
        </p>

        <div className="space-y-3">
          <Link href="/auth/login" className="block">
            <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium">
              Back to sign in
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button variant="outline" className="w-full h-11">
              Go to home page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}

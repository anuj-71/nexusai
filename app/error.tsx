'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <AlertCircle size={64} className="text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Something went wrong</h1>
        <p className="text-slate-600 mb-2">
          We encountered an error while processing your request. Please try again.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 mb-6 p-4 bg-red-50 rounded-lg border border-red-200 text-left">
            <summary className="cursor-pointer font-medium text-red-900 mb-2">
              Error Details
            </summary>
            <pre className="text-xs text-red-800 overflow-auto max-h-40 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-slate-900 hover:bg-slate-800 gap-2"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Home size={16} />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

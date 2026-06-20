import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-slate-900 opacity-20">404</h1>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-3">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          Sorry, the page you are looking for does not exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
              <Home size={16} />
              Go to Home
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </Link>
        </div>

        {/* Suggested Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Here are some helpful links instead:</p>
          <div className="space-y-2">
            <Link href="/" className="block text-slate-900 hover:text-slate-600 font-medium">
              → Home
            </Link>
            <Link href="/dashboard" className="block text-slate-900 hover:text-slate-600 font-medium">
              → Dashboard
            </Link>
            <Link href="/matches" className="block text-slate-900 hover:text-slate-600 font-medium">
              → Discover Matches
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

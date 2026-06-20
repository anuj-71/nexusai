'use client'

import Link from 'next/link'
import { CheckCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl"></div>
            <CheckCircle className="w-24 h-24 text-emerald-600 relative" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Account created!</h1>
        <p className="text-slate-600 mb-8">
          We&apos;ve sent a confirmation email to your inbox. Please verify your email address to complete your registration.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-sm">
          <div className="flex items-start">
            <Mail className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-left text-blue-900">
              <p className="font-medium mb-1">Check your email</p>
              <p>Look for an email from NexusAI with a confirmation link. It may take a few minutes to arrive.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-4">Next steps:</h3>
          <ol className="text-left space-y-3 text-sm text-slate-600">
            <li className="flex">
              <span className="font-semibold text-emerald-600 mr-3">1.</span>
              <span>Click the confirmation link in your email</span>
            </li>
            <li className="flex">
              <span className="font-semibold text-emerald-600 mr-3">2.</span>
              <span>Set up your profile information</span>
            </li>
            <li className="flex">
              <span className="font-semibold text-emerald-600 mr-3">3.</span>
              <span>Start connecting with opportunities</span>
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <Link href="/auth/login" className="block">
            <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium">
              Back to sign in
            </Button>
          </Link>

          <p className="text-sm text-slate-600">
            Didn&apos;t receive the email?{' '}
            <button className="text-slate-900 font-medium hover:underline">
              Resend verification email
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

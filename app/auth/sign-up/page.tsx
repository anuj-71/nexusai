'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Rocket, TrendingUp } from 'lucide-react'

export default function SignUpPage() {
  const [step, setStep] = useState<'role' | 'form'>('role')
  const [role, setRole] = useState<'startup' | 'investor' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelect = (selectedRole: 'startup' | 'investor') => {
    setRole(selectedRole)
    setStep('form')
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-700 flex-col justify-between p-12 text-white">
        <div>
          <div className="text-2xl font-bold mb-2">NexusAI</div>
          <p className="text-emerald-100">Where Startups Meet Investors</p>
        </div>
        
        <div className="space-y-8">
          <div>
            <div className="flex items-center mb-3">
              <Rocket className="mr-3 text-emerald-300" size={24} />
              <h3 className="text-xl font-semibold">For Startups</h3>
            </div>
            <ul className="space-y-2 text-emerald-100 ml-9">
              <li>• Connect with quality investors</li>
              <li>• Build your company profile</li>
              <li>• Raise your next round</li>
            </ul>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <TrendingUp className="mr-3 text-emerald-300" size={24} />
              <h3 className="text-xl font-semibold">For Investors</h3>
            </div>
            <ul className="space-y-2 text-emerald-100 ml-9">
              <li>• Discover promising deals</li>
              <li>• AI-powered matching</li>
              <li>• Grow your portfolio</li>
            </ul>
          </div>
        </div>

        <p className="text-emerald-200 text-sm">© 2026 NexusAI. All rights reserved.</p>
      </div>

      {/* Right side - Sign-up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {step === 'role' ? (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
                <p className="text-slate-600">Choose your role to get started</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect('startup')}
                  className="w-full p-6 border-2 border-slate-200 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all text-left"
                >
                  <div className="flex items-start">
                    <Rocket className="w-6 h-6 text-emerald-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">I&apos;m a Startup</h3>
                      <p className="text-sm text-slate-600">Looking to raise capital and connect with investors</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('investor')}
                  className="w-full p-6 border-2 border-slate-200 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all text-left"
                >
                  <div className="flex items-start">
                    <TrendingUp className="w-6 h-6 text-emerald-600 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">I&apos;m an Investor</h3>
                      <p className="text-sm text-slate-600">Looking to discover and invest in promising startups</p>
                    </div>
                  </div>
                </button>

                <div className="text-center text-sm text-slate-600 pt-4">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-slate-900 hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <button
                  onClick={() => setStep('role')}
                  className="text-slate-600 hover:text-slate-900 text-sm mb-4 font-medium"
                >
                  ← Back
                </button>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {role === 'startup' ? 'Startup' : 'Investor'} Registration
                </h1>
                <p className="text-slate-600">Create your {role} account</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">At least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 pr-10 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>

                <p className="text-xs text-slate-600 text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>

                <div className="text-center">
                  <p className="text-slate-600 text-sm">
                    Already have an account?{' '}
                    <Link
                      href="/auth/login"
                      className="font-medium text-slate-900 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

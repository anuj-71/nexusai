import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Rocket, TrendingUp, Zap, Users, Target, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">NexusAI</div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="h-10">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="h-10 bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
            Where Startups Meet Investors
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto text-balance">
            Connect with the right capital partners using AI-powered matching. Find investors who share your vision or discover promising startups to fund.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button className="px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Start as Startup
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="outline" className="px-8 h-12 font-semibold">
                Start as Investor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why Choose NexusAI?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="w-8 h-8 text-emerald-600 mb-3" />
              <CardTitle>AI-Powered Matching</CardTitle>
              <CardDescription>Get matched with opportunities that truly align with your goals</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <CardTitle>Curated Network</CardTitle>
              <CardDescription>Access a vetted community of serious founders and investors</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="w-8 h-8 text-purple-600 mb-3" />
              <CardTitle>Targeted Search</CardTitle>
              <CardDescription>Find opportunities that match your specific stage, sector, and criteria</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="w-8 h-8 text-slate-600 mb-3" />
              <CardTitle>Global Reach</CardTitle>
              <CardDescription>Connect with founders and investors worldwide</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Rocket className="w-8 h-8 text-slate-600 mb-3" />
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>Seamless onboarding and straightforward profile setup</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-slate-600 mb-3" />
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>Track your progress and get actionable insights</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* For Startups Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">For Startups</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-3 font-bold">✓</span>
                <span>Build your company profile in minutes</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-3 font-bold">✓</span>
                <span>Get matched with quality investors</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-3 font-bold">✓</span>
                <span>Manage investor conversations</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-3 font-bold">✓</span>
                <span>Track fundraising progress</span>
              </li>
            </ul>
            <Link href="/auth/sign-up" className="mt-6 inline-block">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started for Free</Button>
            </Link>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg border border-emerald-200">
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="font-semibold text-slate-900">AI Matching Algorithm</p>
                <p className="text-sm text-slate-600">Intelligent matching based on industry, stage, and growth potential</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="font-semibold text-slate-900">Profile Analytics</p>
                <p className="text-sm text-slate-600">See who&apos;s viewing your profile and track engagement</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="font-semibold text-slate-900">Investor Directory</p>
                <p className="text-sm text-slate-600">Browse and reach out to investors in your target criteria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Investors Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-white rounded-lg p-8 shadow-lg border border-blue-200">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-slate-900">Smart Filtering</p>
                <p className="text-sm text-slate-600">Find startups matching your investment thesis and criteria</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-slate-900">Deal Flow Analytics</p>
                <p className="text-sm text-slate-600">Track pipeline and portfolio performance metrics</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-slate-900">Startup Database</p>
                <p className="text-sm text-slate-600">Access to curated startup opportunities across sectors</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">For Investors</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">✓</span>
                <span>Discover high-potential startups</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">✓</span>
                <span>Set your investment preferences</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">✓</span>
                <span>Access comprehensive startup data</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">✓</span>
                <span>Manage your portfolio in one place</span>
              </li>
            </ul>
            <Link href="/auth/sign-up" className="mt-6 inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700">Join Our Investor Network</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to get started?</h2>
        <p className="text-lg text-slate-600 mb-8">Join hundreds of founders and investors already using NexusAI</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/sign-up">
            <Button className="px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Create Account
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" className="px-8 h-12 font-semibold">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-slate-900">Features</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Pricing</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-slate-900">About</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Blog</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-slate-900">Documentation</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Help Center</Link></li>
                <li><Link href="#" className="hover:text-slate-900">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-slate-900">Privacy</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Terms</Link></li>
                <li><Link href="#" className="hover:text-slate-900">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2026 NexusAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

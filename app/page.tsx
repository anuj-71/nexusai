"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ParticleBackground } from "@/components/particle-background"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  ArrowRight,
  BarChart3,
  Brain,
  LineChart,
  Rocket,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pb-20 pt-24 md:pt-32">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-pulse-glow absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="animate-pulse-glow absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" style={{ animationDelay: "1.5s" }} />
          </div>

          <div className="relative mx-auto max-w-5xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              Powered by Machine Learning
            </Badge>
            <h1 className="font-serif text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
              <span className="text-balance">AI-Powered Startup Investment Intelligence</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Connect startups with the perfect investors using predictive growth analysis and intelligent matching algorithms. Data-driven decisions for smarter investments.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth?role=startup">
                <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
                  <Rocket className="h-4 w-4" />
                  {"I'm a Startup"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth?role=investor">
                <Button size="lg" variant="outline" className="gap-2 border-border px-8">
                  <TrendingUp className="h-4 w-4" />
                  {"I'm an Investor"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-1 overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-3">
              {[
                { label: "Startups Analyzed", value: "2,400+" },
                { label: "Investors Matched", value: "850+" },
                { label: "Prediction Accuracy", value: "94.7%" },
              ].map((stat) => (
                <div key={stat.label} className="px-6 py-5 text-center">
                  <p className="font-serif text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-card/50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium uppercase tracking-wider">
                Features
              </Badge>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                <span className="text-balance">Intelligence That Drives Results</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Leverage cutting-edge machine learning to make smarter investment decisions and accelerate startup growth.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Brain,
                  title: "AI Growth Prediction",
                  description: "Random Forest models analyze key metrics to predict startup growth trajectories with industry-leading accuracy.",
                  color: "text-primary bg-primary/10",
                },
                {
                  icon: Users,
                  title: "Smart Investor Matching",
                  description: "Cosine similarity algorithms match startups with investors based on sector preferences, stage focus, and investment patterns.",
                  color: "text-accent bg-accent/10",
                },
                {
                  icon: BarChart3,
                  title: "Data-Driven Insights",
                  description: "Comprehensive analytics dashboards provide real-time insights into market trends, funding patterns, and growth metrics.",
                  color: "text-primary bg-primary/10",
                },
              ].map((feature) => (
                <Card key={feature.title} className="group border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-8">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium uppercase tracking-wider">
                How It Works
              </Badge>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                <span className="text-balance">Three Steps to Smarter Investments</span>
              </h2>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: LineChart,
                  title: "Input Your Data",
                  description: "Provide key metrics like sector, stage, funding needs, revenue, and team size for AI analysis.",
                },
                {
                  step: "02",
                  icon: Brain,
                  title: "AI Analyzes",
                  description: "Our ML models predict growth potential and calculate compatibility scores with potential investors.",
                },
                {
                  step: "03",
                  icon: Shield,
                  title: "Get Matched",
                  description: "Receive curated investor recommendations ranked by match score and investment alignment.",
                },
              ].map((item) => (
                <div key={item.step} className="group relative">
                  <div className="mb-4 font-mono text-5xl font-bold text-border transition-colors group-hover:text-primary/30">
                    {item.step}
                  </div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-card/50 px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              <span className="text-balance">Ready to Find Your Perfect Match?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of startups and investors already using NexusAI to make smarter, data-driven decisions.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth?role=startup">
                <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth?role=investor">
                <Button size="lg" variant="outline" className="gap-2 border-border px-8">
                  Explore as Investor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ParticleBackground } from "@/components/particle-background"
import {
  Zap,
  TrendingUp,
  Users,
  Brain,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Rocket,
} from "lucide-react"

const stats = [
  { label: "Startups Matched", value: "2,400+" },
  { label: "Investors Active", value: "850+" },
  { label: "Funding Secured", value: "$1.2B+" },
  { label: "Match Accuracy", value: "94%" },
]

const features = [
  {
    icon: Brain,
    title: "AI Growth Prediction",
    description:
      "Our ML models analyze 50+ data points to predict startup growth potential with 94% accuracy.",
  },
  {
    icon: Users,
    title: "Smart Investor Matching",
    description:
      "Get matched with investors whose portfolio strategy, sector focus, and stage preference align with your startup.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Profiles",
    description:
      "Every investor and startup on the platform is vetted to ensure quality connections and trust.",
  },
]

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Sign up as a startup or investor and fill in your details.",
  },
  {
    step: "02",
    title: "Get AI Insights",
    description: "Our models analyze your data to generate growth predictions and match scores.",
  },
  {
    step: "03",
    title: "Connect & Grow",
    description: "Browse your top matches, reach out, and start building the future together.",
  },
]

export default function LandingPage() {
  return (
    <div className="relative">
      <ParticleBackground />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-6 pb-20 pt-24 text-center md:pt-32">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-pulse-glow absolute -left-40 top-16 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div
            className="animate-pulse-glow absolute -right-40 top-48 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <Badge
          variant="secondary"
          className="mb-6 gap-1.5 border-primary/20 bg-primary/10 px-4 py-1.5 text-primary"
        >
          <Zap className="h-3.5 w-3.5" />
          AI-Powered Platform
        </Badge>

        <h1 className="max-w-4xl text-balance font-serif text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
          Where Startups Meet Their{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Perfect Investors
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          NexusAI uses advanced machine learning to predict startup growth potential and match
          founders with the right investors. Smarter connections, faster funding.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth?role=startup">
            <Button
              size="lg"
              className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              <Rocket className="h-4 w-4" />
              {"I'm a Startup"}
            </Button>
          </Link>
          <Link href="/auth?role=investor">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-border px-8 text-foreground hover:bg-secondary"
            >
              <TrendingUp className="h-4 w-4" />
              {"I'm an Investor"}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card/60 px-6 py-5 backdrop-blur-sm"
            >
              <p className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge
              variant="secondary"
              className="mb-4 gap-1.5 border-accent/20 bg-accent/10 px-4 py-1.5 text-accent"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Core Features
            </Badge>
            <h2 className="text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
              Built for the modern fundraising era
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              Everything you need to find, evaluate, and connect with the right partners.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border bg-card/70 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
              Get started in three simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 font-serif text-xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 font-serif text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card/70 p-12 text-center backdrop-blur-sm md:p-16">
          <h2 className="text-balance font-serif text-4xl font-bold text-foreground md:text-5xl">
            Ready to find your match?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
            Join thousands of startups and investors using AI to make smarter connections.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/auth?role=startup">
              <Button
                size="lg"
                className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                Start as a Startup
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth?role=investor">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-border px-8 text-foreground hover:bg-secondary"
              >
                Join as an Investor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

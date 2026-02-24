"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  predictGrowth,
  matchInvestors,
  SECTORS,
  STAGES,
  LOCATIONS,
  type PredictionResult,
  type InvestorMatch,
} from "@/lib/mock-data"
import {
  ArrowUpRight,
  Brain,
  Building2,
  DollarSign,
  Loader2,
  MapPin,
  Rocket,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

function GrowthMeter({ score, label }: { score: number; label: "High" | "Low" }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-36 w-36">
        <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" strokeWidth="8" className="stroke-muted" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={label === "High" ? "stroke-accent" : "stroke-destructive"}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <Badge
        className={`px-4 py-1 text-sm font-semibold ${
          label === "High"
            ? "bg-accent/15 text-accent hover:bg-accent/15"
            : "bg-destructive/15 text-destructive hover:bg-destructive/15"
        }`}
      >
        {label === "High" ? "High Growth" : "Low Growth"}
      </Badge>
    </div>
  )
}

function InvestorCard({ investor }: { investor: InvestorMatch }) {
  return (
    <Card className="group border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
            {investor.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">{investor.name}</h4>
              <Badge variant="secondary" className="text-xs font-medium">
                {investor.matchScore}% Match
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{investor.firm}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {investor.sector}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {investor.preferredStage}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> {investor.investmentRange}
              </span>
            </div>
            <div className="mt-3">
              <Progress
                value={investor.matchScore}
                className="h-1.5"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StartupDashboard() {
  const [sector, setSector] = useState("")
  const [stage, setStage] = useState("")
  const [location, setLocation] = useState("")
  const [fundingNeeded, setFundingNeeded] = useState("")
  const [revenue, setRevenue] = useState("")
  const [growthRate, setGrowthRate] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [investors, setInvestors] = useState<InvestorMatch[]>([])

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setInvestors([])

    const input = {
      sector,
      stage,
      location,
      fundingNeeded: Number(fundingNeeded),
      revenue: Number(revenue),
      growthRate: Number(growthRate),
      teamSize: Number(teamSize),
    }

    const prediction = await predictGrowth(input)
    setResult(prediction)
    const matches = await matchInvestors(input)
    setInvestors(matches)
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Startup Dashboard</h1>
              <p className="text-sm text-muted-foreground">Predict your growth potential and find matching investors</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Prediction Form */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24 border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-lg text-foreground">
                  <Brain className="h-5 w-5 text-primary" />
                  Growth Prediction
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your startup metrics for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePredict} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Sector</Label>
                    <Select value={sector} onValueChange={setSector}>
                      <SelectTrigger className="border-input bg-background"><SelectValue placeholder="Select sector" /></SelectTrigger>
                      <SelectContent>
                        {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Stage</Label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger className="border-input bg-background"><SelectValue placeholder="Select stage" /></SelectTrigger>
                      <SelectContent>
                        {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-foreground">Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="border-input bg-background"><SelectValue placeholder="Select location" /></SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground">Funding Needed ($)</Label>
                      <Input type="number" placeholder="500000" value={fundingNeeded} onChange={(e) => setFundingNeeded(e.target.value)} className="border-input bg-background" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground">Revenue ($)</Label>
                      <Input type="number" placeholder="100000" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="border-input bg-background" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground">Growth Rate (%)</Label>
                      <Input type="number" placeholder="25" value={growthRate} onChange={(e) => setGrowthRate(e.target.value)} className="border-input bg-background" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-foreground">Team Size</Label>
                      <Input type="number" placeholder="15" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="border-input bg-background" />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="mt-2 w-full gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                    disabled={loading || !sector || !stage || !location}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Predict Growth
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-8 lg:col-span-3">
            {/* Prediction Result */}
            {loading && !result && (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
                  <div className="relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
                    <Brain className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">AI is analyzing your startup...</p>
                  <p className="text-sm text-muted-foreground">Processing growth metrics and market data</p>
                </CardContent>
              </Card>
            )}

            {result && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif text-lg text-foreground">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                    Prediction Results
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">AI confidence: {result.confidence}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
                    <GrowthMeter score={result.score} label={result.growthPotential} />
                    <div className="flex flex-col gap-4">
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Growth Score</p>
                        <p className="mt-1 font-serif text-2xl font-bold text-foreground">{result.score}/100</p>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI Confidence</p>
                        <p className="mt-1 font-serif text-2xl font-bold text-foreground">{result.confidence}%</p>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Potential</p>
                        <p className={`mt-1 font-serif text-2xl font-bold ${result.growthPotential === "High" ? "text-accent" : "text-destructive"}`}>
                          {result.growthPotential}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Matching Investors */}
            {investors.length > 0 && (
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold text-foreground">Top Matching Investors</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {investors.map((investor) => (
                    <InvestorCard key={investor.id} investor={investor} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !result && (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">Ready to Analyze</h3>
                  <p className="max-w-sm text-center text-sm text-muted-foreground">
                    Fill in your startup details and click Predict Growth to get AI-powered growth predictions and investor matches.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

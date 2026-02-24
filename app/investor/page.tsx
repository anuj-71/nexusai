"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getStartups, SECTORS, STAGES, LOCATIONS, type StartupResult } from "@/lib/mock-data"
import {
  ArrowDownUp,
  Brain,
  Building2,
  DollarSign,
  Filter,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react"

function StartupCard({ startup }: { startup: StartupResult }) {
  return (
    <Card className="group border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-serif text-sm font-bold text-primary">
              {startup.name.slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{startup.name}</h3>
              <p className="text-sm text-muted-foreground">{startup.sector}</p>
            </div>
          </div>
          <Badge
            className={`text-xs font-semibold ${
              startup.growthPotential === "High"
                ? "bg-accent/15 text-accent hover:bg-accent/15"
                : "bg-destructive/15 text-destructive hover:bg-destructive/15"
            }`}
          >
            {startup.growthPotential}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{startup.stage}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{startup.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            <span>{startup.fundingNeeded}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{startup.teamSize} people</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Growth Score</span>
            <span className="font-semibold text-foreground">{startup.growthScore}%</span>
          </div>
          <Progress value={startup.growthScore} className="h-1.5" />
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Match Score</span>
            <span className="font-semibold text-primary">{startup.matchScore}%</span>
          </div>
          <Progress value={startup.matchScore} className="h-1.5" />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="text-xs text-muted-foreground">
            Revenue: <span className="font-medium text-foreground">{startup.revenue}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Growth: <span className="font-medium text-accent">{`+${startup.growthRate}%`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type SortKey = "matchScore" | "growthScore" | "growthRate"

export default function InvestorDashboard() {
  const allStartups = useMemo(() => getStartups(), [])
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortKey>("matchScore")

  const filteredStartups = useMemo(() => {
    let filtered = [...allStartups]
    if (sectorFilter !== "all") filtered = filtered.filter((s) => s.sector === sectorFilter)
    if (stageFilter !== "all") filtered = filtered.filter((s) => s.stage === stageFilter)
    if (locationFilter !== "all") filtered = filtered.filter((s) => s.location === locationFilter)
    filtered.sort((a, b) => b[sortBy] - a[sortBy])
    return filtered
  }, [allStartups, sectorFilter, stageFilter, locationFilter, sortBy])

  const hasActiveFilters = sectorFilter !== "all" || stageFilter !== "all" || locationFilter !== "all"

  const clearFilters = () => {
    setSectorFilter("all")
    setStageFilter("all")
    setLocationFilter("all")
  }

  const aiRecommended = useMemo(
    () => allStartups.filter((s) => s.matchScore >= 85).sort((a, b) => b.matchScore - a.matchScore),
    [allStartups]
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">Investor Dashboard</h1>
            <p className="text-sm text-muted-foreground">Discover AI-recommended startups and filter by your preferences</p>
          </div>
        </div>
      </div>

      {/* AI Recommended */}
      <section className="mb-10">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-bold text-foreground">AI Recommended for You</h2>
          <Badge variant="secondary" className="text-xs">Top Picks</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiRecommended.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      {/* Filters */}
      <Card className="mb-8 border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-serif text-lg text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            Filter Startups
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Narrow down startups by sector, stage, and location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Sector</label>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="border-input bg-background">
                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Stage</label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="border-input bg-background">
                  <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="border-input bg-background">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Sort By</label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                <SelectTrigger className="border-input bg-background">
                  <ArrowDownUp className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matchScore">Highest Match Score</SelectItem>
                  <SelectItem value="growthScore">Highest Growth Score</SelectItem>
                  <SelectItem value="growthRate">Highest Growth Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-foreground">
          All Startups
          <span className="ml-2 text-base font-normal text-muted-foreground">({filteredStartups.length})</span>
        </h2>
      </div>

      {filteredStartups.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStartups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground">No startups found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results.</p>
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

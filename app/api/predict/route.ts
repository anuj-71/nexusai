import { NextResponse } from "next/server"

export type PredictionInput = {
  sector: string
  stage: string
  location: string
  fundingNeeded?: number
  revenue?: number
  growthRate?: number
  teamSize?: number
}

export async function POST(request: Request) {
  const body = (await request.json()) as PredictionInput

  if (!body.sector || !body.stage || !body.location) {
    return NextResponse.json({ error: "Missing required fields: sector, stage, location" }, { status: 400 })
  }

  // Basic deterministic scoring using provided metrics
  const growthRate = Number(body.growthRate) || 0
  const revenue = Number(body.revenue) || 0
  const teamSize = Number(body.teamSize) || 0

  const baseScore = (growthRate / 300) * 35 + Math.min(1, revenue / 5_000_000) * 25 + (teamSize / 200) * 10

  const stageBonus: Record<string, number> = {
    Idea: 5,
    Prototype: 10,
    Seed: 15,
    "Series A": 20,
    "Series B": 25,
  }

  const sectorBonus: Record<string, number> = {
    AI: 8,
    Cybersecurity: 6,
    FinTech: 5,
    Healthcare: 4,
    EdTech: 3,
    "E-commerce": 2,
  }

  const score = Math.min(98, Math.round(baseScore + (stageBonus[body.stage] || 10) + (sectorBonus[body.sector] || 3)))
  const growthPotential = score >= 55 ? "High" : "Low"
  const confidence = Math.round(70 + Math.min(30, score / 2))

  // Small processing delay to keep UX consistent
  await new Promise((r) => setTimeout(r, 700))

  return NextResponse.json({ growthPotential, score, confidence })
}

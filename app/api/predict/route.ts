import { NextResponse } from "next/server"
import { predictGrowthSync, type PredictionInput } from "@/lib/mock-data"

export async function POST(request: Request) {
  const body = (await request.json()) as PredictionInput

  if (!body.sector || !body.stage || !body.location) {
    return NextResponse.json(
      { error: "Missing required fields: sector, stage, location" },
      { status: 400 }
    )
  }

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 1200))

  const result = predictGrowthSync(body)

  return NextResponse.json(result)
}

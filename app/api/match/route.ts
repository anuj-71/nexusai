import { NextResponse } from "next/server"
import { matchInvestorsSync, type PredictionInput } from "@/lib/mock-data"

export async function POST(request: Request) {
  const body = (await request.json()) as PredictionInput

  if (!body.sector || !body.stage) {
    return NextResponse.json(
      { error: "Missing required fields: sector, stage" },
      { status: 400 }
    )
  }

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 600))

  const investors = matchInvestorsSync(body)

  return NextResponse.json({ investors })
}

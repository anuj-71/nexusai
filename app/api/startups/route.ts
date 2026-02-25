import { NextResponse } from "next/server"
import { getStartups, SECTORS, STAGES, LOCATIONS, BUSINESS_MODELS } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const sector = searchParams.get("sector") || "all"
  const stage = searchParams.get("stage") || "all"
  const location = searchParams.get("location") || "all"
  const sortBy = (searchParams.get("sortBy") as "matchScore" | "growthScore" | "growthRate") || "matchScore"
  const page = parseInt(searchParams.get("page") || "1", 10)
  const perPage = parseInt(searchParams.get("perPage") || "30", 10)

  const { startups, total } = getStartups({ sector, stage, location, sortBy, page, perPage })

  return NextResponse.json({
    startups,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
    filters: {
      sectors: [...SECTORS],
      stages: [...STAGES],
      locations: [...LOCATIONS],
      businessModels: [...BUSINESS_MODELS],
    },
  })
}

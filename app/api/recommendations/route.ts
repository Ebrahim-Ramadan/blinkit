import { type NextRequest, NextResponse } from "next/server"
import { getRecommendations, createRecommendation } from "@/lib/db"

export async function GET() {
  try {
    const recommendations = await getRecommendations()
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("[v0] Error fetching recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const recommendation = await createRecommendation(body)
    return NextResponse.json(recommendation, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating recommendation:", error)
    return NextResponse.json({ error: "Failed to create recommendation" }, { status: 500 })
  }
}

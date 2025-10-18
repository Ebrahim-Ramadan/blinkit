import { type NextRequest, NextResponse } from "next/server"
import { deleteRecommendation } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteRecommendation(params.id)
    if (!success) {
      return NextResponse.json({ error: "Recommendation not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting recommendation:", error)
    return NextResponse.json({ error: "Failed to delete recommendation" }, { status: 500 })
  }
}

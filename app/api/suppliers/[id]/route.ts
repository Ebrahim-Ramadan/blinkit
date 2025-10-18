import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Supplier, ApiResponse } from "@/lib/types"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("grocery_admin")

    const supplier = await db.collection<Supplier>("suppliers").findOne({
      _id: new ObjectId(id),
    })

    if (!supplier) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Supplier not found" }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<Supplier>>({
      success: true,
      data: supplier,
    })
  } catch (error) {
    console.error("[v0] Error fetching supplier:", error)
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "Failed to fetch supplier" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as Supplier
    const client = await clientPromise
    const db = client.db("grocery_admin")

    const result = await db.collection<Supplier>("suppliers").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Supplier not found" }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<{ modifiedCount: number }>>({
      success: true,
      data: { modifiedCount: result.modifiedCount },
    })
  } catch (error) {
    console.error("[v0] Error updating supplier:", error)
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "Failed to update supplier" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("grocery_admin")

    const result = await db.collection<Supplier>("suppliers").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json<ApiResponse<null>>({ success: false, error: "Supplier not found" }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<{ deletedCount: number }>>({
      success: true,
      data: { deletedCount: result.deletedCount },
    })
  } catch (error) {
    console.error("[v0] Error deleting supplier:", error)
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "Failed to delete supplier" }, { status: 500 })
  }
}

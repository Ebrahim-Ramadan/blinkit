import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Supplier, ApiResponse } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("grocery_admin")
    const suppliers = await db.collection<Supplier>("suppliers").find({}).toArray()

    return NextResponse.json<ApiResponse<Supplier[]>>({
      success: true,
      data: suppliers,
    })
  } catch (error) {
    console.error("[v0] Error fetching suppliers:", error)
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Supplier
    const client = await clientPromise
    const db = client.db("grocery_admin")

    const result = await db.collection<Supplier>("suppliers").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { success: true, data: { id: result.insertedId.toString() } },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating supplier:", error)
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "Failed to create supplier" }, { status: 500 })
  }
}

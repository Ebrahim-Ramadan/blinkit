import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

// GET all recommendations
export async function GET() {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const recommendations = await db.collection('recommendations').find({}).sort({ created_at: -1 }).toArray()
  return NextResponse.json(recommendations)
}

// POST create recommendation
export async function POST(req: NextRequest) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const data = await req.json()
  const now = new Date()
  const result = await db.collection('recommendations').insertOne({
    ...data,
    created_at: now,
  })
  return NextResponse.json({ ...data, _id: result.insertedId })
}

import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// GET all products
export async function GET() {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const products = await db.collection('products').find({}).toArray()
  return NextResponse.json(products)
}

// POST create product
export async function POST(req: NextRequest) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const data = await req.json()
  const now = new Date()
  const result = await db.collection('products').insertOne({
    ...data,
    created_at: now,
    updated_at: now,
  })
  return NextResponse.json({ ...data, _id: result.insertedId })
}

import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import type { Product } from '@/lib/db'

// GET all products
export async function GET() {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const products = await db.collection<Product>('products').find({}).toArray()
  return NextResponse.json(products)
}

// POST create product
export async function POST(req: NextRequest) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const data = await req.json()
  const now = new Date()
  const result = await db.collection<Product>('products').insertOne({
    ...data,
    created_at: now,
    updated_at: now,
  })
  return NextResponse.json({ ...data, _id: result.insertedId })
}

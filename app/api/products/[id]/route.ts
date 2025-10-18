import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import type { Product } from '@/lib/db'

// GET one, UPDATE, DELETE product by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const product = await db.collection<Product>('products').findOne({ _id: new ObjectId(params.id) })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const data = await req.json()
  const result = await db.collection<Product>('products').findOneAndUpdate(
    { _id: new ObjectId(params.id) },
    { $set: { ...data, updated_at: new Date() } },
    { returnDocument: 'after' }
  )
  return NextResponse.json(result.value)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const result = await db.collection<Product>('products').deleteOne({ _id: new ObjectId(params.id) })
  return NextResponse.json({ deleted: result.deletedCount > 0 })
}

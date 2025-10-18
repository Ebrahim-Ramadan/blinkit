import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

// GET one, UPDATE, DELETE product by id


export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const product = await db.collection('products').findOne({ _id: new ObjectId(context.params.id) })
  return NextResponse.json(product)
}


export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const data = await req.json()
  const result = await db.collection('products').findOneAndUpdate(
    { _id: new ObjectId(context.params.id) },
    { $set: { ...data, updated_at: new Date() } },
    { returnDocument: 'after' }
  )
  return NextResponse.json(result.value)
}



export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const result = await db.collection('products').deleteOne({ _id: new ObjectId(context.params.id) })
  return NextResponse.json({ deleted: result.deletedCount > 0 })
}

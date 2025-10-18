import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

// DELETE recommendation by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db('grocery_admin')
  const result = await db.collection('recommendations').deleteOne({ _id: new ObjectId(params.id) })
  return NextResponse.json({ deleted: result.deletedCount > 0 })
}

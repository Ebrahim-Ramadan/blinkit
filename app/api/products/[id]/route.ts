import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// Define the params type
type RouteParams = {
  params: {
    id: string;
  };
};

// GET one product by id
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  const client = await clientPromise;
  const db = client.db('grocery_admin');
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  return NextResponse.json(product);
}

// UPDATE product by id
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const client = await clientPromise;
  const db = client.db('grocery_admin');
  const data = await request.json();
  const result = await db.collection('products').findOneAndUpdate(
    { _id: new ObjectId(params.id) },
    { $set: { ...data, updated_at: new Date() } },
    { returnDocument: 'after' }
  );
  return NextResponse.json(result.value);
}

// DELETE product by id
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const client = await clientPromise;
  const db = client.db('grocery_admin');
  const result = await db.collection('products').deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ deleted: result.deletedCount > 0 });
}
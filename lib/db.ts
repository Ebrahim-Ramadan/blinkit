import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export interface Product {
  _id?: ObjectId
  name: string
  buy_cost: number
  sell_cost: number
  quantity_on_hand: number
  supplier: string
  category: string
  sku: string
  created_at?: Date
  updated_at?: Date
}

export interface Recommendation {
  _id?: ObjectId
  user_name: string
  product_suggestion: string
  message: string
  created_at?: Date
}

export async function getDb() {
  const client = await clientPromise
  return client.db("grocery_admin")
}

export async function getProducts(): Promise<Product[]> {
  const db = await getDb()
  return db.collection<Product>("products").find({}).toArray()
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb()
  return db.collection<Product>("products").findOne({ _id: new ObjectId(id) })
}

export async function createProduct(product: Omit<Product, "_id">): Promise<Product> {
  const db = await getDb()
  const result = await db.collection<Product>("products").insertOne({
    ...product,
    created_at: new Date(),
    updated_at: new Date(),
  })
  return { ...product, _id: result.insertedId }
}

export async function updateProduct(id: string, product: Omit<Product, "_id">): Promise<Product | null> {
  const db = await getDb()
  const result = await db.collection<Product>("products").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...product,
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" },
  )
  return result.value || null
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb()
  const result = await db.collection<Product>("products").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const db = await getDb()
  return db.collection<Recommendation>("recommendations").find({}).sort({ created_at: -1 }).toArray()
}

export async function createRecommendation(rec: Omit<Recommendation, "_id">): Promise<Recommendation> {
  const db = await getDb()
  const result = await db.collection<Recommendation>("recommendations").insertOne({
    ...rec,
    created_at: new Date(),
  })
  return { ...rec, _id: result.insertedId }
}

export async function deleteRecommendation(id: string): Promise<boolean> {
  const db = await getDb()
  const result = await db.collection<Recommendation>("recommendations").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

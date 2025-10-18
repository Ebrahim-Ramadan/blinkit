import type { ObjectId } from "mongodb"

export interface Product {
  _id?: ObjectId
  name: string
  buyCost: number
  sellCost: number
  quantity: number
  supplierId: string
  category: string
  sku: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Supplier {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  address: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Recommendation {
  _id?: ObjectId
  userName: string
  email: string
  rating: number
  message: string
  status: "new" | "reviewed" | "archived"
  createdAt?: Date
  updatedAt?: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

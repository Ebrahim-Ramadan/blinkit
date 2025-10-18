import { create } from "zustand"

export interface Product {
  id: string
  name: string
  buy_cost: number
  sell_cost: number
  quantity_on_hand: number
  supplier: string
  category: string
  sku: string
}

export interface Recommendation {
  id: string
  user_name: string
  product_suggestion: string
  message: string
  created_at: string
}

interface Store {
  products: Product[]
  recommendations: Recommendation[]
  addProduct: (product: Omit<Product, "id">) => void
  deleteProduct: (id: string) => void
  updateProduct: (id: string, product: Omit<Product, "id">) => void
  addRecommendation: (rec: Omit<Recommendation, "id" | "created_at">) => void
  deleteRecommendation: (id: string) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useStore = create<Store>((set) => ({
  products: [],
  recommendations: [],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: generateId() }],
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...product, id } : p)),
    })),
  addRecommendation: (rec) =>
    set((state) => ({
      recommendations: [...state.recommendations, { ...rec, id: generateId(), created_at: new Date().toISOString() }],
    })),
  deleteRecommendation: (id) =>
    set((state) => ({
      recommendations: state.recommendations.filter((r) => r.id !== id),
    })),
}))

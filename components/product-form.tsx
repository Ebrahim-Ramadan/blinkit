"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Product } from "./products-view"

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id" | "margin">) => void
  onCancel: () => void
  initialData?: Product | null
}

export function ProductForm({ onSubmit, onCancel, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    buyCost: initialData?.buyCost || 0,
    sellCost: initialData?.sellCost || 0,
    quantity: initialData?.quantity || 0,
    supplier: initialData?.supplier || "",
    category: initialData?.category || "Vegetables",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      buyCost: 0,
      sellCost: 0,
      quantity: 0,
      supplier: "",
      category: "Vegetables",
    })
  }

  const margin =
    formData.buyCost > 0 ? (((formData.sellCost - formData.buyCost) / formData.buyCost) * 100).toFixed(1) : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            placeholder="e.g., Fresh Tomatoes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
          >
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Dairy</option>
            <option>Bakery</option>
            <option>Beverages</option>
            <option>Snacks</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Supplier *</label>
          <input
            type="text"
            required
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            placeholder="e.g., Green Valley Farms"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Quantity on Hand *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Buy Cost (EGP) *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.buyCost}
            onChange={(e) => setFormData({ ...formData, buyCost: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sell Cost (EGP) *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.sellCost}
            onChange={(e) => setFormData({ ...formData, sellCost: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Margin Display */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Profit Margin:</span>
          <span className="text-lg font-bold text-primary">{margin}%</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2">
          {initialData ? "Update Product" : "Add Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent text-base py-2">
          Cancel
        </Button>
      </div>
    </form>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product | null
  suppliers: any[]
  onSave: (product: Product) => void
  onCancel: () => void
}

export default function ProductForm({ product, suppliers, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, "_id">>(
    product || {
      name: "",
      buyCost: 0,
      sellCost: 0,
      quantity: 0,
      supplierId: "",
      category: "",
      sku: "",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" || name === "category" || name === "sku" ? value : Number.parseFloat(value) || 0,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, supplierId: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.supplierId) {
      alert("Please fill in all required fields")
      return
    }
    onSave({ ...formData, _id: product?._id })
  }

  return (
    <Card className="border-primary/20 bg-card animate-in fade-in slide-in-from-top duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
          <CardDescription>Fill in the product details below</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-destructive/10 transition-colors">
          <X size={18} />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Fresh Tomatoes"
                required
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., PROD-001"
                required
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500"
            style={{ animationDelay: "50ms" }}
          >
            <div className="space-y-2">
              <Label htmlFor="buyCost">Buy Cost (EGP) *</Label>
              <Input
                id="buyCost"
                name="buyCost"
                type="number"
                step="0.01"
                value={formData.buyCost}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellCost">Sell Price (EGP) *</Label>
              <Input
                id="sellCost"
                name="sellCost"
                type="number"
                step="0.01"
                value={formData.sellCost}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500"
            style={{ animationDelay: "100ms" }}
          >
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity on Hand *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                required
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Vegetables"
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
          </div>

          <div className="space-y-2 animate-in fade-in duration-500" style={{ animationDelay: "150ms" }}>
            <Label htmlFor="supplier">Supplier *</Label>
            <Select value={formData.supplierId} onValueChange={handleSelectChange}>
              <SelectTrigger className="transition-all duration-200">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent className="animate-in fade-in zoom-in-95 duration-200">
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {suppliers.length === 0 && (
              <p className="text-xs text-muted-foreground">Add suppliers first in the Suppliers tab</p>
            )}
          </div>

          <div className="flex gap-2 pt-4 animate-in fade-in duration-500" style={{ animationDelay: "200ms" }}>
            <Button type="submit" className="flex-1 hover:scale-105 transition-transform duration-200">
              {product ? "Update Product" : "Add Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

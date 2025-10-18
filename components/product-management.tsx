"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2, Search, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Product {
  _id: string
  name: string
  buy_cost: number
  sell_cost: number
  quantity_on_hand: number
  supplier: string
  category: string
  sku: string
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    buy_cost: "",
    sell_cost: "",
    quantity_on_hand: "",
    supplier: "",
    category: "",
    sku: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        const response = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            buy_cost: Number.parseFloat(formData.buy_cost),
            sell_cost: Number.parseFloat(formData.sell_cost),
            quantity_on_hand: Number.parseInt(formData.quantity_on_hand),
          }),
        })
        if (response.ok) {
          await fetchProducts()
          setEditingId(null)
        }
      } else {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            buy_cost: Number.parseFloat(formData.buy_cost),
            sell_cost: Number.parseFloat(formData.sell_cost),
            quantity_on_hand: Number.parseInt(formData.quantity_on_hand),
          }),
        })
        if (response.ok) {
          await fetchProducts()
        }
      }
      setFormData({
        name: "",
        buy_cost: "",
        sell_cost: "",
        quantity_on_hand: "",
        supplier: "",
        category: "",
        sku: "",
      })
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setFormData(product)
    setEditingId(product._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchProducts()
      }
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: "",
      buy_cost: "",
      sell_cost: "",
      quantity_on_hand: "",
      supplier: "",
      category: "",
      sku: "",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  }

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header with Search and Add Button */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        variants={itemVariants}
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </motion.div>
      </motion.div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Product Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Fresh Tomatoes"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">SKU</label>
                      <Input
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g., SKU-001"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Vegetables"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Supplier *</label>
                      <Input
                        required
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        placeholder="e.g., Fresh Farms Co."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Buy Cost (EGP) *</label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={formData.buy_cost}
                        onChange={(e) => setFormData({ ...formData, buy_cost: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sell Cost (EGP) *</label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={formData.sell_cost}
                        onChange={(e) => setFormData({ ...formData, sell_cost: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Quantity on Hand *</label>
                      <Input
                        required
                        type="number"
                        value={formData.quantity_on_hand}
                        onChange={(e) => setFormData({ ...formData, quantity_on_hand: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      {editingId ? "Update" : "Add"} Product
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>{filteredProducts.length} products in inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Product</th>
                      <th className="text-left py-3 px-4 font-semibold">Supplier</th>
                      <th className="text-right py-3 px-4 font-semibold">Buy Cost</th>
                      <th className="text-right py-3 px-4 font-semibold">Sell Cost</th>
                      <th className="text-right py-3 px-4 font-semibold">Margin</th>
                      <th className="text-right py-3 px-4 font-semibold">Qty</th>
                      <th className="text-center py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {filteredProducts.map((product) => (
                          <motion.tr
                            key={product._id}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">{product.supplier}</td>
                            <td className="py-3 px-4 text-right">EGP {product.buy_cost.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">EGP {product.sell_cost.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-primary font-semibold">
                                EGP {(product.sell_cost - product.buy_cost).toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <motion.span
                                className={`px-2 py-1 rounded text-xs font-medium inline-block ${
                                  product.quantity_on_hand > 10
                                    ? "bg-green-100 text-green-800"
                                    : product.quantity_on_hand > 0
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {product.quantity_on_hand}
                              </motion.span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex gap-2 justify-center">
                                <motion.button
                                  onClick={() => handleEdit(product)}
                                  className="p-1 hover:bg-muted rounded"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Edit2 className="w-4 h-4 text-primary" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDelete(product._id)}
                                  className="p-1 hover:bg-muted rounded"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

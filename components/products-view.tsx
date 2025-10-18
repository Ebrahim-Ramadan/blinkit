"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "./product-form"
import { ProductTable } from "./product-table"

export interface Product {
  id: string
  name: string
  buyCost: number
  sellCost: number
  quantity: number
  supplier: string
  category: string
  margin: number
}

// No initial products, fetch from API

const CATEGORIES = ["Vegetables", "Fruits", "Dairy", "Bakery", "Beverages", "Snacks", "Other"]
export function ProductsView() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    supplier: "",
    stockStatus: "all",
  })

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(
        data.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          buyCost: p.buy_cost ?? p.buyCost,
          sellCost: p.sell_cost ?? p.sellCost,
          quantity: p.quantity_on_hand ?? p.quantity,
          supplier: p.supplier,
          category: p.category,
          margin: p.buy_cost ? ((p.sell_cost - p.buy_cost) / p.buy_cost) * 100 : (p.buyCost ? ((p.sellCost - p.buyCost) / p.buyCost) * 100 : 0),
        }))
      )
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !filters.category || p.category === filters.category
    const matchesSupplier = !filters.supplier || p.supplier === filters.supplier

    let matchesStockStatus = true
    if (filters.stockStatus === "low") matchesStockStatus = p.quantity < 50 && p.quantity > 0
    if (filters.stockStatus === "out") matchesStockStatus = p.quantity === 0

    return matchesSearch && matchesCategory && matchesSupplier && matchesStockStatus
  })

  const handleAddProduct = async (product: Omit<Product, "id" | "margin">) => {
    const payload = {
      name: product.name,
      buy_cost: product.buyCost,
      sell_cost: product.sellCost,
      quantity_on_hand: product.quantity,
      supplier: product.supplier,
      category: product.category,
      sku: '',
    }
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setProducts((prev) => [
      ...prev,
      {
        id: data._id || data.id,
        name: data.name,
        buyCost: data.buy_cost ?? data.buyCost,
        sellCost: data.sell_cost ?? data.sellCost,
        quantity: data.quantity_on_hand ?? data.quantity,
        supplier: data.supplier,
        category: data.category,
        margin: data.buy_cost ? ((data.sell_cost - data.buy_cost) / data.buy_cost) * 100 : (data.buyCost ? ((data.sellCost - data.buyCost) / data.buyCost) * 100 : 0),
      },
    ])
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    setSelectedProducts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedProducts.size} products?`)) {
      setProducts(products.filter((p) => !selectedProducts.has(p.id)))
      setSelectedProducts(new Set())
    }
  }

  const handleExport = () => {
    const headers = ["Product Name", "Category", "Supplier", "Buy Cost", "Sell Cost", "Stock", "Margin %"]
    const rows = filteredProducts.map((p) => [
      p.name,
      p.category,
      p.supplier,
      p.buyCost.toFixed(2),
      p.sellCost.toFixed(2),
      p.quantity,
      p.margin.toFixed(1),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const handleSelectProduct = (id: string) => {
    const newSet = new Set(selectedProducts)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedProducts(newSet)
  }

  const editingProduct = editingId ? products.find((p) => p.id === editingId) : null
  const uniqueSuppliers = Array.from(new Set(products.map((p) => p.supplier)))
  const lowStockCount = products.filter((p) => p.quantity < 50 && p.quantity > 0).length
  const outOfStockCount = products.filter((p) => p.quantity === 0).length

  return loading
    ? <div className="flex justify-center items-center h-64"><span>Loading products...</span></div>
    : (
    <div className="p-3 sm:p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your inventory and pricing</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-border bg-transparent text-sm sm:text-base"
          >
            <Download className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-primary/20 bg-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              initialData={editingProduct}
            />
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="border-border text-sm">
            <Filter className="w-4 h-4 mr-1 sm:mr-2" />
            Filters
          </Button>
          {selectedProducts.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="bg-destructive hover:bg-destructive/90 text-sm"
            >
              Delete {selectedProducts.size}
            </Button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Supplier</label>
                  <select
                    value={filters.supplier}
                    onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="">All Suppliers</option>
                    {uniqueSuppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>
                        {supplier}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Stock Status</label>
                  <select
                    value={filters.stockStatus}
                    onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="all">All Products</option>
                    <option value="low">Low Stock (&lt;50)</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ category: "", supplier: "", stockStatus: "all" })}
                  className="border-border text-sm"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl sm:text-2xl font-bold text-primary mt-1 sm:mt-2">{products.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-accent mt-1 sm:mt-2">
                {products.reduce((sum, p) => sum + p.quantity, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">Low Stock</p>
              <p
                className={`text-xl sm:text-2xl font-bold mt-1 sm:mt-2 ${lowStockCount > 0 ? "text-destructive" : "text-primary"}`}
              >
                {lowStockCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">Avg Margin</p>
              <p className="text-xl sm:text-2xl font-bold text-primary mt-1 sm:mt-2">
                {(products.reduce((sum, p) => sum + p.margin, 0) / products.length).toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Product Inventory</CardTitle>
            {selectedProducts.size > 0 && (
              <span className="text-xs sm:text-sm text-muted-foreground">{selectedProducts.size} selected</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable
            products={filteredProducts}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}

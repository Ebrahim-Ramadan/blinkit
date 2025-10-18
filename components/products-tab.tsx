"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import ProductForm from "./product-form"
import { useApi } from "@/hooks/use-api"
import type { Product } from "@/lib/types"

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { request: fetchProducts } = useApi<Product[]>()
  const { request: fetchSuppliers } = useApi<any[]>()
  const { request: deleteProduct } = useApi()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const productsData = await fetchProducts("/api/products")
      const suppliersData = await fetchSuppliers("/api/suppliers")
      setProducts(productsData || [])
      setSuppliers(suppliersData || [])
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveProduct = async (product: Product) => {
    try {
      if (editingProduct?._id) {
        await fetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        })
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        })
      }
      await loadData()
      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error("[v0] Error saving product:", error)
    }
  }

  const handleDeleteProduct = async (id: string | undefined) => {
    if (!id) return
    try {
      await deleteProduct(`/api/products/${id}`, "DELETE")
      await loadData()
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
    }
  }

  const getSupplierName = (supplierId: string) => {
    return suppliers.find((s) => s._id === supplierId)?.name || "Unknown"
  }

  const margin = (product: Product) => {
    const marginValue = product.sellCost - product.buyCost
    const percentage = ((marginValue / product.buyCost) * 100).toFixed(1)
    return `${percentage}%`
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in slide-in-from-top duration-500">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="gap-2 w-full sm:w-auto hover:scale-105 transition-transform duration-200"
        >
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      {showForm && (
        <div className="animate-in fade-in slide-in-from-top duration-300">
          <ProductForm
            product={editingProduct}
            suppliers={suppliers}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      )}

      <div className="relative animate-in fade-in duration-500">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 transition-all duration-200"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product, index) => (
          <Card
            key={product._id?.toString()}
            className="flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{product.name}</CardTitle>
                  <CardDescription className="text-xs">SKU: {product.sku}</CardDescription>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}
                    className="hover:bg-primary/10 transition-colors duration-200"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProduct(product._id?.toString())}
                    className="hover:bg-destructive/10 transition-colors duration-200"
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Buy Cost</p>
                  <p className="font-semibold">EGP {product.buyCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sell Price</p>
                  <p className="font-semibold text-primary">EGP {product.sellCost.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-semibold">{product.quantity} units</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Margin</p>
                  <p className="font-semibold text-accent">{margin(product)}</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Supplier</p>
                <p className="font-semibold truncate">{getSupplierName(product.supplierId)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="text-center py-12 animate-in fade-in duration-500">
          <CardContent>
            <p className="text-muted-foreground">No products found. Add your first product to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

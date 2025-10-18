"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "./products-view"

interface ProductTableProps {
  products: Product[]
  selectedProducts: Set<string>
  onSelectProduct: (id: string) => void
  onSelectAll: () => void
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function ProductTable({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    )
  }

  const allSelected = products.length > 0 && selectedProducts.size === products.length

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground w-12">
                <Checkbox checked={allSelected} onChange={onSelectAll} className="cursor-pointer" />
              </th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Supplier</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Buy Cost</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Sell Cost</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Stock</th>
              <th className="text-right py-3 px-4 font-semibold text-foreground">Margin</th>
              <th className="text-center py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className={`border-b border-border transition-colors ${
                  selectedProducts.has(product.id) ? "bg-primary/10" : "hover:bg-muted/50"
                }`}
              >
                <td className="py-3 px-4">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onChange={() => onSelectProduct(product.id)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-foreground">{product.supplier}</td>
                <td className="py-3 px-4 text-right text-foreground">EGP {product.buyCost.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-foreground">EGP {product.sellCost.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-semibold ${product.quantity < 50 ? "text-destructive" : "text-primary"}`}>
                    {product.quantity}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-semibold text-accent">{product.margin.toFixed(1)}%</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3 px-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`border border-border rounded-lg p-4 transition-colors ${
              selectedProducts.has(product.id) ? "bg-primary/10" : "bg-card"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <Checkbox
                checked={selectedProducts.has(product.id)}
                onChange={() => onSelectProduct(product.id)}
                className="cursor-pointer mt-1"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground">{product.category}</p>
                <p className="text-xs text-muted-foreground mt-1">{product.supplier}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Buy Cost</p>
                <p className="font-semibold text-foreground">EGP {product.buyCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sell Cost</p>
                <p className="font-semibold text-foreground">EGP {product.sellCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stock</p>
                <p className={`font-semibold ${product.quantity < 50 ? "text-destructive" : "text-primary"}`}>
                  {product.quantity}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Margin</p>
                <p className="font-semibold text-accent">{product.margin.toFixed(1)}%</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
                className="flex-1 border-border text-primary"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(product.id)}
                className="flex-1 border-border text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

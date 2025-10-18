"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

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

export function SupplierAnalytics() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchProducts()
  }, [])

  // Supplier metrics
  const supplierMetrics = products.reduce((acc: any, p) => {
    const existing = acc.find((s: any) => s.name === p.supplier)
    const margin = p.sell_cost - p.buy_cost
    const marginPercent = ((margin / p.buy_cost) * 100).toFixed(1)

    if (existing) {
      existing.productCount += 1
      existing.totalValue += p.quantity_on_hand * p.sell_cost
      existing.avgBuyCost = (existing.avgBuyCost + p.buy_cost) / 2
      existing.avgMarginPercent = (Number.parseFloat(existing.avgMarginPercent) + Number.parseFloat(marginPercent)) / 2
    } else {
      acc.push({
        name: p.supplier,
        productCount: 1,
        totalValue: p.quantity_on_hand * p.sell_cost,
        avgBuyCost: p.buy_cost,
        avgMarginPercent: marginPercent,
      })
    }
    return acc
  }, [])

  // Price comparison data
  const priceData = products.map((p) => ({
    name: p.name,
    buyCost: p.buy_cost,
    sellCost: p.sell_cost,
    margin: p.sell_cost - p.buy_cost,
    marginPercent: (((p.sell_cost - p.buy_cost) / p.buy_cost) * 100).toFixed(1),
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.1 } },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Supplier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {supplierMetrics.map((supplier: any, i: number) => (
          <motion.div key={supplier.name} variants={cardVariants} custom={i}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{supplier.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Products</p>
                  <motion.p className="text-2xl font-bold" variants={numberVariants}>
                    {supplier.productCount}
                  </motion.p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Buy Cost</p>
                  <motion.p className="text-lg font-semibold" variants={numberVariants}>
                    EGP {supplier.avgBuyCost.toFixed(2)}
                  </motion.p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Margin %</p>
                  <motion.p className="text-lg font-semibold text-primary" variants={numberVariants}>
                    {supplier.avgMarginPercent}%
                  </motion.p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Stock Value</p>
                  <motion.p className="text-lg font-semibold" variants={numberVariants}>
                    EGP {(supplier.totalValue / 1000).toFixed(1)}K
                  </motion.p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Supplier Comparison</CardTitle>
              <CardDescription>Products per supplier</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="productCount" fill="hsl(var(--color-primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Margin Analysis</CardTitle>
              <CardDescription>Profit margin by supplier</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgMarginPercent" fill="hsl(var(--color-accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Price Comparison Table */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Price Comparison</CardTitle>
            <CardDescription>Buy vs Sell pricing analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-right py-3 px-4 font-semibold">Buy Cost</th>
                    <th className="text-right py-3 px-4 font-semibold">Sell Cost</th>
                    <th className="text-right py-3 px-4 font-semibold">Margin</th>
                    <th className="text-right py-3 px-4 font-semibold">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {priceData.map((item, idx) => (
                    <motion.tr
                      key={idx}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4 text-right">EGP {item.buyCost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">EGP {item.sellCost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-primary">EGP {item.margin.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-accent">{item.marginPercent}%</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

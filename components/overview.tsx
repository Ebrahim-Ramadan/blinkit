"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
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

interface Recommendation {
  _id: string
  user_name: string
  product_suggestion: string
  message: string
  created_at: string
}

export function Overview() {
  const [products, setProducts] = useState<Product[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, recsRes] = await Promise.all([fetch("/api/products"), fetch("/api/recommendations")])
        const productsData = await productsRes.json()
        const recsData = await recsRes.json()
        setProducts(productsData)
        setRecommendations(recsData)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.quantity_on_hand * p.sell_cost, 0)
  const avgMargin =
    products.length > 0
      ? (products.reduce((sum, p) => sum + (p.sell_cost - p.buy_cost), 0) / products.length).toFixed(2)
      : 0

  const supplierData = products.reduce((acc: any, p) => {
    const existing = acc.find((s: any) => s.name === p.supplier)
    if (existing) {
      existing.count += 1
      existing.value += p.quantity_on_hand * p.sell_cost
    } else {
      acc.push({ name: p.supplier, count: 1, value: p.quantity_on_hand * p.sell_cost })
    }
    return acc
  }, [])

  const stockData = [
    { name: "In Stock", value: products.filter((p) => p.quantity_on_hand > 10).length },
    { name: "Low Stock", value: products.filter((p) => p.quantity_on_hand > 0 && p.quantity_on_hand <= 10).length },
    { name: "Out of Stock", value: products.filter((p) => p.quantity_on_hand === 0).length },
  ]

  const COLORS = ["#4ade80", "#facc15", "#ef4444"]

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
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } },
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Products", value: totalProducts, subtitle: "Active in inventory" },
          { title: "Inventory Value", value: `EGP ${(totalValue / 1000).toFixed(1)}K`, subtitle: "Total stock value" },
          { title: "Avg Margin", value: `EGP ${avgMargin}`, subtitle: "Per product" },
          { title: "Recommendations", value: recommendations.length, subtitle: "User feedback" },
        ].map((card, i) => (
          <motion.div key={i} variants={cardVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div className="text-3xl font-bold" variants={numberVariants}>
                  {card.value}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
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
              <CardTitle>Supplier Distribution</CardTitle>
              <CardDescription>Products by supplier</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--color-primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Stock Status</CardTitle>
              <CardDescription>Inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

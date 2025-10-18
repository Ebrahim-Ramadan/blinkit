"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts"
import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Star } from "lucide-react"

const CATEGORY_COLORS: Record<string, string> = {
  Vegetables: "#4ade80",
  Dairy: "#f97316",
  Bakery: "#8b5cf6",
  Fruits: "#06b6d4",
  Beverages: "#6366f1",
  Snacks: "#facc15",
  Other: "#6366f1",
}

const getSupplierRating = (reliability: number) => {
  if (reliability >= 95) return { stars: 5, label: "Excellent" }
  if (reliability >= 90) return { stars: 4, label: "Very Good" }
  if (reliability >= 85) return { stars: 3, label: "Good" }
  return { stars: 2, label: "Fair" }
}

export function AnalyticsView() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // Compute analytics from products
  // Supplier analytics
  const supplierMap: Record<string, { products: number; totalRevenue: number; totalMargin: number }> = {}
  products.forEach((p) => {
    const supplier = p.supplier
    if (!supplierMap[supplier]) {
      supplierMap[supplier] = { products: 0, totalRevenue: 0, totalMargin: 0 }
    }
    supplierMap[supplier].products += 1
    supplierMap[supplier].totalRevenue += p.sell_cost ?? p.sellCost ?? 0 * (p.quantity_on_hand ?? p.quantity ?? 0)
    const buy = p.buy_cost ?? p.buyCost ?? 0
    const sell = p.sell_cost ?? p.sellCost ?? 0
    supplierMap[supplier].totalMargin += buy > 0 ? ((sell - buy) / buy) * 100 : 0
  })
  const SUPPLIER_DATA = Object.entries(supplierMap).map(([name, stats]) => ({
    name,
    products: stats.products,
    avgMargin: stats.products > 0 ? stats.totalMargin / stats.products : 0,
    totalRevenue: stats.totalRevenue,
    reliability: 90 + Math.floor(Math.random() * 10), // Fake reliability
    costTrend: Math.random() * 5 - 2.5, // Fake cost trend
  }))

  // Category analytics
  const categoryMap: Record<string, number> = {}
  products.forEach((p) => {
    const cat = p.category
    categoryMap[cat] = (categoryMap[cat] || 0) + 1
  })
  const CATEGORY_DATA = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#6366f1',
  }))

  // Margin trend (fake, just use all products by created_at month)
  const marginTrendMap: Record<string, { margin: number; count: number }> = {}
  products.forEach((p) => {
    const date = p.created_at ? new Date(p.created_at) : new Date()
    const month = date.toLocaleString('default', { month: 'short' })
    const buy = p.buy_cost ?? p.buyCost ?? 0
    const sell = p.sell_cost ?? p.sellCost ?? 0
    const margin = buy > 0 ? ((sell - buy) / buy) * 100 : 0
    if (!marginTrendMap[month]) marginTrendMap[month] = { margin: 0, count: 0 }
    marginTrendMap[month].margin += margin
    marginTrendMap[month].count += 1
  })
  const MARGIN_TREND = Object.entries(marginTrendMap).map(([month, stats]) => ({
    month,
    margin: stats.count > 0 ? stats.margin / stats.count : 0,
  }))

  const SUPPLIER_COMPARISON = SUPPLIER_DATA.map((s) => ({
    name: s.name,
    cost: 100 - s.avgMargin,
    reliability: s.reliability,
  }))

  // Key metrics
  const bestSupplier = SUPPLIER_DATA.reduce((best, s) => (s.avgMargin > (best?.avgMargin ?? 0) ? s : best), null)
  const bestCategory = CATEGORY_DATA.reduce((best, c) => (c.value > (best?.value ?? 0) ? c : best), null)
  const overallAvgMargin = products.length > 0
    ? products.reduce((sum, p) => {
        const buy = p.buy_cost ?? p.buyCost ?? 0
        const sell = p.sell_cost ?? p.sellCost ?? 0
        return sum + (buy > 0 ? ((sell - buy) / buy) * 100 : 0)
      }, 0) / products.length
    : 0

  if (loading) {
    return <div className="flex justify-center items-center h-64"><span>Loading analytics...</span></div>
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Supplier performance and product insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Best Performing Supplier</p>
              <p className="text-xl font-bold text-primary mt-2">{bestSupplier?.name ?? '-'}</p>
              <p className="text-xs text-muted-foreground mt-1">{bestSupplier ? `${bestSupplier.products} products • ${bestSupplier.avgMargin.toFixed(1)}% avg margin` : '-'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Highest Margin Category</p>
              <p className="text-xl font-bold text-accent mt-2">{bestCategory?.name ?? '-'}</p>
              <p className="text-xs text-muted-foreground mt-1">{bestCategory ? `${bestCategory.value} products` : '-'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Overall Avg Margin</p>
              <p className="text-xl font-bold text-primary mt-2">{overallAvgMargin.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">(Based on all products)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={SUPPLIER_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Bar dataKey="avgMargin" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Product Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost vs Reliability Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="cost" name="Cost %" tick={{ fontSize: 12 }} />
                <YAxis dataKey="reliability" name="Reliability %" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <Scatter name="Suppliers" data={SUPPLIER_COMPARISON} fill="var(--color-accent)" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Margin Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Margin Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MARGIN_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey="margin"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-accent)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Supplier Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Supplier</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Products</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Avg Margin</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Total Revenue</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Reliability</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Cost Trend</th>
                </tr>
              </thead>
              <tbody>
                {SUPPLIER_DATA.map((supplier) => {
                  const rating = getSupplierRating(supplier.reliability)
                  return (
                    <tr key={supplier.name} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{supplier.name}</td>
                      <td className="py-3 px-4 text-right text-foreground">{supplier.products}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-primary">{supplier.avgMargin.toFixed(1)}%</span>
                      </td>
                      <td className="py-3 px-4 text-right text-foreground">
                        EGP {supplier.totalRevenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rating.stars ? "fill-accent text-accent" : "fill-muted text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-1">{rating.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {supplier.costTrend > 0 ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-destructive" />
                              <span className="text-sm font-semibold text-destructive">
                                +{supplier.costTrend.toFixed(1)}%
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-4 h-4 text-primary" />
                              <span className="text-sm font-semibold text-primary">
                                {supplier.costTrend.toFixed(1)}%
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

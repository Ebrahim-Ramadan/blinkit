"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useApi } from "@/hooks/use-api"

interface AnalyticsData {
  totalProducts: number
  totalInventoryValue: number
  totalProfit: number
  averageMargin: number
  supplierStats: Array<{
    supplierId: string
    supplierName: string
    productCount: number
    totalCost: number
    totalRevenue: number
    margin: number
  }>
  categoryStats: Array<{
    category: string
    count: number
    totalValue: number
  }>
}

export default function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const { request: fetchAnalytics } = useApi<AnalyticsData>()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await fetchAnalytics("/api/analytics")
      setAnalytics(data)
    } catch (error) {
      console.error("[v0] Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 animate-in fade-in duration-500">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card className="text-center py-12 animate-in fade-in duration-500">
        <CardContent>
          <p className="text-muted-foreground">Failed to load analytics</p>
        </CardContent>
      </Card>
    )
  }

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Products", value: analytics.totalProducts, unit: "Active SKUs" },
          {
            label: "Inventory Value",
            value: `EGP ${(analytics.totalInventoryValue / 1000).toFixed(1)}K`,
            unit: "At cost price",
          },
          {
            label: "Total Profit",
            value: `EGP ${(analytics.totalProfit / 1000).toFixed(1)}K`,
            unit: "Potential profit",
            highlight: true,
          },
          { label: "Avg Margin", value: `${analytics.averageMargin.toFixed(1)}%`, unit: "Profit margin", accent: true },
        ].map((kpi, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.highlight ? "text-primary" : kpi.accent ? "text-accent" : ""}`}>
                {kpi.value}
              </div>
              <p className="text-xs text-muted-foreground">{kpi.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Supplier Performance */}
        <Card
          className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader>
            <CardTitle>Supplier Performance</CardTitle>
            <CardDescription>Products and profit by supplier</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.supplierStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.supplierStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="supplierName"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="productCount" fill="#10b981" name="Products" />
                  <Bar dataKey="margin" fill="#f59e0b" name="Profit (EGP)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Add suppliers and products to see analytics
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card
          className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-right"
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, count }) => `${category}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Add products to see category distribution
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Supplier Details Table */}
      {analytics.supplierStats.length > 0 && (
        <Card
          className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom"
          style={{ animationDelay: "500ms" }}
        >
          <CardHeader>
            <CardTitle>Supplier Details</CardTitle>
            <CardDescription>Detailed metrics for each supplier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-semibold">Supplier</th>
                    <th className="text-right py-2 px-2 font-semibold">Products</th>
                    <th className="text-right py-2 px-2 font-semibold">Total Cost</th>
                    <th className="text-right py-2 px-2 font-semibold">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.supplierStats.map((stat, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors duration-200">
                      <td className="py-2 px-2">{stat.supplierName}</td>
                      <td className="text-right py-2 px-2">{stat.productCount}</td>
                      <td className="text-right py-2 px-2">EGP {stat.totalCost.toFixed(0)}</td>
                      <td className="text-right py-2 px-2 text-accent font-semibold">EGP {stat.margin.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

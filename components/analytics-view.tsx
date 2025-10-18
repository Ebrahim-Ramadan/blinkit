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
import { TrendingUp, TrendingDown, Star } from "lucide-react"

const SUPPLIER_DATA = [
  { name: "Green Valley Farms", products: 12, avgMargin: 95.2, totalRevenue: 2450, reliability: 98, costTrend: 2.3 },
  { name: "Dairy Fresh Co", products: 8, avgMargin: 88.5, totalRevenue: 1890, reliability: 95, costTrend: -1.2 },
  { name: "Artisan Bakery", products: 6, avgMargin: 142.3, totalRevenue: 1240, reliability: 92, costTrend: 0.8 },
  { name: "Fresh Produce Ltd", products: 10, avgMargin: 78.9, totalRevenue: 2100, reliability: 88, costTrend: 3.1 },
  { name: "Premium Beverages", products: 5, avgMargin: 65.4, totalRevenue: 980, reliability: 85, costTrend: -2.5 },
]

const CATEGORY_DATA = [
  { name: "Vegetables", value: 28, color: "#4ade80" },
  { name: "Dairy", value: 22, color: "#f97316" },
  { name: "Bakery", value: 18, color: "#8b5cf6" },
  { name: "Fruits", value: 20, color: "#06b6d4" },
  { name: "Other", value: 12, color: "#6366f1" },
]

const MARGIN_TREND = [
  { month: "Jan", margin: 82.5 },
  { month: "Feb", margin: 85.2 },
  { month: "Mar", margin: 88.1 },
  { month: "Apr", margin: 91.3 },
  { month: "May", margin: 89.7 },
  { month: "Jun", margin: 93.2 },
]

const SUPPLIER_COMPARISON = SUPPLIER_DATA.map((s) => ({
  name: s.name,
  cost: 100 - s.avgMargin,
  reliability: s.reliability,
}))

const getSupplierRating = (reliability: number) => {
  if (reliability >= 95) return { stars: 5, label: "Excellent" }
  if (reliability >= 90) return { stars: 4, label: "Very Good" }
  if (reliability >= 85) return { stars: 3, label: "Good" }
  return { stars: 2, label: "Fair" }
}

export function AnalyticsView() {
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
              <p className="text-xl font-bold text-primary mt-2">Green Valley Farms</p>
              <p className="text-xs text-muted-foreground mt-1">12 products • 95.2% avg margin</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Highest Margin Category</p>
              <p className="text-xl font-bold text-accent mt-2">Bakery</p>
              <p className="text-xs text-muted-foreground mt-1">142.3% average margin</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-muted-foreground text-sm">Overall Avg Margin</p>
              <p className="text-xl font-bold text-primary mt-2">94.1%</p>
              <p className="text-xs text-muted-foreground mt-1">↑ 2.4% from last month</p>
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
                  label={({ name, value }) => `${name} ${value}%`}
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

import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Product, Supplier, ApiResponse } from "@/lib/types"

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

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("grocery_admin")

    const products = await db.collection<Product>("products").find({}).toArray()
    const suppliers = await db.collection<Supplier>("suppliers").find({}).toArray()

    const supplierMap = new Map(suppliers.map((s) => [s._id?.toString(), s]))

    let totalInventoryValue = 0
    let totalProfit = 0
    let totalMargin = 0

    const supplierStats = new Map<
      string,
      {
        supplierId: string
        supplierName: string
        productCount: number
        totalCost: number
        totalRevenue: number
      }
    >()

    const categoryStats = new Map<
      string,
      {
        category: string
        count: number
        totalValue: number
      }
    >()

    products.forEach((product) => {
      const inventoryValue = product.quantity * product.sellCost
      const cost = product.quantity * product.buyCost
      const profit = inventoryValue - cost

      totalInventoryValue += inventoryValue
      totalProfit += profit
      totalMargin += product.sellCost - product.buyCost

      // Supplier stats
      const supplierId = product.supplierId
      const supplier = supplierMap.get(supplierId)
      const supplierName = supplier?.name || "Unknown"

      if (!supplierStats.has(supplierId)) {
        supplierStats.set(supplierId, {
          supplierId,
          supplierName,
          productCount: 0,
          totalCost: 0,
          totalRevenue: 0,
        })
      }

      const stats = supplierStats.get(supplierId)!
      stats.productCount += 1
      stats.totalCost += cost
      stats.totalRevenue += inventoryValue

      // Category stats
      const category = product.category || "Uncategorized"
      if (!categoryStats.has(category)) {
        categoryStats.set(category, {
          category,
          count: 0,
          totalValue: 0,
        })
      }

      const catStats = categoryStats.get(category)!
      catStats.count += 1
      catStats.totalValue += inventoryValue
    })

    const supplierStatsArray = Array.from(supplierStats.values()).map((stat) => ({
      ...stat,
      margin: stat.totalRevenue - stat.totalCost,
    }))

    const analytics: AnalyticsData = {
      totalProducts: products.length,
      totalInventoryValue,
      totalProfit,
      averageMargin: products.length > 0 ? totalMargin / products.length : 0,
      supplierStats: supplierStatsArray,
      categoryStats: Array.from(categoryStats.values()),
    }

    return NextResponse.json<ApiResponse<AnalyticsData>>({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json<ApiResponse<null>>({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}

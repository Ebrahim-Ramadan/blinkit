"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { ProductsView } from "./products-view"
import { AnalyticsView } from "./analytics-view"
import { RecommendationsView } from "./recommendations-view"

type ViewType = "products" | "analytics" | "recommendations"

export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("products")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 overflow-auto">
        {currentView === "products" && <ProductsView />}
        {currentView === "analytics" && <AnalyticsView />}
        {currentView === "recommendations" && <RecommendationsView />}
      </main>
    </div>
  )
}

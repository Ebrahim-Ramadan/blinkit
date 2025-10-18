"use client"

import { useState, useEffect } from "react"
import AnalyticsTab from "@/components/analytics-tab"

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="animate-in fade-in duration-500">
      <AnalyticsTab />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import RecommendationsTab from "@/components/recommendations-tab"

export default function FeedbacksPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="animate-in fade-in duration-500">
      <RecommendationsTab />
    </div>
  )
}

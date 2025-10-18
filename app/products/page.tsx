"use client"

import { useState, useEffect } from "react"
import ProductsTab from "@/components/products-tab"

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="animate-in fade-in duration-500">
      <ProductsTab />
    </div>
  )
}

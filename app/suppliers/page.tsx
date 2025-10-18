"use client"

import { useState, useEffect } from "react"
import SuppliersTab from "@/components/suppliers-tab"

export default function SuppliersPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="animate-in fade-in duration-500">
      <SuppliersTab />
    </div>
  )
}

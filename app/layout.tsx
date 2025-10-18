"use client"

import type React from "react"
import "./globals.css"
import { useState } from "react"
import { LayoutDashboard, Package, TrendingUp, MessageSquare, Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/" },
    { id: "products", label: "Products", icon: Package, href: "/products" },
    { id: "suppliers", label: "Suppliers", icon: TrendingUp, href: "/suppliers" },
    { id: "recommendations", label: "Recommendations", icon: MessageSquare, href: "/recommendations" },
  ]

  const sidebarVariants = {
    hidden: { x: -256 },
    visible: { x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  }

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  const currentLabel = navItems.find((item) => isActive(item.href))?.label || "Dashboard"

  return (
    <html>
      <body>
        <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={sidebarOpen ? "visible" : "hidden"}
        variants={sidebarVariants}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <motion.div
            className="p-6 border-b border-sidebar-border"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sidebar-primary-foreground font-bold text-sm">⚡</span>
              </motion.div>
              <h1 className="text-xl font-bold">FastCart</h1>
            </div>
          </motion.div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item, i) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <motion.div key={item.id} custom={i} initial="hidden" animate="visible" variants={navItemVariants}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          <motion.div
            className="p-4 border-t border-sidebar-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="text-xs text-sidebar-foreground/60">
              <p>Admin Dashboard v2.0</p>
              <p>Fast Delivery System</p>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          className="bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
            <motion.h2
              key={currentLabel}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-foreground"
            >
              {currentLabel}
            </motion.h2>
          </div>
          <motion.div
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </motion.div>
        </motion.header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
      </body>
    </html>
  )
}

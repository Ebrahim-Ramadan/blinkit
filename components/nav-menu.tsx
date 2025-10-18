"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const tabs = [
  { id: "products", label: "Products", href: "/products" },
  { id: "suppliers", label: "Suppliers", href: "/suppliers" },
  { id: "analytics", label: "Analytics", href: "/analytics" },
  { id: "feedbacks", label: "Feedback", href: "/feedbacks" },
]

export default function NavMenu() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const currentTab = tabs.find((t) => pathname.startsWith(t.href))

  const handleNavigation = (href: string) => {
    router.push(href)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Desktop Dropdown Menu */}
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="animate-in fade-in duration-300 bg-transparent">
              {currentTab?.label || "Menu"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 animate-in fade-in zoom-in-95 duration-200">
            {tabs.map((tab) => (
              <DropdownMenuItem
                key={tab.id}
                onClick={() => handleNavigation(tab.href)}
                className={`cursor-pointer transition-colors ${pathname.startsWith(tab.href) ? "bg-accent" : ""}`}
              >
                {tab.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Sheet Menu */}
      <div className="sm:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 animate-in fade-in duration-300">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 animate-in slide-in-from-right duration-300">
            <div className="space-y-2 mt-8">
              {tabs.map((tab, index) => (
                <Button
                  key={tab.id}
                  variant={pathname.startsWith(tab.href) ? "default" : "ghost"}
                  className="w-full justify-start animate-in fade-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleNavigation(tab.href)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

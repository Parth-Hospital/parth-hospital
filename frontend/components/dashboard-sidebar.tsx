"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { clearAuthSession } from "@/lib/auth"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { NavigationItem } from "@/lib/config/navigation"

interface DashboardSidebarProps {
  role: "employee" | "owner" | "manager" | "accountant" | "receptionist"
  navItems: (NavigationItem & { active?: boolean })[]
}

export function DashboardSidebar({ role, navItems }: DashboardSidebarProps) {
  const [open, setOpen] = useState(false) // Mobile menu state
  const [collapsed, setCollapsed] = useState(false) // Desktop collapse state
  const router = useRouter()

  // Load collapsed state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar_collapsed")
      if (saved !== null) {
        setCollapsed(saved === "true")
      }
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newCollapsed = !collapsed
    setCollapsed(newCollapsed)
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar_collapsed", String(newCollapsed))
      // Dispatch custom event to notify layout components
      window.dispatchEvent(new Event("sidebar-toggle"))
    }
  }

  const handleLogout = () => {
    clearAuthSession()
    router.push("/login")
  }

  const sidebarWidth = collapsed ? "w-16" : "w-64"

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-white border border-border rounded-lg shadow-sm"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen ${sidebarWidth} bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className={`p-6 border-b border-sidebar-border ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-sidebar-primary">Parth Hospital</h1>
                <p className="text-xs text-sidebar-foreground/60 mt-1 capitalize">{role} Portal</p>
              </div>
            )}
            {collapsed && (
              <div className="mx-auto">
                <h1 className="text-lg font-bold text-sidebar-primary">PH</h1>
              </div>
            )}
            {/* Desktop collapse button */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex p-1.5 rounded-md hover:bg-sidebar-accent/10 text-sidebar-foreground transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        <nav className={`p-4 space-y-2 ${collapsed ? "px-2" : ""}`}>
          <TooltipProvider>
            {navItems.map((item) => {
              const IconComponent = item.icon
              const content = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <IconComponent size={20} className="flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      {content}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return content
            })}
          </TooltipProvider>
        </nav>

        <div className={`absolute bottom-6 ${collapsed ? "left-2 right-2" : "left-4 right-4"}`}>
          <Button
            variant="outline"
            size="sm"
            className={`w-full flex items-center gap-2 bg-transparent ${collapsed ? "justify-center px-2" : ""}`}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

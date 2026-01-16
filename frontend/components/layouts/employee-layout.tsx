"use client"

import { ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { getNavigationForRole, getDashboardTitle } from "@/lib/config/navigation"
import { UserRole } from "@/lib/auth"

interface EmployeeLayoutProps {
  children: ReactNode
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const pathname = usePathname()
  const role: UserRole = "employee"
  const navItems = getNavigationForRole(role).map((item) => {
    // For base routes (like /dashboard/employee), only match exactly
    // For sub-routes, match if pathname starts with href
    const baseRoute = `/${pathname.split("/").slice(1, 3).join("/")}`
    const isBaseRoute = item.href === baseRoute
    const isActive = isBaseRoute
      ? pathname === item.href // Exact match for base route
      : pathname.startsWith(item.href + "/") || pathname === item.href // Starts with for sub-routes
    return {
      ...item,
      active: isActive,
    }
  })
  const { title, subtitle } = getDashboardTitle(role)

  // Get sidebar width from localStorage (default 256px = 64 in Tailwind)
  const [sidebarWidth, setSidebarWidth] = useState("lg:ml-64")
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize from localStorage
      const updateSidebarWidth = () => {
        const isCollapsed = localStorage.getItem("sidebar_collapsed") === "true"
        setSidebarWidth(isCollapsed ? "lg:ml-16" : "lg:ml-64")
      }
      
      // Set initial value
      updateSidebarWidth()
      
      // Listen for custom event (same-tab updates)
      window.addEventListener("sidebar-toggle", updateSidebarWidth)
      
      // Listen for storage changes (cross-tab updates)
      window.addEventListener("storage", updateSidebarWidth)
      
      return () => {
        window.removeEventListener("sidebar-toggle", updateSidebarWidth)
        window.removeEventListener("storage", updateSidebarWidth)
      }
    }
  }, [])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar role={role} navItems={navItems} />
      <div 
        className={`flex-1 ${sidebarWidth} flex flex-col min-h-0`}
        data-lenis-prevent
      >
        <DashboardHeader title={title} subtitle={subtitle} role={role} />
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">{children}</div>
        </div>
      </div>
    </div>
  )
}


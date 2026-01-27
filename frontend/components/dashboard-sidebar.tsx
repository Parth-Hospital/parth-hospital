"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { clearAuthSession } from "@/lib/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavigationItem } from "@/lib/config/navigation";
import { useToast } from "@/hooks/use-toast";

interface DashboardSidebarProps {
  role: "employee" | "doctor" | "manager" | "accountant" | "receptionist";
  navItems: (NavigationItem & { active?: boolean })[];
}

export function DashboardSidebar({ role, navItems }: DashboardSidebarProps) {
  const [open, setOpen] = useState(false); // Mobile menu state
  const [collapsed, setCollapsed] = useState(false); // Desktop collapse state
  const router = useRouter();
  const { toast } = useToast();

  // Load collapsed state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar_collapsed", String(newCollapsed));
      // Dispatch custom event to notify layout components
      window.dispatchEvent(new Event("sidebar-toggle"));
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    toast({
      title: "Success",
      description: "You have been logged out successfully",
    });
    router.push("/login");
  };

  return (
    <>
      {/* Mobile menu button - only show when sidebar is closed */}
      {!open && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 bg-white border border-border rounded-lg shadow-sm"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 ${
          collapsed ? "lg:w-16" : "lg:w-64"
        } bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        {/* Header - Fixed at top */}
        <div
          className={`p-4 lg:p-6 border-b border-sidebar-border flex-shrink-0 ${collapsed && !open ? "px-2" : ""}`}
        >
          <div className="flex items-center justify-between gap-3">
            {(!collapsed || open) && (
              <div className="flex-1 min-w-0 pr-4 lg:pr-2">
                <h1 className="text-lg lg:text-xl font-bold text-sidebar-primary truncate">
                  Parth Hospital
                </h1>
                <p className="text-xs text-sidebar-foreground/60 mt-1 capitalize truncate">
                  {role} Portal
                </p>
              </div>
            )}
            {/* Only show PH when collapsed on desktop (hidden on mobile when closed) */}
            {collapsed && !open && (
              <div className="mx-auto hidden lg:block">
                <h1 className="text-lg font-bold text-sidebar-primary">PH</h1>
              </div>
            )}
            {/* Mobile close button - only show on mobile when sidebar is open */}
            {open && (
              <button
                onClick={() => setOpen(false)}
                className="lg:hidden p-1.5 rounded-md hover:bg-sidebar-accent/10 text-sidebar-foreground transition-colors flex-shrink-0"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            )}
            {/* Desktop collapse button - only show on desktop */}
            {!open && (
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-1.5 rounded-md hover:bg-sidebar-accent/10 text-sidebar-foreground transition-colors flex-shrink-0"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Scrollable navigation area */}
        <nav
          className={`flex-1 overflow-y-auto p-4 space-y-2 ${collapsed && !open ? "px-2" : ""}`}
        >
          <TooltipProvider>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              // On mobile (lg breakpoint), when sidebar is open, always show full width with labels
              // On desktop, respect collapsed state - show icons even when collapsed
              const isMobileOpen = open;
              const showLabel = !collapsed || isMobileOpen;

              const content = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                  } ${collapsed && !isMobileOpen ? "justify-center px-2" : ""} ${
                    // On mobile, only show when sidebar is open. On desktop, always show.
                    isMobileOpen ? "" : "hidden lg:flex"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <IconComponent size={20} className="flex-shrink-0" />
                  {showLabel && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );

              // Show tooltip on desktop when collapsed (icons only)
              // On mobile when open, show full content without tooltip
              if (collapsed && !isMobileOpen) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return content;
            })}
          </TooltipProvider>
        </nav>

        {/* Logout button - Fixed at bottom */}
        <div
          className={`p-4 border-t border-sidebar-border flex-shrink-0 ${collapsed && !open ? "px-2" : ""}`}
        >
          <Button
            variant="outline"
            size="sm"
            className={`w-full flex items-center gap-2 bg-transparent ${collapsed && !open ? "justify-center px-2" : ""}`}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            {(!collapsed || open) && <span>Logout</span>}
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
  );
}

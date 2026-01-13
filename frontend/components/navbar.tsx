"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Search, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <span className="truncate">Emergency: +91 78601 15757</span>
            <span className="text-white/60 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Available 24/7</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <a href="tel:+917860115757" className="hover:text-white/80 transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call Us</span>
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300 px-6 py-3 border-b border-border/30",
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          {/* Hospital branding */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-baseline gap-1 sm:gap-2 group transition-transform hover:scale-105"
          >
            <span className="text-xl sm:text-2xl font-bold text-primary transition-colors group-hover:text-secondary">
              Parth
            </span>
            <span className="text-xs sm:text-sm font-semibold text-primary/60 group-hover:text-secondary/60 transition-colors">
              Hospital
            </span>
          </Link>

          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-auto">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search doctors, specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border/50 text-sm bg-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 hover:border-primary/30"
              />
            </div>
          </div>

          {/* Desktop navigation - key sections only */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/services", label: "Services" },
              { href: "/doctor", label: "Doctor" },
              { href: "/gallery", label: "Gallery" },
              { href: "/achievements", label: "Achievements" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium px-4 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-3/4" />
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 bg-transparent transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Link href="/appointment">
              <Button
                size="sm"
                className="bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border/30 bg-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {[
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/doctor", label: "Doctor" },
                { href: "/gallery", label: "Gallery" },
                { href: "/achievements", label: "Achievements" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium py-2 px-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gap-2 bg-primary text-white hover:bg-primary/90">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link href="/appointment" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-secondary text-white hover:bg-secondary/90">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

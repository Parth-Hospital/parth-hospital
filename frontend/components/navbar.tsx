"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, Phone, Search, LogIn, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)

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
            className="flex-shrink-0 flex items-center gap-2 sm:gap-3 group transition-transform hover:scale-105"
          >
            <Image
              src="/Logo/parth-logo-nobg.png"
              alt="Parth Hospital"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-primary transition-colors group-hover:text-secondary leading-tight">
                Parth
              </span>
              <span className="text-xs sm:text-sm font-semibold text-primary/60 group-hover:text-secondary/60 transition-colors leading-tight">
                Hospital
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-auto">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border/50 text-sm bg-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 hover:border-primary/30"
              />
            </div>
          </div>

          {/* Desktop navigation - key sections only */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="text-sm font-medium px-4 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-all duration-200 relative group"
            >
              Home
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-3/4" />
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium px-4 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-all duration-200 relative group"
            >
              About
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-3/4" />
            </Link>
            
            {/* Services Dropdown */}
            <DropdownMenu 
              open={servicesDropdownOpen} 
              onOpenChange={setServicesDropdownOpen}
              modal={false}
            >
              <div
                className="relative"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <DropdownMenuTrigger asChild>
                  <button className="text-sm font-medium px-4 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-all duration-200 relative group flex items-center gap-1">
                    Services
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-3/4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-80 p-4"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  onEscapeKeyDown={(e) => {
                    e.preventDefault()
                    setServicesDropdownOpen(false)
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <DropdownMenuItem asChild className="p-0 h-auto">
                      <Link href="/services" className="flex flex-col items-start justify-start p-4 rounded-lg hover:bg-primary/5 transition-colors w-full h-[100px] border border-border/50 hover:border-primary/30">
                        <span className="font-semibold text-sm mb-1.5">Our Services</span>
                        <span className="text-xs text-muted-foreground leading-relaxed">Medical services & treatments</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0 h-auto">
                      <Link href="/ayushman" className="flex flex-col items-start justify-start p-4 rounded-lg hover:bg-primary/5 transition-colors w-full h-[100px] border border-border/50 hover:border-primary/30">
                        <span className="font-semibold text-sm mb-1.5">Ayushman Scheme</span>
                        <span className="text-xs text-muted-foreground leading-relaxed">Government health scheme</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0 h-auto">
                      <Link href="/wards" className="flex flex-col items-start justify-start p-4 rounded-lg hover:bg-primary/5 transition-colors w-full h-[100px] border border-border/50 hover:border-primary/30">
                        <span className="font-semibold text-sm mb-1.5">Wards</span>
                        <span className="text-xs text-muted-foreground leading-relaxed">Patient accommodation</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0 h-auto">
                      <Link href="/amenities" className="flex flex-col items-start justify-start p-4 rounded-lg hover:bg-primary/5 transition-colors w-full h-[100px] border border-border/50 hover:border-primary/30">
                        <span className="font-semibold text-sm mb-1.5">Amenities</span>
                        <span className="text-xs text-muted-foreground leading-relaxed">Hospital facilities</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </div>
            </DropdownMenu>

            {[
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
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <Link
                href="/"
                className="text-sm font-medium py-2 px-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium py-2 px-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="space-y-1">
                <div className="text-sm font-semibold px-2 py-1 text-muted-foreground">Services</div>
                <Link
                  href="/services"
                  className="text-sm font-medium py-2 px-4 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Our Services
                </Link>
                <Link
                  href="/ayushman"
                  className="text-sm font-medium py-2 px-4 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ayushman Scheme
                </Link>
                <Link
                  href="/wards"
                  className="text-sm font-medium py-2 px-4 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wards
                </Link>
                <Link
                  href="/amenities"
                  className="text-sm font-medium py-2 px-4 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Amenities
                </Link>
              </div>
              {[
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

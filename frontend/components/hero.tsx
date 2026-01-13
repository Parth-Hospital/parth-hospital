"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, MapPin, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { doctorAvailabilityApi } from "@/lib/api/doctorAvailability"

export function Hero() {
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("Available Today - 11 AM to 5 PM")
  const [loadingAvailability, setLoadingAvailability] = useState(true)

  useEffect(() => {
    const checkTodayAvailability = async () => {
      try {
        setLoadingAvailability(true)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStr = today.toISOString().split("T")[0]

        const availability = await doctorAvailabilityApi.getAvailability(todayStr)
        // Default to available if no record exists
        const isAvailable = availability?.available !== false

        if (isAvailable) {
          setAvailabilityMessage("Available Today - 11 AM to 5 PM")
        } else {
          setAvailabilityMessage("Not Available Today")
        }
      } catch (error) {
        // Default to available on error
        setAvailabilityMessage("Available Today - 11 AM to 5 PM")
      } finally {
        setLoadingAvailability(false)
      }
    }

    checkTodayAvailability()
  }, [])

  return (
    <section className="relative pt-28 pb-12 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Patient-focused content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Availability badge - CRITICAL for patient urgency */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {loadingAvailability ? (
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              ) : (
                <span className="relative flex h-2 w-2">
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
              )}
              <span className="text-sm font-medium text-secondary">{availabilityMessage}</span>
            </motion.div>

            {/* Headline - answers: what treatment is provided? */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Orthopedic Care
                <span className="block text-secondary">You Can Trust</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Advanced bone and joint care by Dr. Subash Singh with 20+ years of specialized experience. Fracture
                management, joint replacement, and orthopedic surgery all in one place.
              </p>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 group">
                <Check className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">20+ Years Experience</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Check className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">10,000+ Successful Cases</span>
              </div>
            </motion.div>

            {/* Primary CTAs - clear action hierarchy */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/appointment">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-foreground/20 rounded-lg text-foreground hover:bg-foreground/5 hover:text-foreground bg-transparent hover:border-primary/40 transition-all"
                onClick={() => {
                  const address = encodeURIComponent("Parth Hospital, Polytechnic chauraha, Jaunpur, Uttar Pradesh 222002")
                  window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank")
                }}
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </Button>
            </motion.div>

            {/* Contact quick link */}
            <motion.div
              className="pt-4 border-t border-border/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-muted-foreground mb-2">Need immediate help?</p>
              <a href="tel:+917860115757">
                <Button
                  variant="ghost"
                  className="text-primary font-semibold p-0 h-auto hover:bg-transparent hover:text-secondary transition-colors"
                >
                  Call Hospital: +91 78601 15757
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Hospital imagery with soft overlay */}
          <motion.div
            className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/modern-orthopedic-hospital-surgical-room.jpg"
              alt="Parth Hospital Orthopedic Facility"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/20 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

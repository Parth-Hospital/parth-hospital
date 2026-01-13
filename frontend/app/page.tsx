"use client"

import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { DoctorHighlight } from "@/components/doctor-highlight"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { QuickAccessCards } from "@/components/quick-access-cards"
import { TrustMetrics } from "@/components/trust-metrics"
import ServicesMarquee from "@/components/services-marquee"
import { GoogleReviews } from "@/components/google-reviews"
import { FloatingActions } from "@/components/floating-actions"
import { MagicCard, MagicCardTitle, MagicCardDescription } from "@/components/ui/magic-card"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustMetrics />
      <FloatingActions />
      <ServicesMarquee />
      <QuickAccessCards />

      <section className="py-20 bg-supporting-light/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Why Choose Parth Hospital?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trusted orthopedic care with modern facilities and experienced medical professionals
              </p>
            </motion.div>
          </div>

          <div className="space-y-24 md:space-y-32">
            {/* Advanced Equipment - Image Left, Text Right */}
            <motion.div
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/equip.png"
                  alt="Advanced Medical Equipment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">Advanced Equipment</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  State-of-the-art surgical theaters and diagnostic equipment ensuring the highest standards of medical care and precision in every procedure.
                </p>
              </div>
            </motion.div>

            {/* Expert Team - Text Left, Image Right */}
            <motion.div
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="space-y-4 md:order-1 order-2">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">Expert Team</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Dr. Subash Singh and experienced orthopedic specialists dedicated to providing compassionate, personalized care with years of expertise.
                </p>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl md:order-2 order-1">
                <Image
                  src="/team.png"
                  alt="Expert Medical Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            {/* 24/7 Availability - Image Left, Text Right */}
            <motion.div
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/avail.png"
                  alt="24/7 Availability"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">24/7 Availability</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Emergency services and round-the-clock patient care ensuring you receive immediate medical attention whenever you need it.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90 opacity-50" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3">Ready to Book Your Consultation?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Get expert orthopedic care from Dr. Subash Singh. Call or book your appointment online now.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/appointment">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 hover:text-primary rounded-lg px-10 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
              >
                Book Appointment
              </Button>
            </Link>
            <a href="tel:+917860115757">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 hover:text-white rounded-lg bg-transparent hover:border-white/80 transition-all"
              >
                Call: +91 78601 15757
              </Button>
            </a>
          </div>
        </div>
      </section>

      <DoctorHighlight />

      <GoogleReviews />

      <Footer />
    </main>
  )
}

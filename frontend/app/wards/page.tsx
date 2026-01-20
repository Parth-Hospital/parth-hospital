"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { Bed, Users, Heart, Shield, Wifi, Utensils, Lock, Home, Shirt, Church } from "lucide-react"
import { motion } from "framer-motion"

export default function WardsPage() {
  const wards = [
    {
      name: "General Ward",
      description: "Comfortable shared accommodation with essential amenities for patients requiring standard care.",
      capacity: "Multiple beds",
      features: ["24/7 Nursing Care", "Regular Monitoring", "Clean & Hygienic", "Affordable Rates"],
      icon: Bed,
    },
    {
      name: "Semi-Private Ward",
      description: "Shared room with 2-3 beds, offering more privacy and comfort than general wards.",
      capacity: "2-3 beds per room",
      features: ["Private Space", "Attached Bathroom", "TV & Entertainment", "Visitor Facilities"],
      icon: Users,
    },
    {
      name: "Private Ward",
      description: "Single occupancy rooms with premium amenities for patients seeking privacy and comfort.",
      capacity: "Single bed",
      features: ["Complete Privacy", "Premium Amenities", "Dedicated Attendant", "Luxury Facilities"],
      icon: Heart,
    },
    {
      name: "ICU/CCU",
      description: "Intensive Care Units equipped with advanced monitoring systems for critical patients.",
      capacity: "Specialized care",
      features: ["24/7 Monitoring", "Advanced Equipment", "Expert Medical Team", "Life Support Systems"],
      icon: Shield,
    },
  ]

  const amenities = [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Utensils, name: "Nutritious Meals" },
    { icon: Lock, name: "24/7 Security" },
    { icon: Home, name: "Housekeeping Services" },
    { icon: Shirt, name: "Laundry Services" },
    { icon: Church, name: "Prayer Room" },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Patient Accommodation
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary leading-tight mb-6">
              Hospital Wards
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comfortable and well-equipped patient accommodation designed for your comfort and recovery. 
              We offer various ward options to suit your needs and preferences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wards Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {wards.map((ward, index) => {
              const Icon = ward.icon
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-8 border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{ward.name}</h3>
                      <p className="text-sm text-muted-foreground">{ward.capacity}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{ward.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {ward.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-supporting-light/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Ward Amenities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All our wards are equipped with modern amenities to ensure your comfort during your stay
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {Icon && (
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  )}
                  <p className="font-medium text-sm">{amenity.name}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Booking Info */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Ward Booking</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ward allocation is based on availability and medical requirements. Our staff will assist you 
              in choosing the most suitable accommodation option during your admission process.
            </p>
            <p className="text-muted-foreground">
              For more information about ward availability and booking, please contact our reception at{" "}
              <a href="tel:+917860115757" className="text-primary font-semibold hover:underline">
                +91 78601 15757
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

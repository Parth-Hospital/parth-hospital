"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import {
  ParkingCircle,
  Wifi,
  Utensils,
  Car,
  Phone,
  Coffee,
  ShoppingBag,
  Heart,
  Shield,
  FileText,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"

export default function AmenitiesPage() {
  const amenities = [
    {
      category: "Parking & Transportation",
      items: [
        { icon: ParkingCircle, name: "Free Parking", description: "Ample parking space for patients and visitors" },
        { icon: Car, name: "Ambulance Service", description: "24/7 ambulance service for emergencies" },
      ],
    },
    {
      category: "Food & Dining",
      items: [
        { icon: Utensils, name: "Cafeteria", description: "Fresh and nutritious meals available" },
        { icon: Coffee, name: "Tea & Snacks", description: "Refreshments available throughout the day" },
      ],
    },
    {
      category: "Communication & Connectivity",
      items: [
        { icon: Wifi, name: "Free WiFi", description: "High-speed internet access throughout the hospital" },
        { icon: Phone, name: "Phone Services", description: "Public phone facilities available" },
      ],
    },
    {
      category: "Shopping & Convenience",
      items: [
        { icon: ShoppingBag, name: "Medical Store", description: "In-house pharmacy for medicines and supplies" },
        { icon: FileText, name: "Documentation Help", description: "Assistance with medical reports and documents" },
      ],
    },
    {
      category: "Support Services",
      items: [
        { icon: Heart, name: "Counseling Services", description: "Patient counseling and support services" },
        { icon: Users, name: "Visitor Facilities", description: "Comfortable waiting areas for visitors" },
        { icon: Shield, name: "Security", description: "24/7 security services for patient safety" },
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Hospital Facilities
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary leading-tight mb-6">
              Hospital Amenities
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide a wide range of amenities and facilities to ensure your comfort and convenience 
              during your visit to Parth Hospital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Amenities by Category */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {amenities.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="mb-16 last:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-8">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={itemIndex}
                      className="bg-white rounded-xl p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 bg-supporting-light/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Your Comfort is Our Priority</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              At Parth Hospital, we continuously strive to enhance our facilities and services to provide 
              you with the best possible experience. Our amenities are designed to make your stay as 
              comfortable and convenient as possible.
            </p>
            <p className="text-muted-foreground">
              For any specific requirements or assistance, please contact our reception at{" "}
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

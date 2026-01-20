"use client"

import { Stethoscope, AlertCircle, Scale as Scalpel, Zap, Heart, Droplets, Scan, Microscope } from "lucide-react"
import { motion } from "framer-motion"

export function QuickAccessCards() {
  const services = [
    {
      icon: Stethoscope,
      title: "OPD Consultation",
      description: "Schedule with Dr. Subash Singh for orthopedic evaluation",
      color: "bg-primary",
    },
    {
      icon: AlertCircle,
      title: "Emergency Care",
      description: "24/7 trauma and emergency orthopedic services",
      color: "bg-red-600",
    },
    {
      icon: Scalpel,
      title: "Surgery Booking",
      description: "Advanced orthopedic and surgical procedures",
      color: "bg-secondary",
    },
    {
      icon: Zap,
      title: "X-Ray Services",
      description: "Digital X-ray for bone and joint imaging",
      color: "bg-blue-600",
    },
    {
      icon: Scan,
      title: "Imaging & Diagnostics",
      description: "CT Scan, MRI, and advanced diagnostic imaging",
      color: "bg-indigo-600",
    },
    {
      icon: Droplets,
      title: "Blood Tests",
      description: "Complete blood work and hematology services",
      color: "bg-red-500",
    },
    {
      icon: Microscope,
      title: "Pathology Services",
      description: "Laboratory testing and tissue analysis",
      color: "bg-purple-600",
    },
    {
      icon: Heart,
      title: "Physiotherapy",
      description: "Post-surgery rehabilitation and recovery care",
      color: "bg-orange-500",
    },
  ]

  return (
    <section className="py-16 bg-supporting-light/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Our Services</h2>
          <p className="text-muted-foreground text-lg">Quick access to hospital services and facilities</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={`service-${service.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="group bg-white border border-border/50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:scale-105 hover:border-primary/50">
                  <div
                    className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground grow leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

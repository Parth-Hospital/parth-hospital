"use client"

import { motion } from "framer-motion"
import { MagicCard, MagicCardTitle, MagicCardDescription } from "@/components/ui/magic-card"

export function TrustMetrics() {
  const metrics = [
    {
      number: "20+",
      label: "Years of Experience",
      description: "Dr. Subash Singh's orthopedic expertise",
      gradient: "from-primary/20 via-primary/10 to-secondary/20",
    },
    {
      number: "10,000+",
      label: "Successful Procedures",
      description: "Bone, joint, and trauma surgeries",
      gradient: "from-secondary/20 via-secondary/10 to-primary/20",
    },
    {
      number: "5,000+",
      label: "Happy Patients",
      description: "Lives improved and transformed",
      gradient: "from-primary/20 via-accent/20 to-secondary/20",
    },
    {
      number: "24/7",
      label: "Emergency Care",
      description: "Always available for urgent cases",
      gradient: "from-accent/20 via-primary/20 to-secondary/20",
    },
  ]

  return (
    <section className="py-20 bg-white border-b border-border/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <MagicCard gradientColor={metric.gradient} className="h-full text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors duration-300">
                  {metric.number}
                </div>
                <MagicCardTitle className="text-base mb-1">{metric.label}</MagicCardTitle>
                <MagicCardDescription className="text-xs">{metric.description}</MagicCardDescription>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

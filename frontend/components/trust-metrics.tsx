"use client"

import { motion } from "framer-motion"
import { MagicCard, MagicCardTitle, MagicCardDescription } from "@/components/ui/magic-card"
import { NumberTicker } from "@/components/ui/number-ticker"

export function TrustMetrics() {
  const metrics = [
    {
      value: 20,
      suffix: "+",
      label: "Years of Experience",
      description: "Dr. Subash Singh's orthopedic expertise",
      gradient: "from-primary/20 via-primary/10 to-secondary/20",
    },
    {
      value: 10000,
      suffix: "+",
      label: "Successful Procedures",
      description: "Bone, joint, and trauma surgeries",
      gradient: "from-secondary/20 via-secondary/10 to-primary/20",
    },
    {
      value: 5000,
      suffix: "+",
      label: "Happy Patients",
      description: "Lives improved and transformed",
      gradient: "from-primary/20 via-accent/20 to-secondary/20",
    },
    {
      value: null,
      suffix: "",
      staticText: "24/7",
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
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors duration-300 break-words overflow-hidden">
                  {metric.value !== null ? (
                    <span className="inline-flex items-baseline flex-wrap justify-center gap-0.5">
                      <NumberTicker
                        value={metric.value}
                        delay={index * 0.2}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary group-hover:text-secondary transition-colors duration-300"
                      />
                      <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">{metric.suffix}</span>
                    </span>
                  ) : (
                    <span className="break-words">{metric.staticText}</span>
                  )}
                </div>
                <MagicCardTitle className="text-sm sm:text-base mb-1 break-words">{metric.label}</MagicCardTitle>
                <MagicCardDescription className="text-xs break-words">{metric.description}</MagicCardDescription>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

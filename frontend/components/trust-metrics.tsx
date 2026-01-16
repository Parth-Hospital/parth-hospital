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
    <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <MagicCard gradientColor={metric.gradient} className="h-full text-center p-4 sm:p-6">
                <div className="min-h-[60px] sm:min-h-[80px] md:min-h-[100px] flex items-center justify-center mb-2 sm:mb-3">
                  {metric.value !== null ? (
                    <span className="inline-flex items-baseline justify-center gap-0.5 sm:gap-1 whitespace-nowrap">
                      <NumberTicker
                        value={metric.value}
                        delay={index * 0.2}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary group-hover:text-secondary transition-colors duration-300"
                      />
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary group-hover:text-secondary transition-colors duration-300 leading-none">{metric.suffix}</span>
                    </span>
                  ) : (
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary group-hover:text-secondary transition-colors duration-300 whitespace-nowrap leading-none">{metric.staticText}</span>
                  )}
                </div>
                <MagicCardTitle className="text-xs sm:text-sm md:text-base mb-1 wrap-break-word">{metric.label}</MagicCardTitle>
                <MagicCardDescription className="text-[10px] sm:text-xs wrap-break-word leading-tight">{metric.description}</MagicCardDescription>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

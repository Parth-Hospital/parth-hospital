"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagicCardProps {
  children: ReactNode
  className?: string
  gradientColor?: string
}

export function MagicCard({ children, className, gradientColor = "from-primary/20 via-secondary/20 to-primary/20" }: MagicCardProps) {
  return (
    <div className={cn("group relative overflow-hidden rounded-xl border border-border/50 bg-background p-6", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100", gradientColor)} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function MagicCardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-xl font-semibold text-foreground mb-2", className)}>{children}</h3>
}

export function MagicCardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}


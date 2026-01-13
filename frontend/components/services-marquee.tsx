"use client"

import { useEffect, useRef, useState } from "react"

const SERVICES = [
  "OPD Consultation",
  "Operation Theatre",
  "X-Ray Services",
  "Imaging & Diagnostics",
  "Blood Tests",
  "Pathology Services",
  "Physiotherapy",
  "Emergency & First Aid",
  "Joint Replacement",
  "Fracture Care",
]

export default function ServicesMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const velocityRef = useRef(0)
  const positionRef = useRef(0)
  const decayTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const decayIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    if (reducedMotion || !marqueeRef.current) return

    const handleScroll = () => {
      // Increase velocity on scroll
      velocityRef.current = 3
      setScrollVelocity(3)

      // Clear existing timers
      clearTimeout(decayTimeoutRef.current!)
      clearInterval(decayIntervalRef.current!)

      // Start decay after a brief delay
      decayTimeoutRef.current = setTimeout(() => {
        let current = velocityRef.current
        decayIntervalRef.current = setInterval(() => {
          current *= 0.92
          if (current < 0.05) {
            current = 0
            clearInterval(decayIntervalRef.current!)
          }
          velocityRef.current = current
          setScrollVelocity(current)
        }, 16)
      }, 100)
    }

    window.addEventListener("wheel", handleScroll, { passive: true })
    document.addEventListener("touchmove", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("wheel", handleScroll)
      document.removeEventListener("touchmove", handleScroll)
      clearTimeout(decayTimeoutRef.current!)
      clearInterval(decayIntervalRef.current!)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || !marqueeRef.current) return

    let animationFrameId: number
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      if (marqueeRef.current) {
        const deltaTime = currentTime - lastTime
        lastTime = currentTime

        // Base speed (pixels per frame at 60fps)
        const baseSpeed = 0.8
        // Additional speed from scroll velocity
        const totalSpeed = baseSpeed + velocityRef.current

        // Update position
        positionRef.current += totalSpeed * (deltaTime / 16)

        // Get the width of one set of services for seamless looping
        const marqueeWidth = marqueeRef.current.scrollWidth / 2

        // Reset position when we've scrolled past one full set
        if (positionRef.current >= marqueeWidth) {
          positionRef.current -= marqueeWidth
        }

        marqueeRef.current.style.transform = `translateX(-${positionRef.current}px)`
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [reducedMotion])

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-slate-50 via-white to-slate-50 py-8 border-y border-slate-200">
      <div className="relative flex">
        <div ref={marqueeRef} className="flex gap-8 whitespace-nowrap will-change-transform">
          {[...SERVICES, ...SERVICES].map((service, idx) => (
            <div
              key={`${service}-${idx}`}
              className="inline-flex items-center gap-4 text-lg font-medium text-slate-700 px-6"
            >
              <span>{service}</span>
              <span className="text-blue-600">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
"use client"

import { useEffect, type ReactNode } from "react"
import { shouldReduceMotion } from "@/lib/motion"

interface MotionProviderProps {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  useEffect(() => {
    const initLenis = async () => {
      try {
        const Lenis = (await import("@studio-freight/lenis")).default
        const lenis = new Lenis({
          lerp: 0.08,
          smoothWheel: true,
          infinite: false,
          orientation: "vertical",
          gestureOrientation: "vertical",
          ...(shouldReduceMotion() ? { lerp: 0 } : {}),
        })

        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
          lenis.destroy()
        }
      } catch (error) {
        console.error("Lenis initialization failed:", error)
      }
    }

    const initGSAP = async () => {
      try {
        const gsap = (await import("gsap")).default
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default

        gsap.registerPlugin(ScrollTrigger)
      } catch (error) {
        console.error("GSAP plugins initialization failed:", error)
      }
    }

    initLenis()
    initGSAP()
  }, [])

  return <>{children}</>
}

"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function Preloader() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

  // Only show preloader on home page
  const isHomePage = pathname === "/"

  useEffect(() => {
    // Don't show preloader if not on home page
    if (!isHomePage) {
      setIsLoading(false)
      return
    }

    // Check if page is already loaded
    if (document.readyState === "complete") {
      setPageLoaded(true)
    } else {
      const handleLoad = () => {
        setPageLoaded(true)
      }
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [isHomePage])

  useEffect(() => {
    // Animation completes after all elements are shown (around 2.5 seconds)
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2500)

    return () => clearTimeout(animationTimer)
  }, [])

  useEffect(() => {
    // Hide preloader when animation completes AND page is loaded
    if (animationComplete && pageLoaded && isHomePage) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [animationComplete, pageLoaded, isHomePage])

  // Don't render preloader if not on home page
  if (!isHomePage) {
    return null
  }

  const primaryColor = "#0E4B8F"

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {/* Medical Plus Logo */}
          <div className="relative mb-8">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Horizontal line */}
              <motion.rect
                x="20"
                y="50"
                width="80"
                height="20"
                rx="10"
                fill={primaryColor}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ transformOrigin: "center" }}
              />
              {/* Vertical line */}
              <motion.rect
                x="50"
                y="20"
                width="20"
                height="80"
                rx="10"
                fill={primaryColor}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                style={{ transformOrigin: "center" }}
              />
              {/* Subtle pulse animation after drawing */}
              <motion.circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke={primaryColor}
                strokeWidth="2"
                opacity="0.2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div>

          {/* Parth Hospital Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
            className="text-center"
          >
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: primaryColor, fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Parth Hospital
            </h1>
            <motion.div
              className="mt-2 h-1"
              style={{ backgroundColor: primaryColor }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 0.3 }}
              transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            />
          </motion.div>

          {/* Subtle loading dots */}
          <motion.div
            className="flex gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: primaryColor }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

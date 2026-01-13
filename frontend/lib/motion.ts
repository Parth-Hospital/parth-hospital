// Motion utilities and configuration for healthcare UI animations
// Respects prefers-reduced-motion for accessibility

export const shouldReduceMotion = () => {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Framer Motion animation variants for consistent healthcare-focused motion
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
}

export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export const staggerContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Card hover animation - subtle elevation
export const cardHoverVariants = {
  rest: { y: 0, boxShadow: "0 20px 50px -15px rgba(15, 23, 42, 0.08)" },
  hover: {
    y: -4,
    boxShadow: "0 30px 60px -15px rgba(15, 23, 42, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

// Button click animation
export const buttonTapVariants = {
  tap: { scale: 0.96 },
}

// ScrollTrigger helper for GSAP animations
export const gsapScrollConfig = {
  trigger: undefined as Element | undefined,
  start: "top 80%",
  end: "top 20%",
  toggleActions: "play none none reverse",
  markers: false,
}

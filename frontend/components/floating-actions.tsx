"use client"

import { useState } from "react"
import { Phone, Headphones, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AssistantBot } from "./assistant-bot"

export function FloatingActions() {
  const [isBotOpen, setIsBotOpen] = useState(false)

  return (
    <>
      {/* Bot Button - Bottom Left */}
      <motion.button
        onClick={() => setIsBotOpen(!isBotOpen)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 ${
          isBotOpen ? "bg-primary text-white" : "bg-primary text-white"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Support Assistant"
      >
        {isBotOpen ? <X className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
      </motion.button>

      {/* Call Button - Bottom Right */}
      <motion.a
        href="tel:+917860115757"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-secondary text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Call Hospital"
      >
        <Phone className="w-6 h-6" />
      </motion.a>

      {/* Bot Widget */}
      <AnimatePresence>
        {isBotOpen && <AssistantBot onClose={() => setIsBotOpen(false)} />}
      </AnimatePresence>
    </>
  )
}


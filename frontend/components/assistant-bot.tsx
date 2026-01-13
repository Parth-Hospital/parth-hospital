"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Phone, MapPin, Clock, Mail, Calendar, Stethoscope, User, MessageCircle, X } from "lucide-react"
import botMenuData from "@/lib/data/bot-menu.json"
import { useRouter } from "next/navigation"

interface AssistantBotProps {
  onClose: () => void
}

interface MenuItem {
  id: string
  label: string
  icon?: string
  action?: string
  href?: string
  phone?: string
  email?: string
  message?: string
  submenu?: MenuItem[]
}

interface ChatMessage {
  type: "user" | "bot"
  content: string
  timestamp: Date
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  stethoscope: Stethoscope,
  "user-md": User,
  phone: Phone,
  clock: Clock,
  "map-pin": MapPin,
  mail: Mail,
}

export function AssistantBot({ onClose }: AssistantBotProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuItem[]>(botMenuData.mainMenu)
  const [menuStack, setMenuStack] = useState<MenuItem[][]>([])
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const router = useRouter()

  const handleItemClick = (item: MenuItem) => {
    if (item.submenu && item.submenu.length > 0) {
      // Navigate to submenu
      setMenuStack([...menuStack, currentMenu])
      setCurrentMenu(item.submenu)
    } else if (item.action === "navigate" && item.href) {
      router.push(item.href)
      onClose()
    } else if (item.action === "call" && item.phone) {
      window.location.href = `tel:${item.phone}`
    } else if (item.action === "email" && item.email) {
      window.location.href = `mailto:${item.email}`
    } else if (item.action === "info" && item.message) {
      // Show message in chat instead of alert
      setChatMessages([
        { type: "user", content: item.label, timestamp: new Date() },
        { type: "bot", content: item.message, timestamp: new Date() },
      ])
      setShowChat(true)
    }
  }

  const handleBack = () => {
    if (showChat) {
      setShowChat(false)
      setChatMessages([])
    } else if (menuStack.length > 0) {
      const previousMenu = menuStack[menuStack.length - 1]
      setMenuStack(menuStack.slice(0, -1))
      setCurrentMenu(previousMenu)
    } else {
      onClose()
    }
  }

  const Icon = ({ name }: { name?: string }) => {
    if (!name) return null
    const IconComponent = iconMap[name] || ChevronRight
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-24 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Hospital Assistant</h3>
            <p className="text-xs text-white/80">How can I help you?</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Back Button */}
      {(menuStack.length > 0 || showChat) && (
        <button
          onClick={handleBack}
          className="w-full px-4 py-3 text-left text-sm text-primary hover:bg-primary/5 flex items-center gap-2 border-b border-border/50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Chat View */}
      {showChat ? (
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === "user"
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Menu View */
        <div className="max-h-96 overflow-y-auto">
          <div className="p-2">
            {currentMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="w-full px-4 py-3 text-left hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Icon name={item.icon} />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
                {item.submenu && item.submenu.length > 0 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border/50 p-3 bg-muted/30">
        <p className="text-xs text-center text-muted-foreground">
          Need immediate help? Call{" "}
          <a href="tel:+917860115757" className="text-primary font-semibold hover:underline">
            +91 78601 15757
          </a>
        </p>
      </div>
    </motion.div>
  )
}


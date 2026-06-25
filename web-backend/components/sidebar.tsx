"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Home,
  BookOpen,
  Zap,
  Cpu,
  CircuitBoardIcon as Circuit,
  Lightbulb,
  Gauge,
  ChevronRight,
  ChevronLeft,
  User,
  Settings,
  LogIn,
} from "lucide-react"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("home")

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sidebarItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home", id: "home", href: "/" },
    { icon: <BookOpen className="h-5 w-5" />, label: "Experiments", id: "experiments", href: "#experiments" },
    { icon: <Zap className="h-5 w-5" />, label: "Ohm's Law", id: "ohms-law", href: "/experiments/1" },
    { icon: <Circuit className="h-5 w-5" />, label: "RC Circuits", id: "rc-circuits", href: "/experiments/2" },
    { icon: <Cpu className="h-5 w-5" />, label: "Digital Logic", id: "digital-logic", href: "/experiments/8" },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      label: "Power Electronics",
      id: "power-electronics",
      href: "/experiments/10",
    },
    { icon: <Gauge className="h-5 w-5" />, label: "Measurements", id: "measurements", href: "#measurements" },
    { icon: <User className="h-5 w-5" />, label: "About", id: "about", href: "#about" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", id: "settings", href: "#settings" },
    { icon: <LogIn className="h-5 w-5" />, label: "Sign Up", id: "signup", href: "/signup" },
  ]

  return (
    <>
      <motion.div
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-black/30 backdrop-blur-md border-r border-white/10",
          isOpen ? "w-64" : "w-16",
        )}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white font-bold"
            >
              EEE Learning
            </motion.div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-2 px-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  activeItem === item.id
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <div>{item.icon}</div>
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}


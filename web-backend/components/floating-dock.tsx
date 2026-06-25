"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, BookOpen, User, Settings, LogIn } from "lucide-react"

export function FloatingDock() {
  const [activeIndex, setActiveIndex] = useState(0)

  const dockItems = [
    { icon: <Home className="h-6 w-6" />, label: "Home", href: "/" },
    { icon: <BookOpen className="h-6 w-6" />, label: "Experiments", href: "#experiments" },
    { icon: <User className="h-6 w-6" />, label: "About", href: "#about" },
    { icon: <Settings className="h-6 w-6" />, label: "Settings", href: "#settings" },
    { icon: <LogIn className="h-6 w-6" />, label: "Sign Up", href: "/signup" },
  ]

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex items-center justify-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 shadow-lg"
      >
        {dockItems.map((item, index) => (
          <DockItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={activeIndex === index}
            setActive={() => setActiveIndex(index)}
          />
        ))}
      </motion.div>
    </div>
  )
}

function DockItem({ icon, label, href, isActive, setActive }) {
  return (
    <Link href={href} onClick={setActive}>
      <motion.div
        className="relative flex flex-col items-center justify-center mx-2 cursor-pointer group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full",
            isActive ? "bg-blue-100" : "bg-transparent hover:bg-blue-50",
          )}
        >
          <div className={cn("text-blue-500", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")}>
            {icon}
          </div>
        </motion.div>
        <motion.span
          className="absolute -bottom-6 text-xs text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </Link>
  )
}


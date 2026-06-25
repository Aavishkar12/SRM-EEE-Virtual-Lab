"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Create the context with proper types
interface SidebarContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
}

export const SidebarProvider = ({ open, setOpen, children, ...rest }: SidebarProps & { [key: string]: unknown }) => {
  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>
}

export const Sidebar = ({ open, setOpen, children }: SidebarProps) => {
  return (
    <div className="relative">
      <motion.aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-neutral-950 border-r border-neutral-800 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {children}
      </motion.aside>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export const SidebarBody = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn("flex flex-col h-full", className)}>{children}</div>
}

export const SidebarLink = ({ link }: { link: { label: string; href: string; icon: React.ReactNode } }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={link.href}
      className="group relative flex items-center space-x-2 rounded-md p-3 hover:bg-neutral-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {link.icon}
      <span className="text-sm font-medium text-white group-hover:text-blue-400">{link.label}</span>
    </Link>
  )
}


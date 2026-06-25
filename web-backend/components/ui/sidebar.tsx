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
  hovered: boolean
  setHovered: (hovered: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
  hovered: false,
  setHovered: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
}

<<<<<<< HEAD
export const SidebarProvider = ({ open: openProp, setOpen: setOpenProp, children }: SidebarProps) => {
  const [openState, setOpenState] = useState(false)
  const [hovered, setHovered] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = openProp !== undefined ? setOpenProp : setOpenState

  return (
    <SidebarContext.Provider value={{ open, setOpen, hovered, setHovered }}>
      {children}
    </SidebarContext.Provider>
  )
=======
export const SidebarProvider = ({ open, setOpen, children, ...rest }: SidebarProps & { [key: string]: unknown }) => {
  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>
>>>>>>> 0767c26ba23cca4037905bf5444f09b20b77d1d5
}

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const { open, setOpen, hovered, setHovered } = useSidebar()

  return (
    <div className="relative">
      <motion.aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col bg-neutral-950 border-r border-neutral-800 transition-all duration-300 ease-in-out",
          // Mobile:
          "max-md:w-64 max-md:fixed",
          open ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          // Desktop:
          "md:translate-x-0",
          (open || hovered) ? "md:w-64" : "md:w-16"
        )}
      >
        {children}
      </motion.aside>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
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
  const { open, hovered } = useSidebar()
  const isExpanded = open || hovered

  return (
    <Link
      href={link.href}
      className="group relative flex items-center space-x-3 rounded-md p-3 hover:bg-neutral-800/60 transition-colors"
    >
      <div className="flex-shrink-0 text-neutral-400 group-hover:text-blue-400 transition-colors">
        {link.icon}
      </div>
      {isExpanded && (
        <span className="text-sm font-medium text-white group-hover:text-blue-400 whitespace-nowrap overflow-hidden">
          {link.label}
        </span>
      )}
    </Link>
  )
}



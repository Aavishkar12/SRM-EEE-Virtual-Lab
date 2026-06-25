"use client"
import { cn } from "@/lib/utils"
import type React from "react"

import { AnimatePresence, type MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Link from "next/link"
import { useRef, useState } from "react"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"

export type DockItem = { title: string; icon: React.ReactNode; href: string; onClick?: () => void }

export const FloatingDock = ({
  items,
  className,
  desktopClassName,
  mobileClassName,
}: {
  items: DockItem[]
  className?: string
  desktopClassName?: string
  mobileClassName?: string
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName ?? className} />
      <FloatingDockMobile items={items} className={mobileClassName ?? className} />
    </>
  )
}

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItem[]
  className?: string
}) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn("relative block md:hidden", className)}>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 ring-1 ring-neutral-700/80 transition hover:bg-neutral-800"
      >
        <motion.div animate={open ? { rotate: 90 } : { rotate: 0 }} transition={{ duration: 0.2 }}>
          <Menu className="h-5 w-5 text-neutral-300" />
        </motion.div>
      </button>

      {/* Dropdown menu — expands downward */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-1/2 top-full z-50 mt-2 w-48 -translate-x-1/2 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/50"
            >
              {items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href))
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={(e) => {
                      setOpen(false)
                      if (item.onClick) { e.preventDefault(); item.onClick() }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                      isActive
                        ? "bg-blue-600/10 text-blue-300"
                        : "text-neutral-300 hover:bg-neutral-800/80 hover:text-white"
                    )}
                  >
                    <span className={cn("h-4 w-4 shrink-0", isActive ? "text-blue-400" : "text-neutral-500")}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.title}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                    )}
                  </Link>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: DockItem[]
  className?: string
}) => {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const pathname = usePathname()
  
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn(
        "mx-auto hidden md:flex h-12 gap-2 items-end rounded-2xl bg-gray-50 dark:bg-neutral-900/90 backdrop-blur-sm px-3 pb-2",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/' && pathname?.startsWith(item.href));
        
        return (
          <IconContainer
            mouseX={mouseX}
            key={item.title}
            isActive={isActive}
            title={item.title}
            icon={item.icon}
            href={item.href}
            onClick={item.onClick}
          />
        );
      })}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  isActive,
  onClick,
}: {
  mouseX: MotionValue
  title: string
  icon: React.ReactNode
  href: string
  isActive?: boolean
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }

    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-100, 0, 100], [35, 60, 35])
  const heightTransform = useTransform(distance, [-100, 0, 100], [35, 60, 35])

  const widthTransformIcon = useTransform(distance, [-100, 0, 100], [18, 30, 18])
  const heightTransformIcon = useTransform(distance, [-100, 0, 100], [18, 30, 18])

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  })
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  })

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  })
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  })

  const [hovered, setHovered] = useState(false)

  return (
    <Link href={href} onClick={onClick ? (e) => { e.preventDefault(); onClick() } : undefined}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "aspect-square rounded-full flex items-center justify-center relative transition-all duration-300",
          isActive 
            ? "bg-blue-500 dark:bg-blue-600 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400 dark:ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-black" 
            : "bg-gray-200 dark:bg-neutral-800"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -4, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -4, x: "-50%" }}
              transition={{ duration: 0.12 }}
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-neutral-700/60 bg-neutral-900/95 px-2.5 py-1 text-xs font-medium text-white shadow-xl backdrop-blur-sm pointer-events-none z-50"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div 
          style={{ width: widthIcon, height: heightIcon }} 
          className={cn(
            "flex items-center justify-center",
            isActive ? "text-white" : ""
          )}
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  )
}


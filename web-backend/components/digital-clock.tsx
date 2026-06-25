"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function DigitalClock() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, "0")
    const m = date.getMinutes().toString().padStart(2, "0")
    const s = date.getSeconds().toString().padStart(2, "0")
    return `${h}:${m}:${s}`
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  if (!time) return null

  return (
    <motion.div
      className="fixed top-3 right-4 z-50 flex flex-col items-end gap-1.5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl border border-blue-500/25 bg-black/70 px-3 py-1.5 shadow-lg shadow-blue-500/10 backdrop-blur-md sm:px-4 sm:py-2">
        <span className="font-mono text-xs font-semibold tracking-[0.15em] text-blue-300 sm:text-sm sm:tracking-[0.2em]">
          {formatTime(time)}
        </span>
      </div>
      <div className="hidden sm:block rounded-lg border border-neutral-800/80 bg-neutral-950/80 px-3 py-1.5 text-right backdrop-blur-sm">
        <p className="text-[11px] font-medium tracking-wide text-neutral-300">
          {formatDate(time)}
        </p>
      </div>
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { Sparkles } from "lucide-react"
import { getStudentDisplayName } from "@/lib/auth"

export function WelcomeGreeting() {
  const { data: session, status } = useSession()

  if (status !== "authenticated" || !session?.user?.email) {
    return null
  }

  const displayName = getStudentDisplayName(session.user)
  const subtitle = session.user.department || session.user.program || "SRM Student"

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="fixed top-[4.5rem] left-4 z-40 max-w-xs hidden sm:block sm:left-20 md:left-20"
    >
      <div className="rounded-2xl border border-blue-500/15 bg-black/40 px-4 py-2.5 backdrop-blur-md shadow-lg shadow-blue-500/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-400" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Welcome, <span className="text-blue-300">{displayName}</span>
            </p>
            <p className="truncate text-[11px] text-neutral-500">{subtitle}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

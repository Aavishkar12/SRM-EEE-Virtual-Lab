"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Clock, BarChart2 } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

interface GlowingCardProps {
  children?: React.ReactNode
  className?: string
  href: string
  experimentId: number
  title: string
  description: string
  category?: string
  difficulty?: string
  duration?: string
  icon?: React.ReactNode
}

const difficultyConfig = {
  Beginner: { class: "badge-beginner", label: "Beginner" },
  Intermediate: { class: "badge-intermediate", label: "Intermediate" },
  Advanced: { class: "badge-advanced", label: "Advanced" },
}

const categoryColors: Record<string, string> = {
  "Circuit Analysis": "text-blue-400 bg-blue-900/20 border-blue-500/20",
  "Electrical Installation": "text-yellow-400 bg-yellow-900/20 border-yellow-500/20",
  "Power Electronics": "text-purple-400 bg-purple-900/20 border-purple-500/20",
  "Electronics": "text-cyan-400 bg-cyan-900/20 border-cyan-500/20",
  "Digital Electronics": "text-green-400 bg-green-900/20 border-green-500/20",
  "Electrical Machines": "text-orange-400 bg-orange-900/20 border-orange-500/20",
}

export function GlowingCard({
  href,
  experimentId,
  title,
  description,
  category = "General",
  difficulty = "Intermediate",
  duration = "60 min",
  icon,
}: GlowingCardProps) {
  const diffConfig = difficultyConfig[difficulty as keyof typeof difficultyConfig] || difficultyConfig.Intermediate
  const catColor = categoryColors[category] || "text-blue-400 bg-blue-900/20 border-blue-500/20"

  return (
    <li className="min-h-[13rem] list-none experiment-card">
      <Link href={href}>
        <div className="relative h-full rounded-2xl border border-neutral-800/80 p-[1px] transition-all duration-300 hover:border-blue-500/40">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-5 shadow-xl">
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-sm">
                  {experimentId}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${catColor}`}>
                  {category}
                </span>
              </div>
              <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${diffConfig.class}`}>
                {difficulty}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1.5 leading-tight">
                {title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-800/60">
              <div className="flex items-center gap-1 text-neutral-500 text-xs">
                <Clock className="h-3.5 w-3.5" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-xs font-medium group-hover:gap-2 transition-all">
                <span>Start Lab</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-blue-500/5 to-transparent" />
          </div>
        </div>
      </Link>
    </li>
  )
}

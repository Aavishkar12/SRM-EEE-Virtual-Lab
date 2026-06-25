"use client"
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"
import { NavDock } from "@/components/nav-dock"
import { DigitalClock } from "@/components/digital-clock"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AIAssistantPage() {
  return (
    <div className="h-screen overflow-hidden bg-[#050508] text-white selection:bg-blue-500/30">
      <NavDock />
      <DigitalClock />

      <div className="absolute top-[4.5rem] left-3 z-30 sm:left-4">
        <Link
          href="/study-room"
          className="inline-flex items-center text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Study Room
        </Link>
      </div>

      <div className="h-full w-full">
        <AnimatedAIChat />
      </div>
    </div>
  )
}

"use client"
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"
import { DynamicSidebar } from "@/components/dynamic-sidebar"
import { DigitalClock } from "@/components/digital-clock"
import { SrmAccessGate } from "@/components/srm-access-gate"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AIAssistantPage() {
  return (
    <SrmAccessGate
      title="AI Lab Assistant Access"
      description="The AI Lab Assistant is restricted to signed-in SRM EEE users. Please sign in with your @srmist.edu.in email to continue."
    >
      <div className="text-white selection:bg-blue-500/30 selection:text-blue-200">
        <DynamicSidebar />
        <DigitalClock />

        <main className="h-[75vh] flex flex-col relative pl-0 md:pl-16">
          <div className="absolute top-0 left-4 z-50">
            <Link href="/study-room" className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Study Room
            </Link>
          </div>
          
          {/* The Animated AI Chat component */}
          <div className="flex-1 flex w-full mt-8">
              <AnimatedAIChat />
          </div>
        </main>
      </div>
    </SrmAccessGate>
  )
}

"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface TinkercadEmbedProps {
  embedId: string
  title: string
}

export function TinkercadEmbed({ embedId, title }: TinkercadEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Format the embed URL
  const embedUrl = `https://www.tinkercad.com/embed/${embedId}?editbtn=1`

  return (
    <div className="relative w-full min-h-[280px] h-[45vh] sm:h-[50vh] max-h-[560px] rounded-lg overflow-hidden border border-neutral-800">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-neutral-400">Loading simulation...</p>
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        title={title}
        onLoad={() => setIsLoading(false)}
        className="bg-white"
      ></iframe>
    </div>
  )
}


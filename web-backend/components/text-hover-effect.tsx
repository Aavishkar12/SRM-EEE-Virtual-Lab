"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function TextHoverEffect({
  words,
  className,
}: {
  words: string
  className?: string
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const wordsArray = words.split(" ")

  return (
    <div className={cn("text-center", className)}>
      {wordsArray.map((word, idx) => (
        <React.Fragment key={idx}>
          <span
            className="relative inline-block cursor-pointer transition-transform duration-200 ease-in-out"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {word.split("").map((char, charIdx) => (
              <motion.span
                key={charIdx}
                className="inline-block"
                animate={{
                  y: hoveredIndex === idx ? -10 : 0,
                  color: hoveredIndex === idx ? "#60a5fa" : "#ffffff",
                  scale: hoveredIndex === idx ? 1.2 : 1,
                }}
                transition={{
                  duration: 0.2,
                  delay: charIdx * 0.05,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>{" "}
        </React.Fragment>
      ))}
    </div>
  )
}


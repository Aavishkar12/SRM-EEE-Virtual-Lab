"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function TextGenerateEffect({ words }: { words: string }) {
  const [generatedText, setGeneratedText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [startGeneration, setStartGeneration] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleScroll = () => {
      if (window.scrollY < 100 && !startGeneration) {
        setStartGeneration(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    if (startGeneration && !isGenerating) {
      setIsGenerating(true)
      let i = 0
      const interval = setInterval(() => {
        setGeneratedText(words.slice(0, i))
        i++
        if (i > words.length) {
          clearInterval(interval)
          setIsGenerating(false)
        }
      }, 30)
    }

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [words, isGenerating, startGeneration])

  return (
    <div className="text-neutral-700 max-w-3xl mx-auto">
      <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {generatedText}
        {isGenerating && (
          <motion.span
            className="inline-block w-1 h-5 ml-1 bg-blue-400"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </motion.div>
    </div>
  )
}


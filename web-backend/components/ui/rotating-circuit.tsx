"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"

export const RotatingCircuit = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      rotateY: 360,
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      },
    })
  }, [controls])

  return (
    <div ref={containerRef} className="absolute left-10 bottom-40 md:left-20 lg:left-40 z-10 hidden md:block perspective-800">
      <motion.div
        animate={controls}
        className="relative w-32 h-32 lg:w-48 lg:h-48"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg border border-blue-500 shadow-lg" style={{ backfaceVisibility: "hidden" }}>
          {/* Circuit pattern */}
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-blue-400 rounded-md"></div>
          <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-blue-300 rounded-md"></div>
          <div className="absolute top-[45%] left-[45%] w-[10%] h-[10%] bg-blue-300 rounded-full"></div>
          
          {/* Horizontal lines */}
          <div className="absolute top-1/4 left-0 w-1/4 h-[2px] bg-blue-400"></div>
          <div className="absolute top-3/4 left-0 w-1/4 h-[2px] bg-blue-400"></div>
          <div className="absolute top-1/4 right-0 w-1/4 h-[2px] bg-blue-400"></div>
          <div className="absolute top-3/4 right-0 w-1/4 h-[2px] bg-blue-400"></div>
          
          {/* Vertical lines */}
          <div className="absolute top-0 left-1/4 w-[2px] h-1/4 bg-blue-400"></div>
          <div className="absolute bottom-0 left-1/4 w-[2px] h-1/4 bg-blue-400"></div>
          <div className="absolute top-0 right-1/4 w-[2px] h-1/4 bg-blue-400"></div>
          <div className="absolute bottom-0 right-1/4 w-[2px] h-1/4 bg-blue-400"></div>
          
          {/* Circuit nodes */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-200 rounded-full"></div>
        </div>
        
        {/* Back face */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg border border-blue-500 shadow-lg" 
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {/* Different circuit pattern for back */}
          <div className="absolute inset-4 border border-blue-400 rounded-md"></div>
          <div className="absolute inset-8 border border-blue-300 rounded-md"></div>
          <div className="absolute top-[45%] left-[45%] w-[10%] h-[10%] bg-blue-300 rounded-full"></div>
          
          {/* Diagonal lines */}
          <div className="absolute top-0 left-0 w-1/2 h-[2px] bg-blue-400 origin-top-left rotate-45"></div>
          <div className="absolute top-0 right-0 w-1/2 h-[2px] bg-blue-400 origin-top-right -rotate-45"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-[2px] bg-blue-400 origin-bottom-left -rotate-45"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-[2px] bg-blue-400 origin-bottom-right rotate-45"></div>
          
          {/* Circuit nodes */}
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-blue-200 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-blue-200 rounded-full"></div>
        </div>
      </motion.div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse"></div>
    </div>
  )
}
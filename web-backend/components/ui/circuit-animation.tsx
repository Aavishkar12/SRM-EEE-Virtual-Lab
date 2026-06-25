"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

export const CircuitAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { 
          type: "spring", 
          duration: 1.5, 
          bounce: 0, 
          delay: i * 0.05 
        },
        opacity: { duration: 0.2, delay: i * 0.05 }
      }
    })
  }

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { 
        type: "spring", 
        duration: 0.5, 
        bounce: 0.5, 
        delay: 0.8 + i * 0.1 
      }
    })
  }

  const pulseVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        delay: i * 0.2,
        ease: "easeInOut"
      }
    })
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden">
      <svg
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-40"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Horizontal Lines */}
        <motion.path
          d="M100,200 H900"
          stroke="#4C7894"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={0}
        />
        <motion.path
          d="M100,300 H900"
          stroke="#4C7894"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={1}
        />
        <motion.path
          d="M100,400 H900"
          stroke="#4C7894"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={2}
        />

        {/* Vertical Lines */}
        <motion.path
          d="M200,100 V500"
          stroke="#4C7894"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={3}
        />
        <motion.path
          d="M400,100 V500"
          stroke="#4C7894"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={4}
        />
        <motion.path
          d="M600,100 V500"
          stroke="#4C7894"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={5}
        />
        <motion.path
          d="M800,100 V500"
          stroke="#4C7894"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={6}
        />

        {/* Diagonal Lines */}
        <motion.path
          d="M200,200 L400,300"
          stroke="#5a922c"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={7}
        />
        <motion.path
          d="M400,300 L600,200"
          stroke="#5a922c"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={8}
        />
        <motion.path
          d="M600,200 L800,300"
          stroke="#5a922c"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={9}
        />
        <motion.path
          d="M200,400 L400,300"
          stroke="#5a922c"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={10}
        />
        <motion.path
          d="M600,400 L800,300"
          stroke="#5a922c"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={11}
        />

        {/* Curved Lines */}
        <motion.path
          d="M400,200 C450,150 550,150 600,200"
          stroke="#dd7bbb"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={12}
        />
        <motion.path
          d="M400,400 C450,450 550,450 600,400"
          stroke="#dd7bbb"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={13}
        />

        {/* Circuit Nodes */}
        <motion.circle
          cx="200"
          cy="200"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={0}
        />
        <motion.circle
          cx="200"
          cy="300"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={1}
        />
        <motion.circle
          cx="200"
          cy="400"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={2}
        />
        <motion.circle
          cx="400"
          cy="200"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={3}
        />
        <motion.circle
          cx="400"
          cy="300"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={4}
        />
        <motion.circle
          cx="400"
          cy="400"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={5}
        />
        <motion.circle
          cx="600"
          cy="200"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={6}
        />
        <motion.circle
          cx="600"
          cy="300"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={7}
        />
        <motion.circle
          cx="600"
          cy="400"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={8}
        />
        <motion.circle
          cx="800"
          cy="200"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={9}
        />
        <motion.circle
          cx="800"
          cy="300"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={10}
        />
        <motion.circle
          cx="800"
          cy="400"
          r="6"
          fill="#d79f1e"
          variants={nodeVariants}
          initial="hidden"
          animate={controls}
          custom={11}
        />

        {/* Pulse Effects */}
        <motion.circle
          cx="400"
          cy="300"
          r="15"
          fill="none"
          stroke="#4C7894"
          strokeWidth="2"
          variants={pulseVariants}
          initial="hidden"
          animate={controls}
          custom={0}
        />
        <motion.circle
          cx="600"
          cy="300"
          r="15"
          fill="none"
          stroke="#5a922c"
          strokeWidth="2"
          variants={pulseVariants}
          initial="hidden"
          animate={controls}
          custom={1}
        />
        <motion.circle
          cx="800"
          cy="300"
          r="15"
          fill="none"
          stroke="#dd7bbb"
          strokeWidth="2"
          variants={pulseVariants}
          initial="hidden"
          animate={controls}
          custom={2}
        />

        {/* Electronic Components */}
        {/* Resistor */}
        <motion.path
          d="M300,200 H320 L325,190 L335,210 L345,190 L355,210 L365,190 L375,210 L380,200 H400"
          stroke="#d79f1e"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={14}
        />
        
        {/* Capacitor */}
        <motion.path
          d="M300,300 H350 M350,280 V320 M370,280 V320 M370,300 H420"
          stroke="#d79f1e"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={15}
        />
        
        {/* Inductor */}
        <motion.path
          d="M300,400 H320 C330,400 330,390 340,390 C350,390 350,400 360,400 C370,400 370,390 380,390 C390,390 390,400 400,400"
          stroke="#d79f1e"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={16}
        />
        
        {/* Diode */}
        <motion.path
          d="M700,200 H730 L750,180 L750,220 L770,200 H800"
          stroke="#dd7bbb"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={17}
        />
        <motion.path
          d="M750,180 L750,220"
          stroke="#dd7bbb"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={18}
        />
        
        {/* Transistor */}
        <motion.path
          d="M700,400 H730 L750,380 L750,420"
          stroke="#dd7bbb"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={19}
        />
        <motion.path
          d="M750,380 L770,360 H800"
          stroke="#dd7bbb"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={20}
        />
        <motion.path
          d="M750,420 L770,440 H800"
          stroke="#dd7bbb"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={21}
        />
        <motion.circle
          cx="745"
          cy="400"
          r="20"
          fill="none"
          stroke="#dd7bbb"
          strokeWidth="1"
          variants={pathVariants}
          initial="hidden"
          animate={controls}
          custom={22}
        />
      </svg>
    </div>
  )
}

export const ElectronicWaves = () => {
  return (
    <div className="absolute inset-0 z-5 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Sine Wave */}
          <motion.div 
            className="absolute top-1/4 left-0 w-full h-12 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 1200 50" preserveAspectRatio="none">
              <motion.path
                d="M0,25 C100,50 150,0 250,25 C350,50 400,0 500,25 C600,50 650,0 750,25 C850,50 900,0 1000,25 C1100,50 1150,0 1250,25"
                fill="none"
                stroke="#4C7894"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  pathOffset: [0, 1]
                }}
                transition={{ 
                  pathLength: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 0.5 },
                  pathOffset: { 
                    repeat: Infinity, 
                    duration: 5, 
                    ease: "linear" 
                  }
                }}
              />
            </svg>
          </motion.div>

          {/* Square Wave */}
          <motion.div 
            className="absolute top-2/4 left-0 w-full h-12 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 1200 50" preserveAspectRatio="none">
              <motion.path
                d="M0,25 H100 V0 H300 V50 H500 V0 H700 V50 H900 V0 H1100 V50 H1200"
                fill="none"
                stroke="#5a922c"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  pathOffset: [0, 1]
                }}
                transition={{ 
                  pathLength: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 0.5, delay: 0.3 },
                  pathOffset: { 
                    repeat: Infinity, 
                    duration: 7, 
                    ease: "linear",
                    delay: 0.3
                  }
                }}
              />
            </svg>
          </motion.div>

          {/* Triangle Wave */}
          <motion.div 
            className="absolute top-3/4 left-0 w-full h-12 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 1200 50" preserveAspectRatio="none">
              <motion.path
                d="M0,25 L100,0 L200,50 L300,0 L400,50 L500,0 L600,50 L700,0 L800,50 L900,0 L1000,50 L1100,0 L1200,50"
                fill="none"
                stroke="#dd7bbb"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  pathOffset: [0, 1]
                }}
                transition={{ 
                  pathLength: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 0.5, delay: 0.6 },
                  pathOffset: { 
                    repeat: Infinity, 
                    duration: 6, 
                    ease: "linear",
                    delay: 0.6
                  }
                }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export const ElectronicsBackground = () => {
  return (
    <>
      <ElectronicWaves />
      <CircuitAnimation />
    </>
  )
}
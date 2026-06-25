"use client"
import { NavDock } from "@/components/nav-dock"
import { useState, useEffect, useRef } from "react"
import { notFound, useParams } from "next/navigation"
import { SrmAccessGate } from "@/components/srm-access-gate"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, Trophy, AlertCircle, Zap, Cpu, Lightbulb, Bolt, Radio, Wifi, ShieldAlert, Pencil } from "lucide-react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { DigitalClock } from "@/components/digital-clock"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { AuroraBackground } from "@/components/aurora-background"
import { cn } from "@/lib/utils"
import confetti from 'canvas-confetti'
import { useSession } from "next-auth/react"
import { apiUrl } from "@/lib/api"

// Animated circuit component for quiz page
const CircuitDiagram = ({ quizId }: { quizId: number }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })
  
  // Different circuit diagrams based on quiz type
  const getCircuitPath = () => {
    switch(quizId) {
      case 1: // KVL
        return (
          <>
            {/* KVL Circuit */}
            <motion.path
              d="M100,200 H200 L250,150 H350 L400,200 H500"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Battery */}
            <motion.path
              d="M100,180 V160 M100,240 V220 M100,160 H80 M100,240 H80"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Resistors */}
            <motion.path
              d="M250,150 L260,130 L270,170 L280,130 L290,170 L300,130 L310,170 L320,130 L330,170 L340,150"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            
            {/* Voltage labels */}
            <motion.circle cx="100" cy="200" r="5" fill="#3B82F6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            />
            <motion.circle cx="250" cy="150" r="5" fill="#3B82F6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: 1.3 }}
            />
            <motion.circle cx="400" cy="200" r="5" fill="#3B82F6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: 1.4 }}
            />
            
            {/* Current flow animation */}
            <motion.circle
              cx="0"
              cy="0"
              r="3"
              fill="#60A5FA"
              animate={{
                cx: [100, 200, 250, 350, 400, 500],
                cy: [200, 200, 150, 150, 200, 200],
                scale: [1, 1, 1, 1, 1, 1],
              }}
              transition={{
                duration: 3,
                ease: "linear",
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                repeat: Infinity,
                repeatType: "loop",
                delay: 1.5
              }}
            />
          </>
        )
      case 2: // Thevenin
        return (
          <>
            {/* Thevenin Circuit */}
            <motion.path
              d="M100,200 H200 M300,200 H400 M400,200 V300 H100 V200"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Voltage Source */}
            <motion.path
              d="M100,180 V160 M100,240 V220 M100,160 H80 M100,240 H80"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Thevenin Resistance */}
            <motion.path
              d="M200,200 L210,180 L220,220 L230,180 L240,220 L250,180 L260,220 L270,180 L280,220 L290,200"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            
            {/* Load Resistance */}
            <motion.path
              d="M250,300 L260,280 L270,320 L280,280 L290,320 L300,280 L310,320 L320,280 L330,320 L340,300"
              stroke="#8B5CF6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 1 }}
            />
            
            {/* Circuit nodes */}
            <motion.circle cx="100" cy="200" r="5" fill="#8B5CF6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            />
            <motion.circle cx="400" cy="200" r="5" fill="#8B5CF6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: 1.3 }}
            />
            <motion.circle cx="100" cy="300" r="5" fill="#8B5CF6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: 1.4 }}
            />
            <motion.circle cx="400" cy="300" r="5" fill="#8B5CF6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: 1.5 }}
            />
          </>
        )
      case 10: // House Wiring
        return (
          <>
            {/* House Wiring Circuit */}
            <motion.path
              d="M100,150 H400 M100,250 H400 M150,150 V250 M250,150 V250 M350,150 V250"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Switches */}
            <motion.path
              d="M150,180 L180,150"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
            <motion.path
              d="M250,180 L280,150"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            />
            <motion.path
              d="M350,180 L380,150"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
            
            {/* Lights */}
            <motion.circle cx="150" cy="250" r="10" stroke="#10B981" strokeWidth="2" fill="none"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
            <motion.circle cx="250" cy="250" r="10" stroke="#10B981" strokeWidth="2" fill="none"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            />
            <motion.circle cx="350" cy="250" r="10" stroke="#10B981" strokeWidth="2" fill="none"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            />
            
            {/* Light glow animation */}
            <motion.circle cx="150" cy="250" r="15" fill="#10B981" 
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.8 }}
            />
            <motion.circle cx="250" cy="250" r="15" fill="#10B981" 
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            />
            <motion.circle cx="350" cy="250" r="15" fill="#10B981" 
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2.2 }}
            />
          </>
        )
      case 11: // Fluorescent Lamp
        return (
          <>
            {/* Fluorescent Lamp Circuit */}
            <motion.path
              d="M100,200 H150 M350,200 H400 M400,200 V300 H100 V200"
              stroke="#FBBF24"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Lamp */}
            <motion.path
              d="M150,200 H350"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            
            {/* Ballast */}
            <motion.path
              d="M200,300 L210,280 L220,320 L230,280 L240,320 L250,280 L260,320 L270,280 L280,320 L290,300"
              stroke="#FBBF24"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 1 }}
            />
            
            {/* Starter */}
            <motion.circle cx="350" cy="300" r="10" stroke="#FBBF24" strokeWidth="2" fill="none"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
            
            {/* Lamp glow animation */}
            <motion.rect x="150" y="190" width="200" height="20" fill="#FBBF24" rx="5"
              animate={{ opacity: [0, 0.5, 0.3, 0.6, 0.2, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
          </>
        )
      case 12: // Staircase Wiring
        return (
          <>
            {/* Staircase Wiring Circuit */}
            <motion.path
              d="M100,150 H400 M100,250 H400 M150,150 V250 M350,150 V250"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Two-way switches */}
            <motion.path
              d="M150,180 L180,150 M150,220 L180,250"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
            <motion.path
              d="M350,180 L320,150 M350,220 L320,250"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
            
            {/* Light */}
            <motion.circle cx="250" cy="200" r="15" stroke="#EF4444" strokeWidth="2" fill="none"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
            
            {/* Light glow animation */}
            <motion.circle cx="250" cy="200" r="25" fill="#EF4444" 
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
            
            {/* Stair steps */}
            <motion.path
              d="M120,300 H180 V320 H240 V340 H300 V360 H360"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            />
          </>
        )
      case 4: // Full Wave Rectifier
        return (
          <>
            {/* Full Wave Rectifier Circuit */}
            <motion.path
              d="M100,200 H150 M350,200 H400 M250,100 V300 M250,100 H150 V300 H250 M250,100 H350 V300 H250"
              stroke="#06B6D4"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Diodes */}
            <motion.path
              d="M180,150 L200,130 L200,170 Z"
              stroke="#06B6D4"
              strokeWidth="2"
              fill="#06B6D4"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
            <motion.path
              d="M180,250 L200,230 L200,270 Z"
              stroke="#06B6D4"
              strokeWidth="2"
              fill="#06B6D4"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            <motion.path
              d="M320,150 L300,130 L300,170 Z"
              stroke="#06B6D4"
              strokeWidth="2"
              fill="#06B6D4"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            />
            <motion.path
              d="M320,250 L300,230 L300,270 Z"
              stroke="#06B6D4"
              strokeWidth="2"
              fill="#06B6D4"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            />
            
            {/* AC Source */}
            <motion.path
              d="M100,200 C120,170 140,230 160,200"
              stroke="#06B6D4"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            />
            
            {/* Load */}
            <motion.path
              d="M350,180 L360,160 L370,200 L380,160 L390,200 L400,180"
              stroke="#06B6D4"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            />
            
            {/* Current flow animation */}
            <motion.circle
              cx="0"
              cy="0"
              r="3"
              fill="#06B6D4"
              animate={{
                cx: [100, 150, 200, 250, 300, 350, 400],
                cy: [200, 200, 150, 100, 150, 200, 200],
                opacity: [0, 1, 1, 1, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                ease: "linear",
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
                repeat: Infinity,
                repeatType: "loop",
                delay: 1.5
              }}
            />
          </>
        )
      default:
        return null
    }
  }
  
  return (
    <div ref={containerRef} className="w-full h-64 my-8 opacity-70">
      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {getCircuitPath()}
      </svg>
    </div>
  )
}

// Animated electron flow background
const ElectronFlowBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
      <svg
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Horizontal lines */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.path
            key={`h-${i}`}
            d="M0,200 H1000"
            stroke="#4C7894"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ y: i * 150 }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        
        {/* Vertical lines */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.path
            key={`v-${i}`}
            d="M200,0 V1000"
            stroke="#4C7894"
            strokeWidth="1"
            strokeLinecap="round"
            style={{ x: i * 150 }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        
        {/* Electrons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.circle
            key={`e-${i}`}
            cx={i * 150}
            cy={i * 100}
            r="3"
            fill="#60A5FA"
            animate={{
              cx: [i * 150, i * 150 + 300, i * 150],
              cy: [i * 100, i * 100 + 200, i * 100],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Quiz icon component
const QuizIcon = ({ quizId }: { quizId: number }) => {
  const icons = [
    <Zap key="kvl" className="h-8 w-8 text-blue-400" />,
    <Cpu key="thevenin" className="h-8 w-8 text-purple-400" />,
    <Lightbulb key="house" className="h-8 w-8 text-green-400" />,
    <Bolt key="fluorescent" className="h-8 w-8 text-yellow-400" />,
    <Radio key="staircase" className="h-8 w-8 text-red-400" />,
    <Wifi key="rectifier" className="h-8 w-8 text-cyan-400" />
  ]
  
  return icons[quizId - 1] || icons[0]
}

// Get color theme based on quiz ID
const getQuizColorTheme = (quizId: number) => {
  const themes = [
    { bg: "from-blue-900/30 to-blue-900/5", border: "border-blue-500/50", text: "text-blue-400" },
    { bg: "from-purple-900/30 to-purple-900/5", border: "border-purple-500/50", text: "text-purple-400" },
    { bg: "from-green-900/30 to-green-900/5", border: "border-green-500/50", text: "text-green-400" },
    { bg: "from-yellow-900/30 to-yellow-900/5", border: "border-yellow-500/50", text: "text-yellow-400" },
    { bg: "from-red-900/30 to-red-900/5", border: "border-red-500/50", text: "text-red-400" },
    { bg: "from-cyan-900/30 to-cyan-900/5", border: "border-cyan-500/50", text: "text-cyan-400" }
  ]
  
  return themes[quizId - 1] || themes[0]
}

// Quiz data for all experiments
const quizData = [
  // Quiz 1: Kirchhoff's Voltage Law
  {
    id: 1,
    title: "Kirchhoff's Voltage Law Quiz",
    description: "Test your knowledge of voltage relationships in closed loop circuits",
    questions: [
      {
        id: 1,
        question: "What does Kirchhoff's Voltage Law (KVL) state?",
        options: [
          "The sum of all currents entering a node equals the sum of all currents leaving the node",
          "The algebraic sum of all voltages around any closed loop in a circuit must equal zero",
          "The voltage across a resistor is directly proportional to the current flowing through it",
          "The power dissipated in a circuit equals the product of voltage and current"
        ],
        correctAnswer: 1,
        explanation: "Kirchhoff's Voltage Law (KVL) states that the algebraic sum of all voltages around any closed loop in a circuit must equal zero. This is based on the principle of conservation of energy."
      },
      {
        id: 2,
        question: "In a series circuit with three resistors and a 12V battery, if the voltage drops across two resistors are 3V and 5V, what is the voltage drop across the third resistor?",
        options: [
          "4V",
          "7V",
          "12V",
          "15V"
        ],
        correctAnswer: 0,
        explanation: "Using KVL: 12V - 3V - 5V - V₃ = 0, where V₃ is the voltage across the third resistor. Solving for V₃: V₃ = 12V - 3V - 5V = 4V."
      },
      {
        id: 3,
        question: "What is the mathematical expression of Kirchhoff's Voltage Law?",
        options: [
          "∑I = 0",
          "∑V = 0",
          "V = IR",
          "P = VI"
        ],
        correctAnswer: 1,
        explanation: "The mathematical expression of KVL is ∑V = 0, which means the sum of all voltage rises and drops around a closed loop equals zero."
      },
      {
        id: 4,
        question: "Which of the following is NOT a correct application of KVL?",
        options: [
          "Analyzing voltage distribution in a series circuit",
          "Determining unknown voltages in a mesh circuit",
          "Calculating current division in parallel branches",
          "Finding the voltage across an open switch in a circuit"
        ],
        correctAnswer: 2,
        explanation: "Current division in parallel branches is related to Kirchhoff's Current Law (KCL), not Voltage Law (KVL). KVL is used for analyzing voltage relationships in closed loops."
      },
      {
        id: 5,
        question: "When applying KVL, how do you assign polarities to voltage sources?",
        options: [
          "All voltage sources are considered positive",
          "All voltage sources are considered negative",
          "Voltage rise when moving from negative to positive terminal, voltage drop when moving from positive to negative",
          "Voltage drop when moving from negative to positive terminal, voltage rise when moving from positive to negative"
        ],
        correctAnswer: 2,
        explanation: "When applying KVL, you experience a voltage rise when moving from the negative to positive terminal of a source, and a voltage drop when moving from positive to negative terminal."
      },
      {
        id: 6,
        question: "In a circuit with multiple voltage sources, what happens if the sum of voltages around a loop is not zero?",
        options: [
          "The circuit is operating normally",
          "There is an error in measurement or calculation",
          "The circuit contains non-linear components",
          "The circuit is in resonance"
        ],
        correctAnswer: 1,
        explanation: "If the sum of voltages around a loop is not zero, there is likely an error in measurement or calculation. KVL must be satisfied in any closed loop according to the conservation of energy."
      },
      {
        id: 7,
        question: "Which law is KVL derived from?",
        options: [
          "Ohm's Law",
          "Faraday's Law",
          "Conservation of Energy",
          "Conservation of Charge"
        ],
        correctAnswer: 2,
        explanation: "KVL is derived from the principle of conservation of energy. It states that energy cannot be created or destroyed in a closed loop, which translates to the sum of voltage rises and drops being equal to zero."
      },
      {
        id: 8,
        question: "In a circuit with a 9V battery and three identical resistors in series, what is the voltage drop across each resistor?",
        options: [
          "9V",
          "4.5V",
          "3V",
          "1V"
        ],
        correctAnswer: 2,
        explanation: "With three identical resistors in series, the voltage divides equally. Since the total voltage is 9V, each resistor has a voltage drop of 9V ÷ 3 = 3V."
      },
      {
        id: 9,
        question: "When analyzing a circuit using KVL, what is the sign convention for a resistor?",
        options: [
          "Always positive",
          "Always negative",
          "Positive when current flows from higher to lower potential",
          "Negative when current flows from higher to lower potential"
        ],
        correctAnswer: 2,
        explanation: "When analyzing a circuit using KVL, the voltage across a resistor is positive when current flows from higher to lower potential (voltage drop in the direction of current)."
      },
      {
        id: 10,
        question: "How many independent KVL equations can be written for a circuit with n nodes and b branches?",
        options: [
          "n",
          "b",
          "n-1",
          "b-n+1"
        ],
        correctAnswer: 3,
        explanation: "The number of independent KVL equations for a circuit with n nodes and b branches is b-n+1. This represents the number of independent loops in the circuit."
      }
    ]
  },
  // Quiz 2: Thevenin's Theorem
  {
    id: 2,
    title: "Thevenin's Theorem Quiz",
    description: "Challenge yourself on circuit simplification techniques",
    questions: [
      {
        id: 1,
        question: "What does Thevenin's Theorem state?",
        options: [
          "Any linear circuit can be replaced by an equivalent current source in parallel with a resistor",
          "Any linear circuit can be replaced by an equivalent voltage source in series with a resistor",
          "The power delivered to a load is maximum when the load resistance equals the source resistance",
          "The sum of all currents entering a node equals the sum of all currents leaving the node"
        ],
        correctAnswer: 1,
        explanation: "Thevenin's Theorem states that any linear circuit can be replaced by an equivalent circuit consisting of a voltage source (Thevenin voltage) in series with a resistor (Thevenin resistance)."
      },
      {
        id: 2,
        question: "How is the Thevenin voltage (VTH) determined?",
        options: [
          "By measuring the short-circuit current at the load terminals",
          "By measuring the open-circuit voltage at the load terminals",
          "By calculating the voltage drop across the Thevenin resistance",
          "By measuring the voltage across the load"
        ],
        correctAnswer: 1,
        explanation: "The Thevenin voltage (VTH) is determined by measuring or calculating the open-circuit voltage at the load terminals with the load removed from the circuit."
      },
      {
        id: 3,
        question: "How is the Thevenin resistance (RTH) determined?",
        options: [
          "By dividing the open-circuit voltage by the short-circuit current",
          "By measuring the resistance of the load",
          "By deactivating all independent sources and calculating the equivalent resistance looking back into the circuit from the load terminals",
          "By measuring the total resistance of the circuit including the load"
        ],
        correctAnswer: 2,
        explanation: "The Thevenin resistance (RTH) is determined by deactivating all independent sources (replacing voltage sources with short circuits and current sources with open circuits) and calculating the equivalent resistance looking back into the circuit from the load terminals."
      },
      {
        id: 4,
        question: "What is the main advantage of using Thevenin's Theorem?",
        options: [
          "It allows for the analysis of non-linear circuits",
          "It simplifies complex circuits for easier analysis, especially when analyzing the effect of different loads",
          "It eliminates the need for Ohm's Law in circuit analysis",
          "It works for both AC and DC circuits, while other methods only work for DC"
        ],
        correctAnswer: 1,
        explanation: "The main advantage of Thevenin's Theorem is that it simplifies complex circuits for easier analysis, especially when analyzing the effect of different loads. Once the Thevenin equivalent is found, different loads can be analyzed without recalculating the entire circuit."
      },
      {
        id: 5,
        question: "In a Thevenin equivalent circuit, what happens to the load current if the load resistance equals the Thevenin resistance?",
        options: [
          "The load current is maximum",
          "The load current is minimum",
          "The load current is zero",
          "The load current equals the Thevenin voltage"
        ],
        correctAnswer: 0,
        explanation: "When the load resistance equals the Thevenin resistance, maximum power is transferred to the load. This is known as the Maximum Power Transfer Theorem. At this condition, the load current is at its maximum value for power transfer."
      },
      {
        id: 6,
        question: "Which of the following is NOT a step in finding the Thevenin equivalent circuit?",
        options: [
          "Remove the load from the original circuit",
          "Calculate the open-circuit voltage (Thevenin voltage)",
          "Replace all independent sources with their internal resistances",
          "Multiply the Thevenin voltage by the Thevenin resistance"
        ],
        correctAnswer: 3,
        explanation: "Multiplying the Thevenin voltage by the Thevenin resistance is not a step in finding the Thevenin equivalent circuit. The correct steps are: remove the load, find the open-circuit voltage (VTH), deactivate independent sources, and find the equivalent resistance (RTH)."
      },
      {
        id: 7,
        question: "What is the dual of Thevenin's Theorem?",
        options: [
          "Norton's Theorem",
          "Kirchhoff's Voltage Law",
          "Superposition Theorem",
          "Maximum Power Transfer Theorem"
        ],
        correctAnswer: 0,
        explanation: "Norton's Theorem is the dual of Thevenin's Theorem. While Thevenin's Theorem replaces a circuit with a voltage source in series with a resistance, Norton's Theorem replaces it with a current source in parallel with a resistance."
      },
      {
        id: 8,
        question: "For what type of circuits is Thevenin's Theorem applicable?",
        options: [
          "Only DC circuits",
          "Only AC circuits",
          "Linear circuits with independent sources",
          "Non-linear circuits with dependent sources"
        ],
        correctAnswer: 2,
        explanation: "Thevenin's Theorem is applicable to linear circuits with independent sources. It can be used for both DC and AC circuits as long as they are linear."
      },
      {
        id: 9,
        question: "If a circuit has a Thevenin voltage of 12V and a Thevenin resistance of 4Ω, what is the voltage across a 6Ω load connected to this equivalent circuit?",
        options: [
          "12V",
          "8V",
          "7.2V",
          "4V"
        ],
        correctAnswer: 2,
        explanation: "Using voltage division: Vload = VTH × (Rload / (RTH + Rload)) = 12V × (6Ω / (4Ω + 6Ω)) = 12V × (6Ω / 10Ω) = 12V × 0.6 = 7.2V"
      },
      {
        id: 10,
        question: "What happens to the Thevenin equivalent circuit if the original circuit contains dependent sources?",
        options: [
          "Thevenin's Theorem cannot be applied",
          "The dependent sources must be converted to independent sources first",
          "The Thevenin equivalent can still be found, but the process is more complex",
          "The Thevenin resistance becomes zero"
        ],
        correctAnswer: 2,
        explanation: "When the original circuit contains dependent sources, Thevenin's Theorem can still be applied, but the process becomes more complex. The traditional methods of finding VTH and RTH may not work directly, and test sources might need to be used."
      }
    ]
  },
  // Quiz 3: House Wiring
  {
    id: 10,
    title: "House Wiring Quiz",
    description: "Verify your understanding of residential electrical systems",
    questions: [
      {
        id: 1,
        question: "What is the standard voltage for residential electrical systems in India?",
        options: [
          "110V",
          "220V",
          "230V",
          "440V"
        ],
        correctAnswer: 2,
        explanation: "The standard voltage for residential electrical systems in India is 230V (single-phase). This is the voltage supplied to homes for powering appliances and lighting."
      },
      {
        id: 2,
        question: "Which wire color is typically used for the neutral conductor in residential wiring?",
        options: [
          "Red",
          "Black",
          "Green",
          "Blue"
        ],
        correctAnswer: 3,
        explanation: "In Indian residential wiring standards, blue is typically used for the neutral conductor. The color coding helps electricians identify wires safely during installation and maintenance."
      },
      {
        id: 3,
        question: "What is the purpose of an MCB (Miniature Circuit Breaker) in house wiring?",
        options: [
          "To increase voltage",
          "To provide protection against overload and short circuit",
          "To convert AC to DC",
          "To measure power consumption"
        ],
        correctAnswer: 1,
        explanation: "An MCB (Miniature Circuit Breaker) provides protection against overload and short circuit conditions. It automatically trips and disconnects the circuit when excessive current flows, preventing damage to wiring and reducing fire hazards."
      },
      {
        id: 4,
        question: "What is the function of an ELCB (Earth Leakage Circuit Breaker) in residential wiring?",
        options: [
          "To measure energy consumption",
          "To protect against voltage fluctuations",
          "To protect against earth leakage current and prevent electric shock",
          "To convert single-phase supply to three-phase"
        ],
        correctAnswer: 2,
        explanation: "An ELCB (Earth Leakage Circuit Breaker) protects against earth leakage current and prevents electric shock. It detects small current leakages to earth and quickly disconnects the supply, protecting people from potential electrocution."
      },
      {
        id: 5,
        question: "Which of the following is NOT a component of a typical house wiring system?",
        options: [
          "Distribution board",
          "Energy meter",
          "Transformer",
          "Socket outlet"
        ],
        correctAnswer: 2,
        explanation: "A transformer is NOT a component of typical house wiring systems. Transformers are used in the distribution network to step down voltage before it reaches residential areas, but they are not installed within individual homes."
      },
      {
        id: 6,
        question: "What is the purpose of earthing in a residential electrical system?",
        options: [
          "To increase the voltage supply",
          "To provide a path for fault current and protect against electric shock",
          "To reduce electricity bills",
          "To convert AC to DC"
        ],
        correctAnswer: 1,
        explanation: "Earthing provides a path for fault current to flow safely to the ground instead of through a person. It protects against electric shock by ensuring that exposed conductive parts don't become live in case of insulation failure."
      },
      {
        id: 7,
        question: "Which type of wiring system is most commonly used in modern residential buildings?",
        options: [
          "Cleat wiring",
          "Conduit wiring",
          "Batten wiring",
          "Open wiring"
        ],
        correctAnswer: 1,
        explanation: "Conduit wiring is most commonly used in modern residential buildings. It involves running wires through protective tubes (conduits), which provides better protection, durability, and safety compared to other wiring methods."
      },
      {
        id: 8,
        question: "What is the recommended height for mounting switch boards in residential wiring?",
        options: [
          "0.5 meters from floor level",
          "1.2 to 1.5 meters from floor level",
          "2 meters from floor level",
          "At ceiling level"
        ],
        correctAnswer: 1,
        explanation: "The recommended height for mounting switch boards in residential wiring is 1.2 to 1.5 meters from floor level. This height provides convenient access for most adults while being out of easy reach for small children."
      },
      {
        id: 9,
        question: "Which of the following is used to distribute electrical power to different circuits in a house?",
        options: [
          "Energy meter",
          "Distribution board",
          "Socket outlet",
          "Light switch"
        ],
        correctAnswer: 1,
        explanation: "A distribution board (also called consumer unit or fuse box) is used to distribute electrical power to different circuits in a house. It contains circuit breakers or fuses for each circuit, providing protection and control."
      },
      {
        id: 10,
        question: "What is the purpose of a two-way switch in house wiring?",
        options: [
          "To control a light from two different locations",
          "To control two different lights from one location",
          "To switch between two different power sources",
          "To provide both AC and DC power"
        ],
        correctAnswer: 0,
        explanation: "A two-way switch is used to control a light from two different locations, such as at both ends of a staircase or hallway. This allows for convenient operation from either location without having to walk to a single switch point."
      }
    ]
  },
  // Quiz 4: Fluorescent Lamp Wiring
  {
    id: 11,
    title: "Fluorescent Lamp Wiring Quiz",
    description: "Test your knowledge of fluorescent lighting systems",
    questions: [
      {
        id: 1,
        question: "What is the primary function of a ballast in a fluorescent lamp circuit?",
        options: [
          "To increase the brightness of the lamp",
          "To limit the current through the lamp after ignition",
          "To convert AC to DC",
          "To reduce energy consumption"
        ],
        correctAnswer: 1,
        explanation: "The primary function of a ballast in a fluorescent lamp circuit is to limit the current through the lamp after ignition. Without a ballast, the negative resistance characteristic of the arc would allow current to increase until the lamp destroys itself."
      },
      {
        id: 2,
        question: "What is the purpose of a starter in a fluorescent lamp circuit?",
        options: [
          "To provide initial heating of the electrodes and create a high voltage pulse for arc ignition",
          "To regulate the brightness of the lamp",
          "To convert voltage from 230V to 110V",
          "To protect the circuit from power surges"
        ],
        correctAnswer: 0,
        explanation: "A starter in a fluorescent lamp circuit provides initial heating of the electrodes (filaments) and creates a high voltage pulse when it opens, which is necessary for arc ignition between the electrodes."
      },
      {
        id: 3,
        question: "Which gas is primarily used inside fluorescent tubes?",
        options: [
          "Oxygen",
          "Neon",
          "Mercury vapor and argon",
          "Hydrogen"
        ],
        correctAnswer: 2,
        explanation: "Fluorescent tubes primarily contain mercury vapor and argon gas. When electricity passes through, the mercury vapor produces ultraviolet light, which causes the phosphor coating on the inside of the tube to emit visible light."
      },
      {
        id: 4,
        question: "What is the function of the phosphor coating inside a fluorescent tube?",
        options: [
          "To prevent the glass from breaking",
          "To convert ultraviolet radiation to visible light",
          "To increase the tube's lifespan",
          "To reduce heat generation"
        ],
        correctAnswer: 1,
        explanation: "The phosphor coating inside a fluorescent tube converts ultraviolet radiation (produced by the mercury vapor discharge) into visible light. Different phosphor compositions produce different color temperatures of light."
      },
      {
        id: 5,
        question: "What type of ballast is more energy-efficient in fluorescent lighting systems?",
        options: [
          "Magnetic ballast",
          "Electronic ballast",
          "Resistive ballast",
          "Capacitive ballast"
        ],
        correctAnswer: 1,
        explanation: "Electronic ballasts are more energy-efficient than magnetic ballasts. They operate at higher frequencies (20-60 kHz), which improves lamp efficiency, eliminates flicker, reduces heat generation, and consumes less power."
      },
      {
        id: 6,
        question: "What causes the flickering often seen in fluorescent lamps?",
        options: [
          "Variation in power supply",
          "The AC supply frequency causing the arc to extinguish and reignite",
          "Faulty wiring connections",
          "Excessive heat buildup"
        ],
        correctAnswer: 1,
        explanation: "Flickering in fluorescent lamps with magnetic ballasts is caused by the AC supply frequency (50/60 Hz) causing the arc to extinguish and reignite twice per cycle. Electronic ballasts operating at higher frequencies eliminate this visible flicker."
      },
      {
        id: 7,
        question: "What is the typical power factor of a fluorescent lamp with a magnetic ballast?",
        options: [
          "0.5-0.6 (lagging)",
          "0.8-0.9 (lagging)",
          "1.0 (unity)",
          "0.9 (leading)"
        ],
        correctAnswer: 0,
        explanation: "The typical power factor of a fluorescent lamp with a magnetic ballast is 0.5-0.6 (lagging). This poor power factor is due to the inductive nature of the magnetic ballast. Power factor correction capacitors are often added to improve this."
      },
      {
        id: 8,
        question: "In a fluorescent lamp circuit, what happens when the starter contacts open?",
        options: [
          "The lamp turns off",
          "A high voltage spike is generated across the tube",
          "The ballast overheats",
          "The current increases dramatically"
        ],
        correctAnswer: 1,
        explanation: "When the starter contacts open in a fluorescent lamp circuit, the sudden interruption of current through the inductive ballast generates a high voltage spike across the tube. This voltage spike is necessary to initiate the arc discharge between the electrodes."
      },
      {
        id: 9,
        question: "What is the advantage of T5 fluorescent tubes over older T12 tubes?",
        options: [
          "They are cheaper to manufacture",
          "They are more durable and less likely to break",
          "They are more energy-efficient and have better light output",
          "They don't require a ballast"
        ],
        correctAnswer: 2,
        explanation: "T5 fluorescent tubes are more energy-efficient and have better light output compared to older T12 tubes. The 'T' refers to the tube diameter in eighths of an inch, so T5 is 5/8 inch while T12 is 12/8 (1.5) inches in diameter."
      },
      {
        id: 10,
        question: "What component might be added to a fluorescent lamp circuit to improve its power factor?",
        options: [
          "Resistor",
          "Capacitor",
          "Diode",
          "Transistor"
        ],
        correctAnswer: 1,
        explanation: "A capacitor is often added to a fluorescent lamp circuit to improve its power factor. The capacitor compensates for the lagging power factor caused by the inductive ballast, bringing the overall power factor closer to unity."
      }
    ]
  },
  // Quiz 5: Staircase Wiring
  {
    id: 12,
    title: "Staircase Wiring Quiz",
    description: "Challenge yourself on multi-way switching circuits",
    questions: [
      {
        id: 1,
        question: "What type of switch is used in staircase wiring to control a light from two different locations?",
        options: [
          "Single-pole switch",
          "Double-pole switch",
          "Two-way switch",
          "Intermediate switch"
        ],
        correctAnswer: 2,
        explanation: "Two-way switches are used in staircase wiring to control a light from two different locations (typically at the top and bottom of stairs). Each switch has three terminals and can direct current through one of two paths."
      },
      {
        id: 2,
        question: "How many two-way switches are required to control a light from two different locations?",
        options: [
          "One",
          "Two",
          "Three",
          "Four"
        ],
        correctAnswer: 1,
        explanation: "Two two-way switches are required to control a light from two different locations. This arrangement allows the light to be turned on or off from either location, regardless of the switch position at the other location."
      },
      {
        id: 3,
        question: "What type of switch is needed if you want to control a light from three different locations?",
        options: [
          "Three single-pole switches",
          "Three two-way switches",
          "Two two-way switches and one intermediate switch",
          "One two-way switch and two intermediate switches"
        ],
        correctAnswer: 2,
        explanation: "To control a light from three different locations, you need two two-way switches (at the ends) and one intermediate switch (in the middle). For each additional control point beyond three, another intermediate switch is added."
      },
      {
        id: 4,
        question: "In staircase wiring, what is the purpose of the common terminal on a two-way switch?",
        options: [
          "It connects to the neutral wire",
          "It connects to the earth wire",
          "It connects to the live wire input or to the lamp",
          "It is not used in the circuit"
        ],
        correctAnswer: 2,
        explanation: "In staircase wiring, the common terminal on a two-way switch connects either to the live wire input (on the first switch) or to the lamp (on the second switch). It's the terminal through which current either enters or exits the switching arrangement."
      },
      {
        id: 5,
        question: "What is the main advantage of staircase wiring?",
        options: [
          "It reduces electricity consumption",
          "It allows control of a light from multiple locations",
          "It increases the brightness of the light",
          "It protects against power surges"
        ],
        correctAnswer: 1,
        explanation: "The main advantage of staircase wiring is that it allows control of a light from multiple locations. This provides convenience and safety, especially in areas like staircases, hallways, and large rooms with multiple entrances."
      },
      {
        id: 6,
        question: "In a staircase wiring circuit with two two-way switches, how many traveler wires connect the two switches?",
        options: [
          "One",
          "Two",
          "Three",
          "Four"
        ],
        correctAnswer: 1,
        explanation: "In a staircase wiring circuit with two two-way switches, two traveler wires connect between the switches. These wires (often called strapping wires) connect the two L1 and L2 terminals of each switch, creating alternative paths for the current."
      },
      {
        id: 7,
        question: "What happens in a staircase circuit when both two-way switches are in the same position?",
        options: [
          "The light turns on",
          "The light turns off",
          "The circuit shorts",
          "It depends on the specific wiring configuration"
        ],
        correctAnswer: 3,
        explanation: "Whether the light is on or off when both switches are in the same position depends on the specific wiring configuration. In a properly wired staircase circuit, changing the position of either switch will toggle the light state (on to off or off to on)."
      },
      {
        id: 8,
        question: "Which of the following is NOT a component of a basic staircase wiring system?",
        options: [
          "Two-way switches",
          "Traveler wires",
          "Light fixture",
          "Dimmer"
        ],
        correctAnswer: 3,
        explanation: "A dimmer is NOT a standard component of a basic staircase wiring system. The basic components include two-way switches, traveler wires, a light fixture, and the necessary live and neutral connections. Dimmers can be added but require special compatibility with the switching arrangement."
      },
      {
        id: 9,
        question: "What is the function of an intermediate switch in a three-way lighting control system?",
        options: [
          "To dim the light",
          "To provide a third control location by redirecting the traveler wire connections",
          "To convert AC to DC",
          "To protect against power surges"
        ],
        correctAnswer: 1,
        explanation: "An intermediate switch provides a third control location in a lighting system by redirecting the traveler wire connections. It has four terminals and is installed between two two-way switches to allow control from three locations."
      },
      {
        id: 10,
        question: "In staircase wiring, which wire should NEVER be switched?",
        options: [
          "Live wire",
          "Neutral wire",
          "Traveler wire",
          "Earth wire"
        ],
        correctAnswer: 1,
        explanation: "In staircase wiring (and all electrical installations), the neutral wire should NEVER be switched. Only the live wire should be switched for safety reasons. Switching the neutral could leave the circuit energized even when apparently turned off."
      }
    ]
  },
  // Quiz 6: Full Wave Rectifier
  {
    id: 4,
    title: "Full Wave Rectifier Quiz",
    description: "Verify your understanding of AC to DC conversion",
    questions: [
      {
        id: 1,
        question: "What is the main purpose of a full-wave rectifier?",
        options: [
          "To convert DC to AC",
          "To convert AC to DC by utilizing both half-cycles of the input",
          "To amplify the input voltage",
          "To reduce voltage ripple without using filters"
        ],
        correctAnswer: 1,
        explanation: "The main purpose of a full-wave rectifier is to convert AC to DC by utilizing both half-cycles (positive and negative) of the input AC waveform. This results in more efficient power conversion compared to half-wave rectification."
      },
      {
        id: 2,
        question: "How many diodes are required in a center-tapped full-wave rectifier?",
        options: [
          "One",
          "Two",
          "Four",
          "Six"
        ],
        correctAnswer: 1,
        explanation: "A center-tapped full-wave rectifier requires two diodes. The center tap of the transformer secondary winding is connected to ground, and each diode conducts during alternate half-cycles of the input."
      },
      {
        id: 3,
        question: "How many diodes are required in a bridge full-wave rectifier?",
        options: [
          "Two",
          "Three",
          "Four",
          "Six"
        ],
        correctAnswer: 2,
        explanation: "A bridge full-wave rectifier requires four diodes arranged in a bridge configuration. This arrangement allows full-wave rectification without needing a center-tapped transformer."
      },
      {
        id: 4,
        question: "What is the ripple frequency of a full-wave rectifier with a 50 Hz AC input?",
        options: [
          "25 Hz",
          "50 Hz",
          "100 Hz",
          "200 Hz"
        ],
        correctAnswer: 2,
        explanation: "The ripple frequency of a full-wave rectifier is twice the input frequency. With a 50 Hz AC input, the ripple frequency is 100 Hz. This is because both the positive and negative half-cycles are converted to the same polarity, resulting in two pulses per input cycle."
      },
      {
        id: 5,
        question: "What is the advantage of a bridge rectifier over a center-tapped rectifier?",
        options: [
          "Bridge rectifiers use fewer diodes",
          "Bridge rectifiers don't require a transformer",
          "Bridge rectifiers don't need a center-tapped transformer and provide better voltage utilization",
          "Bridge rectifiers have lower forward voltage drop"
        ],
        correctAnswer: 2,
        explanation: "The main advantage of a bridge rectifier over a center-tapped rectifier is that it doesn't require a center-tapped transformer and provides better voltage utilization. While it uses more diodes (four instead of two), it utilizes the entire secondary voltage, whereas a center-tapped design only uses half of the total secondary voltage at any time."
      },
      {
        id: 6,
        question: "What is the peak inverse voltage (PIV) across each diode in a bridge rectifier?",
        options: [
          "Equal to the peak input voltage",
          "Twice the peak input voltage",
          "Half the peak input voltage",
          "Four times the peak input voltage"
        ],
        correctAnswer: 0,
        explanation: "In a bridge rectifier, the peak inverse voltage (PIV) across each diode is equal to the peak input voltage. This is an advantage over the center-tapped rectifier, where each diode must withstand twice the peak input voltage."
      },
      {
        id: 7,
        question: "What component is typically added to a full-wave rectifier to reduce ripple in the output voltage?",
        options: [
          "Inductor",
          "Capacitor",
          "Resistor",
          "Transformer"
        ],
        correctAnswer: 1,
        explanation: "A capacitor is typically added to a full-wave rectifier to reduce ripple in the output voltage. The capacitor charges during the peaks of the rectified waveform and discharges during the valleys, smoothing the output voltage."
      },
      {
        id: 8,
        question: "What is the average DC output voltage of a bridge rectifier in terms of the RMS input voltage?",
        options: [
          "Vdc = 0.318 × Vrms",
          "Vdc = 0.636 × Vrms",
          "Vdc = 0.9 × Vrms",
          "Vdc = 1.414 × Vrms"
        ],
        correctAnswer: 1,
        explanation: "The average DC output voltage of a bridge rectifier is Vdc = (2Vm/π) = 0.636 × Vrms, where Vm is the peak voltage and Vrms is the RMS input voltage. This is because Vm = 1.414 × Vrms, and the average value of a full-wave rectified sine wave is 2Vm/π."
      },
      {
        id: 9,
        question: "During which part of the AC cycle do all diodes in a bridge rectifier conduct?",
        options: [
          "All diodes conduct throughout the entire cycle",
          "Two diodes conduct during the positive half-cycle and the other two during the negative half-cycle",
          "All diodes conduct only during the positive half-cycle",
          "None of the diodes conduct simultaneously"
        ],
        correctAnswer: 1,
        explanation: "In a bridge rectifier, two diodes conduct during the positive half-cycle and the other two conduct during the negative half-cycle. At any given time, only two of the four diodes are conducting, forming a series path through the load."
      },
      {
        id: 10,
        question: "What is the form factor of a full-wave rectified waveform without filtering?",
        options: [
          "1.0",
          "1.11",
          "1.57",
          "2.0"
        ],
        correctAnswer: 1,
        explanation: "The form factor of a full-wave rectified waveform without filtering is 1.11. Form factor is defined as the ratio of RMS value to average value. For a full-wave rectified sine wave, this ratio is π/(2√2) ≈ 1.11."
      }
    ]
  }
];

export default function QuizPage() {
  const { id } = useParams();
  const quizId = parseInt(id as string);
  
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"
  const [errorLoading, setErrorLoading] = useState(false)

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const res = await fetch(apiUrl(`/api/quizzes?id=${quizId}`))
        if (res.ok) {
          const data = await res.json()
          setCurrentQuiz(data)
        } else {
          // Fallback to static quizData
          const quiz = quizData.find(q => q.id === quizId)
          if (quiz) {
            setCurrentQuiz(quiz)
          } else {
            setErrorLoading(true)
          }
        }
      } catch (err) {
        // Fallback to static quizData
        const quiz = quizData.find(q => q.id === quizId)
        if (quiz) {
          setCurrentQuiz(quiz)
        } else {
          setErrorLoading(true)
        }
      }
    }
    fetchQuizDetails()
  }, [quizId])

  if (errorLoading) {
    notFound()
  }

  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const correct = optionIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
      // Trigger confetti for correct answers
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      // Trigger confetti for quiz completion
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 }
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
  };

  const progressPercentage = (currentQuestionIndex / currentQuiz.questions.length) * 100;

  return (
    <SrmAccessGate
      title="Quiz attempt access"
      description="Only signed-in SRM users can attempt quizzes. Please sign in with your @srmist.edu.in email before starting the test."
    >
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <NavDock />
      <DigitalClock />

      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="mb-8">
          <Link href="/quizzes" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Link>
        </div>

        {isAdmin ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center shadow-lg">
              <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Administrator View</h2>
              <p className="mt-2 text-sm text-neutral-300">
                You are viewing <strong>{currentQuiz.title}</strong> as an administrator. 
                Admins can only view, edit, and schedule quizzes, and cannot submit/write attempts.
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <Link
                  href={`/quizzes?edit=${currentQuiz.id}`}
                  className="px-4 py-2 rounded-lg border border-blue-500 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Quiz Questions
                </Link>
                <Link
                  href="/quizzes"
                  className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                📋 Questions List ({currentQuiz.questions.length})
              </h3>
              
              {currentQuiz.questions.map((q: any, qIdx: number) => (
                <Card key={q.id} className="border-neutral-800 bg-neutral-900 shadow-lg">
                  <CardHeader className="border-b border-neutral-800 bg-neutral-950/40 p-4">
                    <CardTitle className="text-base font-bold text-white">
                      Q{qIdx + 1}: {q.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isCorrectOpt = optIdx === q.correctAnswer;
                        return (
                          <div 
                            key={optIdx} 
                            className={cn(
                              "p-3 rounded-lg border",
                              isCorrectOpt 
                                ? "border-green-500/40 bg-green-500/10 text-green-400 font-medium" 
                                : "border-neutral-800 bg-neutral-950/40 text-neutral-400"
                            )}
                          >
                            <span className="mr-2 font-bold">{String.fromCharCode(65 + optIdx)}:</span>
                            {opt}
                            {isCorrectOpt && " (Correct Answer)"}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
                      <strong className="text-blue-400 block mb-1">Explanation:</strong>
                      {q.explanation}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : !quizCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">{currentQuiz.title}</h1>
              <p className="mt-2 text-neutral-400">{currentQuiz.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-neutral-400 mb-2">
                <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
                <span>Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-neutral-800" indicatorClassName="bg-blue-500" />
            </div>

            <Card className="border-neutral-800 bg-neutral-900 shadow-lg mb-8">
              <CardHeader className="border-b border-neutral-800 bg-gradient-to-br from-blue-900/20 to-blue-900/5">
                <CardTitle className="text-xl text-white">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup value={selectedOption?.toString()} className="space-y-4">
                  {currentQuestion.options.map((option: string, index: number) => {
                    let optionClassName = "border border-neutral-700 bg-neutral-800/50 p-4 rounded-lg transition-all";
                    
                    if (isAnswered) {
                      if (index === currentQuestion.correctAnswer) {
                        optionClassName += " border-green-500 bg-green-900/20";
                      } else if (index === selectedOption) {
                        optionClassName += " border-red-500 bg-red-900/20";
                      }
                    } else {
                      optionClassName += " hover:border-blue-500 hover:bg-blue-900/10";
                    }
                    
                    return (
                      <div key={index} className={optionClassName} onClick={() => handleOptionSelect(index)}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem 
                            value={index.toString()} 
                            id={`option-${index}`} 
                            disabled={isAnswered}
                            className="text-white border-neutral-600"
                          />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                            {option}
                          </Label>
                          {isAnswered && index === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex flex-col border-t border-neutral-800 pt-6">
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full mb-4"
                    >
                      <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-900/20 border border-green-500/50' : 'bg-red-900/20 border border-red-500/50'}`}>
                        <div className="flex items-start mb-2">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <h3 className="font-medium text-green-400">Correct! Well done!</h3>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                              <h3 className="font-medium text-red-400">Not quite right. Keep learning!</h3>
                            </>
                          )}
                        </div>
                        <p className="text-neutral-300">{currentQuestion.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="w-full flex justify-end">
                  <Button 
                    onClick={handleNextQuestion} 
                    disabled={!isAnswered}
                    className={`${isAnswered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-neutral-700'} text-white px-6 py-2 rounded-md transition-colors`}
                  >
                    {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-neutral-800 bg-neutral-900 shadow-lg overflow-hidden">
              <CardHeader className="border-b border-neutral-800 bg-gradient-to-br from-blue-900/30 to-blue-900/10 text-center py-8">
                <div className="flex justify-center mb-4">
                  <Trophy className="h-16 w-16 text-yellow-500" />
                </div>
                <CardTitle className="text-2xl md:text-3xl text-white">Quiz Completed!</CardTitle>
                <CardDescription className="text-neutral-400 text-lg">
                  You scored {score} out of {currentQuiz.questions.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Your Performance</h3>
                  
                  {/* Score visualization */}
                  <div className="relative h-8 bg-neutral-800 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / currentQuiz.questions.length) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-neutral-400">
                    <span>0</span>
                    <span>{currentQuiz.questions.length}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-neutral-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.round((score / currentQuiz.questions.length) * 100)}%
                    </div>
                    <div className="text-sm text-neutral-400">Accuracy</div>
                  </div>
                  <div className="bg-neutral-800 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {score}
                    </div>
                    <div className="text-sm text-neutral-400">Correct Answers</div>
                  </div>
                </div>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-400 mb-2">Performance Analysis</h3>
                  <p className="text-neutral-300">
                    {score === currentQuiz.questions.length ? (
                      "Perfect score! You've mastered this topic completely!"
                    ) : score >= currentQuiz.questions.length * 0.8 ? (
                      "Excellent work! You have a strong understanding of this topic."
                    ) : score >= currentQuiz.questions.length * 0.6 ? (
                      "Good job! You understand most concepts, but there's still room for improvement."
                    ) : score >= currentQuiz.questions.length * 0.4 ? (
                      "You're making progress! Review the topics you missed and try again."
                    ) : (
                      "Keep studying! Review the material and try the quiz again to improve your score."
                    )}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4 border-t border-neutral-800 pt-6">
                <Button 
                  onClick={resetQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors w-full sm:w-auto"
                >
                  Retry Quiz
                </Button>
                <Link href="/quizzes" className="w-full sm:w-auto">
                  <Button 
                    className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-2 rounded-md transition-colors w-full"
                  >
                    Back to Quizzes
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
    </SrmAccessGate>
  );
}

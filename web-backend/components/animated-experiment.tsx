"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Play, Pause, RotateCcw } from "lucide-react"
import { KVLCircuit, TheveninCircuit } from "@/components/interactive-circuit"

interface Step {
  title: string
  description: string
  content?: React.ReactNode
  highlightPath?: string[]
}

interface AnimatedExperimentProps {
  experimentId: number
  title: string
  steps: Step[]
}

export const AnimatedExperiment = ({ experimentId, title, steps }: AnimatedExperimentProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNextStep()
            return 0
          }
          return prev + 1
        })
      }, 100)
    } else {
      setProgress(0)
    }
    
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, currentStep])

  useEffect(() => {
    // Reset progress when step changes
    setProgress(0)
  }, [currentStep])

  const handleNextStep = () => {
    setIsPlaying(false)
    setProgress(0)
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(0) // Loop back to the beginning
    }
  }

  const handlePrevStep = () => {
    setIsPlaying(false)
    setProgress(0)
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setCurrentStep(steps.length - 1) // Loop to the end
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetExperiment = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentStep(0)
  }

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 border-b border-neutral-800">
        <h3 className="text-xl font-bold text-white">{title} - Interactive Demonstration</h3>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-400">Step {currentStep + 1} of {steps.length}</span>
            <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={resetExperiment}
              className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4 text-neutral-400" />
            </button>
            <button 
              onClick={handlePrevStep}
              className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="h-5 w-5 text-neutral-300" />
            </button>
            <button 
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-blue-900/50 hover:bg-blue-800 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-blue-300" />
              ) : (
                <Play className="h-5 w-5 text-blue-300" />
              )}
            </button>
            <button 
              onClick={handleNextStep}
              className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
              title="Next Step"
            >
              <ChevronRight className="h-5 w-5 text-neutral-300" />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-lg font-semibold text-white mb-2">{steps[currentStep].title}</h4>
              <p className="text-neutral-300">{steps[currentStep].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="bg-neutral-950 rounded-lg p-4 min-h-[350px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Predefined experiment animations
export const KVLExperiment = () => {
  const steps: Step[] = [
    {
      title: "Introduction to Kirchhoff's Voltage Law",
      description: "Kirchhoff's Voltage Law (KVL) states that the sum of all voltages around any closed loop in a circuit must equal zero.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <KVLCircuit />
          </motion.div>
        </div>
      )
    },
    {
      title: "Setting Up the Circuit",
      description: "We'll use a simple circuit with a voltage source (E) and two resistors (R1 and R2) connected in series to demonstrate KVL.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <KVLCircuit />
        </div>
      )
    },
    {
      title: "Measuring Voltage Across Components",
      description: "Using a voltmeter, we measure the voltage across each component in the circuit. For our example, we have E = 12V, VR1 = 4.54V, and VR2 = 7.46V.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <KVLCircuit highlightPath={['source', 'node1', 'resistor1', 'node2']} />
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm">
            <p>Voltage across R1: 4.54V</p>
          </div>
        </div>
      )
    },
    {
      title: "Applying Kirchhoff's Voltage Law",
      description: "According to KVL, the sum of all voltages around the loop should equal zero. Let's verify this by adding all voltage rises and drops.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <KVLCircuit highlightPath={['source', 'node1', 'resistor1', 'node2', 'resistor2', 'node3', 'source']} />
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm">
            <p className="font-mono">E - VR1 - VR2 = 0</p>
            <p className="font-mono">12V - 4.54V - 7.46V = 0V</p>
            <p className="text-green-400 mt-1">✓ Kirchhoff's Voltage Law is verified!</p>
          </div>
        </div>
      )
    },
    {
      title: "Practical Applications",
      description: "KVL is fundamental for analyzing complex circuits with multiple voltage sources and components. It helps in determining unknown voltages in a circuit.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <KVLCircuit />
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm">
            <p>Applications of KVL:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Circuit analysis and troubleshooting</li>
              <li>Determining unknown voltages</li>
              <li>Designing voltage divider circuits</li>
              <li>Power distribution analysis</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  return <AnimatedExperiment experimentId={1} title="Kirchhoff's Voltage Law" steps={steps} />
}

export const TheveninExperiment = () => {
  const steps: Step[] = [
    {
      title: "Introduction to Thevenin's Theorem",
      description: "Thevenin's Theorem states that any linear circuit with voltage and current sources can be replaced by an equivalent circuit consisting of a voltage source in series with a resistor.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TheveninCircuit />
          </motion.div>
        </div>
      )
    },
    {
      title: "Original Circuit Analysis",
      description: "We start with the original circuit containing a voltage source and multiple resistors. We'll identify the load resistor (RL) that we want to analyze.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <TheveninCircuit />
        </div>
      )
    },
    {
      title: "Finding Thevenin Voltage (VTH)",
      description: "To find VTH, we remove the load resistor and measure the open-circuit voltage across the load terminals.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <TheveninCircuit />
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm">
            <p>Measured open-circuit voltage: VTH = 11.25V</p>
          </div>
        </div>
      )
    },
    {
      title: "Finding Thevenin Resistance (RTH)",
      description: "To find RTH, we replace all independent sources with their internal resistances and measure the equivalent resistance looking back into the circuit from the load terminals.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <TheveninCircuit />
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm">
            <p>Calculated equivalent resistance: RTH = 490Ω</p>
          </div>
        </div>
      )
    },
    {
      title: "Thevenin Equivalent Circuit",
      description: "Now we can construct the Thevenin equivalent circuit using VTH and RTH. This simplified circuit will behave identically to the original circuit from the perspective of the load.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <TheveninCircuit showThevenin={true} />
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm">
            <p>Thevenin Equivalent Circuit:</p>
            <p>VTH = 11.25V, RTH = 490Ω</p>
          </div>
        </div>
      )
    },
    {
      title: "Verification",
      description: "To verify Thevenin's Theorem, we connect the load resistor to both the original and Thevenin equivalent circuits and compare the load current and voltage.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <TheveninCircuit showThevenin={true} />
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-neutral-300 text-sm">
            <p>Original Circuit: IL = 7.1mA, VL = 7.1V</p>
            <p>Thevenin Circuit: IL = 7.1mA, VL = 7.1V</p>
            <p className="text-green-400 mt-1">✓ Thevenin's Theorem is verified!</p>
          </div>
        </div>
      )
    }
  ]

  return <AnimatedExperiment experimentId={2} title="Thevenin's Theorem" steps={steps} />
}

export const HouseWiringExperiment = () => {
  const steps: Step[] = [
    {
      title: "Introduction to House Wiring",
      description: "Residential electrical wiring involves the distribution of electrical power throughout a home. It includes circuits for lighting, outlets, and appliances.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-800 p-6 rounded-lg w-full max-w-md"
          >
            <div className="flex justify-center mb-4">
              <svg width="300" height="200" viewBox="0 0 300 200" className="border border-neutral-700 rounded">
                {/* House outline */}
                <path d="M50,100 L150,30 L250,100 L250,180 L50,180 Z" fill="none" stroke="#555" strokeWidth="2" />
                
                {/* Roof */}
                <path d="M150,30 L150,70 L190,70 L190,50 Z" fill="#444" stroke="#555" strokeWidth="1" />
                
                {/* Door */}
                <rect x="130" y="140" width="40" height="40" fill="#333" stroke="#555" strokeWidth="1" />
                <circle cx="160" cy="160" r="3" fill="#888" />
                
                {/* Windows */}
                <rect x="70" y="120" width="30" height="30" fill="#222" stroke="#555" strokeWidth="1" />
                <rect x="200" y="120" width="30" height="30" fill="#222" stroke="#555" strokeWidth="1" />
                
                {/* Electrical components */}
                <circle cx="85" cy="100" r="5" fill="#f0c420" stroke="#555" strokeWidth="1" />
                <circle cx="215" cy="100" r="5" fill="#f0c420" stroke="#555" strokeWidth="1" />
                <rect x="140" y="90" width="20" height="10" fill="#666" stroke="#555" strokeWidth="1" />
                
                {/* Electrical lines */}
                <path d="M30,50 L50,50 L50,100" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M85,100 L85,120" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M215,100 L215,120" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M150,90 L150,70" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M85,100 L150,90 L215,100" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
              </svg>
            </div>
            <p className="text-neutral-300 text-sm text-center">Basic house wiring diagram showing main components</p>
          </motion.div>
        </div>
      )
    },
    {
      title: "Main Components of House Wiring",
      description: "The key components include the service entrance, main distribution panel, branch circuits, and grounding system.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Main Components:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22V18M12 6V2M4 12H2M6.31 6.31L4.89 4.89M17.69 6.31L19.11 4.89M22 12H20M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Service Entrance</span>
                </div>
                <p className="text-neutral-300 text-xs">Where power enters the building from utility lines</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="16" height="16" rx="2" stroke="#4ADE80" strokeWidth="2"/>
                      <path d="M8 8H16M8 12H16M8 16H12" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Distribution Panel</span>
                </div>
                <p className="text-neutral-300 text-xs">Contains circuit breakers or fuses for protection</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 12C14 14.2091 12.2091 16 10 16C7.79086 16 6 14.2091 6 12C6 9.79086 7.79086 8 10 8C12.2091 8 14 9.79086 14 12Z" stroke="#FBBF24" strokeWidth="2"/>
                      <path d="M14 12H20M4 12H6" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Branch Circuits</span>
                </div>
                <p className="text-neutral-300 text-xs">Individual circuits serving different areas</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V12M12 20V12M12 12H20M12 12H4" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Grounding System</span>
                </div>
                <p className="text-neutral-300 text-xs">Safety system to prevent electrical shocks</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Residential Wiring Circuit",
      description: "A typical residential circuit includes the energy meter, main box, switches, and various loads like lamps and fans.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <svg width="400" height="250" viewBox="0 0 400 250">
              {/* Energy Meter */}
              <rect x="50" y="50" width="60" height="80" rx="2" fill="#333" stroke="#666" strokeWidth="1" />
              <text x="80" y="90" textAnchor="middle" fill="#ccc" fontSize="10">Energy Meter</text>
              <circle cx="65" cy="70" r="10" fill="#222" stroke="#666" strokeWidth="1" />
              <circle cx="95" cy="70" r="10" fill="#222" stroke="#666" strokeWidth="1" />
              
              {/* Main Box */}
              <rect x="150" y="50" width="60" height="80" rx="2" fill="#333" stroke="#666" strokeWidth="1" />
              <text x="180" y="90" textAnchor="middle" fill="#ccc" fontSize="10">Main Box</text>
              <rect x="160" y="65" width="40" height="10" rx="1" fill="#222" stroke="#666" strokeWidth="1" />
              <rect x="160" y="85" width="40" height="10" rx="1" fill="#222" stroke="#666" strokeWidth="1" />
              <rect x="160" y="105" width="40" height="10" rx="1" fill="#222" stroke="#666" strokeWidth="1" />
              
              {/* Switches */}
              <rect x="250" y="50" width="20" height="30" rx="2" fill="#333" stroke="#666" strokeWidth="1" />
              <text x="260" y="70" textAnchor="middle" fill="#ccc" fontSize="8">S1</text>
              
              <rect x="250" y="100" width="20" height="30" rx="2" fill="#333" stroke="#666" strokeWidth="1" />
              <text x="260" y="120" textAnchor="middle" fill="#ccc" fontSize="8">S2</text>
              
              <rect x="250" y="150" width="20" height="30" rx="2" fill="#333" stroke="#666" strokeWidth="1" />
              <text x="260" y="170" textAnchor="middle" fill="#ccc" fontSize="8">S3</text>
              
              {/* Loads */}
              <circle cx="330" y="65" r="15" fill="#333" stroke="#666" strokeWidth="1" />
              <text x="330" y="68" textAnchor="middle" fill="#ccc" fontSize="8">Lamp</text>
              
              <rect x="315" y="100" width="30" height="30" rx="2" fill="#333" stroke="#666" strokeWidth="1" />
              <text x="330" y="120" textAnchor="middle" fill="#ccc" fontSize="8">Fan</text>
              
              <rect x="315" y="150" width="30" height="30" rx="2" fill="#333" stroke="#666" strokeWidth="1" />
              <text x="330" y="170" textAnchor="middle" fill="#ccc" fontSize="8">Socket</text>
              
              {/* Wiring */}
              <path d="M110 65 H 150" stroke="#f0c420" strokeWidth="1.5" />
              <path d="M110 85 H 150" stroke="#666" strokeWidth="1.5" />
              
              <path d="M210 65 H 250" stroke="#f0c420" strokeWidth="1.5" />
              <path d="M210 85 H 230 V 115 H 250" stroke="#f0c420" strokeWidth="1.5" />
              <path d="M210 105 H 220 V 165 H 250" stroke="#f0c420" strokeWidth="1.5" />
              
              <path d="M270 65 H 315" stroke="#f0c420" strokeWidth="1.5" />
              <path d="M270 115 H 315" stroke="#f0c420" strokeWidth="1.5" />
              <path d="M270 165 H 315" stroke="#f0c420" strokeWidth="1.5" />
              
              {/* Ground */}
              <path d="M80 130 V 200" stroke="#666" strokeWidth="1.5" />
              <path d="M60 200 H 100" stroke="#666" strokeWidth="1.5" />
              <path d="M65 210 H 95" stroke="#666" strokeWidth="1.5" />
              <path d="M70 220 H 90" stroke="#666" strokeWidth="1.5" />
              <path d="M75 230 H 85" stroke="#666" strokeWidth="1.5" />
              
              {/* Legend */}
              <rect x="20" y="180" width="10" height="2" fill="#f0c420" />
              <text x="35" y="185" fill="#ccc" fontSize="8">Phase</text>
              
              <rect x="20" y="190" width="10" height="2" fill="#666" />
              <text x="35" y="195" fill="#ccc" fontSize="8">Neutral</text>
              
              <rect x="20" y="200" width="10" height="2" fill="#4ADE80" />
              <text x="35" y="205" fill="#ccc" fontSize="8">Ground</text>
            </svg>
          </div>
          <div className="mt-2 p-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
            <p>A typical residential circuit includes:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Energy meter to measure consumption</li>
              <li>Main box with circuit breakers</li>
              <li>Switches for controlling different loads</li>
              <li>Various loads (lamps, fans, sockets)</li>
              <li>Proper grounding for safety</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Wiring Color Codes",
      description: "Understanding wire color codes is essential for safe electrical installations. Different countries may have different standards.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Common Wire Color Codes:</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-red-500 mr-3"></div>
                <div>
                  <p className="text-white text-sm font-medium">Red</p>
                  <p className="text-neutral-300 text-xs">Live/Hot wire (secondary)</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-black border border-neutral-600 mr-3"></div>
                <div>
                  <p className="text-white text-sm font-medium">Black</p>
                  <p className="text-neutral-300 text-xs">Live/Hot wire (primary)</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 mr-3"></div>
                <div>
                  <p className="text-white text-sm font-medium">Blue</p>
                  <p className="text-neutral-300 text-xs">Neutral (some countries)</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-neutral-400 mr-3"></div>
                <div>
                  <p className="text-white text-sm font-medium">White/Grey</p>
                  <p className="text-neutral-300 text-xs">Neutral (US standard)</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-500 mr-3"></div>
                <div>
                  <p className="text-white text-sm font-medium">Green</p>
                  <p className="text-neutral-300 text-xs">Ground/Earth</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500 mr-3"></div>
                <div>
                  <p className="text-white text-sm font-medium">Yellow</p>
                  <p className="text-neutral-300 text-xs">Switch leg/Traveler</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 p-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
            <p className="text-yellow-300 font-semibold">Safety Note:</p>
            <p>Always verify wire colors according to your local electrical code. Color standards may vary by country and application.</p>
          </div>
        </div>
      )
    },
    {
      title: "Safety Considerations",
      description: "Electrical safety is paramount in house wiring. Proper installation and maintenance help prevent accidents and fires.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Safety Guidelines:</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Always Turn Off Power</p>
                  <p className="text-neutral-300 text-xs">Before working on any electrical circuit, turn off the power at the circuit breaker or fuse box.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-yellow-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12H15M12 9V15M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Use Proper Equipment</p>
                  <p className="text-neutral-300 text-xs">Use insulated tools, wear rubber-soled shoes, and avoid working in wet conditions.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2185 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2185 17.2185L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2185L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Follow Local Codes</p>
                  <p className="text-neutral-300 text-xs">Adhere to local electrical codes and regulations for residential wiring.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Regular Inspection</p>
                  <p className="text-neutral-300 text-xs">Periodically inspect wiring for signs of wear, damage, or overheating.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Professional Help</p>
                  <p className="text-neutral-300 text-xs">For complex installations or repairs, consult a licensed electrician.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return <AnimatedExperiment experimentId={3} title="House Wiring" steps={steps} />
}

export const FluorescentLampExperiment = () => {
  const steps: Step[] = [
    {
      title: "Introduction to Fluorescent Lamps",
      description: "Fluorescent lamps are energy-efficient light sources that use electricity to excite mercury vapor, which produces ultraviolet light that causes a phosphor coating to glow.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-800 p-6 rounded-lg w-full max-w-md"
          >
            <div className="flex justify-center mb-4">
              <svg width="400" height="100" viewBox="0 0 400 100">
                {/* Tube */}
                <rect x="50" y="40" width="300" height="20" rx="10" fill="#222" stroke="#444" strokeWidth="1" />
                
                {/* Phosphor coating (inner glow) */}
                <rect x="55" y="45" width="290" height="10" rx="5" fill="#444" />
                
                {/* Electrodes */}
                <circle cx="60" cy="50" r="5" fill="#666" />
                <circle cx="340" cy="50" r="5" fill="#666" />
                
                {/* Glow effect */}
                <rect x="65" y="47" width="270" height="6" rx="3" fill="#a5f3fc" opacity="0.7">
                  <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
                </rect>
                
                {/* End caps */}
                <rect x="30" y="35" width="20" height="30" rx="2" fill="#333" stroke="#555" strokeWidth="1" />
                <rect x="350" y="35" width="20" height="30" rx="2" fill="#333" stroke="#555" strokeWidth="1" />
                
                {/* Pins */}
                <rect x="35" y="65" width="2" height="10" fill="#888" />
                <rect x="43" y="65" width="2" height="10" fill="#888" />
                <rect x="355" y="65" width="2" height="10" fill="#888" />
                <rect x="363" y="65" width="2" height="10" fill="#888" />
              </svg>
            </div>
            <p className="text-neutral-300 text-sm text-center">Fluorescent tube with phosphor coating and electrodes</p>
          </motion.div>
        </div>
      )
    },
    {
      title: "Components of a Fluorescent Lamp",
      description: "A fluorescent lamp fixture consists of several key components that work together to produce light efficiently.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Main Components:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="8" width="16" height="8" rx="2" stroke="#60A5FA" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Fluorescent Tube</span>
                </div>
                <p className="text-neutral-300 text-xs">Glass tube with phosphor coating containing mercury vapor</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12H6M18 12H20M7 7L8.5 8.5M16.5 15.5L18 17M7 17L8.5 15.5M16.5 8.5L18 7M12 4V6M12 18V20M12 12V12.01" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Starter</span>
                </div>
                <p className="text-neutral-300 text-xs">Provides initial current surge to heat the electrodes</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V4M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10M12 6C13.1046 6 14 6.89543 14 8C14 9.10457 13.1046 10 12 10M12 10V12M12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16M12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16M12 16V18M12 18C10.8954 18 10 18.8954 10 20C10 21.1046 10.8954 22 12 22M12 18C13.1046 18 14 18.8954 14 20C14 21.1046 13.1046 22 12 22" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Ballast/Choke</span>
                </div>
                <p className="text-neutral-300 text-xs">Regulates current and provides voltage spike</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 14.5L5.5 18.5M14.5 9.5L18.5 5.5M5.5 5.5L9.5 9.5M18.5 18.5L14.5 14.5M7 12H7.01M17 12H17.01M12 7V7.01M12 17V17.01" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Holders/Sockets</span>
                </div>
                <p className="text-neutral-300 text-xs">Support the tube and provide electrical connections</p>
              </div>
            </div>
          </div>
          <div className="mt-2 p-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
            <p>Each component plays a crucial role:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>The tube contains the gas that produces light</li>
              <li>The starter initiates the lighting process</li>
              <li>The ballast regulates current flow</li>
              <li>The holders secure the tube and complete the circuit</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Working Principle",
      description: "Fluorescent lamps work through a process of gas discharge and phosphor excitation to produce visible light.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Operation Sequence:</h4>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-600 z-0"></div>
                <div className="relative z-10 flex items-start mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 mr-4 flex-shrink-0">
                    <span className="text-blue-300 font-semibold">1</span>
                  </div>
                  <div className="bg-neutral-700 p-3 rounded flex-grow">
                    <p className="text-white text-sm font-medium">Initial Current Flow</p>
                    <p className="text-neutral-300 text-xs">When switched on, current flows through the starter and tube filaments, heating them up.</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-start mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 mr-4 flex-shrink-0">
                    <span className="text-blue-300 font-semibold">2</span>
                  </div>
                  <div className="bg-neutral-700 p-3 rounded flex-grow">
                    <p className="text-white text-sm font-medium">Starter Operation</p>
                    <p className="text-neutral-300 text-xs">The starter contains a bimetallic strip that bends when heated, closing the circuit.</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-start mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 mr-4 flex-shrink-0">
                    <span className="text-blue-300 font-semibold">3</span>
                  </div>
                  <div className="bg-neutral-700 p-3 rounded flex-grow">
                    <p className="text-white text-sm font-medium">Voltage Spike</p>
                    <p className="text-neutral-300 text-xs">When the starter opens, the ballast creates a high voltage spike (around 1000V).</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-start mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 mr-4 flex-shrink-0">
                    <span className="text-blue-300 font-semibold">4</span>
                  </div>
                  <div className="bg-neutral-700 p-3 rounded flex-grow">
                    <p className="text-white text-sm font-medium">Gas Ionization</p>
                    <p className="text-neutral-300 text-xs">The voltage ionizes the mercury vapor, creating an arc that produces ultraviolet light.</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900/50 mr-4 flex-shrink-0">
                    <span className="text-blue-300 font-semibold">5</span>
                  </div>
                  <div className="bg-neutral-700 p-3 rounded flex-grow">
                    <p className="text-white text-sm font-medium">Light Production</p>
                    <p className="text-neutral-300 text-xs">The UV light excites the phosphor coating, which emits visible light.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Wiring Diagram",
      description: "The wiring of a fluorescent lamp involves connecting the tube, starter, and ballast in the correct configuration.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <svg width="400" height="200" viewBox="0 0 400 200">
              {/* AC Supply */}
              <text x="30" y="100" fill="#ccc" fontSize="12">AC Supply</text>
              <line x1="70" y1="80" x2="100" y2="80" stroke="#f0c420" strokeWidth="2" />
              <line x1="70" y1="120" x2="100" y2="120" stroke="#666" strokeWidth="2" />
              
              {/* Switch */}
              <rect x="100" y="70" width="30" height="20" fill="#333" stroke="#555" strokeWidth="1" />
              <text x="115" y="60" fill="#ccc" fontSize="10" textAnchor="middle">Switch</text>
              
              {/* Choke/Ballast */}
              <rect x="160" y="70" width="40" height="20" fill="#333" stroke="#555" strokeWidth="1" />
              <text x="180" y="60" fill="#ccc" fontSize="10" textAnchor="middle">Choke</text>
              <path d="M180 70 C 180 60, 180 60, 170 60 C 160 60, 160 60, 160 50" stroke="#666" strokeWidth="1" fill="none" />
              <path d="M180 70 C 180 60, 180 60, 190 60 C 200 60, 200 60, 200 50" stroke="#666" strokeWidth="1" fill="none" />
              
              {/* Tube */}
              <rect x="230" y="80" width="100" height="10" rx="5" fill="#222" stroke="#444" strokeWidth="1" />
              <rect x="235" y="83" width="90" height="4" rx="2" fill="#a5f3fc" opacity="0.7" />
              <circle cx="235" cy="85" r="3" fill="#666" />
              <circle cx="325" cy="85" r="3" fill="#666" />
              <text x="280" y="70" fill="#ccc" fontSize="10" textAnchor="middle">Fluorescent Tube</text>
              
              {/* Starter */}
              <rect x="260" y="120" width="30" height="20" fill="#333" stroke="#555" strokeWidth="1" />
              <text x="275" y="155" fill="#ccc" fontSize="10" textAnchor="middle">Starter</text>
              
              {/* Wiring */}
              <line x1="130" y1="80" x2="160" y2="80" stroke="#f0c420" strokeWidth="2" />
              <line x1="200" y1="80" x2="230" y2="80" stroke="#f0c420" strokeWidth="2" />
              <line x1="330" y1="85" x2="350" y2="85" stroke="#f0c420" strokeWidth="2" />
              <line x1="350" y1="85" x2="350" y2="120" stroke="#f0c420" strokeWidth="2" />
              <line x1="100" y1="120" x2="230" y2="120" stroke="#666" strokeWidth="2" />
              <line x1="230" y1="120" x2="230" y2="90" stroke="#666" strokeWidth="2" />
              <line x1="230" y1="120" x2="260" y2="120" stroke="#666" strokeWidth="2" />
              <line x1="290" y1="120" x2="330" y2="120" stroke="#666" strokeWidth="2" />
              <line x1="330" y1="120" x2="330" y2="90" stroke="#666" strokeWidth="2" />
              <line x1="330" y1="120" x2="350" y2="120" stroke="#666" strokeWidth="2" />
              
              {/* Legend */}
              <rect x="30" y="170" width="15" height="2" fill="#f0c420" />
              <text x="50" y="175" fill="#ccc" fontSize="10">Phase</text>
              
              <rect x="100" y="170" width="15" height="2" fill="#666" />
              <text x="120" y="175" fill="#ccc" fontSize="10">Neutral</text>
            </svg>
          </div>
          <div className="mt-2 p-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
            <p>Wiring Configuration:</p>
            <ol className="list-decimal pl-5 mt-1 space-y-1">
              <li>The phase wire connects to the switch, then to the choke</li>
              <li>From the choke, it connects to one end of the tube</li>
              <li>The neutral wire connects to the other end of the tube</li>
              <li>The starter is connected in parallel with the tube</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Fluorescent lamps can experience various issues. Understanding common problems helps in effective troubleshooting.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Common Problems:</h4>
            <div className="space-y-3">
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 14.5L5.5 18.5M14.5 9.5L18.5 5.5M5.5 5.5L9.5 9.5M18.5 18.5L14.5 14.5" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Flickering Light</p>
                    <p className="text-neutral-300 text-xs">Possible causes: Faulty starter, worn-out tube, loose connections</p>
                    <p className="text-blue-300 text-xs mt-1">Solution: Replace starter or tube, check connections</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 14.5L5.5 18.5M14.5 9.5L18.5 5.5M5.5 5.5L9.5 9.5M18.5 18.5L14.5 14.5" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Tube Ends Darkening</p>
                    <p className="text-neutral-300 text-xs">Possible causes: Tube reaching end of life, excessive current</p>
                    <p className="text-blue-300 text-xs mt-1">Solution: Replace the tube</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 14.5L5.5 18.5M14.5 9.5L18.5 5.5M5.5 5.5L9.5 9.5M18.5 18.5L14.5 14.5" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Lamp Won't Start</p>
                    <p className="text-neutral-300 text-xs">Possible causes: Defective ballast, bad starter, dead tube</p>
                    <p className="text-blue-300 text-xs mt-1">Solution: Test and replace faulty components</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 14.5L5.5 18.5M14.5 9.5L18.5 5.5M5.5 5.5L9.5 9.5M18.5 18.5L14.5 14.5" stroke="#F87171" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Humming Noise</p>
                    <p className="text-neutral-300 text-xs">Possible causes: Loose ballast, magnetic ballast vibration</p>
                    <p className="text-blue-300 text-xs mt-1">Solution: Secure ballast, consider electronic ballast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 p-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
            <p className="text-yellow-300 font-semibold">Safety Note:</p>
            <p>Always turn off power before troubleshooting or replacing components in a fluorescent lamp fixture.</p>
          </div>
        </div>
      )
    }
  ]

  return <AnimatedExperiment experimentId={4} title="Fluorescent Lamp Wiring" steps={steps} />
}

export const StaircaseWiringExperiment = () => {
  const steps: Step[] = [
    {
      title: "Introduction to Staircase Wiring",
      description: "Staircase wiring allows you to control a single lamp from two different locations, typically at the top and bottom of a staircase.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-800 p-6 rounded-lg w-full max-w-md"
          >
            <div className="flex justify-center mb-4">
              <svg width="300" height="200" viewBox="0 0 300 200" className="border border-neutral-700 rounded">
                {/* Staircase outline */}
                <path d="M50,180 L50,140 L80,140 L80,100 L110,100 L110,60 L140,60 L140,20 L250,20 L250,180 Z" fill="none" stroke="#555" strokeWidth="2" />
                
                {/* Stairs */}
                <line x1="50" y1="140" x2="80" y2="140" stroke="#555" strokeWidth="2" />
                <line x1="80" y1="100" x2="110" y2="100" stroke="#555" strokeWidth="2" />
                <line x1="110" y1="60" x2="140" y2="60" stroke="#555" strokeWidth="2" />
                <line x1="80" y1="140" x2="80" y2="100" stroke="#555" strokeWidth="2" />
                <line x1="110" y1="100" x2="110" y2="60" stroke="#555" strokeWidth="2" />
                <line x1="140" y1="60" x2="140" y2="20" stroke="#555" strokeWidth="2" />
                
                {/* Light */}
                <circle cx="150" cy="100" r="15" fill="#f0c420" opacity="0.7">
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="100" r="8" fill="#fff" opacity="0.9" />
                
                {/* Switches */}
                <rect x="60" y="160" width="15" height="10" fill="#666" stroke="#888" strokeWidth="1" />
                <text x="67" y="155" fill="#ccc" fontSize="8" textAnchor="middle">S1</text>
                
                <rect x="220" y="40" width="15" height="10" fill="#666" stroke="#888" strokeWidth="1" />
                <text x="227" y="35" fill="#ccc" fontSize="8" textAnchor="middle">S2</text>
                
                {/* Wiring */}
                <path d="M60,165 C 90,165 120,130 150,100" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M220,45 C 190,45 170,70 150,100" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
              </svg>
            </div>
            <p className="text-neutral-300 text-sm text-center">Staircase wiring allows control from both top and bottom of stairs</p>
          </motion.div>
        </div>
      )
    },
    {
      title: "Two-Way Switches",
      description: "Staircase wiring uses special two-way switches that have three terminals: one common and two travelers.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Two-Way Switch Structure:</h4>
            <div className="flex justify-center mb-4">
              <svg width="300" height="200" viewBox="0 0 300 200">
                {/* Switch outline */}
                <rect x="100" y="50" width="100" height="150" rx="5" fill="#333" stroke="#555" strokeWidth="2" />
                
                {/* Switch mechanism */}
                <circle cx="150" cy="80" r="10" fill="#666" stroke="#888" strokeWidth="1" />
                <rect x="145" y="90" width="10" height="60" rx="2" fill="#666" stroke="#888" strokeWidth="1" />
                
                {/* Terminals */}
                <circle cx="120" cy="170" r="8" fill="#888" stroke="#aaa" strokeWidth="1" />
                <text x="120" y="190" fill="#ccc" fontSize="10" textAnchor="middle">Common</text>
                
                <circle cx="150" cy="170" r="8" fill="#888" stroke="#aaa" strokeWidth="1" />
                <text x="150" y="190" fill="#ccc" fontSize="10" textAnchor="middle">L1</text>
                
                <circle cx="180" cy="170" r="8" fill="#888" stroke="#aaa" strokeWidth="1" />
                <text x="180" y="190" fill="#ccc" fontSize="10" textAnchor="middle">L2</text>
                
                {/* Switch positions */}
                <g transform="translate(220, 80)">
                  <text x="0" y="0" fill="#ccc" fontSize="10">Position 1:</text>
                  <line x1="-10" y1="15" x2="10" y2="15" stroke="#f0c420" strokeWidth="2" />
                  <line x1="10" y1="15" x2="30" y2="15" stroke="#666" strokeWidth="2" />
                </g>
                
                <g transform="translate(220, 120)">
                  <text x="0" y="0" fill="#ccc" fontSize="10">Position 2:</text>
                  <line x1="-10" y1="15" x2="10" y2="15" stroke="#666" strokeWidth="2" />
                  <line x1="10" y1="15" x2="30" y2="15" stroke="#f0c420" strokeWidth="2" />
                </g>
              </svg>
            </div>
            <div className="mt-2 p-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
              <p>Two-way switch characteristics:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Has three terminals: one common and two travelers (L1 and L2)</li>
                <li>The common terminal connects to either L1 or L2 depending on switch position</li>
                <li>When one switch is flipped, it changes which traveler wire is connected to the common terminal</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Wiring Diagram",
      description: "The wiring configuration for staircase control uses two two-way switches connected in a specific pattern.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <svg width="400" height="250" viewBox="0 0 400 250">
              {/* AC Supply */}
              <text x="30" y="100" fill="#ccc" fontSize="12">AC Supply</text>
              <line x1="70" y1="80" x2="100" y2="80" stroke="#f0c420" strokeWidth="2" />
              <line x1="70" y1="120" x2="100" y2="120" stroke="#666" strokeWidth="2" />
              
              {/* Switch 1 */}
              <rect x="100" y="60" width="40" height="60" rx="2" fill="#333" stroke="#555" strokeWidth="1" />
              <text x="120" y="50" fill="#ccc" fontSize="10" textAnchor="middle">Switch 1</text>
              <circle cx="110" cy="70" r="5" fill="#888" />
              <circle cx="110" cy="100" r="5" fill="#888" />
              <circle cx="130" cy="85" r="5" fill="#888" />
              
              {/* Switch 2 */}
              <rect x="250" y="60" width="40" height="60" rx="2" fill="#333" stroke="#555" strokeWidth="1" />
              <text x="270" y="50" fill="#ccc" fontSize="10" textAnchor="middle">Switch 2</text>
              <circle cx="260" cy="70" r="5" fill="#888" />
              <circle cx="260" cy="100" r="5" fill="#888" />
              <circle cx="280" cy="85" r="5" fill="#888" />
              
              {/* Lamp */}
              <circle cx="350" cy="80" r="15" fill="#333" stroke="#555" strokeWidth="1" />
              <text x="350" y="50" fill="#ccc" fontSize="10" textAnchor="middle">Lamp</text>
              <circle cx="350" cy="80" r="8" fill="#f0c420" opacity="0.7">
                <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Wiring */}
              <line x1="70" y1="80" x2="100" y2="80" stroke="#f0c420" strokeWidth="2" />
              <line x1="130" y1="85" x2="170" y2="85" stroke="#f0c420" strokeWidth="2" />
              <line x1="170" y1="85" x2="170" y2="40" stroke="#f0c420" strokeWidth="2" />
              <line x1="170" y1="40" x2="350" y2="40" stroke="#f0c420" strokeWidth="2" />
              <line x1="350" y1="40" x2="350" y2="65" stroke="#f0c420" strokeWidth="2" />
              
              <line x1="110" y1="70" x2="170" y2="70" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
              <line x1="170" y1="70" x2="260" y2="70" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
              
              <line x1="110" y1="100" x2="170" y2="100" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
              <line x1="170" y1="100" x2="260" y2="100" stroke="#f0c420" strokeWidth="1.5" strokeDasharray="3,2" />
              
              <line x1="280" y1="85" x2="320" y2="85" stroke="#f0c420" strokeWidth="2" />
              <line x1="320" y1="85" x2="320" y2="120" stroke="#f0c420" strokeWidth="2" />
              <line x1="320" y1="120" x2="350" y2="120" stroke="#f0c420" strokeWidth="2" />
              <line x1="350" y1="120" x2="350" y2="95" stroke="#f0c420" strokeWidth="2" />
              
              <line x1="70" y1="120" x2="350" y2="120" stroke="#666" strokeWidth="2" />
              
              {/* Legend */}
              <rect x="30" y="200" width="15" height="2" fill="#f0c420" />
              <text x="50" y="205" fill="#ccc" fontSize="10">Phase</text>
              
              <rect x="100" y="200" width="15" height="2" fill="#666" />
              <text x="120" y="205" fill="#ccc" fontSize="10">Neutral</text>
              
              <rect x="30" y="220" width="15" height="2" fill="#f0c420" strokeDasharray="3,2" />
              <text x="50" y="225" fill="#ccc" fontSize="10">Traveler Wires</text>
            </svg>
          </div>
          <div className="mt-2 p-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
            <p>Wiring Configuration:</p>
            <ol className="list-decimal pl-5 mt-1 space-y-1">
              <li>The phase wire connects to the common terminal of Switch 1</li>
              <li>The two traveler terminals of Switch 1 connect to the two traveler terminals of Switch 2</li>
              <li>The common terminal of Switch 2 connects to the lamp</li>
              <li>The neutral wire connects directly to the other terminal of the lamp</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "Operation Principle",
      description: "Understanding how the switches work together to control the lamp from two locations.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Switch Positions and Lamp States:</h4>
            <div className="space-y-4">
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Scenario 1: Lamp ON</span>
                  <div className="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
                    <span className="text-green-300 text-xs">ON</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="w-10 h-6 rounded bg-blue-900/30 mx-auto mb-1"></div>
                    <span className="text-neutral-300 text-xs">S1: UP</span>
                  </div>
                  <div className="flex-grow h-0.5 bg-gradient-to-r from-blue-500 to-green-500 mx-2"></div>
                  <div className="text-center">
                    <div className="w-10 h-6 rounded bg-blue-900/30 mx-auto mb-1"></div>
                    <span className="text-neutral-300 text-xs">S2: UP</span>
                  </div>
                </div>
                <p className="text-neutral-300 text-xs mt-2">Both switches in same position create a complete circuit</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Scenario 2: Lamp OFF</span>
                  <div className="w-6 h-6 rounded-full bg-red-900/50 flex items-center justify-center">
                    <span className="text-red-300 text-xs">OFF</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="w-10 h-6 rounded bg-blue-900/30 mx-auto mb-1"></div>
                    <span className="text-neutral-300 text-xs">S1: UP</span>
                  </div>
                  <div className="flex-grow h-0.5 bg-gradient-to-r from-blue-500 to-red-500 mx-2"></div>
                  <div className="text-center">
                    <div className="w-10 h-6 rounded bg-red-900/30 mx-auto mb-1"></div>
                    <span className="text-neutral-300 text-xs">S2: DOWN</span>
                  </div>
                </div>
                <p className="text-neutral-300 text-xs mt-2">Switches in opposite positions break the circuit</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Scenario 3: Lamp ON</span>
                  <div className="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center">
                    <span className="text-green-300 text-xs">ON</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="w-10 h-6 rounded bg-red-900/30 mx-auto mb-1"></div>
                    <span className="text-neutral-300 text-xs">S1: DOWN</span>
                  </div>
                  <div className="flex-grow h-0.5 bg-gradient-to-r from-red-500 to-red-500 mx-2"></div>
                  <div className="text-center">
                    <div className="w-10 h-6 rounded bg-red-900/30 mx-auto mb-1"></div>
                    <span className="text-neutral-300 text-xs">S2: DOWN</span>
                  </div>
                </div>
                <p className="text-neutral-300 text-xs mt-2">Both switches in same position create a complete circuit</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Scenario 4: Lamp OFF</span>
                  <div className="w-6 h-6 rounded-full bg-red-900/50 flex items-center justify-center">
                    <span className="text-red-300 text-xs">OFF</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="w-10 h-6 rounded bg-red-900/30 mx-auto mb-1"></div>
                    <span className="text-neutral-300 text-xs">S1: DOWN</span>
                  </div>
                  <div className="flex-grow h-0.5 bg-gradient-to-r from-red-500 to-blue-500 mx-2"></div>
                  <div className="text-center">
                    <div className="w-10 h-6 rounded bg-blue-900/30 mx-auto mb-1"></div>
                    <span className="text-neutral-300 text-xs">S2: UP</span>
                  </div>
                </div>
                <p className="text-neutral-300 text-xs mt-2">Switches in opposite positions break the circuit</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Applications and Benefits",
      description: "Staircase wiring is useful in various scenarios beyond just staircases.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Common Applications:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Staircases</span>
                </div>
                <p className="text-neutral-300 text-xs">Control lights from top and bottom of stairs</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Hallways</span>
                </div>
                <p className="text-neutral-300 text-xs">Control from either end of a long hallway</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 18V17M17 18V17M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11M5 11H19C20.1046 11 21 11.8954 21 13V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V13C3 11.8954 3.89543 11 5 11Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Bedrooms</span>
                </div>
                <p className="text-neutral-300 text-xs">Control from door and bedside</p>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 17H5C3.89543 17 3 16.1046 3 15V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15C21 16.1046 20.1046 17 19 17H15M9 17V21M9 17H15M15 17V21" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">Garages</span>
                </div>
                <p className="text-neutral-300 text-xs">Control from house and garage doors</p>
              </div>
            </div>
            
            <h4 className="text-white font-semibold mt-6 mb-3">Benefits:</h4>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-neutral-300 text-sm">Convenience - control lights from multiple locations</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-neutral-300 text-sm">Safety - never navigate dark stairs or hallways</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-neutral-300 text-sm">Energy efficiency - easily turn off lights when leaving a room</p>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-neutral-300 text-sm">Expandable - can be extended to control from more locations using intermediate switches</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return <AnimatedExperiment experimentId={5} title="Staircase Wiring" steps={steps} />
}

export const FullWaveRectifierExperiment = () => {
  const steps: Step[] = [
    {
      title: "Introduction to Full Wave Rectifiers",
      description: "A full wave rectifier converts alternating current (AC) to direct current (DC) by utilizing both halves of the AC cycle.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-800 p-6 rounded-lg w-full max-w-md"
          >
            <div className="flex justify-center mb-4">
              <svg width="400" height="200" viewBox="0 0 400 200">
                {/* AC Input Waveform */}
                <text x="50" y="20" fill="#ccc" fontSize="12">AC Input</text>
                <path d="M50,100 C70,100 70,50 90,50 C110,50 110,150 130,150 C150,150 150,50 170,50 C190,50 190,150 210,150 C230,150 230,50 250,50" 
                      fill="none" stroke="#60A5FA" strokeWidth="2" />
                
                {/* Rectifier Box */}
                <rect x="270" y="70" width="60" height="60" rx="2" fill="#333" stroke="#555" strokeWidth="1" />
                <text x="300" y="105" fill="#ccc" fontSize="10" textAnchor="middle">Rectifier</text>
                
                {/* DC Output Waveform */}
                <text x="350" y="20" fill="#ccc" fontSize="12">DC Output</text>
                <path d="M350,100 C350,100 350,50 370,50 C390,50 390,50 410,50 C430,50 430,50 450,50 C470,50 470,50 490,50 C510,50 510,50 530,50" 
                      fill="none" stroke="#4ADE80" strokeWidth="2" />
                
                {/* Arrows */}
                <path d="M250,100 L270,100" fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />
                <path d="M330,100 L350,100" fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />
                
                {/* Arrowhead marker */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ccc" />
                  </marker>
                </defs>
                
                {/* Waveform labels */}
                <text x="150" y="180" fill="#60A5FA" fontSize="12" textAnchor="middle">Sine Wave (AC)</text>
                <text x="440" y="180" fill="#4ADE80" fontSize="12" textAnchor="middle">Rectified Wave (DC)</text>
              </svg>
            </div>
            <p className="text-neutral-300 text-sm text-center">Full wave rectification converts both positive and negative half-cycles to positive output</p>
          </motion.div>
        </div>
      )
    },
    {
      title: "Types of Full Wave Rectifiers",
      description: "There are two main types of full wave rectifiers: center-tapped transformer type and bridge rectifier type.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Full Wave Rectifier Types:</h4>
            <div className="space-y-6">
              <div>
                <h5 className="text-blue-400 text-sm font-medium mb-2">1. Center-Tapped Transformer Type</h5>
                <div className="flex justify-center mb-2">
                  <svg width="300" height="150" viewBox="0 0 300 150">
                    {/* Transformer */}
                    <path d="M80,50 L80,100" stroke="#ccc" strokeWidth="2" />
                    <path d="M100,50 L100,100" stroke="#ccc" strokeWidth="2" />
                    <path d="M120,40 L120,110" stroke="#ccc" strokeWidth="2" />
                    <path d="M140,40 L140,110" stroke="#ccc" strokeWidth="2" />
                    
                    {/* Transformer coils */}
                    <path d="M80,60 C85,60 95,60 100,60" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M80,70 C85,70 95,70 100,70" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M80,80 C85,80 95,80 100,80" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M80,90 C85,90 95,90 100,90" stroke="#ccc" strokeWidth="1" fill="none" />
                    
                    <path d="M120,50 C125,50 135,50 140,50" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M120,60 C125,60 135,60 140,60" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M120,70 C125,70 135,70 140,70" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M120,80 C125,80 135,80 140,80" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M120,90 C125,90 135,90 140,90" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M120,100 C125,100 135,100 140,100" stroke="#ccc" strokeWidth="1" fill="none" />
                    
                    {/* Center tap */}
                    <line x1="130" y1="75" x2="160" y2="75" stroke="#ccc" strokeWidth="2" />
                    <circle cx="130" cy="75" r="2" fill="#ccc" />
                    
                    {/* Diodes */}
                    <polygon points="160,50 180,60 160,70" fill="#333" stroke="#ccc" strokeWidth="1" />
                    <line x1="180" y1="60" x2="200" y2="60" stroke="#ccc" strokeWidth="2" />
                    <line x1="140" y1="50" x2="160" y2="50" stroke="#ccc" strokeWidth="2" />
                    
                    <polygon points="160,100 180,90 160,80" fill="#333" stroke="#ccc" strokeWidth="1" />
                    <line x1="180" y1="90" x2="200" y2="90" stroke="#ccc" strokeWidth="2" />
                    <line x1="140" y1="100" x2="160" y2="100" stroke="#ccc" strokeWidth="2" />
                    
                    {/* Load */}
                    <rect x="200" y="60" width="30" height="30" rx="2" fill="#333" stroke="#ccc" strokeWidth="1" />
                    <text x="215" y="80" fill="#ccc" fontSize="10" textAnchor="middle">Load</text>
                    
                    {/* Connections */}
                    <line x1="200" y1="90" x2="200" y2="60" stroke="#ccc" strokeWidth="2" />
                    <line x1="230" y1="75" x2="250" y2="75" stroke="#ccc" strokeWidth="2" />
                    <line x1="160" y1="75" x2="160" y2="120" stroke="#ccc" strokeWidth="2" />
                    <line x1="160" y1="120" x2="250" y2="120" stroke="#ccc" strokeWidth="2" />
                    <line x1="250" y1="75" x2="250" y2="120" stroke="#ccc" strokeWidth="2" />
                    
                    {/* AC Input */}
                    <text x="50" y="75" fill="#ccc" fontSize="10">AC</text>
                    <line x1="50" y1="60" x2="80" y2="60" stroke="#ccc" strokeWidth="2" />
                    <line x1="50" y1="90" x2="80" y2="90" stroke="#ccc" strokeWidth="2" />
                  </svg>
                </div>
                <div className="bg-neutral-700 p-2 rounded">
                  <p className="text-neutral-300 text-xs">Uses a center-tapped transformer and two diodes. Each diode conducts during alternate half-cycles of the input.</p>
                </div>
              </div>
              
              <div>
                <h5 className="text-blue-400 text-sm font-medium mb-2">2. Bridge Rectifier Type</h5>
                <div className="flex justify-center mb-2">
                  <svg width="300" height="150" viewBox="0 0 300 150">
                    {/* Transformer */}
                    <path d="M80,50 L80,100" stroke="#ccc" strokeWidth="2" />
                    <path d="M100,50 L100,100" stroke="#ccc" strokeWidth="2" />
                    <path d="M120,50 L120,100" stroke="#ccc" strokeWidth="2" />
                    <path d="M140,50 L140,100" stroke="#ccc" strokeWidth="2" />
                    
                    {/* Transformer coils */}
                    <path d="M80,60 C85,60 95,60 100,60" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M80,70 C85,70 95,70 100,70" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M80,80 C85,80 95,80 100,80" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M80,90 C85,90 95,90 100,90" stroke="#ccc" strokeWidth="1" fill="none" />
                    
                    <path d="M120,60 C125,60 135,60 140,60" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M120,70 C125,70 135,70 140,70" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M120,80 C125,80 135,80 140,80" stroke="#ccc" strokeWidth="1" fill="none" />
                    <path d="M120,90 C125,90 135,90 140,90" stroke="#ccc" strokeWidth="1" fill="none" />
                    
                    {/* Bridge Rectifier */}
                    <rect x="160" y="50" width="60" height="50" rx="2" fill="#333" stroke="#ccc" strokeWidth="1" />
                    
                    {/* Diodes in bridge */}
                    <polygon points="170,60 180,65 170,70" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                    <polygon points="210,60 200,65 210,70" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                    <polygon points="170,90 180,85 170,80" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                    <polygon points="210,90 200,85 210,80" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                    
                    <text x="190" y="75" fill="#ccc" fontSize="8" textAnchor="middle">Bridge</text>
                    
                    {/* Load */}
                    <rect x="240" y="60" width="30" height="30" rx="2" fill="#333" stroke="#ccc" strokeWidth="1" />
                    <text x="255" y="80" fill="#ccc" fontSize="10" textAnchor="middle">Load</text>
                    
                    {/* Connections */}
                    <line x1="140" y1="60" x2="160" y2="60" stroke="#ccc" strokeWidth="2" />
                    <line x1="140" y1="90" x2="160" y2="90" stroke="#ccc" strokeWidth="2" />
                    <line x1="220" y1="60" x2="240" y2="60" stroke="#ccc" strokeWidth="2" />
                    <line x1="220" y1="90" x2="240" y2="90" stroke="#ccc" strokeWidth="2" />
                    
                    {/* AC Input */}
                    <text x="50" y="75" fill="#ccc" fontSize="10">AC</text>
                    <line x1="50" y1="60" x2="80" y2="60" stroke="#ccc" strokeWidth="2" />
                    <line x1="50" y1="90" x2="80" y2="90" stroke="#ccc" strokeWidth="2" />
                  </svg>
                </div>
                <div className="bg-neutral-700 p-2 rounded">
                  <p className="text-neutral-300 text-xs">Uses four diodes arranged in a bridge configuration. Doesn't require a center-tapped transformer and provides better efficiency.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 p-3 bg-neutral-700 rounded-lg text-neutral-300 text-sm">
            <p>Comparison:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Bridge rectifier is more commonly used in modern applications</li>
              <li>Bridge type doesn't require a center-tapped transformer</li>
              <li>Center-tapped type uses fewer diodes but requires a special transformer</li>
              <li>Bridge type has better voltage utilization efficiency</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Bridge Rectifier Operation",
      description: "The bridge rectifier uses four diodes to convert both positive and negative half-cycles of AC input to positive DC output.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Operation During Positive Half-Cycle:</h4>
            <div className="flex justify-center mb-4">
              <svg width="300" height="150" viewBox="0 0 300 150">
                {/* Bridge Rectifier */}
                <rect x="100" y="50" width="100" height="80" rx="2" fill="#333" stroke="#ccc" strokeWidth="1" />
                
                {/* Diodes */}
                <polygon points="120,70 135,75 120,80" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                <polygon points="180,70 165,75 180,80" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                <polygon points="120,110 135,105 120,100" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                <polygon points="180,110 165,105 180,100" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                
                {/* Active path */}
                <path d="M50,75 L100,75 L120,75 L135,75 L150,75 L165,75 L180,75 L200,75 L250,75" 
                      stroke="#4ADE80" strokeWidth="2" fill="none" />
                <path d="M250,105 L200,105 L180,105 L165,105 L150,105 L135,105 L120,105 L100,105 L50,105" 
                      stroke="#4ADE80" strokeWidth="2" fill="none" strokeDasharray="3,2" />
                
                {/* Input/Output */}
                <text x="50" y="65" fill="#ccc" fontSize="10">+</text>
                <text x="50" y="115" fill="#ccc" fontSize="10">-</text>
                <text x="250" y="65" fill="#ccc" fontSize="10">+</text>
                <text x="250" y="115" fill="#ccc" fontSize="10">-</text>
                
                {/* Current flow indicators */}
                <circle cx="80" cy="75" r="3" fill="#4ADE80">
                  <animate attributeName="cx" values="60;100" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="140" cy="75" r="3" fill="#4ADE80">
                  <animate attributeName="cx" values="120;160" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="220" cy="75" r="3" fill="#4ADE80">
                  <animate attributeName="cx" values="200;240" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="220" cy="105" r="3" fill="#4ADE80">
                  <animate attributeName="cx" values="240;200" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="140" cy="105" r="3" fill="#4ADE80">
                  <animate attributeName="cx" values="160;120" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="80" cy="105" r="3" fill="#4ADE80">
                  <animate attributeName="cx" values="100;60" dur="1.5s" repeatCount="indefinite" />
                </circle>
                
                <text x="150" y="40" fill="#ccc" fontSize="10" textAnchor="middle">Positive Half-Cycle</text>
              </svg>
            </div>
            
            <h4 className="text-white font-semibold mb-3 mt-6">Operation During Negative Half-Cycle:</h4>
            <div className="flex justify-center mb-4">
              <svg width="300" height="150" viewBox="0 0 300 150">
                {/* Bridge Rectifier */}
                <rect x="100" y="50" width="100" height="80" rx="2" fill="#333" stroke="#ccc" strokeWidth="1" />
                
                {/* Diodes */}
                <polygon points="120,70 135,75 120,80" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                <polygon points="180,70 165,75 180,80" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                <polygon points="120,110 135,105 120,100" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                <polygon points="180,110 165,105 180,100" fill="#444" stroke="#ccc" strokeWidth="0.5" />
                
                {/* Active path */}
                <path d="M50,75 L100,75 L120,75 L135,75 L150,75 L165,75 L180,75 L200,75 L250,75" 
                      stroke="#F87171" strokeWidth="2" fill="none" strokeDasharray="3,2" />
                <path d="M250,105 L200,105 L180,105 L165,105 L150,105 L135,105 L120,105 L100,105 L50,105" 
                      stroke="#F87171" strokeWidth="2" fill="none" />
                
                {/* Input/Output */}
                <text x="50" y="65" fill="#ccc" fontSize="10">-</text>
                <text x="50" y="115" fill="#ccc" fontSize="10">+</text>
                <text x="250" y="65" fill="#ccc" fontSize="10">+</text>
                <text x="250" y="115" fill="#ccc" fontSize="10">-</text>
                
                {/* Current flow indicators */}
                <circle cx="80" cy="75" r="3" fill="#F87171">
                  <animate attributeName="cx" values="100;60" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="140" cy="75" r="3" fill="#F87171">
                  <animate attributeName="cx" values="160;120" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="220" cy="75" r="3" fill="#F87171">
                  <animate attributeName="cx" values="240;200" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="220" cy="105" r="3" fill="#F87171">
                  <animate attributeName="cx" values="200;240" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="140" cy="105" r="3" fill="#F87171">
                  <animate attributeName="cx" values="120;160" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="80" cy="105" r="3" fill="#F87171">
                  <animate attributeName="cx" values="60;100" dur="1.5s" repeatCount="indefinite" />
                </circle>
                
                <text x="150" y="40" fill="#ccc" fontSize="10" textAnchor="middle">Negative Half-Cycle</text>
              </svg>
            </div>
            
            <div className="bg-neutral-700 p-3 rounded mt-4">
              <p className="text-neutral-300 text-xs">During the positive half-cycle, diodes D1 and D3 conduct, while during the negative half-cycle, diodes D2 and D4 conduct. In both cases, current flows through the load in the same direction, producing a pulsating DC output.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Filtering the Output",
      description: "The output of a full wave rectifier is pulsating DC. A capacitor filter can be added to smooth the output.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-center mb-4">
              <svg width="400" height="200" viewBox="0 0 400 200">
                {/* Unfiltered output */}
                <text x="50" y="20" fill="#ccc" fontSize="12">Unfiltered Output</text>
                <path d="M50,100 C50,100 60,50 70,50 C80,50 90,100 100,100 C100,100 110,50 120,50 C130,50 140,100 150,100 C150,100 160,50 170,50 C180,50 190,100 200,100" 
                      fill="none" stroke="#F87171" strokeWidth="2" />
                
                {/* Capacitor */}
                <line x1="220" y1="80" x2="220" y2="120" stroke="#ccc" strokeWidth="1" />
                <path d="M220,80 C225,80 225,80 230,80 C235,80 235,80 240,80" stroke="#ccc" strokeWidth="1" fill="none" />
                <path d="M220,120 C225,120 225,120 230,120 C235,120 235,120 240,120" stroke="#ccc" strokeWidth="1" fill="none" />
                <text x="230" y="140" fill="#ccc" fontSize="10" textAnchor="middle">Filter</text>
                
                {/* Filtered output */}
                <text x="270" y="20" fill="#ccc" fontSize="12">Filtered Output</text>
                <path d="M270,50 C270,50 280,50 290,52 C300,54 310,60 320,65 C330,70 340,80 350,85 C360,90 370,95 380,97 C390,99 400,100 410,100" 
                      fill="none" stroke="#4ADE80" strokeWidth="2" />
                <path d="M270,50 C270,50 280,50 290,52 C300,54 310,60 320,65 C330,70 340,80 350,85 C360,90 370,95 380,97 C390,99 400,100 410,100" 
                      fill="none" stroke="#F87171" strokeWidth="1" strokeDasharray="3,2" />
                
                {/* Ripple */}
                <text x="350" y="40" fill="#ccc" fontSize="10">Ripple</text>
                <line x1="350" y1="45" x2="350" y2="85" stroke="#ccc" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="345" y1="65" x2="355" y2="65" stroke="#ccc" strokeWidth="1" />
                
                {/* Arrows */}
                <path d="M200,100 L220,100" fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />
                <path d="M240,100 L270,100" fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />
                
                {/* Arrowhead marker */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ccc" />
                  </marker>
                </defs>
                
                {/* Waveform labels */}
                <text x="125" y="180" fill="#F87171" fontSize="12" textAnchor="middle">Pulsating DC</text>
                <text x="340" y="180" fill="#4ADE80" fontSize="12" textAnchor="middle">Smoothed DC</text>
              </svg>
            </div>
            <div className="bg-neutral-700 p-3 rounded">
              <p className="text-neutral-300 text-xs mb-2">A capacitor filter works by:</p>
              <ol className="list-decimal pl-5 text-neutral-300 text-xs space-y-1">
                <li>Charging during the peak of the rectified waveform</li>
                <li>Discharging slowly when the rectified voltage drops</li>
                <li>Maintaining a more constant voltage across the load</li>
              </ol>
              <p className="text-neutral-300 text-xs mt-2">The remaining variation in the output voltage is called ripple. Larger capacitor values result in less ripple.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Performance Characteristics",
      description: "The performance of a full wave rectifier can be evaluated using several key parameters.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Key Performance Parameters:</h4>
            <div className="space-y-4">
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 3L16 7H14V11H18V9L22 12L18 15V13H14V17H16L13 21L10 17H12V13H8V15L4 12L8 9V11H12V7H10L13 3Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Rectification Efficiency</p>
                    <p className="text-neutral-300 text-xs">The ratio of DC power output to the AC power input. Full wave rectifiers have higher efficiency (81.2%) compared to half-wave rectifiers (40.6%).</p>
                    <p className="text-blue-300 text-xs mt-1 font-mono">η = (P<sub>DC</sub> / P<sub>AC</sub>) × 100%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 12H5M5 19L7 17M19 19L17 17M5 5L7 7M19 5L17 7M21 12H19M12 3V5M12 19V21M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Ripple Factor</p>
                    <p className="text-neutral-300 text-xs">The ratio of RMS value of AC component to the DC component in the output. Lower ripple factor indicates better filtering.</p>
                    <p className="text-green-300 text-xs mt-1 font-mono">r = V<sub>ripple(rms)</sub> / V<sub>DC</sub></p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-yellow-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Form Factor</p>
                    <p className="text-neutral-300 text-xs">The ratio of RMS value to the average value of the output. Ideal DC has a form factor of 1.</p>
                    <p className="text-yellow-300 text-xs mt-1 font-mono">FF = V<sub>rms</sub> / V<sub>avg</sub></p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Peak Inverse Voltage (PIV)</p>
                    <p className="text-neutral-300 text-xs">The maximum voltage a diode must withstand when it's not conducting. Important for selecting appropriate diodes.</p>
                    <p className="text-red-300 text-xs mt-1 font-mono">PIV = 2V<sub>m</sub> (for bridge rectifier)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-700 p-3 rounded">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 3.05493C6.50005 3.55238 3 7.36745 3 12C3 16.9706 7.02944 21 12 21C16.6326 21 20.4476 17.5 20.9451 13H11V3.05493Z" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20.4878 9H15V3.5123C17.5572 4.41613 19.5839 6.44285 20.4878 9Z" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Transformer Utilization Factor (TUF)</p>
                    <p className="text-neutral-300 text-xs">Indicates how effectively the transformer is utilized. Full wave rectifiers have higher TUF (0.693) than half-wave rectifiers (0.287).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return <AnimatedExperiment experimentId={6} title="Full Wave Rectifier" steps={steps} />
}


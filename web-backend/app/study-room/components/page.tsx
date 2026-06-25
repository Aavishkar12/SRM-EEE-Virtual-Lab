"use client"
import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Cpu, Search, Zap, Activity, Info, Link2, BookOpen, User } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Users, Settings, LogIn, FileQuestion, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SrmAccessGate } from "@/components/srm-access-gate"

// Mock Data - Ready for Admin Panel / API Integration
const components = [
  { 
    id: "resistor", 
    name: "Resistor", 
    category: "Passive Component", 
    icon: <Activity className="h-10 w-10 text-orange-400" />,
    color: "from-orange-500/20 to-red-500/5",
    border: "border-orange-500/30",
    description: "A passive two-terminal electrical component that implements electrical resistance as a circuit element. In electronic circuits, resistors are used to reduce current flow, adjust signal levels, to divide voltages, bias active elements, and terminate transmission lines.",
    specifications: [
      { label: "Symbol", value: "R" },
      { label: "Unit", value: "Ohm (Ω)" },
      { label: "Formula", value: "V = I × R" },
    ],
    usage: "Used in voltage dividers, current limiters, and pull-up/pull-down networks."
  },
  { 
    id: "diode", 
    name: "PN Junction Diode", 
    category: "Active Component", 
    icon: <Zap className="h-10 w-10 text-blue-400" />,
    color: "from-blue-500/20 to-cyan-500/5",
    border: "border-blue-500/30",
    description: "A two-terminal electronic component that conducts current primarily in one direction (asymmetric conductance); it has low (ideally zero) resistance in one direction, and high (ideally infinite) resistance in the other.",
    specifications: [
      { label: "Symbol", value: "D" },
      { label: "Forward Voltage Drop", value: "~0.7V (Silicon)" },
      { label: "Terminals", value: "Anode (+), Cathode (-)" },
    ],
    usage: "Used in rectifiers, signal limiters, voltage regulators, and switches."
  },
  { 
    id: "zener", 
    name: "Zener Diode", 
    category: "Active Component", 
    icon: <Zap className="h-10 w-10 text-purple-400" />,
    color: "from-purple-500/20 to-fuchsia-500/5",
    border: "border-purple-500/30",
    description: "A special type of diode designed to reliably allow current to flow \"backwards\" when a certain set reverse voltage, known as the Zener voltage, is reached.",
    specifications: [
      { label: "Symbol", value: "Z" },
      { label: "Key Property", value: "Reverse breakdown" },
      { label: "Region of Operation", value: "Reverse bias" },
    ],
    usage: "Primarily used as voltage regulators and over-voltage protectors."
  },
  { 
    id: "ic741", 
    name: "LM741 Op-Amp", 
    category: "Integrated Circuit", 
    icon: <Cpu className="h-10 w-10 text-emerald-400" />,
    color: "from-emerald-500/20 to-teal-500/5",
    border: "border-emerald-500/30",
    description: "A general-purpose operational amplifier which features improved performance over industry standards. It is a DC-coupled high-gain electronic voltage amplifier with a differential input and, usually, a single-ended output.",
    specifications: [
      { label: "Pins", value: "8-pin DIP" },
      { label: "Supply Voltage", value: "±15V (Typical)" },
      { label: "Input", value: "Inverting (2), Non-inverting (3)" },
    ],
    usage: "Used in comparators, oscillators, filters, mathematical operations, and amplifiers."
  },
  { 
    id: "ic7408", 
    name: "7408 AND Gate", 
    category: "Logic IC", 
    icon: <Cpu className="h-10 w-10 text-pink-400" />,
    color: "from-pink-500/20 to-rose-500/5",
    border: "border-pink-500/30",
    description: "A Quad 2-Input AND Gate IC. It contains four independent gates each of which performs the logic AND function.",
    specifications: [
      { label: "Family", value: "TTL (Transistor-Transistor Logic)" },
      { label: "Supply Voltage", value: "5V" },
      { label: "Pins", value: "14-pin DIP" },
    ],
    usage: "Used in digital logic circuits where two high inputs are required to produce a high output."
  },
]

export default function ComponentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedComponent, setSelectedComponent] = useState(components[0])

  const filteredComponents = components.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const dockItems = [
    { title: "Home", icon: <Home className="h-full w-full text-neutral-300" />, href: "/" },
    { title: "Experiments", icon: <BookOpen className="h-full w-full text-neutral-300" />, href: "/experiments" },
    { title: "Study Room", icon: <Library className="h-full w-full text-neutral-300" />, href: "/study-room" },
    { title: "Quizzes", icon: <FileQuestion className="h-full w-full text-neutral-300" />, href: "/quizzes" },
    { title: "Team", icon: <Users className="h-full w-full text-neutral-300" />, href: "/team" },
    { title: "About", icon: <Info className="h-full w-full text-neutral-300" />, href: "/about" },
    { title: "Profile", icon: <User className="h-full w-full text-neutral-300" />, href: "/profile" }, { title: "Settings", icon: <Settings className="h-full w-full text-neutral-300" />, href: "/settings" },
    { title: "Sign In", icon: <LogIn className="h-full w-full text-neutral-300" />, href: "/signin" },
  ]

  return (
    <SrmAccessGate
      title="SRM academic resource access"
      description="The component guide is visible only to signed-in SRM users."
    >
    <div className="text-white selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 pb-32">
        {/* Header */}
        <div className="mb-12">
          <Link href="/study-room" className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Room
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
                Interactive Component Guide
              </h1>
              <p className="text-neutral-400 max-w-2xl text-lg">
                Explore the specifications, symbols, and practical uses of every electronic component featured in the virtual lab.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative w-full mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-500" />
              </div>
              <Input
                type="text"
                placeholder="Search components..."
                className="pl-10 bg-neutral-900/50 border-neutral-800 text-white w-full focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredComponents.map((component) => (
                <button
                  key={component.id}
                  onClick={() => setSelectedComponent(component)}
                  className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${
                    selectedComponent.id === component.id 
                      ? 'bg-neutral-800 border-l-4 border-orange-500 text-white shadow-lg shadow-black/50' 
                      : 'bg-neutral-900/40 border border-transparent hover:bg-neutral-900 hover:border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${component.color} ${selectedComponent.id === component.id ? 'opacity-100' : 'opacity-70'}`}>
                    {component.icon}
                  </div>
                  <div>
                    <h3 className={`font-medium ${selectedComponent.id === component.id ? 'text-white' : 'text-neutral-300'}`}>
                      {component.name}
                    </h3>
                    <p className="text-xs text-neutral-500">{component.category}</p>
                  </div>
                </button>
              ))}
              
              {filteredComponents.length === 0 && (
                <p className="text-neutral-500 text-center py-8">No components found.</p>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedComponent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-neutral-900/30 border border-neutral-800 rounded-2xl overflow-hidden h-full flex flex-col"
              >
                <div className={`p-8 bg-gradient-to-br ${selectedComponent.color} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4 scale-150">
                    {selectedComponent.icon}
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
                      {selectedComponent.icon}
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-black/40 rounded-full text-white/80 text-xs font-medium backdrop-blur-md border border-white/10 mb-3 inline-block">
                        {selectedComponent.category}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {selectedComponent.name}
                      </h2>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-neutral-400" /> Description
                    </h3>
                    <p className="text-neutral-300 leading-relaxed">
                      {selectedComponent.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-neutral-400" /> Key Specifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedComponent.specifications.map((spec, i) => (
                        <div key={i} className="bg-black/50 p-4 rounded-xl border border-neutral-800">
                          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{spec.label}</p>
                          <p className="text-white font-medium">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-neutral-800/60">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Link2 className="h-5 w-5 text-neutral-400" /> Practical Application
                    </h3>
                    <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-xl">
                      <p className="text-orange-200">
                        {selectedComponent.usage}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} className="w-auto" mobileClassName="w-auto" />
      </div>
    </div>
    </SrmAccessGate>
  )
}

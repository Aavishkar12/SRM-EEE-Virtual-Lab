"use client"
import { NavDock } from "@/components/nav-dock"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Zap, Lightbulb, Cpu, ChevronRight, CircuitBoard, Activity, Pencil } from "lucide-react"
import { GlowingCard } from "@/components/glowing-card"
import { DigitalClock } from "@/components/digital-clock"
import { Input } from "@/components/ui/input"

// Hardcoded fallback data (used when API is unavailable)
const fallbackExperiments = [
  { id: 1, title: "Kirchhoff's Voltage Law", description: "Verify KVL in a closed-loop DC circuit. Measure voltage drops across resistors and confirm the algebraic sum equals zero.", category: "Circuit Analysis", difficulty: "Beginner", duration: "45 min", embedId: "hNWAhAfShmV" },
  { id: 2, title: "Thevenin's Theorem", description: "Replace a complex linear circuit with its Thevenin equivalent (V_TH and R_TH) and verify load current.", category: "Circuit Analysis", difficulty: "Intermediate", duration: "60 min", embedId: "lAusQJ3m4bF" },
  { id: 3, title: "PN Junction Diode Characteristics", description: "Plot V-I characteristics of a PN junction diode in forward and reverse bias modes.", category: "Analog Electronics", difficulty: "Beginner", duration: "60 min", embedId: "" },
  { id: 4, title: "Full Wave Rectifier", description: "Build a bridge rectifier using 4 IN4007 diodes. Observe output waveforms with and without a filter capacitor.", category: "Analog Electronics", difficulty: "Intermediate", duration: "60 min", embedId: "jbRQbeSnAzj" },
  { id: 5, title: "Clipper Circuit", description: "Study series and parallel clipping circuits using diodes and observe how they limit signal amplitude.", category: "Analog Electronics", difficulty: "Intermediate", duration: "60 min", embedId: "" },
  { id: 6, title: "Op-Amp Inverting / Non-Inverting Amplifier", description: "Design inverting and non-inverting amplifier circuits using LM741 Op-Amp and verify gain experimentally.", category: "Analog Electronics", difficulty: "Advanced", duration: "75 min", embedId: "" },
  { id: 7, title: "Basic Logic Gates", description: "Implement AND, OR, NOT, NAND, NOR, XOR, XNOR gates using ICs and verify truth tables experimentally.", category: "Digital Electronics", difficulty: "Beginner", duration: "60 min", embedId: "" },
  { id: 8, title: "Half Adder & Full Adder", description: "Design and implement Half Adder and Full Adder circuits using logic gates. Verify sum and carry outputs.", category: "Digital Electronics", difficulty: "Intermediate", duration: "75 min", embedId: "" },
  { id: 9, title: "Energy Measurement", description: "Measure electrical energy consumption using a single-phase energy meter. Calculate units consumed by different loads.", category: "Electrical Machines", difficulty: "Beginner", duration: "45 min", embedId: "" },
  { id: 10, title: "House Wiring", description: "Implement residential wiring with energy meter, MCB, switches, lamp, and fan. Read energy meter in kWh.", category: "Electrical Installation", difficulty: "Intermediate", duration: "90 min", embedId: "2rTQ63Z8SdD" },
  { id: 11, title: "Fluorescent Lamp Wiring", description: "Connect a 40W fluorescent lamp with choke and starter. Understand the role of each component.", category: "Electrical Installation", difficulty: "Intermediate", duration: "60 min", embedId: "hnFoQc772H0" },
  { id: 12, title: "Staircase Wiring", description: "Control a lamp from two locations using two-way switches. Understand SPDT switch operation.", category: "Electrical Installation", difficulty: "Intermediate", duration: "75 min", embedId: "94YWeHFB9oN" },
]

type Experiment = typeof fallbackExperiments[0]

const categoryColors: Record<string, string> = {
  "Circuit Analysis": "text-blue-400",
  "Analog Electronics": "text-cyan-400",
  "Digital Electronics": "text-green-400",
  "Electrical Machines": "text-orange-400",
  "Electrical Installation": "text-yellow-400",
}

export default function ExperimentsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"
  const [experiments, setExperiments] = useState<Experiment[]>(fallbackExperiments)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredExperiments, setFilteredExperiments] = useState<Experiment[]>(fallbackExperiments)

  useEffect(() => {
    fetch("/api/experiments")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Deduplicate by numeric id (guards against double-seeded MongoDB)
          const seen = new Set<number>()
          const unique = data.filter((e: any) => {
            if (seen.has(e.id)) return false
            seen.add(e.id)
            return true
          })
          setExperiments(unique)
          setFilteredExperiments(unique)
        }
      })
      .catch(() => {})
  }, [])

  const categories = ["All", ...Array.from(new Set(experiments.map((e) => e.category)))]

  useEffect(() => {
    let filtered = experiments
    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (activeCategory !== "All") {
      filtered = filtered.filter((exp) => exp.category === activeCategory)
    }
    setFilteredExperiments(filtered)
  }, [searchTerm, activeCategory, experiments])

  return (
    <div className="flex flex-col bg-[#050508] text-white min-h-screen overflow-x-hidden">
      <NavDock />
      <DigitalClock />

      {/* ── HERO ── */}
      <div className="relative pt-28 sm:pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
            <Link href="/" className="hover:text-neutral-300 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-neutral-300">Experiments</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-4">
                <Zap className="h-3.5 w-3.5" />
                26EEE1001T — All Lab Experiments
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3">
                Lab Experiments
              </h1>
              <p className="text-neutral-400 max-w-xl text-base">
                12 interactive experiments covering circuit analysis, analog electronics, digital electronics, electrical machines, and wiring.
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search experiments..."
                  className="pl-10 bg-neutral-900/80 border-neutral-700/60 text-white placeholder:text-neutral-500 focus:border-blue-500/50 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-blue-600/25 border-blue-500/50 text-blue-200"
                    : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({experiments.filter((e) => e.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results info */}
          <div className="text-neutral-500 text-sm mb-6">
            Showing <span className="text-neutral-300 font-medium">{filteredExperiments.length}</span> of {experiments.length}{" "}
            experiments
            {activeCategory !== "All" && (
              <span>
                {" "}
                in{" "}
                <span className={`font-medium ${categoryColors[activeCategory] || "text-blue-300"}`}>
                  {activeCategory}
                </span>
              </span>
            )}
          </div>

          {/* Experiment Grid */}
          <AnimatePresence mode="popLayout">
            {filteredExperiments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 text-neutral-500"
              >
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No experiments found for "{searchTerm}"</p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setActiveCategory("All")
                  }}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.ul layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExperiments.map((experiment, i) => (
                  <motion.div
                    key={(experiment as any)._id?.toString() || `exp-${experiment.id}-${i}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative group/card"
                  >
                    <GlowingCard
                      href={`/experiments/${experiment.id}`}
                      experimentId={experiment.id}
                      title={experiment.title}
                      description={experiment.description}
                      category={experiment.category}
                      difficulty={experiment.difficulty}
                      duration={experiment.duration}
                    />
                    {isAdmin && (
                      <Link
                        href={`/admin?tab=experiments&edit=${experiment.id}`}
                        className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-neutral-900/90 border border-neutral-700 text-neutral-400 hover:border-blue-500/60 hover:text-blue-300 hover:bg-blue-900/20 backdrop-blur-sm"
                        title="Edit in Admin Panel"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── STATS SECTION ── */}
      <div className="w-full py-16 bg-gradient-to-b from-[#050508] to-[#0a0f1e]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: String(experiments.length), label: "Experiments" },
              { value: String(new Set(experiments.map((e) => e.category)).size), label: "Subject Areas" },
              { value: String(experiments.filter((e) => e.embedId).length), label: "Tinkercad Sims" },
              { value: "100%", label: "Interactive" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-neutral-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="w-full py-10 bg-black border-t border-neutral-900">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-neutral-500 text-sm">
              <span className="text-white font-semibold">SRM EEE Virtual Lab</span> · 26EEE1001T
            </div>
            <div className="flex gap-6">
              {[
                { label: "Home", href: "/" },
                { label: "Quizzes", href: "/quizzes" },
                { label: "Team", href: "/team" },
                { label: "About", href: "/about" },
                { label: "Developers", href: "/developers" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-neutral-500 hover:text-neutral-200 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-neutral-900 text-center text-neutral-600 text-xs">
            © {new Date().getFullYear()} SRM Institute of Science and Technology. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

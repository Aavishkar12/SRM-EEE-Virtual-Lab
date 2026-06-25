"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  BookOpen, Calendar, Bot, GraduationCap, Library, FileText,
  ArrowRight, Zap, FlaskConical, Calculator, Video, BookMarked,
  Brain, Lightbulb, Clock, Star, TrendingUp, BarChart2,
  Wifi, Award, ChevronRight, Plus, Trash2, Pencil, X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DigitalClock } from "@/components/digital-clock"
import { DynamicSidebar } from "@/components/dynamic-sidebar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const defaultAcademicTools = [
  {
    id: 1,
    title: "EEE PYQs",
    description: "Previous year question papers with solutions for all semesters. Filter by year, unit, and topic.",
    icon: "FileText",
    href: "/study-room/pyqs",
    color: "bg-blue-500/8 border-blue-500/20 hover:bg-blue-500/15 hover:border-blue-500/40",
    tag: "View Papers"
  },
  {
    id: 2,
    title: "CT Schedules",
    description: "Cycle Test dates, syllabus coverage, and important exam deadlines for 26EEE1001T.",
    icon: "Calendar",
    href: "/study-room/schedules",
    color: "bg-emerald-500/8 border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/40",
    tag: "View Schedule"
  },
  {
    id: 3,
    title: "Formula Cheat Sheet",
    description: "Quick-reference formulas for KVL, KCL, Thevenin, diode equations, logic gates, and more.",
    icon: "Calculator",
    href: "/study-room/formula-sheet",
    color: "bg-yellow-500/8 border-yellow-500/20 hover:bg-yellow-500/15 hover:border-yellow-500/40",
    tag: "View Formulas"
  },
  {
    id: 4,
    title: "Reference Books",
    description: "Digital library of recommended textbooks and reference materials for 26EEE1001T.",
    icon: "Library",
    href: "/study-room/books",
    color: "bg-amber-500/8 border-amber-500/20 hover:bg-amber-500/15 hover:border-amber-500/40",
    tag: "Browse Library"
  },
  {
    id: 5,
    title: "Lecture Notes & Slides",
    description: "Unit-wise lecture notes, slides, and study materials. Download PDFs for offline study.",
    icon: "BookOpen",
    href: "/study-room/notes",
    color: "bg-pink-500/8 border-pink-500/20 hover:bg-pink-500/15 hover:border-pink-500/40",
    tag: "View Notes"
  },
  {
    id: 6,
    title: "Video Tutorials",
    description: "Curated YouTube playlists for every experiment — from theory to practical demonstration.",
    icon: "Video",
    href: "/study-room/videos",
    color: "bg-red-500/8 border-red-500/20 hover:bg-red-500/15 hover:border-red-500/40",
    tag: "Watch Videos"
  },
  {
    id: 7,
    title: "Lab Manual",
    description: "Complete digital version of the SRM EEE Virtual Lab Manual with all procedures, apparatus, and circuits.",
    icon: "BookMarked",
    href: "/study-room/manual",
    color: "bg-indigo-500/8 border-indigo-500/20 hover:bg-indigo-500/15 hover:border-indigo-500/40",
    tag: "Read Manual"
  },
  {
    id: 8,
    title: "Component Guide",
    description: "Learn about every component used in the lab — resistors, diodes, op-amps, logic ICs, and more.",
    icon: "Lightbulb",
    href: "/study-room/components",
    color: "bg-orange-500/8 border-orange-500/20 hover:bg-orange-500/15 hover:border-orange-500/40",
    tag: "Interactive"
  },
]

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-7 w-7 text-blue-400" />,
  Calendar: <Calendar className="h-7 w-7 text-emerald-400" />,
  Calculator: <Calculator className="h-7 w-7 text-yellow-400" />,
  Library: <Library className="h-7 w-7 text-amber-400" />,
  BookOpen: <BookOpen className="h-7 w-7 text-pink-400" />,
  Video: <Video className="h-7 w-7 text-red-400" />,
  BookMarked: <BookMarked className="h-7 w-7 text-indigo-400" />,
  Lightbulb: <Lightbulb className="h-7 w-7 text-orange-400" />,
}

function getIcon(name: string) {
  return iconMap[name] || <FileText className="h-7 w-7 text-blue-400" />
}

const featuredTools = [
  {
    title: "MyAI Lab Assistant",
    description: "Ask any EEE concept — get instant explanations, solve circuit problems, generate practice questions, and get step-by-step help.",
    icon: <Bot className="h-10 w-10 text-violet-400" />,
    href: "/study-room/ai-assistant",
    color: "from-violet-900/30 to-purple-900/10",
    border: "border-violet-500/30 hover:border-violet-400/60",
    badge: "AI Powered",
    badgeColor: "bg-violet-500/20 text-violet-300",
  },
  {
    title: "Virtual Lab Experiments",
    description: "Perform all 12 interactive lab experiments virtually with real-time simulations, truth tables, oscilloscopes, and circuit builders.",
    icon: <FlaskConical className="h-10 w-10 text-cyan-400" />,
    href: "/experiments",
    color: "from-cyan-900/30 to-blue-900/10",
    border: "border-cyan-500/30 hover:border-cyan-400/60",
    badge: "12 Labs",
    badgeColor: "bg-cyan-500/20 text-cyan-300",
  },
  {
    title: "Practice Quizzes",
    description: "Test yourself with topic-wise MCQ quizzes for all 12 experiments. Instant feedback and explanations for every answer.",
    icon: <Brain className="h-10 w-10 text-green-400" />,
    href: "/quizzes",
    color: "from-green-900/30 to-emerald-900/10",
    border: "border-green-500/30 hover:border-green-400/60",
    badge: "12 Quizzes",
    badgeColor: "bg-green-500/20 text-green-300",
  },
]

const stats = [
  { value: "12", label: "Experiments", icon: <FlaskConical className="h-5 w-5" />, color: "text-cyan-400" },
  { value: "12", label: "Quizzes", icon: <Brain className="h-5 w-5" />, color: "text-green-400" },
  { value: "AI", label: "Assistant", icon: <Bot className="h-5 w-5" />, color: "text-violet-400" },
  { value: "24/7", label: "Access", icon: <Wifi className="h-5 w-5" />, color: "text-blue-400" },
]

export default function StudyRoomPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Admin Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "FileText",
    href: "",
    colorScheme: "blue",
    tag: "",
  })

  const colorSchemes: Record<string, string> = {
    blue: "bg-blue-500/8 border-blue-500/20 hover:bg-blue-500/15 hover:border-blue-500/40",
    emerald: "bg-emerald-500/8 border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/40",
    yellow: "bg-yellow-500/8 border-yellow-500/20 hover:bg-yellow-500/15 hover:border-yellow-500/40",
    amber: "bg-amber-500/8 border-amber-500/20 hover:bg-amber-500/15 hover:border-amber-500/40",
    pink: "bg-pink-500/8 border-pink-500/20 hover:bg-pink-500/15 hover:border-pink-500/40",
    red: "bg-red-500/8 border-red-500/20 hover:bg-red-500/15 hover:border-red-500/40",
    indigo: "bg-indigo-500/8 border-indigo-500/20 hover:bg-indigo-500/15 hover:border-indigo-500/40",
    orange: "bg-orange-500/8 border-orange-500/20 hover:bg-orange-500/15 hover:border-orange-500/40",
  }

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/study-room/resources")
      if (res.ok) {
        const data = await res.json()
        setResources(data)
      } else {
        setResources(defaultAcademicTools)
      }
    } catch (err) {
      setResources(defaultAcademicTools)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const handleEdit = (resource: any) => {
    setEditingId(resource.id)
    let colorName = "blue"
    for (const [name, value] of Object.entries(colorSchemes)) {
      if (value === resource.color) {
        colorName = name
        break
      }
    }

    setFormData({
      title: resource.title,
      description: resource.description,
      icon: resource.icon,
      href: resource.href,
      colorScheme: colorName,
      tag: resource.tag,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resource?")) return
    try {
      const res = await fetch(`/api/study-room/resources?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Resource deleted successfully.")
        fetchResources()
      } else {
        toast.error("Failed to delete resource.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.href || !formData.tag) {
      toast.error("Please fill in all fields.")
      return
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      href: formData.href,
      color: colorSchemes[formData.colorScheme] || colorSchemes.blue,
      tag: formData.tag,
    }

    try {
      let res
      if (editingId) {
        res = await fetch("/api/study-room/resources", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
      } else {
        res = await fetch("/api/study-room/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        toast.success(editingId ? "Resource updated successfully." : "New resource added successfully.")
        setIsModalOpen(false)
        setEditingId(null)
        setFormData({
          title: "",
          description: "",
          icon: "FileText",
          href: "",
          colorScheme: "blue",
          tag: "",
        })
        fetchResources()
      } else {
        toast.error("Failed to save resource.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const openAddModal = () => {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      icon: "FileText",
      href: "",
      colorScheme: "blue",
      tag: "",
    })
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-blue-500/30 selection:text-blue-200">
      <DynamicSidebar />
      <DigitalClock />

      <main className="pl-0 md:pl-16 pt-20 pb-20 min-h-screen">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8 pt-4">
            <Link href="/" className="hover:text-neutral-300 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-neutral-300">Study Room</span>
          </div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-4">
              <BookMarked className="h-3.5 w-3.5" />
              26EEE1001T — All Study Resources
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
                  Study Room
                </h1>
                <p className="text-white/50 text-lg max-w-2xl">
                  Everything you need to ace your EEE lab — AI assistance, virtual experiments, quizzes, notes, and more.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                <div className={`${s.color} opacity-80`}>{s.icon}</div>
                <div>
                  <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-neutral-500">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Featured Tools (Big Cards) */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Featured Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredTools.map((tool, i) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <Link href={tool.href} className="block h-full group">
                    <div className={`h-full rounded-2xl border ${tool.border} bg-gradient-to-br ${tool.color} p-6 transition-all duration-300 flex flex-col backdrop-blur-sm`}>
                      <div className="flex items-start justify-between mb-5">
                        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                          {tool.icon}
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed mb-6 flex-grow">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
                        Open <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Academic Resources (Smaller Cards) */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Academic Resources
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-44 rounded-xl border border-white/5 bg-white/1 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {resources.map((tool, i) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 + 0.3 }}
                  >
                    <div className={`h-full rounded-xl border ${tool.color} p-5 transition-all duration-300 flex flex-col group relative overflow-hidden bg-neutral-900/30`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 rounded-lg bg-white/5">
                          {getIcon(tool.icon)}
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <button
                                onClick={(e) => { e.preventDefault(); handleEdit(tool); }}
                                className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/25 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => { e.preventDefault(); handleDelete(tool.id); }}
                                className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                          <span className="text-xs text-neutral-500 bg-neutral-800/60 px-2 py-0.5 rounded-full">
                            {tool.tag}
                          </span>
                        </div>
                      </div>
                      <Link href={tool.href} className="flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="text-white/35 text-xs leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-medium text-white/30 group-hover:text-white/70 transition-colors">
                          Explore <ArrowRight className="ml-1.5 w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Tip Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 flex flex-col md:flex-row items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-blue-500/10 shrink-0">
              <Award className="h-7 w-7 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Pro Tip: Use the AI Assistant before your lab session</h3>
              <p className="text-neutral-400 text-sm">Ask the AI to explain the theory and predict the expected results before you do the actual experiment. It drastically improves your understanding and lab report quality!</p>
            </div>
            <Link href="/study-room/ai-assistant" className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <Bot className="h-4 w-4" />
              Try AI Assistant
            </Link>
          </motion.div>

        </div>
      </main>

      {/* Admin Add/Edit Resource Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-2xl backdrop-blur-md z-10"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold mb-4 text-white">
                {editingId ? "Edit Academic Resource" : "Add Academic Resource"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Title</label>
                  <Input
                    placeholder="e.g. EEE PYQs"
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    className="bg-neutral-950/50 border-neutral-800 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Description</label>
                  <Textarea
                    placeholder="e.g. Access a comprehensive archive..."
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    className="bg-neutral-950/50 border-neutral-800 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">URL path (href)</label>
                    <Input
                      placeholder="e.g. /study-room/pyqs"
                      value={formData.href}
                      onChange={(e) => setFormData(p => ({ ...p, href: e.target.value }))}
                      className="bg-neutral-950/50 border-neutral-800 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Card Tag</label>
                    <Input
                      placeholder="e.g. View Papers"
                      value={formData.tag}
                      onChange={(e) => setFormData(p => ({ ...p, tag: e.target.value }))}
                      className="bg-neutral-950/50 border-neutral-800 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Icon Style</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData(p => ({ ...p, icon: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FileText">File & Question Icon</option>
                    <option value="Calendar">Calendar & schedules Icon</option>
                    <option value="Calculator">Calculator & formula Icon</option>
                    <option value="Library">Library & books Icon</option>
                    <option value="BookOpen">Open Book & notes Icon</option>
                    <option value="Video">Video player Icon</option>
                    <option value="BookMarked">Manual & bookmarks Icon</option>
                    <option value="Lightbulb">Lightbulb & guides Icon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">Color Theme</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(colorSchemes).map((color) => {
                      const colorClasses: Record<string, string> = {
                        blue: "bg-blue-500 border-blue-400",
                        emerald: "bg-emerald-500 border-emerald-400",
                        yellow: "bg-yellow-500 border-yellow-400",
                        amber: "bg-amber-500 border-amber-400",
                        pink: "bg-pink-500 border-pink-400",
                        red: "bg-red-500 border-red-400",
                        indigo: "bg-indigo-500 border-indigo-400",
                        orange: "bg-orange-500 border-orange-400",
                      }
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, colorScheme: color }))}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${colorClasses[color] || ""} ${formData.colorScheme === color ? "scale-125 ring-2 ring-white" : "opacity-60 hover:opacity-100"}`}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-neutral-800 text-sm font-semibold text-neutral-400 hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

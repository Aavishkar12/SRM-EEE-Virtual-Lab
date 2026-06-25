"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, BookOpen, Download, FileText, ChevronDown, Layers, User, Pencil, Trash2, Upload } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Users, Info, Settings, LogIn, FileQuestion, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SrmAccessGate } from "@/components/srm-access-gate"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const UNIT_DESCRIPTIONS: Record<string, string> = {
  "Unit 1: DC Circuits": "Fundamental concepts, Ohm's law, Kirchhoff's laws, Nodal and Mesh analysis.",
  "Unit 2: AC Circuits": "Sinusoidal steady-state analysis, phasors, impedance, power in AC circuits.",
  "Unit 3: Electrical Machines": "Principles of DC machines, Transformers, and Induction Motors.",
  "Unit 4: Semiconductor Devices": "PN junction diodes, Zener diodes, BJT and FET transistors.",
  "Unit 5: Digital Electronics": "Number systems, Logic gates, Boolean algebra, Combinational circuits."
}

const DEFAULT_UNITS = [
  "Unit 1: DC Circuits",
  "Unit 2: AC Circuits",
  "Unit 3: Electrical Machines",
  "Unit 4: Semiconductor Devices",
  "Unit 5: Digital Electronics"
]

export default function NotesPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedUnit, setExpandedUnit] = useState<string | null>("Unit 1: DC Circuits")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    unit: "Unit 1: DC Circuits",
    title: "",
    type: "Notes",
    date: "",
    url: ""
  })

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/study-room/notes")
      if (res.ok) {
        const data = await res.json()
        setNotes(data)
      } else {
        toast.error("Failed to load lecture notes.")
      }
    } catch (err) {
      toast.error("An error occurred loading notes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // Group notes by unit
  const groupedNotes: Record<string, any[]> = {}
  notes.forEach((note) => {
    const unitName = note.unit || "Other Notes"
    if (!groupedNotes[unitName]) {
      groupedNotes[unitName] = []
    }
    groupedNotes[unitName].push(note)
  })

  // Get all unique units to display in order, starting with DEFAULT_UNITS
  const allUnits = Array.from(new Set([...DEFAULT_UNITS, ...Object.keys(groupedNotes)]))

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      unit: "Unit 1: DC Circuits",
      title: "",
      type: "Notes",
      date: "",
      url: ""
    })
  }

  const handleEdit = (note: any) => {
    setEditingId(note.id)
    setFormData({
      unit: note.unit || "Unit 1: DC Circuits",
      title: note.title || "",
      type: note.type || "Notes",
      date: note.date || "",
      url: note.url || ""
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSave = async () => {
    if (!isAdmin) return

    if (!formData.title || !formData.unit || !formData.date) {
      toast.error("Please fill in Title, Unit, and Date before saving.")
      return
    }

    try {
      let res
      if (editingId) {
        res = await fetch("/api/study-room/notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
      } else {
        res = await fetch("/api/study-room/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }

      if (res.ok) {
        toast.success(editingId ? "Lecture note updated successfully." : "New lecture note uploaded successfully.")
        resetForm()
        fetchNotes()
      } else {
        toast.error("Failed to save lecture note.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this lecture note/slide?")) return

    try {
      const res = await fetch(`/api/study-room/notes?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Lecture note deleted successfully.")
        if (editingId === id) {
          resetForm()
        }
        fetchNotes()
      } else {
        toast.error("Failed to delete lecture note.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const toggleUnit = (unit: string) => {
    setExpandedUnit(expandedUnit === unit ? null : unit)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Slides":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20"
      case "Notes":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "Worksheet":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700"
    }
  }

  const dockItems = [
    { title: "Home", icon: <Home className="h-full w-full text-neutral-300" />, href: "/" },
    { title: "Experiments", icon: <BookOpen className="h-full w-full text-neutral-300" />, href: "/experiments" },
    { title: "Study Room", icon: <Library className="h-full w-full text-neutral-300" />, href: "/study-room" },
    { title: "Quizzes", icon: <FileQuestion className="h-full w-full text-neutral-300" />, href: "/quizzes" },
    { title: "Team", icon: <Users className="h-full w-full text-neutral-300" />, href: "/team" },
    { title: "About", icon: <Info className="h-full w-full text-neutral-300" />, href: "/about" },
    { title: "Profile", icon: <User className="h-full w-full text-neutral-300" />, href: "/profile" },
    { title: "Settings", icon: <Settings className="h-full w-full text-neutral-300" />, href: "/settings" },
    { title: "Sign In", icon: <LogIn className="h-full w-full text-neutral-300" />, href: "/signin" },
  ]

  return (
    <SrmAccessGate
      title="SRM academic resource access"
      description="Lecture notes and slides are visible only after signing in with an SRM email. Admins can manage notes and slides dynamically."
    >
    <div className="text-white selection:bg-pink-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 pb-32">
        {/* Header */}
        <div className="mb-12">
          <Link href="/study-room" className="inline-flex items-center text-pink-400 hover:text-pink-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Room
          </Link>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
            Lecture Notes & Slides
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Access unit-wise presentations, handwritten notes, and practice worksheets provided by the faculty.
          </p>
        </div>

        {/* Dynamic Admin Notification */}
        <div className="mb-8 rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5">
          <p className="text-sm text-neutral-300">
            Signed in as <span className="font-medium text-white">{session?.user?.email}</span>.
            {isAdmin
              ? " You have admin access to upload and edit notes under specific unit categories."
              : " You can read and download notes, but only admins can manage them."}
          </p>
        </div>

        {/* Admin Notes Creator Form */}
        {isAdmin && (
          <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-300">
              <Upload className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Admin Notes Manager</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Note / Material Title" value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Date Added (e.g. Aug 15 or Jun 2026)" value={formData.date} onChange={(e) => setFormData((current) => ({ ...current, date: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              
              <select
                className="bg-neutral-900/60 border border-neutral-700 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                value={formData.unit}
                onChange={(e) => setFormData((current) => ({ ...current, unit: e.target.value }))}
              >
                {DEFAULT_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
                {!DEFAULT_UNITS.includes(formData.unit) && (
                  <option value={formData.unit}>{formData.unit}</option>
                )}
              </select>

              <select
                className="bg-neutral-900/60 border border-neutral-700 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                value={formData.type}
                onChange={(e) => setFormData((current) => ({ ...current, type: e.target.value }))}
              >
                <option value="Notes">Notes</option>
                <option value="Slides">Slides</option>
                <option value="Worksheet">Worksheet</option>
              </select>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Document URL / Local File</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <Input 
                    placeholder="Document URL (e.g. Google Drive Link)" 
                    value={formData.url} 
                    onChange={(e) => setFormData((current) => ({ ...current, url: e.target.value }))} 
                    className="bg-neutral-900/60 border-neutral-700 text-white flex-grow" 
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      id="note-file-upload" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        
                        const loadingToast = toast.loading("Uploading file to server...")
                        const body = new FormData()
                        body.append("file", file)
                        
                        try {
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body,
                          })
                          if (res.ok) {
                            const data = await res.json()
                            setFormData((current) => ({ ...current, url: data.url }))
                            toast.success(`Uploaded successfully: ${file.name}`, { id: loadingToast })
                          } else {
                            toast.error("Upload failed.", { id: loadingToast })
                          }
                        } catch (err) {
                          toast.error("Upload encountered an error.", { id: loadingToast })
                        }
                      }}
                    />
                    <label 
                      htmlFor="note-file-upload" 
                      className="flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-700 cursor-pointer whitespace-nowrap h-full"
                    >
                      <Upload className="h-4 w-4 text-blue-400" />
                      Choose Local File
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={handleSave} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                {editingId ? "Update Material" : "Upload Lecture Material"}
              </button>
              <button onClick={resetForm} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800">
                Clear Form
              </button>
            </div>
          </div>
        )}

        {/* Accordion List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl border border-white/5 bg-white/1 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {allUnits.map((unitName, index) => {
              const materials = groupedNotes[unitName] || []
              const isExpanded = expandedUnit === unitName
              const description = UNIT_DESCRIPTIONS[unitName] || "Lecture slides, course notes, and practice materials."

              return (
                <motion.div
                  key={unitName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? "border-pink-500/50 bg-neutral-900/40 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                      : "border-neutral-800 bg-neutral-900/20 hover:border-neutral-700 hover:bg-neutral-900/30"
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    className="w-full flex items-center justify-between p-6 text-left"
                    onClick={() => toggleUnit(unitName)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg transition-colors ${
                        isExpanded ? "bg-pink-500/20 text-pink-400" : "bg-neutral-800 text-neutral-400"
                      }`}>
                        <Layers className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className={`text-xl font-bold transition-colors ${
                          isExpanded ? "text-white" : "text-neutral-300"
                        }`}>
                          {unitName}
                        </h2>
                        <p className="text-neutral-500 text-sm mt-1">{description}</p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full transition-transform duration-300 ${
                      isExpanded ? "bg-pink-500/10 text-pink-400 rotate-180" : "bg-transparent text-neutral-500"
                    }`}>
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-neutral-800/50">
                          {materials.length === 0 ? (
                            <p className="text-neutral-500 text-sm py-4 italic text-center">No lecture materials uploaded under this unit yet.</p>
                          ) : (
                            <div className="flex flex-col gap-3 mt-4">
                              {materials.map((material) => (
                                <div 
                                  key={material.id} 
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-black/40 border border-neutral-800 hover:border-pink-500/30 transition-colors group"
                                >
                                  <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
                                    <div className="p-2 bg-neutral-900 rounded-md group-hover:bg-pink-500/10 group-hover:text-pink-400 transition-colors">
                                      <FileText className="h-5 w-5 text-neutral-400 group-hover:text-pink-400 transition-colors" />
                                    </div>
                                    <div>
                                      <h3 className="text-white font-medium group-hover:text-pink-100 transition-colors">{material.title}</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${getTypeColor(material.type)} font-medium`}>
                                          {material.type}
                                        </span>
                                        <span className="text-neutral-500 text-xs">• {material.size}</span>
                                        <span className="text-neutral-500 text-xs">• Added {material.date}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    {isAdmin && (
                                      <>
                                        <button
                                          onClick={() => handleEdit(material)}
                                          className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300 transition-colors hover:bg-amber-500/20"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDelete(material.id)}
                                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </>
                                    )}
                                    <button 
                                      onClick={() => {
                                        if (material.url) {
                                          window.open(material.url, "_blank", "noopener,noreferrer")
                                        } else {
                                          toast.error("No link configured for this lecture material.")
                                        }
                                      }}
                                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-neutral-800 text-neutral-300 hover:bg-pink-500/20 hover:text-pink-300 transition-colors text-sm font-medium w-full sm:w-auto"
                                    >
                                      <Download className="h-4 w-4" /> Download
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} className="w-auto" mobileClassName="w-auto" />
      </div>
    </div>
    </SrmAccessGate>
  )
}

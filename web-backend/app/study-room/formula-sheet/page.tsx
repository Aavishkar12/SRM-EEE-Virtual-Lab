"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calculator, BookOpen, Zap, Activity, Cpu, Download, User, Pencil, Trash2, Upload } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Users, Info, Settings, LogIn, FileQuestion, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SrmAccessGate } from "@/components/srm-access-gate"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const CATEGORIES = ["DC Circuits", "AC Circuits", "Digital Electronics"]

export default function FormulaSheetPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const [formulas, setFormulas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    category: "DC Circuits",
    name: "",
    formula: "",
    description: ""
  })

  const fetchFormulas = async () => {
    try {
      const res = await fetch("/api/study-room/formulas")
      if (res.ok) {
        const data = await res.json()
        setFormulas(data)
      } else {
        toast.error("Failed to load formulas.")
      }
    } catch (err) {
      toast.error("An error occurred loading formulas.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFormulas()
  }, [])

  // Group formulas by category
  const groupedFormulas: Record<string, any[]> = {}
  formulas.forEach((item) => {
    const cat = item.category || "General Formulas"
    if (!groupedFormulas[cat]) {
      groupedFormulas[cat] = []
    }
    groupedFormulas[cat].push(item)
  })

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      category: "DC Circuits",
      name: "",
      formula: "",
      description: ""
    })
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setFormData({
      category: item.category || "DC Circuits",
      name: item.name || "",
      formula: item.formula || "",
      description: item.description || ""
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSave = async () => {
    if (!isAdmin) return

    if (!formData.name || !formData.formula || !formData.description) {
      toast.error("Please fill in Name, Formula, and Description before saving.")
      return
    }

    try {
      let res
      if (editingId) {
        res = await fetch("/api/study-room/formulas", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
      } else {
        res = await fetch("/api/study-room/formulas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }

      if (res.ok) {
        toast.success(editingId ? "Formula updated successfully." : "New formula added successfully.")
        resetForm()
        fetchFormulas()
      } else {
        toast.error("Failed to save formula.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this formula?")) return

    try {
      const res = await fetch(`/api/study-room/formulas?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Formula deleted successfully.")
        if (editingId === id) {
          resetForm()
        }
        fetchFormulas()
      } else {
        toast.error("Failed to delete formula.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const getCategoryMeta = (category: string) => {
    switch (category) {
      case "DC Circuits":
        return {
          icon: <Zap className="h-5 w-5 text-yellow-400" />,
          color: "from-yellow-500/20 to-orange-500/5",
          border: "border-yellow-500/20"
        }
      case "AC Circuits":
        return {
          icon: <Activity className="h-5 w-5 text-blue-400" />,
          color: "from-blue-500/20 to-cyan-500/5",
          border: "border-blue-500/20"
        }
      case "Digital Electronics":
        return {
          icon: <Cpu className="h-5 w-5 text-purple-400" />,
          color: "from-purple-500/20 to-pink-500/5",
          border: "border-purple-500/20"
        }
      default:
        return {
          icon: <Calculator className="h-5 w-5 text-emerald-400" />,
          color: "from-emerald-500/20 to-teal-500/5",
          border: "border-emerald-500/20"
        }
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
      description="Formula sheets are restricted to signed-in SRM users. Admins can upload, edit, and delete formula cards dynamically."
    >
    <div className="text-white selection:bg-yellow-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 pb-32">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/study-room" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Room
            </Link>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
              Formula Cheat Sheet
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg">
              A quick-reference guide for all essential Electrical and Electronics Engineering equations.
            </p>
          </div>
          <button 
            onClick={() => {
              toast.success("Downloading full PDF formula sheet...")
            }}
            className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30 px-6 py-3 rounded-lg font-medium transition-all w-fit"
          >
            <Download className="h-5 w-5" /> Download Full PDF
          </button>
        </div>

        {/* Dynamic Admin Notification */}
        <div className="mb-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm text-neutral-300">
            Signed in as <span className="font-medium text-white">{session?.user?.email}</span>.
            {isAdmin
              ? " You have admin access to upload, edit, and delete formula entries."
              : " You can read the formula cards, but only admins can manage them."}
          </p>
        </div>

        {/* Admin Formula Creator Form */}
        {isAdmin && (
          <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-300">
              <Upload className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Admin Formula Editor</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Formula Name (e.g. Ohm's Law)" value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Equation (e.g. V = I × R)" value={formData.formula} onChange={(e) => setFormData((current) => ({ ...current, formula: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              
              <select
                className="bg-neutral-900/60 border border-neutral-700 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                value={formData.category}
                onChange={(e) => setFormData((current) => ({ ...current, category: e.target.value }))}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                {!CATEGORIES.includes(formData.category) && (
                  <option value={formData.category}>{formData.category}</option>
                )}
              </select>

              <Input placeholder="Brief Description" value={formData.description} onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={handleSave} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                {editingId ? "Update Formula Details" : "Upload Formula Card"}
              </button>
              <button onClick={resetForm} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800">
                Clear Form
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {loading ? (
          <div className="space-y-12 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {Object.keys(groupedFormulas).map((catName) => {
              const catMeta = getCategoryMeta(catName)
              const items = groupedFormulas[catName]

              return (
                <div key={catName} className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${catMeta.color} border ${catMeta.border}`}>
                      {catMeta.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{catName}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {items.map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                        className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900/80 transition-all flex flex-col h-full group relative"
                      >
                        {/* Admin Action Buttons */}
                        {isAdmin && (
                          <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(item)}
                              className="rounded bg-neutral-800 border border-neutral-700 p-1 text-amber-400 hover:text-amber-300 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="rounded bg-neutral-800 border border-neutral-700 p-1 text-red-400 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        <h3 className="text-neutral-300 font-medium mb-4 text-sm uppercase tracking-wider">{item.name}</h3>
                        
                        <div className="flex-grow flex items-center justify-center py-6 bg-black/40 rounded-xl border border-neutral-800/50 mb-4 group-hover:border-neutral-700 transition-colors">
                          <span className="text-xl font-mono text-white tracking-wider text-center px-4">
                            {item.formula}
                          </span>
                        </div>
                        
                        <p className="text-neutral-500 text-sm">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
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

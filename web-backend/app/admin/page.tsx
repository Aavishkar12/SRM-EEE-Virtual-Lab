"use client"

import { useState, useEffect, useCallback, type ChangeEvent } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { NavDock } from "@/components/nav-dock"
import { DigitalClock } from "@/components/digital-clock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  FlaskConical,
  BookOpen,
  FileText,
  Users,
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  GraduationCap,
  Video,
  BookMarked,
  ScrollText,
  Calendar,
  FileQuestion,
  Image as ImageIcon,
  Save,
  Upload,
} from "lucide-react"

// ─── Upload Helper ──────────────────────────────────────────────────────────────
async function uploadFileToServer(file: File): Promise<string> {
  const fd = new FormData()
  fd.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: fd })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Upload failed")
  }
  const data = await res.json()
  return data.url as string
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Experiment = {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  duration: string
  embedId: string
  videoUrl?: string
  aim: string
  apparatus?: string
  theory?: string
  procedure?: string
  observations?: string
  result?: string
  interactiveNotes?: string
  references?: string
}

type Quiz = {
  id: number
  title: string
  description: string
  difficulty: string
  color: string
  icon: string
  questions: any[]
}

type StudyItem = {
  id: number
  title: string
  [key: string]: any
}

type PYQ = {
  id: number
  year: string
  semester: string
  type: string
  subject: string
  unit: string
  size: string
  date: string
  fileUrl?: string
}

type User = {
  id: string
  name: string
  email: string
  role: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORIES = ["Circuit Analysis", "Analog Electronics", "Digital Electronics", "Electrical Machines", "Electrical Installation"]
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"]
const STUDY_TYPES = [
  { key: "books", label: "Books", icon: BookMarked },
  { key: "notes", label: "Notes", icon: ScrollText },
  { key: "videos", label: "Videos", icon: Video },
  { key: "manual", label: "Lab Manual", icon: BookOpen },
  { key: "formulas", label: "Formula Sheet", icon: FileText },
  { key: "schedules", label: "Schedules", icon: Calendar },
]

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${color} bg-neutral-900/60 p-5 flex items-center gap-4`}
    >
      <div className={`p-3 rounded-xl ${color.replace("border-", "bg-").replace("/30", "/15")}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-neutral-400">{label}</div>
      </div>
    </motion.div>
  )
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-sm w-full mx-4"
      >
        <h3 className="text-lg font-semibold text-white mb-2">Confirm Deletion</h3>
        <p className="text-neutral-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-neutral-400 hover:text-white">
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm} className="bg-red-700 hover:bg-red-600 text-white">
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Experiment Form ───────────────────────────────────────────────────────────

function ExperimentForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Partial<Experiment>
  onSave: (data: Partial<Experiment>) => Promise<void>
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<Partial<Experiment>>({
    title: "",
    description: "",
    category: "Circuit Analysis",
    difficulty: "Beginner",
    duration: "60 min",
    embedId: "",
    videoUrl: "",
    aim: "",
    apparatus: "",
    theory: "",
    procedure: "",
    observations: "",
    result: "",
    interactiveNotes: "",
    references: "",
    ...initial,
  })
  const [expanded, setExpanded] = useState(false)

  const set = (key: keyof Experiment, val: string) => setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label className="text-neutral-300 text-xs mb-1 block">Title *</Label>
          <Input value={form.title || ""} onChange={(e) => set("title", e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Experiment title" />
        </div>
        <div className="md:col-span-2">
          <Label className="text-neutral-300 text-xs mb-1 block">Description</Label>
          <textarea
            value={form.description || ""}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Brief description of the experiment"
          />
        </div>
        <div>
          <Label className="text-neutral-300 text-xs mb-1 block">Category</Label>
          <select
            value={form.category || "Circuit Analysis"}
            onChange={(e) => set("category", e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-neutral-300 text-xs mb-1 block">Difficulty</Label>
          <select
            value={form.difficulty || "Beginner"}
            onChange={(e) => set("difficulty", e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-neutral-300 text-xs mb-1 block">Duration</Label>
          <Input value={form.duration || ""} onChange={(e) => set("duration", e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="e.g. 60 min" />
        </div>
        <div>
          <Label className="text-neutral-300 text-xs mb-1 block">Tinkercad Embed ID</Label>
          <Input value={form.embedId || ""} onChange={(e) => set("embedId", e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="e.g. hNWAhAfShmV" />
        </div>
        <div className="md:col-span-2">
          <Label className="text-neutral-300 text-xs mb-1 block">YouTube Video URL</Label>
          <Input value={form.videoUrl || ""} onChange={(e) => set("videoUrl" as keyof Experiment, e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." />
        </div>
        <div className="md:col-span-2">
          <Label className="text-neutral-300 text-xs mb-1 block">Aim</Label>
          <textarea
            value={form.aim || ""}
            onChange={(e) => set("aim", e.target.value)}
            rows={2}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="The aim of the experiment"
          />
        </div>
      </div>

      {/* Expandable HTML content fields */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
      >
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {expanded ? "Hide" : "Show"} HTML Content Fields
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div>
              <Label className="text-neutral-300 text-xs mb-1 block">Interactive Notes</Label>
              <textarea
                value={form.interactiveNotes || ""}
                onChange={(e) => set("interactiveNotes" as keyof Experiment, e.target.value)}
                rows={3}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Notes shown above the interactive component (plain text)"
              />
            </div>
            {(["apparatus", "theory", "procedure", "observations", "result", "references"] as const).map((field) => (
              <div key={field}>
                <Label className="text-neutral-300 text-xs mb-1 block capitalize">{field} (HTML)</Label>
                <textarea
                  value={(form as any)[field] || ""}
                  onChange={(e) => set(field as keyof Experiment, e.target.value)}
                  rows={6}
                  className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white font-mono resize-y focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`HTML content for ${field}...`}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel} className="text-neutral-400 hover:text-white" disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={saving || !form.title?.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  )
}

// ─── Experiments Tab ───────────────────────────────────────────────────────────

function ExperimentsTab() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<"list" | "add" | "edit">("list")
  const [editing, setEditing] = useState<Experiment | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Experiment | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/experiments")
      if (res.ok) {
        const data = await res.json()
        // Deduplicate by numeric id (guards against double-seeded MongoDB)
        const seen = new Set<number>()
        setExperiments(data.filter((e: any) => {
          if (seen.has(e.id)) return false
          seen.add(e.id)
          return true
        }))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (data: Partial<Experiment>) => {
    setSaving(true)
    try {
      const isEdit = mode === "edit" && editing
      const url = isEdit ? `/api/experiments/${editing!.id}` : "/api/experiments"
      const method = isEdit ? "PUT" : "POST"
      const body = isEdit ? { id: editing!.id, ...data } : data

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const result = await res.json()

      if (!res.ok) throw new Error(result.error || "Failed to save")
      toast.success(isEdit ? "Experiment updated!" : "Experiment created!")
      setMode("list")
      setEditing(null)
      await load()
    } catch (err: any) {
      toast.error(err.message || "Failed to save experiment")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/experiments/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete")
      toast.success("Experiment deleted!")
      setDeleteTarget(null)
      await load()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete experiment")
    }
  }

  const difficultyColor = (d: string) =>
    d === "Beginner" ? "text-green-400 bg-green-900/20 border-green-800/40" :
    d === "Intermediate" ? "text-yellow-400 bg-yellow-900/20 border-yellow-800/40" :
    "text-red-400 bg-red-900/20 border-red-800/40"

  if (mode !== "list") {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {mode === "add" ? "Add New Experiment" : `Edit: ${editing?.title}`}
          </h3>
          <button onClick={() => { setMode("list"); setEditing(null) }} className="text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ExperimentForm
          initial={mode === "edit" ? editing! : undefined}
          onSave={handleSave}
          onCancel={() => { setMode("list"); setEditing(null) }}
          saving={saving}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">{experiments.length} experiment{experiments.length !== 1 ? "s" : ""}</p>
        <Button onClick={() => setMode("add")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> Add Experiment
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 text-neutral-400 animate-spin" />
        </div>
      ) : experiments.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">No experiments found.</div>
      ) : (
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Tinkercad</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {experiments.map((exp) => (
                <tr key={(exp as any)._id?.toString() || `exp-${exp.id}`} className="bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{exp.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{exp.title}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 hidden md:table-cell">{exp.category}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColor(exp.difficulty)}`}>
                      {exp.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 hidden lg:table-cell">{exp.duration}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {exp.embedId ? (
                      <span className="text-xs text-green-400 bg-green-900/20 border border-green-800/40 px-2 py-0.5 rounded-full">Yes</span>
                    ) : (
                      <span className="text-xs text-neutral-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditing(exp); setMode("edit") }}
                        className="text-neutral-400 hover:text-blue-400 transition-colors p-1 rounded"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exp)}
                        className="text-neutral-400 hover:text-red-400 transition-colors p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// ─── Quizzes Tab ───────────────────────────────────────────────────────────────

function QuizzesTab() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/quizzes")
      if (res.ok) setQuizzes(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDesc }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to create quiz")
      toast.success("Quiz created!")
      setShowAdd(false)
      setNewTitle("")
      setNewDesc("")
      await load()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/quizzes?id=${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete quiz")
      toast.success("Quiz deleted!")
      setDeleteTarget(null)
      await load()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">{quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""}</p>
        <Button onClick={() => setShowAdd(!showAdd)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> Add Quiz
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
              <Label className="text-neutral-300 text-xs">Quiz Title *</Label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Quiz title" />
              <Label className="text-neutral-300 text-xs">Description</Label>
              <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Brief description" />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)} className="text-neutral-400">Cancel</Button>
                <Button size="sm" onClick={handleAdd} disabled={saving || !newTitle.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null} Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 text-neutral-400 animate-spin" /></div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">No quizzes found.</div>
      ) : (
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Questions</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {quizzes.map((q) => (
                <tr key={q.id} className="bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{q.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{q.title}</div>
                    <div className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{q.description}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 hidden md:table-cell">{q.difficulty || "—"}</td>
                  <td className="px-4 py-3 text-neutral-400 hidden sm:table-cell">{q.questions?.length ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(q)} className="text-neutral-400 hover:text-red-400 transition-colors p-1 rounded" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete quiz "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// ─── Study Materials Tab ───────────────────────────────────────────────────────

function StudyMaterialsTab() {
  const [activeType, setActiveType] = useState("books")
  const [items, setItems] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<StudyItem | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newExtra, setNewExtra] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = useCallback(async (type: string) => {
    setLoading(true)
    setItems([])
    try {
      const res = await fetch(`/api/study-room/${type}`)
      if (res.ok) setItems(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(activeType) }, [activeType, load])

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFileToServer(file)
      setNewUrl(url)
      toast.success("File uploaded!")
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    setSaving(true)
    try {
      const body: any = { title: newTitle }
      if (newExtra) body.description = newExtra
      if (newUrl) body.url = newUrl
      const res = await fetch(`/api/study-room/${activeType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to add item")
      toast.success("Item added!")
      setShowAdd(false)
      setNewTitle("")
      setNewExtra("")
      setNewUrl("")
      await load(activeType)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/study-room/${activeType}?id=${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete")
      toast.success("Item deleted!")
      setDeleteTarget(null)
      await load(activeType)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const activeTypeInfo = STUDY_TYPES.find((t) => t.key === activeType)

  return (
    <div className="space-y-4">
      {/* Sub-type selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STUDY_TYPES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveType(key); setShowAdd(false) }}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeType === key
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">{items.length} item{items.length !== 1 ? "s" : ""} in {activeTypeInfo?.label}</p>
        <Button onClick={() => setShowAdd(!showAdd)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">Title *</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Item title" />
              </div>
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">Description</Label>
                <Input value={newExtra} onChange={(e) => setNewExtra(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Author, description, etc." />
              </div>
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">File / URL</Label>
                <div className="flex gap-2">
                  <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white flex-1" placeholder="Paste URL or upload file…" />
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white text-xs cursor-pointer transition-colors border border-neutral-600 shrink-0">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {uploading ? "Uploading…" : "Upload"}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)} className="text-neutral-400">Cancel</Button>
                <Button size="sm" onClick={handleAdd} disabled={saving || !newTitle.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null} Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 text-neutral-400 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">No items found for {activeTypeInfo?.label}.</div>
      ) : (
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Details</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {items.map((item) => (
                <tr key={item.id} className="bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{item.id}</td>
                  <td className="px-4 py-3 font-medium text-white">{item.title}</td>
                  <td className="px-4 py-3 text-neutral-400 hidden md:table-cell text-xs">
                    {item.author || item.description || item.url || item.size || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(item)} className="text-neutral-400 hover:text-red-400 transition-colors p-1 rounded" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// ─── PYQs Tab ──────────────────────────────────────────────────────────────────

function PYQsTab() {
  const [pyqs, setPyqs] = useState<PYQ[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<PYQ | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ year: "", semester: "Odd", type: "Cycle Test 1", subject: "Basic Electrical Engineering", unit: "", date: "", fileUrl: "" })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFileToServer(file)
      setForm((p) => ({ ...p, fileUrl: url }))
      toast.success("PDF uploaded!")
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/pyqs")
      if (res.ok) setPyqs(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!form.year.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/pyqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to add PYQ")
      toast.success("PYQ added!")
      setShowAdd(false)
      setForm({ year: "", semester: "Odd", type: "Cycle Test 1", subject: "Basic Electrical Engineering", unit: "", date: "", fileUrl: "" })
      await load()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/pyqs?id=${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete PYQ")
      toast.success("PYQ deleted!")
      setDeleteTarget(null)
      await load()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">{pyqs.length} question paper{pyqs.length !== 1 ? "s" : ""}</p>
        <Button onClick={() => setShowAdd(!showAdd)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> Add PYQ
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">Year *</Label>
                <Input value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="2024" />
              </div>
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">Semester</Label>
                <select value={form.semester} onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))} className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white">
                  <option>Odd</option><option>Even</option>
                </select>
              </div>
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">Type</Label>
                <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white">
                  <option>Cycle Test 1</option><option>Cycle Test 2</option><option>End Semester</option>
                </select>
              </div>
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">Unit</Label>
                <Input value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Unit 1 & 2" />
              </div>
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">Date</Label>
                <Input value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Aug 2024" />
              </div>
              <div>
                <Label className="text-neutral-300 text-xs mb-1 block">PDF File</Label>
                <div className="flex gap-2">
                  <Input value={form.fileUrl} onChange={(e) => setForm((p) => ({ ...p, fileUrl: e.target.value }))} className="bg-neutral-800 border-neutral-700 text-white flex-1" placeholder="Paste URL or upload PDF..." />
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white text-xs cursor-pointer transition-colors border border-neutral-600 shrink-0">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {uploading ? "Uploading…" : "Upload"}
                    <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handlePdfUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)} className="text-neutral-400">Cancel</Button>
                <Button size="sm" onClick={handleAdd} disabled={saving || !form.year.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null} Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 text-neutral-400 animate-spin" /></div>
      ) : pyqs.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">No PYQs found.</div>
      ) : (
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Year</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Semester</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {pyqs.map((p) => (
                <tr key={p.id} className="bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{p.year}</td>
                  <td className="px-4 py-3 text-neutral-300">{p.type}</td>
                  <td className="px-4 py-3 text-neutral-400 hidden md:table-cell">{p.semester}</td>
                  <td className="px-4 py-3 text-neutral-400 hidden sm:table-cell">{p.unit || "—"}</td>
                  <td className="px-4 py-3 text-neutral-400 hidden lg:table-cell">{p.date || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(p)} className="text-neutral-400 hover:text-red-400 transition-colors p-1 rounded" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete ${deleteTarget.type} ${deleteTarget.year}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// ─── Users Tab ──────────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.ok ? r.json() : [])
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const roleColor = (role: string) =>
    role === "admin" ? "text-emerald-400 bg-emerald-900/20 border-emerald-800/40" :
    role === "teacher" ? "text-blue-400 bg-blue-900/20 border-blue-800/40" :
    "text-neutral-400 bg-neutral-900/20 border-neutral-700/40"

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-400">{users.length} user{users.length !== 1 ? "s" : ""}</p>
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 text-neutral-400 animate-spin" /></div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">No users found.</div>
      ) : (
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {users.map((u) => (
                <tr key={u.id} className="bg-neutral-900 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                  <td className="px-4 py-3 text-neutral-400 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleColor(u.role)}`}>{u.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Gallery Admin Tab ─────────────────────────────────────────────────────────
function GalleryAdminTab() {
  const [selectedExp, setSelectedExp] = useState<number>(1)
  const [experiments, setExperiments] = useState<{ id: number; title: string }[]>([])
  const [items, setItems] = useState<{ _id: string; name: string; imageUrl: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", imageUrl: "" })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFileToServer(file)
      setForm((f) => ({ ...f, imageUrl: url }))
      toast.success("Image uploaded!")
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  useEffect(() => {
    fetch("/api/experiments")
      .then((r) => r.ok ? r.json() : [])
      .then((data: any[]) => {
        const seen = new Set<number>()
        setExperiments(data.filter((e) => { if (seen.has(e.id)) return false; seen.add(e.id); return true }).map((e) => ({ id: e.id, title: e.title })))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/experiments/${selectedExp}/gallery`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [selectedExp])

  const handleAdd = async () => {
    if (!form.name.trim() || !form.imageUrl.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/experiments/${selectedExp}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed")
      const newItem = await res.json()
      setItems((prev) => [...prev, newItem])
      setForm({ name: "", imageUrl: "" })
      toast.success("Component added!")
    } catch { toast.error("Failed to add component") }
    finally { setSaving(false) }
  }

  const handleDelete = async (itemId: string) => {
    try {
      const res = await fetch(`/api/experiments/${selectedExp}/gallery/${itemId}`, { method: "DELETE" })
      if (res.ok) { setItems((prev) => prev.filter((i) => i._id !== itemId)); toast.success("Deleted") }
    } catch { toast.error("Failed to delete") }
  }

  return (
    <div className="space-y-6">
      {/* Experiment selector */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2">Select Experiment</label>
        <select
          value={selectedExp}
          onChange={(e) => setSelectedExp(parseInt(e.target.value))}
          className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          {experiments.map((exp) => (
            <option key={exp.id} value={exp.id}>Exp {exp.id}: {exp.title}</option>
          ))}
          {experiments.length === 0 && Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>Experiment {i + 1}</option>
          ))}
        </select>
      </div>

      {/* Add component form */}
      <div className="p-4 bg-neutral-800/60 border border-neutral-700 rounded-xl space-y-3">
        <h4 className="text-white font-medium text-sm flex items-center gap-2"><Plus className="h-3.5 w-3.5 text-pink-400" /> Add Component</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Component Name</label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Digital Multimeter" className="bg-neutral-900 border-neutral-700 text-white" />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Image URL</label>
            <div className="flex gap-2">
              <Input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="Paste URL or upload…" className="bg-neutral-900 border-neutral-700 text-white flex-1" />
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white text-xs cursor-pointer transition-colors border border-neutral-600 shrink-0">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploading ? "…" : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
        <Button onClick={handleAdd} disabled={saving || !form.name.trim() || !form.imageUrl.trim()} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
          Save Component
        </Button>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 text-neutral-600 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 border border-neutral-800 rounded-xl">
          <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No components for this experiment yet. Add one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item._id} className="group relative bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700">
              <div className="aspect-square relative bg-neutral-900 flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-neutral-700" />
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-red-600/90 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
              <div className="px-2.5 py-2">
                <p className="text-xs text-white font-medium truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────

function DashboardTab() {
  const [stats, setStats] = useState({ experiments: 0, quizzes: 0, pyqs: 0, users: 0, books: 0, notes: 0 })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [expRes, quizRes, pyqRes, userRes, booksRes, notesRes] = await Promise.allSettled([
          fetch("/api/experiments").then((r) => r.ok ? r.json() : []),
          fetch("/api/quizzes").then((r) => r.ok ? r.json() : []),
          fetch("/api/pyqs").then((r) => r.ok ? r.json() : []),
          fetch("/api/users").then((r) => r.ok ? r.json() : []),
          fetch("/api/study-room/books").then((r) => r.ok ? r.json() : []),
          fetch("/api/study-room/notes").then((r) => r.ok ? r.json() : []),
        ])
        setStats({
          experiments: expRes.status === "fulfilled" ? expRes.value.length : 0,
          quizzes: quizRes.status === "fulfilled" ? quizRes.value.length : 0,
          pyqs: pyqRes.status === "fulfilled" ? pyqRes.value.length : 0,
          users: userRes.status === "fulfilled" ? userRes.value.length : 0,
          books: booksRes.status === "fulfilled" ? booksRes.value.length : 0,
          notes: notesRes.status === "fulfilled" ? notesRes.value.length : 0,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-neutral-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={FlaskConical} label="Experiments" value={stats.experiments} color="border-blue-500/30 text-blue-400" />
        <StatCard icon={GraduationCap} label="Quizzes" value={stats.quizzes} color="border-purple-500/30 text-purple-400" />
        <StatCard icon={FileQuestion} label="PYQs" value={stats.pyqs} color="border-amber-500/30 text-amber-400" />
        <StatCard icon={Users} label="Users" value={stats.users} color="border-cyan-500/30 text-cyan-400" />
        <StatCard icon={BookMarked} label="Books" value={stats.books} color="border-emerald-500/30 text-emerald-400" />
        <StatCard icon={ScrollText} label="Notes" value={stats.notes} color="border-rose-500/30 text-rose-400" />
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h3 className="text-sm font-semibold text-neutral-300 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "View Experiments", href: "/experiments", color: "text-blue-400" },
            { label: "Take a Quiz", href: "/quizzes", color: "text-purple-400" },
            { label: "Study Room", href: "/study-room", color: "text-emerald-400" },
            { label: "PYQs", href: "/study-room/pyqs", color: "text-amber-400" },
            { label: "Settings", href: "/settings", color: "text-neutral-300" },
            { label: "Home", href: "/", color: "text-neutral-300" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950/50 text-sm font-medium ${link.color} hover:bg-neutral-800/50 transition-colors`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* DB Maintenance */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h3 className="text-sm font-semibold text-amber-300 mb-1 flex items-center gap-2">
          <Save className="h-4 w-4" /> Database Maintenance
        </h3>
        <p className="text-xs text-neutral-500 mb-4">Run these once to sync new fields to MongoDB. Safe to re-run.</p>
        <div className="flex flex-wrap gap-3">
          {[
            { action: "update-videos", label: "Patch Video URLs", desc: "Adds videoUrl to all 12 experiments" },
            { action: "init-gallery",  label: "Init Gallery Collection", desc: "Creates experiment_gallery + index" },
            { action: "all",           label: "Run All Patches", desc: "Runs all of the above" },
          ].map(({ action, label, desc }) => (
            <button
              key={action}
              disabled={syncing !== null}
              onClick={async () => {
                setSyncing(action)
                try {
                  const res = await fetch(`/api/admin/seed?action=${action}`, { method: "PATCH" })
                  const data = await res.json()
                  toast.success(data.message || "Done!")
                  if (data.results) console.table(data.results)
                } catch {
                  toast.error("Sync failed — check console")
                } finally {
                  setSyncing(null)
                }
              }}
              className="flex flex-col items-start px-4 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-500/40 rounded-xl transition-colors disabled:opacity-50 text-left"
            >
              <span className="text-sm font-medium text-white flex items-center gap-2">
                {syncing === action ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 text-green-400" />}
                {label}
              </span>
              <span className="text-xs text-neutral-500 mt-0.5">{desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-neutral-400 animate-spin" />
      </div>
    )
  }

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center gap-4">
        <Shield className="h-12 w-12 text-red-400 opacity-60" />
        <h1 className="text-2xl font-bold text-white">Admin Access Required</h1>
        <p className="text-neutral-400 text-sm">You need admin privileges to access this page.</p>
        <Button onClick={() => router.push("/")} variant="ghost" className="text-neutral-400">
          Go Home
        </Button>
      </div>
    )
  }

  const TABS = [
    { value: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { value: "experiments", label: "Experiments", icon: FlaskConical },
    { value: "quizzes", label: "Quizzes", icon: GraduationCap },
    { value: "study-materials", label: "Study Materials", icon: BookOpen },
    { value: "pyqs", label: "PYQs", icon: FileQuestion },
    { value: "users", label: "Users", icon: Users },
    { value: "gallery", label: "Gallery", icon: ImageIcon },
  ]

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <NavDock />
      <DigitalClock />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-28 sm:pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
                <Shield className="h-3 w-3" />
                Admin Panel
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-1 text-neutral-400 text-sm">Manage experiments, quizzes, study materials, and users.</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-3">
              <p className="text-sm font-semibold text-white">{session.user?.name || session.user?.email}</p>
              <p className="text-xs text-emerald-400 font-medium">Administrator</p>
            </div>
          </div>

          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            {/* Tab List */}
            <TabsList className="flex w-full overflow-x-auto gap-1 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-1 scrollbar-hide mb-6">
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-neutral-400 data-[state=active]:bg-blue-900/40 data-[state=active]:text-white transition-all"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 sm:p-6">
              <TabsContent value="dashboard" className="mt-0">
                <h2 className="text-lg font-semibold text-white mb-5">Overview</h2>
                <DashboardTab />
              </TabsContent>

              <TabsContent value="experiments" className="mt-0">
                <h2 className="text-lg font-semibold text-white mb-5">Manage Experiments</h2>
                <ExperimentsTab />
              </TabsContent>

              <TabsContent value="quizzes" className="mt-0">
                <h2 className="text-lg font-semibold text-white mb-5">Manage Quizzes</h2>
                <QuizzesTab />
              </TabsContent>

              <TabsContent value="study-materials" className="mt-0">
                <h2 className="text-lg font-semibold text-white mb-5">Manage Study Materials</h2>
                <StudyMaterialsTab />
              </TabsContent>

              <TabsContent value="pyqs" className="mt-0">
                <h2 className="text-lg font-semibold text-white mb-5">Manage Previous Year Questions</h2>
                <PYQsTab />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <h2 className="text-lg font-semibold text-white mb-5">Users</h2>
                <UsersTab />
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <h2 className="text-lg font-semibold text-white mb-5">Experiment Component Gallery</h2>
                <GalleryAdminTab />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

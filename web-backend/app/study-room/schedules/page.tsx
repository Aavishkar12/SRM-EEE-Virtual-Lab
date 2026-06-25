"use client"
import { NavDock } from "@/components/nav-dock"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar as CalendarIcon, Clock, BookOpen, AlertCircle, CheckCircle2, FileText, User, Pencil, Trash2, Upload } from "lucide-react"
import { Home, Users, Info, Settings, LogIn, FileQuestion, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SrmAccessGate } from "@/components/srm-access-gate"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { apiUrl } from "@/lib/api"

export default function SchedulesPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    syllabus: "",
    status: "Upcoming",
    type: "Exam"
  })

  const fetchSchedules = async () => {
    try {
      const res = await fetch(apiUrl("/api/study-room/schedules"))
      if (res.ok) {
        const data = await res.json()
        setSchedules(data)
      } else {
        toast.error("Failed to load CT schedules.")
      }
    } catch (err) {
      toast.error("An error occurred loading schedules.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      date: "",
      time: "",
      syllabus: "",
      status: "Upcoming",
      type: "Exam"
    })
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setFormData({
      title: item.title || "",
      date: item.date || "",
      time: item.time || "",
      syllabus: item.syllabus || "",
      status: item.status || "Upcoming",
      type: item.type || "Exam"
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSave = async () => {
    if (!isAdmin) return

    if (!formData.title || !formData.date || !formData.time || !formData.syllabus) {
      toast.error("Please fill in Title, Date, Time, and Syllabus details.")
      return
    }

    try {
      let res
      if (editingId) {
        res = await fetch(apiUrl("/api/study-room/schedules"), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
      } else {
        res = await fetch(apiUrl("/api/study-room/schedules"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }

      if (res.ok) {
        toast.success(editingId ? "Schedule updated successfully." : "New schedule uploaded successfully.")
        resetForm()
        fetchSchedules()
      } else {
        toast.error("Failed to save schedule.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this schedule entry?")) return

    try {
      const res = await fetch(apiUrl(`/api/study-room/schedules?id=${id}`), {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Schedule deleted successfully.")
        if (editingId === id) {
          resetForm()
        }
        fetchSchedules()
      } else {
        toast.error("Failed to delete schedule.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      case "Upcoming":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20"
      default:
        return "text-neutral-400 bg-neutral-800 border-neutral-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Exam":
        return <FileText className="h-5 w-5 text-blue-400" />
      case "Submission":
        return <AlertCircle className="h-5 w-5 text-purple-400" />
      case "Lab":
        return <Clock className="h-5 w-5 text-cyan-400" />
      default:
        return <CalendarIcon className="h-5 w-5 text-neutral-400" />
    }
  }


  return (
    <SrmAccessGate
      title="SRM academic resource access"
      description="Schedules and exam timelines are visible only to signed-in SRM users. Admins can manage academic timelines dynamically."
    >
    <div className="min-h-screen bg-[#050508] text-white selection:bg-emerald-500/30">
      <NavDock />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 pb-32">
        {/* Header */}
        <div className="mb-12">
          <Link href="/study-room" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Room
          </Link>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            CT & Exam Schedules
          </h1>
          <p className="text-neutral-400 max-w-2xl text-lg">
            Stay on top of your academic deadlines. Track upcoming Cycle Tests, assignment submissions, and End Semester exams for 26EEE1001T.
          </p>
        </div>

        {/* Dynamic Admin Notification */}
        <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-sm text-neutral-300">
            Signed in as <span className="font-medium text-white">{session?.user?.email}</span>.
            {isAdmin
              ? " You have admin access to upload, edit, and delete exam timelines."
              : " You can read and track deadlines, but only admins can manage them."}
          </p>
        </div>

        {/* Admin Schedules Creator Form */}
        {isAdmin && (
          <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-300">
              <Upload className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Admin Schedule Manager</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Schedule Title (e.g. Cycle Test 2)" value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Date (e.g. October 20, 2026)" value={formData.date} onChange={(e) => setFormData((current) => ({ ...current, date: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Time (e.g. 10:00 AM - 11:30 AM)" value={formData.time} onChange={(e) => setFormData((current) => ({ ...current, time: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="bg-neutral-900/60 border border-neutral-700 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                  value={formData.type}
                  onChange={(e) => setFormData((current) => ({ ...current, type: e.target.value }))}
                >
                  <option value="Exam">Exam</option>
                  <option value="Submission">Submission</option>
                  <option value="Lab">Lab</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  className="bg-neutral-900/60 border border-neutral-700 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                  value={formData.status}
                  onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value }))}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <Input placeholder="Syllabus Coverage / Notes (e.g. Unit 3 & 4)" value={formData.syllabus} onChange={(e) => setFormData((current) => ({ ...current, syllabus: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white md:col-span-2" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={handleSave} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                {editingId ? "Update Schedule Details" : "Upload Schedule"}
              </button>
              <button onClick={resetForm} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800">
                Clear Form
              </button>
            </div>
          </div>
        )}

        {/* Timeline */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="relative border-l-2 border-neutral-800 ml-3 md:ml-6 space-y-12">
            {schedules.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative pl-8 md:pl-10"
              >
                {/* Timeline dot */}
                <div className={`absolute -left-[11px] top-1.5 h-5 w-5 rounded-full border-4 border-black ${item.status === "Completed" ? "bg-emerald-500" : "bg-neutral-600"}`}></div>
                
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-900/80 hover:border-emerald-500/30 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-800 rounded-lg">
                        {getTypeIcon(item.type)}
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                        {item.status === "Completed" && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                        {item.status}
                      </span>
                      
                      {isAdmin && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded bg-neutral-800 border border-neutral-700 p-1 text-amber-400 hover:text-amber-300 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded bg-neutral-800 border border-neutral-700 p-1 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-neutral-400">
                      <CalendarIcon className="h-4 w-4 mr-2 text-emerald-500/70" />
                      <span className="text-sm">{item.date}</span>
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <Clock className="h-4 w-4 mr-2 text-emerald-500/70" />
                      <span className="text-sm">{item.time}</span>
                    </div>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg p-4 border border-neutral-800/50">
                    <h4 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" /> Syllabus Coverage
                    </h4>
                    <p className="text-neutral-400 text-sm">{item.syllabus}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      </div>
    </div>
    </SrmAccessGate>
  )
}

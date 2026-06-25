"use client"
import { NavDock } from "@/components/nav-dock"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Filter, Download, FileText, Calendar, BookOpen, Clock, Pencil, Trash2, Upload, User } from "lucide-react"
import { Home, Users, Info, Settings, LogIn, FileQuestion, Library } from "lucide-react"
import { DigitalClock } from "@/components/digital-clock"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { apiUrl } from "@/lib/api"
import { SrmAccessGate } from "@/components/srm-access-gate"

export default function PYQsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [pyqs, setPyqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    type: "",
    subject: "Basic Electrical Engineering",
    unit: "",
    date: "",
    fileUrl: "",
  })

  const fetchPYQs = async () => {
    try {
      const res = await fetch(apiUrl("/api/pyqs"))
      if (res.ok) {
        const data = await res.json()
        setPyqs(data)
      } else {
        toast.error("Failed to load question papers.")
      }
    } catch (err) {
      toast.error("An error occurred loading papers.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPYQs()
  }, [])

  const filteredPYQs = pyqs.filter(pyq => {
    const matchesSearch = 
      pyq.year.includes(searchTerm) || 
      pyq.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pyq.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = selectedYear ? pyq.year === selectedYear : true
    const matchesType = selectedType ? pyq.type === selectedType : true
    return matchesSearch && matchesYear && matchesType
  })

  const uniqueYears = Array.from(new Set(pyqs.map(p => p.year))).sort().reverse()
  const uniqueTypes = Array.from(new Set(pyqs.map(p => p.type))).sort()

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      year: "",
      semester: "",
      type: "",
      subject: "Basic Electrical Engineering",
      unit: "",
      date: "",
      fileUrl: "",
    })
  }

  const handleEdit = (id: number) => {
    const selectedPyq = pyqs.find((item) => item.id === id)
    if (!selectedPyq) return

    setEditingId(id)
    setFormData({
      year: selectedPyq.year,
      semester: selectedPyq.semester,
      type: selectedPyq.type,
      subject: selectedPyq.subject,
      unit: selectedPyq.unit,
      date: selectedPyq.date,
      fileUrl: selectedPyq.fileUrl || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSave = async () => {
    if (!isAdmin) return

    if (!formData.year || !formData.type || !formData.unit || !formData.date) {
      toast.error("Please fill in all required PYQ fields before saving.")
      return
    }

    try {
      let res
      if (editingId) {
        res = await fetch(apiUrl("/api/pyqs"), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
      } else {
        res = await fetch(apiUrl("/api/pyqs"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }

      if (res.ok) {
        toast.success(editingId ? "PYQ updated successfully." : "New PYQ uploaded successfully.")
        resetForm()
        fetchPYQs()
      } else {
        toast.error("Failed to save PYQ.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this question paper?")) return

    try {
      const res = await fetch(apiUrl(`/api/pyqs?id=${id}`), {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("PYQ deleted successfully.")
        if (editingId === id) {
          resetForm()
        }
        fetchPYQs()
      } else {
        toast.error("Failed to delete PYQ.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }


  return (
    <SrmAccessGate
      title="SRM academic resource access"
      description="PYQs are available only to signed-in SRM users. Admins can upload, edit, and delete papers, while other SRM users can read and download them."
    >
    <div className="min-h-screen bg-[#050508] text-white selection:bg-blue-500/30">
      <NavDock />
      <DigitalClock />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 pb-32">
        {/* Header */}
        <div className="mb-10">
          <Link href="/study-room" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Room
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                Previous Year Question Papers
              </h1>
              <p className="text-neutral-400 max-w-2xl text-lg">
                Access a comprehensive archive of cycle test and end-semester question papers to prepare effectively for your exams.
              </p>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-500" />
                </div>
                <Input
                  type="text"
                  placeholder="Search subject or unit..."
                  className="pl-10 bg-neutral-900/50 border-neutral-800 text-white w-full focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="bg-neutral-900/50 border border-neutral-800 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                className="bg-neutral-900/50 border border-neutral-800 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Exams</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="text-sm text-neutral-300">
            Signed in as <span className="font-medium text-white">{session?.user?.email}</span>.
            {isAdmin
              ? " You have admin access for upload, edit, and delete actions."
              : " You can read and download PYQs, but only admins can manage them."}
          </p>
        </div>

        {isAdmin && (
          <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-300">
              <Upload className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Admin PYQ Manager</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Input placeholder="Year (e.g. 2023)" value={formData.year} onChange={(e) => setFormData((current) => ({ ...current, year: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Semester (e.g. Odd)" value={formData.semester} onChange={(e) => setFormData((current) => ({ ...current, semester: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Exam Type (e.g. Cycle Test 1)" value={formData.type} onChange={(e) => setFormData((current) => ({ ...current, type: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Subject (e.g. Basic Electrical Engineering)" value={formData.subject} onChange={(e) => setFormData((current) => ({ ...current, subject: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Covered Unit (e.g. Unit 1 & 2)" value={formData.unit} onChange={(e) => setFormData((current) => ({ ...current, unit: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Published Date (e.g. Aug 2023)" value={formData.date} onChange={(e) => setFormData((current) => ({ ...current, date: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <div className="flex flex-col gap-1.5 md:col-span-2 xl:col-span-3">
                <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Document URL / Local File</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <Input 
                    placeholder="Document URL (e.g. https://drive.google.com/...)" 
                    value={formData.fileUrl} 
                    onChange={(e) => setFormData((current) => ({ ...current, fileUrl: e.target.value }))} 
                    className="bg-neutral-900/60 border-neutral-700 text-white flex-grow" 
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      id="pyq-file-upload" 
                      className="hidden" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        
                        const loadingToast = toast.loading("Uploading file to server...")
                        const body = new FormData()
                        body.append("file", file)
                        
                        try {
                          const res = await fetch(apiUrl("/api/upload"), {
                            method: "POST",
                            body,
                          })
                          if (res.ok) {
                            const data = await res.json()
                            setFormData((current) => ({ ...current, fileUrl: data.url }))
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
                      htmlFor="pyq-file-upload" 
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
                {editingId ? "Update PYQ" : "Upload PYQ"}
              </button>
              <button onClick={resetForm} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800">
                Clear Form
              </button>
            </div>
          </div>
        )}

        {/* List of PYQs */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-xl border border-white/5 bg-white/1 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPYQs.map((pyq, index) => (
              <motion.div
                key={pyq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-900/80 hover:border-blue-500/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 bg-neutral-800 text-xs font-medium rounded-full text-neutral-300">
                    {pyq.year}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {pyq.type}
                </h3>
                <p className="text-neutral-400 text-sm mb-4">
                  {pyq.subject}
                </p>
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center text-sm text-neutral-500">
                    <BookOpen className="h-4 w-4 mr-2" /> {pyq.unit}
                  </div>
                  <div className="flex items-center text-sm text-neutral-500">
                    <Calendar className="h-4 w-4 mr-2" /> {pyq.date}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-mono">{pyq.size}</span>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <>
                        <button
                          className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300 transition-colors hover:bg-amber-500/20"
                          onClick={() => handleEdit(pyq.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20"
                          onClick={() => handleDelete(pyq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button 
                      className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                      onClick={() => {
                        if (pyq.fileUrl) {
                          window.open(pyq.fileUrl, "_blank", "noopener,noreferrer")
                        } else {
                          toast.error("No file URL configured for this question paper.")
                        }
                      }}
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredPYQs.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-neutral-900 rounded-full mb-4">
              <Search className="h-8 w-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No question papers found</h3>
            <p className="text-neutral-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>

    </div>
    </SrmAccessGate>
  )
}

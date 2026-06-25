"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, BookMarked, Download, FileText, ChevronRight, File, BookOpen, User, Pencil, Trash2, Upload } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Users, Info, Settings, LogIn, FileQuestion, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SrmAccessGate } from "@/components/srm-access-gate"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function ManualPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const [chapters, setChapters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    pages: "",
    type: "PDF",
    url: ""
  })

  const fetchChapters = async () => {
    try {
      const res = await fetch("/api/study-room/manual")
      if (res.ok) {
        const data = await res.json()
        setChapters(data)
      } else {
        toast.error("Failed to load lab manual chapters.")
      }
    } catch (err) {
      toast.error("An error occurred loading the lab manual.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChapters()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      pages: "",
      type: "PDF",
      url: ""
    })
  }

  const handleEdit = (chapter: any) => {
    setEditingId(chapter.id)
    setFormData({
      title: chapter.title || "",
      pages: chapter.pages || "",
      type: chapter.type || "PDF",
      url: chapter.url || ""
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSave = async () => {
    if (!isAdmin) return

    if (!formData.title || !formData.pages || !formData.url) {
      toast.error("Please fill in Title, Pages Range, and File Link before saving.")
      return
    }

    try {
      let res
      if (editingId) {
        res = await fetch("/api/study-room/manual", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
      } else {
        res = await fetch("/api/study-room/manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }

      if (res.ok) {
        toast.success(editingId ? "Lab chapter updated successfully." : "New lab chapter uploaded successfully.")
        resetForm()
        fetchChapters()
      } else {
        toast.error("Failed to save lab manual chapter.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this chapter?")) return

    try {
      const res = await fetch(`/api/study-room/manual?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Lab manual chapter deleted successfully.")
        if (editingId === id) {
          resetForm()
        }
        fetchChapters()
      } else {
        toast.error("Failed to delete chapter.")
      }
    } catch (err) {
      toast.error("An error occurred.")
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
      description="The virtual lab manual is available only to signed-in SRM users. Admins can upload, edit, and delete chapters dynamically."
    >
    <div className="text-white selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 pb-32">
        {/* Header */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/study-room" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Room
            </Link>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
              Virtual Lab Manual
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg">
              Download the complete digital version of the SRM EEE Virtual Lab Manual, containing procedures, apparatus lists, and theory.
            </p>
          </div>
          
          <button 
            onClick={() => {
              if (chapters.length > 0 && chapters[0].url) {
                window.open(chapters[0].url, "_blank", "noopener,noreferrer")
              } else {
                toast.error("No full manual link configured.")
              }
            }}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all w-full md:w-auto shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
          >
            <Download className="h-5 w-5" /> Download Full Manual
          </button>
        </div>

        {/* Dynamic Admin Notification */}
        <div className="mb-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="text-sm text-neutral-300">
            Signed in as <span className="font-medium text-white">{session?.user?.email}</span>.
            {isAdmin
              ? " You have admin access to upload and edit lab manual chapters dynamically."
              : " You can read and download manual chapters, but only admins can manage them."}
          </p>
        </div>

        {/* Admin Manual Creator Form */}
        {isAdmin && (
          <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-300">
              <Upload className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Admin Manual Editor</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Chapter/Exp Title (e.g. Exp 1: Verification...)" value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Pages Range (e.g. 6-12)" value={formData.pages} onChange={(e) => setFormData((current) => ({ ...current, pages: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Type (e.g. PDF)" value={formData.type} onChange={(e) => setFormData((current) => ({ ...current, type: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
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
                      id="manual-file-upload" 
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
                      htmlFor="manual-file-upload" 
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
                {editingId ? "Update Chapter Entry" : "Upload Manual Chapter"}
              </button>
              <button onClick={resetForm} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800">
                Clear Form
              </button>
            </div>
          </div>
        )}

        {/* Chapters List */}
        <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-4 md:p-6 bg-neutral-900/50 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <BookMarked className="mr-3 h-5 w-5 text-indigo-400" /> Chapters & Experiments
            </h2>
          </div>
          
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-neutral-800/60">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-neutral-800/30 transition-colors group"
                >
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                      <File className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-neutral-500 text-sm mt-1 flex items-center gap-2">
                        <span className="bg-neutral-800 px-2 py-0.5 rounded text-xs">Pages {chapter.pages}</span>
                        <span>• {chapter.size}</span>
                        <span>• {chapter.type}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleEdit(chapter)}
                          className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300 transition-colors hover:bg-amber-500/20"
                          title="Edit Chapter"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(chapter.id)}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20"
                          title="Delete Chapter"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        if (chapter.url) {
                          window.open(chapter.url, "_blank", "noopener,noreferrer")
                        } else {
                          toast.error("No link configured for this chapter.")
                        }
                      }}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg transition-colors border border-neutral-700"
                    >
                      <Download className="h-4 w-4 text-indigo-400" /> PDF
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} className="w-auto" mobileClassName="w-auto" />
      </div>
    </div>
    </SrmAccessGate>
  )
}

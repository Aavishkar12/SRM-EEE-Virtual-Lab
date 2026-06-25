"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, PlayCircle, BookOpen, Video, Clock, Search, User, Pencil, Trash2, Upload } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Users, Info, Settings, LogIn, FileQuestion, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SrmAccessGate } from "@/components/srm-access-gate"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const DEFAULT_THUMBNAILS = [
  "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&q=80",
  "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500&q=80",
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
  "https://images.unsplash.com/photo-1504610926078-a1611febcad3?w=500&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80"
]

export default function VideosPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    expNumber: "",
    title: "",
    duration: "",
    thumbnail: "",
    url: ""
  })

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/study-room/videos")
      if (res.ok) {
        const data = await res.json()
        setVideos(data)
      } else {
        toast.error("Failed to load video tutorials.")
      }
    } catch (err) {
      toast.error("An error occurred loading videos.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    video.expNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      expNumber: "",
      title: "",
      duration: "",
      thumbnail: "",
      url: ""
    })
  }

  const handleEdit = (video: any) => {
    setEditingId(video.id)
    setFormData({
      expNumber: video.expNumber || "",
      title: video.title || "",
      duration: video.duration || "",
      thumbnail: video.thumbnail || "",
      url: video.url || ""
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSave = async () => {
    if (!isAdmin) return

    if (!formData.expNumber || !formData.title || !formData.duration || !formData.url) {
      toast.error("Please fill in Experiment Number, Title, Duration, and Video Link.")
      return
    }

    // Assign a default thumbnail if empty
    const updatedForm = {
      ...formData,
      views: formData.views || `${(Math.random() * 4 + 1).toFixed(1)}k`,
      thumbnail: formData.thumbnail || DEFAULT_THUMBNAILS[Math.floor(Math.random() * DEFAULT_THUMBNAILS.length)]
    }

    try {
      let res
      if (editingId) {
        res = await fetch("/api/study-room/videos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...updatedForm }),
        })
      } else {
        res = await fetch("/api/study-room/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedForm),
        })
      }

      if (res.ok) {
        toast.success(editingId ? "Video updated successfully." : "New video uploaded successfully.")
        resetForm()
        fetchVideos()
      } else {
        toast.error("Failed to save video.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this video?")) return

    try {
      const res = await fetch(`/api/study-room/videos?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Video deleted successfully.")
        if (editingId === id) {
          resetForm()
        }
        fetchVideos()
      } else {
        toast.error("Failed to delete video.")
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
      description="Video tutorials are visible only to signed-in SRM users. Admins can upload, edit, and delete video links dynamically."
    >
    <div className="text-white selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 pb-32">
        {/* Header */}
        <div className="mb-12">
          <Link href="/study-room" className="inline-flex items-center text-red-400 hover:text-red-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Room
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-400">
                Video Tutorials
              </h1>
              <p className="text-neutral-400 max-w-2xl text-lg">
                Visual learning made easy. Watch complete breakdowns, circuit building, and calculations for every lab experiment.
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-500" />
              </div>
              <Input
                type="text"
                placeholder="Search videos..."
                className="pl-10 bg-neutral-900/50 border-neutral-800 text-white w-full focus:ring-red-500 focus:border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Admin Notification */}
        <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <p className="text-sm text-neutral-300">
            Signed in as <span className="font-medium text-white">{session?.user?.email}</span>.
            {isAdmin
              ? " You have admin access to upload, edit, and delete video tutorials."
              : " You can watch tutorials, but only admins can manage the video archive."}
          </p>
        </div>

        {/* Admin Videos Creator Form */}
        {isAdmin && (
          <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-300">
              <Upload className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Admin Video Panel</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Input placeholder="Experiment Label (e.g. Exp 1)" value={formData.expNumber} onChange={(e) => setFormData((current) => ({ ...current, expNumber: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Video Title" value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Duration (e.g. 12:45)" value={formData.duration} onChange={(e) => setFormData((current) => ({ ...current, duration: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Thumbnail Image URL (Optional)" value={formData.thumbnail} onChange={(e) => setFormData((current) => ({ ...current, thumbnail: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white md:col-span-2 xl:col-span-1" />
              <Input placeholder="Video URL (e.g. YouTube Link)" value={formData.url} onChange={(e) => setFormData((current) => ({ ...current, url: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white md:col-span-2 xl:col-span-2" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={handleSave} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                {editingId ? "Update Video Details" : "Upload Video Tutorial"}
              </button>
              <button onClick={resetForm} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800">
                Clear Form
              </button>
            </div>
          </div>
        )}

        {/* Video Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 rounded-xl border border-white/5 bg-white/1 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col justify-between h-full bg-neutral-900/10 border border-neutral-800 rounded-xl p-4 hover:border-red-500/20 transition-all hover:bg-neutral-900/30"
              >
                <div 
                  className="cursor-pointer flex-grow"
                  onClick={() => {
                    if (video.url && video.url !== "#") {
                      window.open(video.url, "_blank", "noopener,noreferrer")
                    } else {
                      toast.error("No player link configured for this video.")
                    }
                  }}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 border border-neutral-800 group-hover:border-red-500/40 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={video.thumbnail || DEFAULT_THUMBNAILS[0]} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-red-500 text-white rounded-full p-2.5 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                        <PlayCircle className="h-6 w-6" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {video.duration}
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/10">
                        {video.expNumber}
                      </span>
                      <span className="text-[11px] text-neutral-500">{video.views} views</span>
                    </div>
                    <h3 className="text-white font-medium group-hover:text-red-400 transition-colors line-clamp-2 leading-snug text-sm">
                      {video.title}
                    </h3>
                  </div>
                </div>

                {/* Admin Buttons Overlay */}
                {isAdmin && (
                  <div className="flex items-center justify-end gap-1.5 border-t border-neutral-800/80 pt-3 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(video)
                      }}
                      className="rounded border border-amber-500/20 bg-amber-500/10 p-1.5 text-amber-300 hover:bg-amber-500/20 transition-colors"
                      title="Edit Video"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(video.id)
                      }}
                      className="rounded border border-red-500/20 bg-red-500/10 p-1.5 text-red-300 hover:bg-red-500/20 transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-neutral-900 rounded-full mb-4">
              <Video className="h-8 w-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No videos found</h3>
            <p className="text-neutral-400">Try adjusting your search terms</p>
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

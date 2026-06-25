"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Book, Download, Eye, BookOpen, Search, User, Pencil, Trash2, Upload } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Users, Info, Settings, LogIn, FileQuestion, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SrmAccessGate } from "@/components/srm-access-gate"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const COVER_GRADIENTS = [
  { name: "Blue Glow", value: "from-blue-600 to-indigo-800" },
  { name: "Emerald Mint", value: "from-emerald-600 to-teal-800" },
  { name: "Purple Orchid", value: "from-purple-600 to-fuchsia-800" },
  { name: "Volcanic Orange", value: "from-orange-600 to-red-800" },
  { name: "Oceanic Cyan", value: "from-cyan-600 to-blue-800" },
  { name: "Rose Pink", value: "from-rose-600 to-pink-800" },
  { name: "Midnight Grey", value: "from-neutral-700 to-neutral-900" }
]

export default function BooksPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    edition: "",
    type: "Reference Book",
    fileUrl: "",
    color: "from-blue-600 to-indigo-800"
  })

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/study-room/books")
      if (res.ok) {
        const data = await res.json()
        setBooks(data)
      } else {
        toast.error("Failed to load reference books.")
      }
    } catch (err) {
      toast.error("An error occurred loading library books.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      author: "",
      edition: "",
      type: "Reference Book",
      fileUrl: "",
      color: "from-blue-600 to-indigo-800"
    })
  }

  const handleEdit = (id: number) => {
    const selectedBook = books.find((item) => item.id === id)
    if (!selectedBook) return

    setEditingId(id)
    setFormData({
      title: selectedBook.title,
      author: selectedBook.author,
      edition: selectedBook.edition,
      type: selectedBook.type,
      fileUrl: selectedBook.fileUrl || "",
      color: selectedBook.color || "from-blue-600 to-indigo-800"
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSave = async () => {
    if (!isAdmin) return

    if (!formData.title || !formData.author || !formData.edition) {
      toast.error("Please fill in Book Title, Author, and Edition before saving.")
      return
    }

    try {
      let res
      if (editingId) {
        res = await fetch("/api/study-room/books", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
      } else {
        res = await fetch("/api/study-room/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }

      if (res.ok) {
        toast.success(editingId ? "Book updated successfully." : "New Book added successfully.")
        resetForm()
        fetchBooks()
      } else {
        toast.error("Failed to save book.")
      }
    } catch (err) {
      toast.error("An error occurred.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      const res = await fetch(`/api/study-room/books?id=${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Book deleted successfully.")
        if (editingId === id) {
          resetForm()
        }
        fetchBooks()
      } else {
        toast.error("Failed to delete book.")
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
      description="Reference books are available only to signed-in SRM users. Admins can upload, edit, and delete reference materials dynamically."
    >
    <div className="text-white selection:bg-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 pb-32">
        {/* Header */}
        <div className="mb-12">
          <Link href="/study-room" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Room
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
                Digital Library
              </h1>
              <p className="text-neutral-400 max-w-2xl text-lg">
                Access recommended textbooks and reference materials for your coursework. Read online or download for offline studying.
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-500" />
              </div>
              <Input
                type="text"
                placeholder="Search title or author..."
                className="pl-10 bg-neutral-900/50 border-neutral-800 text-white w-full focus:ring-amber-500 focus:border-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Admin Notification */}
        <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-sm text-neutral-300">
            Signed in as <span className="font-medium text-white">{session?.user?.email}</span>.
            {isAdmin
              ? " You have admin access for digital library uploads and CRUD controls."
              : " You can read and download reference materials, but only admins can manage them."}
          </p>
        </div>

        {/* Admin Book Creator Form */}
        {isAdmin && (
          <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-300">
              <Upload className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Admin Library Uploader</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Input placeholder="Book Title" value={formData.title} onChange={(e) => setFormData((current) => ({ ...current, title: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Author Name" value={formData.author} onChange={(e) => setFormData((current) => ({ ...current, author: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              <Input placeholder="Book Edition (e.g. 6th Edition)" value={formData.edition} onChange={(e) => setFormData((current) => ({ ...current, edition: e.target.value }))} className="bg-neutral-900/60 border-neutral-700 text-white" />
              
              <select
                className="bg-neutral-900/60 border border-neutral-700 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                value={formData.type}
                onChange={(e) => setFormData((current) => ({ ...current, type: e.target.value }))}
              >
                <option value="Primary Textbook">Primary Textbook</option>
                <option value="Reference Book">Reference Book</option>
                <option value="Study Guide">Study Guide</option>
              </select>

              <select
                className="bg-neutral-900/60 border border-neutral-700 text-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                value={formData.color}
                onChange={(e) => setFormData((current) => ({ ...current, color: e.target.value }))}
              >
                {COVER_GRADIENTS.map((gradient) => (
                  <option key={gradient.value} value={gradient.value}>
                    {gradient.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-1.5 md:col-span-2 xl:col-span-3">
                <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Document URL / Local File</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <Input 
                    placeholder="Document URL (e.g. Google Drive Link)" 
                    value={formData.fileUrl} 
                    onChange={(e) => setFormData((current) => ({ ...current, fileUrl: e.target.value }))} 
                    className="bg-neutral-900/60 border-neutral-700 text-white flex-grow" 
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      id="book-file-upload" 
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
                      htmlFor="book-file-upload" 
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
                {editingId ? "Update Book Entry" : "Upload Reference Book"}
              </button>
              <button onClick={resetForm} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800">
                Clear Form
              </button>
            </div>
          </div>
        )}

        {/* Library Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl border border-white/5 bg-white/1 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col h-full bg-neutral-900/20 border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:bg-neutral-900/50 transition-all relative"
              >
                {/* Book Cover Mockup */}
                <div className={`h-48 w-full bg-gradient-to-br ${book.color || "from-blue-600 to-indigo-800"} flex flex-col items-center justify-center p-6 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/30 border-r border-white/10 shadow-[2px_0_10px_rgba(0,0,0,0.5)] z-10"></div>
                  <Book className="h-12 w-12 text-white/80 mb-3 z-10 drop-shadow-md" />
                  <h3 className="text-white font-bold text-lg leading-tight z-10 drop-shadow-md px-4 line-clamp-2">{book.title}</h3>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  {/* Admin Actions overlay */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(book.id)
                        }}
                        className="rounded bg-black/60 p-1.5 text-amber-400 hover:text-amber-300 hover:bg-black transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(book.id)
                        }}
                        className="rounded bg-black/60 p-1.5 text-red-400 hover:text-red-300 hover:bg-black transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Book Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded-md">
                      {book.type}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      {book.size}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2 mt-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="text-neutral-400 text-sm mb-2 line-clamp-1 font-medium">
                    By {book.author}
                  </p>
                  <p className="text-neutral-500 text-sm mb-6 flex-grow">
                    {book.edition}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800/60 mt-auto">
                    <button 
                      onClick={() => {
                        if (book.fileUrl) {
                          window.open(book.fileUrl, "_blank", "noopener,noreferrer")
                        } else {
                          toast.error("No online link configured for reading this book.")
                        }
                      }}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-white hover:text-amber-400 bg-neutral-800 hover:bg-neutral-700 py-2.5 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" /> Read
                    </button>
                    <button 
                      onClick={() => {
                        if (book.fileUrl) {
                          window.open(book.fileUrl, "_blank", "noopener,noreferrer")
                        } else {
                          toast.error("No file download configured for this book.")
                        }
                      }}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 py-2.5 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" /> PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-neutral-900 rounded-full mb-4">
              <Search className="h-8 w-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No books found</h3>
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

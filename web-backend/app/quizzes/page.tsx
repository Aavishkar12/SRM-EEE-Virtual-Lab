"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Home, BookOpen, Settings, LogIn, FileQuestion, Users, Info, Zap, Cpu, Lightbulb, Bolt, Radio, Wifi, Activity, CircuitBoard, Library, User, Pencil, Trash2, Plus } from "lucide-react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { DigitalClock } from "@/components/digital-clock"
import { SidebarDemo } from "@/components/sidebar-demo"
import { FloatingDock } from "@/components/ui/floating-dock"
import { CircuitAnimation } from "@/components/ui/circuit-animation"
import { RotatingCircuit } from "@/components/ui/rotating-circuit"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

// Custom animated circuit component for the quiz page
const ElectronFlow = () => {
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)
  
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
      <svg
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          ref={pathRef}
          d="M100,300 C150,200 250,150 350,200 S500,300 600,250 S800,150 900,300"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
          }}
        />
        
        <motion.circle
          cx="0"
          cy="0"
          r="4"
          fill="#60A5FA"
          animate={{
            cx: [100, 350, 600, 900],
            cy: [300, 200, 250, 300],
            scale: [1, 1.5, 1, 1.5],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            times: [0, 0.3, 0.6, 1],
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="4s"
            repeatCount="indefinite"
          />
        </motion.circle>
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Animated quiz card component
const AnimatedQuizCard = ({ 
  quiz, 
  index, 
  isAuthenticated, 
  isAdmin, 
  onEdit, 
  onDelete 
}: { 
  quiz: any, 
  index: number, 
  isAuthenticated: boolean,
  isAdmin: boolean,
  onEdit: (quiz: any) => void,
  onDelete: (id: number) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="h-8 w-8" />,
    Cpu: <Cpu className="h-8 w-8" />,
    Activity: <Activity className="h-8 w-8" />,
    CircuitBoard: <CircuitBoard className="h-8 w-8" />,
    Lightbulb: <Lightbulb className="h-8 w-8" />,
    Radio: <Radio className="h-8 w-8" />,
    Wifi: <Wifi className="h-8 w-8" />
  }

  const icon = iconMap[quiz.icon] || <Zap className="h-8 w-8" />
  
  // Get color classes based on quiz color
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, border: string, text: string, hover: string }> = {
      blue: { 
        bg: "from-blue-900/20 to-blue-900/5", 
        border: "hover:border-blue-500/50", 
        text: "text-blue-400",
        hover: "group-hover:bg-blue-900/30"
      },
      purple: { 
        bg: "from-purple-900/20 to-purple-900/5", 
        border: "hover:border-purple-500/50", 
        text: "text-purple-400",
        hover: "group-hover:bg-purple-900/30"
      },
      green: { 
        bg: "from-green-900/20 to-green-900/5", 
        border: "hover:border-green-500/50", 
        text: "text-green-400",
        hover: "group-hover:bg-green-900/30"
      },
      yellow: { 
        bg: "from-yellow-900/20 to-yellow-900/5", 
        border: "hover:border-yellow-500/50", 
        text: "text-yellow-400",
        hover: "group-hover:bg-yellow-900/30"
      },
      red: { 
        bg: "from-red-900/20 to-red-900/5", 
        border: "hover:border-red-500/50", 
        text: "text-red-400",
        hover: "group-hover:bg-red-900/30"
      },
      cyan: { 
        bg: "from-cyan-900/20 to-cyan-900/5", 
        border: "hover:border-cyan-500/50", 
        text: "text-cyan-400",
        hover: "group-hover:bg-cyan-900/30"
      },
      orange: { 
        bg: "from-orange-900/20 to-orange-900/5", 
        border: "hover:border-orange-500/50", 
        text: "text-orange-400",
        hover: "group-hover:bg-orange-900/30"
      }
    }
    
    return colorMap[color] || colorMap.blue
  }
  
  const colorClasses = getColorClasses(quiz.color)
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/quizzes/${quiz.id}`} className="group block h-full">
        <div className="relative h-full rounded-2xl border border-neutral-800 p-2 overflow-hidden">
          <GlowingEffect spread={40} glow={isHovered} disabled={false} proximity={64} inactiveZone={0.01} />
          <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 bg-neutral-900/80 backdrop-blur-sm shadow-md">
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30 transition-opacity duration-300", colorClasses.hover)}></div>
            
            {isAdmin && (
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit(quiz)
                  }}
                  className="p-1.5 rounded-lg border border-blue-500/30 bg-blue-950/40 text-blue-400 hover:bg-blue-900/60 hover:text-blue-300 transition-colors"
                  title="Edit Quiz"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete(quiz.id)
                  }}
                  className="p-1.5 rounded-lg border border-red-500/30 bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 transition-colors"
                  title="Delete Quiz"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="relative flex flex-1 flex-col justify-between gap-3">
              <div className="flex items-start justify-between">
                <div className={cn("p-3 rounded-lg bg-gradient-to-br", colorClasses.bg)}>
                  {icon}
                </div>
                {!isAdmin && (
                  <div className={cn("text-sm font-medium px-3 py-1 rounded-full border", colorClasses.text, "border-neutral-800")}>
                    {quiz.difficulty}
                  </div>
                )}
              </div>
              
              <div className="space-y-2 mt-4">
                <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                <p className="text-sm text-neutral-400">{quiz.description}</p>
                {quiz.questions && (
                  <p className="text-xs text-neutral-500 font-medium">
                    {quiz.questions.length} Question{quiz.questions.length === 1 ? "" : "s"}
                  </p>
                )}
              </div>
              
              <div className={cn("mt-4 text-sm font-medium flex items-center", colorClasses.text)}>
                {isAdmin ? (
                  <span>Manage / View Quiz ⚙️</span>
                ) : (
                  <span>{isAuthenticated ? "Start Quiz" : "Sign in to Attempt 🔒"}</span>
                )}
                <motion.div
                  animate={isHovered ? { x: 5 } : { x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  →
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function QuizzesPage() {
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user?.email
  const isAdmin = session?.user?.role === "admin"

  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Beginner",
    color: "blue",
    icon: "Zap"
  })

  const [questions, setQuestions] = useState<any[]>([
    { id: 1, question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
  ])

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/quizzes")
      if (res.ok) {
        const data = await res.json()
        setQuizzes(data)
      } else {
        toast.error("Failed to load quizzes.")
      }
    } catch (err) {
      toast.error("An error occurred loading quizzes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      difficulty: "Beginner",
      color: "blue",
      icon: "Zap"
    })
    setQuestions([
      { id: 1, question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
    ])
    setShowForm(false)
  }

  const handleEdit = (quiz: any) => {
    setEditingId(quiz.id)
    setFormData({
      title: quiz.title || "",
      description: quiz.description || "",
      difficulty: quiz.difficulty || "Beginner",
      color: quiz.color || "blue",
      icon: quiz.icon || "Zap"
    })
    setQuestions(quiz.questions || [
      { id: 1, question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
    ])
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    if (quizzes.length > 0 && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const editId = params.get("edit")
      if (editId) {
        const quizToEdit = quizzes.find((q: any) => q.id === Number(editId))
        if (quizToEdit && editingId !== Number(editId)) {
          handleEdit(quizToEdit)
        }
      }
    }
  }, [quizzes])

  const handleDelete = async (id: number) => {
    if (!isAdmin) return
    if (!confirm("Are you sure you want to delete this quiz?")) return

    try {
      const res = await fetch(`/api/quizzes?id=${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        toast.success("Quiz deleted successfully.")
        if (editingId === id) resetForm()
        fetchQuizzes()
      } else {
        const errData = await res.json()
        toast.error(errData.error || "Failed to delete quiz.")
      }
    } catch (err) {
      toast.error("An error occurred deleting the quiz.")
    }
  }

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions]
    const opts = [...updated[qIndex].options]
    opts[optIndex] = value
    updated[qIndex] = { ...updated[qIndex], options: opts }
    setQuestions(updated)
  }

  const addQuestionField = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" }
    ])
  }

  const removeQuestionField = (index: number) => {
    if (questions.length <= 1) return
    const updated = questions.filter((_, i) => i !== index).map((q, idx) => ({ ...q, id: idx + 1 }))
    setQuestions(updated)
  }

  const handleSaveQuiz = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please provide a Title and Description for the quiz.")
      return
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question) {
        toast.error(`Question ${i + 1} text is empty.`)
        return
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j]) {
          toast.error(`Option ${j + 1} for Question ${i + 1} is empty.`)
          return
        }
      }
      if (!q.explanation) {
        toast.error(`Please provide an explanation for Question ${i + 1}.`)
        return
      }
    }

    try {
      const payload = {
        ...formData,
        questions: questions
      }

      let res
      if (editingId) {
        res = await fetch("/api/quizzes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload })
        })
      } else {
        res = await fetch("/api/quizzes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      if (res.ok) {
        toast.success(editingId ? "Quiz updated successfully." : "New quiz scheduled successfully.")
        resetForm()
        fetchQuizzes()
      } else {
        const errData = await res.json()
        toast.error(errData.error || "Failed to save quiz.")
      }
    } catch (err) {
      toast.error("An error occurred saving the quiz.")
    }
  }

  // Navigation items for the floating dock
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
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-40 h-screen">
        <SidebarDemo />
      </div>
      
      {/* Centered navigation at the top */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} className="w-auto" mobileClassName="w-auto" />
      </div>

      <DigitalClock />
      
      {/* Rotating circuit animation */}
      <RotatingCircuit />

      {/* Hero Section */}
      <div className="min-h-[45vh] relative mb-12">
        <HeroGeometric 
          badge="Knowledge Check"
          title1="Test Your"
          title2="Knowledge"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto text-center"
          >
            Assess your understanding of electrical engineering concepts with our interactive quizzes.
          </motion.p>
        </HeroGeometric>
      </div>

      <div className="container mx-auto px-4 pb-24 ml-16 md:ml-24 lg:ml-32 relative">
        <CircuitAnimation />
        
        {/* Admin Dashboard Form */}
        {isAdmin && (
          <div className="max-w-4xl mx-auto mb-16 relative z-30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                Quiz Administration
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/20"
              >
                {showForm ? "Close Panel" : <><Plus className="h-4 w-4" /> Schedule New Quiz</>}
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md p-6 overflow-hidden shadow-2xl"
                >
                  <h3 className="text-lg font-bold text-white mb-6">
                    {editingId ? "✏️ Edit Quiz Details" : "📅 Schedule New Quiz"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Quiz Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Kirchhoff's Voltage Law Quiz"
                        className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Description</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief summary of what this quiz covers"
                        className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Color Theme</label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="green">Green</option>
                        <option value="yellow">Yellow</option>
                        <option value="red">Red</option>
                        <option value="cyan">Cyan</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Icon</label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <option value="Zap">⚡ Lightning (Zap)</option>
                        <option value="Cpu">💻 Microchip (Cpu)</option>
                        <option value="Activity">📈 Pulse (Activity)</option>
                        <option value="CircuitBoard">🎛️ Circuit Board</option>
                        <option value="Lightbulb">💡 Bulb (Lightbulb)</option>
                        <option value="Radio">📻 Wave (Radio)</option>
                        <option value="Wifi">📶 Signal (Wifi)</option>
                      </select>
                    </div>
                  </div>

                  {/* Question Builder */}
                  <div className="border-t border-neutral-800 pt-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-white text-base">📝 Quiz Questions ({questions.length})</h4>
                      <button
                        onClick={addQuestionField}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg border border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-xs font-medium transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Add Question
                      </button>
                    </div>

                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                      {questions.map((q, qIndex) => (
                        <div key={q.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/50 space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Question #{qIndex + 1}</span>
                            {questions.length > 1 && (
                              <button
                                onClick={() => removeQuestionField(qIndex)}
                                className="text-xs text-red-400 hover:text-red-300 font-medium"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                              placeholder="Question text..."
                              className="flex h-9 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1 text-sm text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt: string, optIndex: number) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <span className="text-xs text-neutral-500 font-bold">{String.fromCharCode(65 + optIndex)}:</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                  placeholder={`Option ${optIndex + 1}`}
                                  className="flex h-8 w-full rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-white"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Correct Answer</label>
                              <select
                                value={q.correctAnswer}
                                onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", Number(e.target.value))}
                                className="flex h-8 w-full rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-white"
                              >
                                {q.options.map((_, idx) => (
                                  <option key={idx} value={idx}>Option {String.fromCharCode(65 + idx)}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Explanation</label>
                              <input
                                type="text"
                                value={q.explanation}
                                onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                                placeholder="Why is this answer correct?"
                                className="flex h-8 w-full rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end border-t border-neutral-800 pt-6">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveQuiz}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-lg"
                    >
                      {editingId ? "Save Changes" : "Create Quiz"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="mb-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-white inline-block relative">
              Available Quizzes
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500"></span>
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Select a quiz below to test your knowledge and improve your understanding of electrical engineering concepts
            </p>
          </motion.div>
        </div>

        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto mb-12 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-center text-sm text-neutral-300 relative z-10"
          >
            <p className="mb-2">🔒 You must be signed in with your <span className="text-blue-400 font-semibold">@srmist.edu.in</span> student account to attempt the quizzes.</p>
            <Link href="/signin" className="text-blue-400 hover:text-blue-300 underline font-medium">Sign in to your account</Link>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 relative z-10">
            No quizzes available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto relative z-10">
            {quizzes.map((quiz, index) => (
              <AnimatedQuizCard 
                key={quiz.id} 
                quiz={quiz} 
                index={index} 
                isAuthenticated={isAuthenticated} 
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
        
        <ElectronFlow />
      </div>
    </div>
  )
}



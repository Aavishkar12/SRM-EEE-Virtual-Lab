"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { DigitalClock } from "@/components/digital-clock"
import { DynamicSidebar } from "@/components/dynamic-sidebar"
import Link from "next/link"
import { Mail, ExternalLink, Home, BookOpen, Settings, LogIn, FileQuestion, Users, Info, ChevronRight, Lightbulb, Microscope, BookOpenCheck, Users2, Sparkles, Library, User } from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { AuroraBackground } from "@/components/aurora-background"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect"
import { cn } from "@/lib/utils"

export default function AboutPage() {
  const dockItems = [
    { title: "Home", icon: <Home className="h-full w-full text-neutral-300" />, href: "/" },
    { title: "Experiments", icon: <BookOpen className="h-full w-full text-neutral-300" />, href: "/experiments" },
    { title: "Study Room", icon: <Library className="h-full w-full text-neutral-300" />, href: "/study-room" },
    { title: "Quizzes", icon: <FileQuestion className="h-full w-full text-neutral-300" />, href: "/quizzes" },
    { title: "Team", icon: <Users className="h-full w-full text-neutral-300" />, href: "/team" },
    { title: "About", icon: <Info className="h-full w-full text-neutral-300" />, href: "/about" },
    { title: "Profile", icon: <User className="h-full w-full text-neutral-300" />, href: "/profile" }, { title: "Settings", icon: <Settings className="h-full w-full text-neutral-300" />, href: "/settings" },
    { title: "Sign In", icon: <LogIn className="h-full w-full text-neutral-300" />, href: "/signin" },
  ]

  // For the scroll-triggered animations
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.3], [0.2, 1.2])
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.3], [0.15, 1.2])
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.3], [0.1, 1.2])
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.3], [0.05, 1.2])
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.3], [0, 1.2])

  // For faculty card hover effect
  const [hoveredFaculty, setHoveredFaculty] = useState<number | null>(null)

  // For feature cards animation
  const featureIcons = [
    <Lightbulb key="interactive" className="h-8 w-8 text-blue-400" />,
    <Microscope key="hands-on" className="h-8 w-8 text-blue-400" />,
    <BookOpenCheck key="comprehensive" className="h-8 w-8 text-blue-400" />,
    <Users2 key="expert" className="h-8 w-8 text-blue-400" />,
    <Sparkles key="modern" className="h-8 w-8 text-blue-400" />,
  ]

  // For animated counter
  const [count, setCount] = useState({ students: 0, experiments: 0, years: 0, publications: 0 })
  const targetCount = { students: 1200, experiments: 45, years: 15, publications: 78 }
  
  useEffect(() => {
    const duration = 2000 // 2 seconds
    const frameRate = 1000 / 60 // 60 fps
    const totalFrames = duration / frameRate
    
    let frame = 0
    const counter = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      
      if (frame <= totalFrames) {
        setCount({
          students: Math.floor(progress * targetCount.students),
          experiments: Math.floor(progress * targetCount.experiments),
          years: Math.floor(progress * targetCount.years),
          publications: Math.floor(progress * targetCount.publications)
        })
      } else {
        clearInterval(counter)
        setCount(targetCount)
      }
    }, frameRate)
    
    return () => clearInterval(counter)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" ref={containerRef}>
      {/* Dynamic Sidebar */}
      <DynamicSidebar />
      
      {/* Centered navigation at the top */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} className="w-auto" mobileClassName="w-auto" />
      </div>

      <div className="absolute top-4 left-20 md:left-48 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center"
        >
          <div className="h-10 bg-white text-blue-800 font-bold px-3 py-1 rounded">SRM EEE Virtual Lab</div>
        </motion.div>
      </div>

      <DigitalClock />

      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="h-[70vh] flex items-center justify-center mb-16">
        <div className="text-center z-10 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            About SRM EEE Virtual Lab
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-neutral-200 max-w-3xl mx-auto"
          >
            Empowering the next generation of electrical engineers through innovation and excellence
          </motion.p>
        </div>
      </AuroraBackground>

      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Gemini Effect Section */}
        <div className="h-[50vh] mb-24 relative">
          <GoogleGeminiEffect
            pathLengths={[pathLengthFirst, pathLengthSecond, pathLengthThird, pathLengthFourth, pathLengthFifth]}
            title="Excellence in Engineering Education"
            description="Discover the future of electrical engineering at SRM University"
          />
        </div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="prose prose-invert max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white inline-block relative">
                Our Mission
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500"></span>
              </h2>
              <p className="text-xl text-neutral-300 mb-6 leading-relaxed">
                The SRM EEE Virtual Lab is an integral resource of the Electrical and Electronics Engineering Department at SRM
                Institute of Science and Technology, Kattankulathur. The lab is dedicated to offering engineering students
                a comprehensive platform to explore, experiment, and develop a robust understanding of the fundamental
                principles of electrical and electronics engineering.
              </p>

              <p className="text-xl text-neutral-300 mb-12 leading-relaxed">
                We are committed to enriching the practical application of theoretical knowledge, empowering students to
                enhance their problem-solving skills, technical expertise, and foster a passion for innovation within the
                engineering domain.
              </p>
            </motion.div>

            {/* Stats Counter Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
            >
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/10 backdrop-blur-sm border border-blue-800/30 rounded-xl p-6 text-center">
                <h3 className="text-4xl font-bold text-blue-400 mb-2">{count.students}+</h3>
                <p className="text-neutral-300">Students Trained</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/10 backdrop-blur-sm border border-purple-800/30 rounded-xl p-6 text-center">
                <h3 className="text-4xl font-bold text-purple-400 mb-2">{count.experiments}</h3>
                <p className="text-neutral-300">Experiments</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/10 backdrop-blur-sm border border-indigo-800/30 rounded-xl p-6 text-center">
                <h3 className="text-4xl font-bold text-indigo-400 mb-2">{count.years}</h3>
                <p className="text-neutral-300">Years of Excellence</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/10 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 text-center">
                <h3 className="text-4xl font-bold text-cyan-400 mb-2">{count.publications}</h3>
                <p className="text-neutral-300">Research Publications</p>
              </div>
            </motion.div>

            {/* Faculty Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white inline-block relative">
                Faculty Team
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500"></span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
              {[
                {
                  name: "Dr. K. Saravanan",
                  position: "Associate Professor",
                  email: "saravanan@srm.edu.in"
                },
                {
                  name: "Dr. S. Vidyasagar",
                  position: "Assistant Professor",
                  email: "vidyasagar@srm.edu.in"
                },
                {
                  name: "Dr. D. Sattianandan",
                  position: "Associate Professor",
                  email: "sattianandan@srm.edu.in"
                },
                {
                  name: "Dr. V. Kalyanasundaram",
                  position: "Assistant Professor",
                  email: "kalyanasundaram@srm.edu.in"
                }
              ].map((faculty, index) => (
                <motion.div 
                  key={faculty.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                  onMouseEnter={() => setHoveredFaculty(index)}
                  onMouseLeave={() => setHoveredFaculty(null)}
                >
                  <div className="relative h-full rounded-2xl border border-neutral-800 p-2 overflow-hidden">
                    <GlowingEffect spread={40} glow={hoveredFaculty === index} disabled={false} proximity={64} inactiveZone={0.01} />
                    <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 bg-neutral-900/80 backdrop-blur-sm shadow-md">
                      <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-white">{faculty.name}</h3>
                          <p className="text-blue-400 mt-1">{faculty.position}</p>
                          <p className="text-neutral-400 mt-1">Department of Electrical and Electronics Engineering</p>
                          <p className="text-neutral-400">Kattankulathur 603 203</p>
                          <Link
                            href={`mailto:${faculty.email}`}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-4 group"
                          >
                            <Mail className="h-4 w-4" /> 
                            <span>{faculty.email}</span>
                            <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Objectives Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white inline-block relative">
                Objectives of the Lab
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500"></span>
              </h2>
            </motion.div>

            <div className="mb-24">
              {[
                "To offer students hands-on experience with fundamental electrical and electronics experiments.",
                "To strengthen theoretical knowledge through practical applications and simulations.",
                "To cultivate critical thinking, teamwork, and effective problem-solving skills.",
                "To establish a robust foundation for advanced studies in electrical and electronics engineering."
              ].map((objective, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 mb-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-900/50 border border-blue-700/50 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">{index + 1}</span>
                  </div>
                  <p className="text-lg text-neutral-300 pt-1.5">{objective}</p>
                </motion.div>
              ))}
            </div>

            {/* Key Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white inline-block relative">
                Key Features
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500"></span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
              {[
                {
                  title: "Interactive Simulations",
                  description: "Access a variety of simulations that bring complex concepts to life, allowing students to experiment and observe outcomes in a virtual environment."
                },
                {
                  title: "Hands-On Learning",
                  description: "Engage in practical experiments that reinforce theoretical knowledge and develop essential technical skills."
                },
                {
                  title: "Comprehensive Learning Experience",
                  description: "Benefit from a curriculum designed to provide a deep understanding of electrical and electronics engineering principles through a blend of theory and practice."
                },
                {
                  title: "Expert Guidance",
                  description: "Receive mentorship and support from experienced faculty members, ensuring clarity and fostering a comprehensive learning environment."
                },
                {
                  title: "Modern Resources",
                  description: "Utilize contemporary tools and equipment that align with current industry standards and technological advancements.",
                  span: true
                }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "group relative overflow-hidden rounded-xl p-1",
                    feature.span && "md:col-span-2"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-lg p-6 h-full relative z-10 overflow-hidden group-hover:border-blue-800/50 transition-colors duration-300">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-900/20 rounded-full blur-xl group-hover:bg-blue-800/30 transition-colors duration-300"></div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-blue-900/30 rounded-lg border border-blue-800/30 group-hover:bg-blue-800/40 transition-colors duration-300">
                        {featureIcons[index]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-colors duration-300">{feature.title}</h3>
                        <p className="text-neutral-300 group-hover:text-neutral-200 transition-colors duration-300">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-white inline-block relative">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-500"></span>
              </h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-24"
            >
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 backdrop-blur-sm border border-blue-900/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Department of Electrical and Electronics Engineering
                </h3>
                <p className="text-neutral-300 text-lg">SRM Institute of Science and Technology</p>
                <p className="text-neutral-300 text-lg">Kattankulathur 603 203</p>

                <div className="mt-8 flex flex-col sm:flex-row gap-6">
                  <Link
                    href="mailto:eee@srm.edu.in"
                    className="flex items-center gap-3 text-blue-400 hover:text-blue-300 group bg-blue-900/20 hover:bg-blue-900/30 transition-colors duration-300 px-4 py-3 rounded-lg border border-blue-800/30"
                  >
                    <Mail className="h-5 w-5" /> 
                    <span className="text-lg">eee@srm.edu.in</span>
                    <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <Link
                    href="https://www.srmist.edu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-blue-400 hover:text-blue-300 group bg-blue-900/20 hover:bg-blue-900/30 transition-colors duration-300 px-4 py-3 rounded-lg border border-blue-800/30"
                  >
                    <ExternalLink className="h-5 w-5" /> 
                    <span className="text-lg">www.srmist.edu.in</span>
                    <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


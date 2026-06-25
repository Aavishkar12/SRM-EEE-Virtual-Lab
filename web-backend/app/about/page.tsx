"use client"
import { NavDock } from "@/components/nav-dock"

import { useState } from "react"
import { motion } from "framer-motion"
import { DigitalClock } from "@/components/digital-clock"
import Link from "next/link"
import {
  Mail,
  ExternalLink,
  Home,
  BookOpen,
  Settings,
  LogIn,
  FileQuestion,
  Users,
  Info,
  ChevronRight,
  Lightbulb,
  Microscope,
  BookOpenCheck,
  Users2,
  Sparkles,
  Library,
  User,
  FlaskConical,
  GraduationCap,
  Clock,
  Zap,
  CircuitBoard,
  BookMarked,
} from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Experiments", value: "12+", icon: FlaskConical, color: "blue" },
  { label: "Quiz Questions", value: "50+", icon: BookMarked, color: "purple" },
  { label: "Study Resources", value: "30+", icon: GraduationCap, color: "indigo" },
  { label: "24 / 7 Access", value: "∞", icon: Clock, color: "cyan" },
]

const features = [
  {
    title: "Interactive Simulations",
    description:
      "Run circuit simulations and observe real-time behavior of electrical systems without physical hardware.",
    Icon: CircuitBoard,
  },
  {
    title: "Hands-On Learning",
    description:
      "Step-by-step guided experiments reinforce theoretical knowledge and develop essential technical skills.",
    Icon: Microscope,
  },
  {
    title: "Comprehensive Coverage",
    description:
      "Covers the full 26EEE1001T Basic Electrical Engineering curriculum — from DC circuits to AC theory.",
    Icon: BookOpenCheck,
  },
  {
    title: "Expert Guidance",
    description:
      "Content designed and reviewed by faculty from the Department of EEE, SRM IST Kattankulathur.",
    Icon: Users2,
  },
  {
    title: "Modern Stack",
    description:
      "Built with Next.js, real-time data, and interactive UI so the learning experience stays current and accessible.",
    Icon: Sparkles,
  },
  {
    title: "Self-Paced Quizzes",
    description:
      "Test your understanding with quizzes mapped to each experiment, with instant feedback and scoring.",
    Icon: Lightbulb,
  },
]

const faculty = [
  {
    name: "Dr. S. Vidyasagar",
    position: "Assistant Professor",
    email: "vidyasagar@srm.edu.in",
  },
  {
    name: "Dr. K. Saravanan",
    position: "Associate Professor",
    email: "saravanan@srm.edu.in",
  },
  {
    name: "Dr. D. Sattianandan",
    position: "Associate Professor",
    email: "sattianandan@srm.edu.in",
  },
  {
    name: "Dr. V. Kalyanasundaram",
    position: "Assistant Professor",
    email: "kalyanasundaram@srm.edu.in",
  },
]

const objectives = [
  "Provide hands-on experience with fundamental electrical and electronics experiments in a safe virtual environment.",
  "Strengthen theoretical knowledge through interactive simulations and practical applications.",
  "Cultivate critical thinking, data analysis, and problem-solving skills essential for an engineer.",
  "Establish a strong foundation for advanced studies in power systems, electronics, and control engineering.",
]

export default function AboutPage() {
  const [hoveredFaculty, setHoveredFaculty] = useState<number | null>(null)

  const colorMap: Record<string, string> = {
    blue: "from-blue-900/40 to-blue-800/10 border-blue-800/30 text-blue-400",
    purple: "from-purple-900/40 to-purple-800/10 border-purple-800/30 text-purple-400",
    indigo: "from-indigo-900/40 to-indigo-800/10 border-indigo-800/30 text-indigo-400",
    cyan: "from-cyan-900/40 to-cyan-800/10 border-cyan-800/30 text-cyan-400",
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">


      <DigitalClock />

      
      <NavDock />
{/* Hero */}
      <div className="relative flex min-h-[55vh] flex-col items-center justify-center overflow-hidden px-4 pt-28 sm:pt-32 pb-16 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute left-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-purple-600/8 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300"
        >
          <Zap className="h-3.5 w-3.5" />
          SRM Institute of Science and Technology
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400"
        >
          EEE Virtual Lab
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg text-neutral-400 md:text-xl"
        >
          An interactive virtual laboratory for the Department of Electrical &amp; Electronics Engineering —
          empowering students with 24/7 access to experiments, simulations, and study resources.
        </motion.p>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 space-y-24">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-5 md:grid-cols-4"
        >
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className={cn(
                "rounded-2xl border bg-gradient-to-br p-6 text-center backdrop-blur-sm",
                colorMap[color],
              )}
            >
              <Icon className={cn("mx-auto mb-3 h-7 w-7", colorMap[color].split(" ").find(c => c.startsWith("text-")))} />
              <h3 className="text-4xl font-bold mb-1">{value}</h3>
              <p className="text-sm text-neutral-400">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="relative mb-8 inline-block text-3xl font-bold text-white">
            Our Mission
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-blue-500" />
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <p className="text-lg leading-relaxed text-neutral-300">
              The SRM EEE Virtual Lab is a resource of the Electrical and Electronics Engineering Department
              at SRM Institute of Science and Technology, Kattankulathur. The lab gives engineering students
              a comprehensive platform to explore, experiment, and build a robust understanding of the core
              principles of electrical and electronics engineering.
            </p>
            <p className="text-lg leading-relaxed text-neutral-300">
              We are committed to bridging the gap between theory and practice — empowering students to
              enhance their problem-solving skills, strengthen technical expertise, and foster a passion for
              innovation in the engineering domain, anytime and from anywhere.
            </p>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="relative mb-8 inline-block text-3xl font-bold text-white">
            Key Features
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-blue-500" />
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const { Icon } = feature
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  viewport={{ once: true }}
                  className="group rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm transition-colors hover:border-blue-800/50"
                >
                  <div className="mb-4 inline-flex rounded-lg border border-blue-800/30 bg-blue-900/30 p-2.5">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Objectives */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="relative mb-8 inline-block text-3xl font-bold text-white">
            Objectives
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-blue-500" />
          </h2>
          <div className="space-y-4">
            {objectives.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-700/50 bg-blue-900/50 text-sm font-bold text-blue-400">
                  {index + 1}
                </div>
                <p className="pt-1.5 text-base text-neutral-300">{objective}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Faculty */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="relative mb-8 inline-block text-3xl font-bold text-white">
            Faculty Team
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-blue-500" />
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {faculty.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="relative"
                onMouseEnter={() => setHoveredFaculty(index)}
                onMouseLeave={() => setHoveredFaculty(null)}
              >
                <div className="relative h-full rounded-2xl border border-neutral-800 p-2">
                  <GlowingEffect
                    spread={40}
                    glow={hoveredFaculty === index}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                  />
                  <div className="relative flex flex-col gap-3 rounded-xl border-0.75 bg-neutral-900/80 p-5 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-lg font-bold text-white">
                        {member.name.split(" ").slice(-1)[0][0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{member.name}</h3>
                        <p className="text-sm text-blue-400">{member.position}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Dept. of Electrical &amp; Electronics Engineering
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 group/link"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {member.email}
                      <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="pb-16"
        >
          <h2 className="relative mb-8 inline-block text-3xl font-bold text-white">
            Contact Us
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-blue-500" />
          </h2>
          <div className="rounded-2xl border border-blue-900/30 bg-gradient-to-br from-blue-900/20 to-purple-900/10 p-8 backdrop-blur-sm">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
              <Zap className="h-3 w-3" />
              Get in Touch
            </div>
            <h3 className="mt-4 text-2xl font-bold text-white">
              Department of Electrical and Electronics Engineering
            </h3>
            <p className="mt-1 text-neutral-400">SRM Institute of Science and Technology</p>
            <p className="text-neutral-400">Kattankulathur 603 203, Tamil Nadu</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="mailto:eee@srm.edu.in"
                className="group flex items-center gap-3 rounded-xl border border-blue-800/30 bg-blue-900/20 px-5 py-3 text-blue-400 transition-colors hover:bg-blue-900/30 hover:text-blue-300"
              >
                <Mail className="h-5 w-5" />
                <span>eee@srm.edu.in</span>
                <ChevronRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
              <Link
                href="https://www.srmist.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-blue-800/30 bg-blue-900/20 px-5 py-3 text-blue-400 transition-colors hover:bg-blue-900/30 hover:text-blue-300"
              >
                <ExternalLink className="h-5 w-5" />
                <span>www.srmist.edu.in</span>
                <ChevronRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

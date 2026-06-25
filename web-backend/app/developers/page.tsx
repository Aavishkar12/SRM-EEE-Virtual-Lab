"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Instagram, Linkedin, GraduationCap, Calendar, BadgeCheck, Globe, ArrowLeft, Code2, Smartphone } from "lucide-react"
import { NavDock } from "@/components/nav-dock"

const developers = [
  {
    name: "Krishna Keshab Banik",
    registerNumber: "RA2411026011003",
    university: "SRM University of Science and Technology, Kattankulathur",
    batch: "2024 – 2028",
    role: "Full Stack Developer",
    roleIcon: Code2,
    photo: "/images/developers/krishna.png",
    socials: {
      instagram: "https://www.instagram.com/krish.banik.1234?igsh=YXNhYThlNnUwYjNr",
      linkedin: "https://www.linkedin.com/in/krishna-keshab-banik-067819324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/krishnakeshab-banik",
    },
    gradient: "from-violet-600 via-purple-600 to-blue-600",
    accent: "violet",
  },
  {
    name: "Vooka Sai Siddharth",
    registerNumber: "RA2511026010906",
    university: "SRM Institute of Science and Technology, Kattankulathur",
    batch: "2025 – 2029",
    role: "Full Stack Developer",
    roleIcon: Code2,
    photo: "/images/developers/siddharth.png",
    socials: {
      instagram: "https://www.instagram.com/saisiddharth2007?igsh=N3JxcGQ3bHR6MXFy",
      linkedin: "https://www.linkedin.com/in/sai-siddharth-ba0a92369",
      github: "https://github.com/siddharth-1118",
    },
    gradient: "from-cyan-600 via-teal-600 to-emerald-600",
    accent: "cyan",
  },
  {
    name: "Aavishkar Singh",
    registerNumber: "RA2511003011024",
    university: "SRM University of Science and Technology, Kattankulathur",
    batch: "2025 – 2029",
    role: "App Developer",
    roleIcon: Smartphone,
    photo: "/images/developers/aavishkar.png",
    socials: {
      instagram: "https://www.instagram.com/aavishkar__23?igsh=MWxwdW83czJyNXFxMw==",
      linkedin: "https://www.linkedin.com/in/aavishkar-singh-b2a2a5262?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      github: "https://github.com/Aavishkar12",
    },
    gradient: "from-orange-600 via-rose-600 to-pink-600",
    accent: "orange",
  },
]

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavDock />

      {/* Back link */}
      <div className="fixed top-4 left-4 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm bg-neutral-900/80 backdrop-blur px-3 py-2 rounded-lg border border-neutral-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-violet-900/20 via-purple-900/20 to-cyan-900/20 blur-3xl rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-violet-400 mb-4 border border-violet-800 bg-violet-950/40 px-4 py-1.5 rounded-full">
            Meet the Team
          </span>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-4">
            The Developers
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            The minds behind the SRM EEE Virtual Lab — building tools that make learning electrical engineering accessible and interactive.
          </p>
        </motion.div>
      </section>

      {/* Developer Cards */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="flex flex-col gap-10">
          {developers.map((dev, i) => {
            const RoleIcon = dev.roleIcon
            return (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all duration-300"
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${dev.gradient}`} />

                <div className="flex flex-col md:flex-row gap-0">
                  {/* Photo */}
                  <div className="md:w-56 shrink-0 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${dev.gradient} opacity-10`} />
                    <div className="relative h-64 md:h-full min-h-[240px]">
                      <Image
                        src={dev.photo}
                        alt={dev.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 224px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent md:bg-gradient-to-r" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{dev.name}</h2>
                      <div className="flex items-center gap-2">
                        <RoleIcon className="w-4 h-4 text-neutral-400" />
                        <span className={`text-sm font-medium bg-gradient-to-r ${dev.gradient} bg-clip-text text-transparent`}>
                          {dev.role}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2.5">
                        <BadgeCheck className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-600 uppercase tracking-wide">Register No.</p>
                          <p className="text-sm text-neutral-200 font-mono">{dev.registerNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Calendar className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-600 uppercase tracking-wide">Batch</p>
                          <p className="text-sm text-neutral-200">{dev.batch}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 sm:col-span-2">
                        <GraduationCap className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-600 uppercase tracking-wide">University</p>
                          <p className="text-sm text-neutral-200">{dev.university}</p>
                        </div>
                      </div>
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={dev.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 transition-all text-sm text-neutral-300 hover:text-white"
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                      <a
                        href={dev.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-700 hover:bg-blue-950/30 transition-all text-sm text-neutral-300 hover:text-blue-400"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn
                      </a>
                      <a
                        href={dev.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-pink-700 hover:bg-pink-950/30 transition-all text-sm text-neutral-300 hover:text-pink-400"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* SRM Insider Section */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-cyan-900/10 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
              Built for the students, by the students
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              SRM <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">INSIDER</span>
            </h2>
            <p className="text-neutral-400 max-w-lg mx-auto mb-8 text-base">
              SRM Insider is a student-driven platform built to empower the SRM community — from resources and events to projects like this Virtual Lab.
            </p>
            <a
              href="https://srminsider.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/30 hover:shadow-violet-900/50"
            >
              <Globe className="w-4 h-4" />
              Visit SRM Insider
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 text-center text-neutral-600 text-sm">
        © {new Date().getFullYear()} SRM EEE Virtual Lab · Developed with passion by SRM students
      </footer>
    </div>
  )
}

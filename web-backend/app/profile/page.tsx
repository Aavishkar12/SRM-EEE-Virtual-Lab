"use client"
import { NavDock } from "@/components/nav-dock"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  Home,
  BookOpen,
  Settings,
  LogIn,
  FileQuestion,
  Users,
  Info,
  Library,
  User,
  Mail,
  Hash,
  Building,
  Calendar,
  LayoutGrid,
  Layers,
  Phone,
  GraduationCap,
  Shield,
  BookOpenCheck,
  FlaskConical,
} from "lucide-react"
import { DigitalClock } from "@/components/digital-clock"
import { SrmAccessGate } from "@/components/srm-access-gate"
import { StudentProfileSummary } from "@/components/student-profile-summary"
import { getStudentDisplayName } from "@/lib/auth"

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user
  const displayName = getStudentDisplayName(user)


  const profileDetails = [
    { label: "Full Name", value: displayName, icon: <User className="h-5 w-5 text-blue-400" /> },
    { label: "SRM Email Address", value: user?.email, icon: <Mail className="h-5 w-5 text-purple-400" /> },
    { label: "Registration Number", value: user?.registrationNumber, icon: <Hash className="h-5 w-5 text-pink-400" /> },
    { label: "Branch", value: user?.branch ?? user?.department, icon: <Building className="h-5 w-5 text-emerald-400" /> },
    { label: "Year", value: user?.year, icon: <Calendar className="h-5 w-5 text-blue-300" /> },
    { label: "Semester", value: user?.semester, icon: <Calendar className="h-5 w-5 text-amber-400" /> },
    { label: "Batch", value: user?.batch, icon: <Layers className="h-5 w-5 text-yellow-400" /> },
    { label: "Section", value: user?.section, icon: <LayoutGrid className="h-5 w-5 text-cyan-400" /> },
    { label: "Mobile Number", value: user?.mobile, icon: <Phone className="h-5 w-5 text-indigo-400" /> },
    { label: "Program / Degree", value: user?.program, icon: <GraduationCap className="h-5 w-5 text-rose-400" /> },
    {
      label: "Portal Access Role",
      value: user?.role === "admin" ? "Administrator" : "Student",
      icon: <Shield className="h-5 w-5 text-red-400" />,
    },
  ].filter((item) => item.value && item.value !== "N/A")

  const quickStats = [
    { label: "Course Code", value: "26EEE1001T", icon: BookOpenCheck },
    { label: "Lab Access", value: "Active", icon: FlaskConical },
    { label: "Portal Role", value: user?.role === "admin" ? "Admin" : "Student", icon: Shield },
  ]

  return (
    <SrmAccessGate
      title="SRM profile access"
      description="Profile details are available only to signed-in SRM users."
      showSummary={false}
    >
      <div className="min-h-screen overflow-x-hidden bg-[#050508] text-white selection:bg-blue-500/30 selection:text-blue-200">

        <NavDock />

        <DigitalClock />

        <div className="mx-auto w-full max-w-6xl px-4 py-8 pt-28 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h1 className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                My Profile
              </h1>
              <p className="mt-2 max-w-2xl text-neutral-400">
                Your Academia-linked student profile with course, department, and portal access details.
              </p>
            </div>

            <StudentProfileSummary />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {quickStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-xl"
                  >
                    <div className="mb-3 flex items-center gap-2 text-blue-300">
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl md:p-8">
              <h2 className="border-b border-neutral-800 pb-4 text-xl font-bold">
                Academia Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {profileDetails.map((detail, idx) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 rounded-xl border border-neutral-800 bg-neutral-950/40 p-4 transition-all duration-300 hover:border-neutral-700/60 hover:bg-neutral-950/80"
                  >
                    <div className="flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                      {detail.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        {detail.label}
                      </p>
                      <p className="text-base font-semibold text-neutral-200">{detail.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SrmAccessGate>
  )
}

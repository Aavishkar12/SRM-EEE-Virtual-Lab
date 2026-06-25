"use client"

import { useSession, signOut } from "next-auth/react"
import {
  LogOut,
  Mail,
  Hash,
  Building2,
  Calendar,
  LayoutGrid,
  Layers,
  Phone,
  GraduationCap,
  Shield,
  User,
} from "lucide-react"
import { getStudentDisplayName } from "@/lib/auth"

type StudentProfileSummaryProps = {
  compact?: boolean
}

export function StudentProfileSummary({ compact = false }: StudentProfileSummaryProps) {
  const { data: session } = useSession()
  const user = session?.user

  if (!user?.email) {
    return null
  }

  const displayName = getStudentDisplayName(user)
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const details = [
    { label: "Registration No.", value: user.registrationNumber, icon: Hash },
    { label: "Branch", value: user.branch ?? user.department, icon: Building2 },
    { label: "Year", value: user.year, icon: Calendar },
    { label: "Semester", value: user.semester, icon: Calendar },
    { label: "Section", value: user.section, icon: LayoutGrid },
    { label: "Batch", value: user.batch, icon: Layers },
    { label: "Program", value: user.program, icon: GraduationCap },
    { label: "Mobile", value: user.mobile, icon: Phone },
    {
      label: "Access Role",
      value: user.role === "admin" ? "Administrator" : "Student",
      icon: Shield,
    },
  ].filter((item) => item.value && item.value !== "N/A")

  return (
    <div
      className={`overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-neutral-950/80 to-purple-500/5 ${
        compact ? "p-4" : "p-6 md:p-8"
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
            {initials || <User className="h-7 w-7" />}
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300/80">
              Student Profile
            </p>
            <h2 className={`${compact ? "text-xl" : "text-3xl"} font-bold text-white`}>
              {displayName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-black/30 px-3 py-1">
                <Mail className="h-3.5 w-3.5 text-purple-300" />
                {user.email}
              </span>
              {user.branch ?? user.department ? (
                <span className="rounded-full border border-neutral-800 bg-black/30 px-3 py-1">
                  {user.branch ?? user.department}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void signOut({ redirect: true, callbackUrl: "/" })}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-red-300 transition-colors hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>

      <div
        className={`mt-6 grid gap-3 ${
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
        }`}
      >
        {details.map((detail) => {
          const Icon = detail.icon
          return (
            <div
              key={detail.label}
              className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3.5 transition-colors hover:border-blue-500/20 hover:bg-black/40"
            >
              <div className="mb-2 flex items-center gap-2 text-blue-300/80">
                <Icon className="h-4 w-4" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {detail.label}
                </p>
              </div>
              <p className="text-sm font-medium text-neutral-100">{detail.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

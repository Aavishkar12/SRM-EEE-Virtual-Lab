"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Lock, ShieldAlert } from "lucide-react"
import { isSrmEmail } from "@/lib/auth"
import { StudentProfileSummary } from "@/components/student-profile-summary"

type SrmAccessGateProps = {
  children: React.ReactNode
  title: string
  description: string
  showSummary?: boolean
}

export function SrmAccessGate({ children, title, description, showSummary = false }: SrmAccessGateProps) {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-6 py-5 text-center">
          <p className="text-sm text-neutral-400">Checking your SRM access...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-blue-500/20 bg-neutral-900/80 p-6 text-center">
          <Lock className="mx-auto mb-4 h-10 w-10 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">{description}</p>
          <p className="mt-3 text-sm text-neutral-400">
            Sign in with your <span className="text-blue-300">@srmist.edu.in</span> email to continue.
          </p>
          <Link
            href="/signin"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  const isAdmin = session.user.role === "admin"
  if (!isAdmin && !isSrmEmail(session.user.email)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-amber-500/20 bg-neutral-900/80 p-6 text-center">
          <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-amber-400" />
          <h2 className="text-xl font-semibold text-white">SRM Email Required</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            This section is available only to users signed in with an SRM email address.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showSummary && <StudentProfileSummary compact />}
      {children}
    </>
  )
}

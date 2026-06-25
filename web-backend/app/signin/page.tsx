"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Lock, Mail } from "lucide-react"
import { DigitalClock } from "@/components/digital-clock"
import { NavDock } from "@/components/nav-dock"
import { BrandLogo } from "@/components/brand-logo"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { isSrmEmail, getStudentDisplayName } from "@/lib/auth"
import { apiUrl } from "@/lib/api"
import { motion } from "framer-motion"

export default function SigninPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.email || !formData.password) throw new Error("All fields are required")
      if (!isSrmEmail(formData.email)) throw new Error("Only @srmist.edu.in email accounts are allowed")

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) throw new Error("Invalid credentials — check your SRM Academia email and password")

      let displayName = getStudentDisplayName({ email: formData.email })
      try {
        const sessionResponse = await fetch(apiUrl("/api/auth/session"))
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          if (sessionData?.user) displayName = getStudentDisplayName(sessionData.user)
        }
      } catch (_) {}

      toast.success(`Welcome, ${displayName}! Redirecting…`)
      setTimeout(() => router.push("/"), 1200)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050508] text-white overflow-x-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <NavDock />
      <DigitalClock />

      <div className="relative z-10 w-full max-w-md px-4 py-28">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-neutral-800/80 bg-neutral-950/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md"
        >
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <BrandLogo linked={false} size="lg" />
            <div>
              <h1 className="text-xl font-bold text-white">Sign in to SRM EEE VLab</h1>
              <p className="mt-1 text-sm text-neutral-400">
                Use your SRM Academia credentials to continue
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                SRM Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="yourname@srmist.edu.in"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={cn(
                    "w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2.5 pl-9 pr-4 text-sm text-white",
                    "placeholder:text-neutral-600 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={cn(
                    "w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2.5 pl-9 pr-4 text-sm text-white",
                    "placeholder:text-neutral-600 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition"
                  )}
                />
              </div>
              <p className="text-right text-xs text-neutral-600">
                Same password as your SRM Academia portal
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg py-2.5 text-sm font-semibold text-white transition",
                "bg-blue-600 hover:bg-blue-500 active:bg-blue-700",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "shadow-lg shadow-blue-600/20"
              )}
            >
              {isLoading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          {/* Info note */}
          <p className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 text-center text-xs text-neutral-500">
            Your credentials are used only to authenticate with SRM Academia. They are not stored on this platform.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

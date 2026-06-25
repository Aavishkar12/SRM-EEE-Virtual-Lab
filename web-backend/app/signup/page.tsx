"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Lock, Mail, User } from "lucide-react"
import { DigitalClock } from "@/components/digital-clock"
import { NavDock } from "@/components/nav-dock"
import { BrandLogo } from "@/components/brand-logo"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { isSrmEmail } from "@/lib/auth"
import { motion } from "framer-motion"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!formData.firstname || !formData.lastname || !formData.email || !formData.password)
        throw new Error("All fields are required")
      if (formData.password.length < 8)
        throw new Error("Password must be at least 8 characters long")
      if (!isSrmEmail(formData.email))
        throw new Error("Only @srmist.edu.in email accounts are allowed")

      toast.success("SRM email accepted. Redirecting to sign in…")
      setTimeout(() => router.push("/signin"), 1500)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050508] text-white overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/8 blur-[120px]" />
      </div>

      <NavDock />
      <DigitalClock />

      <div className="relative z-10 w-full max-w-md px-4 py-28">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors">
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
              <h1 className="text-xl font-bold text-white">Create your account</h1>
              <p className="mt-1 text-sm text-neutral-400">Join SRM EEE Virtual Lab with your SRM email</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="firstname" className="block text-sm font-medium text-neutral-300">First name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <input id="firstname" type="text" placeholder="Krishna" value={formData.firstname} onChange={handleChange} required
                    className={cn("w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2.5 pl-9 pr-3 text-sm text-white",
                      "placeholder:text-neutral-600 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastname" className="block text-sm font-medium text-neutral-300">Last name</label>
                <input id="lastname" type="text" placeholder="Kumar" value={formData.lastname} onChange={handleChange} required
                  className={cn("w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2.5 px-3 text-sm text-white",
                    "placeholder:text-neutral-600 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300">SRM Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input id="email" type="email" placeholder="yourname@srmist.edu.in" value={formData.email} onChange={handleChange} required
                  className={cn("w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2.5 pl-9 pr-4 text-sm text-white",
                    "placeholder:text-neutral-600 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input id="password" type="password" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required minLength={8}
                  className={cn("w-full rounded-lg border border-neutral-800 bg-neutral-900 py-2.5 pl-9 pr-4 text-sm text-white",
                    "placeholder:text-neutral-600 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition")} />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className={cn("w-full rounded-lg py-2.5 text-sm font-semibold text-white transition mt-2",
                "bg-purple-600 hover:bg-purple-500 active:bg-purple-700",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "shadow-lg shadow-purple-600/20")}>
              {isLoading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

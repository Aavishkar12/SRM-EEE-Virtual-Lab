"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DigitalClock } from "@/components/digital-clock"
import { SidebarDemo } from "@/components/sidebar-demo"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { isSrmEmail } from "@/lib/auth"

export default function SigninPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        throw new Error("All fields are required")
      }

      if (!isSrmEmail(formData.email)) {
        throw new Error("Only @srmist.edu.in email accounts are allowed")
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error("Unable to sign in with this SRM email")
      }

      // Fetch the session to retrieve the scraped student name
      let displayName = formData.email.split("@")[0]
      try {
        const sessionResponse = await fetch("/api/auth/session")
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          if (sessionData?.user?.name) {
            displayName = sessionData.user.name
          }
        }
      } catch (err) {
        console.error("Failed to fetch session name", err)
      }

      // Success
      toast.success(`Welcome, ${displayName}! Redirecting to home...`)

      // Redirect to home page after successful signin
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-black text-white overflow-x-hidden">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 z-40 h-screen">
        <SidebarDemo />
      </div>

      <DigitalClock />

      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-6 py-24 pl-0 md:pl-24">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="absolute top-4 left-4 text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors pl-0 md:pl-16"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-black p-4 md:rounded-2xl md:p-8 dark:bg-black border border-neutral-800">
            <h2 className="text-xl font-bold text-neutral-200">Welcome Back</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-300">Sign in with your SRM Academia email and password to open academic resources and attempt quizzes.</p>

            <form className="my-8" onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="yourname@srmist.edu.in"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-neutral-500">Admin override: admin@srmist.edu.in / password123</p>
                  <Link href="#" className="text-xs text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </Link>
                </div>
              </LabelInputContainer>

              <button
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-blue-600 to-blue-700 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-blue-700 dark:to-blue-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in →"}
                <BottomGradient />
              </button>


            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}

"use client"

import { SessionProvider } from "next-auth/react"
import { getAuthBasePath } from "@/lib/api"

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const basePath = getAuthBasePath()

  return <SessionProvider basePath={basePath}>{children}</SessionProvider>
}


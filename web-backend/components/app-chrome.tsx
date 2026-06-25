"use client"

import { SiteLogo } from "@/components/site-logo"

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteLogo />
      {children}
    </>
  )
}

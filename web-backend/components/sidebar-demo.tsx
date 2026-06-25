<<<<<<< HEAD
"use client"
import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { Home, BookOpen, FileQuestion, User, Settings, LogOut, Library, Menu, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider, useSidebar } from "@/components/ui/sidebar"


export function SidebarDemo() {
  const { data: session } = useSession()
  const user = session?.user
  const links = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
    {
      label: "Experiments",
      href: "/#experiments",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
    {
      label: "Study Room",
      href: "/study-room",
      icon: <Library className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
    {
      label: "Quizzes",
      href: "/quizzes",
      icon: <FileQuestion className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
    {
      label: "About",
      href: "#about",
      icon: <User className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Hamburger menu toggle */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 text-white hover:bg-neutral-800 md:hidden transition-all shadow-lg shadow-black/50"
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className={cn("h-screen")}>
        <SidebarProvider open={open} setOpen={setOpen}>
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarContentDemo links={links} user={user} />
          </Sidebar>
        </SidebarProvider>
      </div>
    </>
  )
}

function SidebarContentDemo({ links, user }: { links: any[]; user: any }) {
  const { open, setOpen, hovered } = useSidebar()
  const isExpanded = open || hovered

  return (
    <SidebarBody className="justify-between gap-10">
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {isExpanded ? <Logo /> : <LogoIcon />}
        <div className="mt-8 flex flex-col gap-2">
          {links.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
        </div>
      </div>
      <div className="space-y-3 border-t border-white/10 pt-3">
        {user?.email ? (
          <div className="rounded-xl border border-white/8 bg-white/5 px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {(user.name || user.email || "S").charAt(0).toUpperCase()}
              </div>
              {isExpanded && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user.name || "SRM Student"}</p>
                  <p className="truncate text-xs text-neutral-400">{user.department || user.email}</p>
                </div>
              )}
            </div>
            {isExpanded && (
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-300 transition-colors hover:bg-red-500/20"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            )}
          </div>
        ) : (
          <SidebarLink
            link={{
              label: "Student",
              href: "#",
              icon: (
                <div className="h-7 w-7 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  S
                </div>
              ),
            }}
          />
        )}
      </div>
    </SidebarBody>
  )
}

export const Logo = () => {
  const { setOpen } = useSidebar()
  return (
    <div className="relative z-20 flex items-center justify-between py-1 text-sm font-normal text-white pr-2">
      <Link href="/" className="flex items-center space-x-2">
        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-blue-500" />
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-white">
          SRM Lab
        </motion.span>
      </Link>
      <button
        onClick={() => setOpen(false)}
        className="md:hidden p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
        aria-label="Close Sidebar"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export const LogoIcon = () => {
  return (
    <Link href="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-blue-500" />
    </Link>
  )
}


=======
﻿"use client"

export { DynamicSidebar as SidebarDemo } from "@/components/dynamic-sidebar"
export const Logo = () => null
export const LogoIcon = () => null
>>>>>>> 0767c26ba23cca4037905bf5444f09b20b77d1d5

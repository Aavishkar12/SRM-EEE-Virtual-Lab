"use client"

import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, BookOpen, Zap, CircuitBoardIcon as Circuit, Cpu, Lightbulb, User, Settings, LogIn } from "lucide-react"

export function EEESidebar() {
  const links = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Experiments",
      href: "/#experiments",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Ohm's Law",
      href: "/experiments/1",
      icon: <Zap className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "RC Circuits",
      href: "/experiments/2",
      icon: <Circuit className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Digital Logic",
      href: "/experiments/8",
      icon: <Cpu className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Power Electronics",
      href: "/experiments/10",
      icon: <Lightbulb className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "About",
      href: "#about",
      icon: <User className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Sign Up",
      href: "/signup",
      icon: <LogIn className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </SidebarProvider>
  )
}

export const Logo = () => {
  return (
    <Link href="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-blue-500" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-black">
        EEE Learning
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link href="/" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-blue-500" />
    </Link>
  )
}


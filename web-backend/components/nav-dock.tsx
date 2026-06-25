"use client"

import { useSession, signOut } from "next-auth/react"
import {
  Home,
  BookOpen,
  FileQuestion,
  Users,
  Info,
  User,
  Settings,
  LogIn,
  LogOut,
  Library,
} from "lucide-react"
import { FloatingDock } from "@/components/ui/floating-dock"

export function NavDock() {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user?.email

  const baseItems = [
    { title: "Home", icon: <Home className="h-full w-full text-neutral-300" />, href: "/" },
    { title: "Experiments", icon: <BookOpen className="h-full w-full text-neutral-300" />, href: "/experiments" },
    { title: "Study Room", icon: <Library className="h-full w-full text-neutral-300" />, href: "/study-room" },
    { title: "Quizzes", icon: <FileQuestion className="h-full w-full text-neutral-300" />, href: "/quizzes" },
    { title: "Team", icon: <Users className="h-full w-full text-neutral-300" />, href: "/team" },
    { title: "About", icon: <Info className="h-full w-full text-neutral-300" />, href: "/about" },
    { title: "Profile", icon: <User className="h-full w-full text-neutral-300" />, href: "/profile" },
    { title: "Settings", icon: <Settings className="h-full w-full text-neutral-300" />, href: "/settings" },
  ]

  const authItem = isLoggedIn
    ? {
        title: "Log Out",
        icon: <LogOut className="h-full w-full text-red-400" />,
        href: "#",
        onClick: () => signOut({ redirect: true, callbackUrl: "/" }),
      }
    : {
        title: "Sign In",
        icon: <LogIn className="h-full w-full text-blue-400" />,
        href: "/signin",
      }

  return (
    <div className="fixed top-3 left-1/2 z-50 -translate-x-1/2">
      <FloatingDock items={[...baseItems, authItem]} />
    </div>
  )
}

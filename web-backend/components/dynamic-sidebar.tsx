"use client"

import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Home,
  BookOpen,
  FileQuestion,
  Settings,
  LogIn,
  LogOut,
  User,
  Users,
  Info,
  BookMarked,
  Zap,
  Target,
  BookText,
  ClipboardList,
  Play,
<<<<<<< HEAD
  BookMarked,
  Users,
  Info,
  Zap,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
=======
} from "lucide-react"
import { getStudentDisplayName } from "@/lib/auth"

type NavItem = {
  label: string
  href: string
  Icon: React.ElementType
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const base = item.href.split("#")[0]
  const isActive =
    pathname === base ||
    (base !== "/" && pathname.startsWith(base))
  const { Icon } = item

  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors duration-100",
        isActive
          ? "bg-blue-500/15 text-blue-400"
          : "text-neutral-500 hover:bg-neutral-800/70 hover:text-neutral-200",
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-blue-500" />
      )}
      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-400" : "")} />
      <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-100 delay-75 group-hover:opacity-100">
        {item.label}
      </span>
    </Link>
  )
}
>>>>>>> 0767c26ba23cca4037905bf5444f09b20b77d1d5

export function DynamicSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const displayName = getStudentDisplayName(user)

  const isExperimentPage = pathname.startsWith("/experiments/") && pathname !== "/experiments"
  const experimentId = isExperimentPage ? pathname.split("/").pop() : null

<<<<<<< HEAD
  // Define sidebar items based on context
  const homePageItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Experiments",
      href: "/experiments",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Study Room",
      href: "/study-room",
      icon: <BookMarked className="h-5 w-5 shrink-0 text-purple-300" />,
    },
    {
      label: "Quizzes",
      href: "/quizzes",
      icon: <FileQuestion className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Team",
      href: "/team",
      icon: <Users className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "About",
      href: "/about",
      icon: <Info className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5 shrink-0 text-blue-300" />,
    },
  ]

  const experimentPageItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Aim",
      href: `/experiments/${experimentId}#aim`,
      icon: <Target className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Theory",
      href: `/experiments/${experimentId}#theory`,
      icon: <BookText className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Procedure",
      href: `/experiments/${experimentId}#procedure`,
      icon: <ClipboardList className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Simulation",
      href: `/experiments/${experimentId}#simulation`,
      icon: <Play className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "References",
      href: `/experiments/${experimentId}#references`,
      icon: <BookMarked className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "Team",
      href: "/team",
      icon: <Users className="h-5 w-5 shrink-0 text-blue-300" />,
    },
    {
      label: "About",
      href: "/about",
      icon: <Info className="h-5 w-5 shrink-0 text-blue-300" />,
    },
  ]

  const links = isExperimentPage ? experimentPageItems : homePageItems

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

      <div className="fixed left-0 top-0 z-40 h-screen">
        <SidebarProvider open={open} setOpen={setOpen} pathname={pathname}>
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarContent links={links} user={user} />
          </Sidebar>
        </SidebarProvider>
      </div>
    </>
  )
}

function SidebarContent({ links, user }: { links: any[]; user: any }) {
  const { open, setOpen, hovered } = useSidebar()
  const isExpanded = open || hovered

  return (
    <SidebarBody className="justify-between gap-10">
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {isExpanded ? <SidebarLogo /> : <SidebarLogoIcon />}
        <div className="mt-8 flex flex-col gap-1">
          {links.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 pt-3 space-y-3">
        {user?.email ? (
          <div className="rounded-xl border border-white/8 bg-white/5 px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
                {(user.name || user.email || "S").charAt(0).toUpperCase()}
              </div>
              {isExpanded && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user.name || "SRM Student"}</p>
                  <p className="truncate text-xs text-neutral-400">
                    {user.department || user.email}
                  </p>
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
        ) : null}
        <SidebarLink
          link={{
            label: "SRM EEE Virtual Lab",
            href: "/",
            icon: (
              <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
            ),
          }}
        />
      </div>
    </SidebarBody>
  )
}

export const SidebarLogo = () => {
  const { setOpen } = useSidebar()
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative z-20 flex items-center justify-between py-2 w-full pr-2"
    >
      <div className="flex items-center gap-2.5">
        {/* Circuit icon */}
        <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm leading-tight">SRM EEE</span>
          <span className="text-blue-400 text-xs font-medium leading-tight">Virtual Lab</span>
        </div>
      </div>
      <button
        onClick={() => setOpen(false)}
        className="md:hidden p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
        aria-label="Close Sidebar"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  )
}

export const SidebarLogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center py-2">
      <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
        <Zap className="h-5 w-5 text-white" />
=======
  const navItems: NavItem[] = isExperimentPage
    ? [
        { label: "Home", href: "/", Icon: Home },
        { label: "Aim", href: `/experiments/${experimentId}#aim`, Icon: Target },
        { label: "Theory", href: `/experiments/${experimentId}#theory`, Icon: BookText },
        { label: "Procedure", href: `/experiments/${experimentId}#procedure`, Icon: ClipboardList },
        { label: "Simulation", href: `/experiments/${experimentId}#simulation`, Icon: Play },
        { label: "References", href: `/experiments/${experimentId}#references`, Icon: BookMarked },
        { label: "Team", href: "/team", Icon: Users },
        { label: "About", href: "/about", Icon: Info },
      ]
    : [
        { label: "Home", href: "/", Icon: Home },
        { label: "Experiments", href: "/experiments", Icon: BookOpen },
        { label: "Study Room", href: "/study-room", Icon: BookMarked },
        { label: "Quizzes", href: "/quizzes", Icon: FileQuestion },
        { label: "Team", href: "/team", Icon: Users },
        { label: "About", href: "/about", Icon: Info },
        { label: "Profile", href: "/profile", Icon: User },
        { label: "Settings", href: "/settings", Icon: Settings },
      ]

  return (
    <div className="group fixed left-0 top-0 z-40 hidden sm:flex h-screen w-14 flex-col overflow-hidden border-r border-neutral-800/60 bg-[#09090b] transition-[width] duration-150 ease-out hover:w-56">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center border-b border-neutral-800/60 px-3.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="ml-3 whitespace-nowrap text-sm font-bold text-white opacity-0 transition-opacity duration-100 delay-75 group-hover:opacity-100">
          EEE Virtual Lab
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto py-3 px-2">
        {navItems.map((item) => (
          <NavLink key={`${item.href}-${item.label}`} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* User section */}
      <div className="shrink-0 space-y-1 border-t border-neutral-800/60 p-2">
        {user?.email ? (
          <>
            <div className="flex items-center gap-3 px-2.5 py-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 opacity-0 transition-opacity duration-100 delay-75 group-hover:opacity-100">
                <p className="truncate text-xs font-semibold text-white">{displayName}</p>
                <p className="truncate text-[10px] text-neutral-500">
                  {user.department || user.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void signOut({ redirect: true, callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-neutral-500 transition-colors duration-100 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-100 delay-75 group-hover:opacity-100">
                Log Out
              </span>
            </button>
          </>
        ) : (
          <Link
            href="/signin"
            className={cn(
              "flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors duration-100",
              pathname === "/signin"
                ? "bg-blue-500/15 text-blue-400"
                : "text-neutral-500 hover:bg-blue-500/10 hover:text-blue-400",
            )}
          >
            <LogIn className="h-5 w-5 shrink-0" />
            <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-100 delay-75 group-hover:opacity-100">
              Sign In
            </span>
          </Link>
        )}
>>>>>>> 0767c26ba23cca4037905bf5444f09b20b77d1d5
      </div>
    </div>
  )
}

// Legacy named exports kept for backward compatibility
export const SidebarLogo = () => null
export const SidebarLogoIcon = () => null
export const Logo = SidebarLogo
export const LogoIcon = SidebarLogoIcon

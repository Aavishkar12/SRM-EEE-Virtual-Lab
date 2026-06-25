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

export function DynamicSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const displayName = getStudentDisplayName(user)

  const isExperimentPage = pathname.startsWith("/experiments/") && pathname !== "/experiments"
  const experimentId = isExperimentPage ? pathname.split("/").pop() : null

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
      </div>
    </div>
  )
}

// Legacy named exports kept for backward compatibility
export const SidebarLogo = () => null
export const SidebarLogoIcon = () => null
export const Logo = SidebarLogo
export const LogoIcon = SidebarLogoIcon

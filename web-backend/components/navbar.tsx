"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown, BookOpen, Video, FileText, Cpu, CheckSquare, MessageSquare, BookMarked, Layers, FlaskConical, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const isHomePage = pathname === "/"

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled || !isHomePage ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-center">
        <div className="absolute left-4 md:left-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className={cn("font-bold text-xl", isHomePage && !isScrolled ? "text-white" : "text-foreground")}>
              EEE Learning
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="/" isActive={pathname === "/"} isHomePage={isHomePage} isScrolled={isScrolled}>
            <span className="flex items-center gap-1.5"><Home className="h-4 w-4" /> Home</span>
          </NavLink>
          <NavLink
            href="/experiments"
            isActive={pathname.startsWith("/experiments")}
            isHomePage={isHomePage}
            isScrolled={isScrolled}
          >
            <span className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4" /> Experiments</span>
          </NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "text-sm font-medium transition-colors flex items-center gap-1",
                  pathname.startsWith("/study-room")
                    ? isHomePage && !isScrolled
                      ? "text-white"
                      : "text-foreground"
                    : isHomePage && !isScrolled
                      ? "text-white/80 hover:text-white"
                      : "text-muted-foreground hover:text-foreground"
                )}
              >
                <BookOpen className="h-4 w-4 text-blue-400" /> Study Room <ChevronDown className="h-4 w-4 ml-0.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 bg-neutral-900 border-neutral-800 text-neutral-300">
              <Link href="/study-room">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 hover:text-white font-semibold border-b border-neutral-800 pb-2 mb-1">
                  <Layers className="mr-2 h-4 w-4 text-blue-400" />
                  Study Room Dashboard
                </DropdownMenuItem>
              </Link>
              <Link href="/study-room/pyqs">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 hover:text-white">
                  <BookOpen className="mr-2 h-4 w-4" /> EEE PYQs
                </DropdownMenuItem>
              </Link>
              <Link href="/study-room/videos">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 hover:text-white">
                  <Video className="mr-2 h-4 w-4" /> Video Tutorials
                </DropdownMenuItem>
              </Link>
              <Link href="/study-room/notes">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 hover:text-white">
                  <FileText className="mr-2 h-4 w-4" /> Lecture Notes
                </DropdownMenuItem>
              </Link>
              <Link href="/study-room/formula-sheet">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 hover:text-white">
                  <BookMarked className="mr-2 h-4 w-4" /> Formula Sheet
                </DropdownMenuItem>
              </Link>
              <Link href="/study-room/components">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 hover:text-white">
                  <Cpu className="mr-2 h-4 w-4" /> Component Guide
                </DropdownMenuItem>
              </Link>
              <Link href="/quizzes">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 hover:text-white">
                  <CheckSquare className="mr-2 h-4 w-4" /> Quizzes & Tests
                </DropdownMenuItem>
              </Link>
              <Link href="/study-room/ai-chat">
                <DropdownMenuItem className="cursor-pointer hover:bg-neutral-800 hover:text-white">
                  <MessageSquare className="mr-2 h-4 w-4 text-purple-400" /> MyAI Assistant
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          <NavLink href="#" isActive={false} isHomePage={isHomePage} isScrolled={isScrolled}>
            About
          </NavLink>
          <NavLink href="#" isActive={false} isHomePage={isHomePage} isScrolled={isScrolled}>
            Contact
          </NavLink>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden absolute right-4", isHomePage && !isScrolled ? "text-white hover:bg-white/10" : "")}
          onClick={toggleMenu}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">EEE Learning</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-6 py-8">
            <Link href="/" className="flex items-center text-lg font-medium" onClick={toggleMenu}>
              <Home className="mr-3 h-5 w-5" /> Home
            </Link>
            <Link href="/experiments" className="flex items-center text-lg font-medium" onClick={toggleMenu}>
              <FlaskConical className="mr-3 h-5 w-5" /> Experiments
            </Link>
            <Link href="/study-room" className="flex items-center text-lg font-medium" onClick={toggleMenu}>
              <BookOpen className="mr-3 h-5 w-5 text-blue-400" /> Study Room
            </Link>
            <Link href="#" className="flex items-center text-lg font-medium" onClick={toggleMenu}>
              About
            </Link>
            <Link href="#" className="flex items-center text-lg font-medium" onClick={toggleMenu}>
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, children, isActive, isHomePage, isScrolled }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        isActive
          ? isHomePage && !isScrolled
            ? "text-white"
            : "text-foreground"
          : isHomePage && !isScrolled
            ? "text-white/80 hover:text-white"
            : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  )
}


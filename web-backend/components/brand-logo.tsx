"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const LOGO_SRC = "/images/srm-virtual-lab-logo-transparent.png"

type BrandLogoSize = "sm" | "md" | "lg"

type BrandLogoProps = {
  className?: string
  /** @deprecated Use `size="sm"` instead */
  compact?: boolean
  size?: BrandLogoSize
  linked?: boolean
}

const sizeStyles: Record<BrandLogoSize, string> = {
  sm: "h-10 w-auto sm:h-11",
  md: "h-14 w-auto sm:h-16 md:h-[4.5rem]",
  lg: "h-16 w-auto sm:h-20 md:h-24",
}

export function BrandLogo({
  className,
  compact = false,
  size,
  linked = true,
}: BrandLogoProps) {
  const resolvedSize: BrandLogoSize = size ?? (compact ? "sm" : "md")

  const image = (
    <Image
      src={LOGO_SRC}
      alt="SRM Virtual Lab"
      width={resolvedSize === "lg" ? 260 : resolvedSize === "md" ? 220 : 140}
      height={resolvedSize === "lg" ? 160 : resolvedSize === "md" ? 136 : 86}
      priority={resolvedSize === "md"}
      className={cn(
        "object-contain object-left select-none",
        sizeStyles[resolvedSize],
        "max-w-[min(100%,240px)] sm:max-w-[260px] md:max-w-[280px]",
        "drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]",
        linked && "transition-opacity duration-200 group-hover:opacity-90",
        className
      )}
    />
  )

  if (!linked) {
    return <div className="inline-flex items-center justify-center">{image}</div>
  }

  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-md"
      aria-label="SRM Virtual Lab home"
    >
      {image}
    </Link>
  )
}

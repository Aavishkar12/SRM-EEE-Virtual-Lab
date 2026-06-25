import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  process.env.NEXTAUTH_URL,
  process.env.AUTH_URL,
].filter(Boolean) as string[]

function applyCorsHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get("origin")

  if (
    origin &&
    (allowedOrigins.some((allowed) => origin === allowed.replace(/\/$/, "")) ||
      process.env.NODE_ENV === "development")
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    )
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    )
    response.headers.set("Vary", "Origin")
  }

  return response
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 })
    return applyCorsHeaders(request, response)
  }

  const response = NextResponse.next()
  return applyCorsHeaders(request, response)
}

export const config = {
  matcher: "/api/:path*",
}

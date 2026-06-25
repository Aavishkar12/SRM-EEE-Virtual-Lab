import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: "admin" | "student"
      registrationNumber?: string
      department?: string
      branch?: string
      year?: string
      semester?: string
      section?: string
      batch?: string
      mobile?: string
      program?: string
    }
  }

  interface User {
    role?: "admin" | "student"
    registrationNumber?: string
    department?: string
    branch?: string
    year?: string
    semester?: string
    section?: string
    batch?: string
    mobile?: string
    program?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "student"
    registrationNumber?: string
    department?: string
    branch?: string
    year?: string
    semester?: string
    section?: string
    batch?: string
    mobile?: string
    program?: string
  }
}

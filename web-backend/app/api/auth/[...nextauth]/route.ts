import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { getDisplayNameFromEmail, isSrmEmail, normalizeEmail } from "@/lib/auth"
import { getUserRole } from "@/lib/auth-server"
import { authenticateWithAcademia } from "@/lib/academia-auth"

export const runtime = "nodejs"

export const { handlers: { GET, POST }, auth } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = normalizeEmail(String(credentials.email))
        const password = String(credentials.password)

        if (!isSrmEmail(email) || password.length < 8) {
          return null
        }

        const authenticatedUser = await authenticateWithAcademia(email, password)

        if (!authenticatedUser) {
          return null
        }

        return {
          id: authenticatedUser.email,
          name: authenticatedUser.name || getDisplayNameFromEmail(email),
          email: authenticatedUser.email,
          role: await getUserRole(authenticatedUser.email),
          registrationNumber: authenticatedUser.registrationNumber,
          department: authenticatedUser.department,
          branch: authenticatedUser.branch,
          year: authenticatedUser.year,
          semester: authenticatedUser.semester,
          section: authenticatedUser.section,
          batch: authenticatedUser.batch,
          mobile: authenticatedUser.mobile,
          program: authenticatedUser.program,
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      return isSrmEmail(user.email)
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.registrationNumber = user.registrationNumber
        token.department = user.department
        token.branch = user.branch
        token.year = user.year
        token.semester = user.semester
        token.section = user.section
        token.batch = user.batch
        token.mobile = user.mobile
        token.program = user.program
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.registrationNumber = token.registrationNumber
        session.user.department = token.department
        session.user.branch = token.branch
        session.user.year = token.year
        session.user.semester = token.semester
        session.user.section = token.section
        session.user.batch = token.batch
        session.user.mobile = token.mobile
        session.user.program = token.program
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
})


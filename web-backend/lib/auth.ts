export const SRM_EMAIL_DOMAIN = "srmist.edu.in"

export const fallbackAdminEmails = ["admin@srmist.edu.in"]

export function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? ""
}

export function isSrmEmail(email?: string | null) {
  const normalizedEmail = normalizeEmail(email)
  return normalizedEmail.endsWith(`@${SRM_EMAIL_DOMAIN}`)
}

export function getDisplayNameFromEmail(email?: string | null) {
  const normalizedEmail = normalizeEmail(email)
  const localPart = normalizedEmail.split("@")[0]

  if (!localPart) {
    return "SRM User"
  }

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ")
}

type StudentUser = {
  name?: string | null
  email?: string | null
  registrationNumber?: string | null
}

export function getStudentDisplayName(user?: StudentUser | null): string {
  if (!user?.email) return "SRM Student"

  const name = user.name?.trim()
  const localPart = normalizeEmail(user.email).split("@")[0]
  const regNo = user.registrationNumber?.trim()

  if (name) {
    const isIdLike =
      name.toLowerCase() === localPart ||
      name === regNo ||
      /^[a-z]{1,4}\d{3,10}$/i.test(name)

    if (!isIdLike && (name.includes(" ") || name.length > 12)) {
      return name
    }
  }

  return getDisplayNameFromEmail(user.email)
}


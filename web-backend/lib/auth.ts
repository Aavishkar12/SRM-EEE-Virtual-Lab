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

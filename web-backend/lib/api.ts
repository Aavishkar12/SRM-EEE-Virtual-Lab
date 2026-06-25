/**
 * Resolves API paths for same-origin (Vercel/Render monolith) or split deployment.
 * Set NEXT_PUBLIC_API_URL to your Render backend origin (with or without /api suffix).
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") || ""
  if (!raw) return ""
  return raw.endsWith("/api") ? raw.slice(0, -4) : raw
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl()
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return base ? `${base}${normalizedPath}` : normalizedPath
}

export function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const usesExternalApi = Boolean(getApiBaseUrl())
  return fetch(input, {
    ...init,
    credentials: usesExternalApi ? "include" : init?.credentials,
  })
}

export function getAuthBasePath(): string | undefined {
  const base = getApiBaseUrl()
  return base ? `${base}/api/auth` : undefined
}

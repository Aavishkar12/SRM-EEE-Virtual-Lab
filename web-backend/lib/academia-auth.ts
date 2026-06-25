import axios from "axios"
import * as cheerio from "cheerio"
import { CookieJar } from "tough-cookie"
import { wrapper } from "axios-cookiejar-support"
import { getDisplayNameFromEmail, normalizeEmail } from "@/lib/auth"

const SRM_DOMAIN = "https://academia.srmist.edu.in"
const LOGIN_URL = "https://academia.srmist.edu.in/accounts/signin.ac"

const ADMIN_EMAIL = normalizeEmail(process.env.ADMIN_EMAILS?.split(",")[0] || "admin@srmist.edu.in")
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123"

type AcademiaAuthResult = {
  email: string
  name: string
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

// Entity decoding helper
function decodeHtmlEntities(str: string): string {
  const entityMap: Record<string, string> = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&#x27;": "'",
    "&#x2F;": "/",
    "&#x5C;": "\\",
    "&#96;": "`",
    "&nbsp;": " ",
  }
  return str.replace(/&(?:[a-zA-Z]+|#[0-9]+|#x[0-9a-fA-F]+);/g, (match) => {
    if (entityMap[match]) return entityMap[match]
    if (match.startsWith("&#x")) {
      return String.fromCharCode(parseInt(match.slice(3, -1), 16))
    }
    if (match.startsWith("&#")) {
      return String.fromCharCode(parseInt(match.slice(2, -1), 10))
    }
    return match
  })
}

// Smart HTML Decoder extracted from Python scraper
function smartExtractHtml(rawHtml: string): string | null {
  if (!rawHtml) return null

  if (rawHtml.toLowerCase().includes("concurrent") && rawHtml.toLowerCase().includes("terminate")) {
    return "CONCURRENT_ERROR"
  }

  // 1. Try pageSanitizer.sanitize(...) match
  const match = rawHtml.match(/pageSanitizer\.sanitize\('([\s\S]*?)'\);/)
  if (match && match[1]) {
    try {
      const unescaped = unescapeHtmlString(match[1])
      return unescaped.replace(/\\-/g, "-").replace(/\\\//g, "/")
    } catch (err) {
      // ignore
    }
  }

  // 2. Try zc-pb-embed-placeholder-content hidden div zmlvalue attribute
  try {
    const $ = cheerio.load(rawHtml)
    const hiddenDiv = $(".zc-pb-embed-placeholder-content")
    if (hiddenDiv.length > 0) {
      const zmlvalue = hiddenDiv.attr("zmlvalue")
      if (zmlvalue) {
        const unescaped = decodeHtmlEntities(zmlvalue)
        return unescaped.replace(/\\-/g, "-").replace(/\\\//g, "/")
      }
    }
  } catch (err) {
    // ignore
  }

  return rawHtml
}

function unescapeHtmlString(str: string): string {
  if (!str) return ""
  let unescaped = str.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  unescaped = unescaped
    .replace(/\\n/g, "\n")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\&/g, "&")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\//g, "/")
  return unescaped
}

async function forceLogoutSessions(apiClient: any, htmlContent: string): Promise<boolean> {
  console.log("  -> [SESSION] Parsing Concurrent Sessions Page...")
  const $ = cheerio.load(htmlContent)
  const forms = getFormElements($, $("form"))
  let terminateForm: any = null

  forms.each((i, form) => {
    const text = $(form).text().toLowerCase()
    const hasSubmit = $(form).find('input[value="Terminate All Sessions"]').length > 0
    if (text.includes("terminate") || hasSubmit) {
      terminateForm = $(form)
      return false
    }
  })

  if (!terminateForm && forms.length > 0) {
    terminateForm = $(forms[0])
  }

  if (terminateForm) {
    let actionUrl = terminateForm.attr("action") || ""
    if (!actionUrl.startsWith("http")) {
      actionUrl = new URL(actionUrl, SRM_DOMAIN).toString()
    }

    const data: Record<string, string> = {}
    terminateForm.find("input").each((i, input) => {
      const name = $(input).attr("name")
      if (name) {
        data[name] = $(input).attr("value") || ""
      }
    })

    const submitBtn = terminateForm.find("button").length > 0 
      ? terminateForm.find("button") 
      : terminateForm.find('input[type="submit"]')
      
    if (submitBtn.length > 0 && submitBtn.attr("name")) {
      data[submitBtn.attr("name")!] = submitBtn.attr("value") || ""
    }

    try {
      console.log("  -> [SESSION] Terminating ghost sessions...")
      const payload = new URLSearchParams(data).toString()
      const r = await apiClient.post(actionUrl, payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      })
      if (r.status === 200) {
        console.log("  -> [SESSION] Ghost sessions terminated successfully.")
        return true
      }
    } catch (err) {
      console.error("Failed to terminate ghost sessions", err)
    }
  }
  return false
}

function getFormElements($: cheerio.CheerioAPI, cheerioObject: cheerio.Cheerio<cheerio.Element>) {
  return cheerioObject
}

function buildFallbackProfile(email: string): AcademiaAuthResult {
  const normalizedEmail = normalizeEmail(email)
  const localPart = normalizedEmail.split("@")[0] || "student"
  const registrationNumber = localPart.replace(/[^a-z0-9]/gi, "").toUpperCase()

  return {
    email: normalizedEmail,
    name: getDisplayNameFromEmail(normalizedEmail),
    registrationNumber,
    department: "Electrical and Electronics Engineering",
    branch: "Electrical and Electronics Engineering",
    year: "N/A",
    semester: "N/A",
    section: "N/A",
    batch: "N/A",
    mobile: "N/A",
    program: "B.Tech",
  }
}

function parseProfileFromHtml(rawHtml: string, normalizedEmail: string): AcademiaAuthResult | null {
  const decodedHtml = smartExtractHtml(rawHtml)
  if (!decodedHtml || decodedHtml === "CONCURRENT_ERROR") {
    return null
  }

  const $ = cheerio.load(decodedHtml)

  let studentName = getDisplayNameFromEmail(normalizedEmail)
  let registrationNumber = ""
  let department = ""
  let branch = ""
  let year = ""
  let semester = ""
  let section = ""
  let batch = ""
  let mobile = ""
  let program = ""

  const cleanText = (val: string) => val.replace(/\s+/g, " ").trim()
  const getElementByLabel = (labelText: string) => {
    let value = ""
    $("td").each((_, td) => {
      const tdText = cleanText($(td).text()).toLowerCase()
      if (tdText.includes(labelText.toLowerCase())) {
        const nextTd = $(td).next("td")
        if (nextTd.length > 0) {
          const strong = nextTd.find("strong")
          value = cleanText(strong.length > 0 ? strong.text() : nextTd.text())

          if (labelText.toLowerCase() === "department") {
            const font = nextTd.find("font")
            if (font.length > 0) {
              const sect = cleanText(font.text())
              section = sect
              value = cleanText(nextTd.text()).replace(sect, "").replace(/-$/, "").trim()
            } else {
              const dashIndex = value.lastIndexOf("-")
              if (dashIndex !== -1) {
                section = value.substring(dashIndex + 1).trim()
                value = value.substring(0, dashIndex).trim()
              }
            }
          }
        }
      }
    })
    return value
  }

  studentName = getElementByLabel("Name") || studentName
  registrationNumber = getElementByLabel("Registration Number") || getElementByLabel("Reg. No.") || ""
  branch = getElementByLabel("Branch") || ""
  year = getElementByLabel("Year") || getElementByLabel("Academic Year") || ""
  semester = getElementByLabel("Semester") || getElementByLabel("Current Semester") || ""
  department = getElementByLabel("Department") || ""
  section = getElementByLabel("Section") || section
  batch = getElementByLabel("Batch") || getElementByLabel("Academic Batch") || getElementByLabel("Batch Year") || ""
  mobile = getElementByLabel("Mobile") || getElementByLabel("Mobile No.") || ""
  program = getElementByLabel("Program") || getElementByLabel("Degree") || ""

  // Always parse the student details table — batch/year may only appear here
  const studentDetails: Record<string, string> = {}
  const infoTable = $('div[style*="line-height:150%"] > table[border="0"][align="left"]')
  if (infoTable.length > 0) {
    infoTable.find("tr").each((_, row) => {
      const cells = $(row).find("td")
      if (cells.length === 4) {
        const key1 = $(cells[0]).text().replace(":", "").trim()
        const val1 = $(cells[1]).text().trim()
        const key2 = $(cells[2]).text().replace(":", "").trim()
        const val2 = $(cells[3]).text().trim()
        if (key1) studentDetails[key1] = val1
        if (key2) studentDetails[key2] = val2
      } else if (cells.length === 2) {
        const key1 = $(cells[0]).text().replace(":", "").trim()
        const val1 = $(cells[1]).text().trim()
        if (key1) studentDetails[key1] = val1
      }
    })
  }

  // Also scan all table rows for key-value pairs as fallback
  $("table tr").each((_, row) => {
    const cells = $(row).find("td")
    if (cells.length === 2) {
      const key = cleanText($(cells[0]).text()).replace(/:$/, "").trim()
      const val = cleanText($(cells[1]).text())
      if (key && val && key.length < 40) studentDetails[key] = val
    }
  })

  studentName = studentDetails["Name"] || studentDetails["Student Name"] || studentName
  registrationNumber =
    registrationNumber ||
    studentDetails["Registration Number"] ||
    studentDetails["Reg. No."] ||
    studentDetails["Register No."] ||
    ""
  branch = branch || studentDetails["Branch"] || studentDetails["Specialization"] || ""
  year = year || studentDetails["Year"] || studentDetails["Academic Year"] || studentDetails["Current Year"] || ""
  semester = semester || studentDetails["Semester"] || studentDetails["Current Semester"] || ""
  department = department || studentDetails["Department"] || ""
  section = section || studentDetails["Section"] || ""
  batch = batch || studentDetails["Batch"] || studentDetails["Academic Batch"] || studentDetails["Batch Year"] || ""
  mobile = mobile || studentDetails["Mobile"] || studentDetails["Mobile No."] || studentDetails["Phone"] || ""
  program = program || studentDetails["Program"] || studentDetails["Degree"] || studentDetails["Course"] || ""

  if (department && (!section || section === "N/A")) {
    const dashIndex = department.lastIndexOf("-")
    if (dashIndex !== -1) {
      section = department.substring(dashIndex + 1).trim()
      department = department.substring(0, dashIndex).trim()
    }
  }

  // Use department as branch fallback when Academia only exposes Department
  if (!branch && department) {
    branch = department
  }

  if (!studentName && !registrationNumber && !department && !branch) {
    return null
  }

  return {
    email: normalizedEmail,
    name: studentName,
    registrationNumber,
    department,
    branch,
    year,
    semester,
    section,
    batch,
    mobile,
    program,
  }
}

async function fetchStudentProfile(apiClient: any, normalizedEmail: string): Promise<AcademiaAuthResult> {
  const profileUrls = [
    `${SRM_DOMAIN}/srm_university/academia-academic-services/page/My_Profile`,
    `${SRM_DOMAIN}/srm_university/academia-academic-services/page/Student_Profile`,
    `${SRM_DOMAIN}/srm_university/academia-academic-services/page/My_Time_Table_2024_25`,
    `${SRM_DOMAIN}/srm_university/academia-academic-services/page/My_Time_Table_2023_24`,
    `${SRM_DOMAIN}/srm_university/academia-academic-services/page/Attendance_2024_25`,
    `${SRM_DOMAIN}/srm_university/academia-academic-services/page/Attendance`,
    `${SRM_DOMAIN}/portal/academia-academic-services`,
    `${SRM_DOMAIN}/`,
  ]

  // Use browser-style navigation headers (not XHR) to avoid 403 on profile pages
  const navigationHeaders = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Cache-Control": "max-age=0",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Referer: `${SRM_DOMAIN}/`,
  }

  for (const profileUrl of profileUrls) {
    try {
      const response = await apiClient.get(profileUrl, { headers: navigationHeaders })
      const rawHtml = typeof response.data === "string" ? response.data : JSON.stringify(response.data)
      const profile = parseProfileFromHtml(rawHtml, normalizedEmail)
      if (profile) {
        console.log(`  -> [SESSION] Profile loaded from ${profileUrl}`)
        return profile
      }
    } catch (error: any) {
      const status = error?.response?.status
      console.warn(`  -> [SESSION] Profile fetch failed for ${profileUrl}: HTTP ${status ?? error?.message ?? error}`)
    }
  }

  console.warn("  -> [SESSION] Profile scrape unavailable. Using authenticated fallback profile.")
  return buildFallbackProfile(normalizedEmail)
}

export async function authenticateWithAcademia(email: string, password: string): Promise<AcademiaAuthResult | null> {
  const normalizedEmail = normalizeEmail(email)
  const trimmedPassword = password.trim()

  if (!normalizedEmail || !trimmedPassword) {
    return null
  }

  // Keep a local admin override so this remains usable for development.
  if (normalizedEmail === ADMIN_EMAIL && trimmedPassword === ADMIN_PASSWORD) {
    return {
      email: normalizedEmail,
      name: "Administrator",
      department: "Administration",
      branch: "Administration",
      year: "N/A",
      registrationNumber: "ADMIN",
      semester: "N/A",
      section: "Admin",
      batch: "N/A",
      mobile: "N/A",
      program: "N/A",
    }
  }

  const cookieJar = new CookieJar()
  const apiClient = wrapper(axios.create({
    jar: cookieJar,
    timeout: 30000,
    withCredentials: true,
  }))

  try {
    const payload = new URLSearchParams({
      username: normalizedEmail,
      password: trimmedPassword,
      client_portal: "true",
      portal: "10002227248",
      servicename: "ZohoCreator",
      serviceurl: "https://academia.srmist.edu.in/",
      is_ajax: "true",
      grant_type: "password",
      service_language: "en",
    }).toString()

    console.log(`  -> [SESSION] Executing hard login for ${normalizedEmail}...`)
    let response = await apiClient.post(LOGIN_URL, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": SRM_DOMAIN,
        "Referer": SRM_DOMAIN + "/",
      }
    })

    const responseText = typeof response.data === "string" ? response.data : JSON.stringify(response.data)

    // Handle concurrent sessions
    if (responseText.toLowerCase().includes("concurrent")) {
      console.log("  -> [SESSION] Concurrent session limit reached!")
      const success = await forceLogoutSessions(apiClient, responseText)
      if (success) {
        console.log("  -> [SESSION] Retrying hard login...")
        response = await apiClient.post(LOGIN_URL, payload, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Origin": SRM_DOMAIN,
            "Referer": SRM_DOMAIN + "/",
          }
        })
      }
    }

    const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data

    if (data?.status === "fail") {
      console.error("Login failed:", data?.message || "Invalid credentials")
      return null
    }

    if (data?.data?.access_token && data?.data?.oauthorize_uri) {
      const token = data.data.access_token
      const redirectUrl = data.data.oauthorize_uri
      const finalAuthUrl = `${redirectUrl}&access_token=${token}`

      console.log("  -> [SESSION] Access Token received. Exchanging for JSESSIONID...")
      await apiClient.get(finalAuthUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
      })

      // Verify cookies
      const cookies = await cookieJar.getCookies(SRM_DOMAIN)
      const hasJsession = cookies.some(c => c.key === "JSESSIONID")
      if (!hasJsession) {
        console.error("  -> [SESSION] ERROR: JSESSIONID not found.")
        return null
      }
      console.log("  -> [SESSION] SUCCESS: New cookies established.")
      return fetchStudentProfile(apiClient, normalizedEmail)
    }

    console.error("  -> [SESSION] ERROR: Invalid credentials.")
    return null
  } catch (error) {
    console.error("[Academia Auth API Error]", error)
    return null
  }
}

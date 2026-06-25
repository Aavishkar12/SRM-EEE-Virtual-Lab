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
  const forms =封装Forms($, $("form"))
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

// Helper to handle Cheerio elements mapping safely
function 封装Forms($: any, cheerioObject: any) {
  return cheerioObject
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
    } else {
      console.error("  -> [SESSION] ERROR: Invalid credentials.")
      return null
    }

    // 4. Load details page to scrape profile
    const srmTimetableUrl = `${SRM_DOMAIN}/srm_university/academia-academic-services/page/My_Time_Table_2023_24`
    const srmTimetableResponse = await apiClient.get(srmTimetableUrl, {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-GB,en;q=0.7",
        Referer: SRM_DOMAIN + "/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    const decodedHtml = smartExtractHtml(srmTimetableResponse.data)
    if (!decodedHtml || decodedHtml === "CONCURRENT_ERROR") {
      console.error("Failed to decode profile HTML or concurrent session error detected.")
      return null
    }

    const $ = cheerio.load(decodedHtml)

    let studentName = getDisplayNameFromEmail(normalizedEmail)
    let registrationNumber = ""
    let department = ""
    let semester = ""
    let section = ""
    let batch = ""
    let mobile = ""
    let program = ""

    // Profile Parser using TD siblings labels (equivalent to ProfileService in Python)
    const cleanText = (val: string) => val.replace(/\s+/g, " ").trim()
    const getElementByLabel = (labelText: string) => {
      let value = ""
      $('td').each((_, td) => {
        const tdText = cleanText($(td).text()).replace(/:/g, "").trim().toLowerCase()
        const targetLabel = labelText.toLowerCase()
        
        let isMatch = false
        if (targetLabel === "name") {
          isMatch = (tdText === "name" || tdText === "student name")
        } else if (targetLabel === "registration number") {
          isMatch = (tdText === "registration number" || tdText === "reg. no." || tdText === "reg.no.")
        } else {
          isMatch = (tdText === targetLabel)
        }
        
        if (isMatch) {
          const nextTd = $(td).next('td')
          if (nextTd.length > 0) {
            const strong = nextTd.find('strong')
            value = cleanText(strong.length > 0 ? strong.text() : nextTd.text())
            
            // For department, we parse font tags or split by dash to get the section
            if (targetLabel === "department") {
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
    semester = getElementByLabel("Semester") || ""
    department = getElementByLabel("Department") || ""
    batch = getElementByLabel("Batch") || ""
    mobile = getElementByLabel("Mobile") || ""
    program = getElementByLabel("Program") || ""
    
    // Fallback table-based parser if td scanner returned empty values
    if (!registrationNumber || !department) {
      const studentDetails: Record<string, string> = {}
      const infoTable = $('div[style*="line-height:150%"] > table[border="0"][align="left"]')
      if (infoTable.length > 0) {
        infoTable.find("tr").each((i, row) => {
          const cells = $(row).find("td")
          if (cells.length === 4) {
            let key1 = $(cells[0]).text().replace(":", "").trim()
            let val1 = $(cells[1]).text().trim()
            let key2 = $(cells[2]).text().replace(":", "").trim()
            let val2 = $(cells[3]).text().trim()
            if (key1) studentDetails[key1] = val1
            if (key2) studentDetails[key2] = val2
          } else if (cells.length === 2) {
            let key1 = $(cells[0]).text().replace(":", "").trim()
            let val1 = $(cells[1]).text().trim()
            if (key1) studentDetails[key1] = val1
          }
        })
      }
      studentName = studentDetails["Name"] || studentDetails["Student Name"] || studentName
      registrationNumber = registrationNumber || studentDetails["Registration Number"] || studentDetails["Reg. No."] || ""
      semester = semester || studentDetails["Semester"] || studentDetails["Current Semester"] || ""
      department = department || studentDetails["Department"] || ""
      section = section || studentDetails["Section"] || ""
      batch = batch || studentDetails["Batch"] || ""
      mobile = mobile || studentDetails["Mobile"] || ""
      program = program || studentDetails["Program"] || ""
    }

    // If section is still empty and department has a section at the end
    if (department && (!section || section === "N/A")) {
      const dashIndex = department.lastIndexOf("-")
      if (dashIndex !== -1) {
        section = department.substring(dashIndex + 1).trim()
        department = department.substring(0, dashIndex).trim()
      }
    }

    return {
      email: normalizedEmail,
      name: studentName,
      registrationNumber,
      department,
      semester,
      section,
      batch,
      mobile,
      program,
    }
  } catch (error) {
    console.error("[Academia Auth API Error]", error)
    return null
  }
}

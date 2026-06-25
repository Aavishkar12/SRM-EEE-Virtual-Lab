import { NextResponse } from "next/server"
import https from "https"

const SYSTEM_PROMPT = `You are the "SRM EEE Lab Assistant", an AI tutor for the Electrical and Electronics Engineering (EEE) Virtual Lab.
While your primary focus is EEE experiments, circuits, electronics, and engineering, you have NO limits on what subjects you can answer. You are helpful, intelligent, and can answer any question or topic the user asks (including general knowledge, pop culture, sports, history, coding, science, mathematics, biology, chemistry, and off-topic queries).
Provide clear, accurate, and detailed step-by-step explanations. Format formulas using Markdown/LaTeX-style formatting where helpful.`;

// Native HTTPS request helper forcing IPv4 to prevent connection reset (ECONNRESET)
function postHttps(url: string, headers: Record<string, string>, body: any): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "POST",
      headers: {
        ...headers,
        "Content-Length": Buffer.byteLength(JSON.stringify(body))
      },
      family: 4, // Force IPv4
      timeout: 110000 // 110 seconds timeout (just under ngrok's 120s gateway limit)
    }

    const req = https.request(options, (res) => {
      let rawData = ""
      res.on("data", (chunk) => {
        rawData += chunk
      })
      res.on("end", () => {
        resolve({ status: res.statusCode || 500, data: rawData })
      })
    })

    req.on("error", (err) => {
      reject(err)
    })

    req.on("timeout", () => {
      req.destroy()
      reject(new Error("Request timed out"))
    })

    req.write(JSON.stringify(body))
    req.end()
  })
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NVIDIA_API_KEY
    if (!apiKey) {
      console.error("NVIDIA_API_KEY is not configured in environment variables.")
      return NextResponse.json(
        { error: "AI Assistant is currently offline (API key not configured)." },
        { status: 500 }
      )
    }

    const { messages } = await request.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload: messages array is required." },
        { status: 400 }
      )
    }

    // Slice history to only the last message (stateless conversation for maximum speed and zero timeout)
    const chatHistory = messages.slice(-1)

    // Prepare payload for Nvidia Integrate API
    const payload = {
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatHistory
      ],
      max_tokens: 1024,
      temperature: 0.3,
      top_p: 1.00,
      stream: false
    }

    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Connection": "close"
    }

    const result = await postHttps("https://integrate.api.nvidia.com/v1/chat/completions", headers, payload)

    if (result.status !== 200) {
      console.error(`Nvidia API responded with status ${result.status}:`, result.data)
      return NextResponse.json(
        { error: "Failed to communicate with AI model. Please try again later." },
        { status: result.status }
      )
    }

    const data = JSON.parse(result.data)
    const assistantMessage = data.choices?.[0]?.message?.content || "No response received."

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error("Error in AI Chat API route:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}

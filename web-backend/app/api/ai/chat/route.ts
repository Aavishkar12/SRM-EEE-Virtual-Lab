import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

interface Message {
  role: "user" | "assistant"
  content: string
}

// EEE domain knowledge for fallback responses
const EEE_KNOWLEDGE: Record<string, string> = {
  kvl: `**Kirchhoff's Voltage Law (KVL)** states that the algebraic sum of all voltages around any closed loop in a circuit equals zero.

**Formula:** ΣV = 0

**Key points:**
- Voltage rises (sources) are positive
- Voltage drops (resistors/loads) are negative
- Works for any closed loop — complex or simple

**Example:** In a series circuit with a 12V battery and two resistors of 4Ω and 8Ω:
- V_battery = V_R1 + V_R2
- 12V = 4V + 8V ✓

This law is derived from conservation of energy.`,

  kcl: `**Kirchhoff's Current Law (KCL)** states that the algebraic sum of currents entering any node in a circuit equals zero.

**Formula:** ΣI_in = ΣI_out

**Key points:**
- Currents entering a node are positive
- Currents leaving a node are negative
- Based on conservation of charge

**Example:** At a node where 3A enters and splits into 1A and 2A:
- 3A = 1A + 2A ✓`,

  thevenin: `**Thévenin's Theorem** states that any linear two-terminal circuit can be replaced by an equivalent circuit consisting of:
- A single voltage source (V_th)
- In series with a single resistance (R_th)

**Steps to find Thévenin equivalent:**
1. Remove the load resistor
2. Find V_th = open-circuit voltage across terminals
3. Turn off all independent sources (short V-sources, open I-sources)
4. Find R_th = resistance seen from terminals
5. Connect V_th in series with R_th

This simplifies complex circuit analysis significantly.`,

  rectifier: `**Full Wave Bridge Rectifier** converts AC to pulsating DC using 4 diodes.

**Circuit:** 4 diodes arranged in a bridge configuration.

**Working:**
- Positive half cycle: D1 and D3 conduct
- Negative half cycle: D2 and D4 conduct
- Both half cycles produce current in same direction through load

**Key parameters:**
- Peak output voltage: Vm - 2V_diode (≈ Vm - 1.4V)
- Average output (no filter): 2Vm/π ≈ 0.636Vm
- Ripple frequency: 2× input frequency
- With capacitor filter: much smoother DC output

**Ripple factor** = 0.48 (without filter)`,

  opamp: `**Operational Amplifier (Op-Amp)** is a high-gain differential amplifier with two inputs (inverting −, non-inverting +) and one output.

**Ideal Op-Amp characteristics:**
- Infinite open-loop gain (A_OL → ∞)
- Infinite input impedance
- Zero output impedance
- Infinite bandwidth

**Common configurations:**
1. **Inverting amplifier:** Gain = −R_f/R_1
2. **Non-inverting amplifier:** Gain = 1 + R_f/R_1
3. **Voltage follower:** Gain = 1 (buffer)
4. **Summing amplifier:** Weighted sum of inputs
5. **Differentiator/Integrator:** Frequency-dependent operation`,

  transformer: `**Transformer** is a static device that transfers electrical energy between two circuits through electromagnetic induction.

**Turns ratio:** N_p/N_s = V_p/V_s = I_s/I_p

**Types:**
- Step-up: N_s > N_p (increases voltage)
- Step-down: N_s < N_p (decreases voltage)
- Isolation: N_s = N_p (electrical isolation)

**Losses:**
- Core losses: Hysteresis + Eddy current losses
- Copper losses: I²R losses in windings

**Efficiency:** η = (P_output / P_input) × 100%

Ideal transformer has 100% efficiency; real transformers are typically 95–99% efficient.`,

  wiring: `**House Wiring** involves connecting electrical components safely in a residential setup.

**Key components:**
- Energy meter (measures kWh consumed)
- MCB / Fuse (overcurrent protection)
- Main switch (isolates supply)
- Distribution board
- Switches, sockets, lights, fans

**Types of wiring:**
- **Cleat wiring** – Simple, used for temporary installations
- **Conduit wiring** – Most common; wires run inside PVC/metallic conduit
- **Casing-capping** – Economical, used in domestic buildings

**Important rules:**
- Live wire: Red/Brown
- Neutral wire: Black/Blue  
- Earth wire: Green/Yellow
- Phase wire always passes through switch`,

  diode: `**PN Junction Diode** allows current flow in one direction only (forward bias).

**V-I Characteristics:**
- Forward bias: conducts when V > 0.7V (silicon) or 0.3V (germanium)
- Reverse bias: very small leakage current (near zero)
- Breakdown region: Zener/avalanche breakdown at reverse breakdown voltage

**Applications:**
- Rectification (AC → DC)
- Clipping and clamping circuits
- Signal detection
- Zener diode for voltage regulation

**Shockley equation:** I = I_s(e^(V/nV_T) - 1)`,

  staircase: `**Staircase Wiring** controls a single lamp from two different locations using two-way switches.

**Components:**
- Two two-way switches (SPDT)
- One lamp
- Connecting wires + supply

**Working:**
- Both switches have 3 terminals: Common, L1, L2
- When both commons are on same line (L1-L1 or L2-L2): lamp ON
- When commons are on different lines (L1-L2): lamp OFF

**Advantage:** Either switch can independently toggle the lamp — useful for staircases, corridors, and bedrooms.`,
}

function getEEEResponse(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes("kvl") || lower.includes("kirchhoff") && lower.includes("voltage")) return EEE_KNOWLEDGE.kvl
  if (lower.includes("kcl") || lower.includes("kirchhoff") && lower.includes("current")) return EEE_KNOWLEDGE.kcl
  if (lower.includes("thevenin") || lower.includes("thévenin")) return EEE_KNOWLEDGE.thevenin
  if (lower.includes("rectifier") || lower.includes("diode bridge") || lower.includes("full wave")) return EEE_KNOWLEDGE.rectifier
  if (lower.includes("op-amp") || lower.includes("opamp") || lower.includes("operational amplifier")) return EEE_KNOWLEDGE.opamp
  if (lower.includes("transformer")) return EEE_KNOWLEDGE.transformer
  if (lower.includes("house wiring") || lower.includes("residential wiring")) return EEE_KNOWLEDGE.wiring
  if (lower.includes("diode") && !lower.includes("bridge")) return EEE_KNOWLEDGE.diode
  if (lower.includes("staircase")) return EEE_KNOWLEDGE.staircase

  // General EEE greetings
  if (lower.match(/^(hi|hello|hey|good|what can|help)/)) {
    return `Hello! I'm your EEE Study Assistant for the **26EEE1001T** course.

I can help you with:
- **Circuit Analysis** — KVL, KCL, Thévenin's theorem, Norton's theorem
- **Electrical Installations** — House wiring, staircase wiring, fluorescent lamps
- **Power Electronics** — Rectifiers, diodes, transistors
- **Analog Circuits** — Op-amps, amplifiers, filters
- **Machines** — Transformers, motors, generators

What topic would you like to explore?`
  }

  // Fallback
  return `I can help you with EEE topics from the **26EEE1001T** course such as:

- KVL / KCL / Thévenin's theorem
- Full wave rectifiers and diodes
- Op-amp circuits and configurations
- House wiring and staircase wiring
- Transformers and electrical machines

Try asking something like *"Explain KVL with an example"* or *"How does a full wave rectifier work?"*

> **Tip:** For even richer AI responses, add your Google Gemini API key as \`GOOGLE_GEMINI_API_KEY\` in your environment variables.`
}

async function callGemini(messages: Message[], apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const systemPrompt = `You are a helpful study assistant for SRM Institute's EEE (Electrical and Electronics Engineering) course code 26EEE1001T. 
Help students understand: KVL, KCL, Thévenin's theorem, Norton's theorem, full wave rectifiers, diodes, op-amps, transformers, house wiring, staircase wiring, fluorescent lamp wiring.
Be concise, accurate, and use markdown formatting. Include formulas and examples when relevant.`

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood! I'm ready to help with EEE topics." }] },
    ...messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
  ]

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  })

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`)

  const data = await response.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response."
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 })
    }

    const latestUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? ""

    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (geminiKey) {
      try {
        const reply = await callGemini(messages, geminiKey)
        return NextResponse.json({ reply })
      } catch (err) {
        console.error("Gemini error, falling back:", err)
      }
    }

    // Fallback: domain-knowledge responses
    const reply = getEEEResponse(latestUserMessage)
    return NextResponse.json({ reply })
  } catch (err) {
    console.error("AI chat error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { MongoClient } from "mongodb"
import * as fs from "fs"
import * as path from "path"

// Load .env.local manually
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local")
  try {
    const content = fs.readFileSync(envPath, "utf-8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const value = trimmed.slice(eqIdx + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch {}
}

loadEnv()

// ── Experiments data (from app/experiments/[id]/page.tsx + app/experiments/page.tsx) ──
const experiments = [
  {
    id: 1,
    title: "Kirchhoff's Voltage Law",
    category: "Circuit Analysis",
    difficulty: "Beginner",
    duration: "45 min",
    embedId: "hNWAhAfShmV",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To verify Kirchhoff's voltage law for the given circuit.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><thead><tr><th class="border border-neutral-700 px-4 py-2">Sl.No.</th><th class="border border-neutral-700 px-4 py-2">Apparatus</th><th class="border border-neutral-700 px-4 py-2">Range</th><th class="border border-neutral-700 px-4 py-2">Quantity</th></tr></thead><tbody><tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">RPS (regulated power supply)</td><td class="border border-neutral-700 px-4 py-2">(0-30V)</td><td class="border border-neutral-700 px-4 py-2">2</td></tr><tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">Resistance</td><td class="border border-neutral-700 px-4 py-2">330Ω, 220Ω, 1kΩ</td><td class="border border-neutral-700 px-4 py-2">4</td></tr><tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Voltmeter</td><td class="border border-neutral-700 px-4 py-2">(0-30V)MC</td><td class="border border-neutral-700 px-4 py-2">2</td></tr><tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">Bread Board &amp; Wires</td><td class="border border-neutral-700 px-4 py-2">-</td><td class="border border-neutral-700 px-4 py-2">Required</td></tr></tbody></table>`,
    theory: `<h3>Statement:</h3><p class="mb-4">KVL: In any closed path / mesh, the algebraic sum of all the voltages is zero.</p><p class="mb-4">Kirchhoff's Voltage Law (KVL) states that the sum of all voltages around any closed loop in a circuit must equal zero. This is a fundamental principle in circuit analysis.</p><p class="font-bold mb-4">∑V = 0</p><p class="mb-4">This law is based on the principle of conservation of energy and is essential for analyzing complex circuits with multiple voltage sources and components.</p>`,
    procedure: `<h3>Experimental Procedure:</h3><ol class="list-decimal pl-6 mb-4"><li>Set up a circuit with multiple voltage sources and resistors in a closed loop.</li><li>Measure the voltage across each component in the circuit.</li><li>Record all voltage measurements, noting whether they are voltage rises or drops.</li><li>Sum all voltages around the loop, considering their polarities.</li><li>Verify that the sum equals zero, within measurement error.</li><li>Compare experimental results with theoretical calculations.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Boylestad, R. L. (2016). Introductory Circuit Analysis (13th ed.). Pearson.</li><li>Floyd, T. L. (2018). Principles of Electric Circuits (9th ed.). Pearson.</li><li>Nilsson, J. W., &amp; Riedel, S. A. (2019). Electric Circuits (11th ed.). Pearson.</li></ol>`,
  },
  {
    id: 2,
    title: "Thevenin's Theorem",
    category: "Circuit Analysis",
    difficulty: "Intermediate",
    duration: "60 min",
    embedId: "lAusQJ3m4bF",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To verify Thevenin's Theorem by constructing an equivalent circuit and comparing its behavior with the original circuit.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><thead><tr><th class="border border-neutral-700 px-4 py-2">Sl.No.</th><th class="border border-neutral-700 px-4 py-2">Apparatus</th><th class="border border-neutral-700 px-4 py-2">Range</th><th class="border border-neutral-700 px-4 py-2">Quantity</th></tr></thead><tbody><tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">RPS (regulated power supply)</td><td class="border border-neutral-700 px-4 py-2">(0-30V)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">Resistance</td><td class="border border-neutral-700 px-4 py-2">330Ω, 1kΩ</td><td class="border border-neutral-700 px-4 py-2">3</td></tr><tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Voltmeter</td><td class="border border-neutral-700 px-4 py-2">(0-30V)MC</td><td class="border border-neutral-700 px-4 py-2">1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">Ammeter</td><td class="border border-neutral-700 px-4 py-2">(0-10mA)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr></tbody></table>`,
    theory: `<h3>Thevenin's Theorem Theory:</h3><p class="mb-4">Thevenin's Theorem states that any linear circuit with voltage and current sources can be replaced by an equivalent circuit consisting of a voltage source (V_TH) in series with a resistor (R_TH).</p><ul class="list-disc pl-6 mb-4"><li>V_TH = 11.25V (open-circuit voltage)</li><li>R_TH = 490Ω (equivalent resistance)</li></ul>`,
    procedure: `<h3>Experimental Procedure:</h3><ol class="list-decimal pl-6 mb-4"><li>Set up the original circuit without the load component.</li><li>Measure the open-circuit voltage across the load terminals (V_TH).</li><li>Replace all independent sources with their internal resistances.</li><li>Measure the equivalent resistance looking into the circuit from the load terminals (R_TH).</li><li>Construct the Thevenin equivalent circuit and connect load.</li><li>Compare results with original circuit measurements.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Boylestad, R. L. (2016). Introductory Circuit Analysis (13th ed.). Pearson.</li><li>Floyd, T. L. (2018). Principles of Electric Circuits (9th ed.). Pearson.</li><li>Nilsson, J. W., &amp; Riedel, S. A. (2019). Electric Circuits (11th ed.). Pearson.</li></ol>`,
  },
  {
    id: 3,
    title: "PN Junction Diode Characteristics",
    category: "Analog Electronics",
    difficulty: "Beginner",
    duration: "60 min",
    embedId: "",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To plot the V-I characteristics of a PN junction diode in forward bias and reverse bias modes.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><thead><tr><th class="border border-neutral-700 px-4 py-2">Sl.No.</th><th class="border border-neutral-700 px-4 py-2">Apparatus</th><th class="border border-neutral-700 px-4 py-2">Range</th><th class="border border-neutral-700 px-4 py-2">Quantity</th></tr></thead><tbody><tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">Regulated Power Supply (RPS)</td><td class="border border-neutral-700 px-4 py-2">(0–30V) DC</td><td class="border border-neutral-700 px-4 py-2">1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">PN Junction Diode</td><td class="border border-neutral-700 px-4 py-2">IN4007</td><td class="border border-neutral-700 px-4 py-2">1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Voltmeter (DC)</td><td class="border border-neutral-700 px-4 py-2">(0–30V)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">Milliammeter (DC)</td><td class="border border-neutral-700 px-4 py-2">(0–100 mA)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr></tbody></table>`,
    theory: `<h3>Theory — PN Junction Diode:</h3><p class="mb-4">A PN junction diode is formed by joining P-type and N-type semiconductor materials. Forward bias: current flows exponentially above threshold (~0.7V for Si). Reverse bias: only small reverse saturation current flows until breakdown voltage. Shockley equation: I = I₀(e^(V/ηVT) − 1)</p>`,
    procedure: `<h3>Procedure — Forward Bias:</h3><ol class="list-decimal pl-6 mb-4"><li>Connect diode in forward bias with 1kΩ series resistor.</li><li>Vary RPS voltage from 0V to 2V in steps of 0.1V.</li><li>Record diode voltage and current for each setting.</li><li>Plot IF vs VF (forward characteristic).</li></ol><h3>Procedure — Reverse Bias:</h3><ol class="list-decimal pl-6 mb-4"><li>Reverse the diode connections.</li><li>Increase reverse voltage from 0V to 30V in steps of 2V.</li><li>Plot IR vs VR (reverse characteristic).</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Boylestad, R. L., &amp; Nashelsky, L. (2015). Electronic Devices and Circuit Theory (11th ed.). Pearson.</li><li>Sedra, A. S., &amp; Smith, K. C. (2014). Microelectronic Circuits (7th ed.). Oxford University Press.</li></ol>`,
  },
  {
    id: 4,
    title: "Full Wave Rectifier",
    category: "Analog Electronics",
    difficulty: "Intermediate",
    duration: "60 min",
    embedId: "jbRQbeSnAzj",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To construct a single phase full-wave bridge rectifier using diodes and to draw its performance characteristics.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">Transformer</td><td class="border border-neutral-700 px-4 py-2">230/(6-0-6)V</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Diode IN4007</td><td class="border border-neutral-700 px-4 py-2">x4</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Resistor 1kΩ</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Capacitor 100μF</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">CRO 1Hz-20MHz</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr></tbody></table>`,
    theory: `<h3>Full Wave Rectifier Theory:</h3><p class="mb-4">A full wave rectifier converts AC to DC by utilizing both halves of the AC cycle. Bridge rectifier uses four diodes. Output has less ripple and higher average voltage than half-wave. With filter capacitor: smoother DC output.</p>`,
    procedure: `<h3>Procedure:</h3><h4>Without Filter:</h4><ol class="list-decimal pl-6 mb-4"><li>Connect circuit as per diagram.</li><li>Apply 230V, 50Hz input to step-down transformer.</li><li>Observe rectifier output across load on CRO.</li></ol><h4>With Filter:</h4><ol class="list-decimal pl-6 mb-4"><li>Connect 100μF capacitor across load resistor.</li><li>Observe smoothed DC output on CRO.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Boylestad, R. L., &amp; Nashelsky, L. (2015). Electronic Devices and Circuit Theory (11th ed.). Pearson.</li><li>Floyd, T. L. (2018). Electronic Devices (10th ed.). Pearson.</li></ol>`,
  },
  {
    id: 5,
    title: "Clipper Circuit",
    category: "Analog Electronics",
    difficulty: "Intermediate",
    duration: "60 min",
    embedId: "",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To study and verify the operation of series and parallel diode clipper circuits and observe how they limit signal amplitude.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">Function Generator</td><td class="border border-neutral-700 px-4 py-2">1 Hz – 1 MHz</td></tr><tr><td class="border border-neutral-700 px-4 py-2">CRO</td><td class="border border-neutral-700 px-4 py-2">20 MHz</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Diode IN4007</td><td class="border border-neutral-700 px-4 py-2">x2</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Resistor 1kΩ</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr></tbody></table>`,
    theory: `<h3>Theory — Clipper Circuits:</h3><p class="mb-4">A clipper removes portions of an input waveform above or below a reference voltage without distorting the remaining part. Types: Series Positive/Negative Clipper, Parallel Positive/Negative Clipper, Biased Clipper, Double Clipper. Practical Si diodes clip at ±0.7V due to forward voltage drop.</p>`,
    procedure: `<h3>Procedure:</h3><ol class="list-decimal pl-6 mb-4"><li>Connect diode in series with load resistor (positive series clipper).</li><li>Apply sinusoidal input (5V peak, 1kHz) from function generator.</li><li>Observe input on CRO Ch-1 and output on Ch-2.</li><li>Verify positive half-cycle is clipped.</li><li>Repeat for parallel and biased configurations.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Boylestad, R. L., &amp; Nashelsky, L. (2015). Electronic Devices and Circuit Theory (11th ed.). Pearson.</li><li>Malvino, A. P., &amp; Bates, D. J. (2016). Electronic Principles (8th ed.). McGraw-Hill.</li></ol>`,
  },
  {
    id: 6,
    title: "Op-Amp Inverting / Non-Inverting Amplifier",
    category: "Analog Electronics",
    difficulty: "Advanced",
    duration: "75 min",
    embedId: "",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To design inverting and non-inverting amplifier circuits using LM741 Op-Amp and verify the voltage gain experimentally.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">Op-Amp IC LM741</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Dual DC Power Supply ±15V</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Function Generator</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">CRO 20MHz</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Resistors 10kΩ, 22kΩ, 47kΩ</td><td class="border border-neutral-700 px-4 py-2">As required</td></tr></tbody></table>`,
    theory: `<h3>Theory — Op-Amp:</h3><p class="mb-4">LM741: high-gain DC-coupled differential amplifier. Open-loop gain ~200,000 V/V.</p><p><b>Inverting Amplifier:</b> Av = −Rf/R1. Output 180° phase shifted.</p><p><b>Non-Inverting Amplifier:</b> Av = 1 + Rf/R1. Output in phase with input.</p>`,
    procedure: `<h3>Procedure — Inverting Amplifier:</h3><ol class="list-decimal pl-6 mb-4"><li>Connect LM741, apply ±15V to pins 7 and 4.</li><li>R1 = 10kΩ to pin 2, Rf = 47kΩ between pin 2 and pin 6.</li><li>Apply 100mV peak at 1kHz. Measure gain = Vout/Vin = −4.7 theoretical.</li></ol><h3>Procedure — Non-Inverting:</h3><ol class="list-decimal pl-6 mb-4"><li>Apply input to pin 3, R1 = 10kΩ to ground, Rf = 22kΩ feedback.</li><li>Theoretical gain = 1 + 22/10 = 3.2.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Gayakwad, R. A. (2000). Op-Amps and Linear Integrated Circuits (4th ed.). Pearson.</li><li>Sedra, A. S., &amp; Smith, K. C. (2014). Microelectronic Circuits (7th ed.). Oxford University Press.</li></ol>`,
  },
  {
    id: 7,
    title: "Basic Logic Gates",
    category: "Digital Electronics",
    difficulty: "Beginner",
    duration: "60 min",
    embedId: "",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To implement basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) using ICs and verify their truth tables experimentally.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">AND Gate IC 7408</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">OR Gate IC 7432</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">NOT Gate IC 7404</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">NAND Gate IC 7400</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">NOR Gate IC 7402</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">XOR Gate IC 7486</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">DC Power Supply +5V</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr></tbody></table>`,
    theory: `<h3>Theory:</h3><p class="mb-4">Logic gates are the fundamental building blocks of digital circuits. AND: Y=A·B. OR: Y=A+B. NOT: Y=Ā. NAND: Y=(A·B)'. NOR: Y=(A+B)'. XOR: Y=A⊕B. NAND and NOR are universal gates.</p>`,
    procedure: `<h3>Procedure:</h3><ol class="list-decimal pl-6 mb-4"><li>Connect VCC (Pin 14) to +5V and GND (Pin 7) for each IC.</li><li>Apply logic inputs (0V=LOW, 5V=HIGH) to input pins.</li><li>Connect LED with 330Ω resistor to output pin to observe output.</li><li>Record output for all possible input combinations.</li><li>Verify against theoretical truth table for each gate.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Morris Mano, M. (2013). Digital Design (5th ed.). Pearson.</li><li>Floyd, T. L. (2015). Digital Fundamentals (11th ed.). Pearson.</li></ol>`,
  },
  {
    id: 8,
    title: "Half Adder & Full Adder",
    category: "Digital Electronics",
    difficulty: "Intermediate",
    duration: "75 min",
    embedId: "",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To design and verify the operation of Half Adder and Full Adder circuits using basic logic gates.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">XOR Gate IC 7486</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">AND Gate IC 7408</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">OR Gate IC 7432</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr><tr><td class="border border-neutral-700 px-4 py-2">DC Power Supply +5V</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr></tbody></table>`,
    theory: `<h3>Theory:</h3><h4>Half Adder:</h4><p class="mb-3">Adds two bits A and B. Sum S = A ⊕ B, Carry C = A · B. 1 XOR + 1 AND gate.</p><h4>Full Adder:</h4><p class="mb-3">Adds three bits A, B, Cin. Sum S = A ⊕ B ⊕ Cin, Cout = A·B + B·Cin + A·Cin. 2 XOR + 2 AND + 1 OR gate.</p>`,
    procedure: `<h3>Procedure — Half Adder:</h3><ol class="list-decimal pl-6 mb-4"><li>Connect IC 7486 (XOR) and IC 7408 (AND) on bread board.</li><li>Apply all input combinations (00, 01, 10, 11) and record Sum and Carry outputs.</li></ol><h3>Procedure — Full Adder:</h3><ol class="list-decimal pl-6 mb-4"><li>Compute A⊕B using first XOR gate.</li><li>Compute Sum = (A⊕B) ⊕ Cin using second XOR gate.</li><li>Compute Carry = (A·B) + ((A⊕B)·Cin) using AND and OR gates.</li><li>Verify all 8 input combinations.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Morris Mano, M. (2013). Digital Design (5th ed.). Pearson.</li><li>Floyd, T. L. (2015). Digital Fundamentals (11th ed.). Pearson.</li></ol>`,
  },
  {
    id: 9,
    title: "Energy Measurement",
    category: "Electrical Machines",
    difficulty: "Beginner",
    duration: "45 min",
    embedId: "",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To measure electrical energy consumption using a single-phase energy meter and calculate the units consumed by different electrical loads.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">Single-Phase Energy Meter</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz, 5A</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Wattmeter</td><td class="border border-neutral-700 px-4 py-2">230V, 5A</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Voltmeter (AC)</td><td class="border border-neutral-700 px-4 py-2">(0–300V)</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Ammeter (AC)</td><td class="border border-neutral-700 px-4 py-2">(0–5A)</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Resistive Load (100W Lamp)</td><td class="border border-neutral-700 px-4 py-2">x1</td></tr></tbody></table>`,
    theory: `<h3>Theory — Single-Phase Energy Meter:</h3><p class="mb-4">Measures total electrical energy consumed in kWh. Rotating aluminium disc speed ∝ power. Braking magnet ensures n ∝ P.</p><p>Energy (kWh) = Power (kW) × Time (h)</p><p>Meter Constant K = revolutions per kWh</p><p>Measured Power = (N × 3600) / (K × t_seconds) kW</p>`,
    procedure: `<h3>Procedure:</h3><ol class="list-decimal pl-6 mb-4"><li>Connect energy meter, wattmeter, voltmeter, ammeter, and load.</li><li>Note initial energy meter reading R1.</li><li>Switch ON load and simultaneously start stopwatch.</li><li>Count disc revolutions N for fixed time t.</li><li>Record wattmeter reading P_true.</li><li>Calculate P_meas = (N×3600)/(K×t). Compare with P_true. Compute % error.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Golding, E. W., &amp; Widdis, F. C. (1963). Electrical Measurements and Measuring Instruments. Pitman.</li><li>Gupta, J. B. (2012). Electrical and Electronic Measurements. S. K. Kataria.</li></ol>`,
  },
  {
    id: 10,
    title: "House Wiring",
    category: "Electrical Installation",
    difficulty: "Intermediate",
    duration: "90 min",
    embedId: "2rTQ63Z8SdD",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To implement residential house wiring with energy meter, MCB, switches, lamp, and fan, and to read the energy meter in kWh.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">Single-Phase Energy Meter</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz, 5A</td></tr><tr><td class="border border-neutral-700 px-4 py-2">MCB</td><td class="border border-neutral-700 px-4 py-2">230V, 6A</td></tr><tr><td class="border border-neutral-700 px-4 py-2">One-Way Switch</td><td class="border border-neutral-700 px-4 py-2">230V, 5A × 3</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Incandescent Lamp</td><td class="border border-neutral-700 px-4 py-2">60W, 230V</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Ceiling Fan with Regulator</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz</td></tr></tbody></table>`,
    theory: `<h3>Theory — Residential House Wiring:</h3><p class="mb-4">Standard Indian supply: 230V AC, 50Hz, single-phase. Phase (Red wire) is always switched. Neutral (Black) runs directly to loads. Earth (Green) connected to metallic bodies for safety. MCB provides overcurrent and short-circuit protection.</p>`,
    procedure: `<h3>Procedure:</h3><ol class="list-decimal pl-6 mb-4"><li>Note initial energy meter reading R1.</li><li>Connect: Supply → Energy Meter → MCB → Distribution Board.</li><li>Wire Switch-1 to lamp, Switch-2 to fan (with regulator), socket outlet with earth.</li><li>Switch ON MCB and loads one by one; verify operation.</li><li>Run loads for 30 min; note final reading R2. Calculate E = R2 − R1 kWh.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Mullin, R. (2017). Electrical Wiring Residential (19th ed.). Cengage Learning.</li><li>IS 732 — Code of Practice for Electrical Wiring Installations. BIS.</li></ol>`,
  },
  {
    id: 11,
    title: "Fluorescent Lamp Wiring",
    category: "Electrical Installation",
    difficulty: "Intermediate",
    duration: "60 min",
    embedId: "hnFoQc772H0",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To connect a 40W fluorescent lamp with choke and starter and verify the role of each component in the starting and operation of the lamp.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">Fluorescent Lamp (Tube Light)</td><td class="border border-neutral-700 px-4 py-2">40W, 230V, 4ft</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Choke (Ballast)</td><td class="border border-neutral-700 px-4 py-2">40W, 230V, 50Hz</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Starter</td><td class="border border-neutral-700 px-4 py-2">FS-2 type</td></tr><tr><td class="border border-neutral-700 px-4 py-2">One-Way Switch</td><td class="border border-neutral-700 px-4 py-2">230V, 5A</td></tr></tbody></table>`,
    theory: `<h3>Theory — Fluorescent Lamp:</h3><p class="mb-4">Low-pressure mercury-vapour gas-discharge lamp. Mercury emits UV (253.7nm) → phosphor coating → visible light.</p><p><b>Choke:</b> Series inductor. Starting: induces high kick voltage (~1000V). Running: current limiter.</p><p><b>Starter:</b> Bimetallic glow switch. Closes to preheat filaments, then opens to trigger choke kick voltage.</p>`,
    procedure: `<h3>Procedure:</h3><ol class="list-decimal pl-6 mb-4"><li>Connect switch to Phase line.</li><li>Connect choke in series: Phase → Switch → Choke → tube filament.</li><li>Connect starter in parallel with the tube.</li><li>Connect Neutral to other tube filament.</li><li>Switch ON; observe flickering then steady glow (starting sequence).</li><li>Remove starter while running — tube continues to glow.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>National Electrical Code (NEC) 2020. NFPA.</li><li>IS 418 — Tungsten Filament Lamps / Fluorescent Lamps. BIS.</li><li>Nagrath, I. J., &amp; Kothari, D. P. (2010). Basic Electrical Engineering. Tata McGraw-Hill.</li></ol>`,
  },
  {
    id: 12,
    title: "Staircase Wiring",
    category: "Electrical Installation",
    difficulty: "Intermediate",
    duration: "75 min",
    embedId: "94YWeHFB9oN",
    image: "/placeholder.svg?height=400&width=600",
    aim: "To control a single lamp from two different locations using two-way (SPDT) switches and understand the staircase wiring principle.",
    apparatus: `<h3>Apparatus Required:</h3><table class="w-full border-collapse my-4"><tbody><tr><td class="border border-neutral-700 px-4 py-2">Two-Way (SPDT) Switch</td><td class="border border-neutral-700 px-4 py-2">230V, 5A × 2</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Incandescent Lamp with Holder</td><td class="border border-neutral-700 px-4 py-2">60W, 230V</td></tr><tr><td class="border border-neutral-700 px-4 py-2">Connecting Wires</td><td class="border border-neutral-700 px-4 py-2">1mm² PVC</td></tr><tr><td class="border border-neutral-700 px-4 py-2">AC Supply</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz</td></tr></tbody></table>`,
    theory: `<h3>Theory — Staircase Wiring:</h3><p class="mb-4">Controls a single lamp from two locations using SPDT switches. Each switch has 3 terminals: Common (C), L1, L2. Lamp ON when both switches select the same traveller (L1-L1 or L2-L2). Equivalent to XNOR logic gate.</p>`,
    procedure: `<h3>Procedure:</h3><ol class="list-decimal pl-6 mb-4"><li>Identify C, L1, L2 terminals on each SPDT switch.</li><li>Connect Phase to Common (C) of Switch S1.</li><li>Connect traveller wires: S1-L1 → S2-L1, S1-L2 → S2-L2.</li><li>Connect Common (C) of S2 to one lamp terminal; Neutral to other terminal.</li><li>Toggle S1 and S2 in all 4 combinations; verify lamp state matches truth table.</li></ol>`,
    references: `<h3>References:</h3><ol class="list-decimal pl-6 mb-4"><li>Mullin, R. (2017). Electrical Wiring Residential (19th ed.). Cengage Learning.</li><li>IS 732 — Code of Practice for Electrical Wiring Installations. BIS.</li></ol>`,
  },
]

// ── Study materials (sample data) ──
const studyMaterials = [
  {
    id: "sm-001",
    title: "Electric Circuit Analysis — Study Notes",
    description: "Comprehensive notes on KVL, KCL, Thevenin's and Norton's theorems with solved examples.",
    category: "Circuit Analysis",
    type: "notes",
    fileUrl: "",
    experimentIds: [1, 2],
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "sm-002",
    title: "Analog Electronics — Diode and Op-Amp Reference",
    description: "Quick reference guide covering diode characteristics, rectifier circuits, clippers, and Op-Amp applications.",
    category: "Analog Electronics",
    type: "reference",
    fileUrl: "",
    experimentIds: [3, 4, 5, 6],
    createdAt: new Date("2025-01-12"),
  },
  {
    id: "sm-003",
    title: "Digital Electronics — Logic Gates and Combinational Circuits",
    description: "Truth tables, Boolean algebra, logic gate ICs (74xx series), half adder and full adder design.",
    category: "Digital Electronics",
    type: "notes",
    fileUrl: "",
    experimentIds: [7, 8],
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "sm-004",
    title: "Electrical Wiring Safety Manual",
    description: "Safety precautions, IS 732 wiring standards, and step-by-step guide for house wiring, fluorescent lamp, and staircase wiring.",
    category: "Electrical Installation",
    type: "manual",
    fileUrl: "",
    experimentIds: [10, 11, 12],
    createdAt: new Date("2025-01-18"),
  },
  {
    id: "sm-005",
    title: "Energy Meter — Theory and Calibration",
    description: "Working principle of induction-type energy meters, error calculation, and calibration procedure.",
    category: "Electrical Machines",
    type: "reference",
    fileUrl: "",
    experimentIds: [9],
    createdAt: new Date("2025-01-20"),
  },
]

async function seedCollection(
  db: any,
  collectionName: string,
  documents: any[],
  label: string
) {
  const collection = db.collection(collectionName)
  const count = await collection.countDocuments()
  if (count > 0) {
    console.log(`  ⏩ '${collectionName}' already has ${count} documents — skipping seed`)
    return
  }
  await collection.insertMany(documents)
  console.log(`  ✅ Seeded ${documents.length} ${label} into '${collectionName}'`)
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("❌ MONGODB_URI is not set. Check .env.local")
    process.exit(1)
  }

  console.log("🔌 Connecting to MongoDB Atlas...")
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: process.env.NODE_ENV !== "production",
  })

  try {
    await client.connect()
    console.log("✅ Connected!\n")

    const db = client.db()
    console.log(`📦 Database: ${db.databaseName}\n`)

    // Seed experiments
    await seedCollection(db, "experiments", experiments, "experiments")

    // Seed quizzes from lib/data/quizzes.json
    const quizzesPath = path.join(process.cwd(), "lib", "data", "quizzes.json")
    let quizzesData: any[] = []
    try {
      const raw = fs.readFileSync(quizzesPath, "utf-8")
      quizzesData = JSON.parse(raw)
      await seedCollection(db, "quizzes", quizzesData, "quizzes")
    } catch (e: any) {
      console.warn(`  ⚠️  Could not read quizzes.json: ${e.message}`)
    }

    // Seed study materials
    await seedCollection(db, "study_materials", studyMaterials, "study materials")

    // Also seed other lib/data JSON files if not already done
    const otherCollections = [
      { name: "academic_resources", file: "academic_resources.json" },
      { name: "books", file: "books.json" },
      { name: "formulas", file: "formulas.json" },
      { name: "manuals", file: "manual.json" },
      { name: "notes", file: "notes.json" },
      { name: "pyqs", file: "pyqs.json" },
      { name: "schedules", file: "schedules.json" },
      { name: "videos", file: "videos.json" },
    ]

    console.log("\n📂 Seeding other lib/data collections...")
    for (const col of otherCollections) {
      const filePath = path.join(process.cwd(), "lib", "data", col.file)
      try {
        const raw = fs.readFileSync(filePath, "utf-8")
        const docs = JSON.parse(raw)
        if (Array.isArray(docs) && docs.length > 0) {
          await seedCollection(db, col.name, docs, col.file)
        }
      } catch (e: any) {
        if (e.code !== "ENOENT") {
          console.warn(`  ⚠️  Error reading ${col.file}: ${e.message}`)
        }
      }
    }

    console.log("\n✅ Seeding complete!")

    // Print final collection counts
    console.log("\n📋 Final collection summary:")
    const collections = await db.listCollections().toArray()
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments()
      console.log(`   • ${col.name.padEnd(30)} ${count} documents`)
    }
  } catch (err: any) {
    console.error("\n❌ Seeding failed:", err.message || err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main()

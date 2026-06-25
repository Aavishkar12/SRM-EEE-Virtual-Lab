"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, RotateCcw, Info } from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Experiment 7: Basic Logic Gates Virtual Lab
// ─────────────────────────────────────────────────────────────────────────────

type GateType = "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR"

const gateInfo: Record<GateType, { ic: string; symbol: string; expression: string; desc: string; color: string }> = {
  AND:  { ic: "IC 7408", symbol: "·",  expression: "Y = A · B",       desc: "Output HIGH only when ALL inputs are HIGH.",                color: "blue"   },
  OR:   { ic: "IC 7432", symbol: "+",  expression: "Y = A + B",       desc: "Output HIGH when ANY input is HIGH.",                      color: "green"  },
  NOT:  { ic: "IC 7404", symbol: "¬",  expression: "Y = Ā",           desc: "Inverts the input. Output is opposite of input.",          color: "purple" },
  NAND: { ic: "IC 7400", symbol: "⊼",  expression: "Y = (A · B)'",    desc: "NOT-AND. Output LOW only when ALL inputs are HIGH.",       color: "orange" },
  NOR:  { ic: "IC 7402", symbol: "⊽",  expression: "Y = (A + B)'",    desc: "NOT-OR. Output HIGH only when ALL inputs are LOW.",        color: "red"    },
  XOR:  { ic: "IC 7486", symbol: "⊕",  expression: "Y = A ⊕ B",       desc: "Output HIGH when inputs are DIFFERENT.",                  color: "cyan"   },
  XNOR: { ic: "IC 74XNOR", symbol: "⊙", expression: "Y = (A ⊕ B)'",  desc: "Output HIGH when inputs are SAME.",                       color: "yellow" },
}

function computeGate(gate: GateType, a: number, b: number): number {
  switch (gate) {
    case "AND":  return a & b
    case "OR":   return a | b
    case "NOT":  return a === 0 ? 1 : 0
    case "NAND": return (a & b) === 1 ? 0 : 1
    case "NOR":  return (a | b) === 0 ? 1 : 0
    case "XOR":  return a ^ b
    case "XNOR": return (a ^ b) === 0 ? 1 : 0
  }
}

const truthTableRows = (gate: GateType): { a: number; b?: number; y: number }[] => {
  if (gate === "NOT") return [{ a: 0, y: 1 }, { a: 1, y: 0 }]
  return [
    { a: 0, b: 0, y: computeGate(gate, 0, 0) },
    { a: 0, b: 1, y: computeGate(gate, 0, 1) },
    { a: 1, b: 0, y: computeGate(gate, 1, 0) },
    { a: 1, b: 1, y: computeGate(gate, 1, 1) },
  ]
}

// SVG gate symbols
function GateSVG({ gate, inputA, inputB, output }: { gate: GateType; inputA: number; inputB: number; output: number }) {
  const sigColor = (v: number) => v === 1 ? "#22c55e" : "#ef4444"
  const isNot = gate === "NOT"

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-xs mx-auto" style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.3))" }}>
      {/* Input wires */}
      <line x1="0" y1={isNot ? 60 : 40} x2="60" y2={isNot ? 60 : 40} stroke={sigColor(inputA)} strokeWidth="2.5" />
      {!isNot && <line x1="0" y1="80" x2="60" y2="80" stroke={sigColor(inputB)} strokeWidth="2.5" />}
      
      {/* Input labels */}
      <text x="4" y={isNot ? 54 : 35} fill="#9ca3af" fontSize="10">A={inputA}</text>
      {!isNot && <text x="4" y="75" fill="#9ca3af" fontSize="10">B={inputB}</text>}

      {/* Gate body */}
      {(gate === "AND" || gate === "NAND") && (
        <path d="M60,25 L60,95 L100,95 Q135,95 135,60 Q135,25 100,25 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
      )}
      {(gate === "OR" || gate === "NOR" || gate === "XOR" || gate === "XNOR") && (
        <>
          <path d="M60,25 Q75,60 60,95 L100,95 Q140,95 145,60 Q140,25 100,25 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          {(gate === "XOR" || gate === "XNOR") && (
            <path d="M55,25 Q70,60 55,95" fill="none" stroke="#3b82f6" strokeWidth="2" />
          )}
        </>
      )}
      {gate === "NOT" && (
        <path d="M60,35 L60,85 L120,60 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
      )}

      {/* Bubble for NAND, NOR, XNOR */}
      {(gate === "NAND" || gate === "NOR" || gate === "XNOR") && (
        <circle cx={gate === "NOT" ? 125 : 140} cy="60" r="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
      )}
      {gate === "NOT" && <circle cx="125" cy="60" r="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />}

      {/* Output wire */}
      <line x1={gate === "NOT" ? 130 : (gate === "NAND" || gate === "NOR" || gate === "XNOR" ? 145 : 140)} y1="60" x2="200" y2="60" stroke={sigColor(output)} strokeWidth="2.5" />
      
      {/* Gate label */}
      <text x="95" y="64" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{gate}</text>

      {/* Output label */}
      <text x="165" y="54" fill="#9ca3af" fontSize="10">Y={output}</text>

      {/* LED indicator */}
      <circle cx="190" cy="60" r="8" fill={sigColor(output)} opacity="0.9">
        <animate attributeName="opacity" values={output === 1 ? "0.7;1;0.7" : "0.9;0.9;0.9"} dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export function LogicGatesVirtualLab() {
  const [selectedGate, setSelectedGate] = useState<GateType>("AND")
  const [inputA, setInputA] = useState(0)
  const [inputB, setInputB] = useState(0)
  const output = computeGate(selectedGate, inputA, inputB)
  const info = gateInfo[selectedGate]
  const rows = truthTableRows(selectedGate)
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/40 text-blue-300",
    green: "bg-green-500/10 border-green-500/40 text-green-300",
    purple: "bg-purple-500/10 border-purple-500/40 text-purple-300",
    orange: "bg-orange-500/10 border-orange-500/40 text-orange-300",
    red: "bg-red-500/10 border-red-500/40 text-red-300",
    cyan: "bg-cyan-500/10 border-cyan-500/40 text-cyan-300",
    yellow: "bg-yellow-500/10 border-yellow-500/40 text-yellow-300",
  }
  const activeColor = colorMap[info.color]

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/20 p-4 border-b border-neutral-800">
        <h3 className="text-xl font-bold text-white">Experiment 7 — Basic Logic Gates Virtual Lab</h3>
        <p className="text-neutral-400 text-sm mt-1">Select a gate, toggle inputs, and observe the output in real-time</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Gate Selector */}
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2 font-semibold">Select Gate</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(gateInfo) as GateType[]).map(g => (
              <button
                key={g}
                onClick={() => { setSelectedGate(g); setInputA(0); setInputB(0) }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  selectedGate === g ? activeColor : "bg-neutral-800/60 border-neutral-700 text-neutral-400 hover:border-neutral-500"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Gate Info + Controls */}
          <div className="space-y-4">
            {/* Info Card */}
            <div className={`rounded-xl border p-4 ${colorMap[info.color]}`}>
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-sm mb-0.5">{selectedGate} Gate — {info.ic}</div>
                  <div className="text-xs opacity-80 mb-1">{info.expression}</div>
                  <div className="text-xs opacity-70">{info.desc}</div>
                </div>
              </div>
            </div>

            {/* Input Controls */}
            <div className="bg-neutral-800/60 rounded-xl p-4 space-y-3 border border-neutral-700/50">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Input Controls</p>
              <div className="flex items-center gap-4">
                <span className="text-neutral-300 text-sm w-6">A</span>
                <button
                  onClick={() => setInputA(inputA === 0 ? 1 : 0)}
                  className={`w-16 h-9 rounded-lg text-sm font-bold transition-all duration-200 ${
                    inputA === 1 ? "bg-green-500 text-white shadow-lg shadow-green-500/30" : "bg-neutral-700 text-neutral-400"
                  }`}
                >
                  {inputA}
                </button>
                <span className="text-neutral-500 text-xs">{inputA === 1 ? "HIGH (5V)" : "LOW (0V)"}</span>
              </div>
              {selectedGate !== "NOT" && (
                <div className="flex items-center gap-4">
                  <span className="text-neutral-300 text-sm w-6">B</span>
                  <button
                    onClick={() => setInputB(inputB === 0 ? 1 : 0)}
                    className={`w-16 h-9 rounded-lg text-sm font-bold transition-all duration-200 ${
                      inputB === 1 ? "bg-green-500 text-white shadow-lg shadow-green-500/30" : "bg-neutral-700 text-neutral-400"
                    }`}
                  >
                    {inputB}
                  </button>
                  <span className="text-neutral-500 text-xs">{inputB === 1 ? "HIGH (5V)" : "LOW (0V)"}</span>
                </div>
              )}

              {/* Output */}
              <div className="pt-2 border-t border-neutral-700">
                <div className="flex items-center gap-4">
                  <span className="text-neutral-300 text-sm w-6">Y</span>
                  <div className={`w-16 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                    output === 1 ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-lg shadow-green-500/20" : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}>
                    {output}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {output === 1 ? (
                      <><CheckCircle className="h-4 w-4 text-green-400" /><span className="text-green-400">HIGH — LED ON</span></>
                    ) : (
                      <><XCircle className="h-4 w-4 text-red-400" /><span className="text-red-400">LOW — LED OFF</span></>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setInputA(0); setInputB(0) }}
              className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Inputs
            </button>
          </div>

          {/* Right: Visual Gate + Truth Table */}
          <div className="space-y-4">
            {/* Gate SVG */}
            <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800 flex items-center justify-center min-h-[140px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedGate}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full"
                >
                  <GateSVG gate={selectedGate} inputA={inputA} inputB={selectedGate === "NOT" ? 0 : inputB} output={output} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Truth Table */}
            <div className="bg-neutral-800/40 rounded-xl border border-neutral-700/50 overflow-hidden">
              <div className="bg-neutral-800/80 px-4 py-2 border-b border-neutral-700/50">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Truth Table — {selectedGate} Gate</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-700/50">
                    <th className="py-2 px-4 text-left text-neutral-500 font-medium">A</th>
                    {selectedGate !== "NOT" && <th className="py-2 px-4 text-left text-neutral-500 font-medium">B</th>}
                    <th className="py-2 px-4 text-left text-neutral-500 font-medium">Y (Output)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const isActive = row.a === inputA && (selectedGate === "NOT" || row.b === inputB)
                    return (
                      <tr
                        key={i}
                        className={`border-b border-neutral-800/60 transition-colors ${
                          isActive ? "bg-blue-500/10" : "hover:bg-neutral-700/20"
                        }`}
                      >
                        <td className={`py-2 px-4 font-mono font-bold ${row.a === 1 ? "text-green-400" : "text-red-400"}`}>{row.a}</td>
                        {selectedGate !== "NOT" && <td className={`py-2 px-4 font-mono font-bold ${row.b === 1 ? "text-green-400" : "text-red-400"}`}>{row.b}</td>}
                        <td className={`py-2 px-4 font-mono font-bold ${row.y === 1 ? "text-green-400" : "text-red-400"}`}>
                          {row.y}
                          {isActive && <span className="ml-2 text-xs text-blue-400">← current</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Experiment 8: Half Adder & Full Adder Virtual Lab
// ─────────────────────────────────────────────────────────────────────────────

type AdderMode = "half" | "full"

function halfAdder(a: number, b: number): { sum: number; carry: number } {
  return { sum: a ^ b, carry: a & b }
}

function fullAdder(a: number, b: number, cin: number): { sum: number; carry: number } {
  const sum1 = a ^ b
  const c1 = a & b
  const sum = sum1 ^ cin
  const c2 = sum1 & cin
  const carry = c1 | c2
  return { sum, carry }
}

const halfAdderRows = () =>
  [0, 0, 1, 1].map((a, i) => {
    const b = [0, 1, 0, 1][i]
    const { sum, carry } = halfAdder(a, b)
    return { a, b, sum, carry }
  })

const fullAdderRows = () =>
  [0,0,0,0,1,1,1,1].map((a, i) => {
    const b = [0,0,1,1,0,0,1,1][i]
    const cin = [0,1,0,1,0,1,0,1][i]
    const { sum, carry } = fullAdder(a, b, cin)
    return { a, b, cin, sum, carry }
  })

function BitButton({ label, value, onToggle }: { label: string; value: number; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-neutral-300 text-sm w-8">{label}</span>
      <button
        onClick={onToggle}
        className={`w-16 h-9 rounded-lg text-sm font-bold transition-all duration-200 ${
          value === 1 ? "bg-green-500 text-white shadow-lg shadow-green-500/30" : "bg-neutral-700 text-neutral-400"
        }`}
      >
        {value}
      </button>
      <span className="text-neutral-500 text-xs">{value === 1 ? "HIGH" : "LOW"}</span>
    </div>
  )
}

export function AdderVirtualLab() {
  const [mode, setMode] = useState<AdderMode>("half")
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [cin, setCin] = useState(0)

  const halfResult = halfAdder(a, b)
  const fullResult = fullAdder(a, b, cin)
  const result = mode === "half" ? halfResult : fullResult

  const haRows = halfAdderRows()
  const faRows = fullAdderRows()

  const isHaActive = (row: typeof haRows[0]) => row.a === a && row.b === b
  const isFaActive = (row: typeof faRows[0]) => row.a === a && row.b === b && row.cin === cin

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/20 p-4 border-b border-neutral-800">
        <h3 className="text-xl font-bold text-white">Experiment 8 — Half Adder & Full Adder Virtual Lab</h3>
        <p className="text-neutral-400 text-sm mt-1">Explore binary addition circuits interactively</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          {(["half", "full"] as AdderMode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setA(0); setB(0); setCin(0) }}
              className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                mode === m
                  ? "bg-green-500/20 border-green-500/50 text-green-300"
                  : "bg-neutral-800/60 border-neutral-700 text-neutral-400 hover:border-neutral-500"
              }`}
            >
              {m === "half" ? "Half Adder" : "Full Adder"}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className={`rounded-xl border p-4 text-sm ${mode === "half" ? "bg-green-500/8 border-green-500/20 text-green-300" : "bg-teal-500/8 border-teal-500/20 text-teal-300"}`}>
          {mode === "half" ? (
            <>
              <strong>Half Adder:</strong> Adds two 1-bit binary numbers (A and B). Produces a Sum (S = A⊕B) and Carry (C = A·B). <br />
              <span className="opacity-70 text-xs mt-1 block">Uses: 1 XOR gate + 1 AND gate. Does NOT handle carry-in from previous stage.</span>
            </>
          ) : (
            <>
              <strong>Full Adder:</strong> Adds three 1-bit binary numbers (A, B, and Carry-In). Produces Sum and Carry-Out. <br />
              <span className="opacity-70 text-xs mt-1 block">Uses: 2 XOR gates + 2 AND gates + 1 OR gate. Can be chained for multi-bit addition.</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Controls + Result */}
          <div className="space-y-4">
            <div className="bg-neutral-800/60 rounded-xl p-4 space-y-3 border border-neutral-700/50">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Input Controls</p>
              <BitButton label="A" value={a} onToggle={() => setA(a === 0 ? 1 : 0)} />
              <BitButton label="B" value={b} onToggle={() => setB(b === 0 ? 1 : 0)} />
              {mode === "full" && (
                <BitButton label="Cin" value={cin} onToggle={() => setCin(cin === 0 ? 1 : 0)} />
              )}
            </div>

            {/* Result */}
            <div className="bg-neutral-800/60 rounded-xl p-4 border border-neutral-700/50">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-3">Output</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-neutral-300 text-sm w-16">Sum (S)</span>
                  <div className={`w-16 h-9 rounded-lg text-sm font-bold flex items-center justify-center ${
                    result.sum === 1 ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}>{result.sum}</div>
                  <span className="text-xs text-neutral-500">{result.sum === 1 ? "HIGH" : "LOW"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-300 text-sm w-16">Carry (C)</span>
                  <div className={`w-16 h-9 rounded-lg text-sm font-bold flex items-center justify-center ${
                    result.carry === 1 ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-red-500/20 text-red-400 border border-red-500/50"
                  }`}>{result.carry}</div>
                  <span className="text-xs text-neutral-500">{result.carry === 1 ? "HIGH" : "LOW"}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-neutral-900/50 rounded-lg font-mono text-sm">
                <div className="text-neutral-400">
                  {mode === "half" ? (
                    <>{a} + {b} = <span className="text-white font-bold">{result.carry}{result.sum}</span> (binary)</>
                  ) : (
                    <>{a} + {b} + Cin({cin}) = <span className="text-white font-bold">{result.carry}{result.sum}</span> (binary)</>
                  )}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Decimal: {a} + {b}{mode === "full" ? ` + ${cin}` : ""} = {a + b + (mode === "full" ? cin : 0)}
                </div>
              </div>
            </div>

            <button
              onClick={() => { setA(0); setB(0); setCin(0) }}
              className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {/* Truth Table */}
          <div className="bg-neutral-800/40 rounded-xl border border-neutral-700/50 overflow-hidden self-start">
            <div className="bg-neutral-800/80 px-4 py-2 border-b border-neutral-700/50">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Truth Table — {mode === "half" ? "Half" : "Full"} Adder
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-700/50">
                    <th className="py-2 px-3 text-left text-neutral-500 font-medium">A</th>
                    <th className="py-2 px-3 text-left text-neutral-500 font-medium">B</th>
                    {mode === "full" && <th className="py-2 px-3 text-left text-neutral-500 font-medium">Cin</th>}
                    <th className="py-2 px-3 text-left text-neutral-500 font-medium">Sum</th>
                    <th className="py-2 px-3 text-left text-neutral-500 font-medium">Carry</th>
                  </tr>
                </thead>
                <tbody>
                  {mode === "half"
                    ? haRows.map((row, i) => (
                        <tr key={i} className={`border-b border-neutral-800/60 transition-colors ${isHaActive(row) ? "bg-green-500/10" : "hover:bg-neutral-700/20"}`}>
                          <td className={`py-2 px-3 font-mono font-bold ${row.a === 1 ? "text-green-400" : "text-red-400"}`}>{row.a}</td>
                          <td className={`py-2 px-3 font-mono font-bold ${row.b === 1 ? "text-green-400" : "text-red-400"}`}>{row.b}</td>
                          <td className={`py-2 px-3 font-mono font-bold ${row.sum === 1 ? "text-green-400" : "text-red-400"}`}>
                            {row.sum}{isHaActive(row) && <span className="ml-1 text-xs text-blue-400">←</span>}
                          </td>
                          <td className={`py-2 px-3 font-mono font-bold ${row.carry === 1 ? "text-green-400" : "text-red-400"}`}>{row.carry}</td>
                        </tr>
                      ))
                    : faRows.map((row, i) => (
                        <tr key={i} className={`border-b border-neutral-800/60 transition-colors ${isFaActive(row) ? "bg-green-500/10" : "hover:bg-neutral-700/20"}`}>
                          <td className={`py-2 px-3 font-mono font-bold ${row.a === 1 ? "text-green-400" : "text-red-400"}`}>{row.a}</td>
                          <td className={`py-2 px-3 font-mono font-bold ${row.b === 1 ? "text-green-400" : "text-red-400"}`}>{row.b}</td>
                          <td className={`py-2 px-3 font-mono font-bold ${row.cin === 1 ? "text-green-400" : "text-red-400"}`}>{row.cin}</td>
                          <td className={`py-2 px-3 font-mono font-bold ${row.sum === 1 ? "text-green-400" : "text-red-400"}`}>
                            {row.sum}{isFaActive(row) && <span className="ml-1 text-xs text-blue-400">←</span>}
                          </td>
                          <td className={`py-2 px-3 font-mono font-bold ${row.carry === 1 ? "text-green-400" : "text-red-400"}`}>{row.carry}</td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

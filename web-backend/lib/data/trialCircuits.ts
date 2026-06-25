import type { CircuitNode, CircuitConnection } from "@/components/customizable-circuit"

// Helper to generate unique IDs
const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Predefined trial circuits for each experiment
export const trialCircuits: Record<
  number,
  { nodes: CircuitNode[]; connections: CircuitConnection[] }
> = {
  // Experiment 1: Kirchhoff's Voltage Law
  1: {
    nodes: [
      { id: "kvl-ground", type: "ground", x: 50, y: 200, label: "GND", voltageSource: 0 },
      { id: "kvl-source", type: "source", x: 150, y: 200, label: "V1", voltageSource: 10 },
      { id: "kvl-r1", type: "resistor", x: 250, y: 200, label: "R1", value: "1kΩ", resistance: 1000 },
      { id: "kvl-r2", type: "resistor", x: 350, y: 200, label: "R2", value: "2kΩ", resistance: 2000 },
      { id: "kvl-j1", type: "node", x: 200, y: 200, label: "J1" },
      { id: "kvl-j2", type: "node", x: 300, y: 200, label: "J2" },
    ],
    connections: [
      { from: "kvl-ground", to: "kvl-source" },
      { from: "kvl-source", to: "kvl-j1" },
      { from: "kvl-j1", to: "kvl-r1" },
      { from: "kvl-r1", to: "kvl-j2" },
      { from: "kvl-j2", to: "kvl-r2" },
      { from: "kvl-r2", to: "kvl-ground" },
    ],
  },

  // Experiment 2: Thevenin's Theorem
  2: {
    nodes: [
      { id: "th-ground", type: "ground", x: 50, y: 200, label: "GND" },
      { id: "th-source", type: "source", x: 150, y: 200, label: "Vs", voltageSource: 12 },
      { id: "th-r1", type: "resistor", x: 250, y: 100, label: "R1", value: "1kΩ", resistance: 1000 },
      { id: "th-r2", type: "resistor", x: 250, y: 300, label: "R2", value: "2kΩ", resistance: 2000 },
      { id: "th-rl", type: "resistor", x: 350, y: 200, label: "RL", value: "1.5kΩ", resistance: 1500 },
    ],
    connections: [
      { from: "th-ground", to: "th-source" },
      { from: "th-source", to: "th-r1" },
      { from: "th-r1", to: "th-rl" },
      { from: "th-rl", to: "th-r2" },
      { from: "th-r2", to: "th-ground" },
    ],
  },

  // Experiment 3: PN Junction Diode
  3: {
    nodes: [
      { id: "diode-ground", type: "ground", x: 50, y: 200, label: "GND" },
      { id: "diode-source", type: "source", x: 150, y: 200, label: "V", voltageSource: 5 },
      { id: "diode-r", type: "resistor", x: 250, y: 200, label: "R", value: "1kΩ", resistance: 1000 },
      { id: "diode-d1", type: "diode", x: 350, y: 200, label: "D1" },
    ],
    connections: [
      { from: "diode-ground", to: "diode-source" },
      { from: "diode-source", to: "diode-r" },
      { from: "diode-r", to: "diode-d1" },
      { from: "diode-d1", to: "diode-ground" },
    ],
  },

  // Experiment 4: Full Wave Rectifier
  4: {
    nodes: [
      { id: "rec-ground", type: "ground", x: 50, y: 250, label: "GND" },
      { id: "rec-source", type: "source", x: 150, y: 150, label: "V_AC", voltageSource: 12 },
      { id: "rec-d1", type: "diode", x: 250, y: 100, label: "D1" },
      { id: "rec-d2", type: "diode", x: 250, y: 200, label: "D2" },
      { id: "rec-d3", type: "diode", x: 350, y: 100, label: "D3" },
      { id: "rec-d4", type: "diode", x: 350, y: 200, label: "D4" },
      { id: "rec-load", type: "resistor", x: 450, y: 150, label: "RL", value: "1kΩ", resistance: 1000 },
    ],
    connections: [
      { from: "rec-ground", to: "rec-source" },
      { from: "rec-source", to: "rec-d1" },
      { from: "rec-d1", to: "rec-load" },
      { from: "rec-load", to: "rec-d4" },
      { from: "rec-d4", to: "rec-ground" },
      { from: "rec-d2", to: "rec-ground" },
      { from: "rec-d2", to: "rec-load" },
      { from: "rec-source", to: "rec-d3" },
      { from: "rec-d3", to: "rec-d2" },
    ],
  },

  // Default simple circuit for other experiments
}

// Fill in simple default for experiments 5-12
for (let id = 5; id <= 12; id++) {
  if (!trialCircuits[id]) {
    trialCircuits[id] = {
      nodes: [
        { id: `def-ground-${id}`, type: "ground", x: 50, y: 200, label: "GND" },
        { id: `def-source-${id}`, type: "source", x: 150, y: 200, label: "V", voltageSource: 5 },
        { id: `def-r-${id}`, type: "resistor", x: 250, y: 200, label: "R", value: "1kΩ", resistance: 1000 },
      ],
      connections: [
        { from: `def-ground-${id}`, to: `def-source-${id}` },
        { from: `def-source-${id}`, to: `def-r-${id}` },
        { from: `def-r-${id}`, to: `def-ground-${id}` },
      ],
    }
  }
}

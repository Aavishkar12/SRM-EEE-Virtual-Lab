"use client"
import { NavDock } from "@/components/nav-dock"

import { useState, useEffect, type ChangeEvent } from "react"
import { useSession } from "next-auth/react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Home, BookOpen, Settings, LogIn, FileQuestion, Users, Info, Lightbulb, Zap, Cpu, Activity, Video, Image as ImageIcon, Library, User, Pencil, X, Save, Loader2, CheckCircle, AlertCircle, Plus, Trash2, PlayCircle, Upload } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DigitalClock } from "@/components/digital-clock"
import { TinkercadEmbed } from "@/components/tinkercad-embed"
import { CircuitAnimation } from "@/components/ui/circuit-animation"
import { Circuit3DViewer } from "@/components/circuit-3d-viewer"
import { InteractiveRobotSpline } from "@/components/blocks/interactive-3d-robot"
import { 
  KVLExperiment, 
  TheveninExperiment,
  PNJunctionExperiment,
  FullWaveRectifierExperiment,
  ClipperExperiment,
  OpAmpExperiment,
  EnergyMeterExperiment,
  HouseWiringExperiment, 
  FluorescentLampExperiment, 
  StaircaseWiringExperiment,
} from "@/components/animated-experiment"
import { 
  KVLQuiz, 
  TheveninQuiz,
  PNJunctionQuiz,
  FullWaveRectifierQuiz,
  ClipperQuiz,
  OpAmpQuiz,
  LogicGatesQuiz,
  AdderQuiz,
  EnergyMeterQuiz,
  HouseWiringQuiz, 
  FluorescentLampQuiz, 
  StaircaseWiringQuiz, 
} from "@/components/experiment-quiz"
import { LogicGatesVirtualLab, AdderVirtualLab } from "@/components/digital-experiments"
import { CustomizableCircuit } from "@/components/customizable-circuit"
import {
  KVL3DExperiment,
  Thevenin3DExperiment,
  Diode3DExperiment,
  Rectifier3DExperiment,
  Clipper3DExperiment,
  OpAmp3DExperiment,
  LogicGates3DExperiment,
  Adder3DExperiment,
  EnergyMeter3DExperiment,
  HouseWiring3DExperiment,
  Fluorescent3DExperiment,
  Staircase3DExperiment
} from "@/components/experiments-3d"

// Updated experiments with detailed information from the lab manual
const experiments = [
  {
    id: 1,
    title: "Kirchhoff's Voltage Law",
    aim: "To verify Kirchhoff's voltage law for the given circuit.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
            <th class="border border-neutral-700 px-4 py-2">Apparatus</th>
            <th class="border border-neutral-700 px-4 py-2">Range</th>
            <th class="border border-neutral-700 px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">1</td>
            <td class="border border-neutral-700 px-4 py-2">RPS (regulated power supply)</td>
            <td class="border border-neutral-700 px-4 py-2">(0-30V)</td>
            <td class="border border-neutral-700 px-4 py-2">2</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">2</td>
            <td class="border border-neutral-700 px-4 py-2">Resistance</td>
            <td class="border border-neutral-700 px-4 py-2">330O, 220O, 1kO</td>
            <td class="border border-neutral-700 px-4 py-2">4</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">3</td>
            <td class="border border-neutral-700 px-4 py-2">Voltmeter</td>
            <td class="border border-neutral-700 px-4 py-2">(0-30V)MC</td>
            <td class="border border-neutral-700 px-4 py-2">2</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">4</td>
            <td class="border border-neutral-700 px-4 py-2">Bread Board & Wires</td>
            <td class="border border-neutral-700 px-4 py-2">-</td>
            <td class="border border-neutral-700 px-4 py-2">Required</td>
          </tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Statement:</h3>
      <p class="mb-4">KVL: In any closed path / mesh, the algebraic sum of all the voltages is zero.</p>
      
      <p class="mb-4">Kirchhoff's Voltage Law (KVL) states that the sum of all voltages around any closed loop in a circuit must equal zero. This is a fundamental principle in circuit analysis.</p>
      
      <p class="mb-4">Mathematically, it is expressed as:</p>
      <p class="font-bold mb-4">?V = 0</p>
      
      <p class="mb-4">Where:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>?V represents the sum of all voltage drops and rises around a closed loop</li>
      </ul>
      
      <p class="mb-4">This law is based on the principle of conservation of energy and is essential for analyzing complex circuits with multiple voltage sources and components.</p>
    `,
    procedure: `
      <h3>Experimental Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Set up a circuit with multiple voltage sources and resistors in a closed loop.</li>
        <li>Measure the voltage across each component in the circuit.</li>
        <li>Record all voltage measurements, noting whether they are voltage rises (from sources) or drops (across loads).</li>
        <li>Sum all voltages around the loop, considering their polarities.</li>
        <li>Verify that the sum equals zero, within measurement error.</li>
        <li>Repeat for different loops in the circuit if multiple loops exist.</li>
        <li>Compare experimental results with theoretical calculations.</li>
      </ol>
      
      <h3>Theoretical Values:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
            <th class="border border-neutral-700 px-4 py-2">RPS Voltage (E) Volts</th>
            <th class="border border-neutral-700 px-4 py-2">V1 Volts</th>
            <th class="border border-neutral-700 px-4 py-2">V2 Volts</th>
            <th class="border border-neutral-700 px-4 py-2">KVL: E = V1 + V2 Volts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">1</td>
            <td class="border border-neutral-700 px-4 py-2">6</td>
            <td class="border border-neutral-700 px-4 py-2">2.3</td>
            <td class="border border-neutral-700 px-4 py-2">3.79</td>
            <td class="border border-neutral-700 px-4 py-2">6 = 2.22 + 3.712</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">2</td>
            <td class="border border-neutral-700 px-4 py-2">12</td>
            <td class="border border-neutral-700 px-4 py-2">4.54</td>
            <td class="border border-neutral-700 px-4 py-2">7.46</td>
            <td class="border border-neutral-700 px-4 py-2">12 = 4.54 + 7.46</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">3</td>
            <td class="border border-neutral-700 px-4 py-2">18</td>
            <td class="border border-neutral-700 px-4 py-2">6.25</td>
            <td class="border border-neutral-700 px-4 py-2">11.25</td>
            <td class="border border-neutral-700 px-4 py-2">18 = 6.27 + 11.25</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">4</td>
            <td class="border border-neutral-700 px-4 py-2">24</td>
            <td class="border border-neutral-700 px-4 py-2">9.09</td>
            <td class="border border-neutral-700 px-4 py-2">14.91</td>
            <td class="border border-neutral-700 px-4 py-2">24 = 9.09 + 14.91</td>
          </tr>
        </tbody>
      </table>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Boylestad, R. L. (2016). Introductory Circuit Analysis (13th ed.). Pearson.</li>
        <li>Floyd, T. L. (2018). Principles of Electric Circuits (9th ed.). Pearson.</li>
        <li>Nilsson, J. W., & Riedel, S. A. (2019). Electric Circuits (11th ed.). Pearson.</li>
        <li>Irwin, J. D., & Nelms, R. M. (2015). Basic Engineering Circuit Analysis (11th ed.). Wiley.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "hNWAhAfShmV", // Tinkercad embed ID
  },
  {
    id: 2,
    title: "Thevenin's Theorem",
    aim: "To verify Thevenin's Theorem by constructing an equivalent circuit and comparing its behavior with the original circuit.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
            <th class="border border-neutral-700 px-4 py-2">Apparatus</th>
            <th class="border border-neutral-700 px-4 py-2">Range</th>
            <th class="border border-neutral-700 px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">1</td>
            <td class="border border-neutral-700 px-4 py-2">RPS (regulated power supply)</td>
            <td class="border border-neutral-700 px-4 py-2">(0-30V)</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">2</td>
            <td class="border border-neutral-700 px-4 py-2">Resistance</td>
            <td class="border border-neutral-700 px-4 py-2">330O, 1kO</td>
            <td class="border border-neutral-700 px-4 py-2">3</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">3</td>
            <td class="border border-neutral-700 px-4 py-2">Voltmeter</td>
            <td class="border border-neutral-700 px-4 py-2">(0-30V)MC</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">4</td>
            <td class="border border-neutral-700 px-4 py-2">Ammeter</td>
            <td class="border border-neutral-700 px-4 py-2">(0-10mA)</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">5</td>
            <td class="border border-neutral-700 px-4 py-2">Bread Board & Wires</td>
            <td class="border border-neutral-700 px-4 py-2">-</td>
            <td class="border border-neutral-700 px-4 py-2">Required</td>
          </tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Thevenin's Theorem Theory:</h3>
      <p class="mb-4">Thevenin's Theorem states that any linear circuit with voltage and current sources can be replaced by an equivalent circuit consisting of a voltage source in series with a resistor.</p>
      
      <p class="mb-4">The Thevenin equivalent circuit consists of:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Thevenin voltage (V<sub>TH</sub>): The open-circuit voltage across the load terminals</li>
        <li>Thevenin resistance (R<sub>TH</sub>): The equivalent resistance looking back into the circuit with all sources replaced by their internal resistances</li>
      </ul>
      
      <p class="mb-4">This simplification technique is powerful for analyzing complex circuits and determining maximum power transfer conditions.</p>
      
      <p class="mb-4">For the circuit in this experiment:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>V<sub>TH</sub> = 11.25V</li>
        <li>R<sub>TH</sub> = 490O</li>
      </ul>
    `,
    procedure: `
      <h3>Experimental Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Set up the original circuit without the load component.</li>
        <li>Measure the open-circuit voltage across the load terminals (V<sub>TH</sub>).</li>
        <li>Replace all independent sources with their internal resistances (voltage sources as short circuits, current sources as open circuits).</li>
        <li>Measure the equivalent resistance looking back into the circuit from the load terminals (R<sub>TH</sub>).</li>
        <li>Construct the Thevenin equivalent circuit using V<sub>TH</sub> and R<sub>TH</sub>.</li>
        <li>Connect the load to the Thevenin equivalent circuit and measure the load current and voltage.</li>
        <li>Compare the results with measurements from the original circuit to verify the theorem.</li>
        <li>Repeat with different load values to confirm the equivalence holds for any load.</li>
      </ol>
      
      <h3>Circuit for Thevenin's Theorem Verification:</h3>
      <div class="my-4 p-4 bg-neutral-800 rounded-lg">
        <p class="mb-2">Original Circuit:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>Voltage source: 22V</li>
          <li>Resistors: Three 330O resistors in the configuration shown</li>
          <li>Load: 1kO resistor</li>
        </ul>
        
        <p class="mb-2">Thevenin Equivalent Circuit:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>V<sub>TH</sub> = 11.25V</li>
          <li>R<sub>TH</sub> = 490O</li>
          <li>Load current (I<sub>L</sub>) = 7.1mA</li>
        </ul>
      </div>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Boylestad, R. L. (2016). Introductory Circuit Analysis (13th ed.). Pearson.</li>
        <li>Floyd, T. L. (2018). Principles of Electric Circuits (9th ed.). Pearson.</li>
        <li>Nilsson, J. W., & Riedel, S. A. (2019). Electric Circuits (11th ed.). Pearson.</li>
        <li>Irwin, J. D., & Nelms, R. M. (2015). Basic Engineering Circuit Analysis (11th ed.). Wiley.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "lAusQJ3m4bF", // Tinkercad embed ID
  },
  // -- Experiment 3: PN Junction Diode --
  {
    id: 3,
    title: "PN Junction Diode Characteristics",
    aim: "To plot the V-I characteristics of a PN junction diode in forward bias and reverse bias modes.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
            <th class="border border-neutral-700 px-4 py-2">Apparatus</th>
            <th class="border border-neutral-700 px-4 py-2">Range / Specification</th>
            <th class="border border-neutral-700 px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">Regulated Power Supply (RPS)</td><td class="border border-neutral-700 px-4 py-2">(0?30V) DC</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">PN Junction Diode</td><td class="border border-neutral-700 px-4 py-2">IN4007 / IN4001</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Resistance</td><td class="border border-neutral-700 px-4 py-2">1 kO</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">Voltmeter (DC)</td><td class="border border-neutral-700 px-4 py-2">(0?30V)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">Milliammeter (DC)</td><td class="border border-neutral-700 px-4 py-2">(0?100 mA)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">6</td><td class="border border-neutral-700 px-4 py-2">Microammeter (DC)</td><td class="border border-neutral-700 px-4 py-2">(0?200 ?A)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">7</td><td class="border border-neutral-700 px-4 py-2">Bread Board &amp; Connecting Wires</td><td class="border border-neutral-700 px-4 py-2">?</td><td class="border border-neutral-700 px-4 py-2">Required</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory ? PN Junction Diode:</h3>
      <p class="mb-4">A PN junction diode is formed by joining P-type and N-type semiconductor materials. The P-region has holes as majority carriers and the N-region has electrons as majority carriers. At the junction, diffusion of carriers creates a depletion region with a built-in potential (?0.3V for Ge, ?0.7V for Si).</p>
      <h4 class="font-semibold mt-4 mb-2">Forward Bias:</h4>
      <p class="mb-3">When the positive terminal of the battery is connected to the P-side and negative to the N-side, the applied voltage opposes the built-in potential. Above the threshold voltage (V<sub>T</sub>), the depletion region narrows and current flows exponentially:</p>
      <p class="mb-4 font-mono text-green-300">I = I<sub>0</sub> (e<sup>V/?V<sub>T</sub></sup> - 1)</p>
      <h4 class="font-semibold mt-4 mb-2">Reverse Bias:</h4>
      <p class="mb-3">When bias is reversed, the depletion region widens and only a very small reverse saturation current (I<sub>0</sub>) flows due to minority carriers. If the reverse voltage exceeds the breakdown voltage (V<sub>BR</sub>), current increases sharply (Zener or avalanche breakdown).</p>
      <h4 class="font-semibold mt-4 mb-2">Key Parameters:</h4>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li>Threshold voltage (Si): ~0.7V, (Ge): ~0.3V</li>
        <li>Reverse saturation current I<sub>0</sub>: nA range</li>
        <li>Dynamic resistance r<sub>d</sub> = ?V<sub>T</sub>/I (? = ideality factor)</li>
      </ul>
    `,
    procedure: `
      <h3>Procedure ? Forward Bias:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect the diode in forward bias: anode (+) to positive terminal of RPS through series resistor (1kO), cathode (-) to negative terminal.</li>
        <li>Connect voltmeter across the diode and milliammeter in series.</li>
        <li>Vary the RPS voltage from 0 V to 2 V in steps of 0.1 V.</li>
        <li>Record the diode voltage (V<sub>F</sub>) and current (I<sub>F</sub>) for each setting.</li>
        <li>Plot I<sub>F</sub> vs V<sub>F</sub> graph (forward characteristic).</li>
      </ol>
      <h3>Procedure ? Reverse Bias:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Reverse the diode connections: cathode to positive terminal, anode to negative.</li>
        <li>Connect microammeter in series to measure small reverse current.</li>
        <li>Increase reverse voltage from 0 V to 30 V in steps of 2 V.</li>
        <li>Record the reverse voltage (V<sub>R</sub>) and reverse current (I<sub>R</sub>) for each step.</li>
        <li>Plot I<sub>R</sub> vs V<sub>R</sub> (reverse characteristic).</li>
      </ol>
      <h3>Observations (Sample ? Forward Bias, Silicon Diode):</h3>
      <table class="w-full border-collapse my-4 text-sm">
        <thead><tr>
          <th class="border border-neutral-700 px-3 py-2">V<sub>F</sub> (V)</th>
          <th class="border border-neutral-700 px-3 py-2">I<sub>F</sub> (mA)</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">0.0</td><td class="border border-neutral-700 px-3 py-1 text-center">0.00</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">0.4</td><td class="border border-neutral-700 px-3 py-1 text-center">0.05</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">0.6</td><td class="border border-neutral-700 px-3 py-1 text-center">0.80</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">0.7</td><td class="border border-neutral-700 px-3 py-1 text-center">5.00</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">0.8</td><td class="border border-neutral-700 px-3 py-1 text-center">20.0</td></tr>
        </tbody>
      </table>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Boylestad, R. L., &amp; Nashelsky, L. (2015). Electronic Devices and Circuit Theory (11th ed.). Pearson.</li>
        <li>Sedra, A. S., &amp; Smith, K. C. (2014). Microelectronic Circuits (7th ed.). Oxford University Press.</li>
        <li>Millman, J., &amp; Halkias, C. C. (2010). Integrated Electronics (2nd ed.). Tata McGraw-Hill.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "",
  },
  // -- Experiment 4: Full Wave Rectifier --
  {
    id: 4,
    title: "Full Wave Rectifier",
    aim: "To construct a single phase full-wave bridge rectifier using diodes and to draw its performance characteristics.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">S.No.</th>
            <th class="border border-neutral-700 px-4 py-2">Name</th>
            <th class="border border-neutral-700 px-4 py-2">Range</th>
            <th class="border border-neutral-700 px-4 py-2">Qty</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">1</td>
            <td class="border border-neutral-700 px-4 py-2">Transformer</td>
            <td class="border border-neutral-700 px-4 py-2">230/(6-0-6)V</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">2</td>
            <td class="border border-neutral-700 px-4 py-2">R.P.S</td>
            <td class="border border-neutral-700 px-4 py-2">(0-30)V</td>
            <td class="border border-neutral-700 px-4 py-2">2</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Components Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">S.No.</th>
            <th class="border border-neutral-700 px-4 py-2">Name</th>
            <th class="border border-neutral-700 px-4 py-2">Range</th>
            <th class="border border-neutral-700 px-4 py-2">Qty</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">1</td>
            <td class="border border-neutral-700 px-4 py-2">Diode</td>
            <td class="border border-neutral-700 px-4 py-2">IN4007</td>
            <td class="border border-neutral-700 px-4 py-2">4</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">2</td>
            <td class="border border-neutral-700 px-4 py-2">Resistor</td>
            <td class="border border-neutral-700 px-4 py-2">1kO</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">3</td>
            <td class="border border-neutral-700 px-4 py-2">Bread Board</td>
            <td class="border border-neutral-700 px-4 py-2">-</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">4</td>
            <td class="border border-neutral-700 px-4 py-2">Capacitor</td>
            <td class="border border-neutral-700 px-4 py-2">100?F</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">5</td>
            <td class="border border-neutral-700 px-4 py-2">CRO</td>
            <td class="border border-neutral-700 px-4 py-2">1Hz-20MHz</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">6</td>
            <td class="border border-neutral-700 px-4 py-2">Connecting wires</td>
            <td class="border border-neutral-700 px-4 py-2">-</td>
            <td class="border border-neutral-700 px-4 py-2">Req</td>
          </tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Full Wave Rectifier Theory:</h3>
      <p class="mb-4">A full wave rectifier converts alternating current (AC) to direct current (DC) by utilizing both halves of the AC cycle. This results in more efficient power conversion compared to half-wave rectification.</p>
      
      <p class="mb-4">Types of full wave rectifiers include:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Center-tapped transformer type: Uses two diodes</li>
        <li>Bridge rectifier: Uses four diodes in a bridge configuration</li>
      </ul>
      
      <p class="mb-4">The output of a full wave rectifier has less ripple and higher average voltage than a half-wave rectifier, making it more suitable for power supply applications.</p>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <h4>Without Filter:</h4>
      <ol class="list-decimal pl-6 mb-4">
        <li>Give the connections as per the circuit diagram.</li>
        <li>Give 230 V, 50HZ input to the step down transformer where secondary connected to the bridge Rectifier.</li>
        <li>Take the rectifier output across the Load.</li>
        <li>Plot its performance graph.</li>
      </ol>
      
      <h4>With Filter:</h4>
      <ol class="list-decimal pl-6 mb-4">
        <li>Give the connections as per the circuit diagram.</li>
        <li>Give 230 V, 50HZ input to the step down transformer where secondary connected to the bridge Rectifier.</li>
        <li>Connect the Capacitor across the Load.</li>
        <li>Take the rectifier output across the Load.</li>
        <li>Plot its performance graph.</li>
      </ol>
      
      <h3>Circuit Diagrams:</h3>
      <div class="my-4 p-4 bg-neutral-800 rounded-lg">
        <p class="mb-2">Without Filter:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>AC input (230V, 50Hz)</li>
          <li>Transformer (step-down)</li>
          <li>Bridge rectifier with four diodes (D1, D2, D3, D4)</li>
          <li>Load resistor (1kO)</li>
          <li>CRO for measurement</li>
        </ul>
        
        <p class="mb-2">With Filter:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>Same as above, with a 100?F capacitor connected in parallel with the load resistor</li>
        </ul>
      </div>
      
      <h3>Observations:</h3>
      <p class="mb-4">Without Filter:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Time period: 10 milliseconds</li>
        <li>Output voltage: 8V</li>
      </ul>
      
      <p class="mb-4">With Filter:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Time period: 10 milliseconds</li>
        <li>Output voltage: Smoother DC with reduced ripple</li>
      </ul>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Boylestad, R. L., &amp; Nashelsky, L. (2015). Electronic Devices and Circuit Theory (11th ed.). Pearson.</li>
        <li>Malvino, A. P., &amp; Bates, D. J. (2016). Electronic Principles (8th ed.). McGraw-Hill Education.</li>
        <li>Floyd, T. L. (2018). Electronic Devices (10th ed.). Pearson.</li>
        <li>Sedra, A. S., &amp; Smith, K. C. (2014). Microelectronic Circuits (7th ed.). Oxford University Press.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "jbRQbeSnAzj",
  },
  // -- Experiment 5: Clipper Circuit --
  {
    id: 5,
    title: "Clipper Circuit",
    aim: "To study and verify the operation of series and parallel diode clipper circuits and observe how they limit signal amplitude.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
          <th class="border border-neutral-700 px-4 py-2">Apparatus</th>
          <th class="border border-neutral-700 px-4 py-2">Range / Specification</th>
          <th class="border border-neutral-700 px-4 py-2">Quantity</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">Function Generator</td><td class="border border-neutral-700 px-4 py-2">1 Hz ? 1 MHz</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">CRO (Cathode Ray Oscilloscope)</td><td class="border border-neutral-700 px-4 py-2">20 MHz</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Diode</td><td class="border border-neutral-700 px-4 py-2">IN4007</td><td class="border border-neutral-700 px-4 py-2">2</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">Resistor</td><td class="border border-neutral-700 px-4 py-2">1 kO</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">DC Battery / RPS</td><td class="border border-neutral-700 px-4 py-2">0?15V</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">6</td><td class="border border-neutral-700 px-4 py-2">Bread Board &amp; Connecting Wires</td><td class="border border-neutral-700 px-4 py-2">?</td><td class="border border-neutral-700 px-4 py-2">Required</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory ? Clipper Circuits:</h3>
      <p class="mb-4">A clipper (limiter) is a diode circuit that removes (clips) portions of an input waveform above or below a reference voltage level, without distorting the remaining part of the waveform.</p>
      <h4 class="font-semibold mt-4 mb-2">Types of Clippers:</h4>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>Series Positive Clipper:</b> Diode in series with load; clips the positive half-cycle. Output = negative half + zero (during positive half).</li>
        <li><b>Series Negative Clipper:</b> Diode reversed; clips the negative half-cycle.</li>
        <li><b>Parallel Positive Clipper:</b> Diode in parallel with load; during positive half, diode conducts and short-circuits the output to ~0.7V.</li>
        <li><b>Biased Clipper:</b> A reference voltage V<sub>R</sub> is added in series with the diode. Clipping level shifts from 0 to V<sub>R</sub>.</li>
        <li><b>Double Clipper (Combination):</b> Two diodes with opposite bias clip both positive and negative peaks ? output is limited to a window [-V<sub>R2</sub>, +V<sub>R1</sub>].</li>
      </ul>
      <h4 class="font-semibold mt-4 mb-2">Ideal vs Practical Diode:</h4>
      <p class="mb-4">In practical analysis, the 0.7V forward voltage drop of silicon diodes shifts the clipping level by 0.7V. For example, a parallel positive clipper clips at +0.7V, not 0V.</p>
    `,
    procedure: `
      <h3>Procedure ? Positive Series Clipper:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect the diode in series with the load resistor (1kO) with anode facing input.</li>
        <li>Apply a sinusoidal input (e.g., 5V peak, 1kHz) from the function generator.</li>
        <li>Observe the input waveform on Channel 1 of CRO and output on Channel 2.</li>
        <li>Verify that the positive half-cycle is clipped and negative half passes through.</li>
      </ol>
      <h3>Procedure ? Positive Parallel Clipper:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect the diode in parallel with the load resistor, anode toward the positive side of input.</li>
        <li>Apply sinusoidal input and observe output on CRO.</li>
        <li>Verify that output is limited to approximately 0.7V during the positive half-cycle.</li>
      </ol>
      <h3>Procedure ? Biased Clipper:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Add a DC reference voltage V<sub>R</sub> = 2V in series with the diode.</li>
        <li>Observe that clipping now occurs at 2.7V (V<sub>R</sub> + V<sub>D</sub>).</li>
      </ol>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Boylestad, R. L., &amp; Nashelsky, L. (2015). Electronic Devices and Circuit Theory (11th ed.). Pearson.</li>
        <li>Malvino, A. P., &amp; Bates, D. J. (2016). Electronic Principles (8th ed.). McGraw-Hill Education.</li>
        <li>Floyd, T. L. (2018). Electronic Devices (10th ed.). Pearson.</li>
        <li>Millman, J., &amp; Halkias, C. C. (2010). Integrated Electronics (2nd ed.). Tata McGraw-Hill.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "",
  },
  // -- Experiment 6: Op-Amp Inverting / Non-Inverting Amplifier --
  {
    id: 6,
    title: "Op-Amp Inverting / Non-Inverting Amplifier",
    aim: "To design inverting and non-inverting amplifier circuits using LM741 Op-Amp and verify the voltage gain experimentally.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
          <th class="border border-neutral-700 px-4 py-2">Apparatus</th>
          <th class="border border-neutral-700 px-4 py-2">Range / Specification</th>
          <th class="border border-neutral-700 px-4 py-2">Quantity</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">Op-Amp IC</td><td class="border border-neutral-700 px-4 py-2">LM741 / ?A741</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">Dual DC Power Supply</td><td class="border border-neutral-700 px-4 py-2">?15V</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Function Generator</td><td class="border border-neutral-700 px-4 py-2">1 Hz ? 1 MHz</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">CRO</td><td class="border border-neutral-700 px-4 py-2">20 MHz</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">Resistors</td><td class="border border-neutral-700 px-4 py-2">10kO, 22kO, 47kO</td><td class="border border-neutral-700 px-4 py-2">As required</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">6</td><td class="border border-neutral-700 px-4 py-2">Bread Board &amp; Connecting Wires</td><td class="border border-neutral-700 px-4 py-2">?</td><td class="border border-neutral-700 px-4 py-2">Required</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory ? Operational Amplifier:</h3>
      <p class="mb-4">An operational amplifier (Op-Amp) is a high-gain, DC-coupled differential amplifier with high input impedance and low output impedance. The LM741 has an open-loop gain of ~200,000 V/V. Practical applications use negative feedback to set a precise closed-loop gain.</p>
      <h4 class="font-semibold mt-4 mb-2">Inverting Amplifier:</h4>
      <p class="mb-3">The input signal is applied to the inverting (-) terminal through resistor R<sub>1</sub>. The feedback resistor R<sub>f</sub> connects the output to the inverting terminal. The non-inverting (+) terminal is grounded.</p>
      <p class="mb-4 font-mono text-orange-300">Closed-loop gain A<sub>v</sub> = -R<sub>f</sub> / R<sub>1</sub></p>
      <p class="mb-4">The output is 180? out of phase with the input. Negative sign indicates phase inversion.</p>
      <h4 class="font-semibold mt-4 mb-2">Non-Inverting Amplifier:</h4>
      <p class="mb-3">The input signal is applied to the non-inverting (+) terminal. The voltage divider (R<sub>1</sub> and R<sub>f</sub>) provides feedback to the inverting terminal.</p>
      <p class="mb-4 font-mono text-cyan-300">Closed-loop gain A<sub>v</sub> = 1 + R<sub>f</sub> / R<sub>1</sub></p>
      <p class="mb-4">The output is in phase with the input. The gain is always = 1.</p>
      <h4 class="font-semibold mt-4 mb-2">Virtual Ground Concept:</h4>
      <p class="mb-4">Due to the high open-loop gain and negative feedback, the voltage difference between the two input terminals is virtually zero (virtual short). This simplifies analysis of Op-Amp circuits.</p>
    `,
    procedure: `
      <h3>Procedure ? Inverting Amplifier:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect LM741 on the bread board. Apply ?15V to pins 7 (+V<sub>CC</sub>) and 4 (-V<sub>CC</sub>).</li>
        <li>Connect R<sub>1</sub> = 10kO from the function generator to pin 2 (inverting input).</li>
        <li>Connect R<sub>f</sub> = 47kO between pin 2 and pin 6 (output).</li>
        <li>Ground pin 3 (non-inverting input) through R<sub>1</sub> (for bias current compensation).</li>
        <li>Apply a sinusoidal input of 100 mV peak at 1 kHz.</li>
        <li>Measure V<sub>in</sub> on Ch-1 and V<sub>out</sub> on Ch-2 of CRO.</li>
        <li>Calculate experimental gain = V<sub>out</sub>/V<sub>in</sub> and compare with theoretical gain = -R<sub>f</sub>/R<sub>1</sub> = -4.7.</li>
      </ol>
      <h3>Procedure ? Non-Inverting Amplifier:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Apply the input signal to pin 3 (non-inverting input).</li>
        <li>Connect R<sub>1</sub> = 10kO between pin 2 and ground.</li>
        <li>Connect R<sub>f</sub> = 22kO between pin 2 and pin 6 (output).</li>
        <li>Measure input and output and calculate gain.</li>
        <li>Compare with theoretical gain = 1 + R<sub>f</sub>/R<sub>1</sub> = 3.2.</li>
      </ol>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Gayakwad, R. A. (2000). Op-Amps and Linear Integrated Circuits (4th ed.). Pearson.</li>
        <li>Coughlin, R. F., &amp; Driscoll, F. F. (2001). Operational Amplifiers and Linear Integrated Circuits (6th ed.). Pearson.</li>
        <li>Sedra, A. S., &amp; Smith, K. C. (2014). Microelectronic Circuits (7th ed.). Oxford University Press.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "",
  },
  // -- Experiment 7: Basic Logic Gates --
  {
    id: 7,
    title: "Basic Logic Gates",
    aim: "To implement basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) using ICs and verify their truth tables experimentally.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
          <th class="border border-neutral-700 px-4 py-2">Apparatus / IC</th>
          <th class="border border-neutral-700 px-4 py-2">Specification</th>
          <th class="border border-neutral-700 px-4 py-2">Quantity</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">AND Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7408 (Quad 2-input)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">OR Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7432 (Quad 2-input)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">NOT Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7404 (Hex Inverter)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">NAND Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7400 (Quad 2-input)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">NOR Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7402 (Quad 2-input)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">6</td><td class="border border-neutral-700 px-4 py-2">XOR Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7486 (Quad 2-input)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">7</td><td class="border border-neutral-700 px-4 py-2">DC Power Supply</td><td class="border border-neutral-700 px-4 py-2">+5V</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">8</td><td class="border border-neutral-700 px-4 py-2">Bread Board & Patch Cords</td><td class="border border-neutral-700 px-4 py-2">-</td><td class="border border-neutral-700 px-4 py-2">Required</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory:</h3>
      <p class="mb-4">Logic gates are the fundamental building blocks of all digital circuits. They perform Boolean logic operations on binary inputs (0 = LOW = 0V, 1 = HIGH = 5V) to produce a binary output.</p>
      <h4 class="font-semibold mt-4 mb-2">Basic Logic Gates:</h4>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>AND Gate (IC 7408):</b> Output is HIGH only when ALL inputs are HIGH. Y = A?B</li>
        <li><b>OR Gate (IC 7432):</b> Output is HIGH when ANY input is HIGH. Y = A+B</li>
        <li><b>NOT Gate (IC 7404):</b> Inverts the single input. Y = A</li>
        <li><b>NAND Gate (IC 7400):</b> Complement of AND. Output LOW only when all inputs HIGH. Y = (A?B)'</li>
        <li><b>NOR Gate (IC 7402):</b> Complement of OR. Output HIGH only when all inputs LOW. Y = (A+B)'</li>
        <li><b>XOR Gate (IC 7486):</b> Output HIGH when inputs are different. Y = A?B</li>
        <li><b>XNOR Gate:</b> Complement of XOR. Output HIGH when inputs are same. Y = (A?B)'</li>
      </ul>
      <p class="mb-4">NAND and NOR gates are called <b>universal gates</b> because any Boolean function can be implemented using only NAND or only NOR gates.</p>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect the VCC (Pin 14) of the IC to +5V supply and GND (Pin 7) to ground.</li>
        <li>Apply different combinations of logic inputs (0V = LOW, 5V = HIGH) to the input pins.</li>
        <li>Connect an LED with a 330O resistor to the output pin to observe the output.</li>
        <li>Record the output for all possible input combinations.</li>
        <li>Verify that the recorded truth table matches the theoretical truth table for each gate.</li>
        <li>Repeat for all seven logic gates.</li>
      </ol>
      <h3>Observations (AND Gate - IC 7408):</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">A</th>
          <th class="border border-neutral-700 px-4 py-2">B</th>
          <th class="border border-neutral-700 px-4 py-2">Y = A?B</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">0</td><td class="border border-neutral-700 px-4 py-2">0</td><td class="border border-neutral-700 px-4 py-2">0</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">0</td><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">0</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">0</td><td class="border border-neutral-700 px-4 py-2">0</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
        </tbody>
      </table>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Morris Mano, M. (2013). Digital Design (5th ed.). Pearson.</li>
        <li>Floyd, T. L. (2015). Digital Fundamentals (11th ed.). Pearson.</li>
        <li>Tocci, R. J., Widmer, N., & Moss, G. (2017). Digital Systems: Principles and Applications (12th ed.). Pearson.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "",
  },
  // -- Experiment 8: Half Adder & Full Adder --
  {
    id: 8,
    title: "Half Adder & Full Adder",
    aim: "To design and verify the operation of Half Adder and Full Adder circuits using basic logic gates.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
          <th class="border border-neutral-700 px-4 py-2">Apparatus / IC</th>
          <th class="border border-neutral-700 px-4 py-2">Specification</th>
          <th class="border border-neutral-700 px-4 py-2">Quantity</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">XOR Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7486</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">AND Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7408</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">OR Gate IC</td><td class="border border-neutral-700 px-4 py-2">IC 7432</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">DC Power Supply</td><td class="border border-neutral-700 px-4 py-2">+5V</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">Bread Board & Patch Cords</td><td class="border border-neutral-700 px-4 py-2">-</td><td class="border border-neutral-700 px-4 py-2">Required</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory:</h3>
      <h4 class="font-semibold mt-3 mb-2">Half Adder:</h4>
      <p class="mb-3">A Half Adder is a combinational circuit that adds two single bits (A and B) and produces two outputs: Sum (S) and Carry (C).</p>
      <p class="mb-2">Boolean Expressions: <b>S = A ? B</b>, &nbsp;&nbsp;<b>C = A ? B</b></p>
      <p class="mb-4">Implementation: 1 XOR gate + 1 AND gate. Limitation: Cannot handle carry from a previous stage.</p>
      <h4 class="font-semibold mt-3 mb-2">Full Adder:</h4>
      <p class="mb-3">A Full Adder adds three bits: A, B, and a Carry-In (Cin) from the previous stage, producing Sum and Carry-Out.</p>
      <p class="mb-2">Boolean Expressions: <b>S = A ? B ? Cin</b>, &nbsp;&nbsp;<b>Cout = A?B + B?Cin + A?Cin</b></p>
      <p class="mb-4">Implementation: 2 XOR gates + 2 AND gates + 1 OR gate. Full adders can be chained to add multi-bit binary numbers.</p>
    `,
    procedure: `
      <h3>Procedure ? Half Adder:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect IC 7486 (XOR) and IC 7408 (AND) on the bread board.</li>
        <li>Connect VCC (+5V) to Pin 14 and GND to Pin 7 of each IC.</li>
        <li>Apply inputs A and B to the first gate of each IC.</li>
        <li>Connect the XOR output to an LED (Sum) and AND output to another LED (Carry).</li>
        <li>Apply all input combinations (00, 01, 10, 11) and record outputs.</li>
      </ol>
      <h3>Procedure ? Full Adder:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>First compute A?B using XOR gate. Let the result be P.</li>
        <li>Compute Sum = P ? Cin using a second XOR gate.</li>
        <li>Compute A?B and P?Cin using AND gates.</li>
        <li>Compute Carry = (A?B) + (P?Cin) using an OR gate.</li>
        <li>Verify all 8 input combinations (A, B, Cin from 000 to 111).</li>
      </ol>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Morris Mano, M. (2013). Digital Design (5th ed.). Pearson.</li>
        <li>Floyd, T. L. (2015). Digital Fundamentals (11th ed.). Pearson.</li>
        <li>Tocci, R. J., Widmer, N., & Moss, G. (2017). Digital Systems: Principles and Applications (12th ed.). Pearson.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "",
  },
  // -- Unit 4: Electrical Instruments --
  // -- Experiment 9: Energy Measurement --
  {
    id: 9,
    title: "Energy Measurement",
    aim: "To measure electrical energy consumption using a single-phase energy meter and calculate the units consumed by different electrical loads.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
          <th class="border border-neutral-700 px-4 py-2">Apparatus</th>
          <th class="border border-neutral-700 px-4 py-2">Range / Specification</th>
          <th class="border border-neutral-700 px-4 py-2">Quantity</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">Single-Phase Energy Meter</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz, 5A</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">Wattmeter</td><td class="border border-neutral-700 px-4 py-2">230V, 5A</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Voltmeter (AC)</td><td class="border border-neutral-700 px-4 py-2">(0?300V)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">Ammeter (AC)</td><td class="border border-neutral-700 px-4 py-2">(0?5A)</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">Resistive Load (Lamp)</td><td class="border border-neutral-700 px-4 py-2">100W, 230V</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">6</td><td class="border border-neutral-700 px-4 py-2">Inductive Load (Fan / Motor)</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">7</td><td class="border border-neutral-700 px-4 py-2">Stop Watch / Timer</td><td class="border border-neutral-700 px-4 py-2">?</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">8</td><td class="border border-neutral-700 px-4 py-2">Connecting Wires</td><td class="border border-neutral-700 px-4 py-2">?</td><td class="border border-neutral-700 px-4 py-2">Required</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory ? Single-Phase Energy Meter:</h3>
      <p class="mb-4">An energy meter (also called a kWh meter or watt-hour meter) measures the total electrical energy consumed by a load over a period of time. It integrates power (watts) over time (hours) to give energy in kilowatt-hours (kWh).</p>
      <h4 class="font-semibold mt-4 mb-2">Construction:</h4>
      <p class="mb-3">A conventional induction-type single-phase energy meter consists of:</p>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li><b>Shunt Magnet (Voltage Coil):</b> Connected across the supply; produces a flux proportional to the supply voltage.</li>
        <li><b>Series Magnet (Current Coil):</b> Carries the load current; produces a flux proportional to the current.</li>
        <li><b>Aluminium Disc:</b> Rotates due to the interaction of the two fluxes (by eddy current principle). Speed is proportional to power.</li>
        <li><b>Braking Magnet:</b> A permanent magnet that creates a braking torque proportional to disc speed, ensuring steady rotation at a speed proportional to power.</li>
        <li><b>Counter / Register:</b> Counts the number of disc revolutions and displays energy in kWh.</li>
      </ul>
      <h4 class="font-semibold mt-4 mb-2">Working Principle (Induction Type):</h4>
      <p class="mb-4">The rotating disc develops an eddy-current torque T<sub>d</sub> ? V ? I ? cos f = P (real power). The braking torque T<sub>b</sub> ? n (disc speed). At steady state, T<sub>d</sub> = T<sub>b</sub>, so n ? P.</p>
      <h4 class="font-semibold mt-4 mb-2">Key Formula:</h4>
      <p class="mb-2 font-mono text-green-300">Energy (kWh) = Power (kW) ? Time (h)</p>
      <p class="mb-2 font-mono text-yellow-300">Meter Constant (K) = No. of revolutions per kWh (marked on the meter)</p>
      <p class="mb-4 font-mono text-cyan-300">Measured Power = (No. of revolutions ? 3600) / (K ? Time in seconds) kW</p>
      <h4 class="font-semibold mt-4 mb-2">Error Calculation:</h4>
      <p class="mb-4 font-mono text-orange-300">% Error = [(Measured kWh - True kWh) / True kWh] ? 100</p>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect the energy meter, wattmeter, voltmeter, ammeter, and load as per the circuit diagram (supply ? energy meter current coil ? load; voltage coil across supply).</li>
        <li>Note the initial reading on the energy meter register (R<sub>1</sub>) in kWh.</li>
        <li>Switch ON the load (e.g., 100W lamp) and simultaneously start the stopwatch.</li>
        <li>Count the number of disc revolutions (N) using the red mark on the disc for a fixed time t (e.g., 5 minutes).</li>
        <li>Record the wattmeter reading (P<sub>true</sub>) in watts.</li>
        <li>After time t, note the final energy meter reading (R<sub>2</sub>) in kWh.</li>
        <li>Calculate the measured power from disc revolutions: P<sub>meas</sub> = (N ? 3600) / (K ? t) kW.</li>
        <li>Compare P<sub>meas</sub> with P<sub>true</sub> and compute % error.</li>
        <li>Repeat with different loads (fan, two lamps) and record observations.</li>
      </ol>
      <h3>Observations Table:</h3>
      <table class="w-full border-collapse my-4 text-sm">
        <thead><tr>
          <th class="border border-neutral-700 px-3 py-2">Load</th>
          <th class="border border-neutral-700 px-3 py-2">V (V)</th>
          <th class="border border-neutral-700 px-3 py-2">I (A)</th>
          <th class="border border-neutral-700 px-3 py-2">P<sub>true</sub> (W)</th>
          <th class="border border-neutral-700 px-3 py-2">Revolutions (N)</th>
          <th class="border border-neutral-700 px-3 py-2">Time t (s)</th>
          <th class="border border-neutral-700 px-3 py-2">P<sub>meas</sub> (W)</th>
          <th class="border border-neutral-700 px-3 py-2">% Error</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-3 py-1">100W Lamp</td><td class="border border-neutral-700 px-3 py-1">230</td><td class="border border-neutral-700 px-3 py-1">0.43</td><td class="border border-neutral-700 px-3 py-1">100</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">300</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1">Fan (Inductive)</td><td class="border border-neutral-700 px-3 py-1">230</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">300</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">?</td></tr>
        </tbody>
      </table>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Golding, E. W., &amp; Widdis, F. C. (1963). Electrical Measurements and Measuring Instruments (5th ed.). Pitman.</li>
        <li>Gupta, J. B. (2012). A Course in Electrical and Electronic Measurements and Instrumentation. S. K. Kataria.</li>
        <li>Sawhney, A. K. (2015). A Course in Electrical Machine Design. Dhanpat Rai.</li>
        <li>IS 722 (2008). Specification for AC Electricity Meters. Bureau of Indian Standards.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "",
  },
  // -- Unit 5: Electric Wiring & Safety --
  // -- Experiment 10: House Wiring --
  {
    id: 10,
    title: "House Wiring",
    aim: "To implement residential house wiring with energy meter, MCB, switches, lamp, and fan, and to read the energy meter in kWh.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
          <th class="border border-neutral-700 px-4 py-2">Component</th>
          <th class="border border-neutral-700 px-4 py-2">Specification</th>
          <th class="border border-neutral-700 px-4 py-2">Quantity</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">Single-Phase Energy Meter</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz, 5A</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">MCB (Miniature Circuit Breaker)</td><td class="border border-neutral-700 px-4 py-2">230V, 6A</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">One-Way Switch</td><td class="border border-neutral-700 px-4 py-2">230V, 5A</td><td class="border border-neutral-700 px-4 py-2">3</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">Incandescent Lamp with Holder</td><td class="border border-neutral-700 px-4 py-2">60W, 230V</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">Ceiling Fan with Regulator</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">6</td><td class="border border-neutral-700 px-4 py-2">3-Pin Socket with Plug</td><td class="border border-neutral-700 px-4 py-2">230V, 5A</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">7</td><td class="border border-neutral-700 px-4 py-2">Phase / Neutral / Earth Wires</td><td class="border border-neutral-700 px-4 py-2">1.5 mm? PVC (Red/Black/Green)</td><td class="border border-neutral-700 px-4 py-2">As required</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">8</td><td class="border border-neutral-700 px-4 py-2">Wireman's Tool Kit</td><td class="border border-neutral-700 px-4 py-2">?</td><td class="border border-neutral-700 px-4 py-2">1 set</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory ? Residential House Wiring:</h3>
      <p class="mb-4">House wiring is the distribution of electrical energy from the utility supply point to various loads (lights, fans, sockets) within a building. Standard Indian supply is 230V AC, 50Hz, single-phase.</p>
      <h4 class="font-semibold mt-4 mb-2">Key Components:</h4>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><b>Energy Meter:</b> Measures the total energy consumed in kWh. It is the first component after the utility supply and records consumption for billing.</li>
        <li><b>MCB (Miniature Circuit Breaker):</b> Replaces the traditional fuse box. Provides overcurrent and short-circuit protection. Can be reset manually after tripping.</li>
        <li><b>One-Way Switch:</b> Controls a single load from one location. Has two terminals ? LINE IN and LINE OUT.</li>
        <li><b>Lamp / Light:</b> Converts electrical energy to light. Connected in phase line through the switch.</li>
        <li><b>Fan Regulator:</b> A variable resistor (older type) or TRIAC-based (modern) device to control fan speed.</li>
        <li><b>3-Pin Socket:</b> Provides Phase (L), Neutral (N), and Earth (E) for portable appliances.</li>
      </ul>
      <h4 class="font-semibold mt-4 mb-2">Wiring Rules:</h4>
      <ul class="list-disc pl-6 mb-4 space-y-1">
        <li>Phase (Red wire) is always switched ? switches must be on the Phase line, NEVER on Neutral.</li>
        <li>Neutral (Black wire) runs directly to all loads.</li>
        <li>Earth (Green/Yellow wire) is connected to the metallic body of all appliances and sockets for safety.</li>
        <li>All joints must be done in junction boxes, not in open air.</li>
      </ul>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Note the initial reading on the energy meter (R<sub>1</sub>).</li>
        <li>Connect the circuit as per the wiring diagram: Supply ? Energy Meter ? MCB ? Distribution Board.</li>
        <li>From the distribution board, wire Switch-1 to control the lamp; Switch-2 to control the fan (with regulator); Socket outlet with earth.</li>
        <li>Verify all connections: Phase through switch to load; Neutral directly to load; Earth bonded to socket and appliance bodies.</li>
        <li>Switch ON the MCB. Switch ON loads one by one and verify operation.</li>
        <li>Run all loads for a fixed time (e.g., 30 minutes). Note the final reading (R<sub>2</sub>).</li>
        <li>Calculate energy consumed: E = R<sub>2</sub> - R<sub>1</sub> kWh.</li>
        <li>Adjust fan speed using regulator and note the change in fan operation.</li>
      </ol>
      <h3>Observations Table:</h3>
      <table class="w-full border-collapse my-4 text-sm">
        <thead><tr>
          <th class="border border-neutral-700 px-3 py-2">Load Status</th>
          <th class="border border-neutral-700 px-3 py-2">Energy Meter Reading (kWh)</th>
          <th class="border border-neutral-700 px-3 py-2">Time (min)</th>
          <th class="border border-neutral-700 px-3 py-2">Energy Consumed (kWh)</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-3 py-1">Lamp ON only</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">30</td><td class="border border-neutral-700 px-3 py-1">?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1">Fan ON only</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">30</td><td class="border border-neutral-700 px-3 py-1">?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1">Lamp + Fan ON</td><td class="border border-neutral-700 px-3 py-1">?</td><td class="border border-neutral-700 px-3 py-1">30</td><td class="border border-neutral-700 px-3 py-1">?</td></tr>
        </tbody>
      </table>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Mullin, R. (2017). Electrical Wiring Residential (19th ed.). Cengage Learning.</li>
        <li>National Electrical Code (NEC) 2020. National Fire Protection Association.</li>
        <li>Bureau of Indian Standards, IS 732 ? Code of Practice for Electrical Wiring Installations.</li>
        <li>Nagrath, I. J., &amp; Kothari, D. P. (2010). Basic Electrical Engineering (3rd ed.). Tata McGraw-Hill.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "2rTQ63Z8SdD",
  },
  // -- Experiment 11: Fluorescent Lamp Wiring --
  {
    id: 11,
    title: "Fluorescent Lamp Wiring",
    aim: "To connect a 40W fluorescent lamp with choke and starter and verify the role of each component in the starting and operation of the lamp.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
          <th class="border border-neutral-700 px-4 py-2">Component</th>
          <th class="border border-neutral-700 px-4 py-2">Specification</th>
          <th class="border border-neutral-700 px-4 py-2">Quantity</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">Fluorescent Lamp (Tube Light)</td><td class="border border-neutral-700 px-4 py-2">40W, 230V, 4 ft</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">Choke (Ballast / Inductor)</td><td class="border border-neutral-700 px-4 py-2">40W, 230V, 50Hz</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Starter</td><td class="border border-neutral-700 px-4 py-2">FS-2 type</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">Tube Light Holder/Fixture</td><td class="border border-neutral-700 px-4 py-2">4 ft</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">One-Way Switch</td><td class="border border-neutral-700 px-4 py-2">230V, 5A</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">6</td><td class="border border-neutral-700 px-4 py-2">Connecting Wires &amp; Tool Kit</td><td class="border border-neutral-700 px-4 py-2">?</td><td class="border border-neutral-700 px-4 py-2">Required</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory ? Fluorescent Lamp:</h3>
      <p class="mb-4">A fluorescent lamp is a low-pressure mercury-vapour gas-discharge lamp that uses fluorescence to produce visible light. It is filled with mercury vapour and an inert gas (argon) at low pressure (~2.5 mmHg). The inner surface is coated with a phosphor powder that emits visible light when struck by UV radiation from the mercury arc.</p>
      <h4 class="font-semibold mt-4 mb-2">Components and Their Roles:</h4>
      <ul class="list-disc pl-6 mb-4 space-y-3">
        <li>
          <b>Fluorescent Tube:</b> Contains mercury vapour and argon gas. When the arc strikes, mercury emits UV radiation (253.7 nm) which excites the phosphor coating, producing white/warm/cool visible light.
        </li>
        <li>
          <b>Choke (Ballast / Inductor):</b> A series inductor with an iron core. It serves two critical functions:
          <ul class="list-circle pl-4 mt-1 space-y-1">
            <li><i>Starting:</i> When the starter opens the circuit, the collapsing magnetic field in the choke induces a high EMF (?1000V) that strikes the arc in the tube.</li>
            <li><i>Running:</i> Acts as a current limiter (ballast), dropping voltage across itself to maintain the tube at its rated operating voltage (~110V).</li>
          </ul>
        </li>
        <li>
          <b>Starter:</b> A glow switch (bimetallic strip in argon-filled glass bulb) connected in parallel with the tube. When power is switched ON:
          <ol class="list-decimal pl-4 mt-1 space-y-1">
            <li>Full voltage appears across starter ? glow discharge heats the bimetallic strip ? contacts CLOSE.</li>
            <li>Current flows through choke and tube filaments ? preheats the filaments (electron emission).</li>
            <li>Starter cools ? bimetallic strip opens ? sudden interruption ? choke induces high kick voltage ? arc strikes in tube.</li>
            <li>Once tube lights, voltage across it (~110V) is too low to reignite the starter ? starter remains open.</li>
          </ol>
        </li>
      </ul>
      <h4 class="font-semibold mt-4 mb-2">Power Factor:</h4>
      <p class="mb-4">The choke (inductive) lowers the power factor of the circuit. A capacitor (5?10 ?F) is often connected in parallel with the supply to improve the power factor to ~0.85 lagging.</p>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Identify all components: tube, choke, starter, switch.</li>
        <li>Connect the switch to the Phase line (incoming supply).</li>
        <li>Connect the choke in series with the tube (Phase ? Switch ? Choke ? one filament of tube).</li>
        <li>Connect the starter in parallel with the tube (across the two tube terminals).</li>
        <li>Connect the Neutral directly to the other filament of the tube.</li>
        <li>Double-check all connections before applying power.</li>
        <li>Switch ON the supply. Observe the tube flickering briefly (~1?3 flickers) and then lighting steadily.</li>
        <li>Switch OFF and switch ON again to re-observe the starting sequence.</li>
        <li>Try removing the starter while the tube is running ? observe that the tube continues to glow (no starter needed during steady operation).</li>
      </ol>
      <h3>Result:</h3>
      <p class="text-neutral-300">The fluorescent lamp was successfully wired and operated. The starting sequence (starter closes ? filaments preheat ? starter opens ? choke kick ? arc strikes) was verified.</p>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>DiLouie, C. (2016). Lighting Controls Handbook. Fairmont Press.</li>
        <li>National Electrical Code (NEC) 2020. National Fire Protection Association.</li>
        <li>Bureau of Indian Standards, IS 418 ? Tungsten Filament Lamps / Fluorescent Lamps.</li>
        <li>Nagrath, I. J., &amp; Kothari, D. P. (2010). Basic Electrical Engineering (3rd ed.). Tata McGraw-Hill.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "hnFoQc772H0",
  },
  // -- Experiment 12: Staircase Wiring --
  {
    id: 12,
    title: "Staircase Wiring",
    aim: "To control a single lamp from two different locations using two-way (SPDT) switches and understand the staircase wiring principle.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
          <th class="border border-neutral-700 px-4 py-2">Component</th>
          <th class="border border-neutral-700 px-4 py-2">Specification</th>
          <th class="border border-neutral-700 px-4 py-2">Quantity</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-4 py-2">1</td><td class="border border-neutral-700 px-4 py-2">Two-Way (SPDT) Switch</td><td class="border border-neutral-700 px-4 py-2">230V, 5A</td><td class="border border-neutral-700 px-4 py-2">2</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">2</td><td class="border border-neutral-700 px-4 py-2">Incandescent Lamp with Holder</td><td class="border border-neutral-700 px-4 py-2">60W, 230V</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">3</td><td class="border border-neutral-700 px-4 py-2">Connecting Wires</td><td class="border border-neutral-700 px-4 py-2">1 mm? PVC</td><td class="border border-neutral-700 px-4 py-2">As required</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">4</td><td class="border border-neutral-700 px-4 py-2">AC Supply</td><td class="border border-neutral-700 px-4 py-2">230V, 50Hz</td><td class="border border-neutral-700 px-4 py-2">1</td></tr>
          <tr><td class="border border-neutral-700 px-4 py-2">5</td><td class="border border-neutral-700 px-4 py-2">Wireman's Tool Kit</td><td class="border border-neutral-700 px-4 py-2">?</td><td class="border border-neutral-700 px-4 py-2">1 set</td></tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>Theory ? Staircase Wiring (Two-Way Switch Control):</h3>
      <p class="mb-4">Staircase wiring allows a single lamp to be switched ON or OFF from either of two locations. This is essential for staircases, long corridors, and bedrooms ? where you need to control a light from both ends.</p>
      <h4 class="font-semibold mt-4 mb-2">Two-Way Switch (SPDT):</h4>
      <p class="mb-3">A two-way (SPDT ? Single Pole Double Throw) switch has three terminals: one Common (C) and two travellers (L1 and L2). The common is always connected, and it toggles between L1 and L2.</p>
      <h4 class="font-semibold mt-4 mb-2">Circuit Principle:</h4>
      <p class="mb-3">Phase ? Switch S1 (Common) ? either L1 or L2 traveller wires ? Switch S2 (L1 or L2) ? Common of S2 ? Lamp ? Neutral.</p>
      <p class="mb-3">The lamp glows when the two switches create a complete path (both on L1, or both on L2). The lamp is off when the switches are on opposite travellers (S1 on L1, S2 on L2, or vice versa).</p>
      <h4 class="font-semibold mt-4 mb-2">Truth Table:</h4>
      <table class="w-full border-collapse my-4 text-sm">
        <thead><tr>
          <th class="border border-neutral-700 px-3 py-2">S1 Position</th>
          <th class="border border-neutral-700 px-3 py-2">S2 Position</th>
          <th class="border border-neutral-700 px-3 py-2">Lamp State</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">L1</td><td class="border border-neutral-700 px-3 py-1 text-center">L1</td><td class="border border-neutral-700 px-3 py-1 text-center text-green-400">ON ?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">L1</td><td class="border border-neutral-700 px-3 py-1 text-center">L2</td><td class="border border-neutral-700 px-3 py-1 text-center text-red-400">OFF ?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">L2</td><td class="border border-neutral-700 px-3 py-1 text-center">L1</td><td class="border border-neutral-700 px-3 py-1 text-center text-red-400">OFF ?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">L2</td><td class="border border-neutral-700 px-3 py-1 text-center">L2</td><td class="border border-neutral-700 px-3 py-1 text-center text-green-400">ON ?</td></tr>
        </tbody>
      </table>
      <p class="mb-3 text-neutral-300 text-sm">This is equivalent to an XNOR logic gate: lamp = NOT (S1 XOR S2).</p>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Identify the three terminals on each SPDT switch: C (common), L1, L2.</li>
        <li>Connect Phase to the Common (C) of Switch S1.</li>
        <li>Connect the two traveller wires: S1 L1 ? S2 L1, and S1 L2 ? S2 L2.</li>
        <li>Connect the Common (C) of Switch S2 to one terminal of the lamp.</li>
        <li>Connect the other terminal of the lamp to the Neutral supply.</li>
        <li>Check all connections and switch ON the supply.</li>
        <li>Toggle S1 and S2 in all four combinations and record lamp state.</li>
        <li>Verify the truth table matches the theoretical predictions.</li>
      </ol>
      <h3>Verification of Truth Table:</h3>
      <table class="w-full border-collapse my-4 text-sm">
        <thead><tr>
          <th class="border border-neutral-700 px-3 py-2">S1 Position</th>
          <th class="border border-neutral-700 px-3 py-2">S2 Position</th>
          <th class="border border-neutral-700 px-3 py-2">Expected</th>
          <th class="border border-neutral-700 px-3 py-2">Observed</th>
        </tr></thead>
        <tbody>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">L1</td><td class="border border-neutral-700 px-3 py-1 text-center">L1</td><td class="border border-neutral-700 px-3 py-1 text-center">ON</td><td class="border border-neutral-700 px-3 py-1 text-center">?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">L1</td><td class="border border-neutral-700 px-3 py-1 text-center">L2</td><td class="border border-neutral-700 px-3 py-1 text-center">OFF</td><td class="border border-neutral-700 px-3 py-1 text-center">?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">L2</td><td class="border border-neutral-700 px-3 py-1 text-center">L1</td><td class="border border-neutral-700 px-3 py-1 text-center">OFF</td><td class="border border-neutral-700 px-3 py-1 text-center">?</td></tr>
          <tr><td class="border border-neutral-700 px-3 py-1 text-center">L2</td><td class="border border-neutral-700 px-3 py-1 text-center">L2</td><td class="border border-neutral-700 px-3 py-1 text-center">ON</td><td class="border border-neutral-700 px-3 py-1 text-center">?</td></tr>
        </tbody>
      </table>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Mullin, R. (2017). Electrical Wiring Residential (19th ed.). Cengage Learning.</li>
        <li>Bureau of Indian Standards, IS 732 ? Code of Practice for Electrical Wiring Installations.</li>
        <li>National Electrical Code (NEC) 2020. National Fire Protection Association.</li>
        <li>Nagrath, I. J., &amp; Kothari, D. P. (2010). Basic Electrical Engineering (3rd ed.). Tata McGraw-Hill.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "94YWeHFB9oN",
  },
]

export default function ExperimentPage() {
  const params = useParams()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"
  const [experiment, setExperiment] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("theory")
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saveToast, setSaveToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  // Gallery state
  const [galleryItems, setGalleryItems] = useState<{ _id: string; name: string; imageUrl: string }[]>([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryAddOpen, setGalleryAddOpen] = useState(false)
  const [galleryForm, setGalleryForm] = useState({ name: "", imageUrl: "" })
  const [gallerySaving, setGallerySaving] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)

  const handleGalleryImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setGalleryUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setGalleryForm((f) => ({ ...f, imageUrl: data.url }))
    } catch {
      // silently fail; user can paste URL manually
    } finally {
      setGalleryUploading(false)
      e.target.value = ""
    }
  }

  const openEdit = () => {
    setEditForm({ ...experiment })
    setEditOpen(true)
  }

  const handleSave = async () => {
    if (!editForm) return
    setSaving(true)
    try {
      const res = await fetch(`/api/experiments/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to save")
      }
      const updated = await res.json()
      setExperiment((prev: any) => ({ ...prev, ...updated }))
      setEditOpen(false)
      setSaveToast({ message: "Experiment updated successfully!", type: "success" })
      setTimeout(() => setSaveToast(null), 3500)
    } catch (e: any) {
      setSaveToast({ message: e.message || "Failed to save experiment.", type: "error" })
      setTimeout(() => setSaveToast(null), 4000)
    } finally {
      setSaving(false)
    }
  }

  const handleAddGalleryItem = async () => {
    if (!galleryForm.name.trim() || !galleryForm.imageUrl.trim()) return
    setGallerySaving(true)
    try {
      const id = Number.parseInt(params.id as string)
      const res = await fetch(`/api/experiments/${id}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryForm),
      })
      if (!res.ok) throw new Error("Failed to add item")
      const newItem = await res.json()
      setGalleryItems((prev) => [...prev, newItem])
      setGalleryForm({ name: "", imageUrl: "" })
      setGalleryAddOpen(false)
    } catch {}
    finally { setGallerySaving(false) }
  }

  const handleDeleteGalleryItem = async (itemId: string) => {
    const id = Number.parseInt(params.id as string)
    try {
      const res = await fetch(`/api/experiments/${id}/gallery/${itemId}`, { method: "DELETE" })
      if (res.ok) setGalleryItems((prev) => prev.filter((g) => g._id !== itemId))
    } catch {}
  }

  useEffect(() => {
    const id = Number.parseInt(params.id as string)

    // Load hardcoded data immediately as baseline
    const hardcodedExp = experiments.find((e) => e.id === id)
    if (!hardcodedExp) {
      notFound()
      return
    }

    setExperiment(hardcodedExp as any)

    // Check for hash in URL to set active tab
    const hash = window.location.hash
    if (hash) {
      const tabName = hash.replace("#", "")
      if (["aim", "apparatus", "theory", "procedure", "interactive", "simulation", "customize", "quiz", "gallery", "video", "references"].includes(tabName)) {
        setActiveTab(tabName)
      }
    }

    // Fetch from API and merge (API data overrides hardcoded for any existing field)
    fetch(`/api/experiments/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((apiData) => {
        if (apiData && !apiData.error) {
          setExperiment((prev: any) => ({ ...prev, ...apiData }))
        }
      })
      .catch(() => {})

    // Fetch gallery items
    setGalleryLoading(true)
    fetch(`/api/experiments/${id}/gallery`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setGalleryItems(Array.isArray(data) ? data : []))
      .catch(() => setGalleryItems([]))
      .finally(() => setGalleryLoading(false))
  }, [params.id])

  if (!experiment) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dynamic Sidebar */}

      <NavDock />

      <DigitalClock />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 pt-28 sm:pt-32 min-w-0">
        <motion.div className="min-w-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/experiments" className="inline-flex items-center text-sm sm:text-base text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Experiments
          </Link>

          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-900/30 text-blue-400 font-bold text-sm shrink-0">
                    {experiment.id}
                  </div>
                  <div className="px-2 py-1 rounded-md bg-blue-900/20 text-blue-400 text-xs font-medium">
                    {experiment.id <= 2 ? "Circuit Analysis" :
                     experiment.id <= 6 ? "Analog / Digital Electronics" :
                     experiment.id <= 8 ? "Digital Electronics" :
                     experiment.id === 9 ? "Electrical Instruments" :
                     "Electrical Wiring"}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">{experiment.title}</h1>
                  {isAdmin && (
                    <button
                      onClick={openEdit}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:border-blue-500/60 hover:text-blue-300 hover:bg-blue-900/10 transition-all duration-200 shrink-0"
                      title="Edit Experiment (Admin)"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Experiment
                    </button>
                  )}
                </div>
                <p className="text-neutral-400 mt-2 max-w-2xl text-sm sm:text-base">{experiment.aim}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center h-16 w-16 rounded-lg bg-neutral-900 border border-neutral-800">
                  {experiment.id <= 2 ? (
                    <Zap className="h-6 w-6 text-yellow-400 mb-1" />
                  ) : experiment.id <= 6 ? (
                    <Activity className="h-6 w-6 text-cyan-400 mb-1" />
                  ) : experiment.id <= 8 ? (
                    <Cpu className="h-6 w-6 text-green-400 mb-1" />
                  ) : experiment.id === 9 ? (
                    <Zap className="h-6 w-6 text-orange-400 mb-1" />
                  ) : (
                    <Lightbulb className="h-6 w-6 text-yellow-400 mb-1" />
                  )}
                  <span className="text-xs text-neutral-400">EXP-{experiment.id}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            className="w-full min-w-0"
            onValueChange={(value) => {
              setActiveTab(value)
              window.location.hash = value
            }}
          >
            <TabsList className="experiment-tabs flex w-full min-w-0 gap-1 overflow-x-auto bg-neutral-900/80 border border-neutral-800 rounded-xl p-1 scrollbar-hide">
              <TabsTrigger value="aim" className="shrink-0 data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Aim
              </TabsTrigger>
              <TabsTrigger value="apparatus" className="shrink-0 data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Apparatus
              </TabsTrigger>
              <TabsTrigger value="theory" className="shrink-0 data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Theory
              </TabsTrigger>
              <TabsTrigger value="procedure" className="shrink-0 data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Procedure
              </TabsTrigger>
              <TabsTrigger value="interactive" className="shrink-0 data-[state=active]:bg-green-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Interactive
              </TabsTrigger>
              <TabsTrigger value="simulation" className="shrink-0 data-[state=active]:bg-purple-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Simulation
              </TabsTrigger>
              <TabsTrigger value="customize" className="shrink-0 data-[state=active]:bg-cyan-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Customize
              </TabsTrigger>
              <TabsTrigger value="quiz" className="shrink-0 data-[state=active]:bg-yellow-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Quiz
              </TabsTrigger>
              <TabsTrigger value="gallery" className="shrink-0 data-[state=active]:bg-pink-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Gallery
              </TabsTrigger>
              <TabsTrigger value="video" className="shrink-0 data-[state=active]:bg-red-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                Video
              </TabsTrigger>
              <TabsTrigger value="references" className="shrink-0 data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg px-3 py-2">
                References
              </TabsTrigger>
            </TabsList>

            {/* Aim Tab */}
            <TabsContent value="aim" id="aim" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6 text-neutral-300 overflow-x-auto"
              >
                <div className="flex items-center space-x-3 mb-4">
                  {experiment.id <= 2 ? (
                    <Zap className="h-6 w-6 text-yellow-400" />
                  ) : experiment.id <= 5 ? (
                    <Lightbulb className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <Cpu className="h-6 w-6 text-blue-400" />
                  )}
                  <h3 className="text-xl font-bold text-white">Aim</h3>
                </div>
                <p className="text-lg">{experiment.aim}</p>
              </motion.div>
            </TabsContent>

            {/* Apparatus Tab */}
            <TabsContent value="apparatus" id="apparatus" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6 text-neutral-300 overflow-x-auto"
              >
                <div className="experiment-content" dangerouslySetInnerHTML={{ __html: experiment.apparatus }} />
              </motion.div>
            </TabsContent>

            {/* Theory Tab */}
            <TabsContent value="theory" id="theory" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6 text-neutral-300 overflow-x-auto"
              >
                <div className="experiment-content" dangerouslySetInnerHTML={{ __html: experiment.theory }} />
                
                {/* Circuit Animation Background */}
                <div className="relative mt-8 h-48 sm:h-64 rounded-lg overflow-hidden border border-neutral-800">
                  <CircuitAnimation />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="text-center max-w-md px-4">
                      <h4 className="text-xl font-bold text-white mb-2">{experiment.title}</h4>
                      <p className="text-neutral-300">
                        Understanding the theoretical principles is essential before conducting the practical experiment.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Procedure Tab */}
            <TabsContent value="procedure" id="procedure" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6 text-neutral-300 overflow-x-auto"
              >
                <div className="experiment-content" dangerouslySetInnerHTML={{ __html: experiment.procedure }} />
              </motion.div>
            </TabsContent>

            {/* Interactive Tab */}
            <TabsContent value="interactive" id="interactive" className="mt-4 overflow-x-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-full"
              >
                {experiment.interactiveNotes && (
                  <div className="mb-4 rounded-xl border border-green-800/40 bg-green-900/10 px-4 py-3 text-sm text-green-200 whitespace-pre-wrap">
                    {experiment.interactiveNotes}
                  </div>
                )}
                {experiment.id === 1 && <KVLExperiment />}
                {experiment.id === 2 && <TheveninExperiment />}
                {experiment.id === 3 && <PNJunctionExperiment />}
                {experiment.id === 4 && <FullWaveRectifierExperiment />}
                {experiment.id === 5 && <ClipperExperiment />}
                {experiment.id === 6 && <OpAmpExperiment />}
                {experiment.id === 7 && <LogicGatesVirtualLab />}
                {experiment.id === 8 && <AdderVirtualLab />}
                {experiment.id === 9 && <EnergyMeterExperiment />}
                {experiment.id === 10 && <HouseWiringExperiment />}
                {experiment.id === 11 && <FluorescentLampExperiment />}
                {experiment.id === 12 && <StaircaseWiringExperiment />}
              </motion.div>
            </TabsContent>

            {/* Simulation Tab */}
            <TabsContent value="simulation" id="simulation" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-full"
              >
                <div className="mb-6 rounded-xl border border-purple-800/40 bg-purple-900/10 px-4 py-3 text-sm text-purple-200 whitespace-pre-wrap">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="font-semibold">Immersive 3D Virtual Simulation</span>
                  </div>
                  <p className="mt-1 text-purple-300/80">
                    Explore the {experiment.title} experiment in 3D! Use your mouse to rotate, zoom, and interact with the circuit.
                  </p>
                </div>
                {experiment.id === 1 && <KVL3DExperiment />}
                {experiment.id === 2 && <Thevenin3DExperiment />}
                {experiment.id === 3 && <Diode3DExperiment />}
                {experiment.id === 4 && <Rectifier3DExperiment />}
                {experiment.id === 5 && <Clipper3DExperiment />}
                {experiment.id === 6 && <OpAmp3DExperiment />}
                {experiment.id === 7 && <LogicGates3DExperiment />}
                {experiment.id === 8 && <Adder3DExperiment />}
                {experiment.id === 9 && <EnergyMeter3DExperiment />}
                {experiment.id === 10 && <HouseWiring3DExperiment />}
                {experiment.id === 11 && <Fluorescent3DExperiment />}
                {experiment.id === 12 && <Staircase3DExperiment />}
              </motion.div>
            </TabsContent>

            {/* Customize Tab */}
            <TabsContent value="customize" id="customize" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-full"
              >
                <div className="mb-6 rounded-xl border border-cyan-800/40 bg-cyan-900/10 px-4 py-3 text-sm text-cyan-200 whitespace-pre-wrap">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="font-semibold">Customizable Circuit Builder</span>
                  </div>
                  <p className="mt-1 text-cyan-300/80">
                    Build your own circuit for this experiment! Drag components, connect them, and experiment freely!
                  </p>
                </div>
                <CustomizableCircuit />
              </motion.div>
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz" id="quiz" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {experiment.id === 1 && <KVLQuiz />}
                {experiment.id === 2 && <TheveninQuiz />}
                {experiment.id === 3 && <PNJunctionQuiz />}
                {experiment.id === 4 && <FullWaveRectifierQuiz />}
                {experiment.id === 5 && <ClipperQuiz />}
                {experiment.id === 6 && <OpAmpQuiz />}
                {experiment.id === 7 && <LogicGatesQuiz />}
                {experiment.id === 8 && <AdderQuiz />}
                {experiment.id === 9 && <EnergyMeterQuiz />}
                {experiment.id === 10 && <HouseWiringQuiz />}
                {experiment.id === 11 && <FluorescentLampQuiz />}
                {experiment.id === 12 && <StaircaseWiringQuiz />}
              </motion.div>
            </TabsContent>

            {/* Video Tab */}
            <TabsContent value="video" id="video" className="mt-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-red-400" /> Video Demonstration
                      </h3>
                      <p className="text-sm text-neutral-400 mt-1">Watch a complete demonstration of this experiment</p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={openEdit}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 rounded-lg transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit URL
                      </button>
                    )}
                  </div>

                  {(() => {
                    const fallbackMap: Record<number, string> = {
                      1: "https://www.youtube.com/embed/jdgr56G6bIs",
                      2: "https://www.youtube.com/embed/QJQS_5wYDGw",
                      3: "https://www.youtube.com/embed/3RL0dDghkYw",
                      4: "https://www.youtube.com/embed/sI_7GkbcKBo",
                      5: "https://www.youtube.com/embed/nkxgGg3PCGE",
                      6: "https://www.youtube.com/embed/kqeqTJnEp1g",
                      7: "https://www.youtube.com/embed/9EL2XTCFqaE",
                      8: "https://www.youtube.com/embed/W7B0DIsBz_g",
                      9: "https://www.youtube.com/embed/V4P9tHM5XJ4",
                      10: "https://www.youtube.com/embed/3RL0dDghkYw",
                      11: "https://www.youtube.com/embed/nkxgGg3PCGE",
                      12: "https://www.youtube.com/embed/0MqYkiKFxJA",
                    }
                    // videoUrl from MongoDB takes priority; fall back to hardcoded map
                    let src = experiment.videoUrl || fallbackMap[experiment.id] || ""
                    // Convert regular YouTube URL to embed URL if needed
                    if (src.includes("youtube.com/watch?v=")) {
                      src = src.replace("youtube.com/watch?v=", "youtube.com/embed/").replace(/&.*$/, "")
                    } else if (src.includes("youtu.be/")) {
                      src = src.replace("youtu.be/", "youtube.com/embed/")
                    }
                    if (src) {
                      return (
                        <div className="aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800">
                          <iframe
                            className="w-full h-full"
                            src={src}
                            title={`${experiment.title} - Video Demonstration`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )
                    }
                    return (
                      <div className="aspect-video bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-12 w-12 text-neutral-600 mx-auto mb-3" />
                          <p className="text-neutral-400 text-sm">No video available yet</p>
                          {isAdmin && <p className="text-neutral-500 text-xs mt-1">Add a YouTube URL via the Edit button above</p>}
                        </div>
                      </div>
                    )
                  })()}

                  <div className="mt-6 p-4 bg-neutral-800/60 rounded-lg border border-neutral-700">
                    <h4 className="text-white font-semibold mb-2 text-sm">Tips for watching:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-sm">
                      <li>Watch the full video before attempting the experiment</li>
                      <li>Pay attention to safety precautions shown in the video</li>
                      <li>Pause and rewatch specific sections as needed</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" id="gallery" className="mt-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-pink-400" /> Component Gallery
                      </h3>
                      <p className="text-sm text-neutral-400 mt-1">Components and equipment used in this experiment</p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setGalleryAddOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 rounded-lg transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Component
                      </button>
                    )}
                  </div>

                  {/* Add component form (admin only) */}
                  {isAdmin && galleryAddOpen && (
                    <div className="mb-6 p-4 bg-neutral-800 border border-neutral-700 rounded-xl space-y-3">
                      <h4 className="text-white font-medium text-sm">Add New Component</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Component Name</label>
                          <input
                            value={galleryForm.name}
                            onChange={(e) => setGalleryForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Digital Multimeter"
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1">Image URL</label>
                          <div className="flex gap-2">
                            <input
                              value={galleryForm.imageUrl}
                              onChange={(e) => setGalleryForm((f) => ({ ...f, imageUrl: e.target.value }))}
                              placeholder="Paste URL or upload…"
                              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                            />
                            <label className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-xs cursor-pointer transition-colors border border-neutral-600 shrink-0">
                              {galleryUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                              <input type="file" accept="image/*" className="hidden" onChange={handleGalleryImageUpload} disabled={galleryUploading} />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddGalleryItem}
                          disabled={gallerySaving || !galleryForm.name.trim() || !galleryForm.imageUrl.trim()}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                          {gallerySaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                          Save
                        </button>
                        <button
                          onClick={() => { setGalleryAddOpen(false); setGalleryForm({ name: "", imageUrl: "" }) }}
                          className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Gallery grid */}
                  {galleryLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 text-neutral-600 animate-spin" />
                    </div>
                  ) : galleryItems.length === 0 ? (
                    <div className="text-center py-16 text-neutral-500">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No components added yet.</p>
                      {isAdmin && <p className="text-xs mt-1">Click "Add Component" to upload component images.</p>}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryItems.map((item) => (
                        <div key={item._id} className="group relative bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-neutral-600 transition-colors">
                          <div className="aspect-square relative bg-neutral-900 flex items-center justify-center overflow-hidden">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-12 w-12 text-neutral-700" />
                            )}
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteGalleryItem(item._id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-white" />
                              </button>
                            )}
                          </div>
                          <div className="px-3 py-2">
                            <p className="text-sm text-white font-medium truncate">{item.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>


            {/* References Tab */}
            <TabsContent value="references" id="references" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6 text-neutral-300 overflow-x-auto"
              >
                <div dangerouslySetInnerHTML={{ __html: experiment.references }} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* -- Admin Edit Panel -- */}
      {editOpen && editForm && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !saving && setEditOpen(false)}
          />
          {/* Slide-over panel */}
          <div className="relative ml-auto w-full max-w-2xl h-full bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/95 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Pencil className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Edit Experiment</h2>
                  <p className="text-xs text-neutral-500">EXP-{editForm.id} ? Admin only</p>
                </div>
              </div>
              <button
                onClick={() => !saving && setEditOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800"
                disabled={saving}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Basic fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 placeholder:text-neutral-600"
                    placeholder="Experiment title"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Description</label>
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, description: e.target.value }))}
                    rows={2}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 resize-y placeholder:text-neutral-600"
                    placeholder="Short description"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={editForm.category || ""}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60"
                    placeholder="e.g. Circuit Analysis"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Difficulty</label>
                  <select
                    value={editForm.difficulty || "Intermediate"}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, difficulty: e.target.value }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={editForm.duration || ""}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, duration: e.target.value }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60"
                    placeholder="e.g. 60 min"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Tinkercad Embed ID</label>
                  <input
                    type="text"
                    value={editForm.embedId || ""}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, embedId: e.target.value }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 font-mono"
                    placeholder="e.g. hNWAhAfShmV"
                  />
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5 text-red-400" /> YouTube Video URL
                </label>
                <input
                  type="url"
                  value={editForm.videoUrl || ""}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, videoUrl: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                />
                <p className="mt-1 text-xs text-neutral-500">Paste any YouTube URL ? it will be auto-converted to embed format</p>
              </div>

              {/* Aim */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Aim</label>
                <textarea
                  value={editForm.aim || ""}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, aim: e.target.value }))}
                  rows={3}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 resize-y placeholder:text-neutral-600"
                  placeholder="Aim of the experiment"
                />
              </div>

              {/* Interactive Notes */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Interactive Notes</label>
                <textarea
                  value={editForm.interactiveNotes || ""}
                  onChange={(e) => setEditForm((f: any) => ({ ...f, interactiveNotes: e.target.value }))}
                  rows={3}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 resize-y placeholder:text-neutral-600"
                  placeholder="Notes shown above the interactive component (plain text)"
                />
              </div>

              {/* HTML fields */}
              {[
                { key: "apparatus", label: "Apparatus (HTML)", rows: 5 },
                { key: "theory", label: "Theory (HTML)", rows: 8 },
                { key: "procedure", label: "Procedure (HTML)", rows: 8 },
                { key: "observations", label: "Observations (HTML)", rows: 5 },
                { key: "result", label: "Result (HTML)", rows: 4 },
                { key: "references", label: "References (HTML)", rows: 5 },
              ].map(({ key, label, rows }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">{label}</label>
                  <textarea
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm((f: any) => ({ ...f, [key]: e.target.value }))}
                    rows={rows}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/60 resize-y font-mono text-xs placeholder:text-neutral-600"
                    placeholder={`HTML content for ${key}`}
                  />
                </div>
              ))}
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/95 sticky bottom-0 flex items-center justify-between gap-3">
              <p className="text-xs text-neutral-500">Changes are saved to the database and take effect immediately.</p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving?</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -- Toast notification -- */}
      {saveToast && (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium transition-all duration-300 ${
          saveToast.type === "success"
            ? "bg-green-900/90 border-green-700/60 text-green-200"
            : "bg-red-900/90 border-red-700/60 text-red-200"
        }`}>
          {saveToast.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          )}
          {saveToast.message}
        </div>
      )}
    </div>
  )
}


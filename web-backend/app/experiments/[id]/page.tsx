"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Home, BookOpen, Settings, LogIn, FileQuestion, Users, Info, Lightbulb, Zap, Cpu, Video, Image as ImageIcon, Library, User } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DigitalClock } from "@/components/digital-clock"
import { DynamicSidebar } from "@/components/dynamic-sidebar"
import { TinkercadEmbed } from "@/components/tinkercad-embed"
import { FloatingDock } from "@/components/ui/floating-dock"
import { CircuitAnimation } from "@/components/ui/circuit-animation"
import { Circuit3DViewer } from "@/components/circuit-3d-viewer"
import { InteractiveRobotSpline } from "@/components/blocks/interactive-3d-robot"
import { 
  KVLExperiment, 
  TheveninExperiment, 
  HouseWiringExperiment, 
  FluorescentLampExperiment, 
  StaircaseWiringExperiment, 
  FullWaveRectifierExperiment 
} from "@/components/animated-experiment"
import { 
  KVLQuiz, 
  TheveninQuiz, 
  HouseWiringQuiz, 
  FluorescentLampQuiz, 
  StaircaseWiringQuiz, 
  FullWaveRectifierQuiz 
} from "@/components/experiment-quiz"
import { LogicGatesVirtualLab, AdderVirtualLab } from "@/components/digital-experiments"

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
            <td class="border border-neutral-700 px-4 py-2">330Ω, 220Ω, 1kΩ</td>
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
      <p class="font-bold mb-4">∑V = 0</p>
      
      <p class="mb-4">Where:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>∑V represents the sum of all voltage drops and rises around a closed loop</li>
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
            <td class="border border-neutral-700 px-4 py-2">330Ω, 1kΩ</td>
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
        <li>R<sub>TH</sub> = 490Ω</li>
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
          <li>Resistors: Three 330Ω resistors in the configuration shown</li>
          <li>Load: 1kΩ resistor</li>
        </ul>
        
        <p class="mb-2">Thevenin Equivalent Circuit:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>V<sub>TH</sub> = 11.25V</li>
          <li>R<sub>TH</sub> = 490Ω</li>
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
  {
    id: 3,
    title: "House Wiring",
    aim: "To implement residential house wiring using switches, lamps, and energy meter",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">Sl.No.</th>
            <th class="border border-neutral-700 px-4 py-2">Apparatus</th>
            <th class="border border-neutral-700 px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">1</td>
            <td class="border border-neutral-700 px-4 py-2">1 phase energy meter</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">2</td>
            <td class="border border-neutral-700 px-4 py-2">Main Box</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">3</td>
            <td class="border border-neutral-700 px-4 py-2">5 A Switch</td>
            <td class="border border-neutral-700 px-4 py-2">3</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">4</td>
            <td class="border border-neutral-700 px-4 py-2">Indicator</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">5</td>
            <td class="border border-neutral-700 px-4 py-2">Incandescent lamp with holder</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">6</td>
            <td class="border border-neutral-700 px-4 py-2">Fan</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">7</td>
            <td class="border border-neutral-700 px-4 py-2">Three pin plug</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
        </tbody>
      </table>
    `,
    theory: `
      <h3>House Wiring Theory:</h3>
      <p class="mb-4">Residential electrical wiring involves the distribution of electrical power throughout a home. It includes circuits for lighting, outlets, and appliances.</p>
      
      <p class="mb-4">Key components include:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Service entrance: Where power enters the building</li>
        <li>Main distribution panel: Contains circuit breakers or fuses</li>
        <li>Branch circuits: Individual circuits serving different areas or appliances</li>
        <li>Grounding system: Safety system to prevent electrical shocks</li>
      </ul>
      
      <p class="mb-4">Understanding proper wiring techniques and safety standards is essential for safe and reliable electrical installations.</p>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Connections are given as per circuit diagram.</li>
        <li>Switch is put to ON state one by one and energy meter readings are noted down.</li>
      </ol>
      
      <h3>Circuit Diagram:</h3>
      <div class="my-4 p-4 bg-neutral-800 rounded-lg">
        <p class="mb-2">The circuit includes:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>AC supply (Phase and Neutral)</li>
          <li>Energy meter</li>
          <li>Main box with fuse</li>
          <li>Switches for controlling lamps and fan</li>
          <li>Ground connection</li>
        </ul>
      </div>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Mullin, R. (2017). Electrical Wiring Residential (19th ed.). Cengage Learning.</li>
        <li>National Electrical Code (NEC) (2020). National Fire Protection Association.</li>
        <li>Richter, H. P., & Schwan, W. C. (2016). Practical Electrical Wiring: Residential, Farm, Commercial, and Industrial. Park Publishing.</li>
        <li>Black & Decker (2017). The Complete Guide to Wiring (7th ed.). Cool Springs Press.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "2rTQ63Z8SdD", // Tinkercad embed ID
  },
  {
    id: 4,
    title: "Fluorescent Lamp Wiring",
    aim: "To make connections of a fluorescent lamp wiring and to study the accessories of the same.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">S.No</th>
            <th class="border border-neutral-700 px-4 py-2">Components</th>
            <th class="border border-neutral-700 px-4 py-2">Range/Type</th>
            <th class="border border-neutral-700 px-4 py-2">Quality</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">1</td>
            <td class="border border-neutral-700 px-4 py-2">Fluorescent Lamp fixture</td>
            <td class="border border-neutral-700 px-4 py-2">4 ft</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">2</td>
            <td class="border border-neutral-700 px-4 py-2">Fluorescent lamp</td>
            <td class="border border-neutral-700 px-4 py-2">40W</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">3</td>
            <td class="border border-neutral-700 px-4 py-2">Choke</td>
            <td class="border border-neutral-700 px-4 py-2">40W, 230V</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">4</td>
            <td class="border border-neutral-700 px-4 py-2">Starter</td>
            <td class="border border-neutral-700 px-4 py-2">-</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">5</td>
            <td class="border border-neutral-700 px-4 py-2">Connecting wires</td>
            <td class="border border-neutral-700 px-4 py-2">-</td>
            <td class="border border-neutral-700 px-4 py-2">As required</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Tools Required:</h3>
      <p>Wire man's tool Kit - 1 No</p>
    `,
    theory: `
      <h3>Theory:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>The electrode of the starter which is enclosed in a gas bulb filled with argon gas, cause discharge in the argon gas with consequent heating.</li>
        <li>Due to heating, the bimetallic strip bends and causes in the starter to close. After this, the choke, the filaments (tube ends) to tube and starter becomes connected in series.</li>
        <li>When the current flows through the tube end filaments the heat is produced. During the process the discharge in the starter tube disappears and the contacts in the starter move apart.</li>
        <li>When sudden break in the circuit occur due to moving apart of starter terminals, this causes a high value of e.m.f to be induced in the choke.</li>
        <li>According to Lenz's law, the direction of induced e.m.f in the choke will try to oppose the fall of current in the circuit.</li>
        <li>The voltage thus acting across the tube ends will be high enough to cause a discharge to occur in the gas inside the tube. Thus the tube starts giving light.</li>
        <li>The fluorescent lamp is a low pressure mercury lamp and is a long evacuated tube. It contains a small amount of mercury and argon gas at 2.5 mm pressure. At the time of switching in the tube, mercury is in the form of small drops. Therefore, to start the tube, filling up of argon gas is necessary. So, in the beginning, argon gas starts burning at the ends of the tube; the mercury is heated and controls the current and the tube starts giving light. At each end of the tube, there is a tungsten electrode which is coated with fast electron emitting material. Inside of the tube is coated with phosphor according to the type of light.</li>
        <li>A starter helps to start the start the tube and break the circuit.</li>
        <li>The choke coil is also called blast. It has a laminated core over which enameled wire is wound. The function of the choke is to increase the voltage to almost 1000V at the time of switching on the tube and when the tube starts working, it reduces the voltage across the tube and keeps the current constant.</li>
      </ol>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Give the connections as per the circuit diagram.</li>
        <li>Fix the tube holder and the choke in the tube.</li>
        <li>The phase wire is connected to the choke and neutral directly to the tube.</li>
        <li>Connect the starter in series with the tube.</li>
        <li>Switch on the supply and check the fluorescent lamp lighting.</li>
      </ol>
      
      <h3>Circuit Diagram:</h3>
      <div class="my-4 p-4 bg-neutral-800 rounded-lg">
        <p class="mb-2">The circuit includes:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>AC Supply (230V, 50Hz)</li>
          <li>Switch</li>
          <li>Choke (40W, 230V)</li>
          <li>Starter</li>
          <li>Fluorescent lamp (40W) with filaments at both ends</li>
        </ul>
      </div>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>DiLouie, C. (2016). Lighting Controls Handbook. Fairmont Press.</li>
        <li>Khanna, V. K. (2014). Fundamentals of Solid-State Lighting: LEDs, OLEDs, and Their Applications in Illumination and Displays. CRC Press.</li>
        <li>National Electrical Code (NEC) (2020). National Fire Protection Association.</li>
        <li>Grondzik, W. T., & Kwok, A. G. (2019). Mechanical and Electrical Equipment for Buildings (13th ed.). Wiley.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "hnFoQc772H0", // Tinkercad embed ID
  },
  {
    id: 5,
    title: "Staircase Wiring",
    aim: "To control a single lamp from two different places.",
    apparatus: `
      <h3>Apparatus Required:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">S.No</th>
            <th class="border border-neutral-700 px-4 py-2">Components</th>
            <th class="border border-neutral-700 px-4 py-2">Quan/Range</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">1</td>
            <td class="border border-neutral-700 px-4 py-2">Incandescent Lamp</td>
            <td class="border border-neutral-700 px-4 py-2">1 (230V, 40W)</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">2</td>
            <td class="border border-neutral-700 px-4 py-2">Lamp holder</td>
            <td class="border border-neutral-700 px-4 py-2">1</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">3</td>
            <td class="border border-neutral-700 px-4 py-2">Two way switches</td>
            <td class="border border-neutral-700 px-4 py-2">2 (230V, 5A)</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">4</td>
            <td class="border border-neutral-700 px-4 py-2">Connecting Wires</td>
            <td class="border border-neutral-700 px-4 py-2">As required</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Tools Required:</h3>
      <p>Wire man's tool Kit - 1 No.</p>
    `,
    theory: `
      <h3>Theory:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>A two way switch is installed near the first step of the stairs. The other two way switch is installed at the upper part where the stair ends.</li>
        <li>The light point is provided between first and last stair at an adequate location and height if the light is switched on by the lower switch. It can be switched off by the switch at the top or vice versa.</li>
        <li>The circuit can be used at the places like bed room where the person may not have to travel for switching off the light to the place from where the light is switched on.</li>
        <li>Two numbers of Two-way switches are used for the purpose. The supply is given to the switch at the short circuited terminals.</li>
        <li>The connection to the light point is taken from the similar short circuited terminal of the second switch. Other two independent terminals of each circuit are connected through cables.</li>
      </ol>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Give the connections as per the circuit diagram.</li>
        <li>Verify the connections.</li>
        <li>Switch on the supply.</li>
        <li>Verify the conditions.</li>
      </ol>
      
      <h3>Tabulation:</h3>
      <table class="w-full border-collapse my-4">
        <thead>
          <tr>
            <th class="border border-neutral-700 px-4 py-2" colspan="2">Position of switches</th>
            <th class="border border-neutral-700 px-4 py-2" rowspan="2">Condition of lamp</th>
          </tr>
          <tr>
            <th class="border border-neutral-700 px-4 py-2">S1</th>
            <th class="border border-neutral-700 px-4 py-2">S2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">on</td>
            <td class="border border-neutral-700 px-4 py-2">off</td>
            <td class="border border-neutral-700 px-4 py-2">glowing</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">off</td>
            <td class="border border-neutral-700 px-4 py-2">on</td>
            <td class="border border-neutral-700 px-4 py-2">glowing</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">off</td>
            <td class="border border-neutral-700 px-4 py-2">off</td>
            <td class="border border-neutral-700 px-4 py-2">not glowing</td>
          </tr>
          <tr>
            <td class="border border-neutral-700 px-4 py-2">on</td>
            <td class="border border-neutral-700 px-4 py-2">on</td>
            <td class="border border-neutral-700 px-4 py-2">not glowing</td>
          </tr>
        </tbody>
      </table>
    `,
    references: `
      <h3>References:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Mullin, R. (2017). Electrical Wiring Residential (19th ed.). Cengage Learning.</li>
        <li>National Electrical Code (NEC) (2020). National Fire Protection Association.</li>
        <li>Richter, H. P., & Schwan, W. C. (2016). Practical Electrical Wiring: Residential, Farm, Commercial, and Industrial. Park Publishing.</li>
        <li>Black & Decker (2017). The Complete Guide to Wiring (7th ed.). Cool Springs Press.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "94YWeHFB9oN", // Tinkercad embed ID
  },
  {
    id: 6,
    title: "Full Wave Rectifier",
    aim: "To construct a single phase full-wave bridge rectifier using diode and to draw its performance characteristics.",
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
            <td class="border border-neutral-700 px-4 py-2">1kΩ</td>
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
            <td class="border border-neutral-700 px-4 py-2">100μF</td>
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
          <li>Load resistor (1kΩ)</li>
          <li>CRO for measurement</li>
        </ul>
        
        <p class="mb-2">With Filter:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>Same as above, with a 100μF capacitor connected in parallel with the load resistor</li>
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
        <li>Boylestad, R. L., & Nashelsky, L. (2015). Electronic Devices and Circuit Theory (11th ed.). Pearson.</li>
        <li>Malvino, A. P., & Bates, D. J. (2016). Electronic Principles (8th ed.). McGraw-Hill Education.</li>
        <li>Floyd, T. L. (2018). Electronic Devices (10th ed.). Pearson.</li>
        <li>Sedra, A. S., & Smith, K. C. (2014). Microelectronic Circuits (7th ed.). Oxford University Press.</li>
      </ol>
    `,
    image: "/placeholder.svg?height=400&width=600",
    embedId: "jbRQbeSnAzj", // Tinkercad embed ID
  },
  // ── Experiment 7: Basic Logic Gates ──
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
        <li><b>AND Gate (IC 7408):</b> Output is HIGH only when ALL inputs are HIGH. Y = A·B</li>
        <li><b>OR Gate (IC 7432):</b> Output is HIGH when ANY input is HIGH. Y = A+B</li>
        <li><b>NOT Gate (IC 7404):</b> Inverts the single input. Y = Ā</li>
        <li><b>NAND Gate (IC 7400):</b> Complement of AND. Output LOW only when all inputs HIGH. Y = (A·B)'</li>
        <li><b>NOR Gate (IC 7402):</b> Complement of OR. Output HIGH only when all inputs LOW. Y = (A+B)'</li>
        <li><b>XOR Gate (IC 7486):</b> Output HIGH when inputs are different. Y = A⊕B</li>
        <li><b>XNOR Gate:</b> Complement of XOR. Output HIGH when inputs are same. Y = (A⊕B)'</li>
      </ul>
      <p class="mb-4">NAND and NOR gates are called <b>universal gates</b> because any Boolean function can be implemented using only NAND or only NOR gates.</p>
    `,
    procedure: `
      <h3>Procedure:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect the VCC (Pin 14) of the IC to +5V supply and GND (Pin 7) to ground.</li>
        <li>Apply different combinations of logic inputs (0V = LOW, 5V = HIGH) to the input pins.</li>
        <li>Connect an LED with a 330Ω resistor to the output pin to observe the output.</li>
        <li>Record the output for all possible input combinations.</li>
        <li>Verify that the recorded truth table matches the theoretical truth table for each gate.</li>
        <li>Repeat for all seven logic gates.</li>
      </ol>
      <h3>Observations (AND Gate - IC 7408):</h3>
      <table class="w-full border-collapse my-4">
        <thead><tr>
          <th class="border border-neutral-700 px-4 py-2">A</th>
          <th class="border border-neutral-700 px-4 py-2">B</th>
          <th class="border border-neutral-700 px-4 py-2">Y = A·B</th>
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
  // ── Experiment 8: Half Adder & Full Adder ──
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
      <p class="mb-2">Boolean Expressions: <b>S = A ⊕ B</b>, &nbsp;&nbsp;<b>C = A · B</b></p>
      <p class="mb-4">Implementation: 1 XOR gate + 1 AND gate. Limitation: Cannot handle carry from a previous stage.</p>
      <h4 class="font-semibold mt-3 mb-2">Full Adder:</h4>
      <p class="mb-3">A Full Adder adds three bits: A, B, and a Carry-In (Cin) from the previous stage, producing Sum and Carry-Out.</p>
      <p class="mb-2">Boolean Expressions: <b>S = A ⊕ B ⊕ Cin</b>, &nbsp;&nbsp;<b>Cout = A·B + B·Cin + A·Cin</b></p>
      <p class="mb-4">Implementation: 2 XOR gates + 2 AND gates + 1 OR gate. Full adders can be chained to add multi-bit binary numbers.</p>
    `,
    procedure: `
      <h3>Procedure — Half Adder:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Connect IC 7486 (XOR) and IC 7408 (AND) on the bread board.</li>
        <li>Connect VCC (+5V) to Pin 14 and GND to Pin 7 of each IC.</li>
        <li>Apply inputs A and B to the first gate of each IC.</li>
        <li>Connect the XOR output to an LED (Sum) and AND output to another LED (Carry).</li>
        <li>Apply all input combinations (00, 01, 10, 11) and record outputs.</li>
      </ol>
      <h3>Procedure — Full Adder:</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>First compute A⊕B using XOR gate. Let the result be P.</li>
        <li>Compute Sum = P ⊕ Cin using a second XOR gate.</li>
        <li>Compute A·B and P·Cin using AND gates.</li>
        <li>Compute Carry = (A·B) + (P·Cin) using an OR gate.</li>
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
]

export default function ExperimentPage() {
  const params = useParams()
  const [experiment, setExperiment] = useState(null)
  const [activeTab, setActiveTab] = useState("theory")
  
  const dockItems = [
    { title: "Home", icon: <Home className="h-full w-full text-neutral-300" />, href: "/" },
    { title: "Experiments", icon: <BookOpen className="h-full w-full text-neutral-300" />, href: "/experiments" },
    { title: "Study Room", icon: <Library className="h-full w-full text-neutral-300" />, href: "/study-room" },
    { title: "Quizzes", icon: <FileQuestion className="h-full w-full text-neutral-300" />, href: "/quizzes" },
    { title: "Team", icon: <Users className="h-full w-full text-neutral-300" />, href: "/team" },
    { title: "About", icon: <Info className="h-full w-full text-neutral-300" />, href: "/about" },
    { title: "Profile", icon: <User className="h-full w-full text-neutral-300" />, href: "/profile" }, { title: "Settings", icon: <Settings className="h-full w-full text-neutral-300" />, href: "/settings" },
    { title: "Sign In", icon: <LogIn className="h-full w-full text-neutral-300" />, href: "/signin" },
  ]

  useEffect(() => {
    const id = Number.parseInt(params.id)
    const exp = experiments.find((e) => e.id === id)

    if (!exp) {
      notFound()
    }

    setExperiment(exp)

    // Check for hash in URL to set active tab
    const hash = window.location.hash
    if (hash) {
      const tabName = hash.replace("#", "")
      // 'simulation' is the correct tab value (was incorrectly '3d' previously)
      if (["aim", "apparatus", "theory", "procedure", "interactive", "simulation", "quiz", "references"].includes(tabName)) {
        setActiveTab(tabName)
      }
    }
  }, [params.id])

  if (!experiment) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Dynamic Sidebar */}
      <DynamicSidebar />

      {/* Centered navigation at the top */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} className="w-auto" mobileClassName="w-auto" />
      </div>

      <DigitalClock />

      <div className="w-full max-w-6xl mx-auto px-4 py-8 pt-24 pl-0 md:pl-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/experiments" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Experiments
          </Link>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-900/30 text-blue-400 font-bold text-sm">
                    {experiment.id}
                  </div>
                  <div className="px-2 py-1 rounded-md bg-blue-900/20 text-blue-400 text-xs font-medium">
                    {experiment.id <= 2 ? "Circuit Analysis" : 
                     experiment.id <= 5 ? "Electrical Installation" : 
                     "Electronics"}
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white">{experiment.title}</h1>
                <p className="text-neutral-400 mt-2 max-w-2xl">{experiment.aim}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center h-16 w-16 rounded-lg bg-neutral-900 border border-neutral-800">
                  {experiment.id <= 2 ? (
                    <Zap className="h-6 w-6 text-yellow-400 mb-1" />
                  ) : experiment.id <= 5 ? (
                    <Lightbulb className="h-6 w-6 text-yellow-400 mb-1" />
                  ) : (
                    <Cpu className="h-6 w-6 text-blue-400 mb-1" />
                  )}
                  <span className="text-xs text-neutral-400">EXP-{experiment.id}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue={activeTab}
            className="w-full"
            onValueChange={(value) => {
              setActiveTab(value)
              window.location.hash = value
            }}
          >
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 bg-neutral-900/80 border border-neutral-800 rounded-xl p-1">
              <TabsTrigger value="aim" className="data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg">
                Aim
              </TabsTrigger>
              <TabsTrigger value="apparatus" className="data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg">
                Apparatus
              </TabsTrigger>
              <TabsTrigger value="theory" className="data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg">
                Theory
              </TabsTrigger>
              <TabsTrigger value="procedure" className="data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg">
                Procedure
              </TabsTrigger>
              <TabsTrigger value="interactive" className="data-[state=active]:bg-green-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg">
                Interactive
              </TabsTrigger>
              <TabsTrigger value="simulation" className="data-[state=active]:bg-purple-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg">
                Simulation
              </TabsTrigger>
              <TabsTrigger value="quiz" className="data-[state=active]:bg-yellow-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg">
                Quiz
              </TabsTrigger>
              <TabsTrigger value="references" className="data-[state=active]:bg-blue-800/50 data-[state=active]:text-white text-neutral-400 text-xs rounded-lg">
                References
              </TabsTrigger>
            </TabsList>

            {/* Aim Tab */}
            <TabsContent value="aim" id="aim" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300"
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
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300"
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
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300"
              >
                <div className="experiment-content" dangerouslySetInnerHTML={{ __html: experiment.theory }} />
                
                {/* Circuit Animation Background */}
                <div className="relative mt-8 h-64 rounded-lg overflow-hidden border border-neutral-800">
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
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300"
              >
                <div className="experiment-content" dangerouslySetInnerHTML={{ __html: experiment.procedure }} />
              </motion.div>
            </TabsContent>

            {/* Interactive Tab */}
            <TabsContent value="interactive" id="interactive" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {experiment.id === 1 && <KVLExperiment />}
                {experiment.id === 2 && <TheveninExperiment />}
                {experiment.id === 3 && <HouseWiringExperiment />}
                {experiment.id === 4 && <FluorescentLampExperiment />}
                {experiment.id === 5 && <StaircaseWiringExperiment />}
                {experiment.id === 6 && <FullWaveRectifierExperiment />}
                {experiment.id > 6 && (
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">
                    <h3 className="text-xl font-bold text-white mb-4">Interactive Demonstration</h3>
                    <p>Interactive demonstration for this experiment is coming soon!</p>
                    <div className="mt-8 p-6 bg-neutral-800 rounded-lg flex items-center justify-center">
                      <CircuitAnimation />
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Simulation Tab — fixed value from '3d' to 'simulation' */}
            <TabsContent value="simulation" id="simulation" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="w-full h-[500px] rounded-xl overflow-hidden border border-neutral-800 relative bg-neutral-900">
                  <InteractiveRobotSpline scene="https://prod.spline.design/kZCBH4hL4yD8P315/scene.splinecode" />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-neutral-800">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" /> AI Lab Assistant
                    </p>
                  </div>
                </div>

                {experiment.id === 7 ? (
                  <LogicGatesVirtualLab />
                ) : experiment.id === 8 ? (
                  <AdderVirtualLab />
                ) : experiment.embedId ? (
                  <Circuit3DViewer 
                    experimentId={experiment.id} 
                    title={experiment.title} 
                    embedId={experiment.embedId} 
                  />
                ) : (
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center text-neutral-300">
                    <Zap className="h-16 w-16 text-yellow-500/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Virtual Simulation Coming Soon</h3>
                    <p className="text-neutral-400 max-w-md mx-auto">We are currently building the interactive simulation for this specific experiment. Please check the Interactive Demonstration tab for an animated walkthrough.</p>
                  </div>
                )}
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
                {experiment.id === 3 && <HouseWiringQuiz />}
                {experiment.id === 4 && <FluorescentLampQuiz />}
                {experiment.id === 5 && <StaircaseWiringQuiz />}
                {experiment.id === 6 && <FullWaveRectifierQuiz />}
                {experiment.id > 6 && (
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">
                    <h3 className="text-xl font-bold text-white mb-4">Knowledge Check</h3>
                    <p>Quiz for this experiment is coming soon!</p>
                    <div className="mt-8 p-6 bg-neutral-800 rounded-lg flex items-center justify-center h-64">
                      <div className="text-center">
                        <FileQuestion className="h-16 w-16 text-yellow-500/50 mx-auto mb-4" />
                        <p className="text-neutral-400">Check back later for a quiz on this topic</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Video Tab */}
            <TabsContent value="video" id="video" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">
                  <h3 className="text-xl font-bold text-white mb-4">Experiment Video Demonstration</h3>
                  <p className="mb-6">Watch a complete demonstration of the experiment procedure and results.</p>
                  
                  {/* Real educational YouTube videos mapped per experiment */}
                  {(() => {
                    const videoMap: Record<number, { src: string; title: string }> = {
                      1: { src: "https://www.youtube.com/embed/jdgr56G6bIs", title: "Kirchhoff's Voltage Law - Verified" },
                      2: { src: "https://www.youtube.com/embed/QJQS_5wYDGw", title: "Thevenin's Theorem Explained" },
                      3: { src: "https://www.youtube.com/embed/3RL0dDghkYw", title: "House Wiring Demonstration" },
                      4: { src: "https://www.youtube.com/embed/nkxgGg3PCGE", title: "Fluorescent Lamp Working" },
                      5: { src: "https://www.youtube.com/embed/0MqYkiKFxJA", title: "Staircase Wiring Explained" },
                      6: { src: "https://www.youtube.com/embed/sI_7GkbcKBo", title: "Full Wave Bridge Rectifier" },
                    }
                    const video = videoMap[experiment.id]
                    if (video) {
                      return (
                        <div className="aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800">
                          <iframe
                            className="w-full h-full"
                            src={video.src}
                            title={video.title}
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
                          <p className="text-neutral-400 text-sm">Video demonstration coming soon</p>
                        </div>
                      </div>
                    )
                  })()}
                  
                  {experiment.id > 6 && (
                    <div className="mt-8 p-6 bg-neutral-800 rounded-lg flex items-center justify-center h-64">
                      <div className="text-center">
                        <Video className="h-16 w-16 text-red-500/50 mx-auto mb-4" />
                        <p className="text-neutral-400">Video demonstration coming soon</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-neutral-800 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Video Notes:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                      <li>Watch the entire video before attempting the experiment</li>
                      <li>Pay attention to safety precautions highlighted in the video</li>
                      <li>You can pause and rewatch specific sections as needed</li>
                      <li>The video demonstrates the ideal procedure and expected results</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" id="gallery" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">
                  <h3 className="text-xl font-bold text-white mb-4">Experiment Equipment Gallery</h3>
                  <p className="mb-6">View images of the equipment and setup used in this experiment.</p>
                  
                  {experiment.id === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Digital Multimeter</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">DC Power Supply</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Resistors</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Breadboard</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Connecting Wires</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Complete Setup</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {experiment.id === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Digital Multimeter</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">DC Power Supply</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Resistors</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Breadboard</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Connecting Wires</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Complete Setup</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {experiment.id === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Energy Meter</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">MCB Distribution Box</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Switches and Sockets</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Wiring Cables</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Lamp Holders</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Complete Setup</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {experiment.id === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Fluorescent Tube</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Choke/Ballast</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Starter</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Tube Holders</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Wiring Cables</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Complete Setup</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {experiment.id === 5 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Two-Way Switches</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Lamp Holder</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Incandescent Bulb</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Wiring Cables</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Switch Board</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Complete Setup</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {experiment.id === 6 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Diodes</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Transformer</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Filter Capacitor</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Load Resistor</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Oscilloscope</p>
                        </div>
                      </div>
                      <div className="bg-neutral-800 rounded-lg overflow-hidden">
                        <div className="aspect-square relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                            <ImageIcon className="h-16 w-16 text-neutral-700" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-neutral-300">Complete Setup</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {experiment.id > 6 && (
                    <div className="mt-8 p-6 bg-neutral-800 rounded-lg flex items-center justify-center h-64">
                      <div className="text-center">
                        <ImageIcon className="h-16 w-16 text-indigo-500/50 mx-auto mb-4" />
                        <p className="text-neutral-400">Equipment gallery coming soon</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-neutral-800 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Equipment Notes:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                      <li>Familiarize yourself with each piece of equipment before starting</li>
                      <li>Check all equipment for damage before use</li>
                      <li>Follow proper handling procedures for sensitive instruments</li>
                      <li>Return all equipment to its proper storage location after use</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* References Tab */}
            <TabsContent value="references" id="references" className="mt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300"
              >
                <div dangerouslySetInnerHTML={{ __html: experiment.references }} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}


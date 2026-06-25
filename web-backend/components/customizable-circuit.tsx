"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trialCircuits } from "@/lib/data/trialCircuits"

export interface CircuitNode {
  id: string
  x: number
  y: number
  label?: string
  voltage?: number
  current?: number
  type: "node" | "resistor" | "capacitor" | "inductor" | "source" | "ground" | "switch" | "diode" | "transistor"
  value?: string
  resistance?: number // in ohms
  voltageSource?: number // in volts
  state?: "on" | "off"
  rotation?: number
}

export interface CircuitConnection {
  from: string
  to: string
  label?: string
  current?: number
  highlighted?: boolean
}

interface SimulationResults {
  nodeVoltages: Map<string, number>
  branchCurrents: Map<string, number>
  valid: boolean
  message: string
}

interface CustomizableCircuitProps {
  initialNodes?: CircuitNode[]
  initialConnections?: CircuitConnection[]
  width?: number
  height?: number
  className?: string
  onCircuitChange?: (nodes: CircuitNode[], connections: CircuitConnection[]) => void
  experimentId?: number // Add experiment ID to load trial circuit
}

const componentTypes = [
  { type: "node" as const, label: "Junction", icon: "●" },
  { type: "resistor" as const, label: "Resistor", icon: "▬" },
  { type: "capacitor" as const, label: "Capacitor", icon: "‖" },
  { type: "inductor" as const, label: "Inductor", icon: "◈" },
  { type: "source" as const, label: "Voltage Source", icon: "⟷" },
  { type: "ground" as const, label: "Ground", icon: "⏚" },
  { type: "switch" as const, label: "Switch", icon: "⌥" },
  { type: "diode" as const, label: "Diode", icon: "▸" },
  { type: "transistor" as const, label: "Transistor", icon: "⟁" },
]

function getCircuitViewBox(nodes: CircuitNode[], padding = 70) {
  if (nodes.length === 0) {
    return {
      minX: 0,
      minY: 0,
      viewWidth: 600,
      viewHeight: 400,
      viewBox: `0 0 600 400`,
    }
  }
  const xs = nodes.map((node) => node.x)
  const ys = nodes.map((node) => node.y)
  const minX = Math.min(...xs) - padding
  const minY = Math.min(...ys) - padding
  const maxX = Math.max(...xs) + padding
  const maxY = Math.max(...ys) + padding
  const viewWidth = maxX - minX
  const viewHeight = maxY - minY

  return {
    minX,
    minY,
    viewWidth,
    viewHeight,
    viewBox: `${minX} ${minY} ${viewWidth} ${viewHeight}`,
  }
}

function parseResistance(value: string = ""): number {
  const cleaned = value.replace(/Ω|k|K|m|M/g, "").trim()
  const num = parseFloat(cleaned) || 1000
  if (value.toLowerCase().includes("k")) return num * 1000
  if (value.toLowerCase().includes("m")) return num * 1000000
  return num
}

function buildAdjacencyList(nodes: CircuitNode[], connections: CircuitConnection[]): Map<string, string[]> {
  const adjacency = new Map<string, string[]>()
  nodes.forEach(node => adjacency.set(node.id, []))
  connections.forEach(conn => {
    if (adjacency.has(conn.from) && adjacency.has(conn.to)) {
      adjacency.get(conn.from)!.push(conn.to)
      adjacency.get(conn.to)!.push(conn.from)
    }
  })
  return adjacency
}

function runCircuitSimulation(nodes: CircuitNode[], connections: CircuitConnection[]): SimulationResults {
  const nodeVoltages = new Map<string, number>()
  const branchCurrents = new Map<string, number>()
  
  const groundNodes = nodes.filter(n => n.type === "ground")
  if (groundNodes.length === 0) {
    return { nodeVoltages, branchCurrents, valid: false, message: "Add at least one ground node!" }
  }
  
  const voltageSources = nodes.filter(n => n.type === "source" && n.voltageSource)
  if (voltageSources.length === 0) {
    return { nodeVoltages, branchCurrents, valid: false, message: "Add at least one voltage source!" }
  }
  
  // Simple heuristic for demonstration - assign voltages based on sources
  groundNodes.forEach(g => nodeVoltages.set(g.id, 0))
  
  // Create adjacency list
  const adjacency = buildAdjacencyList(nodes, connections)
  
  // BFS to assign voltages
  const visited = new Set<string>()
  const queue = [...groundNodes.map(g => ({ id: g.id, voltage: 0 }))]
  visited.add(groundNodes[0].id)
  
  while (queue.length > 0) {
    const current = queue.shift()!
    const neighbors = adjacency.get(current.id) || []
    
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId)
        const neighborNode = nodes.find(n => n.id === neighborId)
        let voltage = current.voltage
        
        if (neighborNode?.type === "source" && neighborNode.voltageSource) {
          voltage = neighborNode.voltageSource
        }
        
        nodeVoltages.set(neighborId, voltage)
        queue.push({ id: neighborId, voltage })
      }
    }
  }
  
  // Calculate dummy currents for demonstration
  connections.forEach((conn, i) => {
    const fromVoltage = nodeVoltages.get(conn.from) || 0
    const toVoltage = nodeVoltages.get(conn.to) || 0
    branchCurrents.set(`${conn.from}-${conn.to}`, Math.abs(fromVoltage - toVoltage) / 1000)
  })
  
  return { 
    nodeVoltages, 
    branchCurrents, 
    valid: true, 
    message: "Simulation complete (simplified heuristic model)" 
  }
}

export const CustomizableCircuit = ({
  initialNodes = [],
  initialConnections = [],
  width = 800,
  height = 500,
  className = "",
  onCircuitChange,
  experimentId = 1, // Default to experiment 1
}: CustomizableCircuitProps) => {
  // Get trial circuit for this experiment
  const trialCircuit = trialCircuits[experimentId]
  
  // Mode state: "trial", "build", "guided", "test"
  const [mode, setMode] = useState<"trial" | "build" | "guided" | "test">("trial")
  
  // State for build/guided/test mode
  const [buildNodes, setBuildNodes] = useState<CircuitNode[]>(initialNodes)
  const [buildConnections, setBuildConnections] = useState<CircuitConnection[]>(initialConnections)
  
  // Guided mode state
  const [guidedStep, setGuidedStep] = useState(0)
  const [guidedCompleted, setGuidedCompleted] = useState(false)
  
  // Helper to get the steps for guided mode - memoized so it doesn't recreate on every render!
  const guidedSteps = useMemo(() => {
    // First step: add all nodes from trial circuit
    const nodeSteps = trialCircuit.nodes.map((node, index) => ({
      type: "add-node" as const,
      node,
      description: `Add ${node.type} component: ${node.label || node.type} at position (${node.x}, ${node.y})`,
    }))
    
    // Then add connections
    const connectionSteps = trialCircuit.connections.map((conn, index) => ({
      type: "add-connection" as const,
      connection: conn,
      description: `Connect ${conn.from} to ${conn.to}`,
    }))
    
    return [...nodeSteps, ...connectionSteps]
  }, [trialCircuit])
  
  // Current nodes/connections based on mode - derived value, no state needed!
  const nodes = mode === "trial" ? trialCircuit.nodes : buildNodes
  const connections = mode === "trial" ? trialCircuit.connections : buildConnections

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [activeTab, setActiveTab] = useState<"build" | "simulate">("build")
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { viewBox, viewWidth, viewHeight, minX, minY } = getCircuitViewBox(nodes)

  useEffect(() => {
    if (onCircuitChange) {
      onCircuitChange(nodes, connections)
    }
  }, [nodes, connections, onCircuitChange])

  const getConnectionPath = (from: CircuitNode, to: CircuitNode) => {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
  }

  // Update functions to work in build/guided/test mode
  const addComponent = useCallback((type: CircuitNode["type"]) => {
    if (mode === "trial") return
    const newNode: CircuitNode = {
      id: `node-${Date.now()}`,
      x: minX + viewWidth / 2,
      y: minY + viewHeight / 2,
      type,
      label: `${type.charAt(0).toUpperCase()}${type.slice(1)}${buildNodes.length + 1}`,
      rotation: 0,
    }
    if (type === "source") {
      newNode.voltageSource = 5
    }
    if (type === "resistor") {
      newNode.value = "1kΩ"
      newNode.resistance = 1000
    }
    if (type === "capacitor") newNode.value = "10µF"
    if (type === "inductor") newNode.value = "1mH"
    if (type === "switch") newNode.state = "off"
    setBuildNodes((prev) => [...prev, newNode])
    setSelectedNode(newNode.id)
    
    // Check if this completes current guided step
    if (mode === "guided" && !guidedCompleted) {
      const currentStep = guidedSteps[guidedStep]
      
      if (currentStep.type === "add-node") {
        // Check if added node matches current step (simplified - same type)
        if (type === currentStep.node.type) {
          // Update node position to match target
          setBuildNodes(prev => prev.map(n => 
            n.id === newNode.id 
              ? { ...n, x: currentStep.node.x, y: currentStep.node.y, label: currentStep.node.label } 
              : n
          ))
          
          // Advance to next step
          if (guidedStep + 1 < guidedSteps.length) {
            setGuidedStep(prev => prev + 1)
          } else {
            setGuidedCompleted(true)
          }
        }
      }
    }
  }, [mode, minX, viewWidth, minY, viewHeight, guidedStep, guidedCompleted, guidedSteps])

  const updateNode = useCallback((id: string, updates: Partial<CircuitNode>) => {
    if (mode === "trial") return
    setBuildNodes((prev) => prev.map((node) => {
      if (node.id === id) {
        const updated = { ...node, ...updates }
        if (node.type === "resistor" && updates.value) {
          updated.resistance = parseResistance(updates.value)
        }
        return updated
      }
      return node
    }))
  }, [mode])

  const deleteNode = useCallback((id: string) => {
    if (mode === "trial") return
    setBuildNodes((prev) => prev.filter((node) => node.id !== id))
    setBuildConnections((prev) =>
      prev.filter((conn) => conn.from !== id && conn.to !== id)
    )
    if (selectedNode === id) setSelectedNode(null)
  }, [mode, selectedNode])

  const addConnection = useCallback((from: string, to: string) => {
    if (mode === "trial") return
    setBuildConnections((prev) => [...prev, { from, to }])
    setConnectingFrom(null)
    
    // Check if this completes current guided step
    if (mode === "guided" && !guidedCompleted) {
      const currentStep = guidedSteps[guidedStep]
      
      if (currentStep.type === "add-connection") {
        // Advance to next step
        if (guidedStep + 1 < guidedSteps.length) {
          setGuidedStep(prev => prev + 1)
        } else {
          setGuidedCompleted(true)
        }
      }
    }
  }, [mode, guidedStep, guidedCompleted, guidedSteps])

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (mode === "trial") return
    e.stopPropagation()
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return
    setDraggingNode(nodeId)
    setSelectedNode(nodeId)
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const xScale = viewWidth / rect.width
    const yScale = viewHeight / rect.height
    setDragOffset({
      x: node.x - (e.clientX - rect.left) * xScale - minX,
      y: node.y - (e.clientY - rect.top) * yScale - minY,
    })
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (mode === "trial" || !draggingNode || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const xScale = viewWidth / rect.width
    const yScale = viewHeight / rect.height
    const x = (e.clientX - rect.left) * xScale + minX + dragOffset.x
    const y = (e.clientY - rect.top) * yScale + minY + dragOffset.y
    updateNode(draggingNode, { x, y })
  }, [mode, draggingNode, minX, minY, viewWidth, viewHeight, dragOffset, updateNode])

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null)
  }, [])

  const runSimulation = useCallback(() => {
    const results = runCircuitSimulation(nodes, connections)
    setSimulationResults(results)
  }, [nodes, connections])

  // Helper to get colors based on mode
  const getColors = (type: CircuitNode["type"], isSelected: boolean) => {
    const trialColors: Record<CircuitNode["type"], string> = {
      node: "#a0aec0",
      resistor: "#b5b5c7",
      capacitor: "#a3a3b9",
      inductor: "#9ca3af",
      source: "#718096",
      ground: "#8b9ab0",
      switch: "#b0b0c2",
      diode: "#c0a0c0",
      transistor: "#b8a0c8",
    }
    const buildColors: Record<CircuitNode["type"], string> = {
      node: "#d79f1e",
      resistor: "#d79f1e",
      capacitor: "#d79f1e",
      inductor: "#d79f1e",
      source: "#4C7894",
      ground: "#d79f1e",
      switch: "#d79f1e",
      diode: "#dd7bbb",
      transistor: "#dd7bbb",
    }
    const selectedColor = "#5a922c"
    
    if (isSelected && mode !== "trial") return selectedColor
    return mode === "trial" ? trialColors[type] : buildColors[type]
  }

  const renderComponent = (node: CircuitNode) => {
    const isSelected = selectedNode === node.id && mode !== "trial"
    const isHovered = hoveredNode === node.id && mode !== "trial"
    const isConnecting = connectingFrom === node.id && mode !== "trial"
    const simVoltage = simulationResults?.nodeVoltages.get(node.id)
    const color = getColors(node.type, isSelected)

    switch (node.type) {
      case "node":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={isHovered ? 8 : 6}
              fill={color}
              stroke={isSelected || isConnecting ? "white" : "none"}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill={mode === "trial" ? "#a0aec0" : "white"}
                fontSize={12}
              >
                {node.label}
              </text>
            )}
            {simVoltage !== undefined && (
              <text
                x={node.x}
                y={node.y + 20}
                textAnchor="middle"
                fill="#5a922c"
                fontSize={10}
                fontWeight="bold"
              >
                {simVoltage.toFixed(2)}V
              </text>
            )}
          </g>
        )
      
      case "resistor":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <path
              d={`M ${node.x - 20} ${node.y} 
                  H ${node.x - 15} 
                  L ${node.x - 12} ${node.y - 5} 
                  L ${node.x - 6} ${node.y + 5} 
                  L ${node.x} ${node.y - 5} 
                  L ${node.x + 6} ${node.y + 5} 
                  L ${node.x + 12} ${node.y - 5} 
                  L ${node.x + 15} ${node.y} 
                  H ${node.x + 20}`}
              stroke={color}
              strokeWidth={isSelected ? 3 : 2}
              fill="none"
              strokeLinecap="round"
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill={mode === "trial" ? "#a0aec0" : "white"}
                fontSize={12}
              >
                {node.label}
              </text>
            )}
            {node.value && (
              <text
                x={node.x}
                y={node.y + 20}
                textAnchor="middle"
                fill={mode === "trial" ? "#9ca3af" : "#dd7bbb"}
                fontSize={10}
              >
                {node.value}
              </text>
            )}
          </g>
        )
      
      case "capacitor":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <path
              d={`M ${node.x - 20} ${node.y} H ${node.x - 5} M ${node.x - 5} ${node.y - 10} V ${node.y + 10} M ${node.x + 5} ${node.y - 10} V ${node.y + 10} M ${node.x + 5} ${node.y} H ${node.x + 20}`}
              stroke={color}
              strokeWidth={isSelected ? 3 : 2}
              fill="none"
              strokeLinecap="round"
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill={mode === "trial" ? "#a0aec0" : "white"}
                fontSize={12}
              >
                {node.label}
              </text>
            )}
            {node.value && (
              <text
                x={node.x}
                y={node.y + 20}
                textAnchor="middle"
                fill={mode === "trial" ? "#9ca3af" : "#dd7bbb"}
                fontSize={10}
              >
                {node.value}
              </text>
            )}
          </g>
        )
      
      case "inductor":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <path
              d={`M ${node.x - 20} ${node.y} 
                  H ${node.x - 15} 
                  C ${node.x - 10} ${node.y}, ${node.x - 10} ${node.y - 5}, ${node.x - 5} ${node.y - 5} 
                  C ${node.x} ${node.y - 5}, ${node.x} ${node.y}, ${node.x + 5} ${node.y} 
                  C ${node.x + 10} ${node.y}, ${node.x + 10} ${node.y - 5}, ${node.x + 15} ${node.y - 5} 
                  H ${node.x + 20}`}
              stroke={color}
              strokeWidth={isSelected ? 3 : 2}
              fill="none"
              strokeLinecap="round"
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill={mode === "trial" ? "#a0aec0" : "white"}
                fontSize={12}
              >
                {node.label}
              </text>
            )}
            {node.value && (
              <text
                x={node.x}
                y={node.y + 20}
                textAnchor="middle"
                fill={mode === "trial" ? "#9ca3af" : "#dd7bbb"}
                fontSize={10}
              >
                {node.value}
              </text>
            )}
          </g>
        )
      
      case "source":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={15}
              fill="none"
              stroke={color}
              strokeWidth={isSelected ? 3 : 2}
            />
            <line
              x1={node.x - 8}
              y1={node.y}
              x2={node.x + 8}
              y2={node.y}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x}
              y1={node.y - 8}
              x2={node.x}
              y2={node.y + 8}
              stroke={color}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 25}
                textAnchor="middle"
                fill={mode === "trial" ? "#a0aec0" : "white"}
                fontSize={12}
              >
                {node.label}
              </text>
            )}
            {node.voltageSource !== undefined && (
              <text
                x={node.x}
                y={node.y + 25}
                textAnchor="middle"
                fill={mode === "trial" ? "#9ca3af" : "#dd7bbb"}
                fontSize={10}
              >
                {node.voltageSource}V
              </text>
            )}
          </g>
        )
      
      case "ground":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <line
              x1={node.x}
              y1={node.y - 10}
              x2={node.x}
              y2={node.y}
              stroke={color}
              strokeWidth={isSelected ? 3 : 2}
            />
            <line
              x1={node.x - 10}
              y1={node.y}
              x2={node.x + 10}
              y2={node.y}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x - 6}
              y1={node.y + 4}
              x2={node.x + 6}
              y2={node.y + 4}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x - 2}
              y1={node.y + 8}
              x2={node.x + 2}
              y2={node.y + 8}
              stroke={color}
              strokeWidth={2}
            />
            {simVoltage !== undefined && (
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                fill="#5a922c"
                fontSize={10}
                fontWeight="bold"
              >
                {simVoltage.toFixed(2)}V
              </text>
            )}
          </g>
        )
      
      case "switch":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <circle
              cx={node.x - 10}
              cy={node.y}
              r={3}
              fill={color}
            />
            <circle
              cx={node.x + 10}
              cy={node.y}
              r={3}
              fill={color}
            />
            <line
              x1={node.x - 20}
              y1={node.y}
              x2={node.x - 10}
              y2={node.y}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x + 10}
              y1={node.y}
              x2={node.x + 20}
              y2={node.y}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x - 10}
              y1={node.y}
              x2={node.x + 5}
              y2={node.state === "on" ? node.y : node.y - 10}
              stroke={color}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill={mode === "trial" ? "#a0aec0" : "white"}
                fontSize={12}
              >
                {node.label}
              </text>
            )}
          </g>
        )
      
      case "diode":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <line
              x1={node.x - 20}
              y1={node.y}
              x2={node.x - 10}
              y2={node.y}
              stroke={color}
              strokeWidth={isSelected ? 3 : 2}
            />
            <polygon
              points={`${node.x - 10},${node.y - 8} ${node.x - 10},${node.y + 8} ${node.x + 10},${node.y}`}
              fill={color}
              stroke="none"
            />
            <line
              x1={node.x + 10}
              y1={node.y - 8}
              x2={node.x + 10}
              y2={node.y + 8}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x + 10}
              y1={node.y}
              x2={node.x + 20}
              y2={node.y}
              stroke={color}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill={mode === "trial" ? "#a0aec0" : "white"}
                fontSize={12}
              >
                {node.label}
              </text>
            )}
          </g>
        )
      
      case "transistor":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={15}
              fill="none"
              stroke={color}
              strokeWidth={isSelected ? 2 : 1.5}
            />
            <line
              x1={node.x - 15}
              y1={node.y}
              x2={node.x - 5}
              y2={node.y}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x - 5}
              y1={node.y - 10}
              x2={node.x - 5}
              y2={node.y + 10}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x - 5}
              y1={node.y - 7}
              x2={node.x + 15}
              y2={node.y - 15}
              stroke={color}
              strokeWidth={2}
            />
            <line
              x1={node.x - 5}
              y1={node.y + 7}
              x2={node.x + 15}
              y2={node.y + 15}
              stroke={color}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 25}
                textAnchor="middle"
                fill={mode === "trial" ? "#a0aec0" : "white"}
                fontSize={12}
              >
                {node.label}
              </text>
            )}
          </g>
        )
      
      default:
        return null
    }
  }

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

  // Reset guided mode
  const resetGuidedMode = () => {
    setBuildNodes([])
    setBuildConnections([])
    setGuidedStep(0)
    setGuidedCompleted(false)
  }
  
  // Reset test mode
  const resetTestMode = () => {
    setBuildNodes([])
    setBuildConnections([])
  }
  
  // Check if current circuit matches trial circuit
  const checkCircuitMatch = () => {
    // Check if number of nodes and connections match
    if (buildNodes.length !== trialCircuit.nodes.length) return false
    if (buildConnections.length !== trialCircuit.connections.length) return false
    
    // Check all nodes
    for (const trialNode of trialCircuit.nodes) {
      const found = buildNodes.find(n => 
        n.type === trialNode.type && 
        Math.abs(n.x - trialNode.x) < 30 && 
        Math.abs(n.y - trialNode.y) < 30
      )
      if (!found) return false
    }
    
    // Check all connections (simplified)
    for (const trialConn of trialCircuit.connections) {
      const found = buildConnections.find(c => {
        const fromMatch = (c.from === trialConn.from && c.to === trialConn.to)
        const toMatch = (c.from === trialConn.to && c.to === trialConn.from)
        return fromMatch || toMatch
      })
      if (!found) return false
    }
    
    return true
  }
  
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant={mode === "trial" ? "default" : "secondary"}
          onClick={() => setMode("trial")}
        >
          View Trial Circuit
        </Button>
        <Button
          variant={mode === "guided" ? "default" : "secondary"}
          onClick={() => {
            setMode("guided")
            if (buildNodes.length === 0) resetGuidedMode()
          }}
        >
          Guided Mode
        </Button>
        <Button
          variant={mode === "test" ? "default" : "secondary"}
          onClick={() => {
            setMode("test")
            if (buildNodes.length === 0) resetTestMode()
          }}
        >
          Test Mode
        </Button>
        <Button
          variant={mode === "build" ? "default" : "secondary"}
          onClick={() => setMode("build")}
        >
          Free Build
        </Button>
      </div>
      
      {/* Guided Mode UI */}
      {mode === "guided" && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-300">Guided Mode</h3>
            <Button variant="secondary" onClick={resetGuidedMode} size="sm">
              Reset
            </Button>
          </div>
          
          {guidedCompleted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <h4 className="text-xl font-bold text-green-400 mb-2">Great Job!</h4>
              <p className="text-white/70 mb-4">You've completed the guided circuit! Now try Test Mode!</p>
              <Button onClick={() => { resetTestMode(); setMode("test") }}>
                Start Test Mode
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 flex-1 bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all"
                      style={{ 
                        width: `${(guidedStep / guidedSteps.length) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-white/60">
                    {guidedStep + 1} / {guidedSteps.length}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-500/20">
                <p className="text-white/90">{guidedSteps[guidedStep].description}</p>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Test Mode UI */}
      {mode === "test" && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-300">Test Mode</h3>
            <Button variant="secondary" onClick={resetTestMode} size="sm">
              Reset
            </Button>
          </div>
          
          <p className="text-white/70 mb-4">
            Build the circuit you learned in Guided Mode without help! When you're done, click "Check Circuit".
          </p>
          
          <div className="flex gap-2">
            <Button onClick={() => {
              if (checkCircuitMatch()) {
                alert("✅ Perfect! Your circuit matches the trial circuit! Great job!")
              } else {
                alert("❌ Not quite! Keep trying. Make sure all components are in the right place and connected correctly.")
              }
            }}>
              Check Circuit
            </Button>
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "build" | "simulate")}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="build">Build Circuit</TabsTrigger>
          <TabsTrigger value="simulate">Simulate</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Component Library */}
            <div className="lg:w-64 bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <h3 className="font-semibold text-white mb-4">Components</h3>
              <div className="grid grid-cols-2 gap-2">
                {componentTypes.map((comp) => (
                  <button
                    key={comp.type}
                    onClick={() => addComponent(comp.type as any)}
                    className="p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-white transition-colors flex flex-col items-center gap-1"
                  >
                    <span className="text-xl">{comp.icon}</span>
                    <span>{comp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Circuit Canvas */}
            <div className="flex-1">
              <div className="mb-2 flex gap-2 items-center">
                <div className="flex items-center gap-2">
                  <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                  <span className="text-sm text-neutral-300">Show Grid</span>
                </div>
                {connectingFrom && (
                  <div className="text-sm text-yellow-400 animate-pulse">
                    Select another component to connect
                  </div>
                )}
              </div>
              <div
                className={`relative w-full rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden ${draggingNode ? "cursor-grabbing" : "cursor-crosshair"}`}
                style={{ height }}
              >
                <svg
                  ref={svgRef}
                  viewBox={viewBox}
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  aria-label="Customizable circuit diagram"
                  className="block h-full w-full"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={() => {
                    if (!connectingFrom) setSelectedNode(null)
                  }}
                >
                  {showGrid && (
                    <g className="grid-lines opacity-10">
                      {Array.from({ length: Math.floor(viewWidth / 20) + 1 }).map((_, i) => (
                        <line
                          key={`vl-${i}`}
                          x1={minX + i * 20}
                          y1={minY}
                          x2={minX + i * 20}
                          y2={minY + viewHeight}
                          stroke="#555"
                          strokeWidth={0.5}
                        />
                      ))}
                      {Array.from({ length: Math.floor(viewHeight / 20) + 1 }).map((_, i) => (
                        <line
                          key={`hl-${i}`}
                          x1={minX}
                          y1={minY + i * 20}
                          x2={minX + viewWidth}
                          y2={minY + i * 20}
                          stroke="#555"
                          strokeWidth={0.5}
                        />
                      ))}
                    </g>
                  )}

                  {/* Connections */}
                  {connections.map((conn, idx) => {
                    const fromNode = nodes.find((n) => n.id === conn.from)
                    const toNode = nodes.find((n) => n.id === conn.to)
                    
                    if (!fromNode || !toNode) return null
                    
                    const isHovered = hoveredConnection === `${conn.from}-${conn.to}`
                    const current = simulationResults?.branchCurrents.get(`${conn.from}-${conn.to}`)
                    
                    return (
                      <g key={`conn-${idx}`}>
                        <path
                          d={getConnectionPath(fromNode, toNode)}
                          stroke={isHovered ? "#5a922c" : "#4C7894"}
                          strokeWidth={isHovered ? 3 : 2}
                          fill="none"
                          strokeLinecap="round"
                          onMouseEnter={() => setHoveredConnection(`${conn.from}-${conn.to}`)}
                          onMouseLeave={() => setHoveredConnection(null)}
                        />
                        {current !== undefined && (
                          <text
                            x={(fromNode.x + toNode.x) / 2}
                            y={(fromNode.y + toNode.y) / 2}
                            textAnchor="middle"
                            fill="#dd7bbb"
                            fontSize={10}
                            fontWeight="bold"
                          >
                            {(current * 1000).toFixed(2)}mA
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {/* Circuit components */}
                  {nodes.map((node) => (
                    <g
                      key={node.id}
                      onMouseDown={(e) => handleMouseDown(e, node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (connectingFrom && connectingFrom !== node.id) {
                          addConnection(connectingFrom, node.id)
                        } else {
                          setSelectedNode(node.id)
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {renderComponent(node)}
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="lg:w-64 bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <h3 className="font-semibold text-white mb-4">
                {selectedNodeData ? "Component Properties" : "Properties"}
              </h3>
              {selectedNodeData ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-neutral-300 block mb-1">Label</label>
                    <Input
                      value={selectedNodeData.label || ""}
                      onChange={(e) => updateNode(selectedNodeData.id, { label: e.target.value })}
                      className="bg-neutral-700 border-neutral-600"
                    />
                  </div>

                  {(selectedNodeData.type === "source") && (
                    <div>
                      <label className="text-sm text-neutral-300 block mb-1">
                        Voltage: {selectedNodeData.voltageSource}V
                      </label>
                      <Slider
                        value={[selectedNodeData.voltageSource || 5]}
                        min={1}
                        max={24}
                        step={1}
                        onValueChange={(v) => updateNode(selectedNodeData.id, { voltageSource: v[0] })}
                      />
                    </div>
                  )}

                  {(selectedNodeData.type === "resistor" || selectedNodeData.type === "capacitor" || selectedNodeData.type === "inductor") && (
                    <div>
                      <label className="text-sm text-neutral-300 block mb-1">Value</label>
                      <Input
                        value={selectedNodeData.value || ""}
                        onChange={(e) => updateNode(selectedNodeData.id, { value: e.target.value })}
                        className="bg-neutral-700 border-neutral-600"
                        placeholder="e.g. 10kΩ"
                      />
                    </div>
                  )}

                  {selectedNodeData.type === "switch" && (
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-neutral-300">State</label>
                      <Switch
                        checked={selectedNodeData.state === "on"}
                        onCheckedChange={(c) => updateNode(selectedNodeData.id, { state: c ? "on" : "off" })}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-neutral-300 block mb-1">
                      Rotation: {selectedNodeData.rotation}°
                    </label>
                    <Slider
                      value={[selectedNodeData.rotation || 0]}
                      min={0}
                      max={360}
                      step={15}
                      onValueChange={(v) => updateNode(selectedNodeData.id, { rotation: v[0] })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setConnectingFrom(connectingFrom ? null : selectedNodeData.id)}
                      className={connectingFrom === selectedNodeData.id ? "bg-yellow-600 hover:bg-yellow-500" : ""}
                    >
                      {connectingFrom === selectedNodeData.id ? "Cancel Connect" : "Connect"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteNode(selectedNodeData.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 text-sm">Select a component to edit</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="simulate" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Button onClick={runSimulation} className="bg-green-600 hover:bg-green-500">
              Run Simulation
            </Button>
            <Button variant="secondary" onClick={() => setSimulationResults(null)}>
              Clear Results
            </Button>
          </div>

          {simulationResults && (
            <div className="space-y-4">
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader>
                  <CardTitle className={simulationResults.valid ? "text-green-400" : "text-red-400"}>
                    {simulationResults.message}
                  </CardTitle>
                </CardHeader>
              </Card>

              {simulationResults.valid && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-sm text-white">Node Voltages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Array.from(simulationResults.nodeVoltages.entries()).map(([nodeId, voltage]) => {
                        const node = nodes.find(n => n.id === nodeId)
                        return (
                          <div key={nodeId} className="flex justify-between text-sm">
                            <span className="text-neutral-300">{node?.label || nodeId}</span>
                            <span className="text-green-400 font-semibold">{voltage.toFixed(2)} V</span>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  <Card className="bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-sm text-white">Branch Currents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Array.from(simulationResults.branchCurrents.entries()).map(([branchId, current]) => {
                        return (
                          <div key={branchId} className="flex justify-between text-sm">
                            <span className="text-neutral-300">Branch {branchId.slice(0, 8)}...</span>
                            <span className="text-pink-400 font-semibold">{(current * 1000).toFixed(2)} mA</span>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {!simulationResults && (
            <div className="p-6 bg-neutral-800 rounded-lg border border-neutral-700 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Simulation Mode</h3>
              <p className="text-neutral-400">Click "Run Simulation" to calculate voltages and currents!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

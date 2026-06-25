"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CircuitNode {
  id: string
  x: number
  y: number
  label?: string
  voltage?: number
  current?: number
  type: "node" | "resistor" | "capacitor" | "inductor" | "source" | "ground" | "switch" | "diode" | "transistor"
  value?: string
  state?: "on" | "off"
  rotation?: number
}

interface CircuitConnection {
  from: string
  to: string
  label?: string
  current?: number
  highlighted?: boolean
}

interface InteractiveCircuitProps {
  nodes: CircuitNode[]
  connections: CircuitConnection[]
  width?: number
  height?: number
  className?: string
  onNodeClick?: (nodeId: string) => void
  highlightPath?: string[]
}

function getCircuitViewBox(nodes: CircuitNode[], padding = 70) {
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

export const InteractiveCircuit = ({
  nodes,
  connections,
  width = 600,
  height = 400,
  className = "",
  onNodeClick,
  highlightPath = [],
}: InteractiveCircuitProps) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null)
  const [activeNodes, setActiveNodes] = useState<string[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const { viewBox, viewWidth, viewHeight, minX, minY } = getCircuitViewBox(nodes)

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    if (onNodeClick) {
      onNodeClick(nodeId)
    } else {
      // Toggle node in active nodes list
      setActiveNodes((prev) => 
        prev.includes(nodeId) 
          ? prev.filter(id => id !== nodeId) 
          : [...prev, nodeId]
      )
    }
  }

  // Calculate path for connections
  const getConnectionPath = (from: CircuitNode, to: CircuitNode) => {
    // Direct line for now, can be enhanced for more complex routing
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
  }

  // Render component based on type
  const renderComponent = (node: CircuitNode) => {
    const isActive = activeNodes.includes(node.id) || highlightPath.includes(node.id)
    const isHovered = hoveredNode === node.id

    switch (node.type) {
      case "node":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={isHovered ? 8 : 6}
              fill={isActive ? "#4C7894" : "#d79f1e"}
              stroke={isHovered ? "white" : "none"}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill="white"
                fontSize={12}
              >
                {node.label}
              </text>
            )}
            {node.voltage && (
              <text
                x={node.x}
                y={node.y + 20}
                textAnchor="middle"
                fill="#5a922c"
                fontSize={10}
              >
                {node.voltage}V
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
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill="white"
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
                fill="#dd7bbb"
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
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill="white"
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
                fill="#dd7bbb"
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
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill="white"
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
                fill="#dd7bbb"
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
              stroke={isActive ? "#5a922c" : "#4C7894"}
              strokeWidth={2}
            />
            <line
              x1={node.x - 8}
              y1={node.y}
              x2={node.x + 8}
              y2={node.y}
              stroke={isActive ? "#5a922c" : "#4C7894"}
              strokeWidth={2}
            />
            <line
              x1={node.x}
              y1={node.y - 8}
              x2={node.x}
              y2={node.y + 8}
              stroke={isActive ? "#5a922c" : "#4C7894"}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 25}
                textAnchor="middle"
                fill="white"
                fontSize={12}
              >
                {node.label}
              </text>
            )}
            {node.voltage && (
              <text
                x={node.x}
                y={node.y + 25}
                textAnchor="middle"
                fill="#dd7bbb"
                fontSize={10}
              >
                {node.voltage}V
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
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
            />
            <line
              x1={node.x - 10}
              y1={node.y}
              x2={node.x + 10}
              y2={node.y}
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
            />
            <line
              x1={node.x - 6}
              y1={node.y + 4}
              x2={node.x + 6}
              y2={node.y + 4}
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
            />
            <line
              x1={node.x - 2}
              y1={node.y + 8}
              x2={node.x + 2}
              y2={node.y + 8}
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
            />
          </g>
        )
      
      case "switch":
        return (
          <g transform={`rotate(${node.rotation || 0} ${node.x} ${node.y})`}>
            <circle
              cx={node.x - 10}
              cy={node.y}
              r={3}
              fill={isActive ? "#5a922c" : "#d79f1e"}
            />
            <circle
              cx={node.x + 10}
              cy={node.y}
              r={3}
              fill={isActive ? "#5a922c" : "#d79f1e"}
            />
            <line
              x1={node.x - 20}
              y1={node.y}
              x2={node.x - 10}
              y2={node.y}
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
            />
            <line
              x1={node.x + 10}
              y1={node.y}
              x2={node.x + 20}
              y2={node.y}
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
            />
            <line
              x1={node.x - 10}
              y1={node.y}
              x2={node.x + 5}
              y2={node.state === "on" ? node.y : node.y - 10}
              stroke={isActive ? "#5a922c" : "#d79f1e"}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill="white"
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
              stroke={isActive ? "#5a922c" : "#dd7bbb"}
              strokeWidth={2}
            />
            <polygon
              points={`${node.x - 10},${node.y - 8} ${node.x - 10},${node.y + 8} ${node.x + 10},${node.y}`}
              fill={isActive ? "#5a922c" : "#dd7bbb"}
              stroke="none"
            />
            <line
              x1={node.x + 10}
              y1={node.y - 8}
              x2={node.x + 10}
              y2={node.y + 8}
              stroke={isActive ? "#5a922c" : "#dd7bbb"}
              strokeWidth={2}
            />
            <line
              x1={node.x + 10}
              y1={node.y}
              x2={node.x + 20}
              y2={node.y}
              stroke={isActive ? "#5a922c" : "#dd7bbb"}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 15}
                textAnchor="middle"
                fill="white"
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
              stroke={isActive ? "#5a922c" : "#dd7bbb"}
              strokeWidth={1.5}
            />
            <line
              x1={node.x - 15}
              y1={node.y}
              x2={node.x - 5}
              y2={node.y}
              stroke={isActive ? "#5a922c" : "#dd7bbb"}
              strokeWidth={2}
            />
            <line
              x1={node.x - 5}
              y1={node.y - 10}
              x2={node.x - 5}
              y2={node.y + 10}
              stroke={isActive ? "#5a922c" : "#dd7bbb"}
              strokeWidth={2}
            />
            <line
              x1={node.x - 5}
              y1={node.y - 7}
              x2={node.x + 15}
              y2={node.y - 15}
              stroke={isActive ? "#5a922c" : "#dd7bbb"}
              strokeWidth={2}
            />
            <line
              x1={node.x - 5}
              y1={node.y + 7}
              x2={node.x + 15}
              y2={node.y + 15}
              stroke={isActive ? "#5a922c" : "#dd7bbb"}
              strokeWidth={2}
            />
            {node.label && (
              <text
                x={node.x}
                y={node.y - 25}
                textAnchor="middle"
                fill="white"
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

  return (
    <div className={`relative w-full min-w-0 max-w-full ${className}`}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Interactive circuit diagram"
        className="block h-auto w-full max-w-full rounded-lg border border-neutral-800 bg-neutral-900"
      >
        {/* Grid lines for reference */}
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

        {/* Connections */}
        {connections.map((conn, idx) => {
          const fromNode = nodes.find(n => n.id === conn.from)
          const toNode = nodes.find(n => n.id === conn.to)
          
          if (!fromNode || !toNode) return null
          
          const isHighlighted = 
            highlightPath.includes(conn.from) && 
            highlightPath.includes(conn.to) &&
            highlightPath.indexOf(conn.from) === highlightPath.indexOf(conn.to) - 1
          
          const isHovered = hoveredConnection === `${conn.from}-${conn.to}`
          
          return (
            <g key={`conn-${idx}`}>
              <path
                d={getConnectionPath(fromNode, toNode)}
                stroke={isHighlighted || conn.highlighted ? "#5a922c" : "#4C7894"}
                strokeWidth={isHovered || isHighlighted || conn.highlighted ? 3 : 2}
                fill="none"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredConnection(`${conn.from}-${conn.to}`)}
                onMouseLeave={() => setHoveredConnection(null)}
              />
              {conn.label && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize={10}
                >
                  {conn.label}
                </text>
              )}
              {conn.current && (
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 + 15}
                  textAnchor="middle"
                  fill="#dd7bbb"
                  fontSize={10}
                >
                  {conn.current}A
                </text>
              )}
              {isHighlighted && (
                <motion.circle
                  cx={fromNode.x}
                  cy={fromNode.y}
                  r={4}
                  fill="#5a922c"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    x: [0, toNode.x - fromNode.x],
                    y: [0, toNode.y - fromNode.y],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </g>
          )
        })}

        {/* Circuit components */}
        {nodes.map((node) => (
          <g
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: "pointer" }}
          >
            {renderComponent(node)}
          </g>
        ))}
      </svg>
    </div>
  )
}

// Example KVL circuit
export const KVLCircuit = ({ highlightPath = [] }) => {
  const [activePath, setActivePath] = useState<string[]>([])
  const [showValues, setShowValues] = useState(false)

  useEffect(() => {
    if (highlightPath.length > 0) {
      setActivePath(highlightPath)
    }
  }, [highlightPath])

  const handleToggleValues = () => {
    setShowValues(!showValues)
  }

  const handleCircuitDemo = () => {
    // Animate the current flow through the circuit
    setActivePath([])
    setTimeout(() => {
      setActivePath(['source', 'node1', 'resistor1', 'node2', 'resistor2', 'node3', 'source'])
    }, 300)
  }

  const nodes = [
    { id: 'source', x: 100, y: 200, type: 'source', label: 'E', voltage: showValues ? 12 : undefined },
    { id: 'node1', x: 100, y: 100, type: 'node' },
    { id: 'node2', x: 300, y: 100, type: 'node' },
    { id: 'node3', x: 300, y: 200, type: 'node' },
    { id: 'resistor1', x: 200, y: 100, type: 'resistor', label: 'R1', value: showValues ? '330Ω' : undefined },
    { id: 'resistor2', x: 300, y: 150, type: 'resistor', label: 'R2', value: showValues ? '220Ω' : undefined, rotation: 90 },
    { id: 'ground', x: 100, y: 250, type: 'ground' }
  ]

  const connections = [
    { from: 'source', to: 'node1' },
    { from: 'node1', to: 'resistor1' },
    { from: 'resistor1', to: 'node2' },
    { from: 'node2', to: 'resistor2' },
    { from: 'resistor2', to: 'node3' },
    { from: 'node3', to: 'source' },
    { from: 'source', to: 'ground' }
  ]

  return (
    <div className="experiment-interactive w-full min-w-0 max-w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-base sm:text-lg font-semibold text-white break-words min-w-0">KVL Circuit Demonstration</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleToggleValues} 
            className="px-3 py-1.5 bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 rounded-md text-sm transition-colors"
          >
            {showValues ? "Hide Values" : "Show Values"}
          </button>
          <button 
            onClick={handleCircuitDemo} 
            className="px-3 py-1.5 bg-green-900/30 hover:bg-green-800/50 text-green-300 rounded-md text-sm transition-colors"
          >
            Demonstrate KVL
          </button>
        </div>
      </div>
      
      <InteractiveCircuit 
        nodes={nodes} 
        connections={connections} 
        width={500} 
        height={300}
        highlightPath={activePath}
      />
      
      {showValues && (
        <div className="mt-4 p-4 bg-neutral-800 rounded-lg text-neutral-300">
          <p className="font-semibold mb-2">KVL Equation:</p>
          <p className="font-mono">E - V<sub>R1</sub> - V<sub>R2</sub> = 0</p>
          <p className="font-mono">12V - 4.54V - 7.46V = 0V</p>
          <p className="text-green-400 mt-2">✓ Kirchhoff's Voltage Law is verified!</p>
        </div>
      )}
    </div>
  )
}

// Example Thevenin circuit
export const TheveninCircuit = ({ highlightPath = [] }) => {
  const [activePath, setActivePath] = useState<string[]>([])
  const [showValues, setShowValues] = useState(false)
  const [showThevenin, setShowThevenin] = useState(false)

  useEffect(() => {
    if (highlightPath.length > 0) {
      setActivePath(highlightPath)
    }
  }, [highlightPath])

  const handleToggleValues = () => {
    setShowValues(!showValues)
  }

  const handleToggleThevenin = () => {
    setShowThevenin(!showThevenin)
  }

  const originalNodes = [
    { id: 'source', x: 100, y: 150, type: 'source', label: 'E', voltage: showValues ? 22 : undefined },
    { id: 'node1', x: 100, y: 100, type: 'node' },
    { id: 'node2', x: 200, y: 100, type: 'node' },
    { id: 'node3', x: 300, y: 100, type: 'node' },
    { id: 'node4', x: 300, y: 200, type: 'node' },
    { id: 'node5', x: 200, y: 200, type: 'node' },
    { id: 'node6', x: 100, y: 200, type: 'node' },
    { id: 'resistor1', x: 150, y: 100, type: 'resistor', label: 'R1', value: showValues ? '330Ω' : undefined },
    { id: 'resistor2', x: 250, y: 100, type: 'resistor', label: 'R2', value: showValues ? '330Ω' : undefined },
    { id: 'resistor3', x: 300, y: 150, type: 'resistor', label: 'R3', value: showValues ? '330Ω' : undefined, rotation: 90 },
    { id: 'resistor4', x: 200, y: 150, type: 'resistor', label: 'RL', value: showValues ? '1kΩ' : undefined, rotation: 90 },
    { id: 'ground', x: 100, y: 250, type: 'ground' }
  ]

  const originalConnections = [
    { from: 'source', to: 'node1' },
    { from: 'node1', to: 'resistor1' },
    { from: 'resistor1', to: 'node2' },
    { from: 'node2', to: 'resistor2' },
    { from: 'resistor2', to: 'node3' },
    { from: 'node3', to: 'resistor3' },
    { from: 'resistor3', to: 'node4' },
    { from: 'node4', to: 'node5' },
    { from: 'node5', to: 'node6' },
    { from: 'node6', to: 'source' },
    { from: 'node2', to: 'resistor4' },
    { from: 'resistor4', to: 'node5' },
    { from: 'source', to: 'ground' }
  ]

  const theveninNodes = [
    { id: 'thev_source', x: 150, y: 150, type: 'source', label: 'VTH', voltage: showValues ? 11.25 : undefined },
    { id: 'thev_node1', x: 150, y: 100, type: 'node' },
    { id: 'thev_node2', x: 250, y: 100, type: 'node' },
    { id: 'thev_node3', x: 250, y: 200, type: 'node' },
    { id: 'thev_node4', x: 150, y: 200, type: 'node' },
    { id: 'thev_resistor1', x: 200, y: 100, type: 'resistor', label: 'RTH', value: showValues ? '490Ω' : undefined },
    { id: 'thev_resistor2', x: 250, y: 150, type: 'resistor', label: 'RL', value: showValues ? '1kΩ' : undefined, rotation: 90 },
    { id: 'thev_ground', x: 150, y: 250, type: 'ground' }
  ]

  const theveninConnections = [
    { from: 'thev_source', to: 'thev_node1' },
    { from: 'thev_node1', to: 'thev_resistor1' },
    { from: 'thev_resistor1', to: 'thev_node2' },
    { from: 'thev_node2', to: 'thev_resistor2' },
    { from: 'thev_resistor2', to: 'thev_node3' },
    { from: 'thev_node3', to: 'thev_node4' },
    { from: 'thev_node4', to: 'thev_source' },
    { from: 'thev_source', to: 'thev_ground' }
  ]

  return (
    <div className="experiment-interactive w-full min-w-0 max-w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-base sm:text-lg font-semibold text-white break-words min-w-0">Thevenin&apos;s Theorem Demonstration</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleToggleValues} 
            className="px-3 py-1.5 bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 rounded-md text-sm transition-colors"
          >
            {showValues ? "Hide Values" : "Show Values"}
          </button>
          <button 
            onClick={handleToggleThevenin} 
            className="px-3 py-1.5 bg-purple-900/30 hover:bg-purple-800/50 text-purple-300 rounded-md text-sm transition-colors"
          >
            {showThevenin ? "Show Original" : "Show Thevenin"}
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {!showThevenin ? (
          <motion.div
            key="original"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCircuit 
              nodes={originalNodes} 
              connections={originalConnections} 
              width={500} 
              height={300}
              highlightPath={activePath}
            />
            <div className="mt-2 text-sm text-neutral-400">Original Circuit</div>
          </motion.div>
        ) : (
          <motion.div
            key="thevenin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveCircuit 
              nodes={theveninNodes} 
              connections={theveninConnections} 
              width={500} 
              height={300}
              highlightPath={activePath}
            />
            <div className="mt-2 text-sm text-neutral-400">Thevenin Equivalent Circuit</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showValues && (
        <div className="mt-4 p-4 bg-neutral-800 rounded-lg text-neutral-300">
          {!showThevenin ? (
            <>
              <p className="font-semibold mb-2">Original Circuit Analysis:</p>
              <p className="font-mono">Load current (I<sub>L</sub>) = 7.1mA</p>
              <p className="font-mono">Load voltage (V<sub>L</sub>) = 7.1V</p>
            </>
          ) : (
            <>
              <p className="font-semibold mb-2">Thevenin Equivalent:</p>
              <p className="font-mono">V<sub>TH</sub> = 11.25V</p>
              <p className="font-mono">R<sub>TH</sub> = 490Ω</p>
              <p className="font-mono">Load current (I<sub>L</sub>) = 7.1mA</p>
              <p className="font-mono">Load voltage (V<sub>L</sub>) = 7.1V</p>
              <p className="text-green-400 mt-2">✓ Thevenin's Theorem is verified!</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
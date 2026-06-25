"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lightbulb, Zap, RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react"

interface Circuit3DViewerProps {
  experimentId: number
  title: string
  embedId: string
}

export const Circuit3DViewer = ({ experimentId, title, embedId }: Circuit3DViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      setZoomLevel(zoomLevel + 10)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 70) {
      setZoomLevel(zoomLevel - 10)
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const toggleRotation = () => {
    setIsRotating(!isRotating)
  }

  return (
    <div 
      ref={containerRef} 
      className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 border-b border-neutral-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {experimentId <= 2 ? (
            <Zap className="h-5 w-5 text-yellow-400" />
          ) : (
            <Lightbulb className="h-5 w-5 text-yellow-400" />
          )}
          <h3 className="text-xl font-bold text-white">{title} - 3D Circuit View</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleZoomOut}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
            title="Zoom Out"
            disabled={zoomLevel <= 70}
          >
            <ZoomOut className={`h-4 w-4 ${zoomLevel <= 70 ? 'text-neutral-600' : 'text-neutral-400'}`} />
          </button>
          <div className="text-xs text-neutral-400 w-10 text-center">{zoomLevel}%</div>
          <button 
            onClick={handleZoomIn}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
            title="Zoom In"
            disabled={zoomLevel >= 150}
          >
            <ZoomIn className={`h-4 w-4 ${zoomLevel >= 150 ? 'text-neutral-600' : 'text-neutral-400'}`} />
          </button>
          <button 
            onClick={toggleRotation}
            className={`p-2 rounded-full hover:bg-neutral-800 transition-colors ${isRotating ? 'bg-blue-900/30' : ''}`}
            title="Toggle Auto-Rotation"
          >
            <RotateCw className={`h-4 w-4 ${isRotating ? 'text-blue-300' : 'text-neutral-400'}`} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-neutral-400" />
            ) : (
              <Maximize2 className="h-4 w-4 text-neutral-400" />
            )}
          </button>
        </div>
      </div>
      
      <div className="relative" style={{ height: "500px" }}>
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950">
            <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin mb-4"></div>
            <p className="text-neutral-400">Loading 3D Circuit...</p>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div 
              className={`w-full h-full transition-transform duration-300 ease-in-out ${isRotating ? 'animate-slow-spin' : ''}`}
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <iframe 
                src={`https://www.tinkercad.com/embed/${embedId}?editbtn=1`}
                width="100%" 
                height="100%" 
                className="border-none"
                title={title}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Overlay gradient effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-950/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-neutral-950/50 to-transparent"></div>
          <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-neutral-950/50 to-transparent"></div>
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-neutral-950/50 to-transparent"></div>
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral-800">
        <p className="text-sm text-neutral-400">
          This interactive 3D model allows you to explore the circuit from all angles. Use your mouse to rotate and zoom.
          Click on components to see their properties.
        </p>
        <div className="mt-2 text-xs text-neutral-500">
          Powered by Tinkercad. If the model doesn't load properly, you can also 
          <a 
            href={`https://www.tinkercad.com/things/${embedId}/edit`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 ml-1"
          >
            view it directly on Tinkercad
          </a>.
        </div>
      </div>
    </div>
  )
}

// Add this to your tailwind.config.js:
// extend: {
//   animation: {
//     'slow-spin': 'spin 20s linear infinite',
//   },
// },
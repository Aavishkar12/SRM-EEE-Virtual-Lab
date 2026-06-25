"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Create circuit board
    const circuitBoardGeometry = new THREE.PlaneGeometry(4, 4)
    const circuitBoardMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a5fb4,
      metalness: 0.3,
      roughness: 0.7,
    })
    const circuitBoard = new THREE.Mesh(circuitBoardGeometry, circuitBoardMaterial)
    scene.add(circuitBoard)

    // Add circuit traces
    const traceGeometry = new THREE.BoxGeometry(0.05, 2, 0.02)
    const traceMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 })

    for (let i = 0; i < 8; i++) {
      const trace = new THREE.Mesh(traceGeometry, traceMaterial)
      trace.position.x = -1.5 + i * 0.4
      trace.position.z = 0.01
      circuitBoard.add(trace)
    }

    // Add components

    // Resistor
    const resistorGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16)
    const resistorMaterial = new THREE.MeshStandardMaterial({ color: 0xbf4040 })
    const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial)
    resistor.position.set(-1.5, 0.8, 0.15)
    resistor.rotation.x = Math.PI / 2
    circuitBoard.add(resistor)

    // Capacitor
    const capacitorBaseGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.2)
    const capacitorMaterial = new THREE.MeshStandardMaterial({ color: 0x3584e4 })
    const capacitor = new THREE.Mesh(capacitorBaseGeometry, capacitorMaterial)
    capacitor.position.set(0, 0.8, 0.1)
    circuitBoard.add(capacitor)

    // IC Chip
    const chipGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.1)
    const chipMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
    const chip = new THREE.Mesh(chipGeometry, chipMaterial)
    chip.position.set(1.5, 0, 0.05)
    circuitBoard.add(chip)

    // Pins for the chip
    const pinGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05)
    const pinMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 })

    for (let i = 0; i < 6; i++) {
      const pin1 = new THREE.Mesh(pinGeometry, pinMaterial)
      pin1.position.set(1.2 + i * 0.1, 0.3, 0.05)
      circuitBoard.add(pin1)

      const pin2 = new THREE.Mesh(pinGeometry, pinMaterial)
      pin2.position.set(1.2 + i * 0.1, -0.3, 0.05)
      circuitBoard.add(pin2)
    }

    // LED
    const ledBaseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16)
    const ledMaterial = new THREE.MeshStandardMaterial({
      color: 0x33d17a,
      emissive: 0x33d17a,
      emissiveIntensity: 0.5,
    })
    const led = new THREE.Mesh(ledBaseGeometry, ledMaterial)
    led.position.set(-0.5, -0.8, 0.05)
    circuitBoard.add(led)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate the circuit board slightly
      circuitBoard.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2
      circuitBoard.rotation.y = Math.sin(Date.now() * 0.0003) * 0.2

      // Pulse the LED
      const pulseIntensity = (Math.sin(Date.now() * 0.003) + 1) / 2
      ledMaterial.emissiveIntensity = 0.2 + pulseIntensity * 0.8

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-0" />
}


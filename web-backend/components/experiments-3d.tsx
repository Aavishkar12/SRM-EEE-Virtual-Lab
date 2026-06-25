'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function KVL3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 3, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Breadboard
    const breadboardGeo = new THREE.BoxGeometry(8, 0.5, 6);
    const breadboardMat = new THREE.MeshStandardMaterial({ color: 0x2d4c1e, roughness: 0.6 });
    const breadboard = new THREE.Mesh(breadboardGeo, breadboardMat);
    breadboard.position.y = 0.25;
    breadboard.castShadow = true;
    breadboard.receiveShadow = true;
    scene.add(breadboard);
    
    // Components
    // Battery 1
    const batteryGeo = new THREE.BoxGeometry(0.8, 1.5, 0.8);
    const batteryMat1 = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const battery1 = new THREE.Mesh(batteryGeo, batteryMat1);
    battery1.position.set(-3, 1, 0);
    battery1.castShadow = true;
    scene.add(battery1);
    
    // Resistor 1
    const resistorGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const resistorMat = new THREE.MeshStandardMaterial({ color: 0xffd166 });
    const resistor1 = new THREE.Mesh(resistorGeo, resistorMat);
    resistor1.position.set(-1, 1, 0);
    resistor1.rotation.z = Math.PI / 2;
    resistor1.castShadow = true;
    scene.add(resistor1);
    
    // Resistor 2
    const resistor2 = new THREE.Mesh(resistorGeo, resistorMat);
    resistor2.position.set(1, 1, 0);
    resistor2.rotation.z = Math.PI / 2;
    resistor2.castShadow = true;
    scene.add(resistor2);
    
    // Wires (cylinders)
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.3 });
    
    const wire1 = new THREE.Mesh(wireGeo, wireMat);
    wire1.scale.y = 2;
    wire1.position.set(-2, 1, 0);
    wire1.rotation.z = Math.PI / 2;
    scene.add(wire1);
    
    const wire2 = new THREE.Mesh(wireGeo, wireMat);
    wire2.scale.y = 2;
    wire2.position.set(0, 1, 0);
    wire2.rotation.z = Math.PI / 2;
    scene.add(wire2);
    
    // Voltage labels (sprites)
    const createLabel = (text: string, position: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 256;
      canvas.height = 128;
      ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
      ctx.fillRect(0, 0, 256, 128);
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#00ff88';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(2, 1, 1);
      scene.add(sprite);
    };
    
    createLabel('12V', new THREE.Vector3(-3, 2.2, 0));
    createLabel('V1', new THREE.Vector3(-1, 2.2, 0));
    createLabel('V2', new THREE.Vector3(1, 2.2, 0));
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Pulse wires
      wireMat.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.2;
      
      // Slight component movement
      battery1.position.y = 1 + Math.sin(time * 1.5) * 0.05;
      resistor1.position.y = 1 + Math.sin(time * 1.5 + 1) * 0.05;
      resistor2.position.y = 1 + Math.sin(time * 1.5 + 2) * 0.05;
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />;
}

export function Thevenin3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(5, 5, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Original circuit group
    const originalGroup = new THREE.Group();
    
    // Breadboard
    const breadboardGeo = new THREE.BoxGeometry(5, 0.3, 4);
    const breadboardMat = new THREE.MeshStandardMaterial({ color: 0x2d4c1e, roughness: 0.6 });
    const breadboard1 = new THREE.Mesh(breadboardGeo, breadboardMat);
    breadboard1.position.set(-4, 0.15, 0);
    originalGroup.add(breadboard1);
    
    // Battery
    const batteryGeo = new THREE.BoxGeometry(0.6, 1, 0.6);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const battery = new THREE.Mesh(batteryGeo, batteryMat);
    battery.position.set(-5, 0.8, 0);
    originalGroup.add(battery);
    
    // Resistors
    const resistorGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 12);
    const resistorMat = new THREE.MeshStandardMaterial({ color: 0xffd166 });
    const r1 = new THREE.Mesh(resistorGeo, resistorMat);
    r1.position.set(-4, 0.8, 0.8);
    r1.rotation.z = Math.PI / 2;
    originalGroup.add(r1);
    
    const r2 = new THREE.Mesh(resistorGeo, resistorMat);
    r2.position.set(-3, 0.8, 0);
    r2.rotation.z = Math.PI / 2;
    originalGroup.add(r2);
    
    const r3 = new THREE.Mesh(resistorGeo, resistorMat);
    r3.position.set(-4, 0.8, -0.8);
    r3.rotation.z = Math.PI / 2;
    originalGroup.add(r3);
    
    scene.add(originalGroup);
    
    // Thevenin equivalent group
    const theveninGroup = new THREE.Group();
    
    const breadboard2 = new THREE.Mesh(breadboardGeo, breadboardMat);
    breadboard2.position.set(4, 0.15, 0);
    theveninGroup.add(breadboard2);
    
    const vth = new THREE.Mesh(batteryGeo, batteryMat);
    vth.position.set(3, 0.8, 0);
    theveninGroup.add(vth);
    
    const rth = new THREE.Mesh(resistorGeo, new THREE.MeshStandardMaterial({ color: 0x4cc9f0 }));
    rth.position.set(4, 0.8, 0);
    rth.rotation.z = Math.PI / 2;
    theveninGroup.add(rth);
    
    scene.add(theveninGroup);
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      originalGroup.rotation.y = Math.sin(time * 0.5) * 0.2;
      theveninGroup.rotation.y = Math.sin(time * 0.5 + Math.PI) * 0.2;
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />;
}

export function Diode3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bias, setBias] = useState<'forward' | 'reverse'>('forward');
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 3, 6);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00ff88, 1, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00aaff, 1, 10);
    pointLight2.position.set(-3, 3, 3);
    scene.add(pointLight2);
    
    // Diode body (using cylinder instead of capsule)
    const diodeGroup = new THREE.Group();
    const diodeBodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
    const diodeBodyMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x333333, 
      metalness: 0.1, 
      roughness: 0.3,
      clearcoat: 0.5
    });
    const diodeBody = new THREE.Mesh(diodeBodyGeo, diodeBodyMat);
    diodeGroup.add(diodeBody);
    
    // Add spheres to ends to simulate capsule
    const endGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const end1 = new THREE.Mesh(endGeo, diodeBodyMat);
    end1.position.y = 0.6;
    diodeGroup.add(end1);
    
    const end2 = new THREE.Mesh(endGeo, diodeBodyMat);
    end2.position.y = -0.6;
    diodeGroup.add(end2);
    
    diodeGroup.rotation.z = Math.PI / 2;
    scene.add(diodeGroup);
    
    // Anode (red)
    const anodeGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 16);
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff4444, emissiveIntensity: 0.3 });
    const anode = new THREE.Mesh(anodeGeo, anodeMat);
    anode.position.set(-0.9, 0, 0);
    anode.rotation.z = Math.PI / 2;
    scene.add(anode);
    
    // Cathode (black with silver stripe)
    const cathodeGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 16);
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
    cathode.position.set(0.9, 0, 0);
    cathode.rotation.z = Math.PI / 2;
    scene.add(cathode);
    
    const stripeGeo = new THREE.TorusGeometry(0.36, 0.06, 8, 16);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0.6, 0, 0);
    stripe.rotation.y = Math.PI / 2;
    scene.add(stripe);
    
    // Particles for current
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({ color: 0x00ffaa, size: 0.05, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;
      
      // Pulse diode
      diodeGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
      diodeGroup.position.y = Math.sin(time * 1.2) * 0.1;
      
      // Animate particles
      const posAttribute = particles.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let x = posAttribute.getX(i);
        const direction = bias === 'forward' ? 1 : -1;
        x += 0.05 * direction;
        
        if (x > 5) x = -5;
        if (x < -5) x = 5;
        
        posAttribute.setX(i, x);
      }
      posAttribute.needsUpdate = true;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [bias]);
  
  return (
    <div className="space-y-4">
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setBias('forward')}
          className={`px-4 py-2 rounded-lg transition-all ${bias === 'forward' ? 'bg-green-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
        >
          Forward Bias
        </button>
        <button
          onClick={() => setBias('reverse')}
          className={`px-4 py-2 rounded-lg transition-all ${bias === 'reverse' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
        >
          Reverse Bias
        </button>
      </div>
    </div>
  );
}

export function Rectifier3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 4, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 10, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    // Transformer
    const transformerGroup = new THREE.Group();
    const coreGeo = new THREE.BoxGeometry(1, 1.5, 0.5);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    transformerGroup.add(core);
    
    // Windings
    const windingGeo = new THREE.TorusGeometry(0.3, 0.08, 8, 16);
    const windingMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const primary = new THREE.Mesh(windingGeo, windingMat);
    primary.position.x = -0.4;
    primary.rotation.y = Math.PI / 2;
    transformerGroup.add(primary);
    
    const secondary = new THREE.Mesh(windingGeo, windingMat);
    secondary.position.x = 0.4;
    secondary.rotation.y = Math.PI / 2;
    transformerGroup.add(secondary);
    
    transformerGroup.position.set(-3, 1, 0);
    scene.add(transformerGroup);
    
    // 4 Diodes in bridge
    const diodes = [];
    const diodePos = [
      { x: -1, y: 0.5, z: 0.5 },
      { x: 1, y: 0.5, z: 0.5 },
      { x: -1, y: 0.5, z: -0.5 },
      { x: 1, y: 0.5, z: -0.5 }
    ];
    
    for (const pos of diodePos) {
      const diodeGroup = new THREE.Group();
      const diodeBodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 12);
      const diodeMat = new THREE.MeshStandardMaterial({ color: 0x333333, clearcoat: 0.3 });
      const diodeBody = new THREE.Mesh(diodeBodyGeo, diodeMat);
      diodeGroup.add(diodeBody);
      
      const endGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const end1 = new THREE.Mesh(endGeo, diodeMat);
      end1.position.y = 0.3;
      diodeGroup.add(end1);
      
      const end2 = new THREE.Mesh(endGeo, diodeMat);
      end2.position.y = -0.3;
      diodeGroup.add(end2);
      
      diodeGroup.position.set(pos.x, pos.y, pos.z);
      diodeGroup.rotation.z = Math.PI / 2;
      scene.add(diodeGroup);
      diodes.push(diodeGroup);
    }
    
    // Capacitor
    const capGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x4488ff });
    const capacitor = new THREE.Mesh(capGeo, capMat);
    capacitor.position.set(3, 1, 0);
    scene.add(capacitor);
    
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(15, 10);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;
      
      // Rotate transformer
      transformerGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
      
      // Pulse diodes
      diodes.forEach((diode, i) => {
        diode.position.y = 0.5 + Math.sin(time * 3 + i) * 0.05;
      });
      
      capacitor.position.y = 1 + Math.sin(time * 1.5) * 0.05;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />;
}

export function LogicGates3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 3, 6);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    
    // Gate body (AND shape)
    const group = new THREE.Group();
    
    // Input A
    const inputAGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const inputAMat = new THREE.MeshStandardMaterial({ 
      color: inputA ? 0x00ff00 : 0x333333, 
      emissive: inputA ? 0x00ff00 : 0x000000,
      emissiveIntensity: inputA ? 0.5 : 0
    });
    const inputASphere = new THREE.Mesh(inputAGeo, inputAMat);
    inputASphere.position.set(-1.5, 0.5, 0.5);
    group.add(inputASphere);
    
    // Input B
    const inputBMat = new THREE.MeshStandardMaterial({ 
      color: inputB ? 0x00ff00 : 0x333333, 
      emissive: inputB ? 0x00ff00 : 0x000000,
      emissiveIntensity: inputB ? 0.5 : 0
    });
    const inputBSphere = new THREE.Mesh(inputAGeo, inputBMat);
    inputBSphere.position.set(-1.5, 0.5, -0.5);
    group.add(inputBSphere);
    
    // AND Gate body
    const gateGeo = new THREE.ShapeGeometry();
    const shape = new THREE.Shape();
    shape.moveTo(-0.5, -0.7);
    shape.lineTo(-0.5, 0.7);
    shape.lineTo(0.3, 0.7);
    shape.quadraticCurveTo(0.8, 0.7, 0.8, 0);
    shape.quadraticCurveTo(0.8, -0.7, 0.3, -0.7);
    shape.lineTo(-0.5, -0.7);
    
    const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 };
    const gateMesh = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x2244aa, metalness: 0.3, roughness: 0.6 });
    const gate = new THREE.Mesh(gateMesh, gateMat);
    gate.rotation.x = -Math.PI / 2;
    gate.position.y = 0.5;
    group.add(gate);
    
    // Output
    const output = inputA && inputB;
    const outputMat = new THREE.MeshStandardMaterial({ 
      color: output ? 0x00ff88 : 0x333333, 
      emissive: output ? 0x00ff88 : 0x000000,
      emissiveIntensity: output ? 0.7 : 0
    });
    const outputSphere = new THREE.Mesh(inputAGeo, outputMat);
    outputSphere.position.set(1.5, 0.5, 0);
    group.add(outputSphere);
    
    scene.add(group);
    
    // Base
    const baseGeo = new THREE.BoxGeometry(6, 0.2, 4);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.1;
    scene.add(base);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      group.rotation.y = Math.sin(time * 0.3) * 0.1;
      group.position.y = Math.sin(time * 1.2) * 0.05;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [inputA, inputB]);
  
  return (
    <div className="space-y-4">
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setInputA(!inputA)}
          className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${inputA ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
        >
          Input A: {inputA ? '1' : '0'}
        </button>
        <button
          onClick={() => setInputB(!inputB)}
          className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${inputB ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
        >
          Input B: {inputB ? '1' : '0'}
        </button>
      </div>
      <p className="text-center text-neutral-400">
        Output: <span className={inputA && inputB ? 'text-green-400 font-bold' : 'text-neutral-600'}>{inputA && inputB ? '1' : '0'}</span>
      </p>
    </div>
  );
}

export function HouseWiring3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightsOn, setLightsOn] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(6, 5, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, lightsOn ? 0.8 : 0.4);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffeecc, lightsOn ? 0.3 : 0.8);
    sunLight.position.set(10, 15, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);
    
    // House
    const houseGroup = new THREE.Group();
    
    // Base
    const baseGeo = new THREE.BoxGeometry(8, 0.3, 6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.15;
    houseGroup.add(base);
    
    // Walls
    const wallGeo = new THREE.BoxGeometry(8, 3, 0.3);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffeedd });
    
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 1.8, -3);
    houseGroup.add(backWall);
    
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.position.set(-4, 1.8, 0);
    leftWall.rotation.y = Math.PI / 2;
    houseGroup.add(leftWall);
    
    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.position.set(4, 1.8, 0);
    rightWall.rotation.y = Math.PI / 2;
    houseGroup.add(rightWall);
    
    // Roof
    const roofGeo = new THREE.ConeGeometry(6, 2, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 4;
    roof.rotation.y = Math.PI / 4;
    houseGroup.add(roof);
    
    // Door
    const doorGeo = new THREE.BoxGeometry(1.2, 2, 0.2);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 1.3, -2.7);
    houseGroup.add(door);
    
    // Windows
    const windowGeo = new THREE.BoxGeometry(1, 1, 0.2);
    const windowMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x88ccff, 
      transparent: true, 
      opacity: 0.6, 
      metalness: 0.1, 
      roughness: 0.1
    });
    const window1 = new THREE.Mesh(windowGeo, windowMat);
    window1.position.set(-2.5, 2, -2.7);
    houseGroup.add(window1);
    
    const window2 = new THREE.Mesh(windowGeo, windowMat);
    window2.position.set(2.5, 2, -2.7);
    houseGroup.add(window2);
    
    scene.add(houseGroup);
    
    // Light bulb inside
    const bulbGroup = new THREE.Group();
    const bulbGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({ 
      color: lightsOn ? 0xffffaa : 0x444444, 
      emissive: lightsOn ? 0xffffaa : 0x000000,
      emissiveIntensity: lightsOn ? 1.5 : 0
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulbGroup.add(bulb);
    
    const bulbLight = new THREE.PointLight(0xffffaa, lightsOn ? 2 : 0, 10);
    bulbLight.position.set(0, 2.5, 0);
    scene.add(bulbLight);
    
    bulbGroup.position.set(0, 3, 0);
    scene.add(bulbGroup);
    
    // Switch
    const switchGeo = new THREE.BoxGeometry(0.4, 0.6, 0.1);
    const switchMat = new THREE.MeshStandardMaterial({ color: lightsOn ? 0x00ff00 : 0x333333 });
    const switchMesh = new THREE.Mesh(switchGeo, switchMat);
    switchMesh.position.set(2, 2, -2.8);
    houseGroup.add(switchMesh);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      if (lightsOn) {
        bulbLight.intensity = 2 + Math.sin(time * 5) * 0.2;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [lightsOn]);
  
  return (
    <div className="space-y-4">
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />
      <div className="flex justify-center">
        <button
          onClick={() => setLightsOn(!lightsOn)}
          className={`px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-lg ${lightsOn ? 'bg-yellow-500 text-black shadow-yellow-500/30' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
        >
          {lightsOn ? '💡 Lights ON' : '🔦 Lights OFF'}
        </button>
      </div>
    </div>
  );
}

export function EnergyMeter3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 3, 6);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    // Meter box
    const boxGeo = new THREE.BoxGeometry(3, 4, 1.5);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    scene.add(box);
    
    // Glass cover
    const glassGeo = new THREE.BoxGeometry(2.6, 3.6, 0.1);
    const glassMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x88ccff, 
      transparent: true, 
      opacity: 0.3, 
      metalness: 0, 
      roughness: 0,
      clearcoat: 1
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = 0.8;
    scene.add(glass);
    
    // Spinning disc
    const discGroup = new THREE.Group();
    const discGeo = new THREE.CylinderGeometry(1, 1, 0.1, 32);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8 });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = Math.PI / 2;
    discGroup.add(disc);
    
    // Markings on disc
    const markGeo = new THREE.BoxGeometry(0.1, 0.4, 0.12);
    const markMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    for (let i = 0; i < 4; i++) {
      const mark = new THREE.Mesh(markGeo, markMat);
      mark.rotation.y = (i * Math.PI) / 2;
      mark.position.x = 0.6;
      discGroup.add(mark);
    }
    
    discGroup.position.z = 0.2;
    scene.add(discGroup);
    
    // Display
    const displayGeo = new THREE.BoxGeometry(2, 0.6, 0.1);
    const displayMat = new THREE.MeshStandardMaterial({ color: 0x001100 });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 1.2, 0.7);
    scene.add(display);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.03;
      
      discGroup.rotation.z = time;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />;
}

export function Clipper3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 4, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    
    // Input wave
    const inputWavePoints = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      inputWavePoints.push(new THREE.Vector3(-4 + t * 8, Math.sin(t * 10) * 2, 1));
    }
    const inputWaveGeo = new THREE.BufferGeometry().setFromPoints(inputWavePoints);
    const inputWaveMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const inputWave = new THREE.Line(inputWaveGeo, inputWaveMat);
    scene.add(inputWave);
    
    // Clipped wave
    const clippedWavePoints = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const y = Math.sin(t * 10) * 2;
      const clippedY = Math.max(y, 0.5); // Clipping level
      clippedWavePoints.push(new THREE.Vector3(-4 + t * 8, clippedY, -1));
    }
    const clippedWaveGeo = new THREE.BufferGeometry().setFromPoints(clippedWavePoints);
    const clippedWaveMat = new THREE.LineBasicMaterial({ color: 0xff00ff });
    const clippedWave = new THREE.Line(clippedWaveGeo, clippedWaveMat);
    scene.add(clippedWave);
    
    // Diode
    const diodeGroup = new THREE.Group();
    const diodeBodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const diodeMat = new THREE.MeshStandardMaterial({ color: 0x333333, clearcoat: 0.5 });
    const diodeBody = new THREE.Mesh(diodeBodyGeo, diodeMat);
    diodeGroup.add(diodeBody);
    
    const endGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const end1 = new THREE.Mesh(endGeo, diodeMat);
    end1.position.y = 0.5;
    diodeGroup.add(end1);
    
    const end2 = new THREE.Mesh(endGeo, diodeMat);
    end2.position.y = -0.5;
    diodeGroup.add(end2);
    
    diodeGroup.rotation.z = Math.PI / 2;
    scene.add(diodeGroup);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;
      
      // Animate input wave
      const newInputPoints = [];
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        newInputPoints.push(new THREE.Vector3(-4 + t * 8, Math.sin(t * 10 + time * 3) * 2, 1));
      }
      inputWave.geometry.setFromPoints(newInputPoints);
      
      // Animate clipped wave
      const newClippedPoints = [];
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const y = Math.sin(t * 10 + time * 3) * 2;
        const clippedY = Math.max(y, 0.5);
        newClippedPoints.push(new THREE.Vector3(-4 + t * 8, clippedY, -1));
      }
      clippedWave.geometry.setFromPoints(newClippedPoints);
      
      diodeGroup.rotation.y = time * 0.5;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />;
}

export function OpAmp3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gain, setGain] = useState(2);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 4, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Op-Amp IC
    const icGroup = new THREE.Group();
    const icBodyGeo = new THREE.BoxGeometry(2, 0.6, 1.5);
    const icBodyMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 });
    const icBody = new THREE.Mesh(icBodyGeo, icBodyMat);
    icGroup.add(icBody);
    
    // Pins
    const pinGeo = new THREE.BoxGeometry(0.1, 0.2, 0.2);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 });
    for (let i = 0; i < 4; i++) {
      const pin1 = new THREE.Mesh(pinGeo, pinMat);
      pin1.position.set(-1.05, -0.2, -0.5 + i * 0.33);
      icGroup.add(pin1);
      
      const pin2 = new THREE.Mesh(pinGeo, pinMat);
      pin2.position.set(1.05, -0.2, -0.5 + i * 0.33);
      icGroup.add(pin2);
    }
    
    scene.add(icGroup);
    
    // Input signal
    const inputPoints = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      inputPoints.push(new THREE.Vector3(-4 + t * 2, Math.sin(t * 10) * 0.5, 0));
    }
    const inputGeo = new THREE.BufferGeometry().setFromPoints(inputPoints);
    const inputLine = new THREE.Line(inputGeo, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    scene.add(inputLine);
    
    // Output signal (amplified)
    const outputPoints = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      outputPoints.push(new THREE.Vector3(2 + t * 2, Math.sin(t * 10) * gain, 0));
    }
    const outputGeo = new THREE.BufferGeometry().setFromPoints(outputPoints);
    const outputLine = new THREE.Line(outputGeo, new THREE.LineBasicMaterial({ color: 0xff00ff }));
    scene.add(outputLine);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;
      
      const newInput = [];
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        newInput.push(new THREE.Vector3(-4 + t * 2, Math.sin(t * 10 + time * 3) * 0.5, 0));
      }
      inputLine.geometry.setFromPoints(newInput);
      
      const newOutput = [];
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        newOutput.push(new THREE.Vector3(2 + t * 2, Math.sin(t * 10 + time * 3) * gain, 0));
      }
      outputLine.geometry.setFromPoints(newOutput);
      
      icGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
      icGroup.position.y = Math.sin(time * 1.2) * 0.1;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [gain]);
  
  return (
    <div className="space-y-4">
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />
      <div className="flex gap-4 justify-center items-center">
        <span className="text-neutral-400">Gain:</span>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={gain}
          onChange={(e) => setGain(parseFloat(e.target.value))}
          className="w-48"
        />
        <span className="text-blue-400 font-bold text-xl">{gain}x</span>
      </div>
    </div>
  );
}

export function Adder3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 4, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const createSphere = (x: number, y: number, z: number, on: boolean) => {
      const geo = new THREE.SphereGeometry(0.25, 16, 16);
      const mat = new THREE.MeshStandardMaterial({ 
        color: on ? 0x00ff88 : 0x333333, 
        emissive: on ? 0x00ff88 : 0x000000,
        emissiveIntensity: on ? 0.7 : 0
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      return mesh;
    };
    
    // Inputs
    const inputA = createSphere(-3, 2, 1, a);
    scene.add(inputA);
    
    const inputB = createSphere(-3, 2, -1, b);
    scene.add(inputB);
    
    const inputCin = createSphere(-3, 0.5, 0, cin);
    scene.add(inputCin);
    
    // Calculate outputs
    const sum = a !== b !== cin;
    const count = (a ? 1 : 0) + (b ? 1 : 0) + (cin ? 1 : 0);
    const cout = count >= 2;
    
    // Outputs
    const outputSum = createSphere(3, 2, 0, sum);
    scene.add(outputSum);
    
    const outputCout = createSphere(3, 0.5, 0, cout);
    scene.add(outputCout);
    
    // Logic gates visualization
    const gateGeo = new THREE.BoxGeometry(1, 0.8, 0.3);
    const gateMat = new THREE.MeshStandardMaterial({ color: 0x3366aa });
    const xor1 = new THREE.Mesh(gateGeo, gateMat);
    xor1.position.set(-1, 2, 0);
    scene.add(xor1);
    
    const and1 = new THREE.Mesh(gateGeo, gateMat);
    and1.position.set(-1, 0.5, 0.6);
    scene.add(and1);
    
    const and2 = new THREE.Mesh(gateGeo, gateMat);
    and2.position.set(-1, 0.5, -0.6);
    scene.add(and2);
    
    const or1 = new THREE.Mesh(gateGeo, gateMat);
    or1.position.set(1, 0.5, 0);
    scene.add(or1);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [a, b, cin]);
  
  return (
    <div className="space-y-4">
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setA(!a)}
          className={`px-4 py-2 rounded-lg ${a ? 'bg-green-600' : 'bg-neutral-800'}`}
        >
          A: {a ? '1' : '0'}
        </button>
        <button
          onClick={() => setB(!b)}
          className={`px-4 py-2 rounded-lg ${b ? 'bg-green-600' : 'bg-neutral-800'}`}
        >
          B: {b ? '1' : '0'}
        </button>
        <button
          onClick={() => setCin(!cin)}
          className={`px-4 py-2 rounded-lg ${cin ? 'bg-green-600' : 'bg-neutral-800'}`}
        >
          Cin: {cin ? '1' : '0'}
        </button>
      </div>
      <p className="text-center text-neutral-400">
        Sum: <span className="text-green-400 font-bold">{(a !== b !== cin) ? '1' : '0'}</span> | 
        Cout: <span className="text-yellow-400 font-bold">{((a ? 1 : 0) + (b ? 1 : 0) + (cin ? 1 : 0) >= 2) ? '1' : '0'}</span>
      </p>
    </div>
  );
}

export function Fluorescent3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(0, 3, 6);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, on ? 0.8 : 0.4);
    scene.add(ambientLight);
    
    // Tube
    const tubeGroup = new THREE.Group();
    const tubeGlassGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 32, 1, true);
    const tubeGlassMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xaaffff, 
      transparent: true, 
      opacity: 0.3,
      roughness: 0,
      metalness: 0
    });
    const tubeGlass = new THREE.Mesh(tubeGlassGeo, tubeGlassMat);
    tubeGlass.rotation.z = Math.PI / 2;
    tubeGroup.add(tubeGlass);
    
    // Phosphor coating (inner glow)
    const tubeInnerGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.8, 32);
    const tubeInnerMat = new THREE.MeshStandardMaterial({ 
      color: on ? 0xffffaa : 0x333333, 
      emissive: on ? 0xffffaa : 0x000000,
      emissiveIntensity: on ? 1.5 : 0
    });
    const tubeInner = new THREE.Mesh(tubeInnerGeo, tubeInnerMat);
    tubeInner.rotation.z = Math.PI / 2;
    tubeGroup.add(tubeInner);
    
    scene.add(tubeGroup);
    
    // Bulb light
    const tubeLight = new THREE.PointLight(0xffffaa, on ? 3 : 0, 15);
    tubeLight.position.set(0, 0, 0);
    scene.add(tubeLight);
    
    // Ballast (choke)
    const ballastGeo = new THREE.BoxGeometry(1, 0.8, 0.6);
    const ballastMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const ballast = new THREE.Mesh(ballastGeo, ballastMat);
    ballast.position.set(-2.5, -1, 0);
    scene.add(ballast);
    
    // Starter
    const starterGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const starterMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const starter = new THREE.Mesh(starterGeo, starterMat);
    starter.position.set(2.5, -1, 0);
    scene.add(starter);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;
      
      if (on) {
        tubeInnerMat.emissiveIntensity = 1.5 + Math.sin(time * 10) * 0.2;
        tubeLight.intensity = 3 + Math.sin(time * 8) * 0.3;
      }
      
      tubeGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [on]);
  
  return (
    <div className="space-y-4">
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />
      <div className="flex justify-center">
        <button
          onClick={() => setOn(!on)}
          className={`px-8 py-4 rounded-xl font-bold text-xl transition-all shadow-lg ${on ? 'bg-yellow-500 text-black shadow-yellow-500/30' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
        >
          {on ? '💡 Lamp ON' : '🔦 Lamp OFF'}
        </button>
      </div>
    </div>
  );
}

export function Staircase3DExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  
  const lightOn = switch1 !== switch2;
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1e);
    
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / 500, 0.1, 1000);
    camera.position.set(5, 6, 8);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 500);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, lightOn ? 0.7 : 0.3);
    scene.add(ambientLight);
    
    // Stairs
    const stairsGroup = new THREE.Group();
    const stepGeo = new THREE.BoxGeometry(3, 0.3, 1.2);
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    
    for (let i = 0; i < 8; i++) {
      const step = new THREE.Mesh(stepGeo, stepMat);
      step.position.set(0, i * 0.3, -i * 0.8);
      step.castShadow = true;
      step.receiveShadow = true;
      stairsGroup.add(step);
    }
    
    scene.add(stairsGroup);
    
    // Light bulb at top
    const bulbGroup = new THREE.Group();
    const bulbGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({ 
      color: lightOn ? 0xffffaa : 0x444444, 
      emissive: lightOn ? 0xffffaa : 0x000000,
      emissiveIntensity: lightOn ? 1.5 : 0
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulbGroup.add(bulb);
    
    const bulbLight = new THREE.PointLight(0xffffaa, lightOn ? 3 : 0, 12);
    bulbLight.castShadow = true;
    bulbLight.position.set(0, 3.5, -6);
    scene.add(bulbLight);
    
    bulbGroup.position.copy(bulbLight.position);
    scene.add(bulbGroup);
    
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      if (lightOn) {
        bulbLight.intensity = 3 + Math.sin(time * 5) * 0.3;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 500;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 500);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [switch1, switch2]);
  
  return (
    <div className="space-y-4">
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-neutral-800" />
      <div className="flex gap-8 justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-2">Switch 1 (Ground Floor)</p>
          <button
            onClick={() => setSwitch1(!switch1)}
            className={`px-6 py-3 rounded-lg ${switch1 ? 'bg-green-600' : 'bg-neutral-800'}`}
          >
            {switch1 ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="text-center">
          <p className="text-neutral-400 mb-2">Switch 2 (Top Floor)</p>
          <button
            onClick={() => setSwitch2(!switch2)}
            className={`px-6 py-3 rounded-lg ${switch2 ? 'bg-green-600' : 'bg-neutral-800'}`}
          >
            {switch2 ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      <p className="text-center text-2xl font-bold">
        {lightOn ? '💡 Light is ON!' : '🔦 Light is OFF'}
      </p>
    </div>
  );
}

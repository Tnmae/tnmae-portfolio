import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// 1. Starfield / Asteroid Field (Spans from z=5 to z=-140)
function StarField({ count = 3000, warpSpeed }) {
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 100; // X spread
      temp[i * 3 + 1] = (Math.random() - 0.5) * 100; // Y spread
      temp[i * 3 + 2] = 10 - Math.random() * 150; // Z spread (depth)
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      if (warpSpeed) {
        mesh.current.rotation.z += 0.01;
        const positions = mesh.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 2] += 2.5; // Fast forward movement
          if (positions[i * 3 + 2] > 10) {
            positions[i * 3 + 2] = -140; // Loop back to the deep background
          }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
      } else {
        mesh.current.rotation.z = state.clock.getElapsedTime() * 0.05; // Slow ambient spin
      }
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={particles.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.06} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// 2. Hero Milestone (z=0) - Migrated SaturnDots
function SaturnDots({ position }) {
  const groupRef = useRef();
  const sphereRef = useRef();
  const ringRef = useRef();

  const spherePositions = useMemo(() => {
    const count = 1300;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      const radius = 1.56 + Math.random() * 0.135;
      values[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      values[i * 3 + 1] = radius * Math.cos(theta);
      values[i * 3 + 2] = radius * Math.sin(theta) * Math.sin(phi);
    }
    return values;
  }, []);

  const ringPositions = useMemo(() => {
    const count = 1900;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.37 + Math.random() * 0.42;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      values[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return values;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.14;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.x = t * 0.1;
      sphereRef.current.rotation.y = t * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.12;
    }
  });

  return (
    <group position={position} ref={groupRef} rotation={[0.55, 0.15, 0.12]}>
      <points ref={sphereRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={spherePositions} count={spherePositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#e8c87a" size={0.02} transparent opacity={0.82} sizeAttenuation />
      </points>
      <points ref={ringRef} rotation={[1.13, 0.18, 0.38]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={ringPositions} count={ringPositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#a8cce8" size={0.016} transparent opacity={0.72} sizeAttenuation />
      </points>
    </group>
  );
}

// 3. About Milestone (z=-30) - Wireframe Planet
function WireframePlanet({ position }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(t) * 1.5; // Hover
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[5, 1]} />
        <meshStandardMaterial color="#c8d6ff" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}



// The Camera Controller that maps Scroll to Z-Depth and Mouse to X/Y-Parallax
function CameraController({ scrollProgress }) {
  const smoothScrollRef = useRef(0);
  const targetZMax = -100; // How far back we fly

  useFrame((state) => {
    // 1. Smooth Scroll Interpolation
    smoothScrollRef.current += (scrollProgress - smoothScrollRef.current) * 0.1;
    
    // 2. Camera Z position based on scroll (fly forward)
    // Starting at Z=5 (Hero), moving to Z=-100 (Footer)
    state.camera.position.z = 5.4 + (smoothScrollRef.current * targetZMax);
    
    // 3. Camera X/Y position based on Mouse (Parallax)
    const mouseX = state.mouse.x * 3; // Horizontal sweep
    const mouseY = state.mouse.y * 3; // Vertical sweep
    
    // Smoothly blend mouse parallax into the camera
    state.camera.position.x += (mouseX - state.camera.position.x) * 0.05;
    state.camera.position.y += (mouseY - state.camera.position.y) * 0.05;
    
    // Camera gently looks towards the center/destination
    state.camera.lookAt(0, 0, state.camera.position.z - 20);
  });

  return null;
}

function Scene({ scrollProgress, warpSpeed }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#e8c87a" />
      
      {/* Post Processing for Cinematic Glow - Temporarily disabled for debugging */}
      {/* 
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
      </EffectComposer>
      */}

      <CameraController scrollProgress={scrollProgress} />
      
      {/* Cosmos Environment */}
      <StarField warpSpeed={warpSpeed} />
      
      {/* Story Landmarks */}
      <SaturnDots position={[0, 0, 0]} />                       {/* Hero */}
      <WireframePlanet position={[-8, -2, -30]} />              {/* About */}
    </>
  );
}

export default function Scene3D({ warpSpeed }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = Math.max(0, Math.min(1, window.scrollY / scrollHeight));
          setScrollProgress(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scene-3d-container">
      <Canvas
        camera={{ position: [0, 0, 5.4], fov: 75 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]} /* Capped DPR for performance with Bloom */
      >
        <Scene scrollProgress={scrollProgress} warpSpeed={warpSpeed} />
      </Canvas>
    </div>
  );
}

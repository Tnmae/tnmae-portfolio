import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Detect mobile / coarse pointer — used to reduce GPU load
const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

// 1. Starfield / Asteroid Field (Spans from z=5 to z=-140)
function StarField({ count = 3000, warpSpeed }) {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3]     = (Math.random() - 0.5) * 100;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 100;
      temp[i * 3 + 2] = 10 - Math.random() * 150;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    if (warpSpeed) {
      mesh.current.rotation.z += 0.01;
      const pos = mesh.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 2] += 2.5;
        if (pos[i * 3 + 2] > 10) pos[i * 3 + 2] = -140;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    } else {
      mesh.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={particles} count={particles.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.06} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// 2. Hero Milestone (z=0) - SaturnDots
function SaturnDots({ position, mobile }) {
  const groupRef = useRef();
  const sphereRef = useRef();
  const ringRef   = useRef();

  const sphereCount = mobile ? 400 : 1300;
  const ringCount   = mobile ? 600 : 1900;

  const spherePositions = useMemo(() => {
    const values = new Float32Array(sphereCount * 3);
    for (let i = 0; i < sphereCount; i++) {
      const theta  = Math.acos(2 * Math.random() - 1);
      const phi    = Math.random() * Math.PI * 2;
      const radius = 1.56 + Math.random() * 0.135;
      values[i * 3]     = radius * Math.sin(theta) * Math.cos(phi);
      values[i * 3 + 1] = radius * Math.cos(theta);
      values[i * 3 + 2] = radius * Math.sin(theta) * Math.sin(phi);
    }
    return values;
  }, [sphereCount]);

  const ringPositions = useMemo(() => {
    const values = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = 2.37 + Math.random() * 0.42;
      values[i * 3]     = Math.cos(angle) * radius;
      values[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      values[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return values;
  }, [ringCount]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.14;
    if (sphereRef.current) {
      sphereRef.current.rotation.x = t * 0.1;
      sphereRef.current.rotation.y = t * 0.2;
    }
    if (ringRef.current) ringRef.current.rotation.z = t * 0.12;
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
      meshRef.current.position.y = position[1] + Math.sin(t) * 1.5;
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

// Camera Controller: maps scroll → Z, mouse → X/Y parallax (desktop only)
function CameraController({ scrollProgress, enableParallax }) {
  const smoothScrollRef = useRef(0);
  const targetZMax = -100;

  useFrame((state) => {
    smoothScrollRef.current += (scrollProgress - smoothScrollRef.current) * 0.1;
    state.camera.position.z = 5.4 + smoothScrollRef.current * targetZMax;

    if (enableParallax) {
      const mouseX = state.mouse.x * 3;
      const mouseY = state.mouse.y * 3;
      state.camera.position.x += (mouseX - state.camera.position.x) * 0.05;
      state.camera.position.y += (mouseY - state.camera.position.y) * 0.05;
    } else {
      state.camera.position.x += (0 - state.camera.position.x) * 0.05;
      state.camera.position.y += (0 - state.camera.position.y) * 0.05;
    }

    state.camera.lookAt(0, 0, state.camera.position.z - 20);
  });

  return null;
}

function Scene({ scrollProgress, warpSpeed, mobile }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#e8c87a" />
      <CameraController scrollProgress={scrollProgress} enableParallax={!mobile} />
      <StarField count={mobile ? 800 : 3000} warpSpeed={warpSpeed} />
      <SaturnDots position={[0, 0, 0]} mobile={mobile} />
      <WireframePlanet position={[-8, -2, -30]} />
    </>
  );
}

export default function Scene3D({ warpSpeed }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobile] = useState(() => isMobile());

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
        dpr={mobile ? 1 : [1, 1.5]}
      >
        <Scene scrollProgress={scrollProgress} warpSpeed={warpSpeed} mobile={mobile} />
      </Canvas>
    </div>
  );
}

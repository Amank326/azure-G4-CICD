import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const InteractiveBlob = ({ position, color, scale = 1 }) => {
  const mesh = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (mesh.current) {
      // Smooth rotation
      mesh.current.rotation.x += 0.0003;
      mesh.current.rotation.y += 0.0005;

      // Mouse follow - subtle
      mesh.current.position.x += (mouse.x * 2 - mesh.current.position.x) * 0.01;
      mesh.current.position.y += (mouse.y * 2 - mesh.current.position.y) * 0.01;

      // Floating motion
      mesh.current.position.z = 
        Math.sin(Date.now() * 0.0005) * 0.8;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[2, 8]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.4}
        wireframe={false}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const FloatingRing = ({ position, color, scale = 1, rotationAxis = 'x' }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      if (rotationAxis === 'x') {
        mesh.current.rotation.x += 0.002;
      } else if (rotationAxis === 'y') {
        mesh.current.rotation.y += 0.003;
      } else {
        mesh.current.rotation.z += 0.0025;
      }

      // Subtle floating
      mesh.current.position.y += Math.sin(Date.now() * 0.0003) * 0.005;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusGeometry args={[1.5, 0.2, 16, 100]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

const GlowingParticle = ({ position, color, scale = 0.1 }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
      mesh.current.position.y += Math.sin(Date.now() * 0.001) * 0.001;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
};

const FloatingObjects = ({ scale = 1 }) => {
  return (
    <group scale={scale}>
      {/* Main Interactive Blob - Center */}
      <InteractiveBlob position={[0, 0, 0]} color="#667eea" scale={2} />

      {/* Surrounding Rings */}
      <FloatingRing position={[-5, 2, -3]} color="#764ba2" scale={1} rotationAxis="x" />
      <FloatingRing position={[5, -1, -2]} color="#00d4ff" scale={1.2} rotationAxis="y" />
      <FloatingRing position={[0, 4, -1]} color="#ff0080" scale={0.8} rotationAxis="z" />

      {/* Particle Glow Cluster */}
      <GlowingParticle position={[-3, 3, 2]} color="#00ff88" scale={0.15} />
      <GlowingParticle position={[3, -2, 1]} color="#ffaa00" scale={0.12} />
      <GlowingParticle position={[0, -4, 3]} color="#ff4466" scale={0.18} />
      <GlowingParticle position={[-4, -3, -2]} color="#00ccff" scale={0.14} />
      <GlowingParticle position={[4, 3, -1]} color="#aa00ff" scale={0.16} />

      {/* Secondary Blob */}
      <FloatingRing position={[0, 0, -8]} color="#667eea" scale={0.6} rotationAxis="x" />
    </group>
  );
};

export default FloatingObjects;

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleEffect = ({ count = 300 }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (!meshRef.current) return;

    // Create particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorOptions = [
      new THREE.Color('#ff0080'),
      new THREE.Color('#00ff88'),
      new THREE.Color('#ff8800'),
      new THREE.Color('#0080ff'),
      new THREE.Color('#ff00ff'),
      new THREE.Color('#00ffff'),
      new THREE.Color('#ffff00'),
      new THREE.Color('#ff4444'),
    ];

    for (let i = 0; i < count * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 40;

      // Velocity
      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;

      // Color
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.userData.velocities = velocities;

    meshRef.current.geometry = geometry;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current || !meshRef.current.geometry) return;

    const positions = meshRef.current.geometry.attributes.position.array;
    const velocities = meshRef.current.geometry.userData.velocities;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // Update position
      positions[idx] += velocities[idx];
      positions[idx + 1] += velocities[idx + 1];
      positions[idx + 2] += velocities[idx + 2];

      // Bounce off boundaries
      if (Math.abs(positions[idx]) > 20) velocities[idx] *= -1;
      if (Math.abs(positions[idx + 1]) > 20) velocities[idx + 1] *= -1;
      if (Math.abs(positions[idx + 2]) > 20) velocities[idx + 2] *= -1;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.3}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
};

export default ParticleEffect;

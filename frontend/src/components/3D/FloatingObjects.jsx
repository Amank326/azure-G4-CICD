import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingBox = ({ position, color, scale = 1, speed = 0.005 }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += speed;
      mesh.current.rotation.y += speed;
      mesh.current.position.y += Math.sin(Date.now() * 0.001) * 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.4}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

const FloatingSphere = ({ position, color, scale = 1, speed = 0.003 }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += speed;
      mesh.current.rotation.y += speed * 1.2;
      mesh.current.position.z += Math.cos(Date.now() * 0.001) * 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[0.7, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const FloatingPyramid = ({ position, color, scale = 1, speed = 0.004 }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += speed;
      mesh.current.rotation.z += speed * 0.8;
      mesh.current.position.x += Math.sin(Date.now() * 0.001) * 0.01;
    }
  });

  // Create pyramid geometry
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    // Front face
    0, 1, 0,
    -1, -1, 1,
    1, -1, 1,
    // Right face
    0, 1, 0,
    1, -1, 1,
    1, -1, -1,
    // Back face
    0, 1, 0,
    1, -1, -1,
    -1, -1, -1,
    // Left face
    0, 1, 0,
    -1, -1, -1,
    -1, -1, 1,
  ]);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  return (
    <mesh ref={mesh} position={position} scale={scale} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const FloatingObjects = ({ scale = 1 }) => {
  return (
    <group scale={scale}>
      {/* Boxes */}
      <FloatingBox position={[-5, 2, -5]} color="#ff0080" scale={0.8} />
      <FloatingBox position={[5, -2, -5]} color="#00ff88" scale={0.9} />
      <FloatingBox position={[0, 5, -8]} color="#ff8800" scale={0.7} />

      {/* Spheres */}
      <FloatingSphere position={[-3, -3, 0]} color="#0080ff" scale={1} />
      <FloatingSphere position={[4, 3, 2]} color="#ff00ff" scale={0.8} />
      <FloatingSphere position={[0, -5, -3]} color="#00ffff" scale={0.9} />

      {/* Pyramids */}
      <FloatingPyramid position={[-6, 0, 3]} color="#ffff00" scale={0.7} />
      <FloatingPyramid position={[6, 2, 0]} color="#ff4444" scale={0.8} />
      <FloatingPyramid position={[2, -4, 4]} color="#44ff44" scale={0.65} />

      {/* Center cluster - smaller objects */}
      <FloatingBox position={[-1, 1, 0]} color="#ff0080" scale={0.4} speed={0.008} />
      <FloatingSphere position={[1, -1, 1]} color="#0080ff" scale={0.5} speed={0.006} />
      <FloatingPyramid position={[0, 0, -2]} color="#ffff00" scale={0.45} speed={0.007} />
    </group>
  );
};

export default FloatingObjects;

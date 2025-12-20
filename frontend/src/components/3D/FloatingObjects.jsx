import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingTorus = ({ position, color, scale = 1, speed = 0.003 }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += speed * 0.5;
      mesh.current.rotation.y += speed;
      mesh.current.position.y += Math.sin(Date.now() * 0.0005) * 0.02;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

const FloatingBox = ({ position, color, scale = 1, speed = 0.004 }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += speed * 0.3;
      mesh.current.rotation.y += speed;
      mesh.current.position.z += Math.cos(Date.now() * 0.0005) * 0.015;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

const FloatingSphere = ({ position, color, scale = 1, speed = 0.003 }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += speed * 0.2;
      mesh.current.rotation.y += speed * 0.8;
      mesh.current.position.x += Math.sin(Date.now() * 0.0005) * 0.02;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.85}
        roughness={0.15}
        emissive={color}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
};

const FloatingOctahedron = ({ position, color, scale = 1, speed = 0.0035 }) => {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += speed;
      mesh.current.rotation.y += speed * 0.7;
      mesh.current.position.y += Math.cos(Date.now() * 0.0005) * 0.02;
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        metalness={0.75}
        roughness={0.18}
        emissive={color}
        emissiveIntensity={0.13}
      />
    </mesh>
  );
};

const FloatingObjects = ({ scale = 1 }) => {
  return (
    <group scale={scale}>
      {/* Large Center Sphere */}
      <FloatingSphere position={[0, 2, 0]} color="#667eea" scale={2} speed={0.0015} />

      {/* Surrounding Torii */}
      <FloatingTorus position={[-6, -1, -3]} color="#764ba2" scale={1.3} speed={0.002} />
      <FloatingTorus position={[6, 0, -4]} color="#00d4ff" scale={1.2} speed={0.0022} />

      {/* Boxes */}
      <FloatingBox position={[-4, 5, -2]} color="#ff0080" scale={1.1} speed={0.003} />
      <FloatingBox position={[5, -3, 3]} color="#00ff88" scale={0.9} speed={0.0032} />

      {/* Octahedrons */}
      <FloatingOctahedron position={[0, -5, 2]} color="#ffaa00" scale={1.4} speed={0.0025} />
      <FloatingOctahedron position={[-7, 3, 1]} color="#ff4466" scale={1.2} speed={0.0028} />

      {/* Additional Spheres for balance */}
      <FloatingSphere position={[4, 4, -5]} color="#00ccff" scale={1.3} speed={0.0018} />
      <FloatingSphere position={[-5, -4, 4]} color="#aa00ff" scale={1.0} speed={0.0016} />
    </group>
  );
};

export default FloatingObjects;

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import FloatingObjects from './FloatingObjects';

const Scene3D = ({ enableOrbit = false, cameraPosition = [0, 0, 20], scale = 1 }) => {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      dpr={[1, 2]}
      performance={{ min: 0.5, max: 1 }}
    >
      <PerspectiveCamera
        makeDefault
        position={[cameraPosition[0], cameraPosition[1], cameraPosition[2]]}
        fov={50}
        near={0.1}
        far={1000}
      />

      {/* AICM-Inspired Lighting - Vibrant & Dynamic */}
      <ambientLight intensity={0.5} />
      <pointLight position={[20, 15, 10]} intensity={0.8} color="#667eea" />
      <pointLight position={[-20, 10, 5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[0, -20, 15]} intensity={0.6} color="#ff0080" />
      
      {/* Additional accent lights */}
      <pointLight position={[15, -10, -10]} intensity={0.3} color="#00ff88" />

      {/* 3D Objects */}
      <Suspense fallback={null}>
        <FloatingObjects scale={scale} />
      </Suspense>

      {/* Orbit Controls - Optional */}
      {enableOrbit && <OrbitControls autoRotate autoRotateSpeed={0.2} enableZoom={false} />}

      {/* Subtle Fog */}
      <fog attach="fog" args={['#0a0e27', 10, 100]} />
    </Canvas>
  );
};

export default Scene3D;

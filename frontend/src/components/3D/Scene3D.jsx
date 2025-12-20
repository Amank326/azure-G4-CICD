import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import FloatingObjects from './FloatingObjects';
import ParticleEffect from './ParticleEffect';

const Scene3D = ({ enableOrbit = false, enableStars = true, cameraPosition = [0, 0, 15], scale = 1 }) => {
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
        fov={75}
        near={0.1}
        far={1000}
      />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff00ff" />
      <pointLight position={[10, -10, 10]} intensity={0.4} color="#00ffff" />

      {/* Stars Background */}
      {enableStars && <Stars radius={100} depth={50} count={5000} factor={4} />}

      {/* 3D Objects */}
      <Suspense fallback={null}>
        <FloatingObjects scale={scale} />
        <ParticleEffect count={300} />
      </Suspense>

      {/* Orbit Controls - Optional */}
      {enableOrbit && <OrbitControls autoRotate autoRotateSpeed={2} />}

      {/* Fog for depth */}
      <fog attach="fog" args={['#000000', 5, 50]} />
    </Canvas>
  );
};

export default Scene3D;

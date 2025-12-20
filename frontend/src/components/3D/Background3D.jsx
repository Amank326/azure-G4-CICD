import React from 'react';
import Scene3D from './Scene3D';

const Background3D = ({ children, enableOrbit = false, cameraZ = 20, intensity = 1 }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex' }}>
      {/* 3D Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <Scene3D
          enableOrbit={enableOrbit}
          cameraPosition={[0, 0, cameraZ]}
          scale={intensity}
        />
      </div>

      {/* Multiple Gradient Overlays - AICM Style */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1.5,
        background: `
          radial-gradient(circle at 30% 40%, rgba(102, 126, 234, 0.15) 0%, transparent 35%),
          radial-gradient(circle at 70% 60%, rgba(0, 212, 255, 0.1) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(255, 0, 128, 0.08) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />

      {/* Content Overlay - AICM Glassmorphism */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: 'rgba(10, 14, 39, 0.5)',
        backdropFilter: 'blur(8px) brightness(1.05)',
        WebkitBackdropFilter: 'blur(8px) brightness(1.05)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        pointerEvents: 'auto',
      }}>
        {children}
      </div>
    </div>
  );
};

export default Background3D;

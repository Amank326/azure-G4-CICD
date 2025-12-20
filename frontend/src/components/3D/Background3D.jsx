import React from 'react';
import Scene3D from './Scene3D';

const Background3D = ({ children, enableOrbit = false, cameraZ = 15, intensity = 1 }) => {
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

      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        pointerEvents: 'auto',
      }}>
        {children}
      </div>
    </div>
  );
};

export default Background3D;

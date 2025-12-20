import React, { Suspense } from 'react';
import Analytics from './Analytics';
import { Background3D } from './3D';
import './Dashboard3D.css';

const Analytics3D = ({ files = [] }) => {
  return (
    <div className="dashboard-3d-wrapper">
      <Suspense fallback={null}>
        <Background3D cameraZ={16} intensity={0.7}>
          <div className="dashboard-3d-content">
            <div className="dashboard-header-3d">
              <h1 className="dashboard-title-3d">📊 Analytics Dashboard</h1>
              <p className="dashboard-subtitle-3d">Track and analyze your file management metrics</p>
            </div>
            <div className="dashboard-body-3d">
              <Analytics files={files} />
            </div>
          </div>
        </Background3D>
      </Suspense>
    </div>
  );
};

export default Analytics3D;

import React, { Suspense } from 'react';
import Settings from './Settings';
import { Background3D } from './3D';
import './Dashboard3D.css';

const Settings3D = () => {
  return (
    <div className="dashboard-3d-wrapper">
      <Suspense fallback={null}>
        <Background3D cameraZ={17} intensity={0.75}>
          <div className="dashboard-3d-content">
            <div className="dashboard-header-3d">
              <h1 className="dashboard-title-3d">⚙️ Settings & Configuration</h1>
              <p className="dashboard-subtitle-3d">Customize your cloud storage experience</p>
            </div>
            <div className="dashboard-body-3d">
              <Settings />
            </div>
          </div>
        </Background3D>
      </Suspense>
    </div>
  );
};

export default Settings3D;

import React, { Suspense } from 'react';
import MyFiles from './MyFiles';
import { Background3D } from './3D';
import './Dashboard3D.css';

const MyFiles3D = ({ files, onFileDelete, onFileUpdate }) => {
  return (
    <div className="dashboard-3d-wrapper">
      <Suspense fallback={null}>
        <Background3D cameraZ={16} intensity={0.8}>
          <div className="dashboard-3d-content">
            <div className="dashboard-header-3d">
              <h1 className="dashboard-title-3d">📁 My Files</h1>
              <p className="dashboard-subtitle-3d">Manage and organize all your uploaded files</p>
            </div>
            <div className="dashboard-body-3d">
              <MyFiles 
                files={files}
                onFileDelete={onFileDelete}
                onFileUpdate={onFileUpdate}
              />
            </div>
          </div>
        </Background3D>
      </Suspense>
    </div>
  );
};

export default MyFiles3D;

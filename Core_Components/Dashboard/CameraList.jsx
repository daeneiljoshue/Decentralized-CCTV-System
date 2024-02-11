import React from 'react';

const CameraList = ({ cameras, selectedCamera, onCameraSelect }) => {
  // Handle empty camera list or loading state
  if (!cameras || !Array.isArray(cameras) || cameras.length === 0) {
    return <div>Loading cameras...</div>;
  }

  return (
    <div className="camera-list">
      <h3>Cameras</h3>
      <ul>
        {cameras.map(camera => (
          <li key={camera.id} className={camera.id === selectedCamera.id ? 'selected' : ''}>
            <button onClick={() => onCameraSelect(camera)}>
              {camera.name}
              {camera.isActive && <span className="active-indicator">(Active)</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CameraList;

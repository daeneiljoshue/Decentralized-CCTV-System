import React from 'react';
import LiveStreamThumbnail from '../Dashboard/LiveStreamThumbnails'; // Assuming a separate component for thumbnails

const MultiCameraView = ({ cameras, onCameraSelect }) => {
  return (
    <div className="multi-camera-view">
      {cameras.map(camera => (
        <LiveStreamThumbnail
          key={camera.id}
          camera={camera}
          onClick={() => onCameraSelect(camera)}
        />
      ))}
    </div>
  );
};

export default MultiCameraView;

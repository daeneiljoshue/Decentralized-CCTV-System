import React from 'react';

const LiveStreamThumbnails = ({ cameras, selectedCamera }) => {
  // Ensure cameras data is available
  if (!cameras || !Array.isArray(cameras) || cameras.length === 0) {
    return <div>No cameras available.</div>;
  }

  return (
    <div className="live-stream-thumbnails">
      <h3>Live Streams</h3>
      <div className="thumbnail-grid">
        {cameras.map(camera => (
          <div key={camera.id} className={camera.id === selectedCamera.id ? 'selected' : ''}>
            <img src={camera.liveStreamUrl} alt={camera.name} />
            <div className="camera-info">
              <span className="name">{camera.name}</span>
              {camera.status && <span className="status">{camera.status}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStreamThumbnails;
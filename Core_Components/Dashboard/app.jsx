import React, { useState, useEffect } from 'react';
import ActiveAlerts from './ActiveAlerts';
import CameraList from './CameraList';
import LiveStreamThumbnails from './LiveStreamThumbnails';
import SystemHealthInfo from './SystemHealthInfo';

// API integration and data fetching logic
const fetchCameraData = async () => {
  // Replace with your API call (e.g., using Axios)
  const response = await fetch('/api/cameras');
  const data = await response.json();
  return data;
};

const fetchEventData = async () => {
  // Replace with your API call (e.g., using Axios)
  const response = await fetch('/api/events');
  const data = await response.json();
  return data;
};

const App = () => {
  const [cameraData, setCameraData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cameraData = await fetchCameraData();
      setCameraData(cameraData);
      const eventData = await fetchEventData();
      setEventData(eventData);
    };

    fetchData();
  }, []);

  // Map initialization and camera location management
  useEffect(() => {
    if (!map) {
      return;
    }

    // Add camera markers, handle active state updates
    cameraData.forEach(camera => {
      const marker = L.marker([camera.latitude, camera.longitude]);
      marker.bindPopup(`<b>${camera.name}</b>`).addTo(map);
      if (camera.isActive) {
        marker.setIcon(L.icon({ iconUrl: 'active-camera-icon.png' }));
      }

      // Update marker icon dynamically if active state changes
      // (implement logic using cameraData updates)
    });
  }, [cameraData, map]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <CameraList
          cameras={cameraData}
          selectedCamera={selectedCamera}
          onCameraSelect={setSelectedCamera}
        />
        <ActiveAlerts events={eventData} />
        <SystemHealthInfo />
      </div>
      <div className="main-content">
        {/* Add your content here */}
      </div>  </div>
  );
};

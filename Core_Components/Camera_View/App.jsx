import React, { useState, useEffect } from 'react';
import LiveStreamPlayer from './LiveStreamPlayer';
import MultiCameraView from './MultiCameraView';
import PlaybackControls from './PlaybackControls';
import Recordings from './Recordings';
import ZoomPanControls from './ZoomPanControls';

const fetchCameraData = async (cameraId) => {
  // Replace with your API call (e.g., using Axios)
  const response = await fetch(`/api/cameras/${cameraId}`);
  const data = await response.json();
  return data;
};

const fetchRecordings = async () => {
  // Replace with your API call (e.g., using Axios)
  const response = await fetch('/api/recordings');
  const data = await response.json();
  return data;
};

const App = () => {
  const [cameraId, setCameraId] = useState(null); // Initially no camera selected
  const [cameraData, setCameraData] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [isLive, setIsLive] = useState(true); // Start in live mode by default

  useEffect(() => {
    const fetchData = async () => {
      if (cameraId) {
        const data = await fetchCameraData(cameraId);
        setCameraData(data);
      } else {
        // Fetch a default camera (if applicable)
        // const defaultCamera = ...;
        // setCameraId(defaultCamera.id);
      }
    };

    const fetchRecordingsData = async () => {
      const data = await fetchRecordings();
      setRecordings(data);
    };

    fetchData();
    fetchRecordingsData();
  }, [cameraId]);

  const cameraList = [/* your camera data here */];
  // ... other event handlers and logic for camera selection, playback control,
  // zoom/pan functionality, etc.

  return (
    <div className="camera-view-container">
      <div className="camera-selection">
        {/* Implement camera selection dropdown or list here */}
      </div>
      <div className="camera-view">
        {isLive ? (
          <LiveStreamPlayer url={cameraData?.liveStreamUrl} />
        ) : (
          <Recordings
            recordings={recordings}
            selectedRecording={selectedRecording}
            onRecordingSelect={setSelectedRecording}
            onViewChange={() => setIsLive(true)}
          />
        )}
        <MultiCameraView cameras={cameralist} />
        <ZoomPanControls enabled={isLive && cameraData?.hasZoomPanControls} />
      </div>
      <div className="playback-controls">
        <PlaybackControls
          isLive={isLive} />
          </div>
          </div>
        );
      };

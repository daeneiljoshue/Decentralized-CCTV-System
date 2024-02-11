import React, { useState, useRef } from 'react';

const ZoomPanControls = ({ enabled, cameraViewRef }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [initialY, setInitialY] = useState(0);
  const cameraViewElement = useRef(null);

  const handleMouseDown = (event) => {
    if (!enabled) return;

    if (event.button === 0) { // Left click for panning
      setIsPanning(true);
      setInitialX(event.clientX);
      setInitialY(event.clientY);
    } else if (event.button === 1) { // Middle click for zooming
      setIsZooming(true);
      setInitialX(event.clientX);
      setInitialY(event.clientY);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event) => {
    if (!enabled) return;

    if (isPanning) {
      const deltaX = event.clientX - initialX;
      const deltaY = event.clientY - initialY;
      cameraViewElement.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    } else if (isZooming) {
      const deltaY = event.clientY - initialY;
      const zoomFactor = 1 + (deltaY / 100);
      cameraViewElement.current.style.transform = `scale(${zoomFactor})`;
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsZooming(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="zoom-pan-controls" ref={cameraViewRef} onMouseDown={handleMouseDown}>
      {/* Optional zoom and pan buttons for keyboard/touch compatibility */}
      {/* <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <button onClick={() => panLeft()}>Pan Left</button>
      <button onClick={() => panRight()}>Pan Right</button>
      <button onClick={() => panUp()}>Pan Up</button>
      <button onClick={() => panDown()}>Pan Down</button> */}
    </div>
  );
};

export default ZoomPanControls;

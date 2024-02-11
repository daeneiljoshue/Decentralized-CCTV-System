import React from 'react';
import { LiveStreamPlayer } from './Camera_View/LiveStreamPlayer'; // Assuming integration

const EventDetails = ({ event }) => {
  if (!event) return null; // Handle no event data gracefully
  
  const [cameraLiveStreamUrls, setCameraLiveStreamUrls] = useState({});
{event.relatedCameraId && !cameraLiveStreamUrls[event.relatedCameraId] && (
  <p>Loading live stream URL...</p>
)}

useEffect(() => {
    if (event.relatedCameraId && !cameraLiveStreamUrls[event.relatedCameraId]) {
      // Fetch the live stream URL (replace with your API call)
      fetch(`/api/cameras/${event.relatedCameraId}`)
        .then(response => response.json())
        .then(cameraData => {
          setCameraLiveStreamUrls({
            ...cameraLiveStreamUrls,
            [event.relatedCameraId]: cameraData.liveStreamUrl // Assuming response structure
          });
        })
        .catch(error => console.error('Error fetching camera data:', error));
    }
  }, [event.relatedCameraId, cameraLiveStreamUrls]);
  
  return (
    <div className="event-details">
      <h3>Event Details</h3>
      <ul>
        <li>ID: {event.id}</li>
        <li>Time: {new Date(event.timestamp).toLocaleString()}</li>
        <li>Camera: {event.cameraName}</li>
        <li>Type: {event.type}</li>
        <li>Severity: {event.severity}</li>
        <li>Description: {event.description}</li>
        {event.imageUrl && <img src={event.imageUrl} alt="Event snapshot" />}
      </ul>
      <div className="actions">
        {event.isActive && <button onClick={() => handleAcknowledgeEvent(event.id)}>Acknowledge</button>}
        {event.relatedCameraId && cameraLiveStreamUrls[event.relatedCameraId] && (
          <LiveStreamPlayer url={cameraLiveStreamUrls[event.relatedCameraId]} />
        )}
      </div>
    </div>
  );
};

const handleAcknowledgeEvent = (eventId) => {
  // Implement API call to acknowledge the event
  fetch(`/api/events/${eventId}/acknowledge`, { method: 'PATCH' })
    .then(() => {
      console.log('Event acknowledged');
      // Update event data (optional)
    })
    .catch(error => console.error('Error acknowledging event:', error));
};

export default EventDetails;

import React from 'react';

const ActiveAlerts = ({ events }) => {
  // Ensure data is available and structured correctly
  if (!events || !Array.isArray(events)) {
    return <div>No active alerts to display.</div>;
  }

  // Filter events to get only active ones (if needed)
  const activeEvents = events.filter(event => event.isActive);

  // Display loading indicator if data is being fetched
  if (!activeEvents.length && events.loading) {
    return <div>Loading alerts...</div>;
  }

  // Handle no active alerts case
  if (!activeEvents.length) {
    return <div>No active alerts.</div>;
  }

  // Render individual alert items with details and timestamp
  return (
    <div className="active-alerts">
      <h3>Active Alerts</h3>
      <ul>
        {activeEvents.map(event => (
          <li key={event.id}>
            <div className="alert-item">
              <span className="timestamp">{event.timestamp}</span>
              <span className="message">{event.message}</span>
              {/* Optionally display relevant details like camera name, location, etc. */}
              {/* {event.cameraName && <span>Camera: {event.cameraName}</span>} */}
              {/* {event.location && <span>Location: {event.location}</span>} */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveAlerts;

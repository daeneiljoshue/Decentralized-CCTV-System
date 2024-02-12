import React from 'react';

const TriggeredAlertsList = ({ events, onEventSelect }) => {
  return (
    <div className="triggered-alerts-list">
      <h3>Triggered Alerts</h3>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Camera</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} onClick={() => onEventSelect(event)}>
              <td>{new Date(event.timestamp).toLocaleString()}</td>
              <td>{event.cameraName}</td>
              <td>{event.type}</td>
              <td>{event.severity}</td>
              <td>{event.isActive ? 'Active' : 'Resolved'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TriggeredAlertsList;

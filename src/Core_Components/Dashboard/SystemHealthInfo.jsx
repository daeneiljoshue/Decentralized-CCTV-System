import React from 'react';

const SystemHealthInfo = ({ healthData }) => {
  // Ensure health data is available and structured correctly
  if (!healthData || !Object.keys(healthData).length) {
    return <div>Loading system health information...</div>;
  }

  return (
    <div className="system-health-info">
      <h3>System Health</h3>
      <ul>
        {Object.entries(healthData).map(([key, value]) => (
          <li key={key}>
            <span className="label">{key}:</span>
            <span className="value">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemHealthInfo;

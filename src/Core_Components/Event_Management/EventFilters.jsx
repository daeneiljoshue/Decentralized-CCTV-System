import React, { useState } from 'react';

const EventFilters = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [cameraIds, setCameraIds] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [severities, setSeverities] = useState([]);

  const handleFilterChange = () => {
    // Build filter object based on selected options
    const filters = {
      startDate,
      endDate,
      cameraIds,
      eventTypes,
      severities,
    };

    // Call the provided onFilterChange callback with the filters
    onFilterChange(filters);
  };

  return (
    <div className="event-filters">
      <h3>Filters</h3>
      <div className="filter-group">
        <label htmlFor="date-range">Date Range:</label>
        <div>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>-</span>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-group">
        <label htmlFor="cameras">Cameras:</label>
        <select id="cameras" multiple onChange={(e) => setCameraIds(e.target.value)}>
          {/* Populate options dynamically based on available cameras */}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="event-types">Event Types:</label>
        <select id="event-types" multiple onChange={(e) => setEventTypes(e.target.value)}>
          {/* Populate options dynamically based on supported event types */}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="severities">Severities:</label>
        <select id="severities" multiple onChange={(e) => setSeverities(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <button onClick={handleFilterChange}>Apply Filters</button>
    </div>
  );
};

export default EventFilters;

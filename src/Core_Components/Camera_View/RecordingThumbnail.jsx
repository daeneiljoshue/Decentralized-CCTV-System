import React from 'react';

const RecordingThumbnail = ({ recording, selected, onClick }) => {
  return (
    <li className={`recording-thumbnail ${selected ? 'selected' : ''}`} onClick={onClick}>
      <img src={`/recordings/${recording.id}/thumbnail.jpg`} alt={recording.name} />
      <div className="info">
        <h4>{recording.name}</h4>
        <p>{recording.startTime} - {recording.endTime}</p>
      </div>
    </li>
  );
};

export default RecordingThumbnail;

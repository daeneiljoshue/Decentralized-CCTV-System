import React from 'react';
import ReactPlayer from 'react-player';

const LiveStreamPlayer = ({ url }) => {
  return (
    <div className="live-stream-player">
      <ReactPlayer
        url={url}
        playing={true} // Start playing automatically
        controls={true}
        muted={false} // Initially unmuted
        width="100%"
        height="100%"
        onPlay={() => console.log('Playing live stream')}
        onPause={() => console.log('Pausing live stream')}
        onError={error => console.error('Live stream error:', error)}
      />
    </div>
  );
};

export default LiveStreamPlayer;

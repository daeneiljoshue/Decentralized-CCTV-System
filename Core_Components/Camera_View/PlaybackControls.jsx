import React, { useState, useEffect } from 'react';
import { Player } from 'react-player'; // Using ReactPlayer for consistency

const PlaybackControls = ({ isLive, onPlay, onPause, onSeek, onToggleView }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Initially playing
  const [playbackRate, setPlaybackRate] = useState(1); // Normal speed
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // Toggle controls based on live/recording mode
    const player = Player.getPlayer('live-stream-player');
    if (player) {
      player.togglePlay(); // Ensure initial state matches isPlaying
      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));
      player.on('timeupdate', (event) => setCurrentTime(event.target.currentTime));
    }
  }, [isLive, isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime) => {
    onSeek(newTime);
  };

  return (
    <div className="playback-controls">
      <button onClick={handlePlayPause} disabled={isLive}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={() => setPlaybackRate(playbackRate - 0.5)} disabled={isLive}>
        -0.5x
      </button>
      <button onClick={() => setPlaybackRate(playbackRate + 0.5)} disabled={isLive}>
        +0.5x
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={currentTime}
        onChange={(e) => handleSeek(e.target.value)}
        disabled={isLive}
      />
      <button onClick={onToggleView}>
        {isLive ? 'View Recordings' : 'Go Live'}
      </button>
    </div>
  );
};

export default PlaybackControls;

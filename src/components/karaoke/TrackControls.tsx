// src/components/karaoke/TrackControls.tsx
"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

interface TrackControlsProps {
  selectedTrack: number | string | null;
  isPlaying: boolean;
  onTogglePlay: (e: React.MouseEvent) => void;
}

export default function TrackControls({ 
  selectedTrack, 
  isPlaying, 
  onTogglePlay 
}: TrackControlsProps) {
  if (!selectedTrack) return null;
  
  return (
    <div style={{
      padding: "15px 20px",
      background: "linear-gradient(to top, rgba(18,18,18,1), rgba(18,18,18,0.8))",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      justifyContent: "center"
    }}>
      <button
        style={{
          background: "linear-gradient(135deg, #ff00cc, #660066)",
          border: "none",
          borderRadius: "30px",
          padding: "12px 25px",
          width: "100%",
          maxWidth: "400px",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 0 20px rgba(255, 0, 204, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}
        onClick={onTogglePlay}
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        {isPlaying ? 'Pause Track' : 'Preview Track'}
      </button>
    </div>
  );
}
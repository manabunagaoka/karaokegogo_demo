// src/components/karaoke/TrackList.tsx
"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMusic, faUpload } from '@fortawesome/free-solid-svg-icons';
import TrackItem from './TrackItem';

interface Track {
  id: number | string;
  title: string;
  artist: string;
  duration: string;
  category: string;
  description?: string;
  hasSongVersion?: boolean;
  lyrics?: string;
}

interface TrackListProps {
  tracks: Track[];
  selectedTrack: number | string | null;
  isPlaying: number | string | null;
  onSelectTrack: (trackId: number | string) => void;
  onTogglePlay: (trackId: number | string, event: React.MouseEvent) => void;
  onDeleteTrack: (trackId: number | string, event: React.MouseEvent) => void;
  onUploadClick: () => void;
  onViewLyrics?: (trackId: number | string) => void;
}

export default function TrackList({
  tracks,
  selectedTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  onDeleteTrack,
  onUploadClick,
  onViewLyrics
}: TrackListProps) {
  return (
    <div style={{ 
      padding: "15px 20px", 
      overflowY: "auto", 
      flexGrow: 1
    }}>
      {tracks.length > 0 ? (
        <>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "rgba(255,255,255,0.9)" }}>
            <FontAwesomeIcon icon={faStar} style={{ marginRight: "8px", color: "#ffcc00" }} />
            Available Tracks
          </h3>
          
          {/* Track list */}
          <div>
            {tracks.map(track => (
              <TrackItem
                key={track.id}
                track={track}
                isSelected={selectedTrack === track.id}
                isPlaying={isPlaying === track.id}
                onSelect={onSelectTrack}
                onTogglePlay={onTogglePlay}
                onDelete={onDeleteTrack}
                onViewLyrics={onViewLyrics}
              />
            ))}
          </div>
        </>
      ) : (
        <div style={{ 
          textAlign: "center", 
          marginTop: "40px", 
          color: "rgba(255,255,255,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>
            <FontAwesomeIcon icon={faMusic} />
          </div>
          <p>No tracks available. Upload some tracks to get started!</p>
          <button
            onClick={onUploadClick}
            style={{
              background: "rgba(255,0,204,0.2)",
              border: "1px solid #ff00cc",
              borderRadius: "20px",
              padding: "12px 25px",
              color: "#ff66cc",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            <FontAwesomeIcon icon={faUpload} />
            <span>Upload Your First Track</span>
          </button>
        </div>
      )}
    </div>
  );
}
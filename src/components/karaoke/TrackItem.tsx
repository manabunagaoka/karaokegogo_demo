// src/components/karaoke/TrackItem.tsx
"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';

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

interface TrackItemProps {
  track: Track;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: (trackId: number | string) => void;
  onTogglePlay: (trackId: number | string, event: React.MouseEvent) => void;
  onDelete: (trackId: number | string, event: React.MouseEvent) => void;
  onViewLyrics?: (trackId: number | string) => void;
}

export default function TrackItem({ 
  track, 
  isSelected, 
  isPlaying, 
  onSelect, 
  onTogglePlay, 
  onDelete,
  onViewLyrics
}: TrackItemProps) {
  return (
    <div 
      style={{
        padding: "12px 15px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        marginBottom: "10px",
        background: isSelected 
          ? "rgba(255,0,204,0.15)"
          : "rgba(255,255,255,0.05)",
        border: isSelected 
          ? "1px solid rgba(255,0,204,0.3)"
          : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
      onClick={() => onSelect(track.id)}
    >
      {/* First row with track info */}
      <div style={{ 
        display: "flex",
        alignItems: "center",
        width: "100%"
      }}>
        <button
          onClick={(e) => onTogglePlay(track.id, e)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(255,0,204,0.2)",
            border: "none",
            color: "#ff66cc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "15px",
            cursor: "pointer",
            flexShrink: 0
          }}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <div style={{ 
          flexGrow: 1,
          minWidth: 0 // Allows text to properly truncate
        }}>
          <div style={{ 
            fontSize: "16px", 
            fontWeight: "500",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {track.title}
          </div>
          <div style={{ 
            fontSize: "14px", 
            color: "rgba(255,255,255,0.6)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {track.artist}
          </div>
          {track.description && (
            <div style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.7)",
              marginTop: "4px",
              fontStyle: "italic",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              "{track.description}"
            </div>
          )}
          {track.hasSongVersion && (
            <div style={{
              fontSize: "11px",
              color: "#66ccff",
              marginTop: "3px",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}>
              <span style={{ 
                width: "8px", 
                height: "8px", 
                background: "#66ccff", 
                borderRadius: "50%", 
                display: "inline-block" 
              }}></span>
              Song version available
            </div>
          )}
          {track.lyrics && (
            <div style={{
              fontSize: "11px",
              color: "#66ff99",
              marginTop: "3px",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}>
              <span style={{ 
                width: "8px", 
                height: "8px", 
                background: "#66ff99", 
                borderRadius: "50%", 
                display: "inline-block" 
              }}></span>
              Lyrics included
            </div>
          )}
        </div>
        <div style={{ 
          color: "rgba(255,255,255,0.6)", 
          fontSize: "14px",
          marginLeft: "15px",
          flexShrink: 0
        }}>
          {track.duration}
        </div>
      </div>
      
      {/* Second row with actions */}
      <div style={{ 
        display: "flex",
        justifyContent: "space-between",
        marginTop: "8px",
        alignItems: "center"
      }}>
        <div style={{ 
          fontSize: "12px", 
          color: "rgba(255,255,255,0.5)",
          background: "rgba(255,255,255,0.1)",
          padding: "2px 8px",
          borderRadius: "10px"
        }}>
          {track.category}
        </div>
        <div style={{ 
          display: "flex",
          gap: "10px"
        }}>
          {/* Add View Lyrics button for tracks with lyrics */}
          {track.lyrics && onViewLyrics && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewLyrics(track.id);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: "15px",
                background: "rgba(102,255,153,0.2)",
                border: "1px solid rgba(102,255,153,0.4)",
                color: "#66ff99",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer"
              }}
            >
              View Lyrics
            </button>
          )}
          
          <button
            onClick={(e) => onDelete(track.id, e)}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(255,0,0,0.2)",
              border: "none",
              color: "rgba(255,100,100,0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer"
            }}
          >
            <FontAwesomeIcon icon={faTrash} style={{ fontSize: "14px" }} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(track.id);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "15px",
              background: isSelected 
                ? "linear-gradient(135deg, #ff00cc, #660066)" 
                : "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer"
            }}
          >
            {isSelected ? (
              <>
                <FontAwesomeIcon icon={faCheck} />
                <span>Selected</span>
              </>
            ) : (
              <span>Select</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
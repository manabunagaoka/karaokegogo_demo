"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import CategoryTabs from './CategoryTabs';
import TrackList from './TrackList';
import TrackControls from './TrackControls';
import ComingSoonBanner from '../ui/ComingSoonBanner';

interface TrackPanelProps {
  visible: boolean;
  tracks: any[];
  selectedTrack: number | string | null;
  isPlaying: number | string | null;
  selectedCategory: string;
  searchQuery: string;
  categories: string[];
  onClose: () => void;
  onSelectTrack: (trackId: number | string) => void;
  onTogglePlay: (trackId: number | string, event: React.MouseEvent) => void;
  onDeleteTrack: (trackId: number | string, event: React.MouseEvent) => void;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: string) => void;
  onUploadClick: () => void;
  onToggleSelectedTrack: (e: React.MouseEvent) => void;
  onViewLyrics?: (trackId: number | string) => void;
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
  onFastForward?: () => void;
  onRewind?: () => void;
  onRestart?: () => void;
}

export default function TrackPanel({
  visible,
  tracks,
  selectedTrack,
  isPlaying,
  selectedCategory,
  searchQuery,
  categories,
  onClose,
  onSelectTrack,
  onTogglePlay,
  onDeleteTrack,
  onSearchChange,
  onSelectCategory,
  onUploadClick,
  onToggleSelectedTrack,
  onViewLyrics,
  onNextTrack,
  onPreviousTrack,
  onFastForward,
  onRewind,
  onRestart
}: TrackPanelProps) {
  // Modify TrackList to include the paired tracks functionality
  const enhancedTrackList = (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "0 10px",
      marginTop: "10px"
    }}>
      {tracks.length === 0 ? (
        // Your original empty state component
        <TrackList 
          tracks={tracks}
          selectedTrack={selectedTrack}
          isPlaying={isPlaying}
          onSelectTrack={onSelectTrack}
          onTogglePlay={onTogglePlay}
          onDeleteTrack={onDeleteTrack}
          onUploadClick={onUploadClick}
          onViewLyrics={onViewLyrics}
        />
      ) : (
        // Enhanced track list
        <div style={{ padding: "0 10px" }}>
          {tracks.map((track) => {            
            // Determine if this track is either selected or playing
            const isSelected = selectedTrack === track.id;
            const isCurrentlyPlaying = isPlaying === track.id;
            
            // Handle track play with selection
            const handlePlayTrack = (e: React.MouseEvent) => {
              e.stopPropagation();
              // First select the track if it's not selected
              if (!isSelected) {
                onSelectTrack(track.id);
              }
              // Then toggle play
              onTogglePlay(track.id, e);
            };
            
            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track.id)}
                style={{
                  backgroundColor: isSelected ? "rgba(255, 102, 204, 0.15)" : "rgba(0, 0, 0, 0.2)",
                  border: isSelected ? "1px solid rgba(255, 102, 204, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background-color 0.2s ease",
                  background: isSelected 
                    ? "linear-gradient(135deg, rgba(255,102,204,0.15), rgba(0,0,0,0.3))" 
                    : "linear-gradient(135deg, rgba(36,14,50,0.5), rgba(0,0,0,0.5))"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  flex: 1
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span style={{ 
                      fontSize: "16px", 
                      fontWeight: "600",
                      color: track.popular ? "#ff66cc" : "white"
                    }}>
                      {track.title}
                      {(track.hasSongVersion || track.isKaraokeTrack) && (
                        <span style={{
                          fontSize: "12px",
                          backgroundColor: "rgba(51, 102, 255, 0.3)",
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "10px",
                          marginLeft: "8px",
                          verticalAlign: "middle"
                        }}>
                          Karaoke
                        </span>
                      )}
                    </span>
                  </div>
                  <div style={{ 
                    display: "flex", 
                    gap: "10px",
                    marginTop: "5px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "14px"
                  }}>
                    <span>{track.artist}</span>
                    <span>•</span>
                    <span>{track.duration}</span>
                    <span>•</span>
                    <span>{track.category}</span>
                    {track.isKaraokeTrack && <span>• Karaoke</span>}
                  </div>
                  {track.description && (
                    <div style={{ 
                      marginTop: "8px",
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.6)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {track.description}
                    </div>
                  )}
                </div>
                
                {/* Track action buttons */}
                <div style={{ 
                  display: "flex", 
                  gap: "8px",
                  alignItems: "center"
                }}>
                  {/* View lyrics button */}
                  {track.lyrics && onViewLyrics && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Select the track before viewing lyrics
                        if (!isSelected) {
                          onSelectTrack(track.id);
                        }
                        onViewLyrics(track.id);
                      }}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        width: "34px",
                        height: "34px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "white"
                      }}
                    >
                      <i className="fas fa-file-alt" style={{ fontSize: "14px" }}></i>
                    </button>
                  )}
                  
                  {/* Play/pause button - Updated with disco pink gradient for BOTH selected and playing tracks */}
                  <button
                    onClick={handlePlayTrack}
                    style={{
                      background: isCurrentlyPlaying || isSelected ? 
                        "linear-gradient(135deg, #ff00cc, #3333ff)" : 
                        "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "50%",
                      width: "34px",
                      height: "34px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "white",
                      boxShadow: isCurrentlyPlaying || isSelected ? 
                        "0 0 10px rgba(255, 0, 204, 0.5)" : 
                        "none"
                    }}
                  >
                    <i className={isCurrentlyPlaying ? "fas fa-pause" : "fas fa-play"} style={{ fontSize: "14px" }}></i>
                  </button>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => onDeleteTrack(track.id, e)}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "50%",
                      width: "34px",
                      height: "34px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#ff4466"
                    }}
                  >
                    <i className="fas fa-trash" style={{ fontSize: "14px" }}></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div 
      style={{
        position: "fixed",
        bottom: visible ? "0" : "-100%",
        left: 0,
        width: "100%",
        height: "85%", // Make it partial screen height
        background: "rgba(18, 18, 18, 0.95)",
        zIndex: 25, // Higher than bottom panel
        display: "flex",
        flexDirection: "column",
        color: "white",
        transition: "bottom 0.3s ease-out",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        boxShadow: "0 -5px 20px rgba(0,0,0,0.5)"
      }}
      className="track-selection-panel"
    >
      {/* Panel header with drag handle */}
      <div style={{
        padding: "8px 0",
        display: "flex",
        justifyContent: "center",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        background: "linear-gradient(to right, rgba(36,14,50,1) 0%, rgba(18,18,18,1) 100%)"
      }}>
        <div style={{
          width: "40px",
          height: "5px",
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: "3px"
        }}></div>
      </div>
      
      {/* Panel title with close button */}
      <div style={{
        padding: "15px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        background: "linear-gradient(to right, rgba(36,14,50,0.8) 0%, rgba(18,18,18,0.8) 100%)"
      }}>
        <h2 style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: "bold",
          background: "linear-gradient(to right, #ff9900, #ff00ff)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}>
          Browse Karaoke Tracks
        </h2>
        
        {/* Close button for track panel */}
        <button 
          className="pink-arrow-button"
          onClick={onClose}
          style={{
            width: "40px",
            height: "40px",
            fontSize: "18px"
          }}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>
      
      {/* Search bar */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onUploadClick={onUploadClick}
      />
      
      {/* Category tabs */}
      <CategoryTabs 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      
      {/* Coming Soon Banner */}
      <div style={{padding: "10px 20px 0 20px"}}>
        <ComingSoonBanner />
      </div>
      
      {/* Enhanced Track List */}
      {tracks.length === 0 ? (
        <TrackList 
          tracks={tracks}
          selectedTrack={selectedTrack}
          isPlaying={isPlaying}
          onSelectTrack={onSelectTrack}
          onTogglePlay={onTogglePlay}
          onDeleteTrack={onDeleteTrack}
          onUploadClick={onUploadClick}
          onViewLyrics={onViewLyrics}
        />
      ) : enhancedTrackList}

      {/* Track controls with updated styling */}
      <TrackControls 
        selectedTrack={selectedTrack}
        isPlaying={isPlaying === selectedTrack}
        onTogglePlay={onToggleSelectedTrack}
        onNextTrack={onNextTrack}
        onPreviousTrack={onPreviousTrack}
        onFastForward={onFastForward}
        onRewind={onRewind}
        onRestart={onRestart}
      />
    </div>
  );
}
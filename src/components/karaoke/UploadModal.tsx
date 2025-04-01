// src/components/karaoke/UploadModal.tsx
"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faInfo, faEdit } from '@fortawesome/free-solid-svg-icons';

interface UploadModalProps {
  visible: boolean;
  uploadFile: File | null;
  uploadUserName: string;
  uploadSongTitle: string;
  uploadDescription: string;
  uploadCategory: string;
  hasSongVersion: boolean;
  uploadLyrics: string;
  isUploading: boolean;
  categories: string[];
  onClose: () => void;
  onUserNameChange: (name: string) => void;
  onSongTitleChange: (title: string) => void;
  onDescriptionChange: (desc: string) => void;
  onCategoryChange: (category: string) => void;
  onHasSongVersionChange: (has: boolean) => void;
  onLyricsChange: (lyrics: string) => void;
  onUpload: () => void;
  onComingSoon: () => void;
}

export default function UploadModal({
  visible,
  uploadFile,
  uploadUserName,
  uploadSongTitle,
  uploadDescription,
  uploadCategory,
  hasSongVersion,
  uploadLyrics,
  isUploading,
  categories,
  onClose,
  onUserNameChange,
  onSongTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onHasSongVersionChange,
  onLyricsChange,
  onUpload,
  onComingSoon
}: UploadModalProps) {
  const [showLyricsInfo, setShowLyricsInfo] = useState(false);
  
  if (!visible) return null;

  // Helper function to format example lyrics
  const getTimedLyricsExample = () => {
    return "[00:00.00] Song Title - Artist Name\n[00:10.50] First line of the lyrics\n[00:15.20] Second line of the lyrics";
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '500px',
        background: 'linear-gradient(to bottom, rgba(36,14,50,1) 0%, rgba(18,18,18,1) 100%)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{
          fontSize: '20px',
          margin: '0 0 20px 0',
          color: 'white',
          textAlign: 'center',
          background: 'linear-gradient(to right, #ff9900, #ff00ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Upload Track
        </h3>
        
        <div style={{
          marginBottom: '15px',
          background: 'linear-gradient(135deg, rgba(255,0,204,0.1), rgba(0,102,255,0.1))',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: '0 0 5px 0',
            color: 'white',
            fontWeight: 'bold'
          }}>
            Upload Karaoke Track
          </p>
          <p style={{ 
            margin: '0',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '13px'
          }}>
            Upload songs for karaoke - both vocals and instrumentals welcome!
          </p>
        </div>
        
        <div style={{
          marginBottom: '20px'
        }}>
          <p style={{ 
            margin: '0 0 5px 0',
            color: 'rgba(255,255,255,0.7)'
          }}>
            Selected file: <span style={{ color: 'white' }}>{uploadFile?.name}</span>
          </p>
        </div>

        {/* User name input */}
        <div style={{
          marginBottom: '15px'
        }}>
          <p style={{ 
            margin: '0 0 5px 0',
            color: 'rgba(255,255,255,0.7)'
          }}>
            Artist name:
          </p>
          <input
            type="text"
            value={uploadUserName}
            onChange={(e) => onUserNameChange(e.target.value)}
            placeholder="Enter artist name"
            style={{
              width: '100%',
              padding: '10px 15px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Song title input */}
        <div style={{
          marginBottom: '15px'
        }}>
          <p style={{ 
            margin: '0 0 5px 0',
            color: 'rgba(255,255,255,0.7)'
          }}>
            Song title:
          </p>
          <input
            type="text"
            value={uploadSongTitle}
            onChange={(e) => onSongTitleChange(e.target.value)}
            placeholder="Enter song title"
            style={{
              width: '100%',
              padding: '10px 15px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Description input */}
        <div style={{
          marginBottom: '15px'
        }}>
          <p style={{ 
            margin: '0 0 5px 0',
            color: 'rgba(255,255,255,0.7)'
          }}>
            Description:
          </p>
          <input
            type="text"
            value={uploadDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Add a short description (optional)"
            style={{
              width: '100%',
              padding: '10px 15px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px'
            }}
            maxLength={100}
          />
        </div>

        {/* Track Type Selection */}
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <input
            type="checkbox"
            id="hasSongVersion"
            checked={hasSongVersion}
            onChange={(e) => onHasSongVersionChange(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <label 
            htmlFor="hasSongVersion"
            style={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            This is an instrumental track (no vocals)
          </label>
        </div>

        {/* Lyrics input with info toggle */}
        <div style={{
          marginBottom: '20px'
        }}>
          <p style={{ 
            margin: '0 0 5px 0',
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Lyrics:</span>
            <button
              onClick={() => setShowLyricsInfo(!showLyricsInfo)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '12px',
                textDecoration: 'underline',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FontAwesomeIcon icon={faInfo} size="sm" />
              {showLyricsInfo ? 'Hide info' : 'Format info'}
            </button>
          </p>
          
          {showLyricsInfo && (
            <div style={{
              padding: '10px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              marginBottom: '10px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                For synchronized lyrics, use this format:
              </p>
              <pre style={{ 
                margin: '0', 
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.4)',
                padding: '5px',
                borderRadius: '4px'
              }}>
                {getTimedLyricsExample()}
              </pre>
              <p style={{ margin: '8px 0 0 0' }}>
                Timestamps [mm:ss.ms] will sync lyrics with music playback.
              </p>
            </div>
          )}
          
          <textarea
            value={uploadLyrics}
            onChange={(e) => onLyricsChange(e.target.value)}
            placeholder="Paste or type lyrics here (optional)"
            style={{
              width: '100%',
              height: '120px',
              padding: '10px 15px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'monospace'
            }}
          />
        </div>
        
        <div style={{
          marginBottom: '20px'
        }}>
          <p style={{ 
            margin: '0 0 10px 0',
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Select category:</span>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)'
            }}>
              (Track will also appear in "My Tracks")
            </span>
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {categories
              .filter(cat => cat !== "All" && cat !== "My Tracks")
              .map(category => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '20px',
                    background: uploadCategory === category
                      ? 'linear-gradient(135deg, rgba(255,0,204,0.3), rgba(51,51,255,0.3))'
                      : 'rgba(255,255,255,0.1)',
                    border: uploadCategory === category
                      ? '1px solid rgba(255,0,204,0.5)'
                      : '1px solid rgba(255,255,255,0.1)',
                    color: uploadCategory === category ? 'white' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
            disabled={isUploading}
          >
            Cancel
          </button>
          
          <button
            onClick={onUpload}
            style={{
              padding: '10px 25px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ff00cc, #660066)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUpload} />
                <span>Upload Track</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
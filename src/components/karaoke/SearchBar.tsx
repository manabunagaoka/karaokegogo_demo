// src/components/karaoke/SearchBar.tsx
"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUpload } from '@fortawesome/free-solid-svg-icons';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onUploadClick
}: SearchBarProps) {
  return (
    <div style={{
      padding: "15px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(0,0,0,0.3)"
    }}>
      <div style={{
        position: "relative",
        width: "60%"
      }}>
        <input 
          type="text"
          placeholder="Search for tracks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 15px 8px 35px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255,255,255,0.15)",
            color: "white",
            fontSize: "14px"
          }}
        />
        <span style={{ position: "absolute", left: "12px", top: "10px", color: "rgba(255,255,255,0.5)" }}>
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
      <button 
        style={{
          background: "rgba(255,0,204,0.2)",
          border: "1px solid #ff00cc",
          borderRadius: "20px",
          padding: "8px 15px",
          color: "#ff66cc",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer"
        }}
        onClick={onUploadClick}
      >
        <FontAwesomeIcon icon={faUpload} />
        <span>Upload Track</span>
      </button>
    </div>
  );
}
// src/components/ui/ComingSoonBanner.tsx
"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function ComingSoonBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,0,204,0.15), rgba(0,102,255,0.15))',
      border: '1px dashed rgba(255,0,204,0.4)',
      borderRadius: '8px',
      padding: '15px',
      marginTop: '15px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
      <FontAwesomeIcon 
        icon={faInfoCircle} 
        style={{ 
          fontSize: '24px',
          color: '#ff66cc' 
        }} 
      />
      <div>
        <h3 style={{ 
          margin: '0 0 5px 0', 
          fontSize: '16px',
          color: '#ff66cc'
        }}>
          Recording Features Coming Soon!
        </h3>
        <p style={{ 
          margin: '0',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.8)'
        }}>
          Karaoke recording functionality is currently under development. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
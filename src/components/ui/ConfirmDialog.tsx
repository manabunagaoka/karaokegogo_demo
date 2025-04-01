// src/components/ui/ConfirmDialog.tsx
"use client";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ visible, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!visible) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1100
    }}>
      <div style={{
        width: '90%',
        maxWidth: '320px',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>{title}</h3>
        <p style={{ margin: '0 0 20px 0', color: 'rgba(255,255,255,0.8)' }}>{message}</p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,51,51,0.8)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
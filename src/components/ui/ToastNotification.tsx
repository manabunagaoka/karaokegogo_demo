// src/components/ui/ToastNotification.tsx
"use client";

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function ToastNotification({ visible, message, type }: ToastProps) {
  if (!visible) return null;
  
  const bgColor = type === 'success' ? 'rgba(51,204,51,0.9)' : 
                type === 'error' ? 'rgba(255,51,51,0.9)' : 
                'rgba(0,153,255,0.9)';
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '160px', // Above bottom panel
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: bgColor,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 1000,
      maxWidth: '90%',
      textAlign: 'center',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {message}
    </div>
  );
}
import React, { useEffect } from 'react';

const FullScreenModal = ({ isOpen, onClose, meetingLink }:any) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 99999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

    }}>
      <div style={{
        position: 'relative',
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
      }}>
        <button className='text-red-500 hover:text-red-700 cursor-pointer font-bold bg-white rounded-2xl' onClick={onClose} style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1001,
          padding: '8px 12px',
          fontSize: '16px',
          cursor: 'pointer',
        }}>
          Close
        </button>
        <iframe
          src={meetingLink}
          title="Meeting"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allow="camera; microphone; fullscreen"
        />
      </div>
    </div>
  );
};

export default FullScreenModal;

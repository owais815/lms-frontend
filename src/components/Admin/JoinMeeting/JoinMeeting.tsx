import React, { useState, useEffect } from 'react';
import { MEETING_URL } from '../../../api/axios';

export const JoinMeeting = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.open(`${MEETING_URL}`, '_blank');
  });

  if (loading) {
    return <div>Preparing your meeting...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
    
    </div>
  );
};
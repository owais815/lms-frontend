// AppContent.js
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MainRouting from './Routing/Main';
import { useSocket } from './components/Generic/SocketContext';
import NotificationModal from './components/Generic/Notifications';

const AppContent = () => {
  const { emitUserConnected }:any = useSocket();
  const hasEmittedRef:any = useRef(false);
  // Access Redux state for authenticated user
  const userId = useSelector((state:any) => state.auth.userId);
  const userType = useSelector((state:any) => state.auth.userType);

   const handleVisibilityChange = () => {
     if (document.visibilityState === 'visible' && emitUserConnected && userId && userType) {
       emitUserConnected(userId, userType);
       hasEmittedRef.current = true;
     }
   };
 
   useEffect(() => {
     // Emit connection on initial load
     if (emitUserConnected && userId && userType && !hasEmittedRef.current) {
       emitUserConnected(userId, userType);
       hasEmittedRef.current = true;
     }
 
     // Add visibility change listener
     document.addEventListener('visibilitychange', handleVisibilityChange);
 
     // Cleanup listener on unmount
     return () => {
       document.removeEventListener('visibilitychange', handleVisibilityChange);
     };
   }, [userId, userType, emitUserConnected]);

   return (
    <>
      <MainRouting />
      <NotificationModal />
    </>
  );
};

export default AppContent;

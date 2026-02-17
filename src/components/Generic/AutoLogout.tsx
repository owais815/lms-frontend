import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../redux/Slices/AuthSlice';

export const AutoLogoutComponent = () => {
  const timeoutRef:any = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Set timeout for 30 minutes (30 * 60 * 1000 ms)
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000);
  };

  const handleLogout = () => {
    // Add logout logic, e.g., clearing tokens and redirecting to login
    dispatch(authActions.logout());
    navigate('/');
    console.log('User is being logged out due to inactivity.');
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    resetTimer(); // Initialize timer on mount

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return <></>;
};

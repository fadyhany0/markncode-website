import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCodeProtection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) || // Ctrl+U
        (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'J')) || // Ctrl+Shift+J
        (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) || // Ctrl+Shift+C
        (e.key === 'F12') // F12
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Store the current path before reload
      sessionStorage.setItem('lastPath', window.location.pathname);
    };

    const handleLoad = () => {
      // Check if this is a reload
      const lastPath = sessionStorage.getItem('lastPath');
      if (lastPath && lastPath !== '/home') {
        navigate('/home');
      }
      // Clear the stored path
      sessionStorage.removeItem('lastPath');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [navigate]);
}; 
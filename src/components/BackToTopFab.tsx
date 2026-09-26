import React, { useState, useEffect } from 'react';
import { Fab, Zoom, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUpRounded';

const BackToTopFab: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={visible}>
      <Tooltip title="Back to top" placement="left" arrow>
        <Fab
          onClick={scrollToTop}
          size="medium"
          aria-label="Scroll back to top"
          sx={{
            position: 'fixed',
            bottom: { xs: 24, md: 32 },
            right: { xs: 20, md: 32 },
            zIndex: 999,
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              boxShadow: '0 12px 28px rgba(37, 99, 235, 0.6)',
              transform: 'translateY(-4px) scale(1.05)',
            },
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

export default BackToTopFab;

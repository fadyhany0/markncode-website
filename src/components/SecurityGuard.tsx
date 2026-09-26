import React, { useEffect, useState } from 'react';
import { Box, Snackbar, Alert, Typography } from '@mui/material';
import ShieldIcon from '@mui/icons-material/SecurityRounded';
import { initSecurityShield, SecurityEventDetail } from '../services/securityShield';

export const SecurityGuard: React.FC = () => {
  const [violationToast, setViolationToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  useEffect(() => {
    // 1. Initialize global security event listeners and protection hooks
    initSecurityShield();

    // 2. Listen to internal security violation events
    const handleViolation = (e: Event) => {
      const customEvent = e as CustomEvent<SecurityEventDetail>;
      const message = customEvent.detail?.message || 'تم حظر الإجراء لدواعي الأمان والحماية 🔒';
      setViolationToast({ open: true, message });
    };

    window.addEventListener('mnc_security_violation', handleViolation);
    return () => {
      window.removeEventListener('mnc_security_violation', handleViolation);
    };
  }, []);

  const handleCloseToast = () => {
    setViolationToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <Snackbar
      open={violationToast.open}
      autoHideDuration={3000}
      onClose={handleCloseToast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ zIndex: 99999 }}
    >
      <Alert
        onClose={handleCloseToast}
        severity="warning"
        icon={<ShieldIcon sx={{ color: '#38bdf8', fontSize: 24 }} />}
        sx={{
          bgcolor: 'rgba(15, 23, 42, 0.95)',
          color: '#ffffff',
          border: '1.5px solid rgba(56, 189, 248, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.25)',
          backdropFilter: 'blur(16px)',
          fontWeight: 700,
          fontSize: '0.92rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2.5,
          py: 1.2,
          '& .MuiAlert-icon': {
            mr: 1.5,
          },
          '& .MuiAlert-action': {
            color: '#cbd5e1',
          },
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#38bdf8' }}>
            نظام الحماية والأمان نشط 🛡️
          </Typography>
          <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
            {violationToast.message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default SecurityGuard;

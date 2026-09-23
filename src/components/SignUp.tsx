import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCodeProtection } from '../hooks/useCodeProtection';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SparklesIcon from '@mui/icons-material/AutoAwesomeRounded';
import { motion } from 'framer-motion';

// Official Multi-Colored Google SVG Icon
const GoogleSvgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const SignUp: React.FC = () => {
  useCodeProtection();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (error) setError('');
    if (newEmail && !validateEmail(newEmail)) {
      setError('Please enter a valid email address');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      if (!name.trim()) {
        setError('Full name is required');
        setLoading(false);
        return;
      }

      if (!email) {
        setError('Email address is required');
        setLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (!password) {
        setError('Password is required');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      await signUp(email, password, name.trim());
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && 
          err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Failed to sign up with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 74px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 5, md: 8 },
        px: 2,
        background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 50%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '12%',
          right: '8%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '8%',
          left: '8%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, sm: 5 },
              borderRadius: '28px',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
            }}
          >
            {/* Header / Brand */}
            <Box sx={{ textAlign: 'center', mb: 3.5 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  px: 2,
                  py: 0.6,
                  borderRadius: '50px',
                  bgcolor: 'rgba(37, 99, 235, 0.08)',
                  color: '#2563eb',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                <SparklesIcon sx={{ fontSize: 16 }} />
                <span>MarknCode Agency</span>
              </Box>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.75rem', sm: '2.1rem' },
                  mb: 1,
                }}
              >
                Create Your Account
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.95rem' }}>
                Join MarknCode Agency to elevate your digital presence
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '14px',
                    border: '1px solid #fecaca',
                    fontSize: '0.9rem',
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Quick Google Sign Up */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignUp}
              disabled={loading}
              sx={{
                py: 1.25,
                borderRadius: '14px',
                borderColor: '#e2e8f0',
                bgcolor: '#ffffff',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f8fafc',
                  borderColor: '#cbd5e1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <GoogleSvgIcon />
              Sign up with Google
            </Button>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Divider sx={{ flexGrow: 1, borderColor: '#e2e8f0' }} />
              <Typography 
                variant="caption" 
                sx={{ 
                  mx: 2, 
                  color: '#94a3b8', 
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                }}
              >
                or register with email
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: '#e2e8f0' }} />
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.8 }}>
                  Full Name
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '14px',
                      bgcolor: '#f8fafc',
                      '& fieldset': { borderColor: '#e2e8f0' },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.8 }}>
                  Email Address
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '14px',
                      bgcolor: '#f8fafc',
                      '& fieldset': { borderColor: '#e2e8f0' },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.8 }}>
                  Password
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#94a3b8' }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '14px',
                      bgcolor: '#f8fafc',
                      '& fieldset': { borderColor: '#e2e8f0' },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                  }}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={!loading && <ArrowForwardRoundedIcon />}
                sx={{
                  py: 1.4,
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.45)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>

            {/* Bottom Row - Clean, Centered, No Overlap */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Already have an account?
              </Typography>
              <Typography
                component={RouterLink}
                to="/signin"
                variant="body2"
                sx={{
                  color: '#2563eb',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#1d4ed8',
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignUp;
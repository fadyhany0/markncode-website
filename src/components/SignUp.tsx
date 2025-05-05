import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Grid,
  Avatar,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import { motion } from 'framer-motion';
import { useCodeProtection } from '../hooks/useCodeProtection';
import { useTheme } from '@mui/material/styles';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useCodeProtection();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (error) {
      setError('');
    }
    
    if (newEmail && !validateEmail(newEmail)) {
      setError('Please enter a valid email address (e.g., example@domain.com)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      if (!name) {
        setError('Name is required');
        setLoading(false);
        return;
      }

      if (!email) {
        setError('Email is required');
        setLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address (e.g., example@domain.com)');
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

    await signUp(email, password, name);
    } catch (err: any) {
      setError(err.message);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            }}
              >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                  <PersonAddOutlinedIcon />
                </Avatar>
            <Typography component="h1" variant="h5">
                  Sign Up
                </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                error={!!error && error.includes('name')}
                helperText={error && error.includes('name') ? error : ''}
                disabled={loading}
              />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                onChange={handleEmailChange}
                error={!!error && error.includes('email')}
                helperText={error && error.includes('email') ? error : ''}
                disabled={loading}
              />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                error={!!error && error.includes('password')}
                helperText={error && error.includes('password') ? error : ''}
                disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
              />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                  </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Divider sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
                    OR
                  </Typography>
                <Divider sx={{ flexGrow: 1 }} />
                </Box>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                onClick={handleGoogleSignUp}
                disabled={loading}
                    sx={{
                      mb: 2,
                  backgroundColor: '#fff',
                      '&:hover': {
                    backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    Continue with Google
                  </Button>

                  <Grid container justifyContent="center">
                    <Grid item>
                  <Link href="/signin" variant="body2">
                        Already have an account? Sign In
                      </Link>
                    </Grid>
                  </Grid>
              </Box>
            </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default SignUp; 
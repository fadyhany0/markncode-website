import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  useTheme,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Avatar,
  Chip,
  CircularProgress,
  Tooltip,
  alpha
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from '@firebase/auth';
import { auth } from '../firebase';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  email: string;
  name: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  location?: string;
  language?: string;
}

interface FormState {
  password: string;
  newPassword: string;
  confirmPassword: string;
  email: string;
  name: string;
  phone: string;
  birthday: string;
  gender: string;
  location: string;
  language: string;
}

interface FormErrors {
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
  email?: string;
  name?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  location?: string;
  language?: string;
}

// Components
const ProfileHeader: React.FC<{ user: any }> = ({ user }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        mb: { xs: 4, sm: 5, md: 6 }, 
        gap: { xs: 2, sm: 3, md: 4 },
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2,
        background: '#fff',
        boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
      }}
    >
      <Avatar
        sx={{
          width: { xs: 80, sm: 88, md: 96 },
          height: { xs: 80, sm: 88, md: 96 },
          background: '#4285f4',
          fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
          border: '2px solid #fff',
        }}
      >
        {user?.name?.[0] || user?.email?.[0] || 'U'}
      </Avatar>
      <Box sx={{ 
        flex: 1,
        textAlign: { xs: 'center', sm: 'left' },
        width: '100%'
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 400,
            color: '#202124',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
          }}
        >
          {user?.name || user?.email}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          <Chip
            icon={<SecurityIcon />}
            label="Google Account"
            size="small"
            sx={{ 
              background: '#e8f0fe',
              color: '#1a73e8',
              border: 'none',
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 24, sm: 28 },
              '& .MuiChip-icon': {
                color: '#1a73e8',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }
            }}
          />
          <Chip
            icon={<EmailIcon />}
            label={user?.email}
            size="small"
            sx={{ 
              background: '#f1f3f4',
              color: '#5f6368',
              border: 'none',
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 24, sm: 28 },
              '& .MuiChip-icon': {
                color: '#5f6368',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const PasswordForm: React.FC<{
  onSubmit: (data: { password: string; newPassword: string; confirmPassword: string }) => Promise<void>;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!formData.password) newErrors.password = 'Enter your current password';
    if (!formData.newPassword) newErrors.newPassword = 'Enter your new password';
    if (formData.newPassword.length < 8) newErrors.newPassword = 'Use 8 or more characters';
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Those passwords didn\'t match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        background: '#fff',
        border: '1px solid #dadce0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e8f0fe',
          }}
        >
          <LockIcon sx={{ color: '#1a73e8', fontSize: 24 }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500,
            color: '#202124',
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
          }}
        >
          Change password
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Current password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          margin="normal"
          required
          error={!!errors.password}
          helperText={errors.password}
          sx={{ mb: 3 }}
          InputProps={{
            sx: {
              borderRadius: 1,
              background: '#fff',
            },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type={showNewPassword ? 'text' : 'password'}
          label="New password"
          value={formData.newPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
          margin="normal"
          required
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          sx={{ mb: 3 }}
          InputProps={{
            sx: {
              borderRadius: 1,
              background: '#fff',
            },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={showNewPassword ? "Hide password" : "Show password"}>
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm new password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          margin="normal"
          required
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          sx={{ mb: 4 }}
          InputProps={{
            sx: {
              borderRadius: 1,
              background: '#fff',
            },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={showConfirmPassword ? "Hide password" : "Show password"}>
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ 
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            fontSize: '0.875rem',
            background: '#1a73e8',
            '&:hover': {
              background: '#1557b0',
            }
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Change password'}
        </Button>
      </form>
    </Paper>
  );
};

const UserInfoForm: React.FC<{
  onSubmit: (data: UserProfile) => Promise<void>;
  isLoading: boolean;
  initialData: UserProfile;
}> = ({ onSubmit, isLoading, initialData }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!formData.name) newErrors.name = 'Enter your name';
    if (!formData.email) newErrors.email = 'Enter your email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (formData.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(formData.birthday)) {
      newErrors.birthday = 'Enter a valid date (YYYY-MM-DD)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        background: '#fff',
        border: '1px solid #dadce0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e8f0fe',
          }}
        >
          <AccountCircleIcon sx={{ color: '#1a73e8', fontSize: 24 }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500,
            color: '#202124',
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
          }}
        >
          Personal info
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  background: '#fff',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  background: '#fff',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  background: '#fff',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Birthday"
              value={formData.birthday}
              onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
              margin="normal"
              error={!!errors.birthday}
              helperText={errors.birthday}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  background: '#fff',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              margin="normal"
              SelectProps={{
                native: true,
              }}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  background: '#fff',
                },
              }}
            >
              <option value="">Not specified</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              margin="normal"
              InputProps={{
                sx: {
                  borderRadius: 1,
                  background: '#fff',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ color: '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Language"
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              margin="normal"
              SelectProps={{
                native: true,
              }}
              InputProps={{
                sx: {
                  borderRadius: 1,
                  background: '#fff',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon sx={{ color: '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ 
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              background: '#1a73e8',
              '&:hover': {
                background: '#1557b0',
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save changes'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle page reload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      sessionStorage.setItem('lastPath', window.location.pathname);
    };

    const handleLoad = () => {
      const lastPath = sessionStorage.getItem('lastPath');
      if (lastPath && lastPath === '/dashboard') {
        navigate('/home');
      }
      sessionStorage.removeItem('lastPath');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

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

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [navigate]);

  const handlePasswordChange = async (data: { password: string; newPassword: string; confirmPassword: string }) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.email) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          data.password
        );
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, data.newPassword);
        setSuccess('Password changed successfully');
      }
    } catch (err: any) {
      setError('Couldn\'t change your password. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoUpdate = async (data: UserProfile) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        if (data.email !== user?.email) {
          await updateEmail(currentUser, data.email);
        }
        // Note: You'll need to implement a function to update the other fields in your database
        setSuccess('Changes saved');
      }
    } catch (err: any) {
      setError('Couldn\'t save your changes. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = (): UserProfile => {
    return {
      email: user?.email || '',
      name: user?.name || '',
      phone: '',
      birthday: '',
      gender: '',
      location: '',
      language: 'en'
    };
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 },
        background: '#f8f9fa',
      }}
    >
      <Container maxWidth="lg">
        <ProfileHeader user={user} />

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                background: '#fff',
                boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Box
                    sx={{
                      width: { xs: 32, sm: 36, md: 40 },
                      height: { xs: 32, sm: 36, md: 40 },
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#e8f0fe',
                    }}
                  >
                    <SettingsIcon sx={{ color: '#1a73e8', fontSize: { xs: 20, sm: 22, md: 24 } }} />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 500,
                      color: '#202124',
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                      fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
                    }}
                  >
                    Account settings
                  </Typography>
                </Box>
                
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                  <Grid item xs={12} md={6}>
                    <PasswordForm onSubmit={handlePasswordChange} isLoading={isLoading} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <UserInfoForm 
                      onSubmit={handleInfoUpdate} 
                      isLoading={isLoading} 
                      initialData={getUserProfile()} 
                    />
                  </Grid>
                </Grid>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: { xs: 2, sm: 3, md: 4 },
                      borderRadius: 1,
                      background: '#fce8e6',
                      border: '1px solid #fad2cf',
                      color: '#c5221f',
                      '& .MuiAlert-icon': {
                        color: '#c5221f',
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mt: { xs: 2, sm: 3, md: 4 },
                      borderRadius: 1,
                      background: '#e6f4ea',
                      border: '1px solid #b7e1cd',
                      color: '#137333',
                      '& .MuiAlert-icon': {
                        color: '#137333',
                      }
                    }}
                  >
                    {success}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 